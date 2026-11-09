/* Auraiya Digital Services — Section 01: Header / Navigation */
(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  if (!header) return;

  var toggle = header.querySelector('.site-header__toggle');
  var nav = header.querySelector('.site-nav');
  var triggers = Array.prototype.slice.call(header.querySelectorAll('.site-nav__trigger'));
  var desktop = window.matchMedia('(min-width: 960px)');

  header.classList.add('is-enhanced');

  /* ---------- Dropdowns ---------- */
  function menuOf(trigger) {
    return document.getElementById(trigger.getAttribute('aria-controls'));
  }

  function setDropdown(trigger, open) {
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function closeDropdowns(except) {
    triggers.forEach(function (t) { if (t !== except) setDropdown(t, false); });
  }

  function focusItem(trigger, index) {
    var links = menuOf(trigger).querySelectorAll('a');
    if (!links.length) return;
    var i = (index + links.length) % links.length;
    links[i].focus();
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var open = trigger.getAttribute('aria-expanded') !== 'true';
      closeDropdowns(trigger);
      setDropdown(trigger, open);
    });

    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        closeDropdowns(trigger);
        setDropdown(trigger, true);
        focusItem(trigger, 0);
      }
    });

    menuOf(trigger).addEventListener('keydown', function (e) {
      var links = Array.prototype.slice.call(menuOf(trigger).querySelectorAll('a'));
      var i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(trigger, i + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(trigger, i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusItem(trigger, 0); }
      else if (e.key === 'End') { e.preventDefault(); focusItem(trigger, -1); }
    });
  });

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('is-open', open);
    if (!open) closeDropdowns();
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  /* ---------- Escape: close and return focus ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;

    var openTrigger = triggers.filter(function (t) {
      return t.getAttribute('aria-expanded') === 'true';
    })[0];

    if (openTrigger) {
      setDropdown(openTrigger, false);
      openTrigger.focus();
      return;
    }
    if (!desktop.matches && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---------- Click outside closes dropdowns ---------- */
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) {
      closeDropdowns();
      if (!desktop.matches) setMenu(false);
    }
  });

  /* ---------- Focus leaves a dropdown (Tab out) ---------- */
  header.addEventListener('focusout', function (e) {
    var item = e.target.closest('.site-nav__item--has-menu');
    if (item && e.relatedTarget && !item.contains(e.relatedTarget)) {
      var t = item.querySelector('.site-nav__trigger');
      if (t) setDropdown(t, false);
    }
  });

  /* ---------- Reset when crossing breakpoint ---------- */
  function onBreakpoint() {
    setMenu(false);
    closeDropdowns();
  }
  if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
  else desktop.addListener(onBreakpoint);
})();

/* Auraiya Digital Services — Section 02: Hero */
/* Pauses the SVG animation when the hero is off-screen or the tab is hidden. */
(function () {
  'use strict';

  var hero = document.getElementById('hero');
  if (!hero) return;

  var offscreen = false;
  var hidden = document.hidden;

  function update() {
    hero.classList.toggle('is-paused', offscreen || hidden);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      offscreen = !entries[0].isIntersecting;
      update();
    }, { threshold: 0 }).observe(hero);
  }

  document.addEventListener('visibilitychange', function () {
    hidden = document.hidden;
    update();
  });
})();

