export const ToCSVString = (headers: string[], data: string[][]): string => {
  const csvString = [headers, ...data]
    .map((e) =>
      e
        .map((incoding) =>
          incoding ? JSON.stringify(incoding).replace(/\\"/g, '""') : incoding,
        )
        .join(','),
    )
    .join('\n');
  return csvString;
};

export const ToCSVBlob = (headers: string[], data: string[][]): Blob => {
  const csvString = ToCSVString(headers, data);
  return new Blob([csvString], { type: 'text/csv' });
};

export const FromCSVString = (csv: string): string[][] => {
  return csv.split('\n').map((l) => l.trim().split(';'));
};
