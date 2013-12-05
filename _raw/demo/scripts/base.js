
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true
 */




/* ==========================================================================
   Globals
   ========================================================================== */

var TODAY = new Date(2013,3,20)




/* ==========================================================================
   Date picker demos
   ========================================================================== */


/**
 * Weekday labels
 */
$( '#date_demo__weekdaysShort' ).pickadate({
    weekdaysShort: [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ],
    showMonthsShort: true
})



/**
 * Translations
 */
$( '#date_demo__translations' ).pickadate({
    monthsFull: [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ],
    monthsShort: [ 'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec' ],
    weekdaysShort: [ 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam' ],
    today: 'Aujourd\'hui',
    clear: 'Effacer',
    formatSubmit: 'yyyy/mm/dd'
})
$( '#date_demo__translations_rtl' ).pickadate({
    monthsFull: [ 'يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر' ],
    monthsShort: [ 'يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر' ],
    weekdaysFull: [ 'الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة', 'السبت' ],
    weekdaysShort: [ 'الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة', 'السبت' ],
    today: 'اليوم',
    clear: 'مسح',
    format: 'yyyy mmmm dd',
    formatSubmit: 'yyyy/mm/dd'
})



/**
 * Buttons
 */
$( '#date_demo__buttons' ).pickadate({
    // Any false-y value will hide the button.
    today: '',
    clear: 'Clear selection'
})



/**
 * Formats
 */
$( '#date_demo__formats--a' ).pickadate({
    format: 'You selecte!d: dddd, dd mmm, yyyy',
    formatSubmit: 'yyyy/mm/dd',
    hiddenPrefix: 'prefix__',
    hiddenSuffix: '__suffix',
    onSet: function( event ) {
        if ( event.select ) {
            this.$node.
                closest( '.js__fieldset' ).
                after( '<div class="section__block section__block--notification-green">' +
                    '<p>Value to submit: <code>' +
                        this.get( 'select', 'yyyy/mm/dd' ) +
                    '</code></p>' +
                    '<p>Using the name: <code>' +
                        this._hidden.name +
                    '</code></p></div>'
                )
        }
    }
})

$( '#date_demo__formats--b' ).pickadate({
    monthsFull: [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ],
    monthsShort: [ 'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec' ],
    weekdaysShort: [ 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam' ],
    today: 'aujourd\'hui',
    clear: 'effacer',
    formatSubmit: 'yyyy/mm/dd'
})



/**
 * Dropdown selectors
 */
$( '#date_demo__selectors--a' ).pickadate({
    selectYears: true,
    selectMonths: true
})
$( '#date_demo__selectors--b' ).pickadate({
    selectYears: 4
})



/**
 * Editable input
 */
$( '#date_demo__editable' ).pickadate({
    editable: true
})



/**
 * First weekday
 */
$( '#date_demo__firstDay' ).pickadate({
    firstDay: 1
})



/**
 * Limits
 */

// Limits as specific dates using JavaScript date objects.
$( '#date_demo__limits--a' ).pickadate({
    min: new Date(2013,3,20),
    max: new Date(2013,7,14)
})

// Limits as specific dates using arrays.
$( '#date_demo__limits--b' ).pickadate({
    min: [2013,3,20],
    max: [2013,7,14]
})

// Limits as dates relative to today.
$( '#date_demo__limits--c' ).pickadate({
    min: -15,
    max: true
})



/**
 * Disable dates
 */

// Disable a specific set of dates using native
// JavaScript Date objects.
$( '#date_demo__disable-dates--a' ).pickadate({
    disable: [
        new Date(2013,3,13),
        new Date(2013,3,29)
    ]
})

// Disable a specific set of dates using arrays
// formatted as [ YEAR, MONTH, DATE ].
$( '#date_demo__disable-dates--b' ).pickadate({
    disable: [
        [2013,3,3],
        [2013,3,12],
        [2013,3,20]
    ]
})

// Disable an arbitrary set of dates using integers
// from 1 - 7 representing the day of week.
$( '#date_demo__disable-dates--c' ).pickadate({
    disable: [
        1, 4, 7
    ]
})

// Set the first array item to `true` to disable all the dates.
// Then selectively enable specific or arbitrary sets of dates.
$( '#date_demo__disable-dates--d' ).pickadate({
    disable: [
        true,
        1, 4, 7,
        [2013,3,3],
        [2013,3,12],
        [2013,3,20],
        new Date(2013,3,13),
        new Date(2013,3,29)
    ]
})

// Pass “inverted” as the last paramter to flip within a range.
$( '#date_demo__disable-dates--e' ).pickadate({
    disable: [
        1,
        [2013,10,17,'inverted']
    ]
})



/**
 * Outlet container
 */
$( '#date_demo__container' ).pickadate({
    container: '#root-outlet'
})



/**
 * Date picker events
 */
$( '#date_demo__events' ).pickadate({
    onStart: function() {
        console.log( 'Hello there :)' )
    },
    onRender: function() {
        console.log( 'Whoa.. rendered anew' )
    },
    onOpen: function() {
        console.log( 'Opened up' )
    },
    onClose: function() {
        console.log( 'Closed now' )
    },
    onStop: function() {
        console.log( 'See ya.' )
    },
    onSet: function( event ) {
        console.log( 'Just set stuff:', event )
    }
})









/* ==========================================================================
   Time picker demos
   ========================================================================== */


/**
 * Translations
 */
$( '#time_demo__translations' ).pickatime({
    clear: 'effacer'
})



/**
 * Buttons
 */
$( '#time_demo__buttons' ).pickatime({
    // Any false-y value will hide the button.
    clear: ''
})



/**
 * Formats
 */
$( '#time_demo__formats--a' ).pickatime({
    format: 'T!ime selected: h:i a',
    formatLabel: '<b>h</b>:i <!i>a</!i>',
    formatSubmit: 'HH:i',
    hiddenPrefix: 'prefix__',
    hiddenSuffix: '__suffix',
    onSet: function( event ) {
        if ( event.select ) {
            this.$node.
                closest( '.js__fieldset' ).
                after( '<div class="section__block section__block--notification-green">' +
                    '<p>Value to submit: <code>' +
                        this.get( 'select', 'HH:i' ) +
                    '</code></p>' +
                    '<p>Using the name: <code>' +
                        this._hidden.name +
                    '</code></p></div>'
                )
        }
    }
})
$( '#time_demo__formats--b' ).pickatime({
    formatLabel: function(time) {
        var hours = ( time.pick - this.get('now').pick ) / 60,
            label = hours < 0 ? ' !hours to now' : hours > 0 ? ' !hours from now' : 'now'
        return 'h:i a <sm!all>' + ( hours ? Math.abs( hours ) : '' ) + label + '</sm!all>'
    }
})



/**
 * Editable input
 */
$( '#time_demo__editable' ).pickatime({
    editable: true
})



/**
 * Time intervals
 */
$( '#time_demo__interval' ).pickatime({
    interval: 150
})



/**
 * Limits
 */

// Limits as specific times using arrays.
$( '#time_demo__limits--a' ).pickatime({
    min: [7,30],
    max: [14,0]
})

// Limits as times relative to now.
$( '#time_demo__limits--b' ).pickatime({
    min: -5,
    max: true
})



/**
 * Disable times
 */

// Disable a specific set of times using arrays
// formatted as [ HOUR, MINUTE ].
$( '#time_demo__disable-times--a' ).pickatime({
    disable: [
        [0,30],
        [2,0],
        [8,30],
        [9,0]
    ]
})

// Disable an arbitrary set of times using integers
// from 0 - 23 representing the hours.
$( '#time_demo__disable-times--b' ).pickatime({
    disable: [
        3, 5, 7
    ]
})

// Set the first array item to `true` to disable all the times.
// Then selectively enable specific or arbitrary sets of times.
$( '#time_demo__disable-times--c' ).pickatime({
    disable: [
        true,
        3, 5, 7,
        [0,30],
        [2,0],
        [8,30],
        [9,0]
    ]
})

// Pass “inverted” as the last paramter to flip within a range.
$( '#time_demo__disable-times--d' ).pickatime({
    interval: 15,
    disable: [
        1,
        [1,30,'inverted']
    ]
})



/**
 * Outlet container
 */
$( '#time_demo__container' ).pickatime({
    container: '#root-outlet'
})



/**
 * Time picker events
 */
$( '#time_demo__events' ).pickatime({
    onStart: function() {
        console.log( 'Hello there :)' )
    },
    onRender: function() {
        console.log( 'Whoa.. rendered anew' )
    },
    onOpen: function() {
        console.log( 'Opened up' )
    },
    onClose: function() {
        console.log( 'Closed now' )
    },
    onStop: function() {
        console.log( 'See ya.' )
    },
    onSet: function( event ) {
        console.log( 'Just set stuff:', event )
    }
})











/* ==========================================================================
   API stuff
   ========================================================================== */



/**
 * API demo: open-close
 */
var $button_open_close = $( '#button__api-open-close' ),
    $input_open_close = $( '#demo__api-open-close' ).pickadate({
        onOpen: function() {
            $button_open_close.text( 'Close' )
        },
        onClose: function() {
            $button_open_close.text( 'Open' )
        }
    }),
    picker_open_close = $input_open_close.pickadate( 'picker' )
$button_open_close.on( 'click', function( event ) {
    if ( picker_open_close.get( 'open' ) ) {
        picker_open_close.close()
    }
    else {
        picker_open_close.open()
    }
    event.stopPropagation()
})

var $input_close_focus = $( '#demo__api-close-focus' ).pickadate(),
    picker_close_focus = $input_close_focus.pickadate( 'picker' )
$( '#button__api-close-focus' ).on( 'click', function() {
    picker_close_focus.close( true )
})

var $input_open_focus = $( '#demo__api-open-focus' ).pickadate(),
    picker_open_focus = $input_open_focus.pickadate( 'picker' )
$( '#button__api-open-focus' ).on( 'click', function( event ) {
    picker_open_focus.open( false )
    event.stopPropagation()
    $(document).on( 'click.open_focus', function() {
        picker_open_focus.close()
        $(document).off( '.open_focus' )
    })
})





/**
 * API demo: start-stop
 */
var $button_start_stop = $( '#button__api-start-stop' ),
    $input_start_stop = $( '#demo__api-start-stop' ).pickadate()

$button_start_stop.on( 'click', function( event ) {
    var text = $button_start_stop.text()
    if ( text == 'Stop' ) {
        $button_start_stop.text( 'Start' )
        $input_start_stop.pickadate( 'picker' ).stop()
    }
    else {
        $button_start_stop.text( 'Stop' )
        $input_start_stop.pickadate()
    }
    event.stopPropagation()
})



/**
 * API demo: render
 */
var addStuff = function( $element ) {
        var today = new Date(),
            todayString = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear()
        $element.find( '.picker__box' ).
            prepend('<p class="text-center" style="padding:.25em;border:2px solid red">Hello there! Today is <code>' + todayString + '</code></p>')
    },
    $button_render = $( '#button__api-render' ),
    $input_render = $( '#demo__api-render' ).pickadate(),
    picker_render = $input_render.pickadate( 'picker' )
$button_render.on( 'click', function( event ) {
    if ( $button_render.text() == 'Render' ) {
        picker_render.render()
        $button_render.text( 'Add stuff' )
    }
    else {
        addStuff( picker_render.$root )
        $button_render.text( 'Render' )
    }
    event.stopPropagation()
})



/**
 * API demo: clear
 */
var $button_clear = $( '#button__api-clear' ),
    $input_clear = $( '#demo__api-clear' ).pickadate(),
    picker_clear = $input_clear.pickadate( 'picker' )
$button_clear.on( 'click', function( event ) {
    picker_clear.clear()
    event.stopPropagation()
})



/**
 * API demo: get
 */

//value
var $button_get__value = $( '#button__api-get--value' ),
    $input_get__value = $( '#demo__api-get--value' ).pickadate(),
    picker_get__value = $input_get__value.pickadate( 'picker' )
$button_get__value.on( 'click', function( event ) {
    console.log( picker_get__value.get() )
    event.stopPropagation()
})

//select
var $input_get__select = $( '#demo__api-get--select' ).pickadate(),
    picker_get__select = $input_get__select.pickadate( 'picker' )
$( '#button__api-get--select' ).on( 'click', function( event ) {
    console.log( picker_get__select.get( 'select' ) )
    event.stopPropagation()
})
var $input_get__select_format = $( '#demo__api-get--select-format' ).pickadate(),
    picker_get__select_format = $input_get__select_format.pickadate( 'picker' )
$( '#button__api-get--select-format' ).on( 'click', function( event ) {
    console.log( picker_get__select_format.get( 'select', 'yyyy/mm/dd' ) )
    event.stopPropagation()
})

//highlight
var $input_get__highlight = $( '#demo__api-get--highlight' ).pickadate(),
    picker_get__highlight = $input_get__highlight.pickadate( 'picker' )
$( '#button__api-get--highlight' ).on( 'click', function( event ) {
    console.log( picker_get__highlight.get( 'highlight' ) )
    event.stopPropagation()
})
var $input_get__highlight_format = $( '#demo__api-get--highlight-format' ).pickadate(),
    picker_get__highlight_format = $input_get__highlight_format.pickadate( 'picker' )
$( '#button__api-get--highlight-format' ).on( 'click', function( event ) {
    console.log( picker_get__highlight_format.get( 'highlight', 'yyyy/mm/dd' ) )
    event.stopPropagation()
})

//view
var $input_get__view = $( '#demo__api-get--view' ).pickadate(),
    picker_get__view = $input_get__view.pickadate( 'picker' )
$( '#button__api-get--view' ).on( 'click', function( event ) {
    console.log( picker_get__view.get( 'view' ) )
    event.stopPropagation()
})
var $input_get__view_format = $( '#demo__api-get--view-format' ).pickadate(),
    picker_get__view_format = $input_get__view_format.pickadate( 'picker' )
$( '#button__api-get--view-format' ).on( 'click', function( event ) {
    console.log( picker_get__view_format.get( 'view', 'yyyy/mm/dd' ) )
    event.stopPropagation()
})

//min
var $input_get__min = $( '#demo__api-get--min' ).pickadate({
        min: [TODAY.getFullYear(),TODAY.getMonth(),TODAY.getDate()]
    }),
    picker_get__min = $input_get__min.pickadate( 'picker' )
$( '#button__api-get--min' ).on( 'click', function( event ) {
    console.log( picker_get__min.get( 'min' ) )
    event.stopPropagation()
})
var $input_get__min_format = $( '#demo__api-get--min-format' ).pickadate({
        min: [TODAY.getFullYear(),TODAY.getMonth(),TODAY.getDate()]
    }),
    picker_get__min_format = $input_get__min_format.pickadate( 'picker' )
$( '#button__api-get--min-format' ).on( 'click', function( event ) {
    console.log( picker_get__min_format.get( 'min', 'yyyy/mm/dd' ) )
    event.stopPropagation()
})

//max
var $input_get__max = $( '#demo__api-get--max' ).pickadate({
        max: [TODAY.getFullYear()+2,TODAY.getMonth(),TODAY.getDate()]
    }),
    picker_get__max = $input_get__max.pickadate( 'picker' )
$( '#button__api-get--max' ).on( 'click', function( event ) {
    console.log( picker_get__max.get( 'max' ) )
    event.stopPropagation()
})
var $input_get__max_format = $( '#demo__api-get--max-format' ).pickadate({
        max: [TODAY.getFullYear()+2,TODAY.getMonth(),TODAY.getDate()]
    }),
    picker_get__max_format = $input_get__max_format.pickadate( 'picker' )
$( '#button__api-get--max-format' ).on( 'click', function( event ) {
    console.log( picker_get__max_format.get( 'max', 'yyyy/mm/dd' ) )
    event.stopPropagation()
})

//open
var $input_get__open = $( '#demo__api-get--open' ).pickadate({
        onOpen: function() {
            console.log( 'Open state:', picker_get__open.get( 'open' ) )
        }
    }),
    picker_get__open = $input_get__open.pickadate( 'picker' )
$( '#button__api-get--open' ).on( 'click', function( event ) {
    console.log( 'Open state:', picker_get__open.get( 'open' ) )
    event.stopPropagation()
})

//start
var $input_get__start = $( '#demo__api-get--start' ).pickadate(),
    picker_get__start = $input_get__start.pickadate( 'picker' )
$( '#button__api-get--start' ).on( 'click', function( event ) {
    console.log( 'Start state:', picker_get__start.get( 'start' ) )
    event.stopPropagation()
})
$( '#button__api-get--start-stop' ).on( 'click', function( event ) {
    var $this = $( this )
    if ( $this.text() == 'Stop picker' ) {
        picker_get__start.stop()
        $this.text( 'Start picker' )
    }
    else {
        picker_get__start.start()
        $this.text( 'Stop picker' )
    }
    event.stopPropagation()
})

//id
var $input_get__id = $( '#demo__api-get--id' ).pickadate(),
    picker_get__id = $input_get__id.pickadate( 'picker' )
$( '#button__api-get--id' ).on( 'click', function( event ) {
    console.log( picker_get__id.get( 'id' ) )
    event.stopPropagation()
})

//disable
var $input_get__disable = $( '#demo__api-get--disable' ).pickadate({
        disable: [
            1,4,7,
            [TODAY.getFullYear(),TODAY.getMonth(),8],
            [TODAY.getFullYear(),TODAY.getMonth(),19],
            new Date(TODAY.getFullYear(),TODAY.getMonth(),26)
        ]
    }),
    picker_get__disable = $input_get__disable.pickadate( 'picker' )
$( '#button__api-get--disable' ).on( 'click', function( event ) {
    console.log( 'Base picker state:', picker_get__disable.get( 'enable' ) )
    console.log( 'Dates to disabled:', picker_get__disable.get( 'disable' ) )
    event.stopPropagation()
})
var $input_get__enable = $( '#demo__api-get--enable' ).pickadate({
        disable: [
            true,
            1,4,7,
            [TODAY.getFullYear(),TODAY.getMonth(),8],
            [TODAY.getFullYear(),TODAY.getMonth(),19],
            new Date(TODAY.getFullYear(),TODAY.getMonth(),26)
        ]
    }),
    picker_get__enable = $input_get__enable.pickadate( 'picker' )
$( '#button__api-get--enable' ).on( 'click', function( event ) {
    console.log( 'Base picker state:', picker_get__enable.get( 'enable' ) )
    console.log( 'Dates *not* to disabled:', picker_get__enable.get( 'disable' ) )
    event.stopPropagation()
})



/**
 * API demo: set
 */

//select: clear
var $input_set_clear = $( '#demo__api-set-clear' ).pickadate(),
    picker_set_clear = $input_set_clear.pickadate( 'picker' )
$( '#button__api-set-clear' ).on( 'click', function( event ) {
    picker_set_clear.clear()
    event.stopPropagation()
})

//select: date
var $input_set__select_date = $( '#demo__api-set--select-date' ).pickadate(),
    picker_set__select_date = $input_set__select_date.pickadate( 'picker' )
$( '#button__api-set--select-date-array' ).on( 'click', function( event ) {
    picker_set__select_date.set( 'select', [TODAY.getFullYear(),TODAY.getMonth(),TODAY.getDate()] )
    event.stopPropagation()
})
$( '#button__api-set--select-date-js' ).on( 'click', function( event ) {
    var dateToSet = new Date( TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 10 )
    picker_set__select_date.set( 'select', dateToSet )
    event.stopPropagation()
})
$( '#button__api-set--select-date-integer' ).on( 'click', function( event ) {
    picker_set__select_date.set( 'select', TODAY.getTime() + 468487654 )
    event.stopPropagation()
})

//select: time
var $input_set__select_time = $( '#demo__api-set--select-time' ).pickatime(),
    picker_set__select_time = $input_set__select_time.pickatime( 'picker' )
$( '#button__api-set--select-time-array' ).on( 'click', function( event ) {
    picker_set__select_time.set( 'select', [3,0] )
    event.stopPropagation()
})
$( '#button__api-set--select-time-js' ).on( 'click', function( event ) {
    picker_set__select_time.set( 'select', new Date( TODAY.getTime() + 468487654 ) )
    event.stopPropagation()
})
$( '#button__api-set--select-time-integer' ).on( 'click', function( event ) {
    picker_set__select_time.set( 'select', 540 )
    event.stopPropagation()
})

//highlight: date
var $input_set__highlight_date = $( '#demo__api-set--highlight-date' ).pickadate(),
    picker_set__highlight_date = $input_set__highlight_date.pickadate( 'picker' )
$( '#button__api-set--highlight-date-array' ).on( 'click', function( event ) {
    picker_set__highlight_date.set( 'highlight', [TODAY.getFullYear(),TODAY.getMonth(),TODAY.getDate()] )
    event.stopPropagation()
})
$( '#button__api-set--highlight-date-js' ).on( 'click', function( event ) {
    var dateToSet = new Date( TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 10 )
    picker_set__highlight_date.set( 'highlight', dateToSet )
    event.stopPropagation()
})
$( '#button__api-set--highlight-date-integer' ).on( 'click', function( event ) {
    picker_set__highlight_date.set( 'highlight', TODAY.getTime() + 468487654 )
    event.stopPropagation()
})

//highlight: time
var $input_set__highlight_time = $( '#demo__api-set--highlight-time' ).pickatime(),
    picker_set__highlight_time = $input_set__highlight_time.pickatime( 'picker' )
$( '#button__api-set--highlight-time-array' ).on( 'click', function( event ) {
    picker_set__highlight_time.set( 'highlight', [15,30] )
    event.stopPropagation()
})
$( '#button__api-set--highlight-time-js' ).on( 'click', function( event ) {
    picker_set__highlight_time.set( 'highlight', new Date( TODAY.getTime() + 468487654 ) )
    event.stopPropagation()
})
$( '#button__api-set--highlight-time-integer' ).on( 'click', function( event ) {
    picker_set__highlight_time.set( 'highlight', 1080 )
    event.stopPropagation()
})

//view: date
var $input_set__view_date = $( '#demo__api-set--view-date' ).pickadate(),
    picker_set__view_date = $input_set__view_date.pickadate( 'picker' )
$( '#button__api-set--view-date-array' ).on( 'click', function( event ) {
    picker_set__view_date.set( 'view', [2000,3,20] )
    event.stopPropagation()
})
$( '#button__api-set--view-date-js' ).on( 'click', function( event ) {
    picker_set__view_date.set( 'view', new Date(1988,7,14) )
    event.stopPropagation()
})
$( '#button__api-set--view-date-integer' ).on( 'click', function( event ) {
    picker_set__view_date.set( 'view', 1587355200000 )
    event.stopPropagation()
})

//view: time
var $input_set__view_time = $( '#demo__api-set--view-time' ).pickatime(),
    picker_set__view_time = $input_set__view_time.pickatime( 'picker' )
$( '#button__api-set--view-time-array' ).on( 'click', function( event ) {
    picker_set__view_time.set( 'view', [15,30] )
    event.stopPropagation()
})
$( '#button__api-set--view-time-js' ).on( 'click', function( event ) {
    picker_set__view_time.set( 'view', new Date( TODAY.getTime() + 468487654 ) )
    event.stopPropagation()
})
$( '#button__api-set--view-time-integer' ).on( 'click', function( event ) {
    picker_set__view_time.set( 'view', 1080 )
    event.stopPropagation()
})

//min: date
var $input_set__min_date = $( '#demo__api-set--min-date' ).pickadate(),
    picker_set__min_date = $input_set__min_date.pickadate( 'picker' )
$( '#button__api-set--min-date-array' ).on( 'click', function( event ) {
    picker_set__min_date.set( 'min', [2013,3,20] )
    event.stopPropagation()
})
$( '#button__api-set--min-date-js' ).on( 'click', function( event ) {
    picker_set__min_date.set( 'min', new Date(2013,7,14) )
    event.stopPropagation()
})
$( '#button__api-set--min-date-integer' ).on( 'click', function( event ) {
    picker_set__min_date.set( 'min', -4 )
    event.stopPropagation()
})
$( '#button__api-set--min-date-true' ).on( 'click', function( event ) {
    picker_set__min_date.set( 'min', true )
    event.stopPropagation()
})
$( '#button__api-set--min-date-false' ).on( 'click', function( event ) {
    picker_set__min_date.set( 'min', false )
    event.stopPropagation()
})

//min: time
var $input_set__min_time = $( '#demo__api-set--min-time' ).pickatime(),
    picker_set__min_time = $input_set__min_time.pickatime( 'picker' )
$( '#button__api-set--min-time-array' ).on( 'click', function( event ) {
    picker_set__min_time.set( 'min', [15,30] )
    event.stopPropagation()
})
$( '#button__api-set--min-time-js' ).on( 'click', function( event ) {
    picker_set__min_time.set( 'min', new Date( TODAY.getTime() + 468487654 ) )
    event.stopPropagation()
})
$( '#button__api-set--min-time-integer' ).on( 'click', function( event ) {
    picker_set__min_time.set( 'min', -4 )
    event.stopPropagation()
})
$( '#button__api-set--min-time-true' ).on( 'click', function( event ) {
    picker_set__min_time.set( 'min', true )
    event.stopPropagation()
})
$( '#button__api-set--min-time-false' ).on( 'click', function( event ) {
    picker_set__min_time.set( 'min', false )
    event.stopPropagation()
})

//max: date
var $input_set__max_date = $( '#demo__api-set--max-date' ).pickadate(),
    picker_set__max_date = $input_set__max_date.pickadate( 'picker' )
$( '#button__api-set--max-date-array' ).on( 'click', function( event ) {
    picker_set__max_date.set( 'max', [2013,3,20] )
    event.stopPropagation()
})
$( '#button__api-set--max-date-js' ).on( 'click', function( event ) {
    picker_set__max_date.set( 'max', new Date(2013,7,14) )
    event.stopPropagation()
})
$( '#button__api-set--max-date-integer' ).on( 'click', function( event ) {
    picker_set__max_date.set( 'max', 4 )
    event.stopPropagation()
})
$( '#button__api-set--max-date-true' ).on( 'click', function( event ) {
    picker_set__max_date.set( 'max', true )
    event.stopPropagation()
})
$( '#button__api-set--max-date-false' ).on( 'click', function( event ) {
    picker_set__max_date.set( 'max', false )
    event.stopPropagation()
})

//max: time
var $input_set__max_time = $( '#demo__api-set--max-time' ).pickatime(),
    picker_set__max_time = $input_set__max_time.pickatime( 'picker' )
$( '#button__api-set--max-time-array' ).on( 'click', function( event ) {
    picker_set__max_time.set( 'max', [15,30] )
    event.stopPropagation()
})
$( '#button__api-set--max-time-js' ).on( 'click', function( event ) {
    picker_set__max_time.set( 'max', new Date( TODAY.getTime() + 468487654 ) )
    event.stopPropagation()
})
$( '#button__api-set--max-time-integer' ).on( 'click', function( event ) {
    picker_set__max_time.set( 'max', 4 )
    event.stopPropagation()
})
$( '#button__api-set--max-time-true' ).on( 'click', function( event ) {
    picker_set__max_time.set( 'max', true )
    event.stopPropagation()
})
$( '#button__api-set--max-time-false' ).on( 'click', function( event ) {
    picker_set__max_time.set( 'max', false )
    event.stopPropagation()
})

//disable: date
var $input_set__disable_date = $( '#demo__api-set--disable-date' ).pickadate(),
    picker_set__disable_date = $input_set__disable_date.pickadate( 'picker' )
$( '#button__api-set--disable-date-array' ).on( 'click', function( event ) {
    picker_set__disable_date.set( 'disable', [ [2013,9,3], [2013,9,9], [2013,9,20] ])
    event.stopPropagation()
})
$( '#button__api-set--disable-date-js' ).on( 'click', function( event ) {
    picker_set__disable_date.set( 'disable', [ new Date(2013,9,13), new Date(2013,9,24) ])
    event.stopPropagation()
})
$( '#button__api-set--disable-date-integer' ).on( 'click', function( event ) {
    picker_set__disable_date.set( 'disable', [ 1, 4, 7 ])
    event.stopPropagation()
})
$( '#button__api-set--disable-date-true' ).on( 'click', function( event ) {
    picker_set__disable_date.set( 'disable', true )
    event.stopPropagation()
})
$( '#button__api-set--disable-date-false' ).on( 'click', function( event ) {
    picker_set__disable_date.set( 'disable', false )
    event.stopPropagation()
})
$( '#button__api-set--disable-date-flip' ).on( 'click', function( event ) {
    picker_set__disable_date.set( 'disable', 'flip' )
    event.stopPropagation()
})

//disable: time
var $input_set__disable_time = $( '#demo__api-set--disable-time' ).pickatime(),
    picker_set__disable_time = $input_set__disable_time.pickatime( 'picker' )
$( '#button__api-set--disable-time-array' ).on( 'click', function( event ) {
    picker_set__disable_time.set( 'disable', [ [2,30], [4,30], [9,0] ])
    event.stopPropagation()
})
$( '#button__api-set--disable-time-js' ).on( 'click', function( event ) {
    picker_set__disable_time.set( 'disable', [ new Date(2013,9,13,6), new Date(2013,9,13,12,30) ])
    event.stopPropagation()
})
$( '#button__api-set--disable-time-integer' ).on( 'click', function( event ) {
    picker_set__disable_time.set( 'disable', [ 1, 4, 7 ])
    event.stopPropagation()
})
$( '#button__api-set--disable-time-true' ).on( 'click', function( event ) {
    picker_set__disable_time.set( 'disable', true )
    event.stopPropagation()
})
$( '#button__api-set--disable-time-false' ).on( 'click', function( event ) {
    picker_set__disable_time.set( 'disable', false )
    event.stopPropagation()
})
$( '#button__api-set--disable-time-flip' ).on( 'click', function( event ) {
    picker_set__disable_time.set( 'disable', 'flip' )
    event.stopPropagation()
})

//enable: date
var $input_set__enable_date = $( '#demo__api-set--enable-date' ).pickadate(),
    picker_set__enable_date = $input_set__enable_date.pickadate( 'picker' )
$( '#button__api-set--enable-date-array' ).on( 'click', function( event ) {
    picker_set__enable_date.set( 'enable', [ [2013,9,3], [2013,9,9], [2013,9,20] ])
    event.stopPropagation()
})
$( '#button__api-set--enable-time-js' ).on( 'click', function( event ) {
    picker_set__enable_time.set( 'enable', [ new Date(2013,9,13,6), new Date(2013,9,13,12,30) ])
    event.stopPropagation()
})
$( '#button__api-set--enable-date-js' ).on( 'click', function( event ) {
    picker_set__enable_date.set( 'enable', [ new Date(2013,9,13), new Date(2013,9,24) ])
    event.stopPropagation()
})
$( '#button__api-set--enable-date-integer' ).on( 'click', function( event ) {
    picker_set__enable_date.set( 'enable', [ 1, 4, 7 ])
    event.stopPropagation()
})
$( '#button__api-set--enable-date-true' ).on( 'click', function( event ) {
    picker_set__enable_date.set( 'enable', true )
    event.stopPropagation()
})
$( '#button__api-set--enable-date-false' ).on( 'click', function( event ) {
    picker_set__enable_date.set( 'enable', false )
    event.stopPropagation()
})
$( '#button__api-set--enable-date-flip' ).on( 'click', function( event ) {
    picker_set__enable_date.set( 'enable', 'flip' )
    event.stopPropagation()
})

//enable: time
var $input_set__enable_time = $( '#demo__api-set--enable-time' ).pickatime(),
    picker_set__enable_time = $input_set__enable_time.pickatime( 'picker' )
$( '#button__api-set--enable-time-array' ).on( 'click', function( event ) {
    picker_set__enable_time.set( 'enable', [ [2,30], [4,30], [9,0] ])
    event.stopPropagation()
})
$( '#button__api-set--enable-time-integer' ).on( 'click', function( event ) {
    picker_set__enable_time.set( 'enable', [ 1, 4, 7 ])
    event.stopPropagation()
})
$( '#button__api-set--enable-time-true' ).on( 'click', function( event ) {
    picker_set__enable_time.set( 'enable', true )
    event.stopPropagation()
})
$( '#button__api-set--enable-time-false' ).on( 'click', function( event ) {
    picker_set__enable_time.set( 'enable', false )
    event.stopPropagation()
})
$( '#button__api-set--enable-time-flip' ).on( 'click', function( event ) {
    picker_set__enable_time.set( 'enable', 'flip' )
    event.stopPropagation()
})

//enable/disable: range
var $input_set__enable_disable_in_range_date = $( '#demo__api-set--enable-disable-in-range-date' ).pickadate({
        disable: [ 1, [2013, 10, 17, 'inverted'] ]
    }),
    picker_set__enable_disable_in_range_date = $input_set__enable_disable_in_range_date.pickadate( 'picker' )
var $input_set__enable_disable_in_range_time = $( '#demo__api-set--enable-disable-in-range-time' ).pickatime({
        disable: [ 1, [1, 30, 'inverted'] ],
        interval: 15
    }),
    picker_set__enable_disable_in_range_time = $input_set__enable_disable_in_range_time.pickatime( 'picker' )

//interval: time
var $input_set__interval_time = $( '#demo__api-set--interval' ).pickatime(),
    picker_set__interval_time = $input_set__interval_time.pickatime( 'picker' )
$( '#button__api-set--interval-fifteen' ).on( 'click', function( event ) {
    picker_set__interval_time.set( 'interval', 15 )
    event.stopPropagation()
})
$( '#button__api-set--interval-twenty' ).on( 'click', function( event ) {
    picker_set__interval_time.set( 'interval', 20 )
    event.stopPropagation()
})
$( '#button__api-set--interval-onetwenty' ).on( 'click', function( event ) {
    picker_set__interval_time.set( 'interval', 120 )
    event.stopPropagation()
})



/**
 * API events and callbacks
 */

// callback: options
var $input_callback_options = $( '#demo__api-callback-options' ).pickadate({
        onOpen: function() {
            console.log('Opened up!')
        },
        onClose: function() {
            console.log('Closed now')
        },
        onRender: function() {
            console.log('Just rendered anew')
        },
        onStart: function() {
            console.log('Hello there :)')
        },
        onStop: function() {
            console.log('See ya')
        },
        onSet: function(thingSet) {
            console.log('Set stuff:', thingSet)
        }
    }),
    picker_callback_options = $input_callback_options.pickadate( 'picker' )
$( '#button__api-callback-options' ).on( 'click', function( event ) {
    if ( this.innerHTML == 'Stop' ) {
        picker_callback_options.stop()
        this.innerHTML = 'Start'
    }
    else {
        picker_callback_options.start()
        this.innerHTML = 'Stop'
    }
    event.stopPropagation()
})


// callback: bindings
var $input_callback_bindings = $( '#demo__api-callback-bindings' ).pickadate()
    picker_callback_bindings = $input_callback_bindings.pickadate( 'picker' )
if ( picker_callback_bindings ) {
    picker_callback_bindings.on({
        open: function() {
            console.log('Opened up!')
        },
        close: function() {
            console.log('Closed now')
        },
        render: function() {
            console.log('Just rendered anew')
        },
        start: function() {
            console.log('Hello there :)')
        },
        stop: function() {
            console.log('See ya')
        },
        set: function(thingSet) {
            console.log('Set stuff:', thingSet)
        }
    })
    $( '#button__api-callback-bindings' ).on( 'click', function( event ) {
        if ( this.innerHTML == 'Stop' ) {
            picker_callback_bindings.stop()
            this.innerHTML = 'Start'
        }
        else {
            picker_callback_bindings.start()
            this.innerHTML = 'Stop'
        }
        event.stopPropagation()
    })
}


// trigger events
var $input_method_trigger = $( '#demo__api-method-trigger' ).pickadate(),
    picker_method_trigger = $input_method_trigger.pickadate( 'picker' )
if ( picker_method_trigger ) {
    picker_method_trigger.on( 'open', function() {
        console.log( 'Didn’t open.. yet here I am!' )
    })
    $( '#button__api-method-trigger' ).on( 'click', function( event ) {
        picker_method_trigger.trigger( 'open' )
        event.stopPropagation()
    })
}




/**
 * API objects
 */

//$node
var $input_object__node = $( '#demo__api-object--node' ).pickadate(),
    picker_object__node = $input_object__node.pickadate( 'picker' )
$( '#button__api-object--node' ).on( 'click', function( event ) {
    console.log( picker_object__node.$node )
    event.stopPropagation()
})

//$root
var $input_object__holder = $( '#demo__api-object--holder' ).pickadate(),
    picker_object__holder = $input_object__holder.pickadate( 'picker' )
$( '#button__api-object--holder' ).on( 'click', function( event ) {
    console.log( picker_object__holder.$root )
    event.stopPropagation()
})



/*
 * Initialize all the others
 */
$( '.js__datepicker' ).pickadate()
$( '.js__timepicker' ).pickatime()








/* ==========================================================================
   Themes demos
   ========================================================================== */

$( '#theme__default_date, #theme__classic_date' ).pickadate()
$( '#theme__default_time, #theme__classic_time' ).pickatime()






/* ==========================================================================
   Theme switcher widget
   ========================================================================== */

var themeSelected = window.localStorage ? localStorage.getItem( 'theme' ) : '',
    $themeLinks = $( '#theme_base, #theme_date, #theme_time' ),
    updateStylingLinks = function( value ) {
        value = value || 'default'
        $( '#show_theme_' + value ).attr( 'checked', true )
        $themeLinks.detach()
        $themeLinks.each( function() {
            this.href = this.href.replace( /(.+\/)(\w+)(.+)/, '$1' + value + '$3' )
        })
        $themeLinks.appendTo( 'head' )
    }

if ( themeSelected ) {
    updateStylingLinks( themeSelected )
}

$( '[name=show_theme]' ).on( 'change', function() {
    var value = this.value
    updateStylingLinks( value )
    if ( window.localStorage ) {
        localStorage.setItem( 'theme', value )
    }
})



