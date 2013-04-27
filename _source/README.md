# {%= pkg.name %} v{%= pkg.version %} [![{%= pkg.name %} build status](https://travis-ci.org/amsul/pickadate.js.png?branch=time-picker)](https://travis-ci.org/amsul/pickadate.js)

{%= pkg.description %}

{%
    fileSize_datetime = ___.fileSize( grunt.file.read('lib/pickadate.datetime.min.js') )
    fileSize_date = ___.fileSize( grunt.file.read('lib/pickadate.date.min.js') )
    fileSize_time = ___.fileSize( grunt.file.read('lib/pickadate.time.min.js') )
%}

#### To get started, check out the:

[Homepage]({%= pkg.homepage %}) - [Date picker]({%= pkg.homepage %}/date.htm) - [Time picker]({%= pkg.homepage %}/time.htm) - [API]({{%= pkg.homepage %}/api.htm)


#### To get it:

[Download v{%= pkg.version %}]({%= ___.gitrepo_url %}/archive/{%= pkg.version %}.zip) or `git clone git://github.com/amsul/pickadate.js.git` or `bower install pickadate`




<br>
## Upgrading from v2 to v3

The v3 API is significantly different from v2 (all for the greater good!). So if you’re upgrading to v3, make sure to read the [changelog]({%= ___.gitrepo_url %}/tree/gh-pages/CHANGELOG.md).





<br>
## Library files

The [`lib`]({%= ___.gitrepo_url %}/tree/gh-pages/lib) folder includes **three** `.js` files - alongside the `.min.js` counter-parts. Only include the one script that is most suitable to your use case:

File name               | Picker(s) included   | File size (min & gzip)
----------------------- | -------------------- | ----------------------
`pickadate.datetime`    | Date and time        | {%= (fileSize_datetime.gzip/1024).toFixed(2) %}kb
`pickadate.date`        | Date                 | {%= (fileSize_date.gzip/1024).toFixed(2) %}kb
`pickadate.time`        | Time                 | {%= (fileSize_time.gzip/1024).toFixed(2) %}kb


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

Before opening a new issue, search the [Issues]({%= pkg.bugs %}) to see if anything similar already exists - there might already be an answer to your problem. You might also wanna check out the [Contributing]({%= ___.gitrepo_url %}/tree/gh-pages/CONTRIBUTING.md) guide.





<br>
## Contributing

Before contributing any code to the project, please take a look at the [Contributing]({%= ___.gitrepo_url %}/tree/gh-pages/CONTRIBUTING.md) guide.




<br>
## Building with Grunt

Grunt `~0.4.0` is used to build the project files. To get started, after cloning the project over, run `npm install` to get all the required node modules.

Then run `grunt everything --verbose` to check if you have all the dependencies.



<br><br>

---

© {%= grunt.template.date('yyyy') %} [Amsul](http://twitter.com/amsul_)

Licensed under [{%= pkg.licenses[0].type %}]({%= pkg.licenses[0].url %}).