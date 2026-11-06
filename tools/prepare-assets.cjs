'use strict';
const fs = require('node:fs');
const path = require('node:path');
const themeTarget=path.join(__dirname,'../themes/redefine');
fs.rmSync(themeTarget,{recursive:true,force:true});
fs.cpSync(path.dirname(require.resolve('hexo-theme-redefine/package.json')),themeTarget,{recursive:true});
fs.cpSync(path.join(__dirname,'../theme-overrides/redefine'),themeTarget,{recursive:true});
const target = path.join(__dirname,'../source/vendor/katex');
const dist = path.dirname(require.resolve('katex/dist/katex.min.css'));
fs.mkdirSync(target,{recursive:true});
fs.copyFileSync(path.join(dist,'katex.min.css'),path.join(target,'katex.min.css'));
fs.cpSync(path.join(dist,'fonts'),path.join(target,'fonts'),{recursive:true});
fs.copyFileSync(path.join(dist,'../LICENSE'),path.join(target,'LICENSE'));
console.log('Prepared local KaTeX assets.');

fs.cpSync(target,path.join(__dirname,'../themes/arclab/source/vendor/katex'),{recursive:true});
