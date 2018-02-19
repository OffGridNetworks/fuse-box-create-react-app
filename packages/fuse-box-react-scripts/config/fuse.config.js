// @remove-on-eject-begin
/**
 * Copyright (c) 2018-present, OffGrid Networks
 *  ADDED FOR FUSE-BOX-REACT-SCRIPTS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
const {
  FuseBox,
  EnvPlugin,
  BabelPlugin,
  SVGPlugin,
  CSSPlugin,
  QuantumPlugin,
  WebIndexPlugin,
  Sparky,
} = require('fuse-box');
const path = require('path');
let fuse, app, vendor, isProduction;

exports.initBuilder = function({ paths, srcDir, targetDir, port, env }) {
  Sparky.task('config', () => {
    fuse = new FuseBox({
      homeDir: srcDir,
      sourceMaps: !isProduction,
      hash: isProduction,
      cache: !isProduction,
      target: 'browser@es5',
      output: path.join(targetDir, '$name.js'),
      plugins: [
        EnvPlugin(env),
        SVGPlugin(),
        CSSPlugin(),
        WebIndexPlugin({
          template: path.join(srcDir, 'index.html'),
          path: './',
        }),
        BabelPlugin({
          sourceMaps: !isProduction,
          presets: ['react', 'env'],
          plugins: [
            'transform-decorators-legacy',
            'transform-function-bind',
            'transform-object-rest-spread',
            'transform-class-properties',
          ],
        }),
        isProduction &&
          QuantumPlugin({ removeExportsInterop: false, uglify: true }),
      ],
    });
    vendor = fuse.bundle('vendor').instructions('~ index.js');
    app = fuse.bundle('app').instructions('!> [index.js]');
  });

  Sparky.task('default', () => null);

  Sparky.task('dev', ['clean', 'config', 'static'], () => {
    fuse.dev({ port: port });
    app.watch().hmr();
    return fuse.run();
  });

  Sparky.task('static', () => {
    if (Array.isArray(paths.appPublic)) {
      return Promise.all(
        paths.appPublic.map(function(pathPublic) {
          return Sparky.watch(pathPublic + '/**/*').dest(targetDir);
        })
      );
    } else {
      return Sparky.watch(paths.appPublic + '/**/*').dest(targetDir);
    }
  });

  Sparky.task('clean', () => Sparky.src(targetDir).clean(targetDir));

  Sparky.task('prod-env', ['clean'], () => {
    isProduction = true;
  });

  Sparky.task('dist', ['prod-env', 'config', 'static'], () => {
    return fuse.run();
  });

  return {
    start: function(tname) {
      return Sparky.start(tname);
    },
  };
};
