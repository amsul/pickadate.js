# pickadate v3.5.4 [![pickadate build status](https://travis-ci.org/amsul/pickadate.js.svg?branch=gh-pages)](https://travis-ci.org/amsul/pickadate.js) [![pickadate dev dependencies status](https://david-dm.org/amsul/pickadate.js/dev-status.svg)](https://david-dm.org/amsul/pickadate.js#info=devDependencies)

The mobile-friendly, responsive, and lightweight jQuery date & time input picker.



#### To get started, check out the:

[Homepage](http://amsul.github.io/pickadate.js) - [Date picker](http://amsul.github.io/pickadate.js/date.htm) - [Time picker](http://amsul.github.io/pickadate.js/time.htm) - [API](http://amsul.github.io/pickadate.js/api.htm)


#### To get it:

[Download v3.5.4](https://github.com/amsul/pickadate.js/archive/3.5.4.zip) or `git clone git://github.com/amsul/pickadate.js.git` or `bower install pickadate`




<br>
## Upgrading from v2 to v3

The v3 API is significantly different from v2 (all for the greater good!). So if you’re upgrading to v3, make sure to read the [changelog](https://github.com/amsul/pickadate.js/blob/gh-pages/CHANGELOG.md).





<br>
## Library files

The `lib` folder includes the library files with a `compressed` folder containing the minified counter-parts. These files are minified using [Grunt](#building-with-grunt).

### Pickers

There are currently two pickers: **date** and **time**.

File                    | Contents                 | Size (min & gzip)
----------------------- | ------------------------ | ----------------------
`picker.js`             | __Base *__               | 1.76kb
`picker.date.js`        | Date picker              | 2.67kb
`picker.time.js`        | Time picker              | 1.92kb

__*__ The base script is **required** for any of the pickers to function.

_To support old browsers, namely IE8, **also include** the `legacy.js` file._


### Themes

All themes are [generated using LESS](#less-styling) and compiled from the `lib/themes-source` folder into the `lib/themes` folder.

File                    | Contents                     | Size (min & gzip)
----------------------- | ---------------------------- | ----------------------
`default.css`           | __Base default *__           | 0.49kb
`default.date.css`      | Default date picker          | 0.75kb
`default.time.css`      | Default time picker          | 0.35kb
`classic.css`           | __Base classic *__           | 0.39kb
`classic.date.css`      | Classic date picker          | 0.75kb
`classic.time.css`      | Classic time picker          | 0.35kb
`rtl.css`               | __RTL language stylings **__ | 0.10kb

__*__ One and only one base stylesheet is **required**. [Choose a theme](http://amsul.github.io/pickadate.js#menu) then include the respective pickers as well.

__**__ For languages with text flowing from right-to-left, also include the `rtl.css` stylesheet.

### Translations

The translations live in the `lib/translations` folder. There are currently [39 language translations](https://github.com/amsul/pickadate.js/blob/3.5.4/lib/translations) included.




<br>
## Building with Grunt

[Grunt](http://gruntjs.com/) `~0.4.5` is used to build the project files. To get started, clone the project and then run:

- `npm install` to get the required node modules.
- `grunt --verbose` to confirm you have all the dependencies.


Read the Gruntfile to see the build tasks and relative directories of the source files.




<br>
<a name="less-styling"></a>
## Styling with LESS

The picker themes are built using [LESS](http://lesscss.org/) with Grunt. To customize the CSS output, read the `_variables.less` file in the `lib/themes-source` folder. You can specify:

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

Before opening a new issue, please search the existing [Issues](https://github.com/amsul/pickadate.js/issues) for anything similar – there might already be an answer to your problem. You might also wanna check out the [Contributing](https://github.com/amsul/pickadate.js/blob/gh-pages/CONTRIBUTING.md) guide.





<br>
## Contributing

Before contributing any code to the project, please take a look at the [Contributing](https://github.com/amsul/pickadate.js/blob/gh-pages/CONTRIBUTING.md) guide.





<br>
## Support

If you find this library useful and would like to see further development, consider [supporting it](http://selz.co/1g80kCZ).





<br><br>

---

© 2014 [Amsul](http://twitter.com/amsul_)

Licensed under [MIT](http://amsul.ca/MIT)