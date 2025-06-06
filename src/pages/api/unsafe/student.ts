import type { APIRoute } from "astro";
import { dbConfig } from "../dbconfig";
import mysql from "mysql2/promise";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const jmbag = formData.get("jmbag");

    // !ovo fakat ne radit ovo je jako lose pls -> api/safe/student.ts
    // !primjeti da nema niti validacije ako je uneseno tocno 10 znamenki
    // !ili ak je opce bilo kaj uneseno.
    // !cak nema niti results: rows[0] kaj bi bar vratilo sam jedan redak
    const query = "SELECT * FROM student WHERE jmbag = '" + jmbag + "'";

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query<any>(query);
    await connection.end();

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "student nije pronađen" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    // query samo za edukaciju, da se vidi tocno kaj se izvrsava
    return new Response(
      JSON.stringify({
        query: query,
        results: rows,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("database error: ", error);

    return new Response(JSON.stringify({ error: "internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
