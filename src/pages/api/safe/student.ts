import type { APIRoute } from "astro";
import { dbConfig } from "../dbconfig";
import mysql, { type RowDataPacket } from "mysql2/promise";

interface Student extends RowDataPacket {
  jmbag: string;
  ime: string;
  prezime: string;
  oid: string;
  email: string;
  mobitel: string;
  godinaUpisa: number;
  status: "redovan" | "izvanredan" | "ispisan";
  smjer: number;
}

export const prerender = false;

// ! GET api/student - Samo testiranje (komentiraj prije predaje)
export const GET: APIRoute = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute<Student[]>("SELECT * FROM student");
    await connection.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("database error:", error);

    return new Response(JSON.stringify({ error: "internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// POST api/student (pretrazivanje po jmbagu)
export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const jmbag = formData.get("jmbag")?.toString().trim();

    if (!jmbag) {
      return new Response(JSON.stringify({ error: "jmbag je obavezan" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Provjera formata JMBAG-a
    // ^ - pocetak stringa
    // \d{10} - tocno 10 znamenki (0-9)
    // $ - kraj stringa
    // npr: "1234567890" - tocno
    // npr: "123456789" - netocno
    // npr: "12345678901" - netocno
    // npr: "1234 567890" - netocno
    // idk kak drukcije ovo projerit na brzinu
    const jmbagRegex = /^\d{10}$/;
    if (!jmbagRegex.test(jmbag)) {
      return new Response(
        JSON.stringify({
          error:
            "neispravan format jmbag-a, jmbag mora biti tocno 10 znamenaka",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute<Student[]>(
      `SELECT * FROM student WHERE jmbag = ?`,
      [jmbag]
    );
    await connection.end();

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "student nije pronaden" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("database error:", error);

    return new Response(JSON.stringify({ error: "internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
