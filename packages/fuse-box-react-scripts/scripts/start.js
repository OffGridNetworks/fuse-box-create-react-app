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
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({ silent: true });

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// @remove-on-eject-begin
// Do the preflight check (only happens before eject).
const verifyPackageTree = require('./utils/verifyPackageTree');
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}
// @remove-on-eject-end

const chalk = require('chalk');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const detect = require('detect-port');
const getProcessForPort = require('react-dev-utils/getProcessForPort');
const fs = require('fs-extra');

const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');

var buildcommon = require('./build-common');

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appIndexJs, paths.appHtml('index.html')])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(
    `If this was unintentional, check that you haven't mistakenly set it in your shell.`
  );
  console.log(
    `Learn more here: ${chalk.yellow('http://bit.ly/CRA-advanced-config')}`
  );
  console.log();
}

// Primary Build function for Fuse-Box-Create-React-App
function buildApp(port) {
  return buildcommon.initBuilder({ port: port }).start('dev');
}

// Alternative Build function for Fuse-Box Create-React-Component
function buildStoriesComponent(port) {
  buildcommon.copyStaticFolder(
    { 'index.html': 'manager', 'iframe.html': 'stories' },
    paths.appStoriesBuild
  );

  return buildcommon
    .initBuilder(
      'manager',
      paths.appStoriesJs,
      path.join(paths.appStoriesBuild, paths.Bundle)
    )
    .bundle('>index.js')
    .then(function(val) {
      if (!val) return Promise.reject(val);

      var server = buildcommon
        .initBuilder(
          'stories',
          paths.appSrc,
          path.join(paths.appStoriesBuild, paths.Bundle)
        )
        .devServer('>__stories__/index.js', {
          port: port,
          root: paths.appStoriesBuild,
        });

      server.httpServer.app.use(express.static(paths.appStoriesBuild));
      server.httpServer.app.get('*', function(req, res) {
        res.sendFile(path.join(paths.appStoriesBuild, 'index.html'));
      });

      return server;
    });
}

function run(port) {
  var protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  var host = process.env.HOST || 'localhost';

  if (isInteractive) {
    clearConsole();
  }

  fs.emptyDirSync(paths.appBuild);

  if (paths.appStoriesJs) fs.emptyDirSync(paths.appStoriesBuild);

  var builder = paths.appStoriesJs ? buildStoriesComponent : buildApp;

  var server = builder(port)
    .then(function(server) {
      process.nextTick(() => {
        console.log(chalk.cyan('Started the development server...'));
        console.log();
        openBrowser(protocol + '://' + host + ':' + port + '/');
      });
    })
    .catch(function(err) {
      console.log('Failed during development hosting');
      console.log(err);
      process.exit(1);
    });
}

// Facebook CRA requires that you explictly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('./utils/browsersHelper');
checkBrowsers(paths.appPath)
  .then(() => {
    detect(DEFAULT_PORT).then(port => {
      if (port === DEFAULT_PORT) {
        run(port);
        return;
      }

      if (isInteractive) {
        clearConsole();
        var existingProcess = getProcessForPort(DEFAULT_PORT);
        var question =
          chalk.yellow(
            'Something is already running on port ' +
              DEFAULT_PORT +
              '.' +
              (existingProcess ? ' Probably:\n  ' + existingProcess : '')
          ) + '\n\nWould you like to run the app on another port instead?';

        prompt(question, true).then(shouldChangePort => {
          if (shouldChangePort) {
            run(port);
          }
        });
      } else {
        console.log(
          chalk.red(
            'Something is already running on port ' + DEFAULT_PORT + '.'
          )
        );
      }
    });
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
