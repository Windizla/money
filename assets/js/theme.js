/* Language switch (persists in localStorage). Dark theme only. */
(function () {
  'use strict';
  var LANG_KEY = 'furlore_lang';
  var SCROLL_KEY = 'furlore_scroll';

  // Language cycle order: English → Українська → Deutsch → Français → English
  var LANGS = ['en', 'uk', 'de', 'fr'];
  // Path prefix for each language (en is root, no prefix)
  var PREFIX = { en: '', uk: '/uk', de: '/de', fr: '/fr' };

  // Restore scroll position after language nav reload to prevent "jump"
  function restoreScroll() {
    try {
      var y = sessionStorage.getItem(SCROLL_KEY);
      if (y !== null && y !== undefined) {
        sessionStorage.removeItem(SCROLL_KEY);
        window.scrollTo(0, parseInt(y, 10) || 0);
      }
    } catch (e) {}
  }

  function currentLang() {
    var lang = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
    if (LANGS.indexOf(lang) === -1) lang = 'en';
    return lang;
  }

  function splitPath(pathname) {
    if (pathname.indexOf('/uk/') === 0) return { lang: 'uk', tail: pathname.slice(3) || '/' };
    if (pathname === '/uk' || pathname === '/uk/') return { lang: 'uk', tail: '/' };
    if (pathname.indexOf('/de/') === 0) return { lang: 'de', tail: pathname.slice(3) || '/' };
    if (pathname === '/de' || pathname === '/de/') return { lang: 'de', tail: '/' };
    if (pathname.indexOf('/fr/') === 0) return { lang: 'fr', tail: pathname.slice(3) || '/' };
    if (pathname === '/fr' || pathname === '/fr/') return { lang: 'fr', tail: '/' };
    return { lang: 'en', tail: pathname || '/' };
  }

  function init() {
    restoreScroll();
    // Force dark theme always
    document.documentElement.setAttribute('data-theme', 'dark');
    try { localStorage.removeItem('furlore_theme'); } catch (e) {}

    var langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      function updateLabel() {
        var cur = currentLang();
        var idx = LANGS.indexOf(cur);
        var nextLang = LANGS[(idx + 1) % LANGS.length];
        var labels = { en: 'English', uk: 'Українська', de: 'Deutsch', fr: 'Français' };
        langBtn.title = 'Switch to ' + labels[nextLang];
        langBtn.setAttribute('aria-label', 'Switch language (current: ' + labels[cur] + ')');
      }
      updateLabel();

      langBtn.addEventListener('click', function () {
        var cur = currentLang();
        var idx = LANGS.indexOf(cur);
        var next = LANGS[(idx + 1) % LANGS.length];

        try {
          localStorage.setItem(LANG_KEY, next);
          sessionStorage.setItem(SCROLL_KEY, String(window.scrollY || window.pageYOffset || 0));
        } catch (e) {}

        var parts = splitPath(location.pathname);
        var tail = parts.tail || '/';
        var newPrefix = PREFIX[next] || '';
        var newPath = newPrefix + (tail === '/' ? '/' : tail);
        newPath = newPath.replace(/\/+/g, '/');
        if (!newPath.startsWith('/')) newPath = '/' + newPath;

        location.href = newPath + location.search + location.hash;
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
