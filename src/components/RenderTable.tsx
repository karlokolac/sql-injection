export function RenderTable(data: any) {
  if (!data) return null;

  const keys = Object.keys(data);
  const values = Object.values(data);

  return (
    <div className="flex jusify-center min-w-md max-w-full overflow-x-auto">
      <table>
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {values.map((value, index) => (
              <td key={index}>{value?.toString() || "NULL"}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
