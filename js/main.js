/* ═══════════════════════════════════════════════════
   INMARK ECUADOR — Navbar JS
   /js/main.js
═══════════════════════════════════════════════════ */

(function () {

  /* ── 1. Nav scrolled state ── */
  const navEl = document.getElementById('nav');
  if (navEl) {
    window.addEventListener('scroll', function () {
      navEl.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── 2. Mega-menú Servicios ── */
  const dropdown  = document.getElementById('navServices');
  const toggle    = document.getElementById('servicesToggle');
  const megaMenu  = document.getElementById('megaMenu');

  if (dropdown && toggle && megaMenu) {
    function openMega() {
      dropdown.setAttribute('data-open', '');
      toggle.setAttribute('aria-expanded', 'true');
    }
    function closeMega() {
      dropdown.removeAttribute('data-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    /* Click para teclado / touch */
    toggle.addEventListener('click', function () {
      dropdown.hasAttribute('data-open') ? closeMega() : openMega();
    });

    /* Cerrar al hacer clic fuera */
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) closeMega();
    });

    /* Teclado: Escape cierra */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMega();
    });

    /* Hover en desktop (complementa el CSS :hover / focus-within) */
    dropdown.addEventListener('mouseenter', openMega);
    dropdown.addEventListener('mouseleave', closeMega);
  }

  /* ── 3. Hamburguesa / menú móvil ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');
  const closeBtn   = document.getElementById('mobileClose');

  if (hamburger && mobileNav) {
    function mobileToggle(open) {
      hamburger.classList.toggle('open', open);
      mobileNav.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      mobileNav.setAttribute('aria-hidden', String(!open));
      hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', function () {
      mobileToggle(!mobileNav.classList.contains('open'));
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () { mobileToggle(false); });
    }

    /* Cerrar al hacer clic en cualquier enlace */
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { mobileToggle(false); });
    });

    /* Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileToggle(false);
        hamburger.focus();
      }
    });
  }

  /* ── 4. Megacard spotlight ── */
  document.querySelectorAll('.megacard').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var r = card.getBoundingClientRect();
      var mx = ((e.clientX - r.left) / r.width) * 100;
      var my = ((e.clientY - r.top) / r.height) * 100;
      card.style.background = 'radial-gradient(420px circle at ' + mx + '% ' + my + '%, rgba(114,64,222,.07), transparent 60%)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.background = 'transparent';
    });
  });

})();