(function () {
  var path = location.pathname;
  if (/^\/l\/[a-z0-9]+(?:-[a-z0-9]+)*\/?$/.test(path)) {
    document.documentElement.classList.add('remote-counter');
  }
  var raw = location.search.length > 1
    ? location.search.slice(1)
    : (location.hash.length > 1 ? location.hash.slice(1) : '');
  if (!raw) return;
  try {
    var params = new URLSearchParams(raw);
    if (params.get('view') === 'full') {
      document.documentElement.classList.add('wants-fullscreen');
    }
  } catch (e) {}
})();
