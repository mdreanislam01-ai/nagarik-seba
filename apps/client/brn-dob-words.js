/* Birth Registration - auto Date of Birth in words.
 * Schema: apps/client/Birth_Registration_Certificate_V2_schema_properties.json
 * When the "Date of Birth*" field in the birth-registration form changes,
 * the "Date of Birth in Word" field is filled automatically, e.g.
 * 11/08/2003 -> "Eleventh August two thousand three".
 * It also runs after the document auto-fill (nsDocAutoFill) finishes,
 * so a date read from an uploaded certificate gets its word form too.
 */
(function () {
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
    'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
    'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty',
    'seventy', 'eighty', 'ninety'];
  var ORDINALS = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth',
    'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth',
    'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth',
    'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second',
    'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth',
    'twenty-seventh', 'twenty-eighth', 'twenty-ninth', 'thirtieth',
    'thirty-first'];

  function numToWords(n) {
    if (n < 20) return ONES[n];
    var t = Math.floor(n / 10), r = n % 10;
    return r ? TENS[t] + '-' + ONES[r] : TENS[t];
  }
  function yearToWords(y) {
    if (y >= 2000 && y < 2100) {
      var rest = y - 2000;
      return rest === 0 ? 'two thousand' : 'two thousand ' + numToWords(rest);
    }
    var century = Math.floor(y / 100), rem = y % 100;
    if (rem === 0) return numToWords(century) + ' hundred';
    return numToWords(century) + ' ' + numToWords(rem);
  }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function dateToWords(v) {
    if (!v) return '';
    v = String(v).trim();
    var day, month, year, m;
    m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) { year = +m[1]; month = +m[2]; day = +m[3]; }
    else {
      m = v.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
      if (m) { day = +m[1]; month = +m[2]; year = +m[3]; }
      else {
        m = v.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
        if (m) {
          day = +m[1]; year = +m[3];
          month = MONTHS.findIndex(function (mo) {
            return mo.toLowerCase() === m[2].toLowerCase() ||
              mo.toLowerCase().slice(0, 3) === m[2].toLowerCase().slice(0, 3);
          }) + 1;
        }
      }
    }
    if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12) return '';
    return cap(ORDINALS[day]) + ' ' + MONTHS[month - 1] + ' ' + yearToWords(year);
  }

  function labelText(field) {
    var lab = field.querySelector('label');
    return lab ? lab.textContent.trim() : '';
  }
  function fillWordFromDob(grid, force) {
    if (!grid) return;
    var dobEl = null, wordEl = null;
    grid.querySelectorAll('.brn-field').forEach(function (field) {
      var txt = labelText(field);
      var inp = field.querySelector('input, textarea');
      if (!inp) return;
      if (txt === 'Date of Birth*' || txt === 'Date of Birth') dobEl = inp;
      if (txt === 'Date of Birth in Word') wordEl = inp;
    });
    if (!dobEl || !wordEl) return;
    var w = dateToWords(dobEl.value);
    if (!w) return;
    if (force || !wordEl.value.trim()) wordEl.value = w;
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('input', function (e) {
      var t = e.target;
      if (!t || t.tagName !== 'INPUT') return;
      var grid = t.closest ? t.closest('.brn-grid') : null;
      if (!grid) return;
      var field = t.closest ? t.closest('.brn-field') : null;
      if (!field) return;
      var txt = labelText(field);
      if (txt === 'Date of Birth*' || txt === 'Date of Birth') fillWordFromDob(grid, true);
    });
    // After document auto-fill sets values programmatically (no input event),
    // fill the word field from the date it just filled.
    if (typeof nsDocAutoFill === 'function') {
      var origAutoFill = nsDocAutoFill;
      nsDocAutoFill = async function () {
        var result = await origAutoFill.apply(this, arguments);
        try {
          document.querySelectorAll('.brn-grid').forEach(function (grid) {
            fillWordFromDob(grid, false);
          });
        } catch (e) { /* keep the original auto-fill result */ }
        return result;
      };
    }
  }
  if (typeof globalThis !== 'undefined') globalThis.nsDateToWords = dateToWords;
})();
