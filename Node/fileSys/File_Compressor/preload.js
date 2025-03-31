const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    compressFile: (filePath) => ipcRenderer.send('compress-file', filePath),
    onProgressUpdate: (callback) => ipcRenderer.on('update-progress', (_, progress) => callback(progress)),
    onCompressionComplete: (callback) => ipcRenderer.on('compression-complete', (_, data) => callback(data)),
});
