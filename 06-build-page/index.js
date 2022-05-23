const path = require('path');
const fs = require('fs');

const copyFiles = async (sourceDir) => {
  fs.promises.readdir(path.join(__dirname, sourceDir), {withFileTypes: true})
    .then((files) => {
      for (let file of files) {
        if (file.isDirectory()) {
          const newSourceDir = path.join(`${sourceDir}`, `${file.name}`);
          fs.promises.mkdir(path.join(__dirname, 'project-dist', newSourceDir),{recursive: true})
            .then(() => copyFiles(newSourceDir));          

        } else {
          const source = path.join(__dirname, sourceDir, file.name);
          const target = path.join(__dirname, 'project-dist', `${sourceDir}`, file.name);
          fs.copyFile(source, target, (err) => {
            if (err) console.log(err.message);
          });
        }
      }
    });
};

const appendFileAsync = async (path, data) => {
  fs.appendFile(path, data, (err) => {
    if (err) console.log(err.message);
  });
};

const mergeCSS = async () => {
  fs.promises.readdir(path.join(__dirname, 'styles'))
    .then((files) => {
      for (let file of files) {
        if (path.extname(file) === '.css') {
          const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
          const readStream = fs.createReadStream(path.join(__dirname, 'styles', file));

          readStream.on('data', data => appendFileAsync(bundlePath, data));
        }
      }
    })
    .catch((err) => console.log(err));
};

const mergeHTML = async () => {

  const getDataHTML = async (line) => {

    // let data;

    // if (line.includes('{{')) {
      
    //   const fileName = line.trim().split('').filter(char => char !== '{' && char !== '}').join('');

    //   fs.promises.readFile(path.join(__dirname, 'components', fileName + '.html'), 'utf-8')
    //     .then(content => data = content)
    //     .catch(err => console.log(err));
    // } else {
    //   data = line;
    // }

    if (line.includes('{{')) {
      
      const fileName = line.trim().split('').filter(char => char !== '{' && char !== '}').join('');

      fs.promises.readFile(path.join(__dirname, 'components', fileName + '.html'), 'utf-8')
        .then(data => {
          fs.promises.appendFile(path.join(__dirname, 'project-dist', 'index.html'), data + '\n');
        })
        .catch(err => console.log(err));
    } else {
      fs.promises.appendFile(path.join(__dirname, 'project-dist', 'index.html'), line + '\n');
    }

    // console.log(data);

    // return data + '\n';
  };

  fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8')
    .then(content => {
      const contentArray = content.split('\n');
      return contentArray;
    })
    .then(content => {
      for (let i = 0; i < content.length; i += 1) {
        getDataHTML(content[i]);
        // fs.promises.appendFile(path.join(__dirname, 'project-dist', 'index.html'), getDataHTML(content[i]));
      }
    });
};

const createIndexHtml = async () => {
  fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), '')
    .catch(err => console.log(err));
};

fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'),{recursive: true})
  .then(() => copyFiles(path.join('assets')))
  .then(() => mergeCSS())
  .then(() => createIndexHtml())
  .then(() => mergeHTML())
  .catch(err => console.log(err));

