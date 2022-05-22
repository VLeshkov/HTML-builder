const { stdout } = process;
const path = require('path');
const fs = require('fs'); 

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'));
readStream.on('data', data => stdout.write(data));