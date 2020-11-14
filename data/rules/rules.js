'use strict';

/* eslint-disable no-useless-escape */
/* eslint-disable no-var */
// eslint-disable-next-line no-unused-vars
var website = {
  'exclude': {
    'from': {
      'custom': {
        'dark': {
          'mode': [
            'youtube',
            'facebook'
          ]
        }
      }
    }
  },
  'custom': {
    'regex': {
      'rules': {
        'instagram': '^http(s)?\:\/\/(www\.)?instagram\.([a-zA-Z]+)',
        'yandex': '^http(s)?\:\/\/([a-zA-Z.]*\.)?yandex\.([a-zA-Z]+)',
        'translate': '^http(s)?\:\/\/(www\.)?translate\.google\.([a-zA-Z]+)',
        'google': '^http(s)?\:\/\/(www\.)?google\.([a-zA-Z]+)\/(search|travel|flights)'
      }
    }
  }
};
