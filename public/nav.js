(function () {
  if (typeof document === 'undefined') return;

  var BASE_URL = 'https://signalsubstrate.github.io';

  function mountNav() {
    if (!document.body || document.getElementById('ss-top-nav')) return;

    if (!document.getElementById('ss-top-nav-style')) {
      var style = document.createElement('style');
      style.id = 'ss-top-nav-style';
      style.textContent = [
        '#ss-top-nav {',
        '  box-sizing: border-box;',
        '  width: 100%;',
        '  background-color: #20150e;',
        '  border-bottom: 1px solid #352419;',
        '  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;',
        '  font-size: 13px;',
        '  line-height: 1.4;',
        '  margin: 0;',
        '  padding: 0;',
        '}',
        '#ss-top-nav *, #ss-top-nav *::before, #ss-top-nav *::after {',
        '  box-sizing: border-box;',
        '}',
        '#ss-top-nav .ss-nav-inner {',
        '  max-width: 780px;',
        '  margin: 0 auto;',
        '  padding: 0 1.5rem;',
        '  min-height: 44px;',
        '  display: flex;',
        '  align-items: center;',
        '  justify-content: space-between;',
        '  gap: 1rem;',
        '}',
        '#ss-top-nav a {',
        '  color: #e6d9c8;',
        '  text-decoration: none;',
        '  display: inline-flex;',
        '  align-items: center;',
        '  min-height: 40px;',
        '  white-space: nowrap;',
        '  transition: color 140ms ease;',
        '}',
        '#ss-top-nav a:hover {',
        '  color: #ffffff;',
        '  text-decoration: underline;',
        '  text-underline-offset: 3px;',
        '}',
        '#ss-top-nav a:focus-visible {',
        '  outline: 2px solid #0969da;',
        '  outline-offset: 2px;',
        '  border-radius: 2px;',
        '}',
        '#ss-top-nav .ss-nav-home {',
        '  font-weight: 600;',
        '  color: #f4ede4;',
        '}',
        '#ss-top-nav .ss-nav-links {',
        '  display: flex;',
        '  align-items: center;',
        '  gap: 0.625rem;',
        '}',
        '#ss-top-nav .ss-nav-links a {',
        '  color: #c2ab90;',
        '}',
        '#ss-top-nav .ss-nav-sep {',
        '  color: #6b5344;',
        '  user-select: none;',
        '}',
        '@media (max-width: 600px) {',
        '  #ss-top-nav .ss-nav-inner {',
        '    padding: 0 1.125rem;',
        '    min-height: 46px;',
        '  }',
        '  #ss-top-nav a {',
        '    min-height: 44px;',
        '  }',
        '}'
      ].join('\n');
      document.head.appendChild(style);
    }

    var nav = document.createElement('nav');
    nav.id = 'ss-top-nav';
    nav.setAttribute('aria-label', 'Return to Signal & Substrate');

    var inner = document.createElement('div');
    inner.className = 'ss-nav-inner';

    var homeLink = document.createElement('a');
    homeLink.href = BASE_URL + '/';
    homeLink.className = 'ss-nav-home';
    homeLink.textContent = '\u2190 Signal & Substrate';

    var links = document.createElement('div');
    links.className = 'ss-nav-links';

    var aboutLink = document.createElement('a');
    aboutLink.href = BASE_URL + '/about';
    aboutLink.textContent = 'About';

    var sep = document.createElement('span');
    sep.className = 'ss-nav-sep';
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '/';

    var rssLink = document.createElement('a');
    rssLink.href = BASE_URL + '/rss.xml';
    rssLink.textContent = 'RSS';

    links.appendChild(aboutLink);
    links.appendChild(sep);
    links.appendChild(rssLink);

    inner.appendChild(homeLink);
    inner.appendChild(links);
    nav.appendChild(inner);

    document.body.prepend(nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountNav);
  } else {
    mountNav();
  }
})();
