# pickadate v3.0.0alpha [![pickadate build status](https://travis-ci.org/amsul/pickadate.js.png?branch=time-picker)](https://travis-ci.org/amsul/pickadate.js)

The mobile-friendly, responsive, and lightweight jQuery date & time input picker.



#### To get started, check out the:

[Homepage](http://amsul.github.io/pickadate.js) - [Date picker](http://amsul.github.io/pickadate.js/date.htm) - [Time picker](http://amsul.github.io/pickadate.js/time.htm) - [API]({http://amsul.github.io/pickadate.js/api.htm)


#### To get it:

[Download v3.0.0alpha](https://github.com/amsul/pickadate.js/archive/3.0.0alpha.zip) or `git clone git://github.com/amsul/pickadate.js.git` or `bower install pickadate`




<br>
## Upgrading from v2 to v3

The v3 API is significantly different from v2 (all for the greater good!). So if you’re upgrading to v3, make sure to read the [changelog](https://github.com/amsul/pickadate.js/tree/gh-pages/CHANGELOG.md).





<br>
## Library files

The `lib` folder includes **three** `.js` files – alongside the `.min.js` counter-parts. Only include the one script that is most suitable to your use case:

File name               | Picker(s) included   | File size (min & gzip)
----------------------- | -------------------- | ----------------------
`pickadate.datetime`    | Date and time        | 3.36kb
`pickadate.date`        | Date                 | 2.76kb
`pickadate.time`        | Time                 | 2.19kb


_To support old browsers as well, namely IE7 and IE8, **also include** the `legacy.js` file._





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

Before opening a new issue, search the [Issues](https://github.com/amsul/pickadate.js/issues) to see if anything similar already exists - there might already be an answer to your problem. You might also wanna check out the [Contributing](https://github.com/amsul/pickadate.js/tree/gh-pages/CONTRIBUTING.md) guide.





<br>
## Contributing

Before contributing any code to the project, please take a look at the [Contributing](https://github.com/amsul/pickadate.js/tree/gh-pages/CONTRIBUTING.md) guide.




<br>
## Building with Grunt

[Grunt](http://gruntjs.com/) `~0.4.1` is used to build the project files. To get started, clone the project and then run:

- `npm install` to get the required node modules.
- `grunt --verbose` to confirm you have all the dependencies.




<br><br>

---

© 2013 [Amsul](http://twitter.com/amsul_)

Licensed under [MIT](http://amsul.ca/MIT).