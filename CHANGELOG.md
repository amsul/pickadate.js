# Changelog

## 3.5.6

- [#667](https://github.com/amsul/pickadate.js/issues/667) Fixed issue where script was executed before `body` was loaded.
- [#648](https://github.com/amsul/pickadate.js/issues/648) Fixed re-binding events to `P.$holder` after a re-render.
- [#652](https://github.com/amsul/pickadate.js/issues/652) Added Persian translations.
- [#669](https://github.com/amsul/pickadate.js/issues/669) Fix in Chinese translations.
- [#683](https://github.com/amsul/pickadate.js/issues/683) Fix in Japanese translations.


## 3.5.5

- [#180](https://github.com/amsul/pickadate.js/issues/180) Fixed date picker to use UTC dates.
- [#503](https://github.com/amsul/pickadate.js/issues/503) Fixed time picker to use local times.
- Fixed color for “clear” button on time picker.
- Translations fixes for [Italian](https://github.com/amsul/pickadate.js/issues/507), [Slovak](https://github.com/amsul/pickadate.js/issues/505), [French](https://github.com/amsul/pickadate.js/issues/499), [Russian](https://github.com/amsul/pickadate.js/issues/484), [Spanish](https://github.com/amsul/pickadate.js/issues/482), [Hindi](https://github.com/amsul/pickadate.js/commit/4b7b7194395657b2360c335839f5b4e21f43987a), [Brazilian Portuguese](https://github.com/amsul/pickadate.js/commit/67d0f6d26aba689c31c9ad402a109b478ffdac92)
- [#437](https://github.com/amsul/pickadate.js/issues/437): Added Common JS to UMD.
- [#478](https://github.com/amsul/pickadate.js/issues/478): Added “close” button.
- [#406](https://github.com/amsul/pickadate.js/issues/406): Allow `clear` method to be `muted`.
- [#510](https://github.com/amsul/pickadate.js/issues/510): Added `valueSubmit` to get value of hidden input element.
- [#439](https://github.com/amsul/pickadate.js/issues/439): Added ability to set min/max date & time using formatted strings.
- [#451](https://github.com/amsul/pickadate.js/issues/451): Added French accessibility labels.
- [#462](https://github.com/amsul/pickadate.js/issues/462): Fixed time offset issues by using UTC based times.
- [#476](https://github.com/amsul/pickadate.js/issues/476): Fixed the `main` files in `bower.json`.
- [#442](https://github.com/amsul/pickadate.js/issues/442): Fixed flickering on webkit browsers.
- [#438](https://github.com/amsul/pickadate.js/issues/438): Fixed adding an ID to the hidden element to remain unique.
- [#456](https://github.com/amsul/pickadate.js/issues/456): Fixed “today” button to be disabled when the date is disabled.
- [#419](https://github.com/amsul/pickadate.js/issues/419): Fixed time picker not scrolling to correct position with the “classic” theme.
- [#531](https://github.com/amsul/pickadate.js/issues/531): Fixed mutation of date object passed to `normalize`.
- [#441](https://github.com/amsul/pickadate.js/issues/441): Fixed IE8 `getComputedStyle` error.
- [#465](https://github.com/amsul/pickadate.js/issues/465): Fixed IE8 error on changing input `type`.
- [#519](https://github.com/amsul/pickadate.js/issues/519): Fixed IE8 error of picker in `iframe`.
- [#523](https://github.com/amsul/pickadate.js/issues/523): Fixed iOS8 bug of picker not opening in view.
- Fixed bug where it was possible to unbind internal bindings.
- [#420](https://github.com/amsul/pickadate.js/issues/420): [Updated docs](http://amsul.github.io/pickadate.js/api.htm#method-trigger) the `trigger` method’s ability to pass data to event callbacks.
- [#562](https://github.com/amsul/pickadate.js/issues/562): Fixed hidden `input` to move into `container` when option is used.
- [#581](https://github.com/amsul/pickadate.js/issues/581): Added ARIA label for dates and times.
- [#575](https://github.com/amsul/pickadate.js/issues/575): Removed the Sizzle dependency.
- Added `closeOnSelect` and `closeOnClear` boolean options.


## 3.5.2
- [#398](https://github.com/amsul/pickadate.js/issues/398): Fixed Nepali translations.
- [#403](https://github.com/amsul/pickadate.js/issues/403): Fixed month nav pointer styling with Bootstrap (`border-box` issue).
- [#405](https://github.com/amsul/pickadate.js/issues/405): Fixed scrollbar width checker.
- [#421](https://github.com/amsul/pickadate.js/issues/421): Fixed `picker.get('select', 'yyyy-mm-dd')` when `select` is `null`.
- [#423](https://github.com/amsul/pickadate.js/issues/423): Added Vietnamese translations.
- [#427](https://github.com/amsul/pickadate.js/issues/427): Fixed enabling date when `firstDay` is set.
- [#428](https://github.com/amsul/pickadate.js/issues/428): Fixed `$` conflict in Arabic translations.
- [#430](https://github.com/amsul/pickadate.js/issues/430): Improved differentiation between “selected” and “highlighted” dates/times.


## 3.5.0

- [#162](https://github.com/amsul/pickadate.js/issues/162): Fixed page scrolling issue when modal view is open in the default theme.
- [#350](https://github.com/amsul/pickadate.js/issues/350): Fixed Hungarian translations typo.
- [#351](https://github.com/amsul/pickadate.js/issues/351) & [#388](https://github.com/amsul/pickadate.js/issues/388) & [#393](https://github.com/amsul/pickadate.js/issues/393): Fixed issue with script freezing when `min` is `true` and “today” is disabled.
- [#358](https://github.com/amsul/pickadate.js/issues/358): Fixed parsing months as 1-indexed when value is a string.
- [#360](https://github.com/amsul/pickadate.js/issues/360): Improved Grunt script to build a cleaner project.
- [#361](https://github.com/amsul/pickadate.js/issues/361): Fixed alternate API syntax not returning the correct value.
- [#367](https://github.com/amsul/pickadate.js/issues/367): [Added a note](http://amsul.github.io/pickadate.js/date.htm#formatting-rules) on how to appropriately use the `yy` format.
- [#369](https://github.com/amsul/pickadate.js/issues/369): Added Nepali translations.
- [#377](https://github.com/amsul/pickadate.js/issues/377): Added the [`hiddenName` option](http://amsul.github.io/pickadate.js/date.htm#formats_use_hidden_only) to use the visible `input`’s name as the hidden `input`’s name.
- [#381](https://github.com/amsul/pickadate.js/issues/381): Added missing semi-colon to `legacy.js`.
- [#384](https://github.com/amsul/pickadate.js/issues/384): Year selector appears *before* the month selector.
- [#387](https://github.com/amsul/pickadate.js/issues/387): Fixed issue where the `clear` method did not reset the `select` value to `null`.
- [#395](https://github.com/amsul/pickadate.js/issues/395): [Added a note](http://amsul.github.io/pickadate.js/api.htm#method-open-close) on how to use a separate button to open/close the picker.

## 3.4.0

- ARIA support added. :star2:
- [#128](https://github.com/amsul/pickadate.js/issues/128): Date parser recognizes a string value and uses month index as 1.
- [#316](https://github.com/amsul/pickadate.js/issues/316): Date and time parser fall back to default format if none is specified.
- [#326](https://github.com/amsul/pickadate.js/issues/326): Fixed `set('disable', true)` crashing with `max: true` in options.
- [#329](https://github.com/amsul/pickadate.js/issues/329): Fixed time picker not parsing midnight correcly.
- [#325](https://github.com/amsul/pickadate.js/issues/325): Fixed Firefox bug with querying for active element with `$.contains`.
- [#330](https://github.com/amsul/pickadate.js/issues/330): Fixed month selector navigation from month with more days to one with less.
- [#332](https://github.com/amsul/pickadate.js/issues/332): Fixed issue where right-clicks caused picker to close in Firefox.
- [#338](https://github.com/amsul/pickadate.js/issues/338): Fixed IE issue with month & year selector not working correctly.
- Improved time picker setting a time relative to “now”.
- Improved disabling/enabling dates and times.
- Spanish translations typo fixed.
- Added [the `off` method](http://amsul.github.io/pickadate.js/api.htm#method-off).
- Added Galician translations.
- Added Slovenian translations.
- Added Icelandic translations.
- Added option to disable [dates](http://amsul.github.io/pickadate.js/date.htm#disable-dates-use-ranges) & [times](http://amsul.github.io/pickadate.js/time.htm#disable-times-use-ranges) within a range.
- Added option to set the [`select`](http://amsul.github.io/pickadate.js/api.htm#method-set-select-date), [`highlight`](http://amsul.github.io/pickadate.js/api.htm#method-set-highlight-date), and [`view`](http://amsul.github.io/pickadate.js/api.htm#method-set-view-date) using a string and parsing format.
- Added some performance improvents.
- Added more tests and documentation.
- Fixed `picker.get('select')` when there’s no value.


## 3.3.2

- [#283](https://github.com/amsul/pickadate.js/issues/283): Adjusted font size for narrow screens.
- [#285](https://github.com/amsul/pickadate.js/issues/285): Fixed `select` menu click on Firefox.
- [#294](https://github.com/amsul/pickadate.js/issues/294): Fixed issue with `stop` method called within `onClose`.
- [#303](https://github.com/amsul/pickadate.js/issues/303): Fixed issue with `value` not being parsed when `formatSubmit` is used.


## 3.3.1

- [#260](https://github.com/amsul/pickadate.js/issues/260): Fixed border from preventing picker from opening.
- [#248](https://github.com/amsul/pickadate.js/issues/248): Added option to enable dates/times disabled within a range.
- [#255](https://github.com/amsul/pickadate.js/issues/255): Added traditional Chinese.
- [#249](https://github.com/amsul/pickadate.js/issues/249) & [#120](https://github.com/amsul/pickadate.js/issues/120): Fixed jQuery Mobile and MagnificPopup click issues.
- [#247](https://github.com/amsul/pickadate.js/issues/247): Fixed setting min limit on time picker.
- [#278](https://github.com/amsul/pickadate.js/issues/278) & [#285](https://github.com/amsul/pickadate.js/issues/285): Fixed Firefox and IE bug for finding `activeElement`.
- [#279](https://github.com/amsul/pickadate.js/issues/279): Added option to `set` things with [muted callbacks](http://amsul.github.io/pickadate.js/pickadate.js/api.htm#muted-callbacks).
- Fixed French translations capitalization.
- Fixed time picker scrolling.
- Added setting a [time using a native JavaScript date objects](http://amsul.github.io/pickadate.js/api.htm#method-set-select-time).
- Added option to keep an [editable `input`](http://amsul.github.io/pickadate.js/date.htm#editable) element.


## 3.3.0

- [#238](https://github.com/amsul/pickadate.js/issues/238): Improved disabled dates validation.
- [#236](https://github.com/amsul/pickadate.js/issues/236): Fixed transparency issue in IE8 on XP.
- [#159](https://github.com/amsul/pickadate.js/issues/159): Added functionality to reset disabled dates/times.
- [#232](https://github.com/amsul/pickadate.js/issues/232): Dropdown styling tweaked.
- [#197](https://github.com/amsul/pickadate.js/issues/197): Fixed issue with forms not submitting on Firefox.
- [#230](https://github.com/amsul/pickadate.js/issues/230): Fixed issue with selected time scrolling into view.
- [#208](https://github.com/amsul/pickadate.js/issues/208) & [#209](https://github.com/amsul/pickadate.js/issues/209): Added `hiddenPrefix` option for hidden input element’s name attribute.
- [#130](https://github.com/amsul/pickadate.js/issues/130): Fixed issue with passing focus to an element with custom jQuery builds.
- [#246](https://github.com/amsul/pickadate.js/issues/246) & [#242](https://github.com/amsul/pickadate.js/issues/242): Resolved jQuery conflict.
- [#247](https://github.com/amsul/pickadate.js/issues/247): Fixed issue with time picker intervals and the min selectable time.
- Added option to disabled/enable dates using JavaScript Date objects.
- Tweaked functionality in enabling/disabling dates and times.
- Improved support for RTL languages and keyboard navigation.
- Added `rtl.css` for styling RTL languages appropriatey.


## 3.2.2

- [#216](https://github.com/amsul/pickadate.js/issues/216): Added generic Arabic translations.
- [#210](https://github.com/amsul/pickadate.js/issues/210): Fixed jQuery conflict in picker extension files.
- [#223](https://github.com/amsul/pickadate.js/issues/223): Time picker “disabled” attribute fix.
- Fixed issue with IE losing key bindings when clicked within picker.
- Improved delegated click handling on picker elements.

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



