var Q = require('q');
var _ = require('underscore');

var slice = Array.prototype.slice;

module.exports = function nodeify(fn, adapter) {
  return function () {
    var args = slice.call(arguments);
    if (args.length == 0) {
      return fn.call();
    }
    var cb = _(args).last();
    args = _(args).initial();
    args.push(adapter(cb));
    fn.apply(null, args);
  };
}
