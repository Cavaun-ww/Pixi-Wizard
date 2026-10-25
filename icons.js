// Pixi Wizard custom icons: swaps the site's emojis for matching brand icons, automatically.
(function () {
  var ICONS = {"wand": "<path d=\"M6 26 L19 13\" stroke-width=\"3.4\"/><path class=\"f\" d=\"M22.5 3.5Q22.5 9.5 28.5 9.5Q22.5 9.5 22.5 15.5Q22.5 9.5 16.5 9.5Q22.5 9.5 22.5 3.5Z\"/><path class=\"s\" d=\"M9 6.4Q9 9 11.6 9Q9 9 9 11.6Q9 9 6.4 9Q9 9 9 6.4Z\"/><path class=\"s\" d=\"M26.5 18.8Q26.5 21 28.7 21Q26.5 21 26.5 23.2Q26.5 21 24.3 21Q26.5 21 26.5 18.8Z\"/>", "sparkles": "<path class=\"f\" d=\"M13 8Q13 18 23 18Q13 18 13 28Q13 18 3 18Q13 18 13 8Z\"/><path class=\"f\" d=\"M25 3.5Q25 8 29.5 8Q25 8 25 12.5Q25 8 20.5 8Q25 8 25 3.5Z\"/><path class=\"s\" d=\"M25.5 22.6Q25.5 25 27.9 25Q25.5 25 25.5 27.4Q25.5 25 23.1 25Q25.5 25 25.5 22.6Z\"/>", "pin": "<path class=\"f\" d=\"M16 29C16 29 6 20 6 13A10 10 0 0 1 26 13C26 20 16 29 16 29Z\"/><circle cx=\"16\" cy=\"13\" r=\"3.6\"/>", "chat": "<path class=\"f\" d=\"M8 6H24A4.5 4.5 0 0 1 28.5 10.5V19A4.5 4.5 0 0 1 24 23.5H14.5L8.5 28.5V23.5H8A4.5 4.5 0 0 1 3.5 19V10.5A4.5 4.5 0 0 1 8 6Z\"/><circle class=\"d\" cx=\"10.5\" cy=\"14.8\" r=\"1.7\"/><circle class=\"d\" cx=\"16\" cy=\"14.8\" r=\"1.7\"/><circle class=\"d\" cx=\"21.5\" cy=\"14.8\" r=\"1.7\"/>", "heart": "<path class=\"solid\" d=\"M16 27.5C16 27.5 3.5 20 3.5 11.8A6.6 6.6 0 0 1 16 8.4A6.6 6.6 0 0 1 28.5 11.8C28.5 20 16 27.5 16 27.5Z\"/>", "heart-o": "<path d=\"M16 27.5C16 27.5 3.5 20 3.5 11.8A6.6 6.6 0 0 1 16 8.4A6.6 6.6 0 0 1 28.5 11.8C28.5 20 16 27.5 16 27.5Z\"/>", "lock": "<path d=\"M10 14.5V11A6 6 0 0 1 22 11V14.5\"/><rect class=\"f\" x=\"5.5\" y=\"14.5\" width=\"21\" height=\"14\" rx=\"4.5\"/><circle class=\"d\" cx=\"16\" cy=\"20.5\" r=\"2\"/><path d=\"M16 22.5V24.8\"/>", "globe": "<circle class=\"f\" cx=\"16\" cy=\"16\" r=\"12.3\"/><ellipse cx=\"16\" cy=\"16\" rx=\"5.2\" ry=\"12.3\"/><path d=\"M3.8 16H28.2M5.8 9.8Q16 12 26.2 9.8M5.8 22.2Q16 20 26.2 22.2\"/>", "hide": "<path class=\"f\" d=\"M3 16Q16 3.5 29 16Q16 28.5 3 16Z\"/><circle cx=\"16\" cy=\"16\" r=\"4.4\"/><path d=\"M5 4.5L27 27.5\" stroke-width=\"2.6\"/>", "eye": "<path class=\"f\" d=\"M3 16Q16 3.5 29 16Q16 28.5 3 16Z\"/><circle class=\"d\" cx=\"16\" cy=\"16\" r=\"4.6\"/>", "scissors": "<circle cx=\"9\" cy=\"23.5\" r=\"3.8\"/><circle cx=\"23\" cy=\"23.5\" r=\"3.8\"/><path d=\"M11.6 20.7L24.5 4.5M20.4 20.7L7.5 4.5\"/>", "image": "<rect class=\"f\" x=\"4\" y=\"6\" width=\"24\" height=\"20\" rx=\"4.5\"/><circle class=\"d\" cx=\"11.5\" cy=\"12.5\" r=\"2.5\"/><path d=\"M4.5 23L12 15.5L17 20.5L20 17.5L27.5 25\"/>", "video": "<rect class=\"f\" x=\"3.5\" y=\"7.5\" width=\"25\" height=\"18\" rx=\"4.5\"/><path class=\"solid\" d=\"M13.5 12.2V21L21.2 16.6Z\"/><path class=\"s\" d=\"M27 3.4Q27 6 29.6 6Q27 6 27 8.6Q27 6 24.4 6Q27 6 27 3.4Z\"/>", "link": "<path d=\"M13.5 18.5L18.5 13.5M15 9.8L17.4 7.4A5.2 5.2 0 0 1 24.6 14.6L22.2 17M17 22.2L14.6 24.6A5.2 5.2 0 0 1 7.4 17.4L9.8 15\"/>", "locate": "<circle class=\"f\" cx=\"16\" cy=\"16\" r=\"9\"/><circle class=\"d\" cx=\"16\" cy=\"16\" r=\"3.2\"/><path d=\"M16 2.8V7M16 25V29.2M2.8 16H7M25 16H29.2\"/>", "palette": "<path class=\"f\" d=\"M16 4C9 4 4 9.2 4 15.6C4 22.3 9.2 28 15.2 28C17.4 28 18 26.4 17.2 24.8C16.3 23 17.4 21.2 19.4 21.2H22.4C25.8 21.2 28 18.8 28 15.4C28 9.2 22.6 4 16 4Z\"/><circle cx=\"10.2\" cy=\"14.6\" r=\"2\" fill=\"#ffc24b\" stroke=\"none\"/><circle cx=\"13.4\" cy=\"9.4\" r=\"2\" fill=\"#ff5fd2\" stroke=\"none\"/><circle cx=\"19.4\" cy=\"9\" r=\"2\" fill=\"#a855f7\" stroke=\"none\"/><circle cx=\"23.6\" cy=\"13.4\" r=\"2\" fill=\"#5ee7ff\" stroke=\"none\"/>", "gear": "<path class=\"f\" d=\"M16.00 6.40 L18.44 3.74 L20.78 4.45 L21.33 8.02 L22.79 9.21 L26.39 9.06 L27.55 11.22 L25.42 14.13 L25.60 16.00 L28.26 18.44 L27.55 20.78 L23.98 21.33 L22.79 22.79 L22.94 26.39 L20.78 27.55 L17.87 25.42 L16.00 25.60 L13.56 28.26 L11.22 27.55 L10.67 23.98 L9.21 22.79 L5.61 22.94 L4.45 20.78 L6.58 17.87 L6.40 16.00 L3.74 13.56 L4.45 11.22 L8.02 10.67 L9.21 9.21 L9.06 5.61 L11.22 4.45 L14.13 6.58Z\"/><circle cx=\"16\" cy=\"16\" r=\"4.2\"/>", "camera": "<path class=\"f\" d=\"M7.5 10H11L13 6.8H19L21 10H24.5A4 4 0 0 1 28.5 14V23A4 4 0 0 1 24.5 27H7.5A4 4 0 0 1 3.5 23V14A4 4 0 0 1 7.5 10Z\"/><circle cx=\"16\" cy=\"18.5\" r=\"5\"/><circle class=\"d\" cx=\"24.2\" cy=\"14.2\" r=\"1.2\"/>", "phone": "<rect class=\"f\" x=\"8.5\" y=\"3\" width=\"15\" height=\"26\" rx=\"4.5\"/><path d=\"M13.8 25.2H18.2\"/><path class=\"s\" d=\"M16 9.5Q16 13.5 20 13.5Q16 13.5 16 17.5Q16 13.5 12 13.5Q16 13.5 16 9.5Z\"/>", "party": "<path class=\"f\" d=\"M4.5 28L11 12.5L20 21.5Z\"/><path d=\"M15.5 9.5L17.5 5M22.5 16.5L27 14.5\"/><circle class=\"d\" cx=\"24\" cy=\"9.5\" r=\"1.7\"/><circle class=\"d\" cx=\"13\" cy=\"4.5\" r=\"1.3\"/><path class=\"s\" d=\"M26 1.9Q26 4.5 28.6 4.5Q26 4.5 26 7.1Q26 4.5 23.4 4.5Q26 4.5 26 1.9Z\"/><path class=\"s\" d=\"M27.5 20.8Q27.5 23 29.7 23Q27.5 23 27.5 25.2Q27.5 23 25.3 23Q27.5 23 27.5 20.8Z\"/>", "mute": "<path class=\"f\" d=\"M4.5 12H9.5L16 6.5V25.5L9.5 20H4.5Z\"/><path d=\"M21 12.5L28 19.5M28 12.5L21 19.5\"/>", "warn": "<path class=\"f\" d=\"M16 4.5L28.5 26.5H3.5Z\"/><path d=\"M16 12V18.5\"/><circle class=\"d\" cx=\"16\" cy=\"22.4\" r=\"1.5\"/>", "share": "<path d=\"M13 6.5H9A4 4 0 0 0 5 10.5V23A4 4 0 0 0 9 27H21.5A4 4 0 0 0 25.5 23V19M18 5H27V14M27 5L15 17\"/>"};
  var MAP = {"🪄": "wand", "✨": "sparkles", "📍": "pin", "💬": "chat", "♥": "heart", "♡": "heart-o", "🔒": "lock", "🌍": "globe", "🙈": "hide", "👁": "eye", "✂": "scissors", "🖼": "image", "🎬": "video", "🔗": "link", "🎯": "locate", "🎨": "palette", "⚙": "gear", "📷": "camera", "📱": "phone", "🎉": "party", "🔇": "mute", "⚠": "warn", "↗": "share"};
  var NS = "http://www.w3.org/2000/svg";
  var RE = new RegExp("(" + Object.keys(MAP).map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")\uFE0F?", "g");
  // places where people type their own text: leave their emojis alone
  var SKIP = "script,style,textarea,input,select,option,title,a-scene,svg,.pwi,[data-noicon],.txt,.bubble,.bio,.title,.t,#title,.np-title,.last,.cm .who a,.xp .title";

  function svg(name) {
    return '<svg class="pwi" data-icon="' + name + '" viewBox="0 0 32 32" fill="none" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }
  function addDefs() {
    if (document.getElementById("pw-icon-defs")) return;
    var d = document.createElement("div");
    d.innerHTML = '<svg id="pw-icon-defs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
      '<linearGradient id="pwg" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="30" y2="30"><stop offset="0" stop-color="#ffc24b"/><stop offset=".5" stop-color="#ff5fd2"/><stop offset="1" stop-color="#a855f7"/></linearGradient>' +
      '<linearGradient id="pwf" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="30" y2="30"><stop offset="0" stop-color="#ffc24b" stop-opacity=".28"/><stop offset=".5" stop-color="#ff5fd2" stop-opacity=".24"/><stop offset="1" stop-color="#a855f7" stop-opacity=".3"/></linearGradient>' +
      "</defs></svg>";
    document.body.appendChild(d.firstChild);
    var st = document.createElement("style");
    st.textContent =
      ".pwi{display:inline-block;width:1.15em;height:1.15em;vertical-align:-.2em;stroke:var(--pws,url(#pwg));flex:0 0 auto;overflow:visible}" +
      ".pwi .f{fill:var(--pwf,url(#pwf))}.pwi .d,.pwi .s,.pwi .solid{fill:var(--pws,url(#pwg));stroke:none}" +
      // on bright buttons and dark photo badges, icons go white
      ".btn-primary,#start-btn,.where-go,.go,#c-post,.chips .on,.fx-seg .on,.near-btn.on,.tile .lk,.tile .ar,.tile .pin,.hide-badge,.np-av,#now-playing,.pill.pro,.pri,.confetti,.toast,#soft-note" +
      "{--pws:currentColor;--pwf:rgba(255,255,255,.22)}" +
      "#like-btn.on .pwi,.cl.on .pwi{--pws:#ff5fd2}";
    document.head.appendChild(st);
  }
  function fix(node) {
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      if (!t || !RE.test(t)) return; RE.lastIndex = 0;
      var p = node.parentElement;
      if (!p || p.closest(SKIP)) return;
      var span = document.createElement("span");
      span.innerHTML = t.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; })
        .replace(RE, function (m, e) { return svg(MAP[e]); });
      var frag = document.createDocumentFragment();
      while (span.firstChild) frag.appendChild(span.firstChild);
      node.parentNode.replaceChild(frag, node);
      return;
    }
    if (node.nodeType !== 1 || node.matches(SKIP)) return;
    var w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), list = [], n;
    while ((n = w.nextNode())) list.push(n);
    list.forEach(fix);
  }
  function start() {
    addDefs();
    fix(document.body);
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type === "characterData") fix(m.target);
        else m.addedNodes.forEach(fix);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  window.PWIcon = svg;
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
