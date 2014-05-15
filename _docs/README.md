# {%= pkg.name %} v{%= pkg.version %} [![{%= pkg.name %} build status](https://travis-ci.org/amsul/pickadate.js.svg?branch=gh-pages)](https://travis-ci.org/amsul/pickadate.js) [![{%= pkg.name %} dev dependencies status](https://david-dm.org/amsul/pickadate.js/dev-status.svg)](https://david-dm.org/amsul/pickadate.js#info=devDependencies)

{%= pkg.description %}

{%
    fileSize_js_core = meta.fileSize( grunt.file.read( dirs.lib.min + '/picker.js') )
    fileSize_js_date = meta.fileSize( grunt.file.read( dirs.lib.min + '/picker.date.js') )
    fileSize_js_time = meta.fileSize( grunt.file.read( dirs.lib.min + '/picker.time.js') )
    fileSize_css_default = meta.fileSize( grunt.file.read( dirs.themes.min + '/default.css') )
    fileSize_css_classic = meta.fileSize( grunt.file.read( dirs.themes.min + '/classic.css') )
    fileSize_css_default_date = meta.fileSize( grunt.file.read( dirs.themes.min + '/default.date.css') )
    fileSize_css_default_time = meta.fileSize( grunt.file.read( dirs.themes.min + '/default.time.css') )
    fileSize_css_classic_date = meta.fileSize( grunt.file.read( dirs.themes.min + '/classic.date.css') )
    fileSize_css_classic_time = meta.fileSize( grunt.file.read( dirs.themes.min + '/classic.time.css') )
    fileSize_css_rtl = meta.fileSize( grunt.file.read( dirs.themes.min + '/rtl.css') )
%}

#### To get started, check out the:

[Homepage]({%= pkg.homepage %}) - [Date picker]({%= pkg.homepage %}/date.htm) - [Time picker]({%= pkg.homepage %}/time.htm) - [API]({%= pkg.homepage %}/api.htm)


#### To get it:

[Download v{%= pkg.version %}]({%= meta.gitrepo_url %}/archive/{%= pkg.version %}.zip) or `git clone git://github.com/amsul/pickadate.js.git` or `bower install pickadate`




<br>
## Upgrading from v2 to v3

The v3 API is significantly different from v2 (all for the greater good!). So if you’re upgrading to v3, make sure to read the [changelog]({%= meta.gitrepo_url %}/blob/gh-pages/CHANGELOG.md).





<br>
## Library files

The `{%= dirs.lib.src %}` folder includes the library files with a `compressed` folder containing the minified counter-parts. These files are minified using [Grunt](#building-with-grunt).

### Pickers

There are currently two pickers: **date** and **time**.

File                    | Contents                 | Size (min & gzip)
----------------------- | ------------------------ | ----------------------
`picker.js`             | __Base *__               | {%= (fileSize_js_core.gzip/1024).toFixed(2) %}kb
`picker.date.js`        | Date picker              | {%= (fileSize_js_date.gzip/1024).toFixed(2) %}kb
`picker.time.js`        | Time picker              | {%= (fileSize_js_time.gzip/1024).toFixed(2) %}kb

__*__ The base script is **required** for any of the pickers to function.

_To support old browsers, namely IE8, **also include** the `legacy.js` file._


### Themes

All themes are [generated using LESS](#less-styling) and compiled from the `{%= dirs.themes.src %}` folder into the `{%= dirs.themes.dest %}` folder.

File                    | Contents                     | Size (min & gzip)
----------------------- | ---------------------------- | ----------------------
`default.css`           | __Base default *__           | {%= (fileSize_css_default.gzip/1024).toFixed(2) %}kb
`default.date.css`      | Default date picker          | {%= (fileSize_css_default_date.gzip/1024).toFixed(2) %}kb
`default.time.css`      | Default time picker          | {%= (fileSize_css_default_time.gzip/1024).toFixed(2) %}kb
`classic.css`           | __Base classic *__           | {%= (fileSize_css_classic.gzip/1024).toFixed(2) %}kb
`classic.date.css`      | Classic date picker          | {%= (fileSize_css_classic_date.gzip/1024).toFixed(2) %}kb
`classic.time.css`      | Classic time picker          | {%= (fileSize_css_classic_time.gzip/1024).toFixed(2) %}kb
`rtl.css`               | __RTL language stylings **__ | {%= (fileSize_css_rtl.gzip/1024).toFixed(2) %}kb

__*__ One and only one base stylesheet is **required**. [Choose a theme]({%= pkg.homepage %}#menu) then include the respective pickers as well.

__**__ For languages with text flowing from right-to-left, also include the `rtl.css` stylesheet.

### Translations

The translations live in the `{%= dirs.translations.src %}` folder. There are currently [{%= grunt.file.expand(dirs.translations.src + '/*.js').length %} language translations]({%= meta.gitrepo_url %}/blob/{%= pkg.version %}/lib/translations) included.




<br>
## Building with Grunt

[Grunt](http://gruntjs.com/) `~{%= grunt.version %}` is used to build the project files. To get started, clone the project and then run:

- `npm install` to get the required node modules.
- `grunt --verbose` to confirm you have all the dependencies.


Read the Gruntfile to see the build tasks and relative directories of the source files.




<br>
<a name="less-styling"></a>
## Styling with LESS

The picker themes are built using [LESS](http://lesscss.org/) with Grunt. To customize the CSS output, read the `_variables.less` file in the `{%= dirs.themes.src %}` folder. You can specify:

- colors for the theme,
- sizes for the picker,
- media-query breakpoints,
- and a whole bunch of other stuff.


After making any changes, run `grunt less:themes` to compile it into CSS.



<br>
## Versioning

To maintain some consistency in the sort of changes to expect with version bumps, [Semantic Versioning guidelines](http://semver.org/) will now be followed as closely as possible:

`<major>.<minor>.<patch>`

Constructed as such:

- `major`: breaks backward compatibility (resets the `minor` and `patch`)
- `minor`: new additions with backward compatibility (resets the `patch`)
- `patch`: bug fixes and misc changes





<br>
## Bugs

Before opening a new issue, please search the existing [Issues]({%= pkg.bugs %}) for anything similar – there might already be an answer to your problem. You might also wanna check out the [Contributing]({%= meta.gitrepo_url %}/blob/gh-pages/CONTRIBUTING.md) guide.





<br>
## Contributing

Before contributing any code to the project, please take a look at the [Contributing]({%= meta.gitrepo_url %}/blob/gh-pages/CONTRIBUTING.md) guide.





<br>
## Support

If you find this library useful and would like to see further development, consider [supporting it](http://selz.co/1g80kCZ).





<br><br>

---

© {%= grunt.template.date('yyyy') %} [Amsul](http://twitter.com/amsul_)

Licensed under [{%= pkg.licenses[0].type %}]({%= pkg.licenses[0].url %})