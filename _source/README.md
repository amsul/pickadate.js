# {%= pkg.name %} [![{%= pkg.name %} build status](https://travis-ci.org/amsul/pickadate.js.png?branch=time-picker)](https://travis-ci.org/amsul/pickadate.js)

{%= pkg.description %}

Common events:
--------------

- `onStart`
- `onRender`
- `onOpen`
- `onClose`
- `onSet`
- `onStop`



Common methods:
---------------

- `start`
- `render`
- `stop`
- `open`
- `close`
- `isOpen`
- `get`
- `set`
- `clear`
- `disableAll`



Common options:
---------------

### Disable picker completely

- `disablePicker`






Time picker options:
--------------------

### Clear

- `clear`: 'Clear'


### The format to show on the `input` element

- `format`: 'h:i A'


### The interval between each time

- `interval`: 30


### Limits

- `min`: {Array|Boolean|Integer}
- `max`: {Array|Boolean|Integer}


### Disable times

- `disable`





Date picker options:
--------------------

### Today and clear buttons

- `today`: 'Today'
- `clear`: 'Clear'


### Months and weekdays
- `monthsFull`: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
- `monthsShort`: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
- `weekdaysFull`: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
- `weekdaysShort`: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]


### Display strings
- `showMonthsShort`: undefined
- `showWeekdaysFull`: undefined

false-y or truth-y


### The format to show on the `input` element
- `format`: 'd mmmm, yyyy'


### The format to send to the server
- `formatSubmit`: undefined

false-y or string

### Selectors

- `selectYears`: undefined
- `selectMonths`: undefined

false-y or truth-y


### First day of the week

- `firstDay`: undefined

false-y = Sunday, truth-y = Monday


### Limits

- `min`: {Array|Boolean|Integer}
- `max`: {Array|Boolean|Integer}


### Disable dates

- `disable`




<br>

---

© 2013 [Amsul](http://twitter.com/amsul_) - Licensed under [MIT](http://amsul.ca/MIT).