'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root=path.resolve(__dirname,'../public');
const catalog=require('../source/_data/learning.json');
const required=['index.html','learn/index.html','about/index.html','projects/index.html','contribute/index.html','404.html',...catalog.lessons.map(l=>`learn/${l.slug}/index.html`)];
const failures=[];
for(const file of required) {
  const target=path.join(root,file);
  if(!fs.existsSync(target)){failures.push(`Missing page: ${file}`);continue;}
  const html=fs.readFileSync(target,'utf8');
  if(!html.includes('<html lang="zh-CN">')||!html.includes('<main id="main">'))failures.push(`Incomplete layout: ${file}`);
  if(/href="javascript:/i.test(html))failures.push(`Unsafe link: ${file}`);
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for(const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    const value=match[1].replaceAll('&amp;','&');
    if(value.startsWith('#')) {
      if(!ids.has(decodeURIComponent(value.slice(1)))) failures.push(`Broken anchor in ${file}: ${value}`);
      continue;
    }
    if(!value.startsWith('/')||value.startsWith('//'))continue;
    const destination=decodeURIComponent(value.split(/[?#]/)[0]);
    const local=path.join(root,destination);
    if(!fs.existsSync(local)&&!fs.existsSync(path.join(local,'index.html')))failures.push(`Broken local URL in ${file}: ${value}`);
  }
}
const math=fs.readFileSync(path.join(root,'learn/markdown/index.html'),'utf8');
if(!math.includes('class="katex"'))failures.push('Math renderer did not produce KaTeX markup.');
if(failures.length){console.error([...new Set(failures)].join('\n'));process.exit(1);}
console.log(`Checked ${required.length} pages: layouts, assets, local URLs, anchors, and math output.`);
