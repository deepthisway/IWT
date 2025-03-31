const fs = require('fs');  
const zlib = require('zlib'); // lib for compressing the file
const readline = require('readline');   // lib for updating the progress

function compressFile(inputPath, outputPath) {
    const originalSize = fs.statSync(inputPath).size;   // fetches size
    console.log(`Original Size: ${(originalSize / 1024).toFixed(2)} KB\n`);

    const readStream = fs.createReadStream(inputPath); // read chunk by chunk
    const writeStream = fs.createWriteStream(outputPath);
    const gzip = zlib.createGzip();
    
    readStream.on('data', () => showProgress(readStream.bytesRead, originalSize)); //The data event is triggered every time a chunk of data is read.

    writeStream.on('finish', () => {
        const compressedSize = fs.statSync(outputPath).size; 
        console.log(`\nCompressed Size: ${(compressedSize / 1024).toFixed(2)} KB`);
        console.log(`Compression Ratio: ${(compressedSize / originalSize * 100).toFixed(2)}%`);
    });

    readStream.pipe(gzip).pipe(writeStream);
}

function showProgress(bytesRead, totalSize) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Compressing: ${(bytesRead / totalSize * 100).toFixed(2)}%`);
}

compressFile('input.txt', 'input.txt.gz');
