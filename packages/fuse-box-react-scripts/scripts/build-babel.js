// @remove-on-eject-begin
/**
 * Copyright (c) 2017-present, OffGrid Networks
 * ADDED FOR FUSE-BOX-REACT-SCRIPTS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end

const uniq = require('lodash/uniq'),
  glob = require('glob'),
  slash = require('slash'),
  path = require('path'),
  defaults = require('lodash/defaults'),
  fs = require('fs'),
  readdir = require('fs-readdir-recursive'),
  babel = require('@babel/core'),
  minimatch = require('minimatch'),
  includes = require('lodash/includes');

var default_options = {
  extensions: ['.js', '.jsx', '.es6', '.es'],
  copyFiles: true,
  BABEL_ENV: 'production',
  outDir: './dist',
  srcExcludes: ['**/__stories__/**/*'],
  sourceMaps: false,
  presets: ['es2015', 'react'],
};

var options,
  opts = {};

module.exports = function build(build_options) {
  options = defaults(build_options, default_options);

  Object.keys(babel.options).forEach(function(key) {
    const opt = babel.options[key];
    if (options[key] !== undefined && options[key] !== opt.default) {
      opts[key] = options[key];
    }
  });

  process.env.BABEL_ENV = options.BABEL_ENV;

  handle(options.homeDir);

  return Promise.resolve(true);
};

function write(src, relative) {
  if (!util.isCompilableExtension(relative, options.extensions)) return false;

  // remove extension and then append back on .js
  relative = relative.replace(/\.(\w*?)$/, '') + '.js';

  const dest = path.join(options.outDir, relative);

  const data = util.compile(
    src,
    defaults(
      {
        sourceFileName: slash(path.relative(dest + '/..', src)),
        sourceMapTarget: path.basename(relative),
      },
      opts
    )
  );

  if (!data) return false;

  // we've requested explicit sourcemaps to be written to disk
  if (data.map && options.sourceMaps && options.sourceMaps !== 'inline') {
    const mapLoc = dest + '.map';
    data.code = util.addSourceMappingUrl(data.code, mapLoc);
    fs.writeFileSync(mapLoc, JSON.stringify(data.map));
  }

  fs.writeFileSync(dest, data.code);
  util.chmod(src, dest);

  util.log(src + ' -> ' + dest);

  return true;
}

function handleFile(src, filename) {
  var fullPath = path.join(src, filename);

  var include = options.srcExcludes.reduce(function(include, pattern) {
    return include && !minimatch(fullPath, pattern);
  }, true);

  if (include) {
    const didWrite = write(src, filename);

    if (!didWrite && options.copyFiles) {
      const dest = path.join(options.outDir, filename);
      fs.writeFileSync(dest, fs.readFileSync(src));
      util.chmod(src, dest);
    }
  }
}

function handle(filename) {
  if (!fs.existsSync(filename)) return;

  const stat = fs.statSync(filename);

  if (stat.isDirectory(filename)) {
    const dirname = filename;

    readdir(dirname).forEach(function(filename) {
      const src = path.join(dirname, filename);
      handleFile(src, filename);
    });
  } else {
    write(filename, filename);
  }
}

const util = {
  chmod: function chmod(src, dest) {
    fs.chmodSync(dest, fs.statSync(src).mode);
  },
  readdirFilter: function readdirFilter(filename) {
    return readdir(filename).filter(function(filename) {
      return babel.util.isCompilableExtension(filename);
    });
  },
  isCompilableExtension: function isCompilableExtension(filename, altExts) {
    const exts = altExts || babel.DEFAULT_EXTENSIONS;
    const ext = path.extname(filename);
    return includes(exts, ext);
  },
  addSourceMappingUrl: function addSourceMappingUrl(code, loc) {
    return code + '\n//# sourceMappingURL=' + path.basename(loc);
  },
  log: function log(msg) {
    console.log(msg);
  },
  transform: function transform(filename, code, opts) {
    opts = Object.assign({}, opts, {
      filename,
    });

    return babel.transform(code, opts);
  },
  compile: function compile(filename, opts) {
    try {
      return babel.transformFileSync(filename, opts);
    } catch (err) {
      throw err;
    }
  },
};

function toErrorStack(err) {
  if (err._babel && err instanceof SyntaxError) {
    return `${err.name}: ${err.message}\n${err.codeFrame}`;
  } else {
    return err.stack;
  }
}

process.on('uncaughtException', function(err) {
  console.error(toErrorStack(err));
  process.exit(1);
});
