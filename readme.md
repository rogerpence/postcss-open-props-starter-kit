# PostCSS/Open Props starter kit

This repo provides a PostCSS/Open Props starter pack. It provides a ready-run project for creating CSS with some superb tools. 

* [PostCSS](https://postcss.org/) is a Node-powered CSS build tool that runs under NPM or PNPM. On its own, its just a pipeline processing engine that takes in CSS and spits out (slightly transformed) CSS. It's PostCSS plugins that give PostCSS its superpowers. More on why you need PostCSS in a bit. 
* [Open Props](https://open-props.style/) is billed as providing "supercharged CSS variables." At first this may make Open Props sound like an answer to a problem you don't have. That's what I thought at first--until I saw this [Kevin Powell video](https://www.youtube.com/watch?v=szPNMKZazzQ). With Open Props, you can easily create a powerful, consistent design system. 
* [PurgeCSS](https://purgecss.com/) removes unused CSS rules from your production CSS.
* [CSSNano](https://cssnano.co/) compresses your production CSS.

Project directory structure:

```
.
├── css-dev
│   └── src
│       └── css
│           ├── _resets.css
│           ├── _utilities.css
│           └── style.css
├── node_modules
├── public
│   ├── css
│   │   └── style.css
│   ├── images
│   ├── js
│   └── index.html
├── .gitignore
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
└── postcss.config.cjs
```

The `package.json` file:

```json
{
  "name": "postcss-setup",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "postcss:build": "postcss ./css-dev/src/css/style.css ---dir public/css --env production",
    "postcss:watch": "postcss ./css-dev/src/css/style.css ---dir public/css --watch --verbose --env development",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "cssnano": "^6.0.1",
    "postcss-import": "^15.1.0",
    "postcss-custom-media": "^10.0.0",
    "open-props": "^1.5.10",
    "postcss-jit-props": "^1.0.13",
    "@csstools/postcss-global-data": "^2.0.1",
    "@fullhuman/postcss-purgecss": "^5.0.0",
    "postcss": "^8.4.25",
    "postcss-cli": "^10.1.0"
  }
}
```

The `postcss.config.js` file:

```js
const cssnano = require("cssnano");
const openProps = require("open-props");
const postcssCustomMedia = require("postcss-custom-media");
const postcssGlobalData = require("@csstools/postcss-global-data");
const postcssImport = require("postcss-import");
const postcssJitProps = require("postcss-jit-props");

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
```





### PostCSS plugins

Although You can't define media query rules with CSS custom properties. 

[CSSNano](https://cssnano.co/) 

This plugin compresses the CSS during the production build. This repo uses CSSNano's default configuration. See the CSSNano docs for its configuration options. 

[Import](https://www.npmjs.com/package/postcss-import) 

CSS's intrinsic @import may cause performance issues (using blocked loads when fetching imported CSS files). I'm not really sure if that's still the case, but when [Steve Souders](https://www.amazon.com/gp/product/0596522304?ie=UTF8&tag=stevsoud-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0596522304) said [not to do it in 2009](https://www.stevesouders.com/blog/2009/04/09/dont-use-import/), I never looked back. The PostCSS Import plugin performs imports at build time, removing any doubt about CSS loading performance. The Import docs say this plugin should be first in the pipeline so that all other plugins are seeing the incoming CSS as a single file.

If the contents of `css-dev/src/css/style.css` is

```
@import "./_resets.css";
@import "./_utilities.css";
```

the import plugin pulls both of those files into the final CSS (the Import plugin supported nested imports) 

See the section below on the PostCSS build and watch processes. The command lines to those processes specify the root CSS file. 

[Custom Media](https://www.npmjs.com/package/postcss-custom-media) 

It's not possible to use CSS custom properties to define media query rules. However, there is an upcoming spec for this feature using a [@custom-media](https://www.w3.org/TR/mediaqueries-5/#custom-mq) rule. The Custom Media plugin provides this feature and it is very cool. With it, you get to define breakpoints in one place, and reference them all throughout your CSS. If you need to change a breakpoint, you change it one place. 

> Range selectors are now supported so media query range syntax below no longer requires a plugin. 

```css
@custom-media --md-n-below (width < 768px);
```

```css
@media (--md-n-below) {
    // Your media query CSS rules here    
}
```

> For a long time, CSS enhancements moved through the pipeline pretty slowly and several more plugins were necessary (such as nesting, color functions, range selectors). However, CSS has a fire lit under it and it is acquiring features very quickly. 

If you didn't want to use Open Props, the Import and Custom Media plugins are all you need. However, Open Props is highly recommened. 

[Open Props](https://open-props.style/)

The Open Props library provides many useful CSS custom properties around which you can build a great CSS design system.

[Just In Time Props](https://www.npmjs.com/package/postcss-jit-props)

The Open Props library provides a large list of CSS custom properties. The `Just In Time Props` plugin scans your CSS and includes only the Open Props customer properties your CSS uses.

[Global Data](https://www.npmjs.com/package/@csstools/postcss-global-data)

For some reason, the core Open Props configuration doesn't include its media-related rules.  The Global Data plugin pulls in the Open Props pulls those in (as shown below). This plugin should be in the pipline before the Just In Time Props plugin.

```
postcssGlobalData({
    files: ["node_modules://open-props/media.min.css"],
}),
```

[PurgeCSS](https://purgecss.com/)

Purge unused CSS from the production CSS produced with the PostCSS build step.

