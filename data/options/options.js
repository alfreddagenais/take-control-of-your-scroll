'use strict';

// eslint-disable-next-line no-var
var background = (function () {
  const tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (const id in tmp) {
      if (tmp[id] && (typeof tmp[id] === 'function')) {
        if (request.path === 'background-to-options') {
          if (request.method === id) {
            tmp[id](request.data);
          }
        }
      }
    }
  });
  /*  */
  return {
    'receive': function (id, callback) {
      tmp[id] = callback;
    },
    'send': function (id, data) {
      chrome.runtime.sendMessage({'path': 'options-to-background', 'method': id, 'data': data});
    }
  };
})();

// eslint-disable-next-line no-var
var config = {
  'elements': {},
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
  'UI': {
    'update': function () {
      /*  */
      chrome.storage.local.get(null, function (e) {
        config.elements.whitelist.value = e.whitelist ? e.whitelist.join(', ') : '';
      });
    },
    'render': function () {
      const details = [...document.querySelectorAll('details')];
      /*  */
      chrome.storage.local.get(null, function (e) {
        details[0].open = e['section-1'];
        /*  */
        config.elements.whitelist.value = e.whitelist ? e.whitelist.join(', ') : '';
        /*  */
        config.UI.update();
      });
    }
  },
  'load': function () {
    /*  */
    config.elements.whitelist = document.getElementById('whitelist');
    /*  */
    const donation = document.getElementById('make-a-donation');
    donation.addEventListener('click', function () {
      background.send('make-a-donation');
    });
    /*  */
    const support = document.getElementById('open-support-page');
    support.addEventListener('click', function () {
      background.send('open-support-page');
    });
    /*  */
    config.elements.whitelist.addEventListener('change', function () {
      let tmp = [];
      const whitelist = config.elements.whitelist.value || '';
      const splitted = whitelist.split(/\s*\,\s*/);
      /*  */
      for (let i = 0; i < splitted.length; i++) tmp.push(config.host.name(splitted[i]));
      tmp = tmp.filter(function (element, index, array) {
        return element && array.indexOf(element) === index;
      });
      chrome.storage.local.set({'whitelist': tmp}, function () {});
    });
    /*  */
    config.UI.render();
    window.removeEventListener('load', config.load, false);
  }
};

window.addEventListener('load', config.load, false);
chrome.storage.onChanged.addListener(config.UI.update);
