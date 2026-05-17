type CsvPrimitive = boolean | number | string | null | undefined;

export type CsvRow = Record<string, CsvPrimitive>;

function escapeCsvValue(value: CsvPrimitive) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (!/[",\n\r]/.test(stringValue)) {
    return stringValue;
  }

  return `"${stringValue.replace(/"/g, '""')}"`;
}

export function rowsToCsv<T extends CsvRow>(rows: T[]) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(",")
    )
  ];

  return lines.join("\n");
}
