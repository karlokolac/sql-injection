import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RenderTable } from "./RenderTable";

interface Student {
  jmbag: string;
  ime: string;
  prezime: string;
  oib: string;
  email: string;
  mobitel: string;
  godinaUpisa: number;
  status: "redovan" | "izvanredan" | "ispisan";
  smjer: number;
}

export function StudentForm() {
  const [jmbag, setJmbag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [student, setStudent] = useState<Student | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("jmbag", jmbag);

      const response = await fetch("/api/safe/student", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setStudent(null);
      } else {
        setStudent(data);
        setError("");
      }
    } catch (error) {
      setError("Greška kod pretraživanja");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <form onSubmit={handleSubmit} className="mb-24">
        <h2>Pretraživanje studenata</h2>
        <Input
          placeholder="1234567890"
          value={jmbag}
          pattern="^\d{10}$"
          required
          title="JMBAG mora sadržavati točno 10 znamenki (0-9)"
          onChange={(e) => setJmbag(e.target.value)}
        />
        <Button type="submit" className="mt-2 w-full">
          {loading ? "Tražim..." : "Traži studenta"}
        </Button>
      </form>

      {error && RenderTable({ error })}

      {student && RenderTable(student)}
    </div>
  );
}
