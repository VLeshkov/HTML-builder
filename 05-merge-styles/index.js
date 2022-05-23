const path = require('path');
const fs = require('fs');

const createBundleAsync = async () => {
  const data = new Buffer.from('');
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  return new Promise (
    (resolve, reject) => fs.writeFile(bundlePath, data, (err) => {
      if (err) return reject(err.message);
      resolve();
    })
  );
};

const appendFileAsync = async (path, data) => {
  fs.appendFile(path, data, (err) => {
    if (err) console.log(err.message);
  });
};

createBundleAsync()
  .then(
    fs.promises.readdir(path.join(__dirname, 'styles'))
      .then((files) => {
        for (let file of files) {
          if (path.extname(file) === '.css') {
            const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
            const readStream = fs.createReadStream(path.join(__dirname, 'styles', file));

            readStream.on('data', data => appendFileAsync(bundlePath, data));
          }
        }
      })
  );