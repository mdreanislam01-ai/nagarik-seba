/* Birth Registration - automatic PDF download on order.
 * This is NOT an official certificate and has no government logo, seal
 * or official layout. It is a plain summary of the information the user
 * entered in the birth-registration form, with the site's disclaimer.
 * Wraps nsOrderSubmit: after a successful 'brn' order, a PDF is
 * generated from the form fields captured before submission and
 * downloaded automatically, without waiting for any further click.
 */
(function () {
  function escPdf(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }
  function asciiOnly(s) {
    return String(s).replace(/[^\x20-\x7E]/g, '');
  }
  function safeFileName(s) {
    return String(s || '').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'Birth-Registration';
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }

  function fallbackTextPdf(fields, filename) {
    // Minimal PDF, Latin text only, used only if jsPDF cannot be loaded.
    var lines = ['Birth Registration - Information Summary', '',
      'This is a summary of the information you entered.',
      'Do not use this document for government work.', ''];
    fields.forEach(function (f) {
      if (f.value) lines.push(f.field + ': ' + f.value);
    });
    var content = 'BT /F1 11 Tf 40 800 Td ';
    lines.forEach(function (line, i) {
      if (i) content += '0 -18 Td ';
      content += '(' + escPdf(asciiOnly(line)) + ') Tj ';
    });
    content += 'ET';
    var objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      '<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream'
    ];
    var pdf = '%PDF-1.4\n', offsets = [];
    objects.forEach(function (obj, i) {
      offsets.push(pdf.length);
      pdf += (i + 1) + ' 0 obj\n' + obj + '\nendobj\n';
    });
    var xrefPos = pdf.length;
    pdf += 'xref\n0 ' + (objects.length + 1) + '\n0000000000 65535 f \n';
    offsets.forEach(function (off) { pdf += ('0000000000' + off).slice(-10) + ' 00000 n \n'; });
    pdf += 'trailer << /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefPos + '\n%%EOF';
    downloadBlob(new Blob([pdf], { type: 'application/pdf' }), filename);
  }

  function loadJsPdf() {
    return new Promise(function (resolve) {
      if (window.jspdf && window.jspdf.jsPDF) return resolve(window.jspdf.jsPDF);
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload = function () { resolve(window.jspdf ? window.jspdf.jsPDF : null); };
      s.onerror = function () { resolve(null); };
      document.head.appendChild(s);
    });
  }

  function wrapText(ctx, text, maxWidth) {
    var words = String(text).split(/\s+/), lines = [], line = '';
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
      else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  async function downloadBrnPdf(fields) {
    var brn = '', nameEn = '';
    fields.forEach(function (f) {
      if (f.field.indexOf('Birth Registration Number') !== -1) brn = f.value;
      if (f.field === 'Name') nameEn = f.value;
    });
    var filename = 'Birth-Registration-' + safeFileName(brn || nameEn || 'Summary') + '.pdf';
    var JsPdf = await loadJsPdf();
    if (!JsPdf) { fallbackTextPdf(fields, filename); return; }
    try {
      var canvas = document.createElement('canvas');
      canvas.width = 1240; var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 1240, 1754);
      ctx.fillStyle = '#111111'; ctx.font = 'bold 44px sans-serif';
      ctx.fillText('Birth Registration - Information Summary', 60, 90);
      ctx.font = '28px sans-serif'; ctx.fillStyle = '#555555';
      ctx.fillText('Summary of the information you entered in the form.', 60, 140);
      var y = 210;
      ctx.font = '28px sans-serif';
      fields.forEach(function (f) {
        if (!f.value) return;
        var label = f.field.replace(/\*$/, '');
        ctx.fillStyle = '#2563eb'; ctx.font = 'bold 28px sans-serif';
        wrapText(ctx, label, 1100).forEach(function (l) { ctx.fillText(l, 60, y); y += 38; });
        ctx.fillStyle = '#111111'; ctx.font = '28px sans-serif';
        wrapText(ctx, String(f.value), 1100).forEach(function (l) { ctx.fillText(l, 60, y); y += 38; });
        y += 16;
        if (y > 1600) { /* keep to one page; extra fields are in the form */ }
      });
      ctx.fillStyle = '#b91c1c'; ctx.font = '26px sans-serif';
      wrapText(ctx, 'Do not use this document for government work. / এখানের কোন ডকুমেন্ট সরকারি কাজে ব্যবহার করবেন না', 1100)
        .forEach(function (l) { ctx.fillText(l, 60, y); y += 36; });
      var img = canvas.toDataURL('image/jpeg', 0.92);
      var doc = new JsPdf({ unit: 'pt', format: 'a4' });
      var pageW = 595, imgH = pageW * (canvas.height / canvas.width);
      doc.addImage(img, 'JPEG', 0, 0, pageW, Math.min(imgH, 842));
      doc.save(filename);
    } catch (e) {
      fallbackTextPdf(fields, filename);
    }
  }

  if (typeof nsOrderSubmit === 'function') {
    var origOrder = nsOrderSubmit;
    nsOrderSubmit = async function (kind, id, root) {
      var isBrn = kind === 'service' && id === 'brn';
      var fields = null;
      if (isBrn) {
        try {
          var def = (typeof SERVICES !== 'undefined') ? SERVICES.find(function (x) { return x.id === 'brn'; }) : null;
          var card = root || document.querySelector('#main .card');
          if (def && typeof nsOrderPayload === 'function') fields = nsOrderPayload(def, card).fields;
        } catch (e) { fields = null; }
      }
      var result = await origOrder.apply(this, arguments);
      try {
        if (isBrn && fields && fields.length) {
          var titleEl = document.querySelector('.ns-rch-title');
          if (titleEl && titleEl.textContent.trim() === 'অর্ডার সফল') {
            await downloadBrnPdf(fields);
          }
        }
      } catch (e) { /* order already succeeded; PDF failure must not undo it */ }
      return result;
    };
  }
})();
