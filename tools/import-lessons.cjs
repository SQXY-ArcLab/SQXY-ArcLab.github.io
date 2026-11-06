'use strict';
const fs = require('node:fs');
const path = require('node:path');
const site = path.resolve(__dirname,'..');
const workspace = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(site,'..');
const catalog = JSON.parse(fs.readFileSync(path.join(site,'source/_data/learning.json'),'utf8'));
const mapping = new Map(catalog.lessons.map(l => [path.basename(l.file), `/learn/${l.slug}/`]));
for (const lesson of catalog.lessons) {
  const input=path.join(workspace,lesson.file);
  if (!fs.existsSync(input)) throw new Error(`Missing source: ${input}`);
  let content=fs.readFileSync(input,'utf8').replace(/\r\n/g,'\n');
  content=content.replace(/^---\n[\s\S]*?\n---\n/,'').replace(/^# [^\n]*\n/,'').trim();
  content=content.replace(/\]\(([^)]+\.md)(#[^)]*)?\)/g, (match, target, anchor='') => {
    const destination=mapping.get(path.basename(target));
    return destination ? `](${destination}${anchor})` : match;
  });
  content=content.replace(/\]\(javascript:;\)/g,']');
  const group=catalog.groups.find(g => g.id===lesson.group);
  const front=['---',`title: ${JSON.stringify(lesson.title)}`,'layout: lesson',`description: ${JSON.stringify(lesson.description)}`,`category_label: ${JSON.stringify(group.title)}`,`lesson_slug: ${lesson.slug}`,'---',''].join('\n');
  const dir=path.join(site,'source/learn',lesson.slug);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.md'),front+content+'\n');
}
console.log(`Imported ${catalog.lessons.length} tutorials; internal planning documents excluded.`);
