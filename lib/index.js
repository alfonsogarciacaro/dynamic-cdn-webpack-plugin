'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _readPkgUp = require('read-pkg-up');

var _readPkgUp2 = _interopRequireDefault(_readPkgUp);

var _htmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

var _htmlWebpackIncludeAssetsPlugin2 = _interopRequireDefault(_htmlWebpackIncludeAssetsPlugin);

var _ExternalModule = require('webpack/lib/ExternalModule');

var _ExternalModule2 = _interopRequireDefault(_ExternalModule);

var _resolvePkg = require('resolve-pkg');

var _resolvePkg2 = _interopRequireDefault(_resolvePkg);

var _includes = require('babel-runtime/core-js/array/includes');

var _includes2 = _interopRequireDefault(_includes);

var _getResolver = require('./get-resolver');

var _getResolver2 = _interopRequireDefault(_getResolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HtmlWebpackPlugin = void 0;
try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    HtmlWebpackPlugin = require('html-webpack-plugin');
} catch (err) {
    HtmlWebpackPlugin = null;
}

var moduleRegex = /^((?:@[a-z0-9][\w-.]+\/)?[a-z0-9][\w-.]*)/;

var DynamicCdnWebpackPlugin = function () {
    function DynamicCdnWebpackPlugin() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$disable = _ref.disable,
            disable = _ref$disable === undefined ? false : _ref$disable,
            env = _ref.env,
            exclude = _ref.exclude,
            only = _ref.only,
            verbose = _ref.verbose,
            resolver = _ref.resolver,
            useOriginalContext = _ref.useOriginalContext;

        (0, _classCallCheck3.default)(this, DynamicCdnWebpackPlugin);

        if (exclude && only) {
            throw new Error('You can\'t use \'exclude\' and \'only\' at the same time');
        }

        this.disable = disable;
        this.env = env || process.env.NODE_ENV || 'development';
        this.exclude = exclude || [];
        this.only = only || null;
        this.verbose = verbose === true;
        this.resolver = (0, _getResolver2.default)(resolver);
        this.useOriginalContext = useOriginalContext;

        this.modulesFromCdn = {};
    }

    (0, _createClass3.default)(DynamicCdnWebpackPlugin, [{
        key: 'apply',
        value: function apply(compiler) {
            if (!this.disable) {
                if (this.useOriginalContext) {
                    this.originalContext = compiler.context;
                }
                this.execute(compiler, { env: this.env });
            }

            var isUsingHtmlWebpackPlugin = HtmlWebpackPlugin != null && compiler.options.plugins.some(function (x) {
                return x instanceof HtmlWebpackPlugin;
            });

            if (isUsingHtmlWebpackPlugin) {
                this.applyHtmlWebpackPlugin(compiler);
            } else {
                this.applyWebpackCore(compiler);
            }
        }
    }, {
        key: 'execute',
        value: function execute(compiler, _ref2) {
            var _this = this;

            var env = _ref2.env;

            compiler.plugin('normal-module-factory', function (nmf) {
                nmf.plugin('factory', function (factory) {
                    return function () {
                        var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data, cb) {
                            var modulePath, contextPath, isModulePath, varName;
                            return _regenerator2.default.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            modulePath = data.dependencies[0].request;
                                            contextPath = _this.useOriginalContext ? _this.originalContext : data.context;
                                            isModulePath = moduleRegex.test(modulePath);

                                            if (isModulePath) {
                                                _context.next = 5;
                                                break;
                                            }

                                            return _context.abrupt('return', factory(data, cb));

                                        case 5:
                                            _context.next = 7;
                                            return _this.addModule(contextPath, modulePath, { env });

                                        case 7:
                                            varName = _context.sent;


                                            if (varName === false) {
                                                factory(data, cb);
                                            } else if (varName == null) {
                                                cb(null);
                                            } else {
                                                cb(null, new _ExternalModule2.default(varName, 'var', modulePath));
                                            }

                                        case 9:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this);
                        }));

                        return function (_x2, _x3) {
                            return _ref3.apply(this, arguments);
                        };
                    }();
                });
            });
        }
    }, {
        key: 'addModule',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(contextPath, modulePath, _ref4) {
                var _this2 = this;

                var env = _ref4.env;

                var isModuleExcluded, moduleName, _ref6, _ref6$pkg, version, peerDependencies, isModuleAlreadyLoaded, isSameVersion, cdnConfig, arePeerDependenciesLoaded;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                isModuleExcluded = (0, _includes2.default)(this.exclude, modulePath) || this.only && !(0, _includes2.default)(this.only, modulePath);

                                if (!isModuleExcluded) {
                                    _context2.next = 3;
                                    break;
                                }

                                return _context2.abrupt('return', false);

                            case 3:

                                if (this.useOriginalContext) {
                                    contextPath = this.originalContext;
                                }

                                moduleName = modulePath.match(moduleRegex)[1];
                                _context2.next = 7;
                                return (0, _readPkgUp2.default)({ cwd: (0, _resolvePkg2.default)(moduleName, { cwd: contextPath }) });

                            case 7:
                                _ref6 = _context2.sent;
                                _ref6$pkg = _ref6.pkg;
                                version = _ref6$pkg.version;
                                peerDependencies = _ref6$pkg.peerDependencies;
                                isModuleAlreadyLoaded = Boolean(this.modulesFromCdn[modulePath]);

                                if (!isModuleAlreadyLoaded) {
                                    _context2.next = 17;
                                    break;
                                }

                                isSameVersion = this.modulesFromCdn[modulePath].version === version;

                                if (!isSameVersion) {
                                    _context2.next = 16;
                                    break;
                                }

                                return _context2.abrupt('return', this.modulesFromCdn[modulePath].var);

                            case 16:
                                return _context2.abrupt('return', false);

                            case 17:
                                _context2.next = 19;
                                return this.resolver(modulePath, version, { env });

                            case 19:
                                cdnConfig = _context2.sent;

                                if (!(cdnConfig == null)) {
                                    _context2.next = 23;
                                    break;
                                }

                                if (this.verbose) {
                                    console.log(`❌ '${modulePath}' couldn't be find, please add it to https://github.com/mastilver/module-to-cdn/blob/master/modules.json`);
                                }
                                return _context2.abrupt('return', false);

                            case 23:

                                if (this.verbose) {
                                    console.log(`✔️ '${cdnConfig.name}' will be served by ${cdnConfig.url}`);
                                }

                                if (!peerDependencies) {
                                    _context2.next = 32;
                                    break;
                                }

                                _context2.next = 27;
                                return _promise2.default.all((0, _keys2.default)(peerDependencies).map(function (peerDependencyName) {
                                    return _this2.addModule(contextPath, peerDependencyName, { env });
                                }));

                            case 27:
                                _context2.t0 = function (x) {
                                    return Boolean(x);
                                };

                                _context2.t1 = function (result, x) {
                                    return result && x;
                                };

                                arePeerDependenciesLoaded = _context2.sent.map(_context2.t0).reduce(_context2.t1, true);

                                if (arePeerDependenciesLoaded) {
                                    _context2.next = 32;
                                    break;
                                }

                                return _context2.abrupt('return', false);

                            case 32:

                                // TODO: on next breaking change, rely on module-to-cdn>=3.1.0 to get version
                                this.modulesFromCdn[modulePath] = (0, _assign2.default)({}, cdnConfig, { version });

                                return _context2.abrupt('return', cdnConfig.var);

                            case 34:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function addModule(_x4, _x5, _x6) {
                return _ref5.apply(this, arguments);
            }

            return addModule;
        }()
    }, {
        key: 'applyWebpackCore',
        value: function applyWebpackCore(compiler) {
            var _this3 = this;

            compiler.plugin('after-compile', function (compilation, cb) {
                var entrypoint = compilation.entrypoints[(0, _keys2.default)(compilation.entrypoints)[0]];
                var parentChunk = entrypoint.chunks.find(function (x) {
                    return x.isInitial();
                });

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(_this3.modulesFromCdn)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var name = _step.value;

                        var cdnConfig = _this3.modulesFromCdn[name];

                        var chunk = compilation.addChunk(name);
                        chunk.files.push(cdnConfig.url);

                        chunk.parents = [parentChunk];
                        parentChunk.addChunk(chunk);
                        entrypoint.insertChunk(chunk, parentChunk);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                cb();
            });
        }
    }, {
        key: 'applyHtmlWebpackPlugin',
        value: function applyHtmlWebpackPlugin(compiler) {
            var _this4 = this;

            var includeAssetsPlugin = new _htmlWebpackIncludeAssetsPlugin2.default({
                assets: [],
                publicPath: '',
                append: false
            });

            includeAssetsPlugin.apply(compiler);

            compiler.plugin('after-compile', function (compilation, cb) {
                var assets = (0, _keys2.default)(_this4.modulesFromCdn).map(function (key) {
                    return _this4.modulesFromCdn[key].url;
                });

                // HACK: Calling the constructor directly is not recomended
                //       But that's the only secure way to edit `assets` afterhand
                includeAssetsPlugin.constructor({
                    assets,
                    publicPath: '',
                    append: false
                });

                cb();
            });
        }
    }]);
    return DynamicCdnWebpackPlugin;
}();

exports.default = DynamicCdnWebpackPlugin;