// @remove-on-eject-begin
/**
 * Copyright (c) 2017-present, OffGrid Networks
 * ADDED FOR FUSE-BOX-REACT-SCRIPTS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
const paths = require('../../config/paths'),
  path = require('path'),
  fs = require('fs-extra');

const BUNDLE = 'bundle';

exports.initBuilder = function(context) {
  var fuseConfigFile = 'fuse.config.js';
  var fuseConfigPath = path.resolve(__dirname, '../../config', fuseConfigFile);

  // OVERRIDE WITH LOCAL PACKAGE VERSION IF IT EXISTS
  if (fs.existsSync(path.join(paths.appConfig, fuseConfigFile)))
    fuseConfigPath = path.join(paths.appConfig, fuseConfigFile);

  var fuseConfig = require(fuseConfigPath);

  context.srcDir = context.srcDir || paths.appSrc;
  context.targetDir = context.targetDir || paths.appBuild;
  context.staticDirs = context.staticDirs || paths.appPublic;
  context.env = getClientEnvironment();
  context.paths = paths;

  return fuseConfig.initBuilder(context);
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
