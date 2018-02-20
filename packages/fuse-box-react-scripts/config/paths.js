// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * Portions Copyright (c) 2016-present, OffGrid Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/offgridnetworks/fuse-box-create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const packageJson = require(resolveApp('package.json'));

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

// Utility method for /* FUSE-BOX */
function getPackageDirectory(key, defaultdir) {
  var directories = packageJson.directories;
  if (directories && directories[key]) return directories[key];
  else return defaultdir || key;
}

// Utility method for /* FUSE-BOX */
function resolveAppPackageDirectoryOrNull(key) {
  var directories = packageJson.directories;
  if (directories && directories[key]) return resolveApp(directories[key]);
  else return null;
}

function resolveAppArray(pathitem) {
  if (Array.isArray(pathitem)) {
    var result = [];
    pathitem.forEach(function(item) {
      result.push(resolveApp(item));
    });
    return result;
  }

  return resolveApp(pathitem);
}

const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

// config after eject: we're in ./config/
module.exports = {
  // dotenv: resolveApp('.env'),  REMOVED FOR  /* FUSE-BOX */
  appPath: resolveApp('.'),
  appBuild: resolveApp(getPackageDirectory('build')) /* FUSE-BOX */,
  appPublic: resolveAppArray(getPackageDirectory('public')),
  appHtml: function(file) {
    return resolveApp(path.join(getPackageDirectory('src'), file));
  } /* FUSE-BOX */,
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp(getPackageDirectory('src')) /* FUSE-BOX */,
  testsSetup: resolveApp(
    path.join(getPackageDirectory('src'), 'setupTests.js')
  ) /* FUSE-BOX */,
  appNodeModules: resolveApp('node_modules'),
  ownNodeModules: resolveOwn('node_modules') /* FUSE-BOX */,
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  // ADDITIONAL ITEMS ADDED FOR /* FUSE-BOX */
  Bundle: getPackageDirectory('bundle', path.join('static', 'js')).replace(
    /^[\/\\]/,
    ''
  ) /* FUSE-BOX */,
  appConfig: resolveApp(getPackageDirectory('config')) /* FUSE-BOX */,
  appStoriesJs: resolveAppPackageDirectoryOrNull('stories-js') /* FUSE-BOX */,
  appStoriesBuild: resolveApp(
    getPackageDirectory('stories-build', 'build-storybook')
  ) /* FUSE-BOX */,
  yarnLockFile: resolveApp('yarn.lock') /* FUSE-BOX */,
  appDirectory: appDirectory /* FUSE-BOX */,
  ownPath: resolveOwn('.'),
};

module.exports.srcPaths = [module.exports.appSrc];

module.exports.useYarn = fs.existsSync(
  path.join(module.exports.appPath, 'yarn.lock')
);
