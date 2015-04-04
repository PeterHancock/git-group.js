var fs = require('fs-extra');
var Git = require('nodegit');
var tmp = require('temporary');
var Q = require('q');
var dir = new tmp.Dir();
var rmdir = require('rmdir');
var Url = require('url');
var _ = require('underscore');
var nodeify = require('../util/nodeify');

var attach = require('../attach');

var exists = nodeify(fs.exists.bind(fs), function (cb) {
  return function (exists) {
    if (!exists) {
      return cb('Not exists');
    }
    cb(null);
  };
});

var notExists = nodeify(fs.exists.bind(fs), function (cb) {
  return function (exists) {
    if (exists) {
      return cb('Exists');
    }
    cb();
  };
});

module.exports = function add(name, config) {
  var projectDir  = config.cwd;
  var wcDir = config.cwd + '/' + name;
  return Q.nfcall(exists, projectDir + '/.git-group')
  .fail(function () {
    throw projectDir + ' is not a git group';
  })
  .then(function () {
    return Q.nfcall(notExists, wcDir);
  })
  .fail(function () {
    throw 'Working Copy ' + name + ' exists';
  })
  .then(function () {
    return Q.nfcall(fs.mkdir.bind(fs), wcDir);
  })
  .then(attach(name, config));
}

