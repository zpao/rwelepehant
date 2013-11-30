var Q = require('q');
var requestq = require('./lib/requestq');

// The RWE client version that we support
var CLIENT_VERSION = 4;

// get methods
var API_GET = [
  'list_inventory_types',
  'list_inventory_items_by_type',
  'inventory_item_detail_for_id'
];

// Simple helper
function invariant(condition, error) {
  if (!condition) {
    throw new Error(error);
  }
}

// Helper to parse the response and determine the success state, as a promise.
function handleResponse(res) {
  var deferred = Q.defer();
  var response = res[0];

  if (response.headers['content-type'].indexOf('application/json') === -1) {
    console.error(response);
    deferred.reject(new Error('Response was not JSON'));
  }

  var data = JSON.parse(response.body);

  // fail if response_status !== success
  if (data.response_status !== 'Success') {
    console.error(data);
    deferred.reject(new Error(data.response_status));
  } else {
    deferred.resolve(data.response_data);
  }
  return deferred.promise;
}


function RWElephant(options) {
  invariant(options && options instanceof Object, 'You must specify an object');

  this.domain = options.domain;
  this.username = options.username;
  this.password = options.password;
  this.debug = options.debug || false;
  this.sID = options.sID;
  this.url = 'https://' + this.domain + '.rwelephant.com/perl/rwelephant_server';

  API_GET.forEach(function(method) {
    this[method] = function(data) {
      return this._get(method, data);
    }.bind(this);
  }, this);
}

RWElephant.prototype = {
  _log: function() {
    if (this.debug) {
      console.log.apply(null, arguments);
    }
  },

  _get: function(rm, data) {
    invariant(rm, 'Must specify an action');
    data = data || {};
    data.rm = rm;
    if (this.sID) {
      data.sid = this.sID;
    }
    return requestq.get(this.url, data).then(handleResponse);
  },

  _post: function(rm, data) {
    invariant(rm, 'Must specify an action');
    data = data || {};
    data.rm = rm;
    if (this.sID) {
      data.sid = this.sID;
    }
    return requestq.get(this.url, data).then(handleResponse);
  },

  /**
   * @return sessionID
   */
  login: function() {
    var deferred = Q.defer();

    if (this.sID) {
      deferred.resolve(this.sID);
    }
    else {
      var data = {
        'client_version': 4,
        'username': this.username,
        'password': this.password
      };
      this._post('process_login', data)
        .then(function(data) {
          this.sID = data.session_id;
          deferred.resolve(this.sID);
        }.bind(this), deferred.reject);
    }
    return deferred.promise;
  }
};


module.exports = RWElephant;
