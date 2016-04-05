'use strict';

var _ = require('lodash');
var newrelic = require('newrelic');

module.exports = function middlewareFactory(routerInstance, cfg) {
  var cfg = _.defaults(cfg || {}, {
    ctrlFormat: true
  });
  return function *(next) {
    try {
      yield next;
    } catch (err) {
      this.throw(err);
    } finally {

      var match = routerInstance.match(this.url.split('?')[0]);
      if (match && match.path && match.path[0]) {
        var str = match.path[0].path.replace(/\/+/g,'/');
        newrelic[cfg.ctrlFormat ? 'setControllerName' : 'setTransactionName'](str);
      }
    }
  }
};
