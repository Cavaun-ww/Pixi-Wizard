// Shared helpers used by every page.
(function () {
  const C = window.APP_CONFIG;
  const configured = !/YOUR-/.test(C.SUPABASE_URL + C.SUPABASE_ANON_KEY);

  const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  });

  const BUCKET = "ar";
  const siteRoot = location.origin + location.pathname.replace(/[^/]*$/, ""); // folder the site lives in

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function publicUrl(path) {
    return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  function arLink(slug) { return siteRoot + "ar.html?x=" + encodeURIComponent(slug); }
  function profileLink(handle) { return siteRoot + "u.html?h=" + encodeURIComponent(handle); }

  let toastTimer;
  function toast(msg, isErr) {
    if (isErr && /failed to fetch|networkerror|load failed/i.test(String(msg))) {
      msg = "Can't reach the server right now. Check your internet connection and try again.";
    }
    let el = document.getElementById("toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.className = "show" + (isErr ? " err" : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.className = el.className.replace("show", "")), isErr ? 5000 : 2600);
  }

  async function getSession() {
    const { data } = await sb.auth.getSession();
    return data.session;
  }

  async function requireAuth() {
    const s = await getSession();
    if (!s) {
      location.href = "auth.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search);
      return new Promise(() => {}); // stop the page
    }
    return s;
  }

  async function myPlan() {
    const { data, error } = await sb.rpc("my_plan");
    if (error) throw error;
    return data;
  }

  async function callFunction(name, body) {
    const s = await getSession();
    const res = await fetch(C.SUPABASE_URL + "/functions/v1/" + name, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: C.SUPABASE_ANON_KEY,
        Authorization: "Bearer " + (s ? s.access_token : C.SUPABASE_ANON_KEY),
      },
      body: JSON.stringify(body || {}),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(out.error || "Request failed (" + res.status + ")");
    return out;
  }

  // ── PayPal subscriptions ─────────────────────────────────────
  function loadPayPal() {
    if (window.paypal) return Promise.resolve(window.paypal);
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(C.PAYPAL_CLIENT_ID) +
        "&vault=true&intent=subscription&components=buttons&disable-funding=credit,paylater&currency=" + encodeURIComponent(C.PAYPAL_CURRENCY || "USD");
      s.setAttribute("data-namespace", "paypal");
      s.onload = () => res(window.paypal);
      s.onerror = () => rej(new Error("PayPal couldn't load. Turn off ad blockers and try again."));
      document.head.appendChild(s);
    });
  }

  // Opens the upgrade popup with PayPal's Subscribe buttons.
  // onDone() runs once the server has confirmed the subscription with PayPal.
  async function openUpgrade(onDone) {
    const s = await getSession();
    if (!s) { location.href = "auth.html?next=" + encodeURIComponent("dashboard.html?upgrade=1"); return; }
    if (/YOUR-/.test(C.PAYPAL_CLIENT_ID + C.PAYPAL_PLAN_ID)) {
      toast("✨ Pro subscriptions are coming soon! Check back shortly.");
      return;
    }

    let bg = document.getElementById("upgrade-modal");
    if (!bg) {
      bg = document.createElement("div");
      bg.className = "modal-bg"; bg.id = "upgrade-modal";
      bg.innerHTML =
        '<div class="modal" style="text-align:center">' +
          '<img src="logo-mark.png" alt="" style="width:84px;margin:0 auto 6px"><span class="pill pro">Pro</span>' +
          '<h2 style="margin:12px 0 4px">Unlimited AR experiences</h2>' +
          '<p class="muted" style="margin-bottom:14px">Cancel anytime. Everything you upload stays live.</p>' +
          '<div style="font-size:2rem;margin-bottom:16px">' + esc(C.PRO_PRICE_LABEL) + ' <span class="muted" style="font-size:1rem">/ ' + esc(C.PRO_PRICE_PERIOD) + "</span></div>" +
          '<div id="paypal-buttons" style="min-height:110px"><p class="small muted" style="padding:30px 0">Loading PayPal…</p></div>' +
          '<p class="small muted" style="margin-top:4px">🔒 Secure checkout with PayPal or any card</p>' +
          '<p class="small muted" id="upgrade-msg" style="margin-top:12px"></p>' +
          '<button class="btn btn-ghost btn-block" id="upgrade-close" style="margin-top:6px">Not now</button>' +
        "</div>";
      document.body.appendChild(bg);
      bg.querySelector("#upgrade-close").onclick = () => bg.classList.remove("show");
      bg.onclick = (e) => { if (e.target === bg) bg.classList.remove("show"); };
    }
    bg.classList.add("show");
    const box = bg.querySelector("#paypal-buttons"), msg = bg.querySelector("#upgrade-msg");
    msg.textContent = "";
    if (bg.dataset.rendered) return;

    try {
      const pp = await loadPayPal();
      box.innerHTML = "";
      await pp.Buttons({
        style: { shape: "pill", color: "gold", layout: "vertical", label: "subscribe", height: 50 },
        createSubscription: (data, actions) => actions.subscription.create({
          plan_id: C.PAYPAL_PLAN_ID,
          custom_id: s.user.id, // ties the PayPal subscription to this account
        }),
        onApprove: async (data) => {
          msg.textContent = "Confirming with PayPal…";
          try {
            await callFunction("paypal?action=activate", { subscriptionID: data.subscriptionID });
            bg.classList.remove("show");
            toast("Welcome to Pro 🎉"); confetti();
            if (onDone) onDone();
          } catch (e) {
            msg.textContent = "Payment went through but we couldn't confirm it yet (" + e.message + "). Refresh in a minute; if Pro doesn't appear, contact us.";
          }
        },
        onCancel: () => { msg.textContent = "No worries, you weren't charged."; },
        onError: (err) => { console.error(err); msg.textContent = "PayPal hit an error. Please try again."; },
      }).render(box);
      bg.dataset.rendered = "1";
    } catch (e) {
      box.innerHTML = '<p class="small" style="color:var(--bad);padding:30px 0">' + esc(e.message) + "</p>";
    }
  }

  async function cancelSubscription(btn, periodEnd) {
    const until = periodEnd ? " You'll keep Pro until " + new Date(periodEnd).toLocaleDateString() + "." : "";
    if (!confirm("Cancel your Pro subscription?" + until + " Everything you've made stays live.")) return false;
    try {
      if (btn) btn.disabled = true;
      await callFunction("paypal?action=cancel");
      toast("Subscription canceled");
      return true;
    } catch (e) {
      toast(e.message, true);
      return false;
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function loadQR() {
    if (window.QRCode) return Promise.resolve();
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  async function renderQR(el, text, size) {
    await loadQR();
    el.innerHTML = "";
    new QRCode(el, { text, width: size || 160, height: size || 160, colorDark: "#000", colorLight: "#fff", correctLevel: QRCode.CorrectLevel.M });
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast("Link copied"); }
    catch { prompt("Copy this link:", text); }
  }

  async function share(title, url) {
    if (navigator.share) { try { await navigator.share({ title, url }); return; } catch (e) { if (e.name === "AbortError") return; } }
    copy(url);
  }

  // header with brand + nav that reflects signed-in state
  async function mountHeader() {
    document.title = document.title.replace("{site}", C.SITE_NAME);
    const h = document.createElement("header");
    h.className = "site-header";
    h.innerHTML =
      '<a class="brand" href="index.html"><img class="brand-mark" src="logo-mark.png" alt=""><span class="brand-name">' + esc(C.SITE_NAME) + "</span></a>" +
      '<nav class="nav" id="nav"></nav>';
    document.body.prepend(h);
    if (!configured) {
      const b = document.createElement("div");
      b.className = "setup-banner";
      b.innerHTML = "Setup needed: add your Supabase URL and key in <code>config.js</code> (see README).";
      document.body.prepend(b);
    }
    const nav = h.querySelector("#nav");
    const s = configured ? await getSession() : null;
    if (s) {
      nav.innerHTML =
        '<a class="link" href="explore.html">Explore</a>' +
        '<a class="btn btn-sm" href="dashboard.html">My page</a>';
    } else {
      nav.innerHTML =
        '<a class="link" href="explore.html">Explore</a>' +
        '<a class="link hide-sm" href="index.html#pricing">Pricing</a>' +
        '<a class="btn btn-sm" href="auth.html">Sign in</a>';
    }
  }

  // Give the account its permanent page name (handle) the first time it's needed.
  // Built from the email (drekray@gmail.com → "drekray"); a number is added if taken.
  // Once set it can never be changed (the database enforces this).
  async function ensureHandle(session) {
    const uid = session.user.id;
    const { data: prof } = await sb.from("profiles").select("handle").eq("id", uid).maybeSingle();
    if (prof && prof.handle) return prof.handle;
    let base = (session.user.email || "").split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24);
    if (base.length < 3) base = (base + "wizard").slice(0, 24);
    for (let i = 0; i < 8; i++) {
      const guess = i === 0 ? base : base + Math.floor(10 + Math.random() * (i < 4 ? 990 : 99990));
      const { data, error } = await sb.from("profiles").update({ handle: guess })
        .eq("id", uid).is("handle", null).select("handle").maybeSingle();
      if (!error && data) return data.handle;
      if (error && error.code !== "23505") throw error; // 23505 = name taken, try another
      if (!error && !data) {                             // someone (another tab) already set it
        const again = await sb.from("profiles").select("handle").eq("id", uid).maybeSingle();
        if (again.data && again.data.handle) return again.data.handle;
      }
    }
    throw new Error("Couldn't create your page name. Please try again.");
  }

  // Profile photo: shown in the circle on a user's page; falls back to their first letter
  function avatarHTML(p, size) {
    const name = (p && (p.display_name || p.handle)) || "?";
    const style = size ? ' style="width:' + size + "px;height:" + size + "px;font-size:" + Math.round(size * 0.42) + 'px"' : "";
    if (p && p.avatar_path) return '<div class="avatar"' + style + '><img alt="" src="' + esc(publicUrl(p.avatar_path)) + '"></div>';
    return '<div class="avatar"' + style + ">" + esc(name.replace("@", "").charAt(0).toUpperCase()) + "</div>";
  }

  // crop to a centered square, shrink to 400px, save as JPEG
  function squareJpeg(file, px) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file), im = new Image();
      im.onload = () => {
        const side = Math.min(im.naturalWidth, im.naturalHeight), out = Math.min(px || 400, side);
        const cv = document.createElement("canvas"); cv.width = cv.height = out;
        cv.getContext("2d").drawImage(im, (im.naturalWidth - side) / 2, (im.naturalHeight - side) / 2, side, side, 0, 0, out, out);
        cv.toBlob((b) => (b ? res(b) : rej(new Error("Couldn't read that photo."))), "image/jpeg", 0.88);
        URL.revokeObjectURL(url);
      };
      im.onerror = () => rej(new Error("Couldn't read that photo. Try a JPG or PNG."));
      im.src = url;
    });
  }

  // a little celebration
  function confetti(n) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#ffc24b", "#ff5fd2", "#a855f7", "#7c4dff", "#ffffff"];
    for (let i = 0; i < (n || 90); i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 1.8 + Math.random() * 1.8 + "s";
      c.style.animationDelay = Math.random() * 0.5 + "s";
      c.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4500);
    }
  }

  window.App = {
    C, sb, configured, BUCKET, siteRoot, esc, publicUrl, arLink, profileLink, toast,
    getSession, requireAuth, myPlan, callFunction, openUpgrade, cancelSubscription,
    renderQR, copy, share, mountHeader, confetti, ensureHandle, avatarHTML, squareJpeg,
  };
})();
