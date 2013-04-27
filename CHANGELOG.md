
# Changelog

## v3.0.0

With this major release, the entire API has been rethought to allow the picker to be much more configurable and extensible. These are the most notable updates:

- [#20](/issues/20): Introduced a new [time picker](http://amsul.github.io/pickadate.js/time.htm).
- [#112](/issues/112): Firefox select month/year fix.
- [#84](/issues/84): Scrollbar not hidden to avoid page shift.
- [#89](/issues/89): Better event handling on clicks/focuses/keydowns within the holder.
- [#98](/issues/98): Destroy picker data from element.
- Grunt.js build system added.
- Extensive QUnit test suite added.
- Themes updated to be Sass-based.
- “Inline” and “inline-fixed” themes removed.

To enable all this goodness, some **backward-incompatible changes** have been introduced. These are the main ones:

- [#85](/issues/85): Months have __zero-as-index__:

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



