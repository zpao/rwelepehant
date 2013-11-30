var Q = require('q');
var request = require('request');

// Wrap the basic things we need from request as promises, along with shortcuts
// to handing over form/query data.
module.exports = {
  get: function(url, data) {
    return Q.nfcall(request.get, url, {qs: data});
  },

  post: function(url, data) {
    return Q.nfcall(request.post, url, {form: data});
  }
};

