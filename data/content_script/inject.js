'use strict';

/* eslint-disable block-scoped-var */
/* eslint-disable no-useless-escape */
/* eslint-disable no-var */
// eslint-disable-next-line no-unused-vars
var config = {
  'head': '',
  'body': '',
  'tab': {
    'href': document.location.href
  },
  'main': {
    'style': document.getElementById('scroll-main-link'),
  },
  'init': function (e) {
    if (e) {
      config.tab.href = e;
    }
    config.update();
  },
  'updateBodyStyle': function () {
    if (config.body.style.overflow === 'hidden !important') {
      config.body.style.overflow = 'auto';
    }
    if (config.body.style.overflow === 'hidden') {
      config.body.style.overflow = 'auto';
    }
    if (config.body.style.height === '100vh') {
      config.body.style.height = 'auto';
    }
    if (config.body.style.height === '100vh !important') {
      config.body.style.height = 'auto';
    }
  },
  'checkBodyStyle': function () {
    config.updateBodyStyle();
    for (let i = 1; i < 10; i++) {
      setTimeout(function () {
        config.updateBodyStyle();
      }, i * 500);
    }
  },
  'edit': function (isEnabled) {
    if (isEnabled) {
      config.checkBodyStyle();
      config.main.link.setAttribute('href', chrome.runtime.getURL('data/content_script/main/style.css'));
    } else {
      config.main.link.removeAttribute('href');
    }
  },
  'observer': {
    'head': new MutationObserver(function () {
      config.head = document.documentElement || document.head || document.querySelector('head');
      if (config.head) {
        const tmp1 = document.getElementById('scroll-main-link');
        if (!tmp1) {
          config.head.appendChild(config.main.link);
        }
        config.observer.head.disconnect();
      }
    }),
    'body': new MutationObserver(function () {
      config.body = document.body || document.querySelector('body');
      if (config.body) {
        config.checkBodyStyle();
        config.observer.body.disconnect();
      }
    })
  },
  'host': {
    'name': function (url) {
      url = url.replace('www.', '');
      const s = url.indexOf('//') + 2;
      if (s > 1) {
        let o = url.indexOf('/', s);
        if (o > 0) return url.substring(s, o);
        else {
          o = url.indexOf('?', s);
          if (o > 0) return url.substring(s, o);
          else return url.substring(s);
        }
      } else return url;
    }
  },
  'load': function () {
    /*  */
    if (!config.main.link) {
      config.main.link = document.createElement('link');
      config.main.link.setAttribute('type', 'text/css');
      config.main.link.setAttribute('rel', 'stylesheet');
      config.main.link.setAttribute('id', 'scroll-main-link');
    }
    /*  */
    config.head = document.documentElement || document.head || document.querySelector('head');
    if (config.head) {
      config.head.appendChild(config.main.link);
    } else {
      config.observer.head.observe(document, {
        'subtree': true,
        'childList': true,
      });
    }
    /*  */
    config.body = document.body || document.querySelector('body');
    if (config.body) {
      config.checkBodyStyle();
    } else {
      config.observer.body.observe(document, {
        'subtree': true,
        'childList': true,
      });
    }
  },
  'check': {
    'scrollable': function (e) {
      try {
        if (e && e.length) {
          for (let i = 0; i < e.length; i++) {
            if (document.cookie) {
              if (document.cookie.indexOf(e[i]) !== -1) {
                return true;
              }
            }
            /*  */
            if (localStorage) {
              var localStorageKeys = JSON.stringify(localStorage).replace(/\\/g, '').replace(/\"/g, '');
              if (localStorageKeys) {
                if (localStorageKeys.indexOf(e[i]) !== -1) {
                  return true;
                }
              }
            }
            /*  */
            if (sessionStorage) {
              var sessionStorageKeys = JSON.stringify(sessionStorage).replace(/\\/g, '').replace(/\"/g, '');
              if (sessionStorageKeys) {
                if (sessionStorageKeys.indexOf(e[i]) !== -1) {
                  return true;
                }
              }
            }
          }
        }
      } catch (e) {
        return false;
      }
      /*  */
      return false;
    }
  },
  'update': function () {
    chrome.storage.local.get(null, function (e) {
      const host = config.host.name(config.tab.href);
      const scrollable = config.check.scrollable(e.cookie);
      /*  */
      if (config.tab.href.indexOf('/chrome/newtab') !== -1) {
        return config.edit(false);
      }
      if (scrollable) {
        return config.edit(true);
      }
      /*  */
      // eslint-disable-next-line no-var
      for (var i = 0; i < e.whitelist.length; i++) {
        if (e.whitelist[i] === host) return config.edit(true);
      }
      config.edit(e.state === 'enabled');
    });
  }
};

if (window === window.top) {
  config.update();
} else {
  chrome.runtime.sendMessage({'message': 'top'}, config.init);
}

config.load();
chrome.storage.onChanged.addListener(config.update);
window.addEventListener('load', function () {
  config.observer.head.disconnect();
}, false);
