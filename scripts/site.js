'use strict';
const katex = require('katex');
hexo.extend.generator.register('arclab-home', function() {
  return {path:'index.html', layout:['home'], data:{title:'连接知识的点，走出自己的弧光。'}};
});
// Render mathematics before Markdown, while keeping fenced examples untouched.
hexo.extend.filter.register('before_post_render', function(data) {
  let fence = null;
  let math = null;
  const result = [];
  const render = (value, display) => katex.renderToString(value, {
    displayMode:display, throwOnError:false, trust:false, strict:'ignore'
  });
  for (const line of data.content.split('\n')) {
    const boundary = line.match(/^\s*(`{3,}|~{3,})/);
    if (boundary && !math) {
      if (!fence) fence = {char:boundary[1][0], length:boundary[1].length};
      else if (boundary[1][0] === fence.char && boundary[1].length >= fence.length) fence = null;
      result.push(line); continue;
    }
    if (fence) {result.push(line); continue;}
    if (math) {
      if (line.trim() === '$$') {result.push('\n' + render(math.join('\n'),true) + '\n'); math = null;}
      else math.push(line);
      continue;
    }
    if (line.trim() === '$$') {math=[]; continue;}
    // Split inline-code spans so displayed syntax examples are never interpreted.
    const pieces = line.split(/(`+[^`]*`+)/g);
    result.push(pieces.map((piece,i) => i % 2 ? piece : piece
      .replace(/\$\$([^$]+)\$\$/g, (_,value) => render(value,true))
      .replace(/\\\((.+?)\\\)/g, (_,value) => render(value,false))
      .replace(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g, (_,value) => render(value,false))
    ).join(''));
  }
  if (math) result.push('$$',...math);
  data.content=result.join('\n');
  return data;
});
hexo.extend.generator.register('arclab-sitemap', function() {
  const base = hexo.config.url.replace(/\/$/, '');
  const paths = ['', 'learn/', 'about/', 'projects/', 'contribute/', ...hexo.locals.get('data').learning.lessons.map(l => `learn/${l.slug}/`)];
  return {path:'sitemap.xml', data:'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p => `<url><loc>${base}/${p}</loc></url>`).join('')+'</urlset>'};
});
hexo.extend.generator.register('arclab-robots', function() {
  return {path:'robots.txt', data:`User-agent: *\nAllow: /\nSitemap: ${hexo.config.url.replace(/\/$/,'')}/sitemap.xml\n`};
});
