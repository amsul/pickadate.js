# Changelog

## 3.4.0

- ARIA support added.
- [#128]({%= pkg.bugs %}/128): Date parser recognizes a string value and uses month index as 1.
- [#316]({%= pkg.bugs %}/316): Date and time parser fall back to default format if none is specified.
- [#326]({%= pkg.bugs %}/326): Fixed `set('disable', true)` crashing with `max: true` in options.
- [#329]({%= pkg.bugs %}/329): Fixed time picker not parsing midnight correcly.
- Improved time picker setting a time relative to “now”.


## 3.3.2

- [#283]({%= pkg.bugs %}/283): Adjusted font size for narrow screens.
- [#285]({%= pkg.bugs %}/285): Fixed `select` menu click on Firefox.
- [#294]({%= pkg.bugs %}/294): Fixed issue with `stop` method called within `onClose`.
- [#303]({%= pkg.bugs %}/303): Fixed issue with `value` not being parsed when `formatSubmit` is used.


## 3.3.1

- [#260]({%= pkg.bugs %}/260): Fixed border from preventing picker from opening.
- [#248]({%= pkg.bugs %}/248): Added option to enable dates/times disabled within a range.
- [#255]({%= pkg.bugs %}/255): Added traditional Chinese.
- [#249]({%= pkg.bugs %}/249) & [#120]({%= pkg.bugs %}/120): Fixed jQuery Mobile and MagnificPopup click issues.
- [#247]({%= pkg.bugs %}/247): Fixed setting min limit on time picker.
- [#278]({%= pkg.bugs %}/278) & [#285]({%= pkg.bugs %}/285): Fixed Firefox and IE bug for finding `activeElement`.
- [#279]({%= pkg.bugs %}/279): Added option to `set` things with [muted callbacks]({%= pkg.homepage %}/pickadate.js/api.htm#muted-callbacks).
- Fixed French translations capitalization.
- Fixed time picker scrolling.
- Added setting a [time using a native JavaScript date objects]({%= pkg.homepage %}/api.htm#method-set-select-time).
- Added option to keep an [editable `input`]({%= pkg.homepage %}/date.htm#editable) element.


## 3.3.0

- [#238]({%= pkg.bugs %}/238): Improved disabled dates validation.
- [#236]({%= pkg.bugs %}/236): Fixed transparency issue in IE8 on XP.
- [#159]({%= pkg.bugs %}/159): Added functionality to reset disabled dates/times.
- [#232]({%= pkg.bugs %}/232): Dropdown styling tweaked.
- [#197]({%= pkg.bugs %}/197): Fixed issue with forms not submitting on Firefox.
- [#230]({%= pkg.bugs %}/230): Fixed issue with selected time scrolling into view.
- [#208]({%= pkg.bugs %}/208) & [#209]({%= pkg.bugs %}/209): Added `hiddenPrefix` option for hidden input element’s name attribute.
- [#130]({%= pkg.bugs %}/130): Fixed issue with passing focus to an element with custom jQuery builds.
- [#246]({%= pkg.bugs %}/246) & [#242]({%= pkg.bugs %}/242): Resolved jQuery conflict.
- [#247]({%= pkg.bugs %}/247): Fixed issue with time picker intervals and the min selectable time.
- Added option to disabled/enable dates using JavaScript Date objects.
- Tweaked functionality in enabling/disabling dates and times.
- Improved support for RTL languages and keyboard navigation.
- Added `rtl.css` for styling RTL languages appropriatey.


## 3.2.2

- [#216]({%= pkg.bugs %}/216): Added generic Arabic translations.
- [#210]({%= pkg.bugs %}/210): Fixed jQuery conflict in picker extension files.
- [#223]({%= pkg.bugs %}/223): Time picker “disabled” attribute fix.
- Fixed issue with IE losing key bindings when clicked within picker.
- Improved delegated click handling on picker elements.

## 3.2.1

- [#210]({%= pkg.bugs %}/210): Wrapped files using UMD patterns.
- [#207]({%= pkg.bugs %}/207): Japanese translations added.
- Some other slight improvements.

## 3.2.0

- [#178]({%= pkg.bugs %}/178): Fix for flicker on iOS while changing months.
- Added `render(true)` option to render full picker or just the “face” ([read more](http://amsul.github.io/pickadate.js/api.htm#method-render)).

## 3.1.4

- Fix for Polish translation.
- Added a `container` option to specify the picker root element’s outlet.
- Fix for `$` conflict in translation files.

## 3.1.3

- Korean translations added.

## 3.1.2

- [#168]({%= pkg.bugs %}/168): Fixed month navigation with disabled dates.

## 3.1.1

- [#161]({%= pkg.bugs %}/161): Corrected “no-drop” cursor on input element for certain browsers.
- [#158]({%= pkg.bugs %}/158): Fixed CSS for disabled dates with unfocused input.
- [#155]({%= pkg.bugs %}/155): Corrected unescaped translations.

## 3.1.0

- [#140]({%= pkg.bugs %}/140): Fix for freezing with unexpected date format.
- [#154]({%= pkg.bugs %}/154): Fix for “mm” and “m” formats opening with incorrect month.
- Border styling adjusted for disabled times.

## v3.0.5

- [#145]({%= pkg.bugs %}/145): Fix for `getFirstWordLength` not being defined.
- [#137]({%= pkg.bugs %}/137): Corrected Norwegian translation.

## v3.0.4

- [#132]({%= pkg.bugs %}/132): Fix for using `firstDay` with month starting on Sunday.
- Improved disabled dates validation.

## v3.0.3

- [#126]({%= pkg.bugs %}/126): Fix for all dates disabled.
- [#127]({%= pkg.bugs %}/127): Fix for jQuery no conflict.
- [#129]({%= pkg.bugs %}/129): Fix for month nav wrapping around same year.

## v3.0.2

- [#124]({%= pkg.bugs %}/124): Fixed bug with navigating past year.

## v3.0.1

- [#123]({%= pkg.bugs %}/123): Removed `hiddenSuffix` extra quote character.
- Fixed issue with month navigation on the 31st date.

## v3.0.0

With this major release, the entire API has been rethought to allow the picker to be much more configurable and extensible. These are the most notable updates:

- [#20]({%= pkg.bugs %}/20): Introduced a new [time picker](http://amsul.github.io/pickadate.js/time.htm).
- [#112]({%= pkg.bugs %}/112): Firefox select month/year fix.
- [#84]({%= pkg.bugs %}/84): Scrollbar not hidden to avoid page shift.
- [#89]({%= pkg.bugs %}/89): Better event handling on clicks/focuses/keydowns within the holder.
- [#98]({%= pkg.bugs %}/98): Destroy picker data from element.
- Added Grunt.js build system.
- Added QUnit test suite.
- Added Travis integration.
- Updated themes to be LESS-based.
- Removed “inline” and “inline-fixed” themes.
- Removed jam.js bindings within `package.json`.
- Removed official support for IE7. Still works but looks odd.

To enable all this goodness, some **backward-incompatible changes** have been introduced. These are the main ones:

<a name="zero-as-index"></a>
- [#85]({%= pkg.bugs %}/85): Months have __zero-as-index__:

	Just as in JavaScript’s native Date object, the `month` used to create dates is now 	based on zero as the first index. Meaning:

	```
	[2013,0,1] → January 01, 2013
	[2013,11,1] → December 01, 2013
	```

- API revised:

	```
	isOpen → get('open')
	getDate → get('select')
	getDateLimit → get('min') or get('max')
	setDate → set('select', …)
	setDateLimit → set('min', …) or set('max', …)
	show → set('view', …)
	```

- Options revised:

	```
	showMonthsFull → showMonthsShort
	showWeekdaysShort → showWeekdaysFull
	yearSelector → selectYears
	monthSelector → selectMonths
	dateMin → min
	dateMax → max
	datesDisabled → disable
	onSelect → onSet
	```

- Options removed:

	```
	monthPrev
	monthNext
	```
	To add labels for the month navigation tabs, use CSS pseudo-elements instead.

- A few [HTML classes](http://amsul.github.io/pickadate.js/date.htm#classes) name and property changes.

- [Formatting rules](http://amsul.github.io/pickadate.js/date.htm#formats) that appear within a word need to be escaped with an exclamation mark (!).


<br>
#### Please do read the [docs](http://amsul.github.io/pickadate.js/date.htm#options) and [api](http://amsul.github.io/pickadate.js/api.htm) to see exactly how these new options and methods work.




<br>
## Older changelogs

If you’re looking for changes in older versions, please [browse the tags](https://github.com/amsul/pickadate.js/tags) for the relevant commit archive and changelog file.



