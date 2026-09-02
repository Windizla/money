/* Furlore — affiliate redirect handling
   Direct redirect to offer URL on click — no age gate, no geo filter, no tracking.
*/
(function () {
  'use strict';

  const AFFILIATE_DATA_URL = '/data/affiliate.json';
  let affCache = null;

  function loadAffData() {
    if (affCache) return Promise.resolve(affCache);
    return fetch(AFFILIATE_DATA_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) { affCache = data; return data; });
  }

  function wireAffiliateLinks() {
    document.querySelectorAll('a[data-affiliate]').forEach(function (a) {
      const offerName = a.getAttribute('data-affiliate');
      a.setAttribute('rel', 'sponsored nofollow noopener noreferrer');
      a.setAttribute('target', '_blank');
      a.setAttribute('referrerpolicy', 'no-referrer');

      a.addEventListener('click', function (e) {
        e.preventDefault();
        loadAffData().then(function (data) {
          const offer = data[offerName];
          if (offer && offer.url) {
            window.open(offer.url, '_blank', 'noopener,noreferrer');
          }
        }).catch(function () {});
      });
    });
  }

  // Direct redirect on /go/dating/ page (for anyone who lands there directly)
  function handleGoPage() {
    const offerName = location.pathname.replace(/\/$/, '').split('/').pop();
    if (offerName !== 'dating') return;
    loadAffData().then(function (data) {
      const offer = data[offerName];
      if (offer && offer.url) location.replace(offer.url);
    });
  }

  if (location.pathname.indexOf('/go/dating/') !== -1) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', handleGoPage);
    else handleGoPage();
  } else {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireAffiliateLinks);
    else wireAffiliateLinks();
  }
})();
