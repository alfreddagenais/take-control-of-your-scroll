'use strict';

// eslint-disable-next-line no-var
app.tab = {
  'open': function (url) {
    chrome.tabs.create({'url': url, 'active': true});
  }
};

app.button = {
  // eslint-disable-next-line accessor-pairs
  set icon(e) {
    chrome.browserAction.setIcon(e);
  },
  // eslint-disable-next-line accessor-pairs
  set title(title) {
    chrome.browserAction.setTitle({'title': title});
  },
  'clicked': function (callback) {
    chrome.browserAction.onClicked.addListener(callback);
  }
};

app.contextmenus = {
  'create': function (e) {
    chrome.contextMenus.create(e);
  },
  'clicked': function (callback) {
    chrome.contextMenus.onClicked.addListener(callback);
  }
};

app.options = (function () {
  const tmp = {};
  // eslint-disable-next-line no-unused-vars
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (const id in tmp) {
      if (tmp[id] && (typeof tmp[id] === 'function')) {
        if (request.path === 'options-to-background') {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  return {
    'receive': function (id, callback) {
      tmp[id] = callback;
    },
    // eslint-disable-next-line no-unused-vars
    'send': function (id, data, tabId) {
      chrome.runtime.sendMessage({'path': 'background-to-options', 'method': id, 'data': data});
    }
  };
})();

app.storage = (function () {
  let objs = {};
  chrome.storage.onChanged.addListener(function () {
    chrome.storage.local.get(null, function (e) {
      objs = e;
    });
  });
  window.setTimeout(function () {
    chrome.storage.local.get(null, function (e) {
      objs = e;
      const script = document.createElement('script');
      script.src = '../common.js';
      document.body.appendChild(script);
    });
  }, 0);
  return {
    'read': function (id) {
      return objs[id];
    },
    'write': function (id, data) {
      const tmp = {};
      tmp[id] = data;
      objs[id] = data;
      chrome.storage.local.set(tmp, function () {});
    }
  };
})();
