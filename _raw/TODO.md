
a lot of the stuff below may never happen...


docs/fixes
----------

- fix banners on scss files
- “escape” on IE clears input value
- update `devDependencies`
- default theme with “transformly responsive” option


tests
-----

- clicks/mousedowns/focuses within datepicker
- disable flip
- highlight/select get shifted if disabled
- go to next/prev month and confirm view update
- various base picker `set` method invoking syntaxes
- `set` something outside limits
- formats verification
- `.on` method tests
- `.trigger` method tests


future
------

- future: month with 31st highlighted..click nav to next month skips month with less than 31 days
- future: improve base jquery extension `return`s
- future: time picker “period” translations
- future: move events to `.on`
- future: disable dates using js date objects
- future: update `htmlify` to merge paths correctly & use recursive templates with correctly delimiters
- future: add .main to package.json
- future: month and year labels using formattings
- future: highlight text within picker enables keyboard page movement
- future: move `toString` method to `create` to enable: console.log( 'hi' + picker.get('select') )
- future: infinite min/max with disabled dates should make a pseudo min/max
- future: improve `data-value` and `value` setting of both input elements (component->picker)
- future: `disablePicker` option should handle native input element & events

