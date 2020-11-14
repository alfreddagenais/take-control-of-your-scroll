'use strict';

// eslint-disable-next-line no-var
var app = {};

app.version = function () {
  return chrome.runtime.getManifest().version;
};
app.homepage = function () {
  return chrome.runtime.getManifest().homepage_url;
};

chrome.runtime.onMessage.addListener(function (e, sender, response) {
  if (e.message === 'top') {
    response(sender.tab.url);
  }
});

chrome.runtime.onInstalled.addListener(function () {
  /*  */
  chrome.storage.local.get(null, function (data) {
    const tmp = {};
    /*  */
    tmp['state'] = data.state !== undefined ? data.state : 'disabled';
    tmp['whitelist'] = data.whitelist !== undefined ? data.whitelist : [];
    tmp['cookie'] = data.cookie !== undefined ? data.cookie : config.exception.keys;
    tmp['support'] = data.support !== undefined ? data.support : navigator.userAgent.toLowerCase().indexOf('firefox') === -1;
    /*  */
    chrome.storage.local.set(tmp, function () {});
  });
});
