// @remove-file-on-eject
/**
 * Copyright (c) 2017-present, OffGrid Networks
 * ADDED FOR FUSE-BOX-REACT-SCRIPTS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var fs = require('fs-extra');
var path = require('path');
var paths = require('../config/paths');
const inquirer = require('react-dev-utils/inquirer');
var spawnSync = require('cross-spawn').sync;
var chalk = require('chalk');
var green = chalk.green;
var cyan = chalk.cyan;
const os = require('os');

inquirer
  .prompt({
    type: 'confirm',
    name: 'shouldEject',
    message:
      'Are you sure you want to eject the FuseBox configuration? This action is permanent (unless you delete the ejected files).',
    default: false,
  })
  .then(shouldEject => {
    if (!shouldEject) {
      console.log(cyan('Close one! Eject aborted.'));
      process.exit(1);
    }

    console.log('Ejecting Configuration...');

    var ownPath = path.join(__dirname, '..');
    var appPath = fs.realpathSync(process.cwd());

    function verifyAbsent(file) {
      if (fs.existsSync(path.join(appPath, file))) {
        console.error(
          '`' +
            file +
            '` already exists in your app folder. We cannot ' +
            'continue as you would lose all the changes in that file or directory. ' +
            'Please move or delete it (maybe make a copy for backup) and run this ' +
            'command again.'
        );
        process.exit(1);
      }
    }

    var folder = 'config';
    verifyAbsent(folder);

    var fuseConfigFile = 'fuse.config.js';
    var fuseConfigPath = path.resolve(__dirname, '../config', fuseConfigFile);
    var targetPath = path.join(appPath, folder);

    // OVERRIDE WITH LOCAL PACKAGE VERSION IF IT EXISTS
    if (fs.existsSync(path.join(paths.appConfig, fuseConfigFile)))
      fuseConfigPath = path.join(paths.appConfig, fuseConfigFile);

    // Ensure that the app folder is clean and we won't override any files

    // Copy the files over
    fs.mkdirSync(targetPath);

    console.log();
    console.log(cyan('Copying file into ' + targetPath));

    console.log('  Adding ' + cyan(fuseConfigPath) + ' to the project');
    var content =
      fs
        .readFileSync(fuseConfigPath, 'utf8')
        // Remove dead code from .js files on eject
        .replace(
          /\/\/ @remove-on-eject-begin([\s\S]*?)\/\/ @remove-on-eject-end/gm,
          ''
        )
        // Remove dead code from .applescript files on eject
        .replace(
          /-- @remove-on-eject-begin([\s\S]*?)-- @remove-on-eject-end/gm,
          ''
        )
        .trim() + '\n';
    fs.writeFileSync(path.join(targetPath, fuseConfigFile), content);

    const appPackage = require(path.join(appPath, 'package.json'));

    if (appPackage.directories && appPackage.directories.config) {
      console.log(
        `  Resetting ${cyan('config')} in package.json ${cyan(
          'directories'
        )} to default`
      );
      appPackage.directories.config = 'config';

      fs.writeFileSync(
        path.join(appPath, 'package.json'),
        JSON.stringify(appPackage, null, 2) + os.EOL
      );
    }

    console.log();
    console.log(green('Ejected successfully!'));
    console.log();

    console.log();
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
