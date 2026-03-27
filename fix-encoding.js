import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fixEncoding(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Buffer replacements using character codes to avoid syntax errors
  const replacements = [
    ['Ã©', 'é'], ['Ã¨', 'è'], ['Ã ', 'à'], ['Ãª', 'ê'],
    ['Ã§', 'ç'], ['Ã´', 'ô'], ['Ã¹', 'ù'], ['Ã»', 'û'],
    ['Ã¬', 'ì'], ['Ã®', 'î'], ['Ã€', 'À'], ['Ã‰', 'É'],
    ['ÃŠ', 'È'], ['ÃŒ', 'Ì'], ['ÃŽ', 'Î'], ['Ã«', 'ë'],
    ['Ã¯', 'ï'], ['Ã¶', 'ö'], ['Ã¤', 'ä'], ['Ã¼', 'ü'],
    ['Â«', 'À«'], ['Â»', 'À»'], ['Â·', 'À·']
  ];
  
  for (const [bad, good] of replacements) {
    while(content.includes(bad)) {
      content = content.replace(bad, good);
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed: ' + path.basename(filePath));
}

const frPath = path.join(__dirname, 'src/locales/fr.json');
const enPath = path.join(__dirname, 'src/locales/en.json');
fixEncoding(frPath);
fixEncoding(enPath);
console.log('Done');
