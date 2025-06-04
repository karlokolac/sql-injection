import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RenderMultiRowTable, RenderTable } from "./RenderTable";

interface APIResponse {
  query: string;
  results: any[];
}

export function StudentForm() {
  const [jmbag, setJmbag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<APIResponse | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("jmbag", jmbag);

      const response = await fetch("/api/unsafe/student", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setResponse(null);
      } else {
        setResponse(data);
        setError("");
      }
    } catch (error) {
      setError("Greška kod pretraživanja");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <form onSubmit={handleSubmit} className="mb-24">
        <h2>Pretraživanje studenata</h2>
        <Input
          placeholder="1234567890 ili ' OR '1'='1"
          value={jmbag}
          required
          onChange={(e) => setJmbag(e.target.value)}
        />
        <Button type="submit" className="mt-2 w-full">
          {loading ? "Tražim..." : "Traži studenta"}
        </Button>
      </form>

      {error && RenderTable({ error })}

      {response && (
        <>
          <div className="text-center">
            <code>{response.query}</code>
          </div>

          {response.results && RenderMultiRowTable(response.results)}
        </>
      )}
    </div>
  );
}
