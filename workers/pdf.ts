import { playbookMeta, playbookPages } from '../src/content/playbook-pages';

function pdfEscape(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrapLine(text: string, max = 86) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function pageStream(pageIndex: number) {
  const page = playbookPages[pageIndex];
  const ops: string[] = [];
  ops.push('BT');
  ops.push('/F1 9 Tf 56 748 Td');
  ops.push(`(${pdfEscape(`${playbookMeta.title}  ·  ${page.kicker}`)}) Tj`);
  ops.push('/F2 18 Tf 0 -28 Td');
  wrapLine(page.title, 42).forEach((line, i) => {
    if (i === 0) ops.push(`(${pdfEscape(line)}) Tj`);
    else ops.push(`0 -22 Td (${pdfEscape(line)}) Tj`);
  });
  ops.push('/F1 11 Tf 0 -28 Td');
  let firstPara = true;
  for (const para of page.body) {
    if (!firstPara) ops.push('0 -14 Td');
    firstPara = false;
    wrapLine(para, 88).forEach((line, i) => {
      if (i === 0) ops.push(`(${pdfEscape(line)}) Tj`);
      else ops.push(`0 -15 Td (${pdfEscape(line)}) Tj`);
    });
    ops.push('0 -10 Td');
  }
  ops.push('/F1 9 Tf 0 -24 Td');
  ops.push(`(${pdfEscape(`DynasAI  ·  Page ${page.number} of ${String(playbookPages.length).padStart(2, '0')}  ·  dynasai.ai`)}) Tj`);
  ops.push('ET');
  return ops.join('\n');
}

export function buildPlaybookPdf(): Uint8Array {
  const encoder = new TextEncoder();
  const objects: string[] = [];
  objects.push('<< /Type /Catalog /Pages 2 0 R >>');

  const pageIds = playbookPages.map((_, i) => 3 + i * 2);
  const kids = pageIds.map((id) => `${id} 0 R`).join(' ');
  objects.push(`<< /Type /Pages /Kids [${kids}] /Count ${playbookPages.length} >>`);

  const fontRegularId = 3 + playbookPages.length * 2;
  const fontBoldId = fontRegularId + 1;

  playbookPages.forEach((_, i) => {
    const pageId = 3 + i * 2;
    const contentId = pageId + 1;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> >>`,
    );
    const stream = pageStream(i);
    objects.push(`<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}\nendstream`);
  });

  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

  let body = '%PDF-1.4\n';
  const offsets = [0];
  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(encoder.encode(body).length);
    body += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart = encoder.encode(body).length;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  body += xref;
  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return encoder.encode(body);
}
