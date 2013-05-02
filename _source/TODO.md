
a lot of the stuff below may never happen...


docs/fixes
----------

- themes page
- classic and fixed styling (classic needs max-height:auto)
- “escape” on IE clears input value


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

- future: improve base jquery extension `return`s
- future: time picker “period” translations
- future: move events to `.on`
- future: disable dates using js date objects
- future: add .main to package.json
- future: month and year labels using formattings
- future: highlight text within picker enables keyboard page movement
- future: move `toString` method to `create` to enable: console.log( 'hi' + picker.get('select') )
- future: infinite min/max with disabled dates should make a pseudo min/max
- future: improve `data-value` and `value` setting of both input elements (component->picker)

