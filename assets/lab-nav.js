/*
 * Learning AI Can be Fun (LIACbF): floating Home / Prev / Next navigation for labs
 * ---------------------------------------------------------------------------------
 * Add these two lines just before </body> in every lab (note the ../):
 *
 *   <script src="../assets/labs.js"></script>
 *   <script src="../assets/lab-nav.js"></script>
 *
 * The button lives in a Shadow DOM, so the lab's own CSS cannot affect it and it
 * cannot affect the lab. It can be minimised, follows the visitor's light/dark
 * setting, and is hidden when the lab is opened with ?embed=1 (for iframes).
 */
(function () {
  'use strict';
  if (/[?&]embed=1(&|$)/.test(location.search)) return;

  var script = document.currentScript || document.querySelector('script[src$="lab-nav.js"]');
  var root = null;
  try { root = new URL('../', script.src); } catch (e) {}

  var labs = Array.isArray(window.LABS) ? window.LABS : [];
  var here = '';
  try { here = decodeURIComponent(location.pathname.split('/').pop()); } catch (e) { here = location.pathname.split('/').pop(); }
  var at = -1;
  for (var k = 0; k < labs.length; k++) {
    if (String(labs[k].file).split('/').pop() === here) { at = k; break; }
  }

  function url(p) { return root ? new URL(p, root).href : '../' + p; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var prev = at > 0 ? labs[at - 1] : null;
  var next = at >= 0 && at < labs.length - 1 ? labs[at + 1] : null;

  var I = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5.5h4V20"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
  };

  function step(lab, dir) {
    var word = dir === 'prev' ? 'Previous' : 'Next';
    if (!lab) {
      return '<span class="off" aria-hidden="true">' +
        (dir === 'prev' ? I.prev + '<span class="lbl">Prev</span>' : '<span class="lbl">Next</span>' + I.next) + '</span>';
    }
    return '<a href="' + esc(url(lab.file)) + '" title="' + word + ': ' + esc(lab.title) + '" aria-label="' + word + ' lab: ' + esc(lab.title) + '">' +
      (dir === 'prev' ? I.prev + '<span class="lbl">Prev</span>' : '<span class="lbl">Next</span>' + I.next) + '</a>';
  }

  var css =
    ':host{all:initial;--bg:#fff;--ink:#15222a;--mute:#52636b;--line:#cfd7d3;--hover:#eaf0ed;--focus:#17728f}' +
    '@media (prefers-color-scheme:dark){:host{--bg:#162126;--ink:#e7f0ee;--mute:#a3b4b7;--line:#34464b;--hover:#223037;--focus:#5cc3e8}}' +
    '*{box-sizing:border-box}' +
    '.bar{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));z-index:2147483000;' +
    'display:flex;align-items:center;gap:2px;padding:4px;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:999px;' +
    'box-shadow:0 6px 22px rgba(0,0,0,.2);font:600 14px/1 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}' +
    '.bar a,.bar button,.bar .off{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-width:40px;min-height:40px;padding:0 11px;' +
    'border:0;border-radius:999px;background:none;color:inherit;font:inherit;text-decoration:none;cursor:pointer}' +
    '.bar a:hover,.bar button:hover{background:var(--hover)}' +
    '.bar a:focus-visible,.bar button:focus-visible{outline:3px solid var(--focus);outline-offset:1px}' +
    '.off{opacity:.38;cursor:default!important}' +
    '.pos{color:var(--mute);font-weight:600;font-variant-numeric:tabular-nums;padding:0 4px;display:none}' +
    '.lbl{display:none}' +
    '.sep{width:1px;height:22px;background:var(--line);margin:0 2px}' +
    'svg{width:18px;height:18px;flex:none;display:block}' +
    '@media (min-width:560px){.lbl,.pos{display:inline}}' +
    '.full{display:contents}' +
    '.bar.min .full{display:none}' +
    '.bar.min{padding:3px}' +
    '@media print{.bar{display:none}}';

  var host = document.createElement('div');
  host.id = 'liacbf-nav';
  var sh = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

  var posTxt = at >= 0 ? '<span class="pos" aria-hidden="true">' + (at + 1) + ' / ' + labs.length + '</span>' : '';
  sh.innerHTML = '<style>' + css + '</style>' +
    '<nav class="bar" aria-label="Laboratory navigation">' +
      '<span class="full">' +
        step(prev, 'prev') +
        '<a href="' + esc(url('index.html')) + '" title="All laboratories" aria-label="LIACbF home: all laboratories">' + I.home + '<span class="lbl">Home</span></a>' +
        posTxt +
        step(next, 'next') +
        '<span class="sep" aria-hidden="true"></span>' +
      '</span>' +
      '<button type="button" class="tog" aria-expanded="true" aria-label="Hide lab navigation" title="Hide lab navigation">' + I.close + '</button>' +
    '</nav>';

  var bar = sh.querySelector('.bar'), tog = sh.querySelector('.tog');
  function setMin(min, save) {
    bar.classList.toggle('min', min);
    tog.setAttribute('aria-expanded', String(!min));
    tog.setAttribute('aria-label', min ? 'Show lab navigation' : 'Hide lab navigation');
    tog.title = min ? 'Show lab navigation' : 'Hide lab navigation';
    tog.innerHTML = min ? I.menu : I.close;
    if (save) { try { sessionStorage.setItem('liacbf-nav-min', min ? '1' : '0'); } catch (e) {} }
  }
  tog.addEventListener('click', function () { setMin(!bar.classList.contains('min'), true); });
  /* keystrokes on the nav must not trigger a lab's own keyboard shortcuts (Space, S, R, arrows...) */
  sh.addEventListener('keydown', function (e) { e.stopPropagation(); });
  try { if (sessionStorage.getItem('liacbf-nav-min') === '1') setMin(true, false); } catch (e) {}

  function mount() { document.body.appendChild(host); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
