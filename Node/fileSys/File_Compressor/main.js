const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile('index.html');
});

// Listen for file compression request
ipcMain.on('compress-file', (event, filePath) => {
    const outputPath = filePath + '.gz';
    const originalSize = fs.statSync(filePath).size;
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(outputPath);
    const gzip = zlib.createGzip();

    readStream.on('data', () => {
        let progress = (readStream.bytesRead / originalSize) * 100;
        mainWindow.webContents.send('update-progress', progress.toFixed(2));
    });

    writeStream.on('finish', () => {
        const compressedSize = fs.statSync(outputPath).size;
        mainWindow.webContents.send('compression-complete', {
            originalSize: (originalSize / 1024).toFixed(2),
            compressedSize: (compressedSize / 1024).toFixed(2),
            compressionRatio: ((compressedSize / originalSize) * 100).toFixed(2),
        });
    });

    readStream.pipe(gzip).pipe(writeStream);
});