/* Auraiya Digital Services — Section 04: Smart Service Search */
(function () {
  'use strict';

  var root = document.getElementById('search');
  if (!root) return;

  /* ---------------------------------------------------------------
     Searchable service data — edit titles, keywords and links here.
     c: jsk | biz | web | cre
     k: space-separated keywords (Hindi, English, Hinglish spellings)
  ---------------------------------------------------------------- */
  var CATEGORIES = {
    jsk: 'Jan Seva Kendra',
    biz: 'Business Digital Solutions',
    web: 'Website Development',
    cre: 'Creative & Digital'
  };

  var SERVICES = [
    { t: 'PAN Card', c: 'jsk', h: '/jan-seva-kendra/aadhaar-pan',
      d: 'नया पैन कार्ड, सुधार और डुप्लीकेट पैन के लिए आवेदन।',
      k: 'pan card pan पैन पैन कार्ड पेन कार्ड income tax आयकर नया पैन correction सुधार duplicate' },
    { t: 'Aadhaar Update', c: 'jsk', h: '/jan-seva-kendra/aadhaar-pan',
      d: 'आधार में पता, मोबाइल नंबर और नाम की जानकारी अपडेट।',
      k: 'aadhaar aadhar adhar आधार आधार कार्ड uidai update अपडेट address पता mobile मोबाइल नंबर' },
    { t: 'Ration Card', c: 'jsk', h: '/jan-seva-kendra/certificates',
      d: 'नया राशन कार्ड, नाम जोड़ने या सुधार के लिए आवेदन।',
      k: 'ration card राशन राशन कार्ड nfsa खाद्य आपूर्ति नाम जोड़ना name add' },
    { t: 'Income Certificate', c: 'jsk', h: '/jan-seva-kendra/certificates',
      d: 'आय प्रमाणपत्र का ऑनलाइन आवेदन और दस्तावेज सहायता।',
      k: 'income certificate आय प्रमाणपत्र आय प्रमाण पत्र आय certificate प्रमाणपत्र' },
    { t: 'Caste Certificate', c: 'jsk', h: '/jan-seva-kendra/certificates',
      d: 'जाति प्रमाणपत्र के लिए आवेदन और फॉर्म सहायता।',
      k: 'caste certificate जाति प्रमाणपत्र जाति प्रमाण पत्र obc sc st certificate' },
    { t: 'Domicile Certificate', c: 'jsk', h: '/jan-seva-kendra/certificates',
      d: 'निवास / मूल निवास प्रमाणपत्र का ऑनलाइन आवेदन।',
      k: 'domicile residence निवास प्रमाणपत्र मूल निवास निवास प्रमाण पत्र certificate' },
    { t: 'Voter ID', c: 'jsk', h: '/jan-seva-kendra/certificates',
      d: 'नया वोटर आईडी, सुधार और पता बदलने में सहायता।',
      k: 'voter id voter card वोटर आईडी वोटर कार्ड मतदाता पहचान पत्र epic election' },
    { t: 'Driving Licence', c: 'jsk', h: '/jan-seva-kendra/online-forms',
      d: 'लर्निंग लाइसेंस और ड्राइविंग लाइसेंस के ऑनलाइन फॉर्म।',
      k: 'driving licence license dl ड्राइविंग लाइसेंस लर्नर learning rto' },
    { t: 'Online Forms', c: 'jsk', h: '/jan-seva-kendra/online-forms',
      d: 'नौकरी, परीक्षा, प्रवेश और सरकारी योजनाओं के ऑनलाइन फॉर्म।',
      k: 'online form forms ऑनलाइन फॉर्म फार्म फॉर्म भरना form filling vacancy भर्ती job naukri नौकरी exam परीक्षा admission' },
    { t: 'Scholarship Form', c: 'jsk', h: '/jan-seva-kendra/online-forms',
      d: 'छात्रवृत्ति के आवेदन और दस्तावेज अपलोड में सहायता।',
      k: 'scholarship छात्रवृत्ति स्कॉलरशिप student विद्यार्थी form फॉर्म' },
    { t: 'Bill Payment & Recharge', c: 'jsk', h: '/jan-seva-kendra/bill-payments',
      d: 'बिजली बिल, मोबाइल रिचार्ज और DTH रिचार्ज।',
      k: 'bill payment recharge बिल भुगतान बिजली बिल electricity mobile मोबाइल रिचार्ज dth water पानी' },

    { t: 'Digital Payment QR (UPI)', c: 'biz', h: '/business-solutions',
      d: 'दुकान के लिए UPI QR कोड और डिजिटल पेमेंट सेटअप।',
      k: 'upi qr code क्यूआर कोड payment पेमेंट phonepe paytm google pay दुकान shop dukan' },
    { t: 'WhatsApp Business Setup', c: 'biz', h: '/business-solutions',
      d: 'व्हाट्सएप बिजनेस प्रोफाइल, कैटलॉग और ऑटो-रिप्लाई सेटअप।',
      k: 'whatsapp business व्हाट्सएप बिजनेस catalog कैटलॉग auto reply दुकानदार व्यवसाय' },
    { t: 'Udyam / MSME Registration', c: 'biz', h: '/business-solutions',
      d: 'उद्यम (MSME) पंजीकरण में आवेदन और दस्तावेज सहायता।',
      k: 'udyam msme उद्यम पंजीकरण registration लघु उद्योग व्यवसाय business' },
    { t: 'GST Registration', c: 'biz', h: '/business-solutions',
      d: 'जीएसटी पंजीकरण और बिलिंग संबंधी जानकारी में सहायता।',
      k: 'gst जीएसटी registration पंजीकरण billing बिलिंग invoice बिल व्यवसाय' },
    { t: 'Digital Visiting Card', c: 'biz', h: '/business-solutions',
      d: 'QR के साथ डिजिटल विजिटिंग कार्ड, जो मोबाइल पर तुरंत खुले।',
      k: 'visiting card विजिटिंग कार्ड digital card डिजिटल कार्ड qr business card' },

    { t: 'Website Design', c: 'web', h: '/website-design',
      d: 'आपके व्यवसाय के लिए आधुनिक, मोबाइल-फ्रेंडली वेबसाइट डिजाइन।',
      k: 'website design वेबसाइट वेब डिजाइन web development business website बिजनेस वेबसाइट site' },
    { t: 'Portfolio Website', c: 'web', h: '/website-design',
      d: 'अपने काम और पहचान को दिखाने वाली पर्सनल पोर्टफोलियो वेबसाइट।',
      k: 'portfolio पोर्टफोलियो website वेबसाइट personal freelancer profile' },
    { t: 'E-commerce Website', c: 'web', h: '/website-design',
      d: 'ऑनलाइन दुकान, प्रोडक्ट कैटलॉग और ऑर्डर के साथ वेबसाइट।',
      k: 'ecommerce e-commerce online store shop ऑनलाइन दुकान दुकान website वेबसाइट selling' },
    { t: 'Website Demos', c: 'web', h: '/website-demos',
      d: 'खरीदने से पहले हमारी तैयार वेबसाइट के नमूने देखें।',
      k: 'website demo demos डेमो नमूना sample preview live example' },

    { t: 'Graphic Design', c: 'cre', h: '/creative-digital',
      d: 'पोस्टर, बैनर, पैम्फलेट और सोशल मीडिया के लिए ग्राफिक डिजाइन।',
      k: 'graphic design ग्राफिक डिजाइन डिज़ाइन poster पोस्टर banner बैनर pamphlet पैम्फलेट flex social media post' },
    { t: 'Logo Design', c: 'cre', h: '/creative-digital',
      d: 'आपके व्यवसाय की पहचान के लिए प्रोफेशनल लोगो।',
      k: 'logo लोगो brand identity ब्रांड पहचान branding design डिजाइन' },
    { t: 'Hindi Typing', c: 'cre', h: '/creative-digital',
      d: 'हिंदी और अंग्रेजी टाइपिंग, डॉक्यूमेंट और फॉर्म की टाइपिंग।',
      k: 'hindi typing हिंदी टाइपिंग typing टाइपिंग kruti dev कृतिदेव mangal मंगल unicode document डॉक्यूमेंट english' },
    { t: 'Google Business Profile', c: 'cre', h: '/services/google-business-profile',
      d: 'गूगल मैप्स और सर्च पर अपना व्यवसाय सही जानकारी के साथ दिखाएं।',
      k: 'google business profile गूगल बिजनेस प्रोफाइल maps मैप्स my business listing local दुकान' },
    { t: 'SEO / Local SEO', c: 'cre', h: '/services/local-seo',
      d: 'गूगल सर्च में आपकी वेबसाइट और दुकान को ऊपर लाने के उपाय।',
      k: 'seo local seo एसईओ search engine गूगल सर्च ranking रैंकिंग google' }
  ];

  /* ---------------- Elements ---------------- */
  var form = root.querySelector('.smart-search__form');
  var input = document.getElementById('searchInput');
  var clearBtn = root.querySelector('.smart-search__clear');
  var sugBox = document.getElementById('searchSuggestions');
  var field = root.querySelector('.smart-search__field');
  var resultsBox = document.getElementById('searchResults');
  var list = document.getElementById('searchList');
  var empty = document.getElementById('searchEmpty');
  var status = document.getElementById('searchStatus');
  var chips = root.querySelectorAll('.smart-search__chip');

  /* ---------------- Matching ---------------- */
  function normalize(s) {
    return String(s)
      .toLowerCase()
      .normalize('NFC')
      .replace(/[\u200b-\u200d\ufeff]/g, '')
      .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  var index = SERVICES.map(function (s, n) {
    var title = normalize(s.t);
    return {
      item: s,
      order: n,
      title: title,
      titleWords: title.split(' '),
      keywords: normalize(s.k).split(' '),
      cat: normalize(CATEGORIES[s.c]),
      desc: normalize(s.d)
    };
  });

  function scoreToken(e, tok) {
    var best = 0, i, w;
    for (i = 0; i < e.titleWords.length; i++) {
      w = e.titleWords[i];
      if (w === tok) best = Math.max(best, 12);
      else if (w.indexOf(tok) === 0) best = Math.max(best, 10);
    }
    for (i = 0; i < e.keywords.length; i++) {
      w = e.keywords[i];
      if (w === tok) best = Math.max(best, 9);
      else if (w.indexOf(tok) === 0) best = Math.max(best, 7);
    }
    if (e.cat.indexOf(tok) !== -1) best = Math.max(best, 2);
    if (tok.length > 1 && e.desc.indexOf(tok) !== -1) best = Math.max(best, 1);
    return best;
  }

  function search(query, limit) {
    var q = normalize(query);
    if (!q) return [];
    var tokens = q.split(' ');
    var out = [];

    index.forEach(function (e) {
      var total = 0;
      for (var i = 0; i < tokens.length; i++) {
        var s = scoreToken(e, tokens[i]);
        if (!s) return;            // every word must match something
        total += s;
      }
      if (e.title.indexOf(q) !== -1) total += 8; // whole phrase in title
      out.push({ item: e.item, score: total, order: e.order });
    });

    out.sort(function (a, b) {
      return b.score - a.score || a.order - b.order; // ties keep data order
    });
    out = out.map(function (r) { return r.item; });
    return limit ? out.slice(0, limit) : out;
  }

  /* ---------------- Suggestions ---------------- */
  var current = [];
  var active = -1;

  function isOpen() { return !sugBox.hidden; }

  function closeSuggestions() {
    sugBox.hidden = true;
    sugBox.textContent = '';
    current = [];
    active = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function setActive(i) {
    var opts = sugBox.children;
    if (active >= 0 && opts[active]) opts[active].setAttribute('aria-selected', 'false');
    active = i;
    if (i >= 0 && opts[i]) {
      opts[i].setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', opts[i].id);
      opts[i].scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  function renderSuggestions() {
    current = search(input.value, 6);
    sugBox.textContent = '';
    active = -1;
    input.removeAttribute('aria-activedescendant');

    if (!current.length) { closeSuggestions(); return; }

    current.forEach(function (s, i) {
      var li = document.createElement('li');
      li.className = 'smart-search__option';
      li.id = 'searchOption' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');

      var name = document.createElement('span');
      name.textContent = s.t;
      var cat = document.createElement('span');
      cat.className = 'smart-search__option-cat';
      cat.textContent = CATEGORIES[s.c];

      li.appendChild(name);
      li.appendChild(cat);
      li.addEventListener('mousedown', function (e) { e.preventDefault(); }); // keep focus in input
      li.addEventListener('click', function () { pick(i); });
      sugBox.appendChild(li);
    });

    sugBox.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function pick(i) {
    if (!current[i]) return;
    input.value = current[i].t;
    clearBtn.hidden = false;
    closeSuggestions();
    runSearch(input.value);
    input.focus();
  }

  /* ---------------- Results ---------------- */
  var ARROW = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

  function hideResults() {
    resultsBox.hidden = true;
    list.textContent = '';
    status.textContent = '';
  }

  function renderResult(s) {
    var li = document.createElement('li');
    li.className = 'search-result';

    var cat = document.createElement('span');
    cat.className = 'search-result__cat' + (s.c === 'cre' ? ' search-result__cat--creative' : '');
    cat.textContent = CATEGORIES[s.c];

    var title = document.createElement('span');
    title.className = 'search-result__title';
    var a = document.createElement('a');
    a.className = 'search-result__link';
    a.href = s.h;
    a.textContent = s.t;
    title.appendChild(a);

    var desc = document.createElement('p');
    desc.className = 'search-result__desc';
    desc.textContent = s.d;

    var arrow = document.createElement('span');
    arrow.className = 'search-result__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = ARROW;

    li.appendChild(cat);
    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(arrow);
    return li;
  }

  function runSearch(raw) {
    var q = raw.trim();
    if (!q) { hideResults(); return; }

    var results = search(q);
    list.textContent = '';
    results.forEach(function (s) { list.appendChild(renderResult(s)); });

    list.hidden = results.length === 0;
    empty.hidden = results.length !== 0;
    resultsBox.hidden = false;
    status.textContent = results.length
      ? '“' + q + '” के लिए ' + results.length + ' परिणाम मिले'
      : '“' + q + '” के लिए कोई परिणाम नहीं मिला';
  }

  function clearAll() {
    input.value = '';
    clearBtn.hidden = true;
    closeSuggestions();
    hideResults();
  }

  /* ---------------- Events ---------------- */
  input.addEventListener('input', function () {
    clearBtn.hidden = !input.value;
    if (!input.value.trim()) { closeSuggestions(); hideResults(); return; }
    renderSuggestions();
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen()) { renderSuggestions(); if (isOpen()) setActive(0); return; }
      setActive(active + 1 >= current.length ? 0 : active + 1);
    } else if (e.key === 'ArrowUp') {
      if (!isOpen()) return;
      e.preventDefault();
      setActive(active <= 0 ? current.length - 1 : active - 1);
    } else if (e.key === 'Tab') {
      closeSuggestions();
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (isOpen() && active >= 0) { pick(active); return; }
    closeSuggestions();
    if (!input.value.trim()) { input.focus(); return; }
    runSearch(input.value);
  });

  clearBtn.addEventListener('click', function () {
    clearAll();
    input.focus();
  });

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      input.value = chip.textContent.trim();
      clearBtn.hidden = false;
      closeSuggestions();
      runSearch(input.value);
    });
  });

  /* Escape: close suggestions first, then clear the search */
  root.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    if (isOpen()) {
      closeSuggestions();
      input.focus();
    } else if (input.value) {
      clearAll();
      input.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (!field.contains(e.target)) closeSuggestions();
  });
})();

