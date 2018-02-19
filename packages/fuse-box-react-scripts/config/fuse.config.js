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
  /* LESSPlugin, */
  CSSPlugin,
  JSONPlugin,
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
      sourceMaps: isProduction ? false : { project: true, vendor: false },
      hash: isProduction,
      cache: !isProduction,
      output: path.join(targetDir, '$name.js'),
      target: 'browser@es5',
      plugins: [
        EnvPlugin(env),
        SVGPlugin(),
        /* [LESSPlugin(), CSSPlugin()], */
        CSSPlugin(),
        JSONPlugin(),
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
    /* app = fuse
      .bundle('app')
      .target('browser')
      .instructions('> index.js'); */
  });

  Sparky.task('default', () => null);

  Sparky.task('dev', ['clean', 'config', 'static'], () => {
    fuse.dev({ port: port });
    app.watch().hmr();
    return fuse.run();
  });

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

  Sparky.task('dist', ['prod-env', 'config', 'static'], () => {
    return fuse.run();
  });

  return {
    start: function(tname) {
      return Sparky.start(tname);
    },
  };
};
