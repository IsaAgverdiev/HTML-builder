const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
  if (err) throw err;
});

// создание бандла CSS
function bundleCss() {
  const allStyles = path.join(__dirname, 'styles');
  const bundleCss = path.join(__dirname, 'project-dist/style.css');
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
}

// // копирование файлов assets
function copyAssets() {
  const assets = path.join(__dirname, 'assets');

  fs.readdir(assets, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    fs.mkdir('06-build-page/project-dist/assets', { recursive: true }, err => {
      if (err) throw err;
    });

    const assets2Level = path.join(__dirname, 'project-dist/assets');
    for (let file of files) {
      searchDepth(file);

      function searchDepth(item) {
        if (item.isFile()) {
          fs.readFile(`${assets}/${file.name}/${item.name}`, 'utf-8', (err, data) => {
            if (err) {
              throw err;
            } else {
              fs.writeFile(`${assets2Level}/${file.name}/${item.name}`, data, 'utf-8', err => {
                if (err) throw err;
              });
            }
          });
        } else {
          const assets3Level = path.join(__dirname, `assets/${item.name}`);
          fs.mkdir(`06-build-page/project-dist/assets/${item.name}`, { recursive: true }, err => {
            if (err) throw err;
          });

          fs.readdir(assets3Level, { withFileTypes: true }, (err, data) => {
            if (err) throw err;
            const assets2Level = path.join(__dirname, `project-dist/assets/${item.name}`);
            for (item of data) {
              searchDepth(item);
            }
          });
        }
      }
    }
  });
}

// // сборка htmk файла

async function writeHtml() {
  const projectDist = path.join(__dirname, 'project-dist');

  const readStreamTemplate = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const writeHtml = fs.createWriteStream(path.join(projectDist, 'index.html'));
  let template = '';

  readStreamTemplate.on('data', data => {
    template = data.toString();

    fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (err, items) => {
      if (err) throw new Error('Error');

      items.forEach((item, index) => {
        if (item.isFile() && path.parse(item.name).ext === '.html') {
          const readItem = fs.createReadStream(path.join(__dirname, 'components', item.name));

          const itemName = path.parse(item.name).name;
          const regexp = `{{${itemName}}}`;
          readItem.on('data', data => {
            template = template.replace(regexp, data.toString());
            if (index === items.length - 1) {
              writeHtml.write(template);
            }
          });
        }
      });
    });
  });
}

async function buildPage() {
  try {
    await writeHtml();
    bundleCss();
    copyAssets();
  } catch (err) {
    console.error(err);
  }
}

buildPage();
