CREATE TABLE IF NOT EXISTS smjer(
    id smallint unsigned PRIMARY KEY AUTO_INCREMENT,
    naziv varchar(50) UNIQUE NOT NULL,
    trajanje tinyint unsigned NOT NULL,
    CHECK (trajanje >= 1 AND trajanje <= 6)
);

CREATE TABLE IF NOT EXISTS predmet(
    id smallint unsigned PRIMARY KEY AUTO_INCREMENT,
    naziv varchar(50) UNIQUE NOT NULL,
    semestar tinyint unsigned NOT NULL,
    ects tinyint unsigned NOT NULL,
    potrebna_prisutnost tinyint unsigned NOT NULL,
    smjer smallint unsigned NOT NULL,
    FOREIGN KEY (smjer) REFERENCES smjer(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK (semestar >= 1 AND semestar <= 6),
    CHECK (ects >= 0 AND ects <= 30),
    CHECK (potrebna_prisutnost >= 0 AND potrebna_prisutnost <= 15)
);

CREATE TABLE IF NOT EXISTS student(
    jmbag char(10) PRIMARY KEY,
    ime varchar(50) NOT NULL,
    prezime varchar(50) NOT NULL,
    oib char(11) UNIQUE NOT NULL,
    email varchar(50) UNIQUE NOT NULL,
    mobitel varchar(15) UNIQUE NOT NULL,
    godina_upisa smallint unsigned NOT NULL,
    status enum('redovan', 'izvanredan', 'ispisan') NOT NULL,
    smjer smallint unsigned NOT NULL,
    FOREIGN KEY (smjer) REFERENCES smjer(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS student_predmet(
    id int unsigned PRIMARY KEY AUTO_INCREMENT,
    predmet_id smallint unsigned NOT NULL,
    jmbag char(10) NOT NULL,
    FOREIGN KEY (predmet_id) REFERENCES predmet(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (jmbag) REFERENCES student(jmbag) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE (predmet_id, jmbag)
);

CREATE TABLE IF NOT EXISTS prisutnost(
    stud_predmet int unsigned,
    datum date DEFAULT (CURRENT_DATE),
    PRIMARY KEY (stud_predmet, datum),
    FOREIGN KEY (stud_predmet) REFERENCES student_predmet(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE (stud_predmet, datum)
);

CREATE TABLE IF NOT EXISTS ocjena(
    stud_predmet int unsigned PRIMARY KEY,
    ocjena tinyint unsigned NOT NULL,
    komentar mediumtext,
    FOREIGN KEY (stud_predmet) REFERENCES student_predmet(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK (ocjena >= 1 AND ocjena <= 5)
);
