/**
 * import ブックマークレット
 */
javascript:(function(s){
  bookmarklet = true;
  s = document.createElement('script');
  s.src='http://localhost:3000/import.min.js';
  document.body.appendChild(s);
})()