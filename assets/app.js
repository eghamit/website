/* neuronode — interactive single-page app (vanilla JS, offline). */
(function () {
  'use strict';
  var ML = window.ML || { modules: [], lessons: {}, search: [], home: '', curriculum: '' };
  var app = document.getElementById('app');
  var themeBtn = document.getElementById('themeBtn');
  var searchForm = document.getElementById('searchForm');
  var searchInput = document.getElementById('searchInput');
  var progressChip = document.getElementById('progressChip');

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // node/network brand mark (white, for gradient tiles)
  var NODE_LOGO =
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><g stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.85"><path d="M6.6 7.4 11.4 11.6"/><path d="M6.6 16.6 11.4 12.4"/><path d="M12.6 11.6 17.4 7.4"/><path d="M12.6 12.4 17.4 16.6"/></g><g fill="#fff"><circle cx="6" cy="7" r="2.1"/><circle cx="6" cy="17" r="2.1"/><circle cx="12" cy="12" r="2.6"/><circle cx="18" cy="7" r="2.1"/><circle cx="18" cy="17" r="2.1"/></g></svg>';

  // ---------- progress (localStorage) ----------
  var DONE = {};
  try {
    DONE = JSON.parse(localStorage.getItem('ml-progress') || '{}') || {};
  } catch (e) {
    DONE = {};
  }
  function saveDone() {
    try {
      localStorage.setItem('ml-progress', JSON.stringify(DONE));
    } catch (e) {}
  }
  // which sidebar modules the user has pinned open
  var NAV = {};
  try {
    NAV = JSON.parse(localStorage.getItem('ml-nav') || '{}') || {};
  } catch (e) {
    NAV = {};
  }
  function saveNav() {
    try {
      localStorage.setItem('ml-nav', JSON.stringify(NAV));
    } catch (e) {}
  }
  function isDone(slug) {
    return !!DONE[slug];
  }
  function allSlugs() {
    var out = [];
    ML.modules.forEach(function (m) {
      m.lessons.forEach(function (l) {
        out.push(l.slug);
      });
    });
    return out;
  }
  function doneCount() {
    var n = 0,
      s = allSlugs();
    for (var i = 0; i < s.length; i++) if (DONE[s[i]]) n++;
    return n;
  }
  function moduleDone(m) {
    var n = 0;
    m.lessons.forEach(function (l) {
      if (DONE[l.slug]) n++;
    });
    return n;
  }
  function firstIncomplete() {
    var s = allSlugs();
    for (var i = 0; i < s.length; i++) if (!DONE[s[i]]) return s[i];
    return s[0];
  }

  // ---------- theme ----------
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function syncThemeIcon() {
    themeBtn.textContent = currentTheme() === 'dark' ? '☀️' : '🌙';
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
    syncThemeIcon();
  }
  themeBtn.addEventListener('click', toggleTheme);
  syncThemeIcon();

  // ---------- header progress ring ----------
  function renderRing() {
    var total = allSlugs().length || 1;
    var pct = Math.round((doneCount() / total) * 100);
    var r = 13,
      c = 2 * Math.PI * r,
      off = c * (1 - pct / 100);
    progressChip.innerHTML =
      '<svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="' +
      r +
      '" fill="none" stroke="currentColor" stroke-opacity="0.18" stroke-width="4"/>' +
      '<circle cx="17" cy="17" r="' +
      r +
      '" fill="none" stroke="url(#pg)" stroke-width="4" stroke-linecap="round" stroke-dasharray="' +
      c.toFixed(1) +
      '" stroke-dashoffset="' +
      off.toFixed(1) +
      '" transform="rotate(-90 17 17)"/>' +
      '<defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient></defs></svg>' +
      '<span class="pc-num">' +
      pct +
      '%</span>';
  }

  // ---------- sidebar ----------
  function sidebarHtml(activeSlug) {
    return ML.modules
      .map(function (m, mi) {
        var links = m.lessons
          .map(function (l) {
            var cls = 'lesson-link' + (l.slug === activeSlug ? ' active' : '') + (isDone(l.slug) ? ' done' : '');
            return (
              '<li><a class="' +
              cls +
              '" href="#/learn/' +
              l.slug +
              '"><span class="ll-check">' +
              (isDone(l.slug) ? '✓' : '') +
              '</span>' +
              esc(l.title) +
              '</a></li>'
            );
          })
          .join('');
        var mdone = moduleDone(m),
          mtot = m.lessons.length;
        var hasActive = m.lessons.some(function (l) {
          return l.slug === activeSlug;
        });
        var open = NAV[m.id] || hasActive;
        return (
          '<div class="module-group' +
          (open ? ' open' : '') +
          '" data-module="' +
          m.id +
          '"><button class="module-toggle" type="button" data-mod="' +
          m.id +
          '" aria-expanded="' +
          (open ? 'true' : 'false') +
          '"><span class="mg-icon">' +
          m.icon +
          '</span> <span class="mg-title">' +
          (mi + 1) +
          '. ' +
          esc(m.title) +
          '</span><span class="mod-progress' +
          (mdone === mtot ? ' complete' : '') +
          '">' +
          mdone +
          '/' +
          mtot +
          '</span><span class="nav-chev">›</span></button><ul>' +
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

  // ---------- top nav: courses mega-menu ----------
  function buildCoursesMenu() {
    var menu = document.getElementById('coursesMenu');
    if (!menu) return;

    // The catalogue of courses. Today there is a single course whose modules
    // are the whole curriculum; add more objects here (each with its own set
    // of modules) and they appear below "Introduction to Machine Learning".
    var COURSES = [
      {
        id: 'intro-ml',
        title: 'Introduction to Machine Learning',
        icon: '🎓',
        modules: ML.modules,
      },
    ];

    var courses = COURSES.map(function (c) {
      var lessonCount = c.modules.reduce(function (s, m) {
        return s + m.lessons.length;
      }, 0);
      var mods = c.modules
        .map(function (m, i) {
          return (
            '<a class="dd-item" data-module="' +
            m.id +
            '" href="#/learn/' +
            m.lessons[0].slug +
            '"><span class="dd-ic">' +
            m.icon +
            '</span><span class="dd-main"><span class="dd-t">' +
            esc(m.title) +
            '</span><span class="dd-s">' +
            m.lessons.length +
            ' lessons · Module ' +
            (i + 1) +
            '</span></span><span class="dd-arrow">→</span></a>'
          );
        })
        .join('');
      return (
        '<div class="dd-course-wrap">' +
        '<a class="dd-item dd-course" data-course="' +
        c.id +
        '" href="#/learn"><span class="dd-ic">' +
        c.icon +
        '</span><span class="dd-main"><span class="dd-t">' +
        esc(c.title) +
        '</span><span class="dd-s">' +
        c.modules.length +
        ' modules · ' +
        lessonCount +
        ' lessons</span></span><span class="dd-arrow dd-chev">›</span></a>' +
        '<div class="dd-submenu"><div class="dd-submenu-inner">' +
        '<p class="dd-label">Modules</p>' +
        mods +
        '<a class="dd-all" href="#/learn">📚 Browse the full curriculum →</a>' +
        '</div></div>' +
        '</div>'
      );
    }).join('');

    menu.innerHTML =
      '<div class="dropdown-inner"><p class="dd-label">Courses</p>' + courses + '</div>';
  }

  // ---------- nav active state + explore toggle (touch) ----------
  function setActiveNav(hash) {
    var map = { '#/': 'home', '#/contact': 'contact', '#/login': 'login', '#/signup': 'signup' };
    var active = map[hash] || (hash.indexOf('#/learn') === 0 ? 'explore' : '');
    document.querySelectorAll('.navlink[data-nav]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === active);
    });
    var eb = document.getElementById('exploreBtn');
    if (eb) eb.classList.toggle('active', active === 'explore');
  }
  (function wireExplore() {
    var wrap = document.getElementById('exploreWrap');
    var btn = document.getElementById('exploreBtn');
    var menu = document.getElementById('coursesMenu');
    if (!wrap || !btn || !menu) return;
    var isTouch = window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;

    function collapseCourses() {
      menu.querySelectorAll('.dd-course-wrap.expanded').forEach(function (w) {
        w.classList.remove('expanded');
      });
    }
    function closeAll() {
      wrap.classList.remove('open');
      wrap.classList.add('force-closed');
      btn.setAttribute('aria-expanded', 'false');
      collapseCourses();
    }

    menu.addEventListener('click', function (e) {
      var course = e.target.closest('.dd-course');
      // On touch (no hover), the first tap on a course reveals its modules
      // instead of navigating; a second tap collapses it again.
      if (course && isTouch) {
        e.preventDefault();
        var cw = course.closest('.dd-course-wrap');
        var wasOpen = cw.classList.contains('expanded');
        collapseCourses();
        if (!wasOpen) cw.classList.add('expanded');
        return;
      }
      // Selecting a module, the browse-all link, or a course on a hover
      // device closes the whole menu at once — even while still hovered.
      if (e.target.closest('.dd-item, .dd-all')) closeAll();
    });

    // Re-enable hover and reset the flyout once the pointer leaves the menu.
    wrap.addEventListener('mouseleave', function () {
      wrap.classList.remove('force-closed');
      collapseCourses();
    });

    // Touch devices have no hover, so tap the trigger to open/close.
    if (isTouch) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        wrap.classList.remove('force-closed');
        var open = wrap.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (!open) collapseCourses();
      });
      document.addEventListener('click', function (e) {
        if (!wrap.contains(e.target)) closeAll();
      });
    }
  })();

  // ---------- auth / contact demo pages ----------
  function authPage(kind) {
    var isSignup = kind === 'signup';
    var title = isSignup ? 'Create your account' : 'Welcome back';
    var sub = isSignup ? 'Start learning ML for free.' : 'Log in to keep your progress.';
    var nameField = isSignup
      ? '<label class="field"><span>Full name</span><input type="text" name="name" required placeholder="Ada Lovelace" /></label>'
      : '';
    var alt = isSignup
      ? 'Already have an account? <a href="#/login">Log in</a>'
      : 'New here? <a href="#/signup">Create an account</a>';
    return (
      '<div class="auth-wrap"><div class="auth-card"><div class="auth-logo">' +
      NODE_LOGO +
      '</div><h1>' +
      title +
      '</h1><p class="muted">' +
      sub +
      '</p><form class="demo-form" data-kind="' +
      kind +
      '">' +
      nameField +
      '<label class="field"><span>Email</span><input type="email" name="email" required placeholder="you@example.com" /></label>' +
      '<label class="field"><span>Password</span><input type="password" name="password" required minlength="6" placeholder="••••••••" /></label>' +
      '<button class="btn btn-lg auth-submit" type="submit">' +
      (isSignup ? 'Sign up' : 'Log in') +
      '</button></form><p class="auth-alt">' +
      alt +
      '</p><p class="demo-note">Demo site — no data is sent or stored anywhere.</p></div></div>'
    );
  }
  function contactPage() {
    return (
      '<div class="auth-wrap"><div class="auth-card wide"><div class="auth-logo">✉️</div><h1>Contact us</h1>' +
      '<p class="muted">Questions, feedback or a topic you\'d like covered? Drop us a line.</p>' +
      '<form class="demo-form" data-kind="contact">' +
      '<label class="field"><span>Your name</span><input type="text" name="name" required placeholder="Your name" /></label>' +
      '<label class="field"><span>Email</span><input type="email" name="email" required placeholder="you@example.com" /></label>' +
      '<label class="field"><span>Message</span><textarea name="message" rows="5" required placeholder="How can we help?"></textarea></label>' +
      '<button class="btn btn-lg" type="submit">Send message</button></form>' +
      '<p class="demo-note">Demo site — the form doesn\'t actually send anything.</p></div></div>'
    );
  }
  app.addEventListener('submit', function (e) {
    var form = e.target.closest ? e.target.closest('.demo-form') : null;
    if (!form) return;
    e.preventDefault();
    var kind = form.getAttribute('data-kind');
    if (kind === 'signup') confetti();
    var msg =
      kind === 'contact'
        ? '✅ <strong>Thanks!</strong> This is a demo — your message wasn’t really sent.'
        : kind === 'signup'
          ? '🎉 <strong>Welcome!</strong> Demo only — no account was created. <a href="#/learn">Start learning →</a>'
          : '👋 <strong>Logged in (demo).</strong> No account is required here. <a href="#/learn">Continue →</a>';
    toast(msg);
    form.reset();
  });

  // ---------- search ----------
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
    if (q && !hits.length)
      return '<div class="search-results">' + head + '<div class="empty">No lessons matched “' + esc(q) + '”. Try “gradient descent”, “entropy” or “clustering”.</div></div>';
    var list = hits
      .map(function (h) {
        var d = h.d;
        return (
          '<a class="search-hit" href="#/learn/' +
          d.slug +
          '">' +
          (isDone(d.slug) ? '<span class="hit-check">✓ done</span>' : '') +
          '<div class="mod">' +
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

  // ---------- confetti + toast ----------
  function confetti() {
    var colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#0ea5e9'];
    var wrap = document.createElement('div');
    wrap.className = 'confetti';
    for (var i = 0; i < 90; i++) {
      var p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.3 + 's';
      p.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
      p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(function () {
      wrap.remove();
    }, 3200);
  }
  var toastTimer;
  function toast(html) {
    var t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      document.body.appendChild(t);
    }
    t.innerHTML = html;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove('show');
    }, 4200);
  }

  // ---------- complete button ----------
  function renderComplete(slug) {
    var slot = document.getElementById('completeSlot');
    if (!slot) return;
    var lesson = ML.lessons[slug];
    var done = isDone(slug);
    var nextBtn =
      lesson && lesson.next
        ? '<a class="btn ghost" href="#/learn/' + lesson.next + '">Next lesson →</a>'
        : '';
    slot.innerHTML =
      '<div class="complete-card ' +
      (done ? 'is-done' : '') +
      '"><div><p class="cc-title">' +
      (done ? '✓ Lesson completed' : 'Finished this lesson?') +
      '</p><p class="muted cc-sub">' +
      (done ? 'Nice work — it’s marked in your progress.' : 'Mark it complete to track your progress.') +
      '</p></div><div class="cc-actions"><button class="btn complete-btn" type="button">' +
      (done ? '✓ Completed' : 'Mark complete') +
      '</button>' +
      nextBtn +
      '</div></div>';
    var btn = slot.querySelector('.complete-btn');
    btn.addEventListener('click', function () {
      var nowDone = !isDone(slug);
      if (nowDone) DONE[slug] = true;
      else delete DONE[slug];
      saveDone();
      renderComplete(slug);
      renderRing();
      // update sidebar in place
      refreshSidebarState(slug);
      if (nowDone) {
        confetti();
        var total = allSlugs().length;
        var dc = doneCount();
        var msg =
          dc === total
            ? '🎉 <strong>Course complete!</strong> You finished all ' + total + ' lessons.'
            : '✓ <strong>' + dc + '/' + total + '</strong> lessons done. ' + (lesson && lesson.next ? '<a href="#/learn/' + lesson.next + '">Continue →</a>' : 'Keep going!');
        toast(msg);
      }
    });
  }
  function refreshSidebarState(activeSlug) {
    var sb = document.getElementById('sidebar');
    if (sb) sb.innerHTML = '<button class="sidebar-close btn ghost" id="sbClose">✕ Close</button>' + sidebarHtml(activeSlug);
    wireSidebar();
  }

  // ---------- reveal + copy (event delegation) ----------
  app.addEventListener('click', function (e) {
    var mt = e.target.closest ? e.target.closest('.module-toggle') : null;
    if (mt) {
      var grp = mt.closest('.module-group, .curriculum-module');
      var opened = grp.classList.toggle('open');
      mt.setAttribute('aria-expanded', opened ? 'true' : 'false');
      var id = mt.getAttribute('data-mod');
      if (opened) NAV[id] = true;
      else delete NAV[id];
      saveNav();
      return;
    }
    var rb = e.target.closest ? e.target.closest('.reveal-btn') : null;
    if (rb) {
      rb.closest('.example').classList.toggle('revealed');
      return;
    }
    var cb = e.target.closest ? e.target.closest('.copy-btn') : null;
    if (cb) {
      var code = cb.parentNode.querySelector('code');
      var text = code ? code.textContent : '';
      var done = function () {
        cb.textContent = 'Copied!';
        cb.classList.add('copied');
        setTimeout(function () {
          cb.textContent = 'Copy';
          cb.classList.remove('copied');
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          done();
        } catch (err) {}
      }
    }
  });

  // ---------- home continue card + counters ----------
  function decorateHome() {
    var host = app.querySelector('.home-modules');
    var dc = doneCount(),
      total = allSlugs().length,
      pct = total ? Math.round((dc / total) * 100) : 0;
    var slug = firstIncomplete();
    var l = ML.lessons[slug] || { title: '', moduleTitle: '' };
    var started = dc > 0;
    var card =
      '<div class="resume-card"><div class="resume-info"><p class="resume-label">' +
      (started ? '▶ Continue learning' : '✨ Start your journey') +
      '</p><p class="resume-title">' +
      esc(l.title) +
      '</p><p class="muted small">' +
      esc(l.moduleTitle) +
      '</p></div><div class="resume-right"><div class="resume-bar"><span style="width:' +
      pct +
      '%"></span></div><p class="muted small">' +
      dc +
      ' of ' +
      total +
      ' lessons · ' +
      pct +
      '%</p><a class="btn" href="#/learn/' +
      slug +
      '">' +
      (started ? 'Resume →' : 'Begin →') +
      '</a></div></div>';
    if (host) host.insertAdjacentHTML('beforebegin', card);
    animateCounters();
  }
  function animateCounters() {
    var els = app.querySelectorAll('.stat-n[data-to]');
    els.forEach(function (el) {
      var to = parseInt(el.getAttribute('data-to'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var start = null;
      var dur = 900;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * to) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  // ---------- router ----------
  function applyCurriculumState() {
    var secs = app.querySelectorAll('.curriculum-module');
    secs.forEach(function (sec) {
      var id = sec.getAttribute('data-module');
      if (NAV[id]) {
        sec.classList.add('open');
        var t = sec.querySelector('.module-toggle');
        if (t) t.setAttribute('aria-expanded', 'true');
      }
    });
  }
  function wireSidebar() {
    var toggle = document.getElementById('sbToggle');
    var close = document.getElementById('sbClose');
    var sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) toggle.addEventListener('click', function () { sidebar.classList.add('open'); });
    if (close && sidebar) close.addEventListener('click', function () { sidebar.classList.remove('open'); });
  }

  var currentSlug = null;
  // ---------- interactive labs ----------
  function initLabs() {
    var labs = document.querySelectorAll('[data-lab="kmeans"]');
    for (var i = 0; i < labs.length; i++) {
      var el = labs[i];
      if (!el.getAttribute('data-init')) {
        el.setAttribute('data-init', '1');
        initKmeansLab(el);
      }
    }
  }

  function initKmeansLab(el) {
    var W = 480,
      H = 360,
      pad = 26;
    var COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#0ea5e9', '#8b5cf6'];
    var pts = [],
      k = 3,
      cents = [],
      assign = [],
      iter = 0,
      converged = false;

    el.innerHTML =
      '<div class="lab-bar">' +
      '<span class="lab-kctl">k =' +
      [2, 3, 4, 5, 6].map(function (v) { return '<button type="button" class="lab-kbtn' + (v === 3 ? ' on' : '') + '" data-k="' + v + '">' + v + '</button>'; }).join('') +
      '</span>' +
      '<button class="lab-btn lab-new" type="button">↻ New data</button>' +
      '<button class="lab-btn lab-rand" type="button">🎲 Random centroids</button>' +
      '<button class="lab-btn lab-iter primary" type="button">▸ Iterate</button>' +
      '<button class="lab-btn lab-reset" type="button">Reset</button>' +
      '</div>' +
      '<div class="lab-status"></div>' +
      '<svg class="lab-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="k-means playground"></svg>' +
      '<p class="lab-hint">Each <strong>Iterate</strong> = assign every point to its nearest centroid (colour), then move each centroid to the mean of its points.</p>';

    var svg = el.querySelector('.lab-svg');
    var statusEl = el.querySelector('.lab-status');

    function sx(x) { return pad + x * (W - 2 * pad); }
    function sy(y) { return H - pad - y * (H - 2 * pad); }

    function genData() {
      var nb = 2 + Math.floor(Math.random() * 3); // 2–4 latent blobs
      var centers = [];
      for (var i = 0; i < nb; i++) centers.push({ x: 0.18 + 0.64 * Math.random(), y: 0.18 + 0.64 * Math.random() });
      var n = 12 + Math.floor(Math.random() * 7); // 12–18 points
      pts = [];
      for (var j = 0; j < n; j++) {
        var c = centers[j % nb];
        var clamp = function (v) { return Math.min(0.97, Math.max(0.03, v)); };
        pts.push({ x: clamp(c.x + (Math.random() - 0.5) * 0.26), y: clamp(c.y + (Math.random() - 0.5) * 0.26) });
      }
    }
    function resetClusters() {
      cents = [];
      assign = pts.map(function () { return -1; });
      iter = 0;
      converged = false;
    }
    function nearest(p) {
      var best = 0, bd = Infinity;
      for (var i = 0; i < cents.length; i++) {
        var dx = p.x - cents[i].x, dy = p.y - cents[i].y, d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }
    function assignAll() { assign = pts.map(nearest); }
    function updateCents() {
      var moved = 0;
      for (var i = 0; i < cents.length; i++) {
        var mx = 0, my = 0, c = 0;
        for (var j = 0; j < pts.length; j++) if (assign[j] === i) { mx += pts[j].x; my += pts[j].y; c++; }
        if (c > 0) {
          var nx = mx / c, ny = my / c;
          moved += Math.abs(nx - cents[i].x) + Math.abs(ny - cents[i].y);
          cents[i] = { x: nx, y: ny };
        }
      }
      return moved;
    }
    function iterate() {
      if (cents.length < k || converged) return;
      assignAll();
      var moved = updateCents();
      iter++;
      if (moved < 1e-4) converged = true;
      draw();
    }
    function randomCents() {
      if (!pts.length) genData();
      var idx = pts.map(function (_, i) { return i; });
      for (var i = idx.length - 1; i > 0; i--) { var r = Math.floor(Math.random() * (i + 1)); var t = idx[i]; idx[i] = idx[r]; idx[r] = t; }
      cents = idx.slice(0, k).map(function (i) { return { x: pts[i].x, y: pts[i].y }; });
      assignAll();
      iter = 0;
      converged = false;
      draw();
    }

    function draw() {
      var p = [];
      p.push('<rect x="' + pad + '" y="' + pad + '" width="' + (W - 2 * pad) + '" height="' + (H - 2 * pad) + '" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.16"/>');
      if (cents.length) {
        for (var j = 0; j < pts.length; j++) {
          var a = assign[j];
          if (a >= 0) p.push('<line x1="' + sx(pts[j].x).toFixed(1) + '" y1="' + sy(pts[j].y).toFixed(1) + '" x2="' + sx(cents[a].x).toFixed(1) + '" y2="' + sy(cents[a].y).toFixed(1) + '" stroke="' + COLORS[a] + '" stroke-opacity="0.22"/>');
        }
      }
      for (var j2 = 0; j2 < pts.length; j2++) {
        var a2 = assign[j2];
        var col = a2 >= 0 ? COLORS[a2] : '#94a3b8';
        p.push('<circle cx="' + sx(pts[j2].x).toFixed(1) + '" cy="' + sy(pts[j2].y).toFixed(1) + '" r="5.5" fill="' + col + '" fill-opacity="0.9"/>');
      }
      for (var i = 0; i < cents.length; i++) {
        var cx = sx(cents[i].x), cy = sy(cents[i].y), cc = COLORS[i];
        p.push('<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="12" fill="' + cc + '" fill-opacity="0.14" stroke="' + cc + '" stroke-width="1.5"/>' +
          '<g stroke="' + cc + '" stroke-width="3" stroke-linecap="round"><line x1="' + (cx - 6).toFixed(1) + '" y1="' + (cy - 6).toFixed(1) + '" x2="' + (cx + 6).toFixed(1) + '" y2="' + (cy + 6).toFixed(1) + '"/><line x1="' + (cx - 6).toFixed(1) + '" y1="' + (cy + 6).toFixed(1) + '" x2="' + (cx + 6).toFixed(1) + '" y2="' + (cy - 6).toFixed(1) + '"/></g>');
      }
      svg.innerHTML = p.join('');

      if (cents.length < k) statusEl.textContent = 'Click the plot to place centroid ' + (cents.length + 1) + ' of ' + k + '.';
      else if (converged) statusEl.textContent = '✓ Converged after ' + iter + ' iteration' + (iter === 1 ? '' : 's') + ' — the centroids stopped moving.';
      else if (iter === 0) statusEl.textContent = 'Centroids placed. Press Iterate to run one k-means step.';
      else statusEl.textContent = 'Iteration ' + iter + '. Press Iterate again, or keep going until it converges.';

      var ib = el.querySelector('.lab-iter');
      ib.disabled = cents.length < k || converged;
    }

    svg.addEventListener('click', function (e) {
      if (cents.length >= k) return;
      var rect = svg.getBoundingClientRect();
      var px = ((e.clientX - rect.left) / rect.width) * W;
      var py = ((e.clientY - rect.top) / rect.height) * H;
      var x = (px - pad) / (W - 2 * pad);
      var y = 1 - (py - pad) / (H - 2 * pad);
      x = Math.min(1, Math.max(0, x));
      y = Math.min(1, Math.max(0, y));
      cents.push({ x: x, y: y });
      if (cents.length === k) assignAll();
      draw();
    });

    var kbtns = el.querySelectorAll('.lab-kbtn');
    for (var b = 0; b < kbtns.length; b++) {
      kbtns[b].addEventListener('click', function () {
        for (var q = 0; q < kbtns.length; q++) kbtns[q].classList.remove('on');
        this.classList.add('on');
        k = parseInt(this.getAttribute('data-k'), 10);
        resetClusters();
        draw();
      });
    }
    el.querySelector('.lab-new').addEventListener('click', function () { genData(); resetClusters(); draw(); });
    el.querySelector('.lab-rand').addEventListener('click', function () { randomCents(); });
    el.querySelector('.lab-iter').addEventListener('click', iterate);
    el.querySelector('.lab-reset').addEventListener('click', function () { resetClusters(); draw(); });

    genData();
    resetClusters();
    draw();
  }

  function render() {
    var hash = location.hash || '#/';
    currentSlug = null;
    if (hash.indexOf('#/learn/') === 0) {
      var slug = hash.slice('#/learn/'.length);
      var lesson = ML.lessons[slug];
      if (!lesson) {
        app.innerHTML = layoutWithSidebar('', '<h1>Lesson not found</h1><p class="muted">Pick a lesson from the sidebar.</p>');
      } else {
        currentSlug = slug;
        app.innerHTML = layoutWithSidebar(slug, lesson.html);
        document.title = lesson.title + ' · neuronode';
        renderComplete(slug);
        initLabs();
      }
      window.scrollTo(0, 0);
    } else if (hash === '#/learn') {
      app.innerHTML = layoutWithSidebar('', ML.curriculum);
      document.title = 'Curriculum · neuronode';
      applyCurriculumState();
      window.scrollTo(0, 0);
    } else if (hash.indexOf('#/search') === 0) {
      var qs = hash.indexOf('?') !== -1 ? hash.slice(hash.indexOf('?') + 1) : '';
      var q = '';
      try {
        q = decodeURIComponent((qs.match(/(?:^|&)q=([^&]*)/) || [, ''])[1].replace(/\+/g, ' '));
      } catch (e) {}
      if (searchInput && document.activeElement !== searchInput) searchInput.value = q;
      app.innerHTML = plain(searchHtml(q));
      document.title = 'Search · neuronode';
    } else if (hash === '#/login' || hash === '#/signup') {
      app.innerHTML = plain(authPage(hash === '#/signup' ? 'signup' : 'login'));
      document.title = (hash === '#/signup' ? 'Sign Up' : 'Log In') + ' · neuronode';
      window.scrollTo(0, 0);
    } else if (hash === '#/contact') {
      app.innerHTML = plain(contactPage());
      document.title = 'Contact · neuronode';
      window.scrollTo(0, 0);
    } else {
      app.innerHTML = plain(ML.home);
      document.title = 'neuronode — Learn Machine Learning';
      decorateHome();
      window.scrollTo(0, 0);
    }
    wireSidebar();
    renderRing();
    setActiveNav(hash.split('?')[0]);
  }
  buildCoursesMenu();

  // ---------- search input ----------
  function goSearch(q) {
    var target = '#/search?q=' + encodeURIComponent(q);
    if (location.hash === target) render();
    else location.hash = target;
  }
  if (searchForm)
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      goSearch(searchInput.value.trim());
    });
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

  // ---------- keyboard shortcuts ----------
  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) {
      e.preventDefault();
      searchInput.focus();
      return;
    }
    if (typing) return;
    if (e.key === 't') toggleTheme();
    if (currentSlug) {
      var l = ML.lessons[currentSlug];
      if (e.key === 'ArrowRight' && l && l.next) location.hash = '#/learn/' + l.next;
      if (e.key === 'ArrowLeft' && l && l.prev) location.hash = '#/learn/' + l.prev;
    }
  });

  window.addEventListener('hashchange', render);
  render();

  // ---------- scroll progress bar ----------
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  function updateBar() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateBar, { passive: true });
  window.addEventListener('resize', updateBar);
  updateBar();
})();
