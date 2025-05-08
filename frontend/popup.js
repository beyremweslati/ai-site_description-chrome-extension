document.getElementById('checkButton').addEventListener('click', async () => {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'none';
    let url = ""
    if (document.getElementById("url").value) {
        url = document.getElementById("url").value;

    } else {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        url = tab.url;
    }
    if (url) {
        try {
            const response = await fetch('http://localhost:8000/check_url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
            });
            const data = await response.json();
            resultDiv.textContent = `${data.result}`;
            resultDiv.classList.remove('alert-danger', 'alert-success'); // Remove specific styling for phishing check
            if (data.result === "Phishing") {
                resultDiv.classList.add('alert-danger');
            } else {
                resultDiv.classList.add('alert-success');
            }
            resultDiv.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            resultDiv.textContent = 'Error retrieving website description.';
            resultDiv.classList.add('alert-danger');
            resultDiv.style.display = 'block';
        }
    } else {
        console.log('No URL found in current tab');
    }
});