// index.html의 CSS·JS 주소 뒤 ?v=... 를 현재 시각으로 바꿔, 휴대폰이 예전 파일을 쓰지 않게 한다.
// 실행: node invite/tools/bump_version.js  (올리기 전에 한 번)
const fs = require('fs');
const path = require('path');
const f = path.join(__dirname, '..', 'index.html');
const v = new Date().toISOString().replace(/\D/g, '').slice(0, 12);
const html = fs.readFileSync(f, 'utf8').replace(/\?v=[\w]+/g, `?v=${v}`);
fs.writeFileSync(f, html);
console.log('version', v);
