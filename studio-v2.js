// DECHIVE STUDIO v2 — only interaction that the page actually needs.
(function () {
  var year = document.getElementById('copyright-year');
  if (year) year.textContent = String(new Date().getFullYear());

  var nav = document.querySelector('.studio-mobile-nav');
  if (nav) {
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { nav.open = false; });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') nav.open = false;
    });
    document.addEventListener('click', function (event) {
      if (nav.open && !nav.contains(event.target)) nav.open = false;
    });
  }
}());
