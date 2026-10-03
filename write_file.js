const fs = require('fs');
const path = require('path');

function safeWrite(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[SAVED] ${filePath} (${fs.statSync(filePath).size} bytes)`);
}

module.exports = { safeWrite };
