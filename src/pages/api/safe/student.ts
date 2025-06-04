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
    // const jmbagRegex = /^\d{10}$/;
    // if (!jmbagRegex.test(jmbag)) {
    //   return new Response(
    //     JSON.stringify({
    //       error:
    //         "neispravan format jmbag-a, jmbag mora biti tocno 10 znamenaka",
    //     }),
    //     {
    //       status: 400,
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );
    // }

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute<Student[]>(`SELECT * FROM student WHERE jmbag = ?`, [jmbag]);
    await connection.end();

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "student nije pronađen" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("database error: ", error);

    return new Response(JSON.stringify({ error: "internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
