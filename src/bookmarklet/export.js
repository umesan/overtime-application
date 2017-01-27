/**
 * export ブックマークレット
 */
javascript:(function(s){
  bookmarklet = true;
  s = document.createElement('script');
  s.src='http://localhost:3000/export.min.js';
  document.body.appendChild(s);
})()