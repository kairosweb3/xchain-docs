const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

const repoUrl = 'https://github.com/xchainjs/xchainjs-lib.git';
const cloneDir = path.join(__dirname, 'xchainjs-lib');
const packagesDir = path.join(cloneDir, 'packages');
const getDocsOutputBaseDir = (name) => path.join(__dirname, name, 'docs');

if (fs.existsSync(cloneDir)) {
  console.log('Updating repository...');
  shell.cd(cloneDir);
  shell.exec('git pull');
} else {
  console.log('Cloning repository...');
  shell.exec(`git clone ${repoUrl} "${cloneDir}"`);
}

shell.cd(packagesDir);

shell.exec('yarn install');
shell.exec('yarn build');

fs.readdir(packagesDir, { withFileTypes: true }, (err, dirs) => {
  if (err) {
    console.error('Error reading package disrectory:', err);
    return;
  }

  dirs.forEach(dir => {

    docsOutputDir = getDocsOutputBaseDir(dir.name)

    if (!fs.existsSync(docsOutputDir)) {
        fs.mkdirSync(docsOutputDir);
    }

    if (dir.isDirectory()) {
      const packageDir = path.join(packagesDir, dir.name);
      console.log(`Generating docs ${dir.name} in ${docsOutputDir}`);
      shell.cd(packageDir);

      shell.exec(`npx typedoc --out ${docsOutputDir} src`);
    }
  });
});

console.log('Done!');
