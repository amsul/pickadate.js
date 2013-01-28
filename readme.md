# pickadate.js v2.1.0


A mobile-friendly, responsive, and lightweight jQuery dateinput picker.

Check out the [demo](http://amsul.github.com/pickadate.js), [docs](http://amsul.github.com/pickadate.js/docs.htm>), & [themes](http://amsul.github.com/pickadate.js/themes.htm>).

[Read API changes in v2+](https://github.com/amsul/pickadate.js#notable-updates)


## Browser support
IE7+, Chrome, Firefox, Safari, Opera, iOS Safari, Android browser.

The `pickadate.js` script supports all modern browsers and IE 9+. To support IE 7+ and other old browsers, include `pickadate.legacy.js` instead.



## Notable updates

#### 2.1.0
- [Fix for disabled calendar that loops infinitely](https://github.com/amsul/pickadate.js/issues/73)
- Bug fix for "click" not propagating to calendar holder

#### 2.0.7
- ["Enter" key default action allowed when calendar is closed](https://github.com/amsul/pickadate.js/issues/72)

#### 2.0.5
- [IE click-to-close bug fix](https://github.com/amsul/pickadate.js/issues/67)
- [IE styling fix where calendar appears left-aligned](https://github.com/amsul/pickadate.js/issues/67#issuecomment-12367491)

#### 2.0.1
- [Broadcast the `input` change event](https://github.com/amsul/pickadate.js/issues/63)

#### 2.0
- A version bump due to changes in the [default layout and styling](http://amsul.github.com/pickadate.js/docs.htm#options_styling) that will cause _**old stylings to break.**_
- [New fully responsive default theme](http://amsul.github.com/pickadate.js)
- [4 themes to chose from](http://amsul.github.com/pickadate.js/themes.htm)
- [Today & clear buttons](http://amsul.github.com/pickadate.js/docs.htm#buttons)
- [Clear method](http://amsul.github.com/pickadate.js/docs.htm#api_clear)
- [Grab input element from calendar object](http://amsul.github.com/pickadate.js/docs.htm#api_$node)
- As well as several bug fixes and improvements (especially for iOS and IE)

#### 1.4.0
- [Get min & max date](http://amsul.github.com/pickadate.js/docs.htm#api_getDateLimit)
- [Set min & max date](http://amsul.github.com/pickadate.js/docs.htm#api_setDateLimit)

#### 1.3.8
- [Translations](http://amsul.github.com/pickadate.js/docs.htm#translations)

#### 1.3.7
- [Default value formatting](http://amsul.github.com/pickadate.js/docs.htm#formats_hidden)

#### 1.3.6
- Added support for legacy browsers

#### 1.3.5

- [All options are now camelCased](http://amsul.github.com/pickadate.js/docs.htm#options)
- [Keyboard accessibility](http://amsul.github.com/pickadate.js/docs.htm)
- [`minDate`](http://amsul.github.com/pickadate.js/docs.htm#ranges) & [`maxDate`](http://amsul.github.com/pickadate.js/docs.htm#ranges) more flexible
- [`getDate`](http://amsul.github.com/pickadate.js/docs.htm#api_getDate) & [`setDate`](http://amsul.github.com/pickadate.js/docs.htm#api_setDate) options
- Few other bug fixes & improvements under the hood.


#### 1.3.0

- [Month & year selector](http://amsul.github.com/pickadate.js/docs.htm#selectors)
- [Selectively disable dates](http://amsul.github.com/pickadate.js/docs.htm#dates_disabled)
- [Calendar events](http://amsul.github.com/pickadate.js/docs.htm#events) and [api]((http://amsul.github.com/pickadate.js/docs.htm#api)
- [Inline calendar](http://amsul.github.com/pickadate.js/docs.htm#theme)
- [Classes option revised](http://amsul.github.com/pickadate.js/docs.htm#classes)


## Contributing

Fork away and send in pull requests of your own custom `pickadate.css` file so we can build [a repository of themes](https://github.com/amsul/pickadate.js/tree/gh-pages/themes).

**Send all pull requests to the [dev](https://github.com/amsul/pickadate.js/tree/dev) branch**.

---

&copy; [Amsul](http://twitter.com/amsul_) - Licensed under MIT ("expat" flavour) license.
