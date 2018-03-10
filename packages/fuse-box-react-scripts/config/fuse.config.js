// @remove-on-eject-begin
/**
 * Copyright (c) 2018-present, OffGrid Networks
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file of npm fuse-box-create-react-app
 */
// @remove-on-eject-end
const {
  FuseBox,
  EnvPlugin,
  BabelPlugin,
  SVGPlugin,
  /* LESSPlugin, Add LESS, SASS, etc here if needed */
  CSSPlugin,
  JSONPlugin,
  QuantumPlugin,
  WebIndexPlugin,
  Sparky,
} = require('fuse-box');

const path = require('path'),
  express = require('express');

exports.babelConfig = function({ paths }) {
  const isProduction = process.env.NODE_ENV == 'production';
  const isTest = process.env.NODE_ENV == 'test';
  const isDevelopment = process.env.NODE_ENV == 'development';

  return {
    sourceMaps: !isProduction,
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'entry',
          modules: 'commonjs',
          targets: isTest
            ? { node: '6.12' }
            : {
                browsers: require(paths.appPackageJson).browserslist[
                  isProduction ? 'production' : 'development'
                ],
              },
        },
      ],
      ['@babel/preset-react', { development: !isProduction }],
    ],
    plugins: [
      '@babel/plugin-transform-destructuring',
      '@babel/plugin-proposal-class-properties',
      ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
      ['@babel/plugin-transform-react-jsx', { useBuiltIns: true }],
      [
        '@babel/plugin-transform-runtime',
        { helpers: false, polyfill: false, regenerator: true },
      ],
      ['@babel/plugin-transform-regenerator', { async: !isTest }],
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-decorators',
      '@babel/plugin-proposal-function-bind',
    ],
  };
};

exports.initBuilder = function({
  paths,
  srcDir,
  targetDir,
  staticDirs,
  port,
  env,
  component,
  componentdocs,
}) {
  let fuse, app, vendor;

  const isProduction = process.env.NODE_ENV == 'production';
  const isTest = process.env.NODE_ENV == 'test';
  const isDevelopment = process.env.NODE_ENV == 'development';

  Sparky.task('config', () => {
    fuse = new FuseBox({
      homeDir: srcDir,
      sourceMaps: isProduction ? false : { project: true, vendor: false },
      hash: isProduction && !component && !componentdocs,
      cache: !isProduction,
      output: path.join(
        targetDir,
        componentdocs ? paths.Bundle : '',
        '$name.js'
      ),
      target: isProduction ? 'browser@es5' : 'browser@es2015',
      plugins: [
        EnvPlugin(env),
        SVGPlugin(),
        /* [LESSPlugin(), CSSPlugin()],  Add LESS, SASS, etc here if needed */
        CSSPlugin(),
        JSONPlugin(),
        !component &&
          !componentdocs &&
          WebIndexPlugin({
            template: path.join(srcDir, 'index.html'),
            path: './',
          }),
        BabelPlugin(exports.babelConfig({ paths })),
        isProduction &&
          !component &&
          !componentdocs &&
          QuantumPlugin({ removeExportsInterop: false, uglify: true }),
      ],
    });
    if (componentdocs) {
      vendor = fuse
        .bundle('manager')
        .instructions('> __stories__/.storybook/index.js');
      app = fuse.bundle('preview').instructions('> __stories__/index.js');
    } else if (component) {
      app = fuse.bundle('index').instructions('!> [index.js]');
    } else {
      vendor = fuse.bundle('vendor').instructions('~ index.js');
      app = fuse.bundle('app').instructions('!> [index.js]');
      /* Replace above two lines with below if single bundle preferred
          app = fuse
         .bundle('app')
         .instructions('> index.js');   */
    }
  });

  Sparky.task('default', () => null);

  Sparky.task('static', () => {
    const watchPaths = Array.isArray(staticDirs)
      ? staticDirs.map(pathPublic => pathPublic + '/**/*')
      : staticDirs + '/**/*';

    const publicArray = Array.isArray(staticDirs) ? staticDirs : [staticDirs];

    return Sparky.watch(watchPaths).file(``, file => {
      let root = publicArray.find(
        element => file.root.substr(0, element.length) == element
      );
      let relativePath = root ? path.relative(root, file.root) : '';
      file.copy(path.join(targetDir, relativePath));
    });
  });

  Sparky.task('dev', ['config', 'static'], async () => {
    fuse.dev({ root: false, port: port }, server => {
      const app = server.httpServer.app;
      app.use(express.static(targetDir));
      app.get('*', function(req, res) {
        res.sendFile(path.resolve(targetDir, 'index.html'));
      });
    });
    app.watch().hmr();
    return fuseRun();
  });

  Sparky.task('dist', ['config', 'static'], () => {
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
