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

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');

const paths = require('../config/paths');

const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const printBuildError = require('react-dev-utils/printBuildError');
const { printBrowsers } = require('./utils/browsersHelper');

const buildcommon = require('./utils/build-common');

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

const isComponent = paths.appDocsJs ? true : false;

// Warn and crash if required files are missing
if (!isComponent && !checkRequiredFiles([paths.appHtml('index.html')])) {
  process.exit(1);
}

// @remove-on-eject-begin
// Do the preflight check (only happens before eject).
const verifyPackageTree = require('./utils/verifyPackageTree');
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}
// @remove-on-eject-end

// Facebook CRA recommends-requires that you explictly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('./utils/browsersHelper');
checkBrowsers(paths.appPath)
  .then(() => {
    // Start the Fuse-Box build
    return build();
  })
  .then(
    success => {
      if (!success) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
      } else {
        console.log(chalk.green('Compiled.\n'));
      }

      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = paths.appBuild;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      const buildFolderDocs = paths.appDocsJs
        ? path.relative(process.cwd(), paths.appDocsBuild)
        : path.relative(process.cwd(), paths.appBuild);

      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolderDocs,
        paths.useYarn
      );

      console.log('You may serve it locally with a static server:');
      console.log();
      if (paths.useYarn) {
        console.log('  ' + chalk.cyan('yarn') + ' global add pushstate-server');
      } else {
        console.log('  ' + chalk.cyan('npm') + ' install -g pushstate-server');
      }
      console.log(
        '  ' + chalk.cyan('pushstate-server') + ' ' + buildFolderDocs
      );

      console.log(
        '  ' +
          chalk.cyan(process.platform === 'win32' ? 'start' : 'open') +
          ' http://localhost:9000'
      );
      console.log();

      if (buildFolder !== buildFolderDocs) {
        console.log(
          'The code bundle can be deployed from folder ' +
            chalk.cyan(buildFolder) +
            '.'
        );
        console.log();
      }

      printBrowsers(paths.appPath);
      setTimeout(process.exit, 500);
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      console.log(err);
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
  fs.emptyDirSync(paths.appBuild);

  return buildcommon.initBuilder({}).start('dist');
}

// Alternative Build function for Create-React-Component
function buildComponent() {
  fs.emptyDirSync(paths.appDocsBuild);
  fs.emptyDirSync(paths.appBuild);

  return buildcommon
    .initBuilder({ component: true })
    .start('dist')
    .then(() => {
      return buildcommon
        .initBuilder({
          componentdocs: true,
          staticDirs: paths.appDocsPublic,
          targetDir: paths.appDocsBuild,
        })
        .start('dist');
    });
}

// Create the production build and print the deployment instructions.
function build() {
  console.log('Creating an optimized production build...');

  var builder = isComponent ? buildComponent : buildApp;

  return builder();
}
