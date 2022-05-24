const path = require('path');
const fs = require('fs');

function copyFiles(sourceDir) {
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
}

function appendIntoFile(path, data) {
  fs.appendFile(path, data, (err) => {
    if (err) console.log(err.message);
  });
}

function mergeCSS() {
  fs.promises.readdir(path.join(__dirname, 'styles'))
    .then((files) => {
      for (let file of files) {
        if (path.extname(file) === '.css') {
          const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
          const readStream = fs.createReadStream(path.join(__dirname, 'styles', file));

          readStream.on('data', data => appendIntoFile(bundlePath, data));
        }
      }
    })
    .catch((err) => console.log(err));
}

function mergeHTML() {
  fs.promises.readdir(path.join(__dirname, 'components'))
    .then((files) => {
      const components = files.filter((file) => path.extname(file) === '.html')
        .map((file) => file.replace('.html', ''));

      fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8')
        .then((templateContent) => {
          return Promise.all(
            components.map((component) =>
              fs.promises.readFile(path.join(__dirname, 'components', `${component}.html`), 'utf-8')
                .then((componentContent) => {
                  templateContent = templateContent.replace(`{{${component}}}`, componentContent);
                  return templateContent;
                })
            ));
        }).then((templateContent) => {
          fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), templateContent.slice(-1)[0]);
        });
    });
}

fs.promises.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true })
  .then(() => {
    fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'),{ recursive: true })
      .then(() => copyFiles(path.join('assets')))
      .then(() => mergeCSS())
      .then(() => mergeHTML())
      .catch(err => console.log(err));
  });
