var Q = require('q');
var fs = require('fs-extra');
var q_extra = require('./util/q-extra');
var path = require('path');

var sharedDirs = "config branches hooks info objects refs packed-refs svn".split(' ');

module.exports = function attach(wcDir, config) {
  var projectDir = config.cwd;
  var relDir = path.relative(wcDir + '/.git', projectDir + '/.git-group')
  return Q.all(sharedDirs.map(function (dir) {
    var destDir = wcDir + '/.git/' + dir;
    return Q.nfcall(fs.remove.bind(fs), destDir)
      .then(q_extra.thunk(fs.symlink.bind(fs), relDir + '/' + dir, destDir));
  }));
};
