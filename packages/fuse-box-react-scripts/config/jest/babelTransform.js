// @remove-on-eject-begin
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const babelJest = require('babel-jest');
const babelConfig = require('../fuse.config.js').babelConfig;
const paths = require('../paths.js');

module.exports = babelJest.createTransformer(babelConfig({ paths }));
