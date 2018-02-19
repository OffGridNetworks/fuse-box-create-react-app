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

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({ silent: true });

// @remove-on-eject-begin
// Do the preflight check (only happens before eject).
const verifyPackageTree = require('./utils/verifyPackageTree');
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}
// @remove-on-eject-end

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');

const paths = require('../config/paths');

const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const printBuildError = require('react-dev-utils/printBuildError');
const { printBrowsers } = require('./utils/browsersHelper');

const buildcommon = require('./build-common');

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml('index.html'), paths.appIndexJs])) {
  process.exit(1);
}

// Facebook CRA recommends-requires that you explictly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('./utils/browsersHelper');
checkBrowsers(paths.appPath)
  .then(() => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);

    if (paths.appStoriesJs) fs.emptyDirSync(paths.appStoriesBuild);

    // Merge with the public folder
    copyPublicFolder();
    // Start the Fuse-Box build
    return build();
  })
  .then(
    success => {
      if (!success) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = paths.appPublic;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        paths.useYarn
      );
      printBrowsers(paths.appPath);
      process.exit(0);
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    }
  )
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// Primary Build function for Create-React-App
function buildApp() {
  return buildcommon.initBuilder({}).start('dist');
}

// Alternative Build function for Create-React-Component
function buildStoriesComponent() {
  return buildcommon
    .buildBabel(paths.appSrc, paths.appBuild)
    .then(function(val) {
      return buildcommon
        .initBuilder(
          'manager',
          paths.appStoriesJs,
          path.join(paths.appStoriesBuild, paths.Bundle)
        )
        .bundle('>index.js')
        .then(function(val) {
          if (!val) return val;
          return buildcommon
            .initBuilder(
              'stories',
              paths.appSrc,
              path.join(paths.appStoriesBuild, paths.Bundle)
            )
            .bundle('>__stories__/index.js');
        })
        .then(function(val) {
          if (!val) return val;

          buildcommon.copyStaticFolder(
            { 'index.html': 'manager', 'iframe.html': 'stories' },
            paths.appStoriesBuild
          );

          return val;
        });
    });
}

// Create the production build and print the deployment instructions.
function build() {
  console.log('Creating an optimized production build...');

  var builder = paths.appStoriesJs ? buildStoriesComponent : buildApp;

  return builder().then(function(val) {
    if (!val) {
      return reject('Build Failed');
    }

    return true;
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
