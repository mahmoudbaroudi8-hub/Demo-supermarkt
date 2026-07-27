export function exportToCsv(filename: string, rows: object[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  // Create UTF-8 BOM so Arabic letters open correctly in Excel
  const BOM = '\uFEFF';
  
  const csvContent =
    BOM +
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let val = (row as Record<string, unknown>)[k];
            if (val === null || val === undefined) {
              val = '';
            } else if (typeof val === 'object') {
              val = JSON.stringify(val);
            }
            let strVal = String(val).replace(/"/g, '""');
            if (strVal.search(/("|,|\n)/g) >= 0) {
              strVal = `"${strVal}"`;
            }
            return strVal;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
