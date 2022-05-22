const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');
const output = fs.createWriteStream(path.join(__dirname, 'output.txt'));

console.log('Hello! Enter the text:');

stdin.on('data', data => {
  const dataStringified = data.toString().trim();
  if (dataStringified == 'exit') process.exit();
  output.write(data);
});

process.on('exit', () => stdout.write('Bye!\n'));
process.on('SIGINT', () => {
  console.log('');
  process.exit();
});
