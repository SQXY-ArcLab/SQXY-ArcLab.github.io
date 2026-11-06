document.addEventListener('DOMContentLoaded',()=>{
 const input=document.querySelector('#lesson-search');
 if(input) input.addEventListener('input',()=>{
  const query=input.value.trim().toLocaleLowerCase(); let count=0;
  document.querySelectorAll('.lesson-row').forEach(row=>{row.hidden=!row.dataset.search.toLocaleLowerCase().includes(query);if(!row.hidden)count++;});
  document.querySelectorAll('.lesson-group').forEach(group=>group.hidden=![...group.querySelectorAll('.lesson-row')].some(row=>!row.hidden));
  document.querySelector('#search-count').textContent=count+' 篇教程';document.querySelector('#search-empty').hidden=count!==0;
 });
 document.querySelectorAll('.prose pre').forEach(pre=>{
  const button=document.createElement('button');button.type='button';button.className='arc-copy';button.textContent='复制';button.setAttribute('aria-label','复制代码');
  button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pre.querySelector('code')?.textContent||pre.textContent.replace(/复制$/,''));button.textContent='已复制';}catch{button.textContent='复制失败';}setTimeout(()=>button.textContent='复制',1800);});pre.append(button);
 });
});
document.addEventListener('DOMContentLoaded',()=>{
 const toggle=document.createElement('button');toggle.type='button';toggle.className='arc-mode-toggle';toggle.textContent='◐';toggle.setAttribute('aria-label','切换深浅色');toggle.title='切换深浅色';toggle.addEventListener('click',()=>document.querySelector('.tool-dark-light-toggle')?.click());document.body.append(toggle);
});
