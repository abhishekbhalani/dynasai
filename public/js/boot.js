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
