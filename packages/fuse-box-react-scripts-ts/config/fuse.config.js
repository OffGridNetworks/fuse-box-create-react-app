/**
 * Copyright (c) 2018-present, OffGrid Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file of npm fuse-box-create-react-app
 */
const {
  FuseBox,
  EnvPlugin,
  SVGPlugin,
  /* LESSPlugin, Add LESS, SASS, etc here if needed */
  CSSPlugin,
  JSONPlugin,
  QuantumPlugin,
  WebIndexPlugin,
  Sparky,
} = require('fuse-box');

const path = require('path');
let fuse, app, vendor, isProduction, isTest;

exports.initBuilder = function({ paths, srcDir, targetDir, port, env }) {
  Sparky.task('config', () => {
    fuse = new FuseBox({
      homeDir: srcDir,
      sourceMaps: isProduction ? false : { project: true, vendor: false },
      hash: isProduction,
      cache: !isProduction,
      output: path.join(targetDir, '$name.js'),
      target: isProduction ? 'browser@es5' : 'browser@es2015',
      plugins: [
        EnvPlugin(env),
        SVGPlugin(),
        /* [LESSPlugin(), CSSPlugin()],  Add LESS, SASS, etc here if needed */
        CSSPlugin(),
        JSONPlugin(),
        WebIndexPlugin({
          template: path.join(srcDir, 'index.html'),
          path: './',
        }),
        isProduction &&
          QuantumPlugin({ removeExportsInterop: false, uglify: true }),
      ],
    });
    vendor = fuse.bundle('vendor').instructions('~ index.tsx');
    app = fuse.bundle('app').instructions('!> [index.tsx]');
    /* Replace above two lines with below if single bundle preferred
        app = fuse
       .bundle('app')
       .instructions('> index.tsx');   */
  });

  Sparky.task('default', () => null);

  Sparky.task('static', () => {
    const watchPaths = Array.isArray(paths.appPublic)
      ? paths.appPublic.map(pathPublic => pathPublic + '/**/*')
      : paths.appPublic + '/**/*';

    const publicArray = Array.isArray(paths.appPublic)
      ? paths.appPublic
      : [paths.appPublic];

    return Sparky.watch(watchPaths).file(``, file => {
      let root = publicArray.find(
        element => file.root.substr(0, element.length) == element
      );
      let relativePath = root ? path.relative(root, file.root) : '';
      file.copy(path.join(targetDir, relativePath));
    });
  });

  Sparky.task('clean', () => Sparky.src(targetDir).clean(targetDir));

  Sparky.task('prod-env', ['clean'], () => {
    isProduction = true;
  });

  Sparky.task('dev', ['clean', 'config', 'static'], async () => {
    fuse.dev({ port: port });
    app.watch().hmr();
    return fuseRun();
  });

  Sparky.task('dist', ['prod-env', 'config', 'static'], () => {
    return fuseRun();
  });

  /** 
   * Helper function to run FuseBox with automatic build error trapping
   * */
  function fuseRun() {
    return new Promise((resolve, reject) => {
      let _error = console.error;
      let errors = false;

      console.error = function() {
        errors = true;
        _error(...arguments);
        setTimeout(() => {
          reject(new Error('Build errors occurred'));
        }, 2000);
      };

      return fuse.run().then(() => {
        console.error = _error;
        if (errors) return reject(new Error('Build errors occurred'));
        resolve(true);
      });
    });
  }

  return {
    start: function(tname) {
      return Sparky.start(tname);
    },
  };
};
