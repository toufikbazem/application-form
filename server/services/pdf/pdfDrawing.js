import { splitRuns } from "./arabicText.js";

const PAD_X = 2;

// Build the two drawing primitives (drawInField, checkBox) bound to a single
// loaded document context. Both draw with page.drawText so fontkit's shaper
// joins Arabic correctly and the marks survive form.flatten().
export const createDrawers = ({ form, pages, arabicFont, metrics }) => {
  const { ascent, descent, lineHeightPerPt } = metrics;

  // Map every annotation dictionary to the page that lists it. A widget is
  // supposed to name its page via /P, but not every template writes one (the
  // Master_* templates omit it entirely), and falling back to page 1 would
  // silently draw the second page's fields — the specialites and the language
  // checkboxes — onto the first page at the wrong coordinates. Walking the
  // pages' /Annots arrays gives the page reliably either way.
  const pageByAnnot = new Map();
  for (const page of pages) {
    const annots = page.node.Annots();
    if (!annots) continue;
    for (let i = 0; i < annots.size(); i += 1) {
      const dict = page.node.context.lookup(annots.get(i));
      if (dict) pageByAnnot.set(dict, page);
    }
  }

  // Resolve the page a widget is drawn on, preferring the /Annots mapping and
  // falling back to /P (then to the first page) if the widget isn't listed.
  const pageOf = (widget) => {
    const byAnnot = pageByAnnot.get(widget.dict);
    if (byAnnot) return byAnnot;
    const ref = widget.P();
    return (ref && pages.find((p) => p.ref === ref)) ?? pages[0];
  };

  // Draw a value directly into a form field's box using page.drawText, which
  // runs fontkit's shaper (so Arabic letters join correctly). The form field
  // itself is removed afterwards (form.flatten) so its empty box doesn't
  // overlay the drawn text.
  const drawInField = (fieldName, rawValue) => {
    if (rawValue == null || String(rawValue).trim() === "") return;
    let field;
    try {
      field = form.getTextField(fieldName);
    } catch {
      return; // field not present in this PDF
    }
    const widget = field.acroField.getWidgets()[0];
    if (!widget) return;
    const { x, y, width, height } = widget.getRectangle();

    // Find the page this widget lives on.
    const page = pageOf(widget);

    // Split into directional runs (visual order). Each run is drawn with
    // its own drawText so fontkit shapes it correctly in its own direction.
    const runs = splitRuns(rawValue);
    if (runs.length === 0) return;

    // Total width of the line at a given size = sum of run widths.
    const lineWidth = (size) =>
      runs.reduce(
        (sum, r) => sum + arabicFont.widthOfTextAtSize(r.text, size),
        0,
      );

    // Largest size whose line height fits the box (8% padding), capped at
    // 10pt, then shrunk further if the line is wider than the box.
    let size = Math.max(
      6,
      Math.min(10, Math.floor(((height * 0.92) / lineHeightPerPt) * 2) / 2),
    );
    const maxWidth = width - PAD_X * 2;
    while (size > 5 && lineWidth(size) > maxWidth) {
      size -= 0.5;
    }

    // Vertically center the line within the box.
    const textY =
      y + (height - (ascent - descent) * size) / 2 - descent * size;

    // The overall line is RTL when the value starts with a strong Arabic
    // character; right-align it then, left-align otherwise.
    const total = lineWidth(size);
    const startRtl = !!String(rawValue)
      .trimStart()
      .match(/^[؀-ۿ]/);
    let cursorX = startRtl ? x + width - PAD_X - total : x + PAD_X;

    // Runs are already in visual (left-to-right) order; draw them in turn.
    for (const r of runs) {
      page.drawText(r.text, {
        x: cursorX,
        y: textY,
        size,
        font: arabicFont,
      });
      cursorX += arabicFont.widthOfTextAtSize(r.text, size);
    }
  };

  // Draw a short mark centered in a field's box, regardless of whether the
  // field is a checkbox or a text field. The specialite fields are checkboxes
  // on the master templates but text fields on older ones, so callers that
  // mark a choice go through this instead of assuming a type.
  const markField = (fieldName, mark = "X") => {
    let widget;
    for (const getter of ["getCheckBox", "getTextField"]) {
      try {
        widget = form[getter](fieldName).acroField.getWidgets()[0];
        break;
      } catch {
        // wrong type or not present — try the next getter
      }
    }
    if (!widget) return; // field not present in this PDF
    const { x, y, width, height } = widget.getRectangle();
    const page = pageOf(widget);

    // Fit the mark inside the box (with a little padding) and center it.
    let size = Math.max(6, Math.min(height, width) * 0.9);
    const maxWidth = width - PAD_X * 2;
    while (size > 5 && arabicFont.widthOfTextAtSize(mark, size) > maxWidth) {
      size -= 0.5;
    }
    const markWidth = arabicFont.widthOfTextAtSize(mark, size);
    const textX = x + (width - markWidth) / 2;
    const textY =
      y + (height - (ascent - descent) * size) / 2 - descent * size;
    page.drawText(mark, { x: textX, y: textY, size, font: arabicFont });
  };

  // Tick a checkbox field by name. We don't rely on field.check() +
  // form.flatten(): this PDF's checkbox "on" appearance draws its tick with
  // a dingbat font whose BBox is in absolute page coordinates, which
  // flatten() mis-transforms (the tick lands off-box). Instead we draw an
  // "X" directly into the widget's rectangle, the same way drawInField
  // draws text — so it survives flatten() and is always visible.
  const checkBox = (fieldName) => markField(fieldName, "X");

  return { drawInField, checkBox, markField };
};
