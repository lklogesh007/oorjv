/* OORJV — main.js
   Small, dependency-free helpers shared across pages.
   Every block checks the element exists first, so this one file
   can be safely included on every page. */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // close menu when a link is tapped
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- highlight current page in nav ---------- */
  var current = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav > a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- certified-products search + filter (consumers.html) ---------- */
  var searchInput = document.getElementById('product-search');
  var categorySelect = document.getElementById('category-filter');
  var grid = document.getElementById('product-grid');
  var emptyState = document.getElementById('product-empty');

  function filterProducts() {
    if (!grid) return;
    var term = (searchInput ? searchInput.value : '').trim().toLowerCase();
    var category = categorySelect ? categorySelect.value : 'all';
    var cards = grid.querySelectorAll('.cert-card');
    var visibleCount = 0;

    cards.forEach(function (card) {
      var name = (card.getAttribute('data-name') || '').toLowerCase();
      var producer = (card.getAttribute('data-producer') || '').toLowerCase();
      var cardCategory = card.getAttribute('data-category') || '';
      var matchesTerm = !term || name.indexOf(term) !== -1 || producer.indexOf(term) !== -1;
      var matchesCategory = category === 'all' || category === cardCategory;
      var visible = matchesTerm && matchesCategory;
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });

    if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  if (searchInput) searchInput.addEventListener('input', filterProducts);
  if (categorySelect) categorySelect.addEventListener('change', filterProducts);

  /* ---------- FAQ accordion (about.html) ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) openItem.classList.remove('open');
      });
      item.classList.toggle('open', !wasOpen);
    });
  });

  /* ---------- apply / contact form handling (no backend yet) ---------- */
  document.querySelectorAll('form[data-form="apply"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var required = form.querySelectorAll('[required]');
      var missing = false;
      required.forEach(function (field) {
        if (!field.value || !field.value.trim()) missing = true;
      });
      if (missing) {
        alert('Please fill in all required fields before submitting.');
        return;
      }

      var successBox = form.querySelector('.form-success');
      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('Thank you. Our team will contact you within 2 working days.');
      }
      form.reset();
    });
  });

});
