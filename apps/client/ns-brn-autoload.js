    function doLoad() {
        var brn = (el('ns-aload-brn').value || '').trim();
        var dob = (el('ns-aload-dob').value || '').trim();
        
        if (!brn) { fail('Birth Registration Number লিখুন.'); return; }
        if (!dob) { fail('জন্ম তারিখ বসান।'); return; }

        var loadBtn = document.querySelector('.ns-aload-load');
        var originalText = loadBtn.innerText;
        loadBtn.disabled = true;
        loadBtn.innerText = "Loading...";

        // API URL
        var apiUrl = `https://lmnxbirth-cirtificate-api-pdf.vercel.app?brn=${encodeURIComponent(brn)}&dob=${encodeURIComponent(dob)}`;

        // Create a hidden iframe
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = apiUrl;
        document.body.appendChild(iframe);

        // Wait for iframe to load
        iframe.onload = function() {
            try {
                // Try to trigger download from the iframe's content
                // Some APIs have a specific button or link inside the iframe
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                
                // Method A: If there is a specific download link/button in the iframe
                var downloadLink = iframeDoc.querySelector('a[href$=".pdf"]') || iframeDoc.querySelector('button[onclick*="download"]');
                
                if (downloadLink) {
                    // Simulate click on the download link
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true
                    });
                    downloadLink.dispatchEvent(event);
                } else {
                    // Method B: Fallback - Force download the iframe content as PDF
                    // This works if the iframe contains the raw PDF data or a simple HTML page
                    alert("PDF ডাউনলোড শুরু হচ্ছে...");
                    
                    // Create a blob from the iframe's HTML content
                    var htmlContent = iframeDoc.documentElement.outerHTML;
                    var blob = new Blob([htmlContent], { type: 'application/pdf' });
                    var url = window.URL.createObjectURL(blob);
                    
                    var link = document.createElement('a');
                    link.href = url;
                    link.download = `BRN_${brn}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }
            } catch (e) {
                console.error("Iframe error:", e);
                // Final fallback: Open in new tab
                window.open(apiUrl, '_blank');
            } finally {
                // Cleanup
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    loadBtn.disabled = false;
                    loadBtn.innerText = originalText;
                }, 2000); // Give some time for download to start
            }
        };

        iframe.onerror = function() {
            fail("ডাটা লোড করতে সমস্যা হয়েছে।");
            loadBtn.disabled = false;
            loadBtn.innerText = originalText;
            document.body.removeChild(iframe);
        };
    }
