"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const babel = require("@babel/core");
require("@babel/parser");
const _babelPluginJsx = require("@babel/plugin-syntax-jsx");
const _babelPluginTypeScript = require("@babel/plugin-syntax-typescript");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const babel__namespace = /* @__PURE__ */ _interopNamespaceDefault(babel);
let babelPluginJsx = _babelPluginJsx;
let babelPluginTypeScript = _babelPluginTypeScript;
if (babelPluginJsx.default) {
  babelPluginJsx = babelPluginJsx.default;
}
if (babelPluginTypeScript.default) {
  babelPluginTypeScript = babelPluginTypeScript.default;
}
function parseAst(opts) {
  const babelPlugins = [
    babelPluginJsx,
    [
      babelPluginTypeScript,
      {
        isTSX: true
      }
    ]
  ];
  return babel__namespace.parse(opts.code, {
    plugins: babelPlugins,
    root: opts.root,
    filename: opts.filename,
    sourceMaps: true,
    sourceType: "module"
  });
}
exports.parseAst = parseAst;
//# sourceMappingURL=ast.cjs.map
