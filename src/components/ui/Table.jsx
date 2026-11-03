export function Table({ headers, rows }) {
  return (
    <div
      className="table-scroll"
      role="region"
      aria-label="Scrollable statistics table"
      tabIndex={0}
    >
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th scope="col" key={i}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                j === 0 ? (
                  <th scope="row" key={j}>
                    {cell ?? "—"}
                  </th>
                ) : (
                  <td key={j}>{cell ?? "—"}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
