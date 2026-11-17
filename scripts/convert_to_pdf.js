const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  let html = [];
  let inCode = false;
  let inTable = false;
  let inList = false;
  let listType = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCode) {
        html.push('</code></pre>');
        inCode = false;
      } else {
        const lang = line.trim().slice(3);
        html.push(`<pre><code class="language-${lang}">`);
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      html.push(escapeHtml(line));
      continue;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        // Separator row
        continue;
      }
      if (!inTable) {
        html.push('<table><thead><tr>');
        cells.forEach(c => html.push(`<th>${formatInline(c)}</th>`));
        html.push('</tr></thead><tbody>');
        inTable = true;
      } else {
        html.push('<tr>');
        cells.forEach(c => html.push(`<td>${formatInline(c)}</td>`));
        html.push('</tr>');
      }
      continue;
    } else if (inTable) {
      html.push('</tbody></table>');
      inTable = false;
    }

    // Lists
    const ulMatch = line.match(/^(\s*)[-*]\s+(.+)/);
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)/);

    if (ulMatch || olMatch) {
      const match = ulMatch || olMatch;
      const type = ulMatch ? 'ul' : 'ol';
      if (!inList || listType !== type) {
        if (inList) html.push(`</${listType}>`);
        html.push(`<${type}>`);
        inList = true;
        listType = type;
      }
      html.push(`<li>${formatInline(match[2])}</li>`);
      continue;
    } else if (inList && line.trim() === '') {
      html.push(`</${listType}>`);
      inList = false;
    }

    // Horizontal rule
    if (/^(\*\*\*|---|___)$/.test(line.trim())) {
      html.push('<hr/>');
      continue;
    }

    // Headings
    const hMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (hMatch) {
      const level = hMatch[1].length;
      html.push(`<h${level}>${formatInline(hMatch[2])}</h${level}>`);
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      html.push(`<blockquote><p>${formatInline(line.slice(2))}</p></blockquote>`);
      continue;
    }

    // Paragraphs
    if (line.trim() !== '') {
      html.push(`<p>${formatInline(line)}</p>`);
    }
  }

  if (inTable) html.push('</tbody></table>');
  if (inList) html.push(`</${listType}>`);
  if (inCode) html.push('</code></pre>');

  return html.join('\n');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatInline(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/<(?!\/?(code|span|b|i|strong|em|br|a))/gi, '&lt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

const template = (title, body) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  @page {
    size: A4;
    margin: 20mm 15mm 20mm 15mm;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #24292f;
    line-height: 1.6;
    font-size: 11pt;
    margin: 0;
    padding: 0;
  }
  h1 {
    font-size: 20pt;
    color: #0f2c59;
    border-bottom: 2px solid #0f2c59;
    padding-bottom: 6px;
    margin-top: 10px;
    margin-bottom: 12px;
  }
  h2 {
    font-size: 14pt;
    color: #1e3a5f;
    border-bottom: 1px solid #d0d7de;
    padding-bottom: 4px;
    margin-top: 18px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }
  h3 {
    font-size: 12pt;
    color: #2c3e50;
    margin-top: 14px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }
  p {
    margin-top: 0;
    margin-bottom: 8px;
    text-align: justify;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }
  th, td {
    border: 1px solid #d0d7de;
    padding: 6px 10px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: #f6f8fa;
    color: #1e3a5f;
    font-weight: 600;
  }
  tr:nth-child(even) {
    background-color: #fcfcfc;
  }
  code {
    background-color: #f3f4f6;
    color: #b91c1c;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: Consolas, "Courier New", monospace;
    font-size: 9pt;
  }
  pre {
    background-color: #f6f8fa;
    border: 1px solid #d0d7de;
    border-radius: 6px;
    padding: 10px;
    overflow-x: auto;
    font-size: 8.5pt;
    line-height: 1.4;
    page-break-inside: avoid;
  }
  pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
  }
  blockquote {
    border-left: 4px solid #1e3a5f;
    margin: 10px 0;
    padding: 6px 14px;
    background-color: #f0f4f8;
    color: #334155;
    font-style: italic;
  }
  ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
    padding-left: 24px;
  }
  li {
    margin-bottom: 4px;
  }
  hr {
    border: none;
    border-top: 1px solid #d0d7de;
    margin: 16px 0;
  }
  .badge-pass {
    background-color: #dcfce7;
    color: #15803d;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
  }
</style>
</head>
<body>
${body}
</body>
</html>`;

const files = [
  { md: 'G1_Funcionales.md', pdf: 'G1_Funcionales.pdf', title: 'Informe de Pruebas Funcionales - Grupo 1' },
  { md: 'G1_Rendimiento.md', pdf: 'G1_Rendimiento.pdf', title: 'Informe de Pruebas de Rendimiento - Grupo 1' },
  { md: 'G1_Vulnerabilidades.md', pdf: 'G1_Vulnerabilidades.pdf', title: 'Informe de Pruebas de Vulnerabilidades - Grupo 1' }
];

const browserExe = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
].find(p => fs.existsSync(p));

if (!browserExe) {
  console.error('No compatible browser found for PDF printing.');
  process.exit(1);
}

console.log('Using browser:', browserExe);

files.forEach(({ md, pdf, title }) => {
  if (!fs.existsSync(md)) {
    console.error(`File ${md} does not exist.`);
    return;
  }
  const content = fs.readFileSync(md, 'utf8');
  const bodyHtml = mdToHtml(content);
  const fullHtml = template(title, bodyHtml);
  const tempHtmlPath = path.resolve(`temp_${pdf.replace('.pdf', '.html')}`);
  const destPdfPath = path.resolve(pdf);

  fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');
  console.log(`Generated HTML: ${tempHtmlPath}`);

  const cmd = `"${browserExe}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${destPdfPath}" "${tempHtmlPath}"`;
  console.log(`Compiling PDF: ${pdf}...`);
  try {
    execSync(cmd, { stdio: 'ignore' });
    if (fs.existsSync(destPdfPath)) {
      const stats = fs.statSync(destPdfPath);
      console.log(`SUCCESS: ${pdf} generated (${stats.size} bytes).`);
    } else {
      console.error(`FAILED: ${pdf} was not created.`);
    }
  } catch (err) {
    console.error(`Error printing ${pdf}:`, err.message);
  } finally {
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
});
console.log('PDF generation complete.');
