const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'views');

function checkFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('navigate')) {
      console.log(`${filepath}:${idx + 1}: ${line.trim()}`);
    }
  });
}

if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory() && (file.endsWith('.jsx') || file.endsWith('.js'))) {
      checkFile(fullPath);
    }
  }
}