// Clean initialization & safe external link handling
  document.addEventListener("DOMContentLoaded", () => {
    const gbpLink = document.querySelector(".btn-primary");
    if (gbpLink) {
      gbpLink.addEventListener("click", () => {
        // Analytics or routing hook if needed in the future
      });
    }
  });

  /* Auraiya Digital Services — Section 11: FAQ */
(function () {
  'use strict';

  var root = document.getElementById('faq');
  if (!root) return;

  var buttons = Array.prototype.slice.call(root.querySelectorAll('.faq__question'));

  // Panels are only collapsed when JavaScript is running
  root.classList.add('is-enhanced');

  function setOpen(button, open) {
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    button.closest('.faq__item').classList.toggle('is-open', open);
  }

  buttons.forEach(function (button, i) {
    // Sync visual state with the markup's initial aria-expanded
    setOpen(button, button.getAttribute('aria-expanded') === 'true');

    button.addEventListener('click', function () {
      setOpen(button, button.getAttribute('aria-expanded') !== 'true');
    });

    // Arrow / Home / End move between questions
    button.addEventListener('keydown', function (e) {
      var target;
      if (e.key === 'ArrowDown') target = buttons[(i + 1) % buttons.length];
      else if (e.key === 'ArrowUp') target = buttons[(i - 1 + buttons.length) % buttons.length];
      else if (e.key === 'Home') target = buttons[0];
      else if (e.key === 'End') target = buttons[buttons.length - 1];
      if (target) {
        e.preventDefault();
        target.focus();
      }
    });
  });
})();

/* Auraiya Digital Services — Section 13: Footer */
/* Keeps the copyright year current. The markup already shows a fallback year. */
(function () {
  'use strict';
  var year = document.getElementById('footerYear');
  if (year) year.textContent = new Date().getFullYear();
})();