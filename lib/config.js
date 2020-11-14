'use strict';

// eslint-disable-next-line no-var
var config = {};

config.addon = {
  set state(val) {
    app.storage.write('state', val);
  },
  get state() {
    return app.storage.read('state') !== undefined ? app.storage.read('state') : 'disabled';
  }
};

config.exception = {
  'keys': [
    'scrollmode=1',
    'scroll_mode=1',
    'scrollablemode=1',
    'scrollable_mode=1'
  ]
};
