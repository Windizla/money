/* Compatibility calculator: pick two signs → redirect to pair page (alpha-order only).
   Multilingual: picks up language from <html lang> and routes into /uk/, /de/, /fr/ or root. */
(function () {
  'use strict';

  var SIGNS = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];

  var I18N = {
    en: {
      labels: {aries:"Aries",taurus:"Taurus",gemini:"Gemini",cancer:"Cancer",leo:"Leo",virgo:"Virgo",libra:"Libra",scorpio:"Scorpio",sagittarius:"Sagittarius",capricorn:"Capricorn",aquarius:"Aquarius",pisces:"Pisces"},
      btn: "Full compatibility →",
      pctFmt: function(p){return p+"%"},
      results: {
        0:{p:72,l:"Mirror souls — you get each other deeply."},
        4:{p:92,l:"Fire & air — exhilarating chemistry."},
        8:{p:92,l:"Fire & air — exhilarating chemistry."},
        6:{p:85,l:"Opposites attract — magnetic tension."},
        2:{p:78,l:"Easy flow, natural friendship."},
        10:{p:78,l:"Easy flow, natural friendship."},
        3:{p:65,l:"Growth pair — patience rewarded."},
        9:{p:65,l:"Growth pair — patience rewarded."}
      },
      fallback: "Warm, stable connection."
    },
    uk: {
      labels: {aries:"Овен",taurus:"Телець",gemini:"Близнюки",cancer:"Рак",leo:"Лев",virgo:"Діва",libra:"Терези",scorpio:"Скорпіон",sagittarius:"Стрілець",capricorn:"Козоріг",aquarius:"Водолій",pisces:"Риби"},
      btn: "Повна сумісність →",
      results: {
        0:{p:72,l:"Дзеркальні душі — ви розумієте одне одного з півслова."},
        4:{p:92,l:"Вогонь і повітря — карколомна хімія."},
        8:{p:92,l:"Вогонь і повітря — карколомна хімія."},
        6:{p:85,l:"Протилежності притягуються — магнітна напруга."},
        2:{p:78,l:"Легкий потік, природна дружба."},
        10:{p:78,l:"Легкий потік, природна дружба."},
        3:{p:65,l:"Пара для зростання — терпіння винагородиться."},
        9:{p:65,l:"Пара для зростання — терпіння винагородиться."}
      },
      fallback: "Тепла, стабільна сумісність."
    },
    de: {
      labels: {aries:"Widder",taurus:"Stier",gemini:"Zwillinge",cancer:"Krebs",leo:"Löwe",virgo:"Jungfrau",libra:"Waage",scorpio:"Skorpion",sagittarius:"Schütze",capricorn:"Steinbock",aquarius:"Wassermann",pisces:"Fische"},
      btn: "Volle Kompatibilität →",
      results: {
        0:{p:72,l:"Spiegelseelen — ihr versteht einander tief."},
        4:{p:92,l:"Feuer & Luft — berauschende Chemie."},
        8:{p:92,l:"Feuer & Luft — berauschende Chemie."},
        6:{p:85,l:"Gegensätze ziehen sich an — magnetisch."},
        2:{p:78,l:"Leichtes Gefühl, natürliche Freundschaft."},
        10:{p:78,l:"Leichtes Gefühl, natürliche Freundschaft."},
        3:{p:65,l:"Wachstumspaar — Geduld zahlt sich aus."},
        9:{p:65,l:"Wachstumspaar — Geduld zahlt sich aus."}
      },
      fallback: "Warme, stabile Verbindung."
    },
    fr: {
      labels: {aries:"Bélier",taurus:"Taureau",gemini:"Gémeaux",cancer:"Cancer",leo:"Lion",virgo:"Vierge",libra:"Balance",scorpio:"Scorpion",sagittarius:"Sagittaire",capricorn:"Capricorne",aquarius:"Verseau",pisces:"Poissons"},
      btn: "Compatibilité complète →",
      results: {
        0:{p:72,l:"Âmes miroirs — vous vous comprenez en profondeur."},
        4:{p:92,l:"Feu & air — chimie exaltante."},
        8:{p:92,l:"Feu & air — chimie exaltante."},
        6:{p:85,l:"Les opposés s'attirent — tension magnétique."},
        2:{p:78,l:"Fluidité naturelle, belle amitié."},
        10:{p:78,l:"Fluidité naturelle, belle amitié."},
        3:{p:65,l:"Paire de croissance — la patience paie."},
        9:{p:65,l:"Paire de croissance — la patience paie."}
      },
      fallback: "Connexion chaleureuse et stable."
    }
  };
  var FALLBACK_SCORES = {1:70,5:70,7:70,11:70};
  var FALLBACK_LABELS = {
    1:"Complementary energies — you learn from each other.",
    5:"Complementary energies — you learn from each other.",
    7:"Complementary energies — you learn from each other.",
    11:"Complementary energies — you learn from each other."
  };

  function getLang() {
    var l = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
    return I18N[l] ? l : 'en';
  }
  function langPrefix(lang) {
    return lang === 'en' ? '' : '/' + lang;
  }
  function calc(a, b, dict) {
    var i = SIGNS.indexOf(a), j = SIGNS.indexOf(b);
    var d = Math.abs(i - j);
    if (d === 0) return {pct:72, label: dict.results[0].l};
    if (dict.results[d]) return dict.results[d];
    if (FALLBACK_SCORES[d]) return {pct:FALLBACK_SCORES[d], label: FALLBACK_LABELS[d] || dict.fallback};
    return {pct:80, label: dict.fallback};
  }

  var w = document.getElementById('compat-widget');
  if (!w) return;

  var lang = getLang();
  var dict = I18N[lang];
  var labels = dict.labels;
  var prefix = langPrefix(lang);

  var ARIA = {
    en: {a:"First sign", b:"Second sign", bread:"Breadcrumb"},
    uk: {a:"Перший знак", b:"Другий знак", bread:"Навігація"},
    de: {a:"Erstes Zeichen", b:"Zweites Zeichen", bread:"Brotkrumen"},
    fr: {a:"Premier signe", b:"Deuxième signe", bread:"Fil d'Ariane"}
  };

  // Also translate the button text
  var goBtn = w.querySelector('#compat-go');
  if (goBtn) goBtn.textContent = dict.btn;
  // Update aria-labels on selects
  var a = w.querySelector('#sign-a');
  var b = w.querySelector('#sign-b');
  if (!a || !b) return;
  a.setAttribute('aria-label', ARIA[lang].a);
  b.setAttribute('aria-label', ARIA[lang].b);
  // Translate breadcrumb aria-label if present
  var bc = document.querySelector('.breadcrumbs');
  if (bc) bc.setAttribute('aria-label', ARIA[lang].bread);

  SIGNS.forEach(function (s) {
    [a,b].forEach(function (sel) {
      var opt = document.createElement('option');
      opt.value = s; opt.textContent = labels[s];
      sel.appendChild(opt);
    });
  });
  a.value = 'aries'; b.value = 'leo';

  goBtn.addEventListener('click', function () {
    var v1 = a.value, v2 = b.value;
    var pair = [v1, v2].sort().join('-');
    location.href = prefix + '/horoscope/compatibility/' + pair + '/';
  });

  function preview() {
    var r = calc(a.value, b.value, dict);
    var out = w.querySelector('#compat-preview');
    if (out) out.innerHTML = '<div style="font-size:2.2rem;font-weight:800;color:var(--accent)">' + r.pct + '%</div><div style="color:var(--text-muted)">' + r.label + '</div>';
  }
  a.addEventListener('change', preview); b.addEventListener('change', preview);
  preview();
})();
