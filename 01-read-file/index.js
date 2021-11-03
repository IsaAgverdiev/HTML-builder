const fs = require('fs');
const path = require('path');

const pathTextFile = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(pathTextFile);

readStream.on('data', chunk => {
  console.log(chunk.toString());
});
