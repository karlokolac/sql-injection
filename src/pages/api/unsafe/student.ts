import type { APIRoute } from "astro";
import { dbConfig } from "../dbconfig";
import mysql, { type RowDataPacket } from "mysql2/promise";

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
    const [rows] = await connection.execute<any>(query);
    await connection.end();

    // query i count su samo za edukaciju, da se vidi tocno kaj
    // se izvrsava i kolko redaka je vratilo.
    return new Response(
      JSON.stringify({
        query: query,
        results: rows,
        count: rows.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("database error: ", error);

    return new Response(JSON.stringify({ error: "internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
