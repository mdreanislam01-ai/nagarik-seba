    function doLoad() {
        // 1. Get Input Values
        var brn = (el('ns-aload-brn').value || '').trim();
        var dob = (el('ns-aload-dob').value || '').trim();
        
        // Validate Inputs
        if (!brn) { fail('Birth Registration Number লিখুন.'); return; }
        if (!dob) { fail('জন্ম তারিখ বসান।'); return; }

        // UI Loading State
        var loadBtn = document.querySelector('.ns-aload-load');
        var originalText = loadBtn.innerText;
        loadBtn.disabled = true;
        loadBtn.innerText = "Loading...";

        // 2. Construct API URL
        // Note: Ensure the API accepts GET request with query parameters
        var apiUrl = `https://lmnxbirth-cirtificate-api-pdf.vercel.app?brn=${encodeURIComponent(brn)}&dob=${encodeURIComponent(dob)}`;

        // 3. Fetch Data and Trigger Direct Download
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                // We expect HTML/Content that contains the PDF or is the PDF itself
                return response.text(); 
            })
            .then(htmlContent => {
                // Create a Blob from the response
                // If the API returns HTML containing an iframe/object for PDF, this will download that HTML.
                // If the API returns raw PDF bytes, change type to 'application/pdf'
                
                var blob = new Blob([htmlContent], { type: 'application/pdf' }); 
                var url = window.URL.createObjectURL(blob);
                
                // Create a temporary anchor tag
                var link = document.createElement('a');
                link.href = url;
                link.download = `Birth_Certificate_${brn}.pdf`; // Filename
                
                // Append to body and click
                document.body.appendChild(link);
                link.click();
                
                // Cleanup
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                alert("PDF ডাউনলোড শুরু হয়েছে!");
            })
            .catch(error => {
                console.error('Fetch error:', error);
                fail("ডাটা লোড করতে সমস্যা হয়েছে।");
            })
            .finally(() => {
                // Reset Button
                loadBtn.disabled = false;
                loadBtn.innerText = originalText;
            });
    }
