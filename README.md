# pickadate v3.0.0-alpha [![pickadate build status](https://travis-ci.org/amsul/pickadate.js.png?branch=time-picker)](https://travis-ci.org/amsul/pickadate.js)

The mobile-friendly, responsive, and lightweight jQuery date & time input picker.



#### To get started, check out the:

[Homepage](http://amsul.github.io/pickadate.js) - [Date picker](http://amsul.github.io/pickadate.js/date.htm) - [Time picker](http://amsul.github.io/pickadate.js/time.htm) - [API]({http://amsul.github.io/pickadate.js/api.htm)


#### To get it:

[Download v3.0.0-alpha](https://github.com/amsul/pickadate.js/archive/v3.0.0.zip) or `git clone git://github.com/amsul/pickadate.js.git` or `bower install pickadate`




<br>
## Upgrading from v2 to v3

The v3 API is significantly different from v2 (all for the greater good!). So if you’re upgrading to v3, make sure to read the [changelog](https://github.com/amsul/pickadate.js/blob/v3.0.0/CHANGELOG.md).





<br>
## Library files

The `lib` folder includes all the compiled library files as well as a `compressed` folder with the minified counter-parts.

### Pickers

There are currently two pickers: **date** and **time**.

File                    | Contents                 | Size (min & gzip)
----------------------- | ------------------------ | ----------------------
`picker.js`             | Base __*__               | 1.16kb
`picker.date.js`        | Date picker              | 1.91kb
`picker.time.js`        | Time picker              | 1.37kb

__*__ The base script is **required** for any of the pickers to function.

_To support old browsers, namely IE8, **also include** the `legacy.js` file._


### Themes

All themes are [generated using Sass](#sass-styling) and compiled into the `themes` folder.

File                    | Contents                 | Size (min & gzip)
----------------------- | ------------------------ | ----------------------
`default.css`           | Base __*__               | 0.43kb
`classic.css`           | Base __*__               | 0.43kb
`inline.css`            | Base __*__               | 0.43kb
`picker.date.css`       | Date picker              | 0.70kb
`picker.time.css`       | Time picker              | 0.34kb

__*__ Only one base stylesheet is **required**. Check out the [demos](http://amsul.github.io/pickadate.js/themes.htm) to choose one.

### Translations

The translations are copied into the `translations` folder. There are currently [30 languages](https://github.com/amsul/pickadate.js/blob/v3.0.0/lib/translations) included.


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

Before opening a new issue, search the [Issues](https://github.com/amsul/pickadate.js/issues) to see if anything similar already exists - there might already be an answer to your problem. You might also wanna check out the [Contributing](https://github.com/amsul/pickadate.js/blob/v3.0.0/CONTRIBUTING.md) guide.





<br>
## Contributing

Before contributing any code to the project, please take a look at the [Contributing](https://github.com/amsul/pickadate.js/blob/v3.0.0/CONTRIBUTING.md) guide.




<br>
## Building with Grunt

[Grunt](http://gruntjs.com/) `~0.4.1` is used to build the project files. To get started, clone the project and then run:

- `npm install` to get the required node modules.
- `grunt --verbose` to confirm you have all the dependencies.


Read the Gruntfile to see the build tasks and relative directories of the source files.




<br>
<a name="sass-styling"></a>
## Styling with Sass

The picker themes are built using [Sass](http://sass-lang.com/) with Grunt. To customize the CSS output, read the `_variables.scss` file in the `_source/lib/themes` folder. You can specify:

- colors for the theme,
- sizes for the picker,
- media-query breakpoints,
- and a whole bunch of other stuff.


After making any changes, run `grunt sass:themes` to compile it into CSS.





<br><br>

---

© 2013 [Amsul](http://twitter.com/amsul_)

Licensed under [MIT](http://amsul.ca/MIT).