const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, () => {});

fs.readdir(path.join(__dirname, 'files-copy'), { withFileTypes: true }, (err, files) => {
  for (let file of files) {
    fs.unlink(path.join(__dirname, 'files-copy', file.name), err => {});
  }

  fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (err, files) => {
    for (let file of files) {
      fs.copyFile(
        path.join(__dirname, 'files', file.name),
        path.join(__dirname, 'files-copy', file.name),
        () => {}
      );
    }
  });
});
