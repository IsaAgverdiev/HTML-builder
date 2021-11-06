const fs = require('fs');
const path = require('path');
const readline = require('readline');

const pathWriteText = path.join(__dirname, 'text-write.txt');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const writeStream = fs.createWriteStream(pathWriteText);

process.stdout.write(`Hello, write your text: \n`);
rl.on('line', input => {
  input.trim() == 'exit' ? rl.close() : writeStream.write(`${input} \n`);
});

rl.on('SIGINT', () => rl.close());

rl.on('close', () => {
  console.log('Good bye!');
  writeStream.end();
});
