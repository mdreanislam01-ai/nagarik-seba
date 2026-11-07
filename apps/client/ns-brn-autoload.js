    function doLoad() {
        var brn = (el('ns-aload-brn').value || '').trim();
        var dob = (el('ns-aload-dob').value || '').trim();
        var cap = (el('ns-aload-cap').value || '').trim();

        if (!brn) { fail('Birth Registration Number লিখুন.'); return; }
        if (!dob) { fail('জন্ম তারিখ বসান।'); return; }
        if (!cap) { fail('ক্যাপচা ইনপুট লিখুন।'); return; }

        if (parseInt(cap, 10) !== capAns) {
            fail('ক্যাপচা ইনপুট সঠিক নয় — নতুন ক্যাপচা দেখুন।');
            capRefresh();
            return;
        }

        // Loading State
        var loadBtn = document.querySelector('.ns-aload-load');
        var originalText = loadBtn.innerText;
        loadBtn.disabled = true;
        loadBtn.innerText = "Loading...";

        // API URL Construction
        var apiUrl = `https://lmnxbirth-cirtificate-api-pdf.vercel.app?brn=${encodeURIComponent(brn)}&dob=${encodeURIComponent(dob)}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                return response.text(); // Get raw HTML content
            })
            .then(htmlContent => {
                // Create a Blob from the HTML response
                var blob = new Blob([htmlContent], { type: 'text/html' });
                var url = window.URL.createObjectURL(blob);
                
                // Trigger Download
                var link = document.createElement('a');
                link.href = url;
                link.download = `BRN_${brn}_Certificate.html`; // You can change extension to .pdf if needed, but HTML is safer for this API
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                // Fill Form Fields (Optional but recommended)
                fillFormFields(brn, dob);

                closePopup();
                alert("PDF/Document downloaded successfully!");
            })
            .catch(error => {
                console.error('Fetch error:', error);
                fail("ডাটা লোড করতে সমস্যা হয়েছে।");
            })
            .finally(() => {
                loadBtn.disabled = false;
                loadBtn.innerText = originalText;
            });
    }

    // Helper function to fill form fields
    function fillFormFields(brn, dob) {
        var card = ctxCard;
        var grid = card ? card.querySelector('.brn-grid') : document.querySelector('.brn-grid');
        if (grid) {
            var fields = grid.querySelectorAll('.brn-field');
            if (fields && fields.length >= 11) {
                var brnIn = fields[3].querySelector('input, select, textarea');
                var dobIn = fields[9].querySelector('input, select, textarea');
                
                if (brnIn) setVal(brnIn, brn);
                if (dobIn) {
                    var ddmmyyyy = dob;
                    var m = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                    if (m) ddmmyyyy = m[3] + '/' + m[2] + '/' + m[1];
                    setVal(dobIn, ddmmyyyy);
                }
            }
        }
                }
