const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');
const searchFiles = async () => {
  const files = await fsPromises.readdir(secretFolder, { withFileTypes: true });
  files.forEach(el => {
    if (el.isFile()) {
      fs.stat(path.join(secretFolder, el.name), (err, stats) => {
        const elExt = path.extname(el.name);
        const elName = path.basename(el.name, elExt);
        const elSize = stats.size;
        console.log(`${elName} — ${elExt.slice(1)} — ${elSize}byte`);
      });
    }
  });
};
searchFiles();
