# pickadate

The mobile-friendly, responsive, and lightweight jQuery date & time input picker.

[![Build status: master](https://travis-ci.org/amsul/pickadate.js.svg?branch=master)](https://travis-ci.org/amsul/pickadate.js) <sup>[`master`](https://github.com/amsul/pickadate.js/tree/master)</sup>
<sup>&nbsp;&nbsp;&nbsp;</sup>
[![pickadate dev dependencies status](https://david-dm.org/amsul/pickadate.js/dev-status.svg)](https://david-dm.org/amsul/pickadate.js#info=devDependencies)


#### To get started, check out the:

[Homepage](http://amsul.ca/pickadate.js) - [Date picker](http://amsul.ca/pickadate.js/date) - [Time picker](http://amsul.ca/pickadate.js/time) - [API](http://amsul.ca/pickadate.js/api)


#### To get it:

[Download the latest stable build](https://github.com/amsul/pickadate.js/archive/master.zip)

*or*

`git clone git://github.com/amsul/pickadate.js.git`

*or*

`bower install pickadate`




<br>

## NOTE: Looking for Project Maintainers

I am looking for project maintainers to keep pickadate up to date and bug-free. As it stands, there are quite a few issues that are ready to be resolved and merged, but I would like help from someone in championing it forward.

If it sounds like you are up to the challenge, shoot met an email at reach@amsul.ca with a link to your Github account :pray:.




<br>

## Library files

The `lib` folder includes the library files with a `compressed` folder containing the minified counter-parts. These files are minified using [Grunt](#building-with-grunt).

### Pickers

There are three picker files:

* `picker.js` The core file (required before any other picker)
* `picker.date.js` The date picker
* `picker.time.js` The time picker

_To support old browsers, namely IE8, **also include** the `legacy.js` file._


### Themes

All themes are [generated using LESS](#less-styling) and compiled from the `lib/themes-source` folder into the `lib/themes` folder.

There are two themes:

* `default.css` The default modal-style theme
* `classic.css` The classic dropdown-style theme

Based on the theme, pick the relevant picker styles:

* `default.date.css` and `default.time.css` when using the default theme
* `classic.date.css` and `classic.time.css` when using the classic theme

__**__ For languages with text flowing from right-to-left, also include the `rtl.css` stylesheet.


### Translations

The translations live in the `lib/translations` folder. There are currently [43 language translations](https://github.com/amsul/pickadate.js/tree/master/lib/translations) included.




<br>

## Building with Grunt

[Grunt](http://gruntjs.com/) `~0.4.5` is used to build the project files. To get started, clone the project and then run:

- `npm install` to get the required node modules.
- `grunt test --verbose` to confirm you have all the dependencies.


Type out `grunt --help` to see a list of all the tasks available. The generally used tasks are:

- `grunt develop` compiles the LESS files and watches for any source changes.
- `grunt package` compiles and then minifies the source files.
- `grunt test` tests the entire package.




<br>

<a name="less-styling"></a>
## Styling with LESS

The picker themes are built using [LESS](http://lesscss.org/) with Grunt. To customize the CSS output, read the `_variables.less` file in the `lib/themes-source` folder. You can specify:

- colors for the theme,
- sizes for the picker,
- media-query breakpoints,
- and a whole bunch of other stuff.


Make sure to run the `grunt develop` task before making any changes to compile it into CSS.





<br>

## Bugs

Before opening a new issue, please search the existing [Issues](https://github.com/amsul/pickadate.js/issues) for anything similar – there might already be an answer to your problem. You might also wanna check out the [Contributing](https://github.com/amsul/pickadate.js/blob/master/CONTRIBUTING.md) guide.





<br>

## Contributing

Before contributing any code to the project, please take a look at the [Contributing](https://github.com/amsul/pickadate.js/blob/master/CONTRIBUTING.md) guide.

If there’s anything you’d like to discuss, we like to hang out on Gitter.

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/amsul/pickadate.js)





<br>

## Support

If you find this library useful and would like to see further development, consider [supporting it](http://selz.co/1g80kCZ).





<br><br>

---

© 2014 [Amsul](http://twitter.com/amsul_)

Licensed under [MIT](http://amsul.ca/MIT)
