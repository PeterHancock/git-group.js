var fs = require('fs-extra');
var Git = require('nodegit');
var tmp = require('temporary');
var Q = require('q');
var rmdir = require('rmdir');
var Url = require('url');
var _ = require('underscore');
var fs_safe = require('../util/fs');
var q_extra = require('../util/q-extra');

var attach = require('../attach');

module.exports = function add(config, name) {
  var dir = new tmp.Dir();
  var projectDir  = config.cwd;
  var wcDir = config.cwd + '/' + name;
  return Q.nfcall(fs_safe.exists, projectDir + '/.git-group')
  .then(function (exists) {
    if (!exists)
      throw projectDir + ' is not a git group';
  })
  .then(q_extra.thunk(fs_safe.exists, wcDir))
  .then(function (exists) {
    if (exists)
      throw 'Working Copy ' + name + ' exists';
  })
  .then(q_extra.thunk(fs.mkdir.bind(fs), wcDir))
  .then(function () {
    return Git.Repository.init(wcDir, 0);
  })
  .then(function () {
    return attach(wcDir, config);
  })
}
