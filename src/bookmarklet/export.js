/**
 * export ブックマークレット
 */
javascript:(function(s){
  bookmarklet = true;
  s = document.createElement('script');
  s.src='http://127.0.0.1:8080/docs/export.min.js';
  document.body.appendChild(s);
})()