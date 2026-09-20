/* ML Academy — single-page app (vanilla JS, no build step). */
(function () {
  'use strict';
  var ML = window.ML || { modules: [], lessons: {}, search: [], home: '', curriculum: '' };
  var app = document.getElementById('app');
  var themeBtn = document.getElementById('themeBtn');
  var searchForm = document.getElementById('searchForm');
  var searchInput = document.getElementById('searchInput');

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ---- theme ----
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function syncThemeIcon() {
    themeBtn.textContent = currentTheme() === 'dark' ? '☀️' : '🌙';
  }
  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
    syncThemeIcon();
  });
  syncThemeIcon();

  // ---- sidebar ----
  function sidebarHtml(activeSlug) {
    return ML.modules
      .map(function (m, mi) {
        var links = m.lessons
          .map(function (l) {
            var cls = 'lesson-link' + (l.slug === activeSlug ? ' active' : '');
            return '<li><a class="' + cls + '" href="#/learn/' + l.slug + '">' + esc(l.title) + '</a></li>';
          })
          .join('');
        return (
          '<div class="module-group" data-module="' +
          m.id +
          '"><p><span class="mg-icon">' +
          m.icon +
          '</span> ' +
          (mi + 1) +
          '. ' +
          esc(m.title) +
          '</p><ul>' +
          links +
          '</ul></div>'
        );
      })
      .join('');
  }

  function layoutWithSidebar(activeSlug, content) {
    return (
      '<div class="layout with-sidebar">' +
      '<aside class="sidebar" id="sidebar"><button class="sidebar-close btn ghost" id="sbClose">✕ Close</button>' +
      sidebarHtml(activeSlug) +
      '</aside>' +
      '<div class="content"><button class="sidebar-toggle btn ghost" id="sbToggle">☰ Lessons</button>' +
      content +
      '</div></div>'
    );
  }

  function plain(content) {
    return '<div class="layout"><div class="content">' + content + '</div></div>';
  }

  // ---- search ----
  function scoreDoc(haystack, terms) {
    var score = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (!t) continue;
      var idx = haystack.indexOf(t);
      while (idx !== -1) {
        score++;
        idx = haystack.indexOf(t, idx + t.length);
      }
    }
    return score;
  }
  function searchHtml(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var hits = [];
    if (terms.length) {
      hits = ML.search
        .map(function (d) {
          return { d: d, score: scoreDoc(d.haystack, terms) };
        })
        .filter(function (x) {
          return x.score > 0;
        })
        .sort(function (a, b) {
          return b.score - a.score;
        });
    }
    var head =
      '<h1>Search</h1><p class="muted">' +
      (q ? hits.length + ' lesson' + (hits.length === 1 ? '' : 's') + ' matched' : 'Type a topic in the search box above.') +
      '</p>';
    if (q && !hits.length) {
      return (
        '<div class="search-results">' +
        head +
        '<div class="empty">No lessons matched “' +
        esc(q) +
        '”. Try “gradient descent”, “entropy” or “clustering”.</div></div>'
      );
    }
    var list = hits
      .map(function (h) {
        var d = h.d;
        return (
          '<a class="search-hit" href="#/learn/' +
          d.slug +
          '"><div class="mod">' +
          esc(d.moduleTitle) +
          '</div><div class="ti">' +
          esc(d.title) +
          '</div><div class="muted">' +
          esc(d.summary) +
          '</div></a>'
        );
      })
      .join('');
    return '<div class="search-results">' + head + list + '</div>';
  }

  // ---- router ----
  function wireSidebar() {
    var toggle = document.getElementById('sbToggle');
    var close = document.getElementById('sbClose');
    var sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) toggle.addEventListener('click', function () { sidebar.classList.add('open'); });
    if (close && sidebar) close.addEventListener('click', function () { sidebar.classList.remove('open'); });
  }

  function render() {
    var hash = location.hash || '#/';
    if (hash.indexOf('#/learn/') === 0) {
      var slug = hash.slice('#/learn/'.length);
      var lesson = ML.lessons[slug];
      if (!lesson) {
        app.innerHTML = layoutWithSidebar('', '<h1>Lesson not found</h1><p class="muted">Pick a lesson from the sidebar.</p>');
      } else {
        app.innerHTML = layoutWithSidebar(slug, lesson.html);
        document.title = lesson.title + ' · ML Academy';
      }
      window.scrollTo(0, 0);
    } else if (hash === '#/learn') {
      app.innerHTML = layoutWithSidebar('', ML.curriculum);
      document.title = 'Curriculum · ML Academy';
      window.scrollTo(0, 0);
    } else if (hash.indexOf('#/search') === 0) {
      var qs = hash.indexOf('?') !== -1 ? hash.slice(hash.indexOf('?') + 1) : '';
      var q = '';
      try {
        q = decodeURIComponent((qs.match(/(?:^|&)q=([^&]*)/) || [, ''])[1].replace(/\+/g, ' '));
      } catch (e) {}
      if (searchInput && document.activeElement !== searchInput) searchInput.value = q;
      app.innerHTML = plain(searchHtml(q));
      document.title = 'Search · ML Academy';
    } else {
      app.innerHTML = plain(ML.home);
      document.title = 'ML Academy — Learn Machine Learning';
      window.scrollTo(0, 0);
    }
    wireSidebar();
  }

  // ---- search input ----
  function goSearch(q) {
    var target = '#/search?q=' + encodeURIComponent(q);
    if (location.hash === target) render();
    else location.hash = target;
  }
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      goSearch(searchInput.value.trim());
    });
  }
  if (searchInput) {
    var deb;
    searchInput.addEventListener('input', function () {
      clearTimeout(deb);
      var v = searchInput.value.trim();
      deb = setTimeout(function () {
        if (v) goSearch(v);
        else if (location.hash.indexOf('#/search') === 0) location.hash = '#/';
      }, 200);
    });
  }

  window.addEventListener('hashchange', render);
  render();

  // ---- scroll progress bar ----
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  function updateBar() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateBar, { passive: true });
  window.addEventListener('resize', updateBar);
  updateBar();
})();
