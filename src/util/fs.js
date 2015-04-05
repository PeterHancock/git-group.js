var fs = require('fs-extra');
var nodeify = require('./nodeify')

var exists = nodeify(fs.exists.bind(fs), function (cb) {
  return function (exists) {
      return cb(null, exists);
  };
});

module.exports = {
  exists: exists
};
