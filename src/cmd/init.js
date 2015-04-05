var fs = require('fs-extra');
var Git = require('nodegit');
var tmp = require('temporary');
var Q = require('q');
var rmdir = require('rmdir');
var Url = require('url');
var _ = require('underscore');
var nodeify = require('../util/nodeify');
var fs_safe = require('../util/fs')

module.exports = function init(config, url) {
  var u = Url.parse(url.replace(/\/$/, ''));
  var projectName = _(u.path.split('/')).last().replace(/\.git/, '');
  var projectDir = config.cwd + '/' + projectName;
  var tmpDir = new tmp.Dir();
  console.log(u.pathname, projectName, projectDir, tmpDir.path)
  return Q.nfcall(fs_safe.exists, projectDir)
    .then(function (exists) {
      if (exists)
        throw projectDir + ' exists!';
    })
    .then(function () {
      return Q(
        Git.Clone(url, tmpDir.path)
            .then(function () { return Q.ninvoke(fs, 'move', tmpDir.path + '/.git', projectDir + '/.git-group'); })
    )})
    .fin(function () {
      return Q.nfcall(rmdir, tmpDir.path);
    });
};
