const path = require('path');
const fs = require('fs');

const copyFiles = async (dir) => {
  fs.promises.readdir(path.join(__dirname, dir))
    .then((files) => {
      for (let file of files) {
        const source = path.join(__dirname, dir, file);
        const target = path.join(__dirname, `${dir}-copy`, file);

        fs.copyFile(source, target, (err) => {
          if (err) throw err.message;
        });
      }
    });
};

const duplicateDir = async (dir) => {
  fs.promises.mkdir(path.join(__dirname, `${dir}-copy`), {recursive: true})
    .then(() => copyFiles(dir));
};

fs.promises.rm(path.join(__dirname, 'files-copy'), {recursive: true})
  .then(() => duplicateDir('files'))
  .catch(() => duplicateDir('files'));
