export function RenderTable(data: any) {
  if (!data) return null;

  const keys = Object.keys(data);
  const values = Object.values(data);

  return (
    <div className="flex jusify-center px-4 md:px-0 md:min-w-md max-w-full overflow-x-auto">
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

export function RenderMultiRowTable(data: any[]) {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);

  return (
    <div className="flex jusify-center px-4 md:px-0 md:min-w-md max-w-full overflow-x-auto">
      <table>
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {keys.map((key) => (
                <td key={key}>{row[key]?.toString() || "NULL"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
