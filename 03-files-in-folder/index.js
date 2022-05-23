const path = require('path');
const fs = require('fs');

fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})
  .then(filenames => {
    for (let filename of filenames) {
      if (filename.isFile()) { 

        const fPath = path.join(__dirname, 'secret-folder', filename.name);

        fs.stat(fPath, (err, stats) => {
          if (err) console.log(err);

          const result = [filename.name.split('.')[0], 
            path.extname(filename.name).slice(1), 
            (stats.size / 1024).toFixed(3) + ' kb'];

          console.log(result.join(' - '));
        });
      }
    }
  });
