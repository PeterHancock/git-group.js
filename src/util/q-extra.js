var Q = require('q');

var slice = Array.prototype.slice;

var thunk = function (fn) {
    var args = slice.call(arguments);
    return function () {
      return Q.nfcall.apply(Q, args);
    }
};

module.exports = {
  thunk: thunk
};
