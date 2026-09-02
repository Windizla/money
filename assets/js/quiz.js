/* Fursona Quiz — 10 questions, result = zodiac sign + species archetype.
 * Pure client-side, no tracking. Shares result with OG-card canvas.
 */
(function () {
  'use strict';
  if (!document.getElementById('quiz')) return;

  var signs = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
  var questions = [
    {q: "At a convention meetup, you're most likely to:",
     options: [
       {t: "Lead the group to the next panel", scores: {aries:2, leo:2, sagittarius:1}},
       {t: "Find a quiet corner with a close friend", scores: {cancer:2, pisces:2, virgo:1}},
       {t: "Bounce between groups, cracking jokes", scores: {gemini:2, libra:1, aquarius:1}},
       {t: "Help new arrivals find their way", scores: {taurus:2, virgo:1, libra:2}}
     ]},
    {q: "Your ideal fursuit style is:",
     options: [
       {t: "Big, bold, impossible to miss", scores: {leo:2, aries:1, dragon:0}},
       {t: "Soft, huggable and approachable", scores: {cancer:2, taurus:2, pisces:1}},
       {t: "Clever design with hidden details", scores: {aquarius:2, gemini:1, scorpio:1}},
       {t: "Sleek, elegant, well-crafted", scores: {capricorn:2, virgo:2, libra:1}}
     ]},
    {q: "Your friends would describe you as:",
     options: [
       {t: "Loyal and protective", scores: {taurus:2, leo:1, scorpio:1}},
       {t: "Imaginative and dreamy", scores: {pisces:2, aquarius:1, cancer:1}},
       {t: "Energetic and adventurous", scores: {sagittarius:2, aries:2, gemini:1}},
       {t: "Thoughtful and fair", scores: {libra:2, virgo:2, capricorn:1}}
     ]},
    {q: "Pick a favorite place to hang out:",
     options: [
       {t: "A bonfire in the woods", scores: {sagittarius:2, aries:1, leo:1}},
       {t: "A cozy couch with snacks", scores: {taurus:2, cancer:2, pisces:1}},
       {t: "A busy dance floor at a con", scores: {gemini:2, leo:2, libra:1}},
       {t: "A late-night art jam", scores: {aquarius:2, virgo:1, scorpio:2}}
     ]},
    {q: "Your creative style leans toward:",
     options: [
       {t: "Bold colors and big gestures", scores: {aries:2, leo:2, sagittarius:1}},
       {t: "Cute, warm illustrations", scores: {cancer:2, libra:1, pisces:2}},
       {t: "Surreal, experimental work", scores: {aquarius:2, gemini:2, scorpio:1}},
       {t: "Detailed, refined pieces", scores: {virgo:2, capricorn:2, taurus:1}}
     ]},
    {q: "How do you handle conflict in the fandom?",
     options: [
       {t: "Speak my mind directly", scores: {aries:2, leo:1, sagittarius:2}},
       {t: "Try to mediate and make peace", scores: {libra:2, taurus:1, cancer:1}},
       {t: "Step back and reflect first", scores: {virgo:2, scorpio:2, capricorn:1}},
       {t: "Defuse with humor and change the topic", scores: {gemini:2, pisces:1, aquarius:1}}
     ]},
    {q: "Which virtue matters most to you?",
     options: [
       {t: "Courage", scores: {aries:2, leo:2, sagittarius:1}},
       {t: "Kindness", scores: {cancer:2, pisces:2, libra:1}},
       {t: "Honesty", scores: {scorpio:2, sagittarius:2, capricorn:1}},
       {t: "Curiosity", scores: {gemini:2, aquarius:2, virgo:1}}
     ]},
    {q: "Your fursona species is most likely a:",
     options: [
       {t: "Big canine (wolf, husky, fox)", scores: {aries:1, leo:1, sagittarius:2, gemini:1}},
       {t: "Big feline (lion, panther, tiger)", scores: {leo:2, scorpio:2, capricorn:1}},
       {t: "Small & cute (bunny, cat, otter)", scores: {libra:2, cancer:2, pisces:2}},
       {t: "Mythical or unusual (dragon, raccoon, deer)", scores: {capricorn:2, aquarius:2, virgo:1, taurus:1}}
     ]},
    {q: "What draws you to the fandom most?",
     options: [
       {t: "Self-expression and identity", scores: {leo:2, aries:1, scorpio:1}},
       {t: "Friendship and belonging", scores: {cancer:2, taurus:2, libra:2}},
       {t: "Art and creativity", scores: {virgo:2, pisces:2, aquarius:1}},
       {t: "Adventure and new experiences", scores: {sagittarius:2, gemini:2, aries:1}}
     ]},
    {q: "Pick a late-night snack:",
     options: [
       {t: "Spicy ramen or hot wings", scores: {aries:2, scorpio:1, sagittarius:1}},
       {t: "Warm cookies and milk", scores: {cancer:2, taurus:2, libra:1}},
       {t: "Something new I haven't tried", scores: {gemini:2, aquarius:2, sagittarius:1}},
       {t: "Fancy cheese and chocolate", scores: {capricorn:2, virgo:1, leo:1, pisces:1}}
     ]}
  ];

  var state = { idx: 0, scores: {} };
  signs.forEach(function (s) { state.scores[s] = 0; });

  var quizEl = document.getElementById('quiz');
  var qText = quizEl.querySelector('.quiz-q');
  var optsEl = quizEl.querySelector('.quiz-options');
  var progEl = quizEl.querySelector('.quiz-progress-bar');
  var resultEl = document.getElementById('quiz-result');

  function render() {
    if (state.idx >= questions.length) return finish();
    var Q = questions[state.idx];
    qText.textContent = "Question " + (state.idx+1) + " of " + questions.length + ": " + Q.q;
    progEl.style.width = ((state.idx / questions.length) * 100) + '%';
    optsEl.innerHTML = '';
    Q.options.forEach(function (opt, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'quiz-opt'; b.textContent = opt.t;
      b.addEventListener('click', function () {
        Object.keys(opt.scores).forEach(function (k) { state.scores[k] = (state.scores[k]||0) + opt.scores[k]; });
        state.idx++; render();
      });
      optsEl.appendChild(b);
    });
  }

  function finish() {
    progEl.style.width = '100%';
    var winner = signs[0], top = -1;
    signs.forEach(function (s) { if (state.scores[s] > top) { top = state.scores[s]; winner = s; } });
    quizEl.style.display = 'none';
    resultEl.classList.add('show');
    resultEl.querySelector('[data-result-sign]').textContent = winner.charAt(0).toUpperCase() + winner.slice(1);
    var link = resultEl.querySelector('[data-result-link]');
    if (link) link.href = '/horoscope/' + winner + '/';
  }

  render();
})();
