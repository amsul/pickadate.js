
# Changelog

## v3.1.0

- Added the "container" option.

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



