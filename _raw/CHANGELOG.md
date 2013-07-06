
# Changelog

## 3.1.2

- [#168]({%= meta.gitrepo_url %}/issues/168): Fixed month navigation with disabled dates.

## 3.1.1

- [#161]({%= meta.gitrepo_url %}/issues/161): Corrected “no-drop” cursor on input element for certain browsers.
- [#158]({%= meta.gitrepo_url %}/issues/158): Fixed CSS for disabled dates with unfocused input.
- [#155]({%= meta.gitrepo_url %}/issues/155): Corrected unescaped translations.

## 3.1.0

- [#140]({%= meta.gitrepo_url %}/issues/140): Fix for freezing with unexpected date format.
- [#154]({%= meta.gitrepo_url %}/issues/154): Fix for “mm” and “m” formats opening with incorrect month.
- Border styling adjusted for disabled times.

## v3.0.5

- [#145]({%= meta.gitrepo_url %}/issues/145): Fix for `getFirstWordLength` not being defined.
- [#137]({%= meta.gitrepo_url %}/issues/137): Corrected Norwegian translation.

## v3.0.4

- [#132]({%= meta.gitrepo_url %}/issues/132): Fix for using `firstDay` with month starting on Sunday.
- Improved disabled dates validation.

## v3.0.3

- [#126]({%= meta.gitrepo_url %}/issues/126): Fix for all dates disabled.
- [#127]({%= meta.gitrepo_url %}/issues/127): Fix for jQuery no conflict.
- [#129]({%= meta.gitrepo_url %}/issues/129): Fix for month nav wrapping around same year.

## v3.0.2

- [#124]({%= meta.gitrepo_url %}/issues/124): Fixed bug with navigating past year.

## v3.0.1

- [#123]({%= meta.gitrepo_url %}/issues/123): Removed `hiddenSuffix` extra quote character.
- Fixed issue with month navigation on the 31st date.

## v3.0.0

With this major release, the entire API has been rethought to allow the picker to be much more configurable and extensible. These are the most notable updates:

- [#20]({%= meta.gitrepo_url %}/issues/20): Introduced a new [time picker]({%= pkg.homepage %}/time.htm).
- [#112]({%= meta.gitrepo_url %}/issues/112): Firefox select month/year fix.
- [#84]({%= meta.gitrepo_url %}/issues/84): Scrollbar not hidden to avoid page shift.
- [#89]({%= meta.gitrepo_url %}/issues/89): Better event handling on clicks/focuses/keydowns within the holder.
- [#98]({%= meta.gitrepo_url %}/issues/98): Destroy picker data from element.
- Added Grunt.js build system.
- Added QUnit test suite.
- Added Travis integration.
- Updated themes to be LESS-based.
- Removed “inline” and “inline-fixed” themes.
- Removed jam.js bindings within `package.json`.
- Removed official support for IE7. Still works but looks odd.

To enable all this goodness, some **backward-incompatible changes** have been introduced. These are the main ones:

<a name="zero-as-index"></a>
- [#85]({%= meta.gitrepo_url %}/issues/85): Months have __zero-as-index__:

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

- A few [HTML classes]({%= pkg.homepage %}/date.htm#classes) name and property changes.

- [Formatting rules]({%= pkg.homepage %}/date.htm#formats) that appear within a word need to be escaped with an exclamation mark (!).


<br>
#### Please do read the [docs]({%= pkg.homepage %}/date.htm#options) and [api]({%= pkg.homepage %}/api.htm) to see exactly how these new options and methods work.




<br>
## Older changelogs

If you’re looking for changes in older versions, please [browse the tags]({%= meta.gitrepo_url %}/tags) for the relevant commit archive and changelog file.



