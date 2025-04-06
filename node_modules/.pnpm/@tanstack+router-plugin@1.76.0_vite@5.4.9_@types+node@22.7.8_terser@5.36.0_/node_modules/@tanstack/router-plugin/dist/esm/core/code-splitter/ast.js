import * as babel from "@babel/core";
import "@babel/parser";
import _babelPluginJsx from "@babel/plugin-syntax-jsx";
import _babelPluginTypeScript from "@babel/plugin-syntax-typescript";
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
  return babel.parse(opts.code, {
    plugins: babelPlugins,
    root: opts.root,
    filename: opts.filename,
    sourceMaps: true,
    sourceType: "module"
  });
}
export {
  parseAst
};
//# sourceMappingURL=ast.js.map
