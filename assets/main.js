// KALIUM — shared behaviour

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile nav ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  /* ---------- copy IP ---------- */
  window.copyIP = function (ip) {
    navigator.clipboard?.writeText(ip).then(() => {
      showToast('IP copiada: ' + ip);
    }).catch(() => {
      showToast('No se pudo copiar. IP: ' + ip);
    });
  };

  document.querySelectorAll('[data-copy-ip]').forEach(btn => {
    btn.addEventListener('click', () => window.copyIP(btn.dataset.copyIp));
  });

  /* ---------- toast ---------- */
  window.showToast = function (msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const span = toast.querySelector('span');
    if (span) span.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  /* ---------- fake live online counter (visual only) ---------- */
  const onlineTargets = document.querySelectorAll('[data-online]');
  if (onlineTargets.length) {
    let base = 210 + Math.floor(Math.random() * 60);
    onlineTargets.forEach(el => el.textContent = base + ' online');
    setInterval(() => {
      base += Math.floor(Math.random() * 5) - 2;
      base = Math.max(180, Math.min(320, base));
      onlineTargets.forEach(el => el.textContent = base + ' online');
    }, 5000);
  }

  /* ---------- counters ---------- */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const tick = () => {
      cur = Math.min(target, cur + step);
      el.textContent = cur.toLocaleString('es-ES');
      if (cur < target) requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { tick(); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  /* ---------- shop tabs ---------- */
  const tabs = document.querySelectorAll('.shop-tab');
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.shop-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });
  }

  /* ---------- cart ---------- */
  const cart = [];
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.getElementById('cart-count');

  function renderCart() {
    if (!cartItemsEl) return;
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>';
    } else {
      cartItemsEl.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${item.price.toFixed(2)}€</div>
          </div>
          <button class="cart-item-rm" data-idx="${i}">Quitar</button>
        </div>
      `).join('');
      cartItemsEl.querySelectorAll('.cart-item-rm').forEach(btn => {
        btn.addEventListener('click', () => {
          cart.splice(parseInt(btn.dataset.idx, 10), 1);
          renderCart();
        });
      });
    }
    const total = cart.reduce((s, i) => s + i.price, 0);
    if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2) + '€';
    if (cartCountEl) cartCountEl.textContent = cart.length;
  }

  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      cart.push({ name, price });
      renderCart();
      showToast(name + ' añadido al carrito');
    });
  });

  const cartToggle = document.getElementById('cart-toggle');
  const cartClose = document.getElementById('cart-close');
  function openCart() { cartDrawer?.classList.add('open'); cartOverlay?.classList.add('open'); }
  function closeCart() { cartDrawer?.classList.remove('open'); cartOverlay?.classList.remove('open'); }
  cartToggle?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  const checkoutBtn = document.getElementById('cart-checkout');
  checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) { showToast('Tu carrito está vacío'); return; }
    showToast('Redirigiendo a la pasarela de pago…');
  });

  renderCart();
});
