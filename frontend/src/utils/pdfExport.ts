import { jsPDF } from 'jspdf';
import { NotesData } from '../types';

/**
 * Normalizes Unicode math and special characters that standard PDF Type-1 fonts
 * (like Helvetica/Times) cannot encode without font corruption or missing characters.
 */
function cleanPdfText(text: string): string {
  if (!text) return '';

  return text
    // Greek and mathematical letters
    .replace(/θ/g, 'theta')
    .replace(/η/g, 'eta')
    .replace(/γ/g, 'gamma')
    .replace(/α/g, 'alpha')
    .replace(/β/g, 'beta')
    .replace(/λ/g, 'lambda')
    .replace(/∇/g, 'grad')
    .replace(/∈/g, 'in')
    .replace(/∉/g, 'not in')
    .replace(/·/g, ' * ')
    .replace(/×/g, ' x ')
    .replace(/±/g, '+/-')
    .replace(/≠/g, '!=')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/≈/g, '~=')
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/⇒/g, '=>')
    .replace(/∞/g, 'inf')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/•/g, '-')
    // Clean smart quotes & typographical dashes
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/-/g, ' -- ')
    .replace(/–/g, ' - ')
    .replace(/…/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

export function exportNotesToPDF(notes: NotesData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 25) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // -------------------------------------------------------------
  // 1. Clean Academic Header & Document Identity (matching template)
  // -------------------------------------------------------------
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  const titleText = cleanPdfText(notes.topic_title || 'Synthesized Study Notes');
  doc.text(titleText, margin, y + 10);
  y += 28;

  // Metadata subtitle
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const faithScore = Math.round(notes.faithfulness.overall_score * 100);
  const metaString = `SynthNotes Study Synthesis  |  Subject: ${cleanPdfText(notes.subject_category || 'General')}  |  NLI Faithfulness: ${faithScore}%`;
  doc.text(metaString, margin, y);
  y += 14;

  // Thin separator rule
  doc.setDrawColor(210, 215, 220);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);
  y += 22;

  // -------------------------------------------------------------
  // 2. Section: Detailed Explanation
  // -------------------------------------------------------------
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  doc.text('1. Detailed Explanation', margin, y);
  y += 18;

  if (notes.detailed_sections && notes.detailed_sections.length > 0) {
    notes.detailed_sections.forEach((section, sIndex) => {
      checkPageBreak(35);

      // Section Subsection Heading
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      const headingClean = cleanPdfText(section.heading);
      doc.text(headingClean, margin, y);
      y += 14;

      // Group statements into full cohesive paragraphs matching the student template
      const paragraphText = section.statements
        .map((stmt) => {
          const srcTag = stmt.source_ids && stmt.source_ids.length > 0
            ? ` [${stmt.source_ids.join(', ')}]`
            : '';
          return `${cleanPdfText(stmt.text)}${srcTag}`;
        })
        .join(' ');

      doc.setFont('times', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(35, 35, 35);

      const splitParagraph = doc.splitTextToSize(paragraphText, contentWidth);
      const lineHeight = 14.5;
      const totalHeight = splitParagraph.length * lineHeight;

      // Ensure proper pagination without breaking words across margins
      for (let i = 0; i < splitParagraph.length; i++) {
        checkPageBreak(lineHeight);
        doc.text(splitParagraph[i], margin, y);
        y += lineHeight;
      }

      y += 10; // Spacing between subsections
    });
  }

  y += 10;

  // -------------------------------------------------------------
  // 3. Section: Exam Revision Bullet Checkpoints
  // -------------------------------------------------------------
  checkPageBreak(40);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  doc.text('2. Exam Revision Bullet Checkpoints', margin, y);
  y += 18;

  if (notes.bullet_notes && notes.bullet_notes.length > 0) {
    notes.bullet_notes.forEach((bullet) => {
      const srcTag = bullet.source_ids && bullet.source_ids.length > 0
        ? ` (${bullet.source_ids.join(', ')})`
        : '';
      const fullBullet = `${cleanPdfText(bullet.label)}: ${cleanPdfText(bullet.text)}${srcTag}`;

      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(35, 35, 35);

      const splitBullet = doc.splitTextToSize(fullBullet, contentWidth - 18);
      const lineHeight = 13.5;
      const itemHeight = splitBullet.length * lineHeight;

      checkPageBreak(itemHeight + 4);

      // Bullet point symbol
      doc.setFont('times', 'bold');
      doc.text('-', margin + 4, y);

      // Bullet text with label
      doc.setFont('times', 'normal');
      for (let j = 0; j < splitBullet.length; j++) {
        checkPageBreak(lineHeight);
        doc.text(splitBullet[j], margin + 14, y);
        y += lineHeight;
      }

      y += 4; // Padding between bullets
    });
  }

  y += 12;

  // -------------------------------------------------------------
  // 4. Section: Terminology Normalization Matrix
  // -------------------------------------------------------------
  if (notes.terminology_map && notes.terminology_map.length > 0) {
    checkPageBreak(45);
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(20, 20, 20);
    doc.text('3. Terminology Normalization Matrix', margin, y);
    y += 18;

    notes.terminology_map.forEach((item) => {
      checkPageBreak(38);

      // Canonical Term Name
      doc.setFont('times', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(25, 25, 25);
      doc.text(`Canonical Term: ${cleanPdfText(item.canonical)}`, margin + 6, y);
      y += 13;

      // Definition
      if (item.definition) {
        doc.setFont('times', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(60, 60, 60);
        const defText = `Definition: ${cleanPdfText(item.definition)}`;
        const splitDef = doc.splitTextToSize(defText, contentWidth - 16);
        for (let k = 0; k < splitDef.length; k++) {
          checkPageBreak(12.5);
          doc.text(splitDef[k], margin + 12, y);
          y += 12.5;
        }
      }

      // Synonymous variants across sources
      if (item.variants && item.variants.length > 0) {
        const variantsString = item.variants
          .map((v) => `"${cleanPdfText(v.term)}" [${v.source_id}]`)
          .join(', ');
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const splitVariants = doc.splitTextToSize(`Source Variants: ${variantsString}`, contentWidth - 16);
        for (let m = 0; m < splitVariants.length; m++) {
          checkPageBreak(11.5);
          doc.text(splitVariants[m], margin + 12, y);
          y += 11.5;
        }
      }

      y += 8; // Spacing between terms
    });
  }

  // -------------------------------------------------------------
  // 5. Clean Professional Page Numbering & Footer
  // -------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Subtle footer separator
    doc.setDrawColor(230, 235, 238);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(130, 130, 130);
    doc.text(
      'SynthNotes  |  Synthesized from validated multi-source study materials',
      margin,
      pageHeight - 20
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 20, {
      align: 'right',
    });
  }

  const safeTitle = (notes.topic_title || 'study_notes')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  doc.save(`${safeTitle}_exam_notes.pdf`);
}
