// @remove-file-on-eject
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * Portions Copyright (c) 2016-present, OffGrid Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const spawn = require('react-dev-utils/crossSpawn');
const {
  defaultBrowsers,
} = require('fuse-box-react-scripts/scripts/utils/browsersHelper');
const os = require('os');

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function tryGitInit(appPath) {
  let didInit = false;
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', { stdio: 'ignore' });
    didInit = true;

    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit from Create React App"', {
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    if (didInit) {
      // If we successfully initialized but couldn't commit,
      // maybe the commit author config is not set.
      // In the future, we might supply our own committer
      // like Ember CLI does, but for now, let's just
      // remove the Git files to avoid a half-done state.
      try {
        // unlinkSync() doesn't work on directories.
        fs.removeSync(path.join(appPath, '.git'));
      } catch (removeErr) {
        // Ignore.
      }
    }
    return false;
  }
}

module.exports = function(
  appPath,
  appName,
  verbose,
  originalDirectory,
  template
) {
  const ownPackageName = require(path.join(__dirname, '..', 'package.json'))
    .name;
  const ownPath = path.join(appPath, 'node_modules', ownPackageName);
  const appPackage = require(path.join(appPath, 'package.json'));
  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));

  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {};

  // Setup the script rules
  appPackage.scripts = {
    start: ownPackageName + ' start',
    build: ownPackageName + ' build',
    test: ownPackageName + ' test --env=jsdom',
    eject: ownPackageName + ' eject',
    ejectconfig: ownPackageName + ' ejectconfig',
  };

  appPackage.browserslist = defaultBrowsers;

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );

  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'));
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    );
  }

  // Copy the files for the user
  const templatePath = template
    ? path.resolve(originalDirectory, template)
    : path.join(ownPath, 'template');
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
    return;
  }

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  try {
    fs.moveSync(
      path.join(appPath, 'gitignore'),
      path.join(appPath, '.gitignore'),
      []
    );
  } catch (err) {
    // Append if there's already a `.gitignore` file there
    if (err.code === 'EEXIST') {
      const data = fs.readFileSync(path.join(appPath, 'gitignore'));
      fs.appendFileSync(path.join(appPath, '.gitignore'), data);
      fs.unlinkSync(path.join(appPath, 'gitignore'));
    } else {
      throw err;
    }
  }

  // ADDITIONAL FUSE-BOX START

  // Rename npmignore after the fact
  if (fs.existsSync(path.join(appPath, 'npmignore'))) {
    fs.move(
      path.join(appPath, 'npmignore'),
      path.join(appPath, '.npmignore'),
      [],
      function(err) {
        if (err) {
          // Append if there's already a `.npmignore` file there
          if (err.code === 'EEXIST') {
            var data = fs.readFileSync(path.join(appPath, 'npmignore'));
            fs.appendFileSync(path.join(appPath, '.npmignore'), data);
            fs.unlinkSync(path.join(appPath, 'npmignore'));
          } else {
            throw err;
          }
        }
      }
    );
  }

  // update bower.json
  var bowerPackagePath = path.join(appPath, 'bower.json');
  if (fs.existsSync(bowerPackagePath)) {
    console.log('Updating ' + chalk.cyan(bowerPackagePath));
    var bowerPackage = require(bowerPackagePath);
    bowerPackage.name = appPackage.name;
    bowerPackage.version = appPackage.version;

    fs.writeFileSync(
      path.join(bowerPackagePath),
      JSON.stringify(bowerPackage, null, 2) + os.EOL
    );
  }

  // Install additional package json entries devDependencies, if present
  const templatePackagePath = path.join(appPath, '.template.package.json');
  if (fs.existsSync(templatePackagePath)) {
    let mergePackage = require(templatePackagePath);

    Object.keys(mergePackage).forEach(function(key) {
      appPackage[key] = appPackage[key] || {};
      Object.assign(appPackage[key], mergePackage[key]);
    });

    fs.writeFileSync(
      path.join(appPath, 'package.json'),
      JSON.stringify(appPackage, null, 2) + os.EOL
    );
    fs.unlinkSync(templatePackagePath);
  }

  // Install additional own package json entries devDependencies, if present
  if (!template) {
    const ownPackagePath = path.resolve(__dirname, '..', 'package.json');
    let devDependencies = require(ownPackagePath).devDependencies;

    if (devDependencies) {
      Object.assign(appPackage.devDependencies, devDependencies);
    }

    fs.writeFileSync(
      path.join(appPath, 'package.json'),
      JSON.stringify(appPackage, null, 2) + os.EOL
    );
    fs.unlinkSync(ownPackagePath);
  }

  // ADDITIONAL FUSE-BOX END

  let command;
  let args;

  if (useYarn) {
    command = 'yarnpkg';
    if (!isReactInstalled(appPackage)) args.push('add', 'react', 'react-dom');
  } else {
    command = 'npm';
    args = ['install', verbose && '--verbose'].filter(e => e);
    if (!isReactInstalled(appPackage))
      args.push('--save', 'react', 'react-dom');
  }

  // Install additional template dependencies, if present;  prefer using .template.package.json above
  const templateDependenciesPath = path.join(
    appPath,
    '.template.dependencies.json'
  );
  if (fs.existsSync(templateDependenciesPath)) {
    const templateDependencies = require(templateDependenciesPath).dependencies;
    args = args.concat(
      Object.keys(templateDependencies).map(key => {
        return `${key}@${templateDependencies[key]}`;
      })
    );
    fs.unlinkSync(templateDependenciesPath);
  }

  console.log(`Installing remaining dependencies using using ${command}...`);
  console.log();

  const proc = spawn.sync(command, args, { stdio: 'inherit' });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    return;
  }

  if (tryGitInit(appPath)) {
    console.log();
    console.log('Initialized a git repository.');
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  // Change displayed command to yarn instead of yarnpkg
  const displayedCommand = useYarn ? 'yarn' : 'npm';

  console.log();
  console.log(`Success! Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log('    Starts the development server.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
  );
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}eject`)
  );
  console.log(
    '    Removes this tool and copies build dependencies, configuration files'
  );
  console.log(
    '    and scripts into the app directory. If you do this, you can’t go back!'
  );
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
  if (readmeExists) {
    console.log();
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`'
      )
    );
  }
  console.log();
  console.log('Happy hacking!');
};

function isReactInstalled(appPackage) {
  const dependencies = appPackage.dependencies || {};

  return (
    typeof dependencies.react !== 'undefined' &&
    typeof dependencies['react-dom'] !== 'undefined'
  );
}
