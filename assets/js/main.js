/* =============================================
   RELIANCE ENERGIX — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Theme switcher ── */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    _updateThemeIcon(themeBtn, document.documentElement.getAttribute('data-theme') || 'light');
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') || 'light';
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('rel-theme', next);
      _updateThemeIcon(themeBtn, next);
    });
  }
  function _updateThemeIcon(btn, theme) {
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    btn.innerHTML = theme === 'dark'
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── Mobile App UI: inject drawer overlay + bottom tab bar ── */
  (function () {
    // Drawer overlay (backdrop behind slide-in drawer)
    var overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    overlay.id = 'drawer-overlay';
    document.body.appendChild(overlay);

    // Swipe hint below services carousel (index page only)
    var servicesGrid = document.querySelector('#services-overview .services-grid');
    if (servicesGrid) {
      var hint = document.createElement('p');
      hint.className = 'swipe-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.textContent = 'Swipe to explore';
      servicesGrid.parentNode.insertBefore(hint, servicesGrid.nextSibling);
    }
  })();

  /* ── Hamburger / slide drawer ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const drawerOverlay = document.getElementById('drawer-overlay');

  function openDrawer() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    if (drawerOverlay) {
      drawerOverlay.classList.add('visible');
      requestAnimationFrame(function () { drawerOverlay.classList.add('active'); });
    }
    document.body.classList.add('no-scroll');
  }

  function closeDrawer() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    if (drawerOverlay) {
      drawerOverlay.classList.remove('active');
      drawerOverlay.addEventListener('transitionend', function onEnd() {
        drawerOverlay.classList.remove('visible');
        drawerOverlay.removeEventListener('transitionend', onEnd);
      });
    }
    document.body.classList.remove('no-scroll');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    if (drawerOverlay) { drawerOverlay.addEventListener('click', closeDrawer); }
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeDrawer();
    });
  }

  /* ── Active nav link highlighting ── */
  (function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  /* ── Scroll fade-in animations ── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(function (el) { observer.observe(el); });
  }

  /* ── Animated stat counter ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const step = Math.ceil(duration / target) || 1;
    let count = 0;
    const timer = setInterval(function () {
      count += Math.max(1, Math.floor(target / 60));
      if (count >= target) { count = target; clearInterval(timer); }
      el.textContent = count + suffix;
    }, step);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function (n) { statsObserver.observe(n); });
  }

  /* ── Init Home map (Leaflet) ── */
  if (document.getElementById('map')) {
    initLeafletMap('map');
  }
  if (document.getElementById('map-full')) {
    initLeafletMap('map-full');
  }

  /* ── Contact map (simple Google Maps embed fallback) ── */
  // Already embedded as iframe in HTML

  /* ── Contact form (EmailJS) ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    // Initialize EmailJS — replace with real keys
    if (typeof emailjs !== 'undefined') {
      emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const feedback = document.getElementById('formFeedback');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      const params = {
        from_name:    contactForm.fullName.value,
        company:      contactForm.company.value,
        reply_to:     contactForm.email.value,
        phone:        contactForm.phone.value,
        message:      contactForm.message.value,
      };

      if (typeof emailjs !== 'undefined') {
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params)
          .then(function () {
            feedback.className = 'form-feedback success';
            feedback.textContent = 'Message sent! We will get back to you shortly.';
            contactForm.reset();
          })
          .catch(function () {
            feedback.className = 'form-feedback error';
            feedback.textContent = 'Something went wrong. Please email us directly at Info@relianceenergix.com';
          })
          .finally(function () {
            btn.disabled = false;
            btn.textContent = 'Send Message';
          });
      } else {
        // Fallback: mailto
        const subject = encodeURIComponent('Website Inquiry from ' + params.from_name);
        const body = encodeURIComponent(
          'Name: ' + params.from_name + '\nCompany: ' + params.company +
          '\nPhone: ' + params.phone + '\n\n' + params.message
        );
        window.location.href = 'mailto:Info@relianceenergix.com?subject=' + subject + '&body=' + body;
        btn.disabled = false;
        btn.textContent = 'Send Message';
      }
    });
  }
});

/* ── Leaflet Map helper ── */
function initLeafletMap(mapId) {
  if (typeof L === 'undefined') return;

  var map = L.map(mapId, { zoomControl: true, scrollWheelZoom: false }).setView([-15, 27], 4);

  var isLight = document.documentElement.getAttribute('data-theme') === 'light';
  var tileUrl  = isLight
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  L.tileLayer(tileUrl, {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  var markerStyle = {
    radius: 8,
    fillColor: '#FF6B00',
    color: '#00B4D8',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9
  };

  var locations = [
    { lat: -13.9626, lng: 33.7741, name: 'Lilongwe, Malawi', role: 'Headquarters & LPG Plant' },
    { lat: -25.7479, lng: 28.2293, name: 'Johannesburg, South Africa', role: 'Source Market' },
    { lat: -17.8252, lng: 31.0335, name: 'Harare, Zimbabwe', role: 'Distribution Market' },
    { lat: -15.4167, lng: 28.2833, name: 'Lusaka, Zambia', role: 'Distribution Market' },
    { lat: -25.9655, lng: 32.5832, name: 'Maputo, Mozambique', role: 'Distribution Market' },
    { lat: -24.6570, lng: 25.9089, name: 'Gaborone, Botswana', role: 'Distribution Market' },
    { lat: -6.7924, lng: 39.2083, name: 'Dar es Salaam, Tanzania', role: 'Distribution Market' },
  ];

  locations.forEach(function (loc) {
    L.circleMarker([loc.lat, loc.lng], markerStyle)
      .addTo(map)
      .bindPopup(
        '<strong style="color:#00B4D8">' + loc.name + '</strong><br>' +
        '<span style="color:#C0C8D0;font-size:0.85em">' + loc.role + '</span>',
        { className: 'leaflet-popup-dark' }
      );
  });
}
