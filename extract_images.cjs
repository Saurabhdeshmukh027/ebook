const fs = require('fs');
const html = fs.readFileSync('navratri_pavti-1.html', 'utf8');
const imgMatches = [...html.matchAll(/src="(data:image\/[^"]+)"/g)];
console.log('Found ' + imgMatches.length + ' images');
imgMatches.forEach((m, i) => {
  const data = m[1];
  const ext = data.match(/data:image\/(\w+)/)[1];
  const base64 = data.split(',')[1];
  fs.mkdirSync('public/images/pavti', { recursive: true });
  const filename = 'public/images/pavti/img' + i + '.' + ext;
  fs.writeFileSync(filename, Buffer.from(base64, 'base64'));
  console.log('Extracted: ' + filename + ' - size: ' + Buffer.from(base64, 'base64').length + ' bytes');
});
