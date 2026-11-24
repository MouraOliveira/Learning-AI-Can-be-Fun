/* Learning AI Can be Fun (LIACbF): homepage logic.
 * Reads window.LABS (assets/labs.js) and builds the lab cards, search, filters and the hero demo.
 * No dependencies, no build step. */
(function () {
  'use strict';

  var LABS = Array.isArray(window.LABS) ? window.LABS : [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var LEVEL_ORDER = ['Introductory', 'Intermediate', 'Advanced'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function fmt(v, d) {
    var s = (Math.abs(v) < 0.5 * Math.pow(10, -d) ? 0 : v).toFixed(d);
    return s.replace('-', '−');
  }

  /* ---------- card thumbnails (240 x 120 SVGs drawn with the site colours) ---------- */
  function svg(inner) {
    return '<svg viewBox="0 0 240 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }
  function arrow(x1, y1, x2, y2, col, w, dash) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L, hs = Math.max(5, w * 2.6);
    var bx = x2 - ux * hs, by = y2 - uy * hs, px = -uy * hs * 0.55, py = ux * hs * 0.55;
    return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + bx.toFixed(1) + '" y2="' + by.toFixed(1) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>' +
      '<path d="M' + x2.toFixed(1) + ' ' + y2.toFixed(1) + 'L' + (bx + px).toFixed(1) + ' ' + (by + py).toFixed(1) + 'L' + (bx - px).toFixed(1) + ' ' + (by - py).toFixed(1) + 'Z" fill="' + col + '"/>';
  }
  function circle(x, y, r, fill, stroke, sw, fo) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '"' + (fo != null ? ' fill-opacity="' + fo + '"' : '') + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (sw || 2) + '"' : '') + '/>';
  }
  function rng(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { var u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }

  var PV = {};

  PV.neuron = function () {
    var ys = [26, 60, 94], ws = [2.2, 4.4, 1.8], cols = ['var(--a)', 'var(--a)', 'var(--b)'], s = '';
    ys.forEach(function (y, i) { s += '<line x1="38" y1="' + y + '" x2="100" y2="60" stroke="' + cols[i] + '" stroke-width="' + ws[i] + '" stroke-linecap="round" opacity=".85"/>'; });
    ys.forEach(function (y) { s += circle(28, y, 10, 'var(--card)', 'var(--a)', 2.5); });
    s += circle(118, 60, 19, 'var(--d)', 'var(--d)', 3, 0.2);
    s += '<text x="118" y="66" text-anchor="middle" font-size="18" font-weight="700" fill="var(--ink)">Σ</text>';
    s += '<line x1="137" y1="60" x2="150" y2="60" stroke="var(--ink)" stroke-width="2"/>';
    s += '<rect x="150" y="38" width="44" height="44" rx="9" fill="var(--card)" stroke="var(--b)" stroke-width="2.5"/>';
    s += '<path d="M156 73C170 73 172 48 188 48" fill="none" stroke="var(--b)" stroke-width="3.2" stroke-linecap="round"/>';
    s += arrow(194, 60, 206, 60, 'var(--ink)', 2);
    s += circle(220, 60, 11, 'var(--c)', null, 0, 0.9);
    return svg(s);
  };

  PV.gates = function () {
    var X = function (v) { return 95 + 50 * v; }, Y = function (v) { return 90 - 60 * v; };
    var s = '<rect x="70" y="14" width="100" height="92" rx="7" fill="var(--a)" fill-opacity=".13" stroke="var(--line)" stroke-width="1.5"/>';
    s += '<polygon points="106.7,14 170,14 170,90" fill="var(--b)" fill-opacity=".24"/>';
    s += '<line x1="106.7" y1="14" x2="170" y2="90" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/>';
    [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 1]].forEach(function (p) {
      s += circle(X(p[0]), Y(p[1]), 8, p[2] ? 'var(--b)' : 'var(--a)', 'var(--card)', 2.5);
    });
    s += '<text x="56" y="62" font-size="11" font-weight="700" fill="var(--mute)" text-anchor="middle">x₂</text>';
    s += '<text x="120" y="116" font-size="11" font-weight="700" fill="var(--mute)" text-anchor="middle">x₁</text>';
    return svg(s);
  };

  PV.regions = function () {
    var T = [120, 24], L = [76, 96], R = [164, 96], s = '';
    s += '<polygon points="' + T + ' ' + R + ' ' + L + '" fill="var(--c)" fill-opacity=".2"/>';
    s += '<line x1="62" y1="96" x2="178" y2="96" stroke="var(--a)" stroke-width="2.6" stroke-linecap="round"/>';
    s += '<line x1="111" y1="9" x2="173" y2="113" stroke="var(--b)" stroke-width="2.6" stroke-linecap="round"/>';
    s += '<line x1="129" y1="9" x2="67" y2="113" stroke="var(--d)" stroke-width="2.6" stroke-linecap="round"/>';
    [[120, 66], [105, 82], [136, 80]].forEach(function (p) { s += circle(p[0], p[1], 5.5, 'var(--c)', 'var(--card)', 2); });
    [[186, 40], [48, 36], [120, 110], [196, 90], [38, 100], [150, 22]].forEach(function (p) { s += circle(p[0], p[1], 5.5, 'var(--mute)', 'var(--card)', 2); });
    return svg(s);
  };

  PV.backprop = function () {
    var I = [38, 60], H = [114, 60], O1 = [190, 30], O2 = [190, 90], R = 14, s = '';
    function edge(a, b, off) {
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, nx = -uy * off, ny = ux * off;
      return [a[0] + ux * (R + 2) + nx, a[1] + uy * (R + 2) + ny, b[0] - ux * (R + 4) + nx, b[1] - uy * (R + 4) + ny];
    }
    [[I, H], [H, O1], [H, O2]].forEach(function (e) {
      var f = edge(e[0], e[1], -4.5), b = edge(e[1], e[0], -4.5);
      s += arrow(f[0], f[1], f[2], f[3], 'var(--a)', 2.4);
      s += arrow(b[0], b[1], b[2], b[3], 'var(--b)', 2.4, '4 3');
    });
    [I, H, O1, O2].forEach(function (n, i) { s += circle(n[0], n[1], R, 'var(--card)', i === 0 ? 'var(--mute)' : 'var(--a)', 2.6); });
    s += '<text x="212" y="26" font-size="12" font-weight="700" fill="var(--b)">δ₁</text>';
    s += '<text x="212" y="100" font-size="12" font-weight="700" fill="var(--b)">δ₂</text>';
    s += '<text x="114" y="92" font-size="12" font-weight="700" fill="var(--b)" text-anchor="middle">δₕ</text>';
    return svg(s);
  };

  PV.clusters = function () {
    var r = rng(7), C = [[62, 42], [176, 40], [118, 90]], col = ['var(--a)', 'var(--b)', 'var(--c)'], pts = [], s = '', k, i;
    for (k = 0; k < 3; k++) for (i = 0; i < 16; i++) {
      pts.push({ k: k, x: Math.min(226, Math.max(14, C[k][0] + gauss(r) * 15)), y: Math.min(106, Math.max(14, C[k][1] + gauss(r) * 12)) });
    }
    var m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    pts.forEach(function (p) { m[p.k][0] += p.x; m[p.k][1] += p.y; m[p.k][2]++; });
    m = m.map(function (v) { return [v[0] / v[2], v[1] / v[2]]; });
    pts.forEach(function (p) { s += '<line x1="' + p.x.toFixed(1) + '" y1="' + p.y.toFixed(1) + '" x2="' + m[p.k][0].toFixed(1) + '" y2="' + m[p.k][1].toFixed(1) + '" stroke="' + col[p.k] + '" stroke-width="1" opacity=".35"/>'; });
    pts.forEach(function (p) {
      var x = p.x.toFixed(1), y = p.y.toFixed(1), c = col[p.k];
      if (p.k === 0) s += circle(x, y, 3.8, c, 'var(--pv-bg)', 1.5);
      else if (p.k === 1) s += '<rect x="' + (p.x - 3.4).toFixed(1) + '" y="' + (p.y - 3.4).toFixed(1) + '" width="6.8" height="6.8" fill="' + c + '" stroke="var(--pv-bg)" stroke-width="1.5"/>';
      else s += '<path d="M' + x + ' ' + (p.y - 4.4).toFixed(1) + 'L' + (p.x + 4.2).toFixed(1) + ' ' + (p.y + 3.4).toFixed(1) + 'L' + (p.x - 4.2).toFixed(1) + ' ' + (p.y + 3.4).toFixed(1) + 'Z" fill="' + c + '" stroke="var(--pv-bg)" stroke-width="1.5"/>';
    });
    m.forEach(function (c, j) {
      s += circle(c[0].toFixed(1), c[1].toFixed(1), 10.5, 'var(--card)', 'var(--ink)', 1.6) + circle(c[0].toFixed(1), c[1].toFixed(1), 8, col[j]);
      s += '<text x="' + c[0].toFixed(1) + '" y="' + (c[1] + 4).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">' + (j + 1) + '</text>';
    });
    return svg(s);
  };

  PV.anneal = function () {
    // a landscape with a shallow valley on the left and a deeper one on the right; the walker crosses the ridge
    var cost = function (x) { return 0.9 - 0.45 * Math.exp(-Math.pow((x - 56) / 24, 2)) - 0.8 * Math.exp(-Math.pow((x - 180) / 26, 2)); };
    var Y = function (x) { return 108 - cost(x) * 92; };
    var d = '', x, s = '';
    for (x = -2; x <= 242; x += 4) d += (x < 0 ? 'M' : 'L') + x + ' ' + Y(x).toFixed(1);
    s += '<path d="' + d + 'L242 122L-2 122Z" fill="var(--a)" fill-opacity=".13"/>';
    s += '<path d="' + d + '" fill="none" stroke="var(--a)" stroke-width="2.8" stroke-linejoin="round"/>';
    // the walker's trail, then what happened at each step
    var trail = [16, 34, 56, 76, 96, 116, 138, 160, 180], tr = '';
    trail.forEach(function (t, i) { tr += (i ? 'L' : 'M') + t + ' ' + (Y(t) - 9).toFixed(1); });
    s += '<path d="' + tr + '" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="2 4" stroke-linecap="round" opacity=".55"/>';
    [16, 34, 56, 160].forEach(function (t) { s += circle(t, (Y(t) - 9).toFixed(1), 4.6, 'var(--c)', 'var(--card)', 1.8); });
    [76, 96, 116].forEach(function (t) {
      var y = Y(t) - 9;
      s += '<path d="M' + t + ' ' + (y - 6.5).toFixed(1) + 'L' + (t + 6) + ' ' + (y + 4.5).toFixed(1) + 'L' + (t - 6) + ' ' + (y + 4.5).toFixed(1) + 'Z" fill="var(--b)" stroke="var(--card)" stroke-width="1.6" stroke-linejoin="round"/>';
    });
    var rx = 138, ry = Y(rx) - 9;
    s += '<path d="M' + (rx - 4) + ' ' + (ry - 4).toFixed(1) + 'L' + (rx + 4) + ' ' + (ry + 4).toFixed(1) + 'M' + (rx + 4) + ' ' + (ry - 4).toFixed(1) + 'L' + (rx - 4) + ' ' + (ry + 4).toFixed(1) + '" stroke="var(--bad)" stroke-width="2.6" stroke-linecap="round"/>';
    s += circle(180, (Y(180) - 9).toFixed(1), 8, 'var(--c)', 'var(--card)', 2.2);
    return svg(s);
  };

  PV.genetic = function () {
    // two parent bit strings, a crossover cut, and a child with one mutated bit
    var A = [1, 0, 1, 1, 0, 0, 1, 0], B = [0, 1, 1, 0, 1, 1, 0, 1], cut = 3, mut = 5, W = 20, G = 3, x0 = 29.5, s = '';
    var child = A.slice(0, cut).concat(B.slice(cut));
    child[mut] = 1 - child[mut];
    function row(bits, y, colorOf) {
      var out = '';
      bits.forEach(function (b, i) {
        var col = colorOf(i), px = x0 + i * (W + G);
        out += '<rect x="' + px + '" y="' + y + '" width="' + W + '" height="' + W + '" rx="4" fill="' + (b ? col : 'var(--card)') + '" stroke="' + col + '" stroke-width="2"/>';
        out += '<text x="' + (px + W / 2) + '" y="' + (y + 14.5) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + (b ? 'var(--a-ink)' : 'var(--ink)') + '">' + b + '</text>';
      });
      return out;
    }
    var cutX = x0 + cut * (W + G) - G / 2;
    s += row(A, 10, function () { return 'var(--a)'; });
    s += row(B, 38, function () { return 'var(--b)'; });
    s += arrow(120, 62, 120, 84, 'var(--ink)', 2);
    s += row(child, 90, function (i) { return i === mut ? 'var(--d)' : i < cut ? 'var(--a)' : 'var(--b)'; });
    s += '<line x1="' + cutX + '" y1="4" x2="' + cutX + '" y2="116" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="4 3" opacity=".6"/>';
    var mx = x0 + mut * (W + G);
    s += '<rect x="' + (mx - 3) + '" y="87" width="' + (W + 6) + '" height="' + (W + 6) + '" rx="6" fill="none" stroke="var(--d)" stroke-width="1.6" opacity=".8"/>';
    return svg(s);
  };

  PV.swarm = function () {
    var cx = 120, cy = 62, s = '';
    [52, 40, 28, 17, 8].forEach(function (r, i) {
      s += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (r * 1.4) + '" ry="' + r + '" fill="none" stroke="var(--a)" stroke-width="1.6" opacity="' + (0.16 + i * 0.12).toFixed(2) + '"/>';
    });
    var P = [[48, 30], [78, 98], [186, 34], [170, 100], [104, 24], [150, 20], [64, 66], [204, 70], [128, 100], [160, 62], [30, 88]];
    P.forEach(function (p) {
      var vx = (cx - p[0]) * 0.2, vy = (cy - p[1]) * 0.2, L = Math.sqrt(vx * vx + vy * vy) || 1, len = Math.min(20, Math.max(10, L));
      s += arrow(p[0], p[1], p[0] + vx / L * len, p[1] + vy / L * len, 'var(--ink)', 1.6);
    });
    P.forEach(function (p) { s += circle(p[0], p[1], 4.4, 'var(--a)', 'var(--card)', 1.6); });
    var g = [127, 58], pts = '';
    for (var k = 0; k < 10; k++) { var rr = k % 2 ? 4.6 : 10.5, a = -Math.PI / 2 + k * Math.PI / 5; pts += (g[0] + rr * Math.cos(a)).toFixed(1) + ',' + (g[1] + rr * Math.sin(a)).toFixed(1) + ' '; }
    s += '<polygon points="' + pts + '" fill="var(--b)" stroke="var(--card)" stroke-width="1.5"/>';
    return svg(s);
  };

  PV.fallback = function () {
    var s = '', x, y;
    for (x = 20; x < 240; x += 20) for (y = 20; y < 120; y += 20) s += circle(x, y, 2.2, 'var(--mute)', null, 0, 0.45);
    s += '<path d="M104 38L148 60L104 82Z" fill="var(--a)" fill-opacity=".9"/>';
    return svg(s);
  };

  /* ---------- cards, search and filters ---------- */
  var state = { q: '', level: '', topic: '' };
  var list = $('#lab-list'), statusEl = $('#status'), levelBox = $('#f-level'), topicBox = $('#f-topic'), searchEl = $('#q');

  function cardHTML(l, idx) {
    var n = String(idx + 1); if (n.length < 2) n = '0' + n;
    var pv = (PV[l.preview] || PV.fallback)();
    var lvl = l.level ? '<span class="lvl l-' + esc(String(l.level).replace(/\s+/g, '')) + '">' + esc(l.level) + '</span>' : '';
    var obj = (l.objectives || []).map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('');
    var tags = (l.tags || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    return '<li><article class="card">' +
      '<div class="pv">' + pv + '</div>' +
      '<div class="body">' +
        '<p class="meta"><span class="num">LAB ' + n + '</span>' + lvl + (l.topic ? '<span>' + esc(l.topic) + '</span>' : '') + '</p>' +
        '<h3><a href="' + esc(l.file) + '">' + esc(l.title) + '</a></h3>' +
        '<p class="sum">' + esc(l.summary) + '</p>' +
        (obj ? '<p class="learn">You will learn to</p><ul class="obj">' + obj + '</ul>' : '') +
        '<div class="foot"><ul class="tags" aria-label="Tags">' + tags + '</ul><span class="open" aria-hidden="true">Open lab →</span></div>' +
      '</div></article></li>';
  }

  function haystack(l) {
    return norm([l.title, l.summary, l.level, l.topic, (l.tags || []).join(' '), (l.objectives || []).join(' ')].join(' '));
  }
  var HAY = LABS.map(haystack);

  function matches(i) {
    var l = LABS[i];
    if (state.level && l.level !== state.level) return false;
    if (state.topic && l.topic !== state.topic) return false;
    var terms = norm(state.q).split(/\s+/).filter(Boolean);
    for (var t = 0; t < terms.length; t++) if (HAY[i].indexOf(terms[t]) < 0) return false;
    return true;
  }

  function render() {
    var out = [], i;
    for (i = 0; i < LABS.length; i++) if (matches(i)) out.push(cardHTML(LABS[i], i));
    var filtered = state.q.trim() || state.level || state.topic;
    if (!LABS.length) {
      list.innerHTML = '<li class="empty" style="grid-column:1/-1">No laboratories are registered yet. Add one in assets/labs.js.</li>';
    } else if (!out.length) {
      list.innerHTML = '<li class="empty" style="grid-column:1/-1"><b>No laboratory matches.</b><br>Try a different word or clear the filters.</li>';
    } else {
      list.innerHTML = out.join('');
    }
    var msg = filtered
      ? 'Showing ' + out.length + ' of ' + LABS.length + ' laboratories'
      : LABS.length + (LABS.length === 1 ? ' laboratory' : ' laboratories');
    statusEl.innerHTML = '<span>' + msg + '</span>' +
      (filtered ? '<button type="button" class="link-btn" id="clear">Clear filters</button>' : '');
    var c = $('#clear'); if (c) c.onclick = function () { state = { q: '', level: '', topic: '' }; searchEl.value = ''; chips(); render(); };
  }

  function chipGroup(box, key, values, allLabel) {
    box.innerHTML = '<button type="button" class="chip" data-v="" aria-pressed="' + (state[key] === '') + '">' + allLabel + '</button>' +
      values.map(function (v) { return '<button type="button" class="chip" data-v="' + esc(v) + '" aria-pressed="' + (state[key] === v) + '">' + esc(v) + '</button>'; }).join('');
  }
  function uniq(key) { var seen = {}, out = []; LABS.forEach(function (l) { var v = l[key]; if (v && !seen[v]) { seen[v] = 1; out.push(v); } }); return out; }
  function chips() {
    var levels = uniq('level').sort(function (a, b) {
      var x = LEVEL_ORDER.indexOf(a), y = LEVEL_ORDER.indexOf(b);
      return (x < 0 ? 99 : x) - (y < 0 ? 99 : y);
    });
    chipGroup(levelBox, 'level', levels, 'All levels');
    chipGroup(topicBox, 'topic', uniq('topic'), 'All topics');
    levelBox.parentNode.hidden = levels.length < 2;
    topicBox.parentNode.hidden = uniq('topic').length < 2;
  }
  function onChip(key) {
    return function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      state[key] = b.getAttribute('data-v'); chips(); render();
    };
  }
  levelBox.addEventListener('click', onChip('level'));
  topicBox.addEventListener('click', onChip('topic'));
  searchEl.addEventListener('input', function () { state.q = searchEl.value; render(); });

  var count = $('#count'); if (count) count.textContent = LABS.length;
  chips(); render();

  /* ---------- hero demo: one sigmoid neuron ---------- */
  (function demo() {
    var w = $('#dw'), b = $('#db'), plot = $('#dplot');
    if (!w || !b || !plot) return;
    var X0 = 46, X1 = 344, Y0 = 170, Y1 = 28, XIN = 1;
    var px = function (x) { return X0 + (x + 3) / 6 * (X1 - X0); };
    var py = function (y) { return Y0 - y * (Y0 - Y1); };
    var sig = function (z) { return 1 / (1 + Math.exp(-z)); };

    var link = $('#demo-link');
    if (link) {
      var target = LABS.filter(function (l) { return l.id === 'artificial-neurons'; })[0] || LABS[0];
      if (target) link.href = target.file;
    }

    function draw() {
      var wv = +w.value, bv = +b.value, z = wv * XIN + bv, y = sig(z), s = '', i, t;
      for (t = 0; t <= 1.001; t += 0.5) {
        s += '<line x1="' + X0 + '" x2="' + X1 + '" y1="' + py(t) + '" y2="' + py(t) + '" stroke="var(--line)" stroke-width="' + (t === 0 ? 2 : 1) + '"' + (t === 0.5 ? ' stroke-dasharray="3 4"' : '') + '/>';
        s += '<text x="' + (X0 - 8) + '" y="' + (py(t) + 4) + '" text-anchor="end" font-size="11" fill="var(--mute)">' + (t === 0.5 ? '0.5' : t) + '</text>';
      }
      for (i = -3; i <= 3; i++) {
        s += '<line x1="' + px(i) + '" x2="' + px(i) + '" y1="' + py(0) + '" y2="' + (py(0) + 4) + '" stroke="var(--mute)"/>';
        s += '<text x="' + px(i) + '" y="' + (py(0) + 18) + '" text-anchor="middle" font-size="11" fill="var(--mute)">' + (i < 0 ? '−' + (-i) : i) + '</text>';
      }
      s += '<text x="' + X1 + '" y="206" text-anchor="end" font-size="11" fill="var(--mute)">input x</text>';
      s += '<text x="' + X0 + '" y="16" font-size="11" fill="var(--mute)">output y = σ(w·x + b)</text>';

      var path = '';
      for (i = 0; i <= 120; i++) { var x = -3 + i * 0.05; path += (i ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(sig(wv * x + bv)).toFixed(1); }

      var sw = Math.abs(wv) > 1e-9 ? -bv / wv : null;
      if (sw !== null && sw >= -3 && sw <= 3) {
        s += '<line x1="' + px(sw) + '" x2="' + px(sw) + '" y1="' + py(0) + '" y2="' + py(1) + '" stroke="var(--b)" stroke-width="2" stroke-dasharray="5 4"/>';
      }
      s += '<path d="' + path + '" fill="none" stroke="var(--a)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>';
      if (sw !== null && sw >= -3 && sw <= 3) {
        s += '<circle cx="' + px(sw) + '" cy="' + py(0.5) + '" r="5" fill="var(--b)" stroke="var(--card)" stroke-width="2"/>';
      }
      /* the fixed input x = 1 */
      s += '<line x1="' + px(XIN) + '" x2="' + px(XIN) + '" y1="' + py(0) + '" y2="' + py(y) + '" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="2 3"/>';
      s += '<circle cx="' + px(XIN) + '" cy="' + py(y) + '" r="6.5" fill="var(--ink)" stroke="var(--card)" stroke-width="2.5"/>';
      /* keep the label off the curve: below-right of a rising curve, above-right of a falling one */
      var lx = px(XIN) + 12, ly = py(y) - 10, anchor = 'start';
      if (wv > 0) { if (y > 0.2) ly = py(y) + 18; else { lx = px(XIN) - 12; anchor = 'end'; } }
      s += '<text x="' + lx + '" y="' + ly + '" text-anchor="' + anchor + '" font-size="12" font-weight="700" fill="var(--ink)">y = ' + fmt(y, 2) + '</text>';
      plot.innerHTML = s;

      $('#dwv').textContent = fmt(wv, 1);
      $('#dbv').textContent = fmt(bv, 1);
      $('#dout').textContent = fmt(y, 2);
      $('#dsw').textContent = sw === null ? 'never' : fmt(sw, 2);
      var swNote = $('#dswnote');
      if (swNote) swNote.textContent = sw === null ? 'w = 0, so the output is the same for every x' : (sw < -3 || sw > 3 ? 'outside the plotted range' : 'where the output crosses 0.5');
      $('#dcalc').textContent = 'z = w·x + b = ' + fmt(wv, 1) + ' × 1 + (' + fmt(bv, 1) + ') = ' + fmt(z, 1) + '  →  y = σ(' + fmt(z, 1) + ') = ' + fmt(y, 2);
      plot.setAttribute('aria-label', 'Sigmoid neuron with weight ' + fmt(wv, 1) + ' and bias ' + fmt(bv, 1) + '. For the input x = 1 the output is ' + fmt(y, 2) + '. ' +
        (sw === null ? 'The weight is zero, so the output does not depend on x.' : 'The output crosses 0.5 at x = ' + fmt(sw, 2) + '.'));
    }
    w.addEventListener('input', draw);
    b.addEventListener('input', draw);
    draw();
  })();
})();
