document.getElementById('getTokenBtn').addEventListener('click', async () => {
    const output = document.getElementById('tokenOutput');
    
    try {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes("discord.com")) {
            output.textContent = "Hata: Lütfen discord.com adresinde açık bir sekmeye geçin!";
            output.style.borderLeftColor = "var(--norway-red)";
            output.classList.remove('hidden');
            return;
        }

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            world: "MAIN", 
            func: () => {
                try {
                    window.dispatchEvent(new Event('beforeunload'));
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                    const token = iframe.contentWindow.localStorage.getItem('token');
                    document.body.removeChild(iframe);
                    return token ? token.replace(/"/g, '') : null;
                } catch (e) {
                    return null;
                }
            }
        }).then((results) => {
            if (results && results[0] && results[0].result) {

                output.textContent = results[0].result;
                output.style.borderLeftColor = "var(--norway-blue)";
                output.classList.remove('hidden');
                
                navigator.clipboard.writeText(results[0].result);
                output.textContent += "\n\n(Token başarıyla kopyalandı!)";
            } else {
                output.textContent = "Token bulunamadı. Discord'a giriş yapmış olduğunuzdan emin olun.";
                output.style.borderLeftColor = "var(--norway-red)";
                output.classList.remove('hidden');
            }
        }).catch(err => {
            output.textContent = "Beklenmedik hata: " + err.message;
            output.classList.remove('hidden');
        });
        
    } catch (err) {
        output.textContent = "Sistem hatası: " + err.message;
        output.classList.remove('hidden');
    }
});