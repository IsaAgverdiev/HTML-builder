const fs = require('fs');
const path = require('path');

const allStyles = path.join(__dirname, 'styles');
const bundleCss = path.join(__dirname, 'project-dist/bundle.css');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
  if (err) throw err;
});
fs.writeFile(bundleCss, '', () => {});
fs.readdir(allStyles, { withFileTypes: true }, (err, files) => {
  for (let file of files) {
    let fileExt = path.extname(file.name).slice(1);
    if (fileExt === 'css') {
      fs.readFile(`${allStyles}/${file.name}`, 'utf-8', (err, data) => {
        if (err) throw err;
        else {
          fs.appendFile(bundleCss, data, err => {
            if (err) throw err;
          });
        }
      });
    }
  }
});
