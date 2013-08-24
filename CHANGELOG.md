
# Changelog

## 3.2.1

- [#210](https://github.com/amsul/pickadate.js/issues/210): Wrapped files using UMD patterns.
- [#207](https://github.com/amsul/pickadate.js/issues/207): Japanese translations added.
- Some other slight improvements.

## 3.2.0

- [#178](https://github.com/amsul/pickadate.js/issues/178): Fix for flicker on iOS while changing months.
- Added `render(true)` option to render full picker or just the “face” ([read more](http://amsul.github.io/pickadate.js/api.htm#method-render)).

## 3.1.4

- Fix for Polish translation.
- Added a `container` option to specify the picker root element’s outlet.
- Fix for `$` conflict in translation files.

## 3.1.3

- Korean translations added.

## 3.1.2

- [#168](https://github.com/amsul/pickadate.js/issues/168): Fixed month navigation with disabled dates.

## 3.1.1

- [#161](https://github.com/amsul/pickadate.js/issues/161): Corrected “no-drop” cursor on input element for certain browsers.
- [#158](https://github.com/amsul/pickadate.js/issues/158): Fixed CSS for disabled dates with unfocused input.
- [#155](https://github.com/amsul/pickadate.js/issues/155): Corrected unescaped translations.

## 3.1.0

- [#140](https://github.com/amsul/pickadate.js/issues/140): Fix for freezing with unexpected date format.
- [#154](https://github.com/amsul/pickadate.js/issues/154): Fix for “mm” and “m” formats opening with incorrect month.
- Border styling adjusted for disabled times.

## v3.0.5

- [#145](https://github.com/amsul/pickadate.js/issues/145): Fix for `getFirstWordLength` not being defined.
- [#137](https://github.com/amsul/pickadate.js/issues/137): Corrected Norwegian translation.

## v3.0.4

- [#132](https://github.com/amsul/pickadate.js/issues/132): Fix for using `firstDay` with month starting on Sunday.
- Improved disabled dates validation.

## v3.0.3

- [#126](https://github.com/amsul/pickadate.js/issues/126): Fix for all dates disabled.
- [#127](https://github.com/amsul/pickadate.js/issues/127): Fix for jQuery no conflict.
- [#129](https://github.com/amsul/pickadate.js/issues/129): Fix for month nav wrapping around same year.

## v3.0.2

- [#124](https://github.com/amsul/pickadate.js/issues/124): Fixed bug with navigating past year.

## v3.0.1

- [#123](https://github.com/amsul/pickadate.js/issues/123): Removed `hiddenSuffix` extra quote character.
- Fixed issue with month navigation on the 31st date.

## v3.0.0

With this major release, the entire API has been rethought to allow the picker to be much more configurable and extensible. These are the most notable updates:

- [#20](https://github.com/amsul/pickadate.js/issues/20): Introduced a new [time picker](http://amsul.github.io/pickadate.js/time.htm).
- [#112](https://github.com/amsul/pickadate.js/issues/112): Firefox select month/year fix.
- [#84](https://github.com/amsul/pickadate.js/issues/84): Scrollbar not hidden to avoid page shift.
- [#89](https://github.com/amsul/pickadate.js/issues/89): Better event handling on clicks/focuses/keydowns within the holder.
- [#98](https://github.com/amsul/pickadate.js/issues/98): Destroy picker data from element.
- Added Grunt.js build system.
- Added QUnit test suite.
- Added Travis integration.
- Updated themes to be LESS-based.
- Removed “inline” and “inline-fixed” themes.
- Removed jam.js bindings within `package.json`.
- Removed official support for IE7. Still works but looks odd.

To enable all this goodness, some **backward-incompatible changes** have been introduced. These are the main ones:

<a name="zero-as-index"></a>
- [#85](https://github.com/amsul/pickadate.js/issues/85): Months have __zero-as-index__:

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



