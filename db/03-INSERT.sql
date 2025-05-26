INSERT INTO smjer (naziv, trajanje) VALUES
('Informatika', 3),
('Elektrotehnička', 4),
('Strojarstvo', 4),
('Građevinarstvo', 3),
('Ekonomija', 3),
('Mehatronika', 4);

INSERT INTO predmet (naziv, semestar, ects, potrebna_prisutnost, smjer) VALUES
('Programiranje 1', 1, 6, 10, 1),
('Matematika 1', 1, 8, 12, 1),
('Baze podataka', 3, 6, 8, 1),
('Web programiranje', 4, 5, 10, 1),
('Algoritmi i strukture podataka', 2, 7, 12, 1),
('Osnove elektrotehnike', 1, 6, 10, 2),
('Elektronika', 2, 7, 12, 2),
('Digitalna tehnika', 3, 6, 8, 2),
('Termodinamika', 1, 8, 15, 3),
('Mehanika fluida', 3, 6, 10, 3),
('Statika', 2, 7, 12, 4),
('Betonske konstrukcije', 4, 8, 10, 4),
('Mikroekonomija', 1, 6, 8, 5),
('Makroekonomija', 2, 6, 8, 5),
('Automatika', 3, 7, 12, 6);

INSERT INTO student (jmbag, ime, prezime, oib, email, mobitel, godina_upisa, status, smjer) VALUES
('0246801234', 'Marko', 'Marković', '12345678901', 'marko.markovic@student.hr', '+385912345678', 2023, 'redovan', 1),
('0246801235', 'Ana', 'Anić', '12345678902', 'ana.anic@student.hr', '+385912345679', 2023, 'redovan', 1),
('0246801236', 'Petar', 'Petrović', '12345678903', 'petar.petrovic@student.hr', '+385912345680', 2022, 'redovan', 2),
('0246801237', 'Maja', 'Majić', '12345678904', 'maja.majic@student.hr', '+385912345681', 2023, 'izvanredan', 2),
('0246801238', 'Luka', 'Lukić', '12345678905', 'luka.lukic@student.hr', '+385912345682', 2021, 'redovan', 3),
('0246801239', 'Petra', 'Horvat', '12345678906', 'petra.horvat@student.hr', '+385912345683', 2023, 'redovan', 4),
('0246801240', 'Tomislav', 'Tomić', '12345678907', 'tomislav.tomic@student.hr', '+385912345684', 2022, 'redovan', 5),
('0246801241', 'Ivana', 'Ivanović', '12345678908', 'ivana.ivanovic@student.hr', '+385912345685', 2023, 'ispisan', 1),
('0246801242', 'Josip', 'Josipović', '12345678909', 'josip.josipovic@student.hr', '+385912345686', 2022, 'redovan', 6),
('0246801243', 'Katarina', 'Katić', '12345678910', 'katarina.katic@student.hr', '+385912345687', 2023, 'redovan', 3);

INSERT INTO student_predmet (predmet_id, jmbag) VALUES
(1, '0246801234'), -- Marko - Programiranje 1
(2, '0246801234'), -- Marko - Matematika 1
(5, '0246801235'), -- Ana - Algoritmi i strukture podataka
(1, '0246801235'), -- Ana - Programiranje 1
(6, '0246801236'), -- Petar - Osnove elektrotehnike
(7, '0246801237'), -- Maja - Elektronika
(9, '0246801238'), -- Luka - Termodinamika
(11, '0246801239'), -- Petra - Statika
(13, '0246801240'), -- Tomislav - Mikroekonomija
(15, '0246801242'), -- Josip - Automatika
(10, '0246801243'), -- Katarina - Mehanika fluida
(3, '0246801234'), -- Marko - Baze podataka
(8, '0246801236'), -- Petar - Digitalna tehnika
(14, '0246801240'), -- Tomislav - Makroekonomija
(12, '0246801239'); -- Petra - Betonske konstrukcije

INSERT INTO prisutnost (stud_predmet, datum) VALUES
(1, '2024-10-15'),
(1, '2024-10-22'),
(1, '2024-10-29'),
(2, '2024-10-16'),
(2, '2024-10-23'),
(3, '2024-11-05'),
(4, '2024-10-17'),
(5, '2024-10-18'),
(6, '2024-10-19'),
(7, '2024-10-20'),
(8, '2024-10-21'),
(9, '2024-10-22'),
(10, '2024-10-23'),
(11, '2024-10-24'),
(12, '2024-11-01'),
(13, '2024-11-02'),
(14, '2024-11-03'),
(15, '2024-11-04');

INSERT INTO ocjena (stud_predmet, ocjena, komentar) VALUES
(1, 4, 'Dobar rad na projektnim zadacima, potrebno poboljšati teorijsko znanje.'),
(2, 5, 'Izvrsno poznavanje matematičkih koncepata i njihove primjene.'),
(3, 3, 'Zadovoljavajuće znanje algoritma, preporučujem dodatno vježbanje.'),
(4, 5, 'Odličan pristup programiranju, kreativna rješenja zadataka.'),
(5, 4, 'Solidno razumijevanje osnovnih električnih krugova.'),
(6, 3, 'Potrebno je više rada na praktičnim vježbama iz elektronike.'),
(7, 5, 'Izvrsno poznavanje termodinamičkih procesa i zakona.'),
(8, 4, 'Dobro razumijevanje statičkih proračuna konstrukcija.'),
(9, 4, 'Kvalitetno poznavanje mikroekonomskih teorija i modela.'),
(10, 3, 'Zadovoljavajuće znanje automatskih sustava upravljanja.');