# Changelog

## 3.5.4

- [#180]({%= pkg.bugs %}/180) Fixed date picker to use UTC dates.
- [#503]({%= pkg.bugs %}/503) Fixed time picker to use local times.
- Fixed color for “clear” button on time picker.
- Translations fixes for [Italian]({%= pkg.bugs %}/507), [Slovak]({%= pkg.bugs %}/505), [French]({%= pkg.bugs %}/499), [Russian]({%= pkg.bugs %}/484), [Spanish]({%= pkg.bugs %}/482)


## 3.5.3

- [#437]({%= pkg.bugs %}/437): Added Common JS to UMD.
- [#478]({%= pkg.bugs %}/478): Added “close” button.
- [#406]({%= pkg.bugs %}/406): Allow `clear` method to be `muted`.
- [#439]({%= pkg.bugs %}/439): Added ability to set min/max date & time using formatted strings.
- [#462]({%= pkg.bugs %}/462): Fixed time offset issues by using UTC based times.
- [#476]({%= pkg.bugs %}/476): Fixed the `main` files in `bower.json`.
- [#451]({%= pkg.bugs %}/451): Added French accessibility labels.
- [#442]({%= pkg.bugs %}/442): Fixed flickering on webkit browsers.
- [#438]({%= pkg.bugs %}/438): Fixed adding an ID to the hidden element to remain unique.
- [#456]({%= pkg.bugs %}/456): Fixed “today” button to be disabled when the date is disabled.
- [#419]({%= pkg.bugs %}/419): Fixed time picker not scrolling to correct position with the “classic” theme.
- Fixed bug where it was possible to unbind internal bindings.
- [#420]({%= pkg.bugs %}/420): [Updated docs]({%= pkg.homepage %}/api.htm#method-trigger) the `trigger` method’s ability to pass data to event callbacks.


## 3.5.2
- [#398]({%= pkg.bugs %}/398): Fixed Nepali translations.
- [#403]({%= pkg.bugs %}/403): Fixed month nav pointer styling with Bootstrap (`border-box` issue).
- [#405]({%= pkg.bugs %}/405): Fixed scrollbar width checker.
- [#421]({%= pkg.bugs %}/421): Fixed `picker.get('select', 'yyyy-mm-dd')` when `select` is `null`.
- [#423]({%= pkg.bugs %}/423): Added Vietnamese translations.
- [#427]({%= pkg.bugs %}/427): Fixed enabling date when `firstDay` is set.
- [#428]({%= pkg.bugs %}/428): Fixed `$` conflict in Arabic translations.
- [#430]({%= pkg.bugs %}/430): Improved differentiation between “selected” and “highlighted” dates/times.


## 3.5.0

- [#162]({%= pkg.bugs %}/162): Fixed page scrolling issue when modal view is open in the default theme.
- [#350]({%= pkg.bugs %}/350): Fixed Hungarian translations typo.
- [#351]({%= pkg.bugs %}/351) & [#388]({%= pkg.bugs %}/388) & [#393]({%= pkg.bugs %}/393): Fixed issue with script freezing when `min` is `true` and “today” is disabled.
- [#358]({%= pkg.bugs %}/358): Fixed parsing months as 1-indexed when value is a string.
- [#360]({%= pkg.bugs %}/360): Improved Grunt script to build a cleaner project.
- [#361]({%= pkg.bugs %}/361): Fixed alternate API syntax not returning the correct value.
- [#367]({%= pkg.bugs %}/367): [Added a note]({%= pkg.homepage %}/date.htm#formatting-rules) on how to appropriately use the `yy` format.
- [#369]({%= pkg.bugs %}/369): Added Nepali translations.
- [#377]({%= pkg.bugs %}/377): Added the [`hiddenName` option]({%= pkg.homepage %}/date.htm#formats_use_hidden_only) to use the visible `input`’s name as the hidden `input`’s name.
- [#381]({%= pkg.bugs %}/381): Added missing semi-colon to `legacy.js`.
- [#384]({%= pkg.bugs %}/384): Year selector appears *before* the month selector.
- [#387]({%= pkg.bugs %}/387): Fixed issue where the `clear` method did not reset the `select` value to `null`.
- [#395]({%= pkg.bugs %}/395): [Added a note]({%= pkg.homepage %}/api.htm#method-open-close) on how to use a separate button to open/close the picker.

## 3.4.0

- ARIA support added. :star2:
- [#128]({%= pkg.bugs %}/128): Date parser recognizes a string value and uses month index as 1.
- [#316]({%= pkg.bugs %}/316): Date and time parser fall back to default format if none is specified.
- [#326]({%= pkg.bugs %}/326): Fixed `set('disable', true)` crashing with `max: true` in options.
- [#329]({%= pkg.bugs %}/329): Fixed time picker not parsing midnight correcly.
- [#325]({%= pkg.bugs %}/325): Fixed Firefox bug with querying for active element with `$.contains`.
- [#330]({%= pkg.bugs %}/330): Fixed month selector navigation from month with more days to one with less.
- [#332]({%= pkg.bugs %}/332): Fixed issue where right-clicks caused picker to close in Firefox.
- [#338]({%= pkg.bugs %}/338): Fixed IE issue with month & year selector not working correctly.
- Improved time picker setting a time relative to “now”.
- Improved disabling/enabling dates and times.
- Spanish translations typo fixed.
- Added [the `off` method]({%= pkg.homepage %}/api.htm#method-off).
- Added Galician translations.
- Added Slovenian translations.
- Added Icelandic translations.
- Added option to disable [dates]({%= pkg.homepage %}/date.htm#disable-dates-use-ranges) & [times]({%= pkg.homepage %}/time.htm#disable-times-use-ranges) within a range.
- Added option to set the [`select`]({%= pkg.homepage %}/api.htm#method-set-select-date), [`highlight`]({%= pkg.homepage %}/api.htm#method-set-highlight-date), and [`view`]({%= pkg.homepage %}/api.htm#method-set-view-date) using a string and parsing format.
- Added some performance improvents.
- Added more tests and documentation.
- Fixed `picker.get('select')` when there’s no value.


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



