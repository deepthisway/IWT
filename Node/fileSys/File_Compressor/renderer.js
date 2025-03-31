document.getElementById('compressBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput').files[0];
    if (!fileInput) {
        alert('Please select a file.');
        return;
    }

    const filePath = fileInput.path;
    window.electronAPI.compressFile(filePath);
});

window.electronAPI.onProgressUpdate((progress) => {
    document.getElementById('progressBar').value = progress;
    document.getElementById('progressText').innerText = `Progress: ${progress}%`;
});

window.electronAPI.onCompressionComplete((data) => {
    document.getElementById('result').innerHTML = `
        <p>Original Size: ${data.originalSize} KB</p>
        <p>Compressed Size: ${data.compressedSize} KB</p>
        <p>Compression Ratio: ${data.compressionRatio}%</p>
    `;
});
