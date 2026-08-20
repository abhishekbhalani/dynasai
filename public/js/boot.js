(function () {
  var root = document.documentElement;
  try {
    root.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
  } catch (e) {
    root.setAttribute('data-theme', 'light');
  }

  var adminHost = location.hostname === 'admin.dynasai.ai';
  try {
    if (localStorage.getItem('dynasai_cookie_consent')) {
      root.setAttribute('data-cookie-ok', '1');
    } else if (!adminHost) {
      root.setAttribute('data-cookie-needed', '1');
    }
  } catch (e) {
    if (!adminHost) root.setAttribute('data-cookie-needed', '1');
  }

  if (!adminHost) {
    try {
      var path = location.pathname + location.search;
      if (!sessionStorage.getItem('dynasai_land')) {
        sessionStorage.setItem('dynasai_land', path);
        var params = new URLSearchParams(location.search);
        ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (key) {
          var value = params.get(key);
          if (value && !sessionStorage.getItem('dynasai_' + key)) {
            sessionStorage.setItem('dynasai_' + key, value);
          }
        });
      }
      if (!sessionStorage.getItem('dynasai_ref') && document.referrer) {
        sessionStorage.setItem('dynasai_ref', document.referrer);
      }
      var pages = [];
      try {
        pages = JSON.parse(sessionStorage.getItem('dynasai_pages') || '[]');
      } catch (e) {
        pages = [];
      }
      if (!Array.isArray(pages)) pages = [];
      if (pages[pages.length - 1] !== path) {
        pages.push(path);
        sessionStorage.setItem('dynasai_pages', JSON.stringify(pages.slice(-20)));
      }
    } catch (e) {
      /* private mode */
    }
  }

  window.dynasaiVisitor = function () {
    try {
      return {
        pages: JSON.parse(sessionStorage.getItem('dynasai_pages') || '[]'),
        landing: sessionStorage.getItem('dynasai_land') || location.pathname,
        sessionReferrer: sessionStorage.getItem('dynasai_ref') || '',
        referrer: document.referrer || '',
        utmSource: sessionStorage.getItem('dynasai_utm_source') || '',
        utmMedium: sessionStorage.getItem('dynasai_utm_medium') || '',
        utmCampaign: sessionStorage.getItem('dynasai_utm_campaign') || '',
        timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone || ''),
        language: navigator.language || '',
        viewport: (window.innerWidth || 0) + 'x' + (window.innerHeight || 0),
      };
    } catch (e) {
      return {
        pages: [],
        landing: location.pathname,
        referrer: document.referrer || '',
      };
    }
  };

  if (window.trustedTypes && trustedTypes.createPolicy) {
    try {
      trustedTypes.createPolicy('default', {
        createHTML: function (value) {
          return value;
        },
        createScriptURL: function (value) {
          return value;
        },
        createScript: function (value) {
          return value;
        },
      });
    } catch (e) {
      /* policy already exists */
    }
  }
})();
