// @remove-on-eject-begin
/**
 * Copyright (c) 2017-present, OffGrid Networks
 * ADDED FOR FUSE-BOX-REACT-SCRIPTS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
const paths = require('../config/paths'),
  fsbx = require('fuse-box'),
  FuseBox = fsbx.FuseBox,
  path = require('path'),
  fs = require('fs-extra'),
  chalk = require('chalk');

var nonce = 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function(c) {
  var r = (Math.random() * 16) | 0,
    v = c == 'x' ? r : (r & 0x3) | 0x8;
  return v.toString(16);
});

const bundleSuffix = '-' + nonce + '.js';
const BUNDLE = 'bundle';

exports.initBuilder = function({ srcDir, targetDir, port }) {
  //var fuseConfigFile = (process.env.NODE_ENV == 'production') ? "fuse.config.prod.js" : "fuse.config.dev.js";
  var fuseConfigFile = 'fuse.config.js';
  var fuseConfigPath = path.resolve(__dirname, '../config', fuseConfigFile);

  // OVERRIDE WITH LOCAL PACKAGE VERSION IF IT EXISTS
  if (fs.existsSync(path.join(paths.appConfig, fuseConfigFile)))
    fuseConfigPath = path.join(paths.appConfig, fuseConfigFile);

  var fuseConfig = require(fuseConfigPath);

  srcDir = srcDir || paths.appSrc;
  targetDir = targetDir || paths.appBuild;

  return fuseConfig.initBuilder({
    paths: paths,
    srcDir: srcDir,
    targetDir: targetDir,
    port: port,
    env: getClientEnvironment(),
  });
};

exports.buildBabel = function(srcDir, targetDir) {
  const buildbabel = require('./build-babel');

  var fuseConfigFile =
    process.env.NODE_ENV == 'production'
      ? 'fuse.config.prod.js'
      : 'fuse.config.dev.js';
  var fuseConfigPath = path.resolve(__dirname, '../config', fuseConfigFile);

  // OVERRIDE WITH LOCAL PACKAGE VERSION IF IT EXISTS
  if (fs.existsSync(path.join(paths.appConfig, fuseConfigFile)))
    fuseConfigPath = path.join(paths.appConfig, fuseConfigFile);

  var fuseConfig = require(fuseConfigPath);
  return buildbabel(fuseConfig.babelConfig(srcDir, targetDir));
};

const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment() {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
      }
    );

  return raw;
}
