---
title: SQL injekcija
---

# SQL Injekcija

## Osnovno o temi

SQL injekcija je jedan od najopasnijih i najčešćih sigurnosnih rizika u web aplikacijama. Radi se o napadu u kojem napadač može koristiti polja za korisnički unos, poput formi, za unos zlonamjernog SQL koda koji će se izvršiti na bazi podataka.

Ako imamo neku formu za pretraživanje svih studenata s nekim imenom, tipičan SQL upit koji se izvršava na bazi podataka izgledao bi ovako:

```sql showLineNumbers=false
SELECT * FROM student WHERE ime = 'Karlo';
```

Ukoliko web aplikacija gradi upite dinamički, primjerice spajanjem stringova, i pri tome ne koristi odgovarajuće provjere, napadač može u polje za pretraživanje napisati na primjer `'Karlo'; DROP TABLE student; --`. Upit postaje:

```sql showLineNumbers=false
SELECT * FROM student WHERE ime = 'Karlo'; DROP TABLE student; --';
```

Da bi ovaj upit stvarno rezultirao brisanjem cijele tablice studenata, mnogo stvari se mora savršteno posložiti. Korisnički račun morao bi imati `DROP` privilegije, baza podataka mora podržavati izvršavanje više naredbi u jednom pozivu, primarni ključ tablice ne smije biti vanjski ključ na druge tablice s `ON DELETE RESTRICT` ograničenjem i tako dalje. Međutim, čak i kad brisanje tablice nije moguće, SQL injection i dalje predstavlja ozbiljan sigurnosni rizik. Napadači mogu pristupiti osjetljivim podacima kao što su OIB-ovi, zaobići autentifikaciju i dobiti admistratorske privilegije ili modificirati postojeće podatke.

Neke velike kompanije koje su bile žrtve SQL injection napada:
  - **Sony Pictures**: 2011 godine SQL injection napad rezultirao je krađom otprilike 77 milijuna PlayStation Network računa, ukupne štete oko 170 milijuna dolara
  - **Yahoo!**: Tvrtka je bila žrtva više napada između 2013 i 2016 godine, pri čemu je u najvećem napadu ukradeno preko pola milijuna email adresa i lozinka. Sveukupna šteta svih napada bila je preko 3 milijarde korisničkih računa.
  - **JPMorgan Chase**: JPMorgan Chase je jedna on nejvećih banka u Sjedinjenim Američkim državama. 2014 godine objavili su da su računi od preko 76 milijuna kućanstva kompromizirani. Ukradeni podaci uključuju imena, brojeve mobitle i email adrese korisnika, ali ne podatke vezane uz njihove financije.

 ## Što omogućuje SQL injekciju?

 Ukratko, loša arhitektura aplikacije. Polja za unos ne validiraju korisnički unos, aplikacija dinamički kreira SQL upite (povezivanje stringova), ne korištenje pripremljenih upita i tako dalje.

 Primjer upita s dinamičkim generiranjem SQL-a (**loše**):

```js title="upit.js" {"1. const jmbag simulira korisnički unos (npr. forma)":3-5} collapse={10-21, 23-28} 
async function POST({ request }) {
  try {

    const jmbag = "0246801234";
    const upit = "SELECT * FROM student WHERE jmbag = '" + jmbag + "'";

    const connection = await mysql.createConnection(dbConfig);
    const [rezultati] = await connection.execute(upit);
    await connection.end();

    if (rezultati.length === 0) {
      return new Response(JSON.stringify({ error: "Student nije pronađen" }), {
          status: 404,
          headers: { "Content-type": "application/json" }
        });
    }

    return new Response(JSON.stringify(rezultati), {
        status: 200,
        headers: { "Content-type": "application/json" }
      });
  } catch (error) {
    console.error("Error prilikom izvršavanja upita:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
  }
}
```

Rezultat ovog upita bio bi:

- **Jmbag**: 0246801234
- **Ime**: Marko
- **Prezime**: Marković
- **OIB**: 12345678901
- **Email**: marko.markovic@student.hr
- **Mobitel**: +385912345678
- **Godina upisa**: 2023
- **Status**: redovan
- **Smjer**: 1

Budući da se upit gradi povezivanjem stringova i pri tome se ne radi nikakva provjera unosa, ukoliko u polje za unos napišemo SQL kod, taj kod bi se poslao i izvršio na bazi podataka bez ikakvih pogrešaka. Ako u primjeru gore umjesto `const jmbag = "0246801234"` napišemo `const jmbag = "' OR '1'='1"`, kao rezultat dobili bi sve retke iz tablice `student`.

### Kako popraviti ovaj primjer?

Način na koji možemo poboljšati kod da spriječimo ovaj napad je zapravo vrlo jednostavan i može se napraviti za minutu ili dvije, korištenjem pripremljenih upita i osnovne provjere unosa. Pripremljeni upiti su gotovo jednaki u sintaksi kao i standardni upiti, međutim umjesto umetnutih vrijednosti (kao u gornjem primjeru), na mjestima za parametre koriste **placeholdere**.

Osnovna sintaksa za MySQL (na gornjem primjeru):

```sql showLineNumbers=false
SELECT * FROM student WHERE jmbag = ?;
```

Korištenje pripremljenih upita ima nekoliko prednosti:

1. Bolje performanse baze
2. Logika je odvojena od samih podataka
3. Podaci se tretiraju kao tekstualni tipovi, a ne kao dio sql koda (upisivanjem na primjer `' OR '1'='1`, baza podataka probala bi naći studenta koji doslovno ima jmbag `' OR '1'='1`).

Modificirani kod s pripremljenim upitom i osnovnom provjerom unosa:

```js title="upit.js" del={4, 13} add={5, 7-10, 14}
async function POST({ request }) {
  try {
    const jmbag = "0246801234";
    const upit = "SELECT * FROM student WHERE jmbag = '" + jmbag + "'";
    const upit = "SELECT * FROM student WHERE jmbag = ?";

    const regex = /^[0-9]{10}$/;
    if (!regex.test(jmbag)) {
      // Ako jmbag ne odgovara formatu, vraćamo grešku
    }

    const connection = await mysql.createConnection(dbConfig);
    const [rezultati] = await connection.execute(upit);
    const [rezultati] = await connection.execute(upit, [jmbag]);
    await connection.end();

    // Ostatak ostaje isti
```