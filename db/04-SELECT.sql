-- 1. Popis svih studenata
SELECT st.ime, st.prezime, st.jmbag, st.oib, st.email, st.mobitel, st.status, sm.naziv AS smjer
FROM student st
JOIN smjer sm ON st.smjer = sm.id
ORDER BY st.prezime;

-- 2. Pretrazi student po jmbagu
SELECT st.ime, st.prezime, st.jmbag, st.oib, st.email, st.mobitel, st.status, sm.naziv AS smjer
FROM student st
JOIN smjer sm ON st.smjer = sm.id
WHERE st.jmbag = '0246801239'
ORDER BY st.prezime;

-- 3. Prikazi sve predmete koje je student upisao
SELECT s.ime, s.prezime, p.naziv AS predmet, p.semestar
FROM student s
JOIN student_predmet sp ON s.jmbag = sp.jmbag
JOIN predmet p ON p.id = sp.predmet_id
WHERE s.jmbag = '0246801234'
ORDER BY p.semestar, p.naziv;

-- 4. Prikazi sve predmete koje je student polozio
SELECT s.ime, s.prezime, p.naziv AS predmet, o.ocjena
FROM student s
JOIN student_predmet sp ON s.jmbag = sp.jmbag
JOIN predmet p ON p.id = sp.predmet_id
JOIN ocjena o ON o.stud_predmet = sp.id
WHERE s.jmbag = '0246801234'
ORDER BY p.naziv;

-- 5. Prikazi sve studente (koji su polozili barem 1 predmet), zajedno s ukupnim brojem ostvarenih ects bodova
SELECT s.jmbag, s.ime, s.prezime, SUM(p.ects) AS 'Ostvareni bodovi'
FROM student s
JOIN student_predmet sp ON s.jmbag = sp.jmbag
JOIN predmet p ON sp.predmet_id = p.id
JOIN ocjena o ON sp.id = o.stud_predmet
GROUP BY s.jmbag, s.ime, s.prezime
ORDER BY SUM(p.ects) DESC, s.prezime, s.ime;
