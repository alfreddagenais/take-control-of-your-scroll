'use strict';

// eslint-disable-next-line no-var
var core = {
  'update': function (state) {
    app.button.title = 'Current State: ' + state.toUpperCase();
    app.button.icon = {
      'path': {
        '16': '../../data/icons/' + (state ? state + '/' : '') + '16.png',
        '32': '../../data/icons/' + (state ? state + '/' : '') + '32.png',
        '48': '../../data/icons/' + (state ? state + '/' : '') + '48.png',
        '64': '../../data/icons/' + (state ? state + '/' : '') + '64.png'
      }
    };
  },
  'hostname': function (url) {
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
};

app.button.clicked(function () {
  config.addon.state = config.addon.state === 'enabled' ? 'disabled' : 'enabled';
  core.update(config.addon.state);
});

app.options.receive('open-support-page', function () {
  app.tab.open(app.homepage());
});
app.options.receive('make-a-donation', function () {
  app.tab.open(app.homepage() + '?reason=support');
});

window.setTimeout(function () {
  core.update(config.addon.state);
}, 300);
