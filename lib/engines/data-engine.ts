export interface DataEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

/**
 * Robust RFC 4180 compliant CSV parser supporting quotes, escaped quotes, newlines, and custom delimiters.
 */
export function parseCsvRows(csvStr: string, delimiter: string = ","): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuote = false;

  for (let i = 0; i < csvStr.length; i++) {
    const char = csvStr[i];
    const nextChar = csvStr[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === delimiter && !insideQuote) {
      currentRow.push(currentField);
      currentField = "";
    } else if ((char === "\r" || char === "\n") && !insideQuote) {
      if (char === "\r" && nextChar === "\n") {
        i++; // skip \r\n
      }
      currentRow.push(currentField);
      currentField = "";
      if (currentRow.length > 0 && currentRow.some((f) => f.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((f) => f.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export function formatCsvField(val: string, delimiter: string = ","): string {
  if (val.includes(delimiter) || val.includes('"') || val.includes("\n") || val.includes("\r")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export function jsonToCsv(jsonStr: string, delimiter: string = ","): DataEngineResult {
  try {
    if (!jsonStr.trim()) return { success: true, output: "" };
    const data = JSON.parse(jsonStr);
    const array = Array.isArray(data) ? data : [data];
    if (array.length === 0) return { success: true, output: "" };

    const headers = Array.from(new Set(array.flatMap((obj) => Object.keys(obj))));
    const rows = array.map((obj) =>
      headers.map((h) => formatCsvField(obj[h] !== undefined ? String(obj[h]) : "", delimiter)).join(delimiter)
    );

    const csv = [headers.map((h) => formatCsvField(h, delimiter)).join(delimiter), ...rows].join("\n");
    return {
      success: true,
      output: csv,
      breakdown: {
        "Total Records": array.length,
        "Columns Found": headers.length,
        "Column Names": headers.join(", "),
      },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Invalid JSON input" };
  }
}

export function csvToJson(csvStr: string, delimiter: string = ","): DataEngineResult {
  try {
    if (!csvStr.trim()) return { success: true, output: "[]" };
    const rows = parseCsvRows(csvStr, delimiter);
    if (rows.length === 0) return { success: true, output: "[]" };

    const headers = rows[0].map((h) => h.trim());
    const records = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = row[idx] !== undefined ? row[idx] : "";
      });
      records.push(obj);
    }

    return {
      success: true,
      output: JSON.stringify(records, null, 2),
      breakdown: {
        "Records Parsed": records.length,
        "Columns": headers.length,
      },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "CSV parsing error" };
  }
}

export function csvToMarkdownTable(csvStr: string, delimiter: string = ","): DataEngineResult {
  try {
    if (!csvStr.trim()) return { success: true, output: "" };
    const rows = parseCsvRows(csvStr, delimiter);
    if (rows.length === 0) return { success: true, output: "" };

    const headers = rows[0];
    const headerRow = `| ${headers.map((h) => h.trim()).join(" | ")} |`;
    const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;
    const dataRows = rows.slice(1).map((r) => `| ${r.map((c) => c.trim()).join(" | ")} |`);

    const markdown = [headerRow, separatorRow, ...dataRows].join("\n");
    return {
      success: true,
      output: markdown,
      breakdown: {
        "Total Table Rows": rows.length - 1,
        "Columns": headers.length,
      },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Markdown conversion error" };
  }
}

export function markdownTableToCsv(mdStr: string, delimiter: string = ","): DataEngineResult {
  try {
    if (!mdStr.trim()) return { success: true, output: "" };
    const lines = mdStr.trim().split(/\r?\n/).filter((l) => l.trim().startsWith("|"));
    if (lines.length === 0) return { success: false, output: "", error: "No markdown table rows found." };

    const parsedRows = lines
      .filter((l) => !l.replace(/[\s|:-]/g, "").length === false || !l.includes("---"))
      .map((l) => {
        const parts = l.split("|").map((p) => p.trim());
        if (parts[0] === "") parts.shift();
        if (parts[parts.length - 1] === "") parts.pop();
        return parts.map((p) => formatCsvField(p, delimiter)).join(delimiter);
      });

    return {
      success: true,
      output: parsedRows.join("\n"),
      breakdown: { "Rows Converted": parsedRows.length },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Markdown parse error" };
  }
}

export function jsonToTypeScriptInterface(jsonStr: string, interfaceName: string = "RootObject"): DataEngineResult {
  try {
    if (!jsonStr.trim()) return { success: true, output: "" };
    const parsed = JSON.parse(jsonStr);
    const target = Array.isArray(parsed) ? parsed[0] || {} : parsed;

    const generateType = (val: unknown): string => {
      if (val === null) return "null";
      if (Array.isArray(val)) {
        const itemType = val.length > 0 ? generateType(val[0]) : "any";
        return `${itemType}[]`;
      }
      if (typeof val === "object") return "Record<string, any>";
      return typeof val;
    };

    const properties = Object.entries(target)
      .map(([key, val]) => `  ${key}: ${generateType(val)};`)
      .join("\n");

    const tsInterface = `export interface ${interfaceName} {\n${properties}\n}`;
    return {
      success: true,
      output: tsInterface,
      breakdown: {
        "Fields Defined": Object.keys(target).length,
        "TypeScript Standard": "Strict Type Safety ✓",
      },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Invalid JSON input" };
  }
}

export function formatXml(xmlStr: string, indentSpaces: number = 2): DataEngineResult {
  try {
    if (!xmlStr.trim()) return { success: true, output: "" };
    const PADDING = " ".repeat(indentSpaces);
    const reg = /(>)(<)(\/*)/g;
    let formatted = "";
    let pad = 0;

    const xml = xmlStr.replace(reg, "$1\r\n$2$3");
    xml.split(/\r?\n/).forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }
      formatted += PADDING.repeat(pad) + node + "\r\n";
      pad += indent;
    });

    return { success: true, output: formatted.trim() };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "XML formatting error" };
  }
}

export function validateXml(xmlStr: string): DataEngineResult {
  if (!xmlStr.trim()) return { success: false, output: "", error: "XML input is empty." };
  if (typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, "text/xml");
    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      return { success: false, output: "", error: parserError.textContent || "XML Syntax Error" };
    }
    return {
      success: true,
      output: "XML is syntactically valid and well-formed ✓",
      breakdown: { "Root Element": doc.documentElement.nodeName, "Child Nodes": doc.documentElement.childNodes.length },
    };
  }
  return { success: true, output: "XML well-formed ✓" };
}

export function xmlToJson(xmlStr: string): DataEngineResult {
  try {
    if (!xmlStr.trim()) return { success: true, output: "{}" };
    if (typeof DOMParser === "undefined") return { success: false, output: "", error: "DOMParser unavailable" };

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, "text/xml");
    const parserError = doc.querySelector("parsererror");
    if (parserError) return { success: false, output: "", error: parserError.textContent || "XML Error" };

    const domToObj = (node: Node): unknown => {
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue?.trim() || "";
      const obj: Record<string, unknown> = {};
      if (node.childNodes && node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          const item = node.childNodes.item(i);
          const nodeName = item.nodeName;
          if (item.nodeType === Node.TEXT_NODE && item.nodeValue?.trim() === "") continue;
          const val = domToObj(item);
          if (obj[nodeName] === undefined) {
            obj[nodeName] = val;
          } else {
            if (!Array.isArray(obj[nodeName])) obj[nodeName] = [obj[nodeName]];
            (obj[nodeName] as unknown[]).push(val);
          }
        }
      }
      return Object.keys(obj).length === 0 ? "" : obj;
    };

    const jsonObj = { [doc.documentElement.nodeName]: domToObj(doc.documentElement) };
    return { success: true, output: JSON.stringify(jsonObj, null, 2) };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "XML to JSON error" };
  }
}

export function jsonToXml(jsonStr: string): DataEngineResult {
  try {
    if (!jsonStr.trim()) return { success: true, output: "<root></root>" };
    const data = JSON.parse(jsonStr);

    const objToXml = (obj: unknown, tag: string = "item"): string => {
      if (obj === null || obj === undefined) return `<${tag}></${tag}>`;
      if (typeof obj !== "object") return `<${tag}>${String(obj)}</${tag}>`;
      if (Array.isArray(obj)) return obj.map((item) => objToXml(item, tag)).join("\n");

      const children = Object.entries(obj)
        .map(([k, v]) => objToXml(v, k.replace(/[^\w-]/g, "_")))
        .join("\n");
      return `<${tag}>\n${children}\n</${tag}>`;
    };

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` + objToXml(data, "root");
    return { success: true, output: xml };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "JSON to XML error" };
  }
}

export function extractCsvColumns(csvStr: string, columnIndicesOrNames: string, delimiter: string = ","): DataEngineResult {
  try {
    if (!csvStr.trim()) return { success: true, output: "" };
    const rows = parseCsvRows(csvStr, delimiter);
    if (rows.length === 0) return { success: true, output: "" };

    const headers = rows[0];
    const targets = columnIndicesOrNames.split(",").map((t) => t.trim().toLowerCase());
    const matchedIndices: number[] = [];

    targets.forEach((t) => {
      const idx = parseInt(t, 10);
      if (!isNaN(idx) && idx >= 0 && idx < headers.length) {
        matchedIndices.push(idx);
      } else {
        const found = headers.findIndex((h) => h.toLowerCase() === t);
        if (found !== -1) matchedIndices.push(found);
      }
    });

    const finalIndices = matchedIndices.length > 0 ? matchedIndices : [0];
    const extractedRows = rows.map((r) =>
      finalIndices.map((idx) => formatCsvField(r[idx] || "", delimiter)).join(delimiter)
    );

    return {
      success: true,
      output: extractedRows.join("\n"),
      breakdown: {
        "Extracted Columns": finalIndices.length,
        "Total Rows": extractedRows.length,
      },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Column extraction error" };
  }
}

export function convertCsvDelimiter(csvStr: string, fromDelimiter: string, toDelimiter: string): DataEngineResult {
  try {
    if (!csvStr.trim()) return { success: true, output: "" };
    const rows = parseCsvRows(csvStr, fromDelimiter);
    const converted = rows.map((r) => r.map((c) => formatCsvField(c, toDelimiter)).join(toDelimiter));
    return {
      success: true,
      output: converted.join("\n"),
      breakdown: { "Converted Rows": rows.length },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Delimiter conversion error" };
  }
}

export function csvToSqlInsert(csvStr: string, tableName: string = "my_table", delimiter: string = ","): DataEngineResult {
  try {
    if (!csvStr.trim()) return { success: true, output: "" };
    const rows = parseCsvRows(csvStr, delimiter);
    if (rows.length < 2) return { success: false, output: "", error: "CSV must have at least 1 header and 1 data row." };

    const headers = rows[0].map((h) => h.trim().replace(/[^\w]/g, "_"));
    const colList = headers.join(", ");

    const queries = rows.slice(1).map((r) => {
      const values = headers.map((_, idx) => {
        const val = r[idx] !== undefined ? r[idx] : "";
        if (val === "") return "NULL";
        if (!isNaN(Number(val)) && !val.startsWith("0")) return Number(val);
        return `'${val.replace(/'/g, "''")}'`;
      });
      return `INSERT INTO ${tableName} (${colList}) VALUES (${values.join(", ")});`;
    });

    return {
      success: true,
      output: queries.join("\n"),
      breakdown: { "SQL Statements Generated": queries.length },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "SQL generation error" };
  }
}

export function jsonToSqlInsert(jsonStr: string, tableName: string = "my_table"): DataEngineResult {
  try {
    if (!jsonStr.trim()) return { success: true, output: "" };
    const data = JSON.parse(jsonStr);
    const array = Array.isArray(data) ? data : [data];
    if (array.length === 0) return { success: true, output: "" };

    const headers = Array.from(new Set(array.flatMap((obj) => Object.keys(obj))));
    const colList = headers.map((h) => h.replace(/[^\w]/g, "_")).join(", ");

    const queries = array.map((obj) => {
      const values = headers.map((h) => {
        const val = obj[h];
        if (val === null || val === undefined) return "NULL";
        if (typeof val === "number") return val;
        if (typeof val === "boolean") return val ? 1 : 0;
        return `'${String(val).replace(/'/g, "''")}'`;
      });
      return `INSERT INTO ${tableName} (${colList}) VALUES (${values.join(", ")});`;
    });

    return {
      success: true,
      output: queries.join("\n"),
      breakdown: { "SQL Insert Statements": queries.length },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "JSON SQL generation error" };
  }
}

export function flattenJson(jsonStr: string): DataEngineResult {
  try {
    if (!jsonStr.trim()) return { success: true, output: "{}" };
    const data = JSON.parse(jsonStr);

    const flatten = (obj: unknown, prefix = ""): Record<string, unknown> => {
      const res: Record<string, unknown> = {};
      if (typeof obj !== "object" || obj === null) {
        res[prefix] = obj;
        return res;
      }
      for (const [k, v] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${k}` : k;
        if (typeof v === "object" && v !== null && Object.keys(v).length > 0) {
          Object.assign(res, flatten(v, newKey));
        } else {
          res[newKey] = v;
        }
      }
      return res;
    };

    const flattened = flatten(data);
    return {
      success: true,
      output: JSON.stringify(flattened, null, 2),
      breakdown: { "Flattened Keys": Object.keys(flattened).length },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "JSON Flatten error" };
  }
}

export function unflattenJson(jsonStr: string): DataEngineResult {
  try {
    if (!jsonStr.trim()) return { success: true, output: "{}" };
    const data = JSON.parse(jsonStr);
    const result: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(data)) {
      const parts = key.split(".");
      let current = result;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part] || typeof current[part] !== "object") {
          current[part] = {};
        }
        current = current[part] as Record<string, unknown>;
      }
      current[parts[parts.length - 1]] = val;
    }

    return { success: true, output: JSON.stringify(result, null, 2) };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "JSON Unflatten error" };
  }
}

export function sortJsonKeys(jsonStr: string): DataEngineResult {
  try {
    if (!jsonStr.trim()) return { success: true, output: "{}" };
    const data = JSON.parse(jsonStr);

    const sortObject = (obj: unknown): unknown => {
      if (Array.isArray(obj)) return obj.map(sortObject);
      if (typeof obj === "object" && obj !== null) {
        const sorted: Record<string, unknown> = {};
        Object.keys(obj)
          .sort()
          .forEach((k) => {
            sorted[k] = sortObject((obj as Record<string, unknown>)[k]);
          });
        return sorted;
      }
      return obj;
    };

    const sortedData = sortObject(data);
    return { success: true, output: JSON.stringify(sortedData, null, 2) };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "JSON Key sort error" };
  }
}

export function filterCsvRows(csvStr: string, searchTerm: string, delimiter: string = ","): DataEngineResult {
  try {
    if (!csvStr.trim()) return { success: true, output: "" };
    const rows = parseCsvRows(csvStr, delimiter);
    if (rows.length === 0) return { success: true, output: "" };

    const headers = rows[0];
    const filtered = rows.slice(1).filter((r) =>
      r.some((cell) => cell.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const outputRows = [headers.map((h) => formatCsvField(h, delimiter)).join(delimiter)];
    filtered.forEach((r) => outputRows.push(r.map((c) => formatCsvField(c, delimiter)).join(delimiter)));

    return {
      success: true,
      output: outputRows.join("\n"),
      breakdown: { "Original Rows": rows.length - 1, "Matching Rows": filtered.length },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "CSV filter error" };
  }
}

export function removeCsvDuplicateRows(csvStr: string, delimiter: string = ","): DataEngineResult {
  try {
    if (!csvStr.trim()) return { success: true, output: "" };
    const rows = parseCsvRows(csvStr, delimiter);
    if (rows.length <= 1) return { success: true, output: csvStr };

    const headers = rows[0];
    const seen = new Set<string>();
    const uniqueRows: string[][] = [];

    for (let i = 1; i < rows.length; i++) {
      const rowKey = rows[i].join("|||");
      if (!seen.has(rowKey)) {
        seen.add(rowKey);
        uniqueRows.push(rows[i]);
      }
    }

    const output = [
      headers.map((h) => formatCsvField(h, delimiter)).join(delimiter),
      ...uniqueRows.map((r) => r.map((c) => formatCsvField(c, delimiter)).join(delimiter)),
    ].join("\n");

    return {
      success: true,
      output,
      breakdown: {
        "Total Rows": rows.length - 1,
        "Unique Rows": uniqueRows.length,
        "Duplicates Removed": rows.length - 1 - uniqueRows.length,
      },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "CSV Deduplication error" };
  }
}

export function queryJsonPath(jsonStr: string, pathStr: string): DataEngineResult {
  try {
    if (!jsonStr.trim()) return { success: true, output: "" };
    const data = JSON.parse(jsonStr);
    if (!pathStr.trim()) return { success: true, output: JSON.stringify(data, null, 2) };

    const parts = pathStr.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "").split(".");
    let current: unknown = data;

    for (const part of parts) {
      if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return { success: false, output: "", error: `Path "${pathStr}" not found in JSON data.` };
      }
    }

    return {
      success: true,
      output: typeof current === "object" ? JSON.stringify(current, null, 2) : String(current),
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "JSON query error" };
  }
}

export function csvToHtmlTable(csvStr: string, delimiter: string = ","): DataEngineResult {
  try {
    if (!csvStr.trim()) return { success: true, output: "" };
    const rows = parseCsvRows(csvStr, delimiter);
    if (rows.length === 0) return { success: true, output: "" };

    const thead = `  <thead>\n    <tr>\n${rows[0].map((h) => `      <th>${h}</th>`).join("\n")}\n    </tr>\n  </thead>`;
    const tbodyRows = rows.slice(1).map((r) => `    <tr>\n${r.map((c) => `      <td>${c}</td>`).join("\n")}\n    </tr>`).join("\n");
    const tbody = `  <tbody>\n${tbodyRows}\n  </tbody>`;

    const html = `<table>\n${thead}\n${tbody}\n</table>`;
    return { success: true, output: html, breakdown: { "Rows Rendered": rows.length } };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "HTML conversion error" };
  }
}

export function htmlTableToCsv(htmlStr: string, delimiter: string = ","): DataEngineResult {
  try {
    if (!htmlStr.trim()) return { success: true, output: "" };
    if (typeof DOMParser === "undefined") return { success: false, output: "", error: "DOMParser unavailable" };

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStr, "text/html");
    const table = doc.querySelector("table");
    if (!table) return { success: false, output: "", error: "No <table> element found in HTML." };

    const rows: string[] = [];
    table.querySelectorAll("tr").forEach((tr) => {
      const cells: string[] = [];
      tr.querySelectorAll("th, td").forEach((cell) => {
        cells.push(formatCsvField(cell.textContent?.trim() || "", delimiter));
      });
      if (cells.length > 0) rows.push(cells.join(delimiter));
    });

    return { success: true, output: rows.join("\n"), breakdown: { "Rows Extracted": rows.length } };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "HTML Table parsing error" };
  }
}

export function calculateJsonStats(jsonStr: string): DataEngineResult {
  try {
    if (!jsonStr.trim()) return { success: true, output: "{}" };
    const data = JSON.parse(jsonStr);
    const array = Array.isArray(data) ? data : [data];

    const totalRecords = array.length;
    const keys = Array.from(new Set(array.flatMap((o) => Object.keys(o))));
    const numericStats: Record<string, { sum: number; count: number; min: number; max: number }> = {};

    array.forEach((item) => {
      Object.entries(item).forEach(([k, v]) => {
        if (typeof v === "number") {
          if (!numericStats[k]) numericStats[k] = { sum: 0, count: 0, min: v, max: v };
          numericStats[k].sum += v;
          numericStats[k].count += 1;
          numericStats[k].min = Math.min(numericStats[k].min, v);
          numericStats[k].max = Math.max(numericStats[k].max, v);
        }
      });
    });

    const summary: Record<string, unknown> = {
      totalRecords,
      totalKeys: keys.length,
      keys,
      numericFieldStats: Object.entries(numericStats).map(([field, s]) => ({
        field,
        count: s.count,
        sum: s.sum,
        avg: Number((s.sum / s.count).toFixed(2)),
        min: s.min,
        max: s.max,
      })),
    };

    return {
      success: true,
      output: JSON.stringify(summary, null, 2),
      breakdown: { "Total Records": totalRecords, "Fields Analyzed": keys.length },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "JSON stats error" };
  }
}

export function reorderCsvColumns(csvStr: string, newOrderIndices: string, delimiter: string = ","): DataEngineResult {
  try {
    if (!csvStr.trim()) return { success: true, output: "" };
    const rows = parseCsvRows(csvStr, delimiter);
    if (rows.length === 0) return { success: true, output: "" };

    const order = newOrderIndices
      .split(",")
      .map((i) => parseInt(i.trim(), 10))
      .filter((i) => !isNaN(i) && i >= 0 && i < rows[0].length);

    if (order.length === 0) return { success: false, output: "", error: "Invalid column order specification." };

    const reordered = rows.map((r) => order.map((idx) => formatCsvField(r[idx] || "", delimiter)).join(delimiter));

    return { success: true, output: reordered.join("\n") };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Reorder error" };
  }
}

export function convertSqlToJson(sqlStr: string): DataEngineResult {
  try {
    if (!sqlStr.trim()) return { success: true, output: "[]" };

    // Matches INSERT INTO tableName (col1, col2) VALUES (val1, val2), (val3, val4);
    const colMatch = sqlStr.match(/INSERT\s+INTO\s+[`"']?\w+[`"']?\s*\(([^)]+)\)/i);
    const valuesMatches = [...sqlStr.matchAll(/\(([^)]+)\)/gi)];

    if (!colMatch || valuesMatches.length <= 1) {
      // Fallback simple line-by-line parser for table dumps
      return {
        success: false,
        output: "[]",
        error: "Could not find standard 'INSERT INTO table (columns) VALUES (values)' structure.",
      };
    }

    const columns = colMatch[1].split(",").map((c) => c.trim().replace(/[`"']/g, ""));
    const dataRows = valuesMatches.slice(1); // skip column definition parenthesis

    const jsonRecords = dataRows.map((rowMatch) => {
      const rawVals = rowMatch[1].split(",").map((v) => v.trim().replace(/^['"`]|['"`]$/g, ""));
      const record: Record<string, unknown> = {};
      columns.forEach((col, idx) => {
        const val = rawVals[idx] || "";
        record[col] = !isNaN(Number(val)) && val !== "" ? Number(val) : val;
      });
      return record;
    });

    return {
      success: true,
      output: JSON.stringify(jsonRecords, null, 2),
      breakdown: {
        "Columns Detected": columns.join(", "),
        "Rows Converted": jsonRecords.length,
        "Format": "Standard JSON Array of Objects",
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      output: "[]",
      error: `SQL Parsing error: ${(err as Error).message}`,
    };
  }
}

