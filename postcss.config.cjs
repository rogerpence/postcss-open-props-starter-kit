const cssnano = require("cssnano");
const postcssImport = require("postcss-import");
const postcssCustomMedia = require("postcss-custom-media");
const openProps = require("open-props");
const postcssJitProps = require("postcss-jit-props");
const postcssGlobalData = require("@csstools/postcss-global-data");

const purgecss = require("@fullhuman/postcss-purgecss");

const DO_NOT_PRESERVE_UNRESOLVED_RULE = false;

module.exports = {
  plugins: [
    postcssImport(),
    postcssJitProps(openProps),
    postcssGlobalData({
      files: ["node_modules://open-props/media.min.css"],
    }),
    postcssCustomMedia({
      preserve: DO_NOT_PRESERVE_UNRESOLVED_RULE,
    }),

    ...(process.env.NODE_ENV === "production"
      ? [purgecss({ content: ["./public/**/*.html"] })]
      : []),

    ...(process.env.NODE_ENV === "production" ? [cssnano()] : []),
  ],
};
