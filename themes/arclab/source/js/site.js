'use strict';
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('is-open', !expanded);
});
const input = document.querySelector('#lesson-search');
if (input) {
  const rows = [...document.querySelectorAll('.lesson-row')];
  const groups = [...document.querySelectorAll('.lesson-group')];
  const filter = () => {
    const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    rows.forEach(row => {
      const match = terms.every(term => row.dataset.search.toLocaleLowerCase().includes(term));
      row.hidden = !match;
      if (match) count++;
    });
    groups.forEach(group => { group.hidden = !group.querySelector('.lesson-row:not([hidden])'); });
    document.querySelector('#search-count').textContent = `${count} 篇教程`;
    document.querySelector('#search-empty').hidden = count !== 0;
  };
  input.addEventListener('input', filter);
}
