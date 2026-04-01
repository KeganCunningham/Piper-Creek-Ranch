/* ═══════════════════════════════════════════════════
   PIPER CREEK RANCH ESTATES — Main JS
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Lot data ──
  var lotData = {
    1: { name: 'Lot 1', acres: '10.45 ac', road: 'Dungens Mill Rd', creek: 'Yes', img: 'lot-1-aerial.jpg' },
    2: { name: 'Lot 2', acres: '10.45 ac', road: 'Venghaus George Rd', creek: 'No (dual access possible)', img: 'lot-2-aerial.jpg' },
    3: { name: 'Lot 3', acres: '10.75 ac', road: 'Venghaus George Rd', creek: 'Yes', img: 'lot-3-aerial.jpg' },
    4: { name: 'Lot 4', acres: '11.00 ac', road: 'Venghaus George Rd', creek: 'Yes', img: 'lot-4-aerial.jpg' },
    5: { name: 'Lot 5', acres: '14.07 ac', road: 'Venghaus George Rd', creek: 'Yes', img: 'lot-5-aerial.jpg' },
    6: { name: 'Lot 6', acres: '10.45 ac', road: 'Venghaus George Rd', creek: 'Yes', img: 'lot-6-aerial.jpg' }
  };

  // ── Mobile nav toggle ──
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Hero image slideshow ──
  var slides = document.querySelectorAll('.hero__slide');
  var dots = document.querySelectorAll('.hero__dot');
  var currentSlide = 0;
  var slideInterval = null;

  function switchSlide(index) {
    if (index === currentSlide && slides[index].classList.contains('is-active')) return;
    slides[currentSlide].classList.remove('is-active');
    dots[currentSlide].classList.remove('is-active');

    currentSlide = index;
    slides[currentSlide].classList.add('is-active');
    dots[currentSlide].classList.add('is-active');
  }

  function nextSlide() {
    switchSlide((currentSlide + 1) % slides.length);
  }

  if (slides.length > 1) {
    slideInterval = setInterval(nextSlide, 6000);

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        clearInterval(slideInterval);
        switchSlide(parseInt(this.dataset.index));
        slideInterval = setInterval(nextSlide, 6000);
      });
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Nav background on scroll ──
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        nav.style.background = 'rgba(26, 22, 18, 0.98)';
      } else {
        nav.style.background = 'rgba(26, 22, 18, 0.92)';
      }
    }, { passive: true });
  }

  // ── Interactive lot selector ──
  var lotPins = document.querySelectorAll('.pin--interactive');
  var lotDetail = document.getElementById('lotDetail');
  var lotDetailImg = document.getElementById('lotDetailImg');
  var lotDetailName = document.getElementById('lotDetailName');
  var lotDetailMeta = document.getElementById('lotDetailMeta');
  var lotDetailClose = lotDetail ? lotDetail.querySelector('.lot-detail__close') : null;
  var tableRows = document.querySelectorAll('.lots__table tbody tr');

  function showLotDetail(lotNum) {
    var data = lotData[lotNum];
    if (!data || !lotDetail) return;

    lotDetailImg.src = data.img;
    lotDetailImg.alt = data.name + ' aerial';
    lotDetailName.textContent = data.name;
    lotDetailMeta.innerHTML =
      '<strong>' + data.acres + '</strong><br>' +
      data.road + '<br>' +
      'Creek: ' + data.creek + '<br>' +
      '<em style="color:#b8912a">Call for Pricing</em>';
    lotDetail.classList.add('is-active');

    // Highlight pin
    lotPins.forEach(function (p) { p.classList.remove('is-active'); });
    var activePin = document.querySelector('.pin--interactive[data-lot="' + lotNum + '"]');
    if (activePin) activePin.classList.add('is-active');

    // Highlight table row
    tableRows.forEach(function (r) { r.classList.remove('is-highlighted'); });
    if (tableRows[lotNum - 1]) tableRows[lotNum - 1].classList.add('is-highlighted');
  }

  function hideLotDetail() {
    if (lotDetail) lotDetail.classList.remove('is-active');
    lotPins.forEach(function (p) { p.classList.remove('is-active'); });
    tableRows.forEach(function (r) { r.classList.remove('is-highlighted'); });
  }

  lotPins.forEach(function (pin) {
    pin.addEventListener('click', function () {
      var lot = parseInt(this.dataset.lot);
      if (lotDetail.classList.contains('is-active') &&
          lotDetailName.textContent === 'Lot ' + lot) {
        hideLotDetail();
      } else {
        showLotDetail(lot);
      }
    });
  });

  // Also make table rows clickable
  tableRows.forEach(function (row, i) {
    row.style.cursor = 'pointer';
    row.addEventListener('click', function () {
      showLotDetail(i + 1);
      // Scroll to aerial if not visible
      var aerial = document.querySelector('.lots__aerial-wrap');
      if (aerial) {
        var rect = aerial.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          aerial.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });

  if (lotDetailClose) {
    lotDetailClose.addEventListener('click', function (e) {
      e.stopPropagation();
      hideLotDetail();
    });
  }

  // ── Lot card lightbox ──
  var lightbox = document.getElementById('lotLightbox');
  var lightboxImg = document.getElementById('lotLightboxImg');

  if (lightbox && lightboxImg) {
    // Gallery items + Columbus gallery
    document.querySelectorAll('.gallery__item, .columbus__gallery-img').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('.gallery__img') || item;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Lot cards
    document.querySelectorAll('.lot-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var img = card.querySelector('.lot-card__img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      });
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target !== lightboxImg) {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (lightbox.classList.contains('is-active')) {
          lightbox.classList.remove('is-active');
          document.body.style.overflow = '';
        }
        hideLotDetail();
      }
    });
  }

  // ── Animated counter for stats ──
  var counters = document.querySelectorAll('.stats__number[data-count]');

  function animateCounter(el) {
    var target = parseInt(el.dataset.count);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(start + (target - start) * ease);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  // ── Parallax on aerial images ──
  var parallaxImages = document.querySelectorAll('.lots__aerial-img, .region-map__img');

  if (parallaxImages.length) {
    // Add parallax wrapper class
    parallaxImages.forEach(function (img) {
      if (img.parentElement) {
        img.parentElement.classList.add('parallax-wrap');
      }
    });

    window.addEventListener('scroll', function () {
      parallaxImages.forEach(function (img) {
        var rect = img.getBoundingClientRect();
        var windowH = window.innerHeight;
        if (rect.top < windowH && rect.bottom > 0) {
          var scrollPercent = (windowH - rect.top) / (windowH + rect.height);
          var translate = (scrollPercent - 0.5) * 30; // subtle parallax
          img.style.transform = 'translateY(' + translate + 'px) scale(1.05)';
        }
      });
    }, { passive: true });
  }

  // ── Contact form (Formspree) ──
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action');
      // If Formspree is configured, let it handle submission
      if (action && action.indexOf('YOUR_FORM_ID') === -1) {
        // Formspree handles it natively
        return;
      }

      // Fallback: prevent default and show confirmation
      e.preventDefault();
      var data = new FormData(form);
      alert('Thank you, ' + (data.get('fname') || '') + '! We will be in touch shortly.');
      form.reset();
    });
  }

  // ── Share button ──
  var shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var shareData = {
        title: 'Piper Creek Ranch Estates',
        text: '68 acres, 6 tracts in Columbus, TX. Creek frontage, 7 min to Big Easy Ranch.',
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData);
      } else {
        // Fallback: copy link
        var tempInput = document.createElement('input');
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        // Show feedback
        var orig = shareBtn.textContent;
        shareBtn.textContent = 'Link Copied!';
        setTimeout(function () { shareBtn.textContent = orig; }, 2000);
      }
    });
  }

  // ── Scroll-reveal animation ──
  if ('IntersectionObserver' in window) {
    var reveals = document.querySelectorAll(
      '.section-title, .section-sub, .highlights__bullets, .highlights__distances, ' +
      '.clubs__card, .contact__card, .contact__form-wrap, .lots__table-wrap, .stats__item, .lot-card'
    );

    reveals.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(function (el) { observer.observe(el); });
  }
})();
