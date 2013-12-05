
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




/**
 * Copyright 2013 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Rainbow is a simple code syntax highlighter
 *
 * @preserve @version 1.2
 * @url rainbowco.de
 */
window['Rainbow'] = (function() {

    /**
     * array of replacements to process at the end
     *
     * @type {Object}
     */
    var replacements = {},

        /**
         * an array of start and end positions of blocks to be replaced
         *
         * @type {Object}
         */
        replacement_positions = {},

        /**
         * an array of the language patterns specified for each language
         *
         * @type {Object}
         */
        language_patterns = {},

        /**
         * an array of languages and whether they should bypass the default patterns
         *
         * @type {Object}
         */
        bypass_defaults = {},

        /**
         * processing level
         *
         * replacements are stored at this level so if there is a sub block of code
         * (for example php inside of html) it runs at a different level
         *
         * @type {number}
         */
        CURRENT_LEVEL = 0,

        /**
         * constant used to refer to the default language
         *
         * @type {number}
         */
        DEFAULT_LANGUAGE = 0,

        /**
         * used as counters so we can selectively call setTimeout
         * after processing a certain number of matches/replacements
         *
         * @type {number}
         */
        match_counter = 0,

        /**
         * @type {number}
         */
        replacement_counter = 0,

        /**
         * @type {null|string}
         */
        global_class,

        /**
         * @type {null|Function}
         */
        onHighlight;

    /**
     * cross browser get attribute for an element
     *
     * @see http://stackoverflow.com/questions/3755227/cross-browser-javascript-getattribute-method
     *
     * @param {Node} el
     * @param {string} attr     attribute you are trying to get
     * @returns {string|number}
     */
    function _attr(el, attr, attrs, i) {
        var result = (el.getAttribute && el.getAttribute(attr)) || 0;

        if (!result) {
            attrs = el.attributes;

            for (i = 0; i < attrs.length; ++i) {
                if (attrs[i].nodeName === attr) {
                    return attrs[i].nodeValue;
                }
            }
        }

        return result;
    }

    /**
     * adds a class to a given code block
     *
     * @param {Element} el
     * @param {string} class_name   class name to add
     * @returns void
     */
    function _addClass(el, class_name) {
        el.className += el.className ? ' ' + class_name : class_name;
    }

    /**
     * checks if a block has a given class
     *
     * @param {Element} el
     * @param {string} class_name   class name to check for
     * @returns {boolean}
     */
    function _hasClass(el, class_name) {
        return (' ' + el.className + ' ').indexOf(' ' + class_name + ' ') > -1;
    }

    /**
     * gets the language for this block of code
     *
     * @param {Element} block
     * @returns {string|null}
     */
    function _getLanguageForBlock(block) {

        // if this doesn't have a language but the parent does then use that
        // this means if for example you have: <pre data-language="php">
        // with a bunch of <code> blocks inside then you do not have
        // to specify the language for each block
        var language = _attr(block, 'data-language') || _attr(block.parentNode, 'data-language');

        // this adds support for specifying language via a css class
        // you can use the Google Code Prettify style: <pre class="lang-php">
        // or the HTML5 style: <pre><code class="language-php">
        if (!language) {
            var pattern = /\blang(?:uage)?-(\w+)/,
                match = block.className.match(pattern) || block.parentNode.className.match(pattern);

            if (match) {
                language = match[1];
            }
        }

        return language;
    }

    /**
     * makes sure html entities are always used for tags
     *
     * @param {string} code
     * @returns {string}
     */
    function _htmlEntities(code) {
        // I'd rather do that at the template level.
        return code;//.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&(?![\w\#]+;)/g, '&amp;');
    }

    /**
     * determines if a new match intersects with an existing one
     *
     * @param {number} start1    start position of existing match
     * @param {number} end1      end position of existing match
     * @param {number} start2    start position of new match
     * @param {number} end2      end position of new match
     * @returns {boolean}
     */
    function _intersects(start1, end1, start2, end2) {
        if (start2 >= start1 && start2 < end1) {
            return true;
        }

        return end2 > start1 && end2 < end1;
    }

    /**
     * determines if two different matches have complete overlap with each other
     *
     * @param {number} start1   start position of existing match
     * @param {number} end1     end position of existing match
     * @param {number} start2   start position of new match
     * @param {number} end2     end position of new match
     * @returns {boolean}
     */
    function _hasCompleteOverlap(start1, end1, start2, end2) {

        // if the starting and end positions are exactly the same
        // then the first one should stay and this one should be ignored
        if (start2 == start1 && end2 == end1) {
            return false;
        }

        return start2 <= start1 && end2 >= end1;
    }

    /**
     * determines if the match passed in falls inside of an existing match
     * this prevents a regex pattern from matching inside of a bigger pattern
     *
     * @param {number} start - start position of new match
     * @param {number} end - end position of new match
     * @returns {boolean}
     */
    function _matchIsInsideOtherMatch(start, end) {
        for (var key in replacement_positions[CURRENT_LEVEL]) {
            key = parseInt(key, 10);

            // if this block completely overlaps with another block
            // then we should remove the other block and return false
            if (_hasCompleteOverlap(key, replacement_positions[CURRENT_LEVEL][key], start, end)) {
                delete replacement_positions[CURRENT_LEVEL][key];
                delete replacements[CURRENT_LEVEL][key];
            }

            if (_intersects(key, replacement_positions[CURRENT_LEVEL][key], start, end)) {
                return true;
            }
        }

        return false;
    }

    /**
     * takes a string of code and wraps it in a span tag based on the name
     *
     * @param {string} name     name of the pattern (ie keyword.regex)
     * @param {string} code     block of code to wrap
     * @returns {string}
     */
    function _wrapCodeInSpan(name, code) {
        return '<span class="' + name.replace(/\./g, ' ') + (global_class ? ' ' + global_class : '') + '">' + code + '</span>';
    }

    /**
     * finds out the position of group match for a regular expression
     *
     * @see http://stackoverflow.com/questions/1985594/how-to-find-index-of-groups-in-match
     *
     * @param {Object} match
     * @param {number} group_number
     * @returns {number}
     */
    function _indexOfGroup(match, group_number) {
        var index = 0,
            i;

        for (i = 1; i < group_number; ++i) {
            if (match[i]) {
                index += match[i].length;
            }
        }

        return index;
    }

    /**
     * matches a regex pattern against a block of code
     * finds all matches that should be processed and stores the positions
     * of where they should be replaced within the string
     *
     * this is where pretty much all the work is done but it should not
     * be called directly
     *
     * @param {RegExp} pattern
     * @param {string} code
     * @returns void
     */
    function _processPattern(regex, pattern, code, callback)
    {
        var match = regex.exec(code);

        if (!match) {
            return callback();
        }

        ++match_counter;

        // treat match 0 the same way as name
        if (!pattern['name'] && typeof pattern['matches'][0] == 'string') {
            pattern['name'] = pattern['matches'][0];
            delete pattern['matches'][0];
        }

        var replacement = match[0],
            start_pos = match.index,
            end_pos = match[0].length + start_pos,

            /**
             * callback to process the next match of this pattern
             */
            processNext = function() {
                var nextCall = function() {
                    _processPattern(regex, pattern, code, callback);
                };

                // every 100 items we process let's call set timeout
                // to let the ui breathe a little
                return match_counter % 100 > 0 ? nextCall() : setTimeout(nextCall, 0);
            };

        // if this is not a child match and it falls inside of another
        // match that already happened we should skip it and continue processing
        if (_matchIsInsideOtherMatch(start_pos, end_pos)) {
            return processNext();
        }

        /**
         * callback for when a match was successfully processed
         *
         * @param {string} replacement
         * @returns void
         */
        var onMatchSuccess = function(replacement) {
                // if this match has a name then wrap it in a span tag
                if (pattern['name']) {
                    replacement = _wrapCodeInSpan(pattern['name'], replacement);
                }

                // console.log('LEVEL', CURRENT_LEVEL, 'replace', match[0], 'with', replacement, 'at position', start_pos, 'to', end_pos);

                // store what needs to be replaced with what at this position
                if (!replacements[CURRENT_LEVEL]) {
                    replacements[CURRENT_LEVEL] = {};
                    replacement_positions[CURRENT_LEVEL] = {};
                }

                replacements[CURRENT_LEVEL][start_pos] = {
                    'replace': match[0],
                    'with': replacement
                };

                // store the range of this match so we can use it for comparisons
                // with other matches later
                replacement_positions[CURRENT_LEVEL][start_pos] = end_pos;

                // process the next match
                processNext();
            },

            // if this pattern has sub matches for different groups in the regex
            // then we should process them one at a time by rerunning them through
            // this function to generate the new replacement
            //
            // we run through them backwards because the match position of earlier
            // matches will not change depending on what gets replaced in later
            // matches
            group_keys = keys(pattern['matches']),

            /**
             * callback for processing a sub group
             *
             * @param {number} i
             * @param {Array} group_keys
             * @param {Function} callback
             */
            processGroup = function(i, group_keys, callback) {
                if (i >= group_keys.length) {
                    return callback(replacement);
                }

                var processNextGroup = function() {
                        processGroup(++i, group_keys, callback);
                    },
                    block = match[group_keys[i]];

                // if there is no match here then move on
                if (!block) {
                    return processNextGroup();
                }

                var group = pattern['matches'][group_keys[i]],
                    language = group['language'],

                    /**
                     * process group is what group we should use to actually process
                     * this match group
                     *
                     * for example if the subgroup pattern looks like this
                     * 2: {
                     *     'name': 'keyword',
                     *     'pattern': /true/g
                     * }
                     *
                     * then we use that as is, but if it looks like this
                     *
                     * 2: {
                     *     'name': 'keyword',
                     *     'matches': {
                     *          'name': 'special',
                     *          'pattern': /whatever/g
                     *      }
                     * }
                     *
                     * we treat the 'matches' part as the pattern and keep
                     * the name around to wrap it with later
                     */
                    process_group = group['name'] && group['matches'] ? group['matches'] : group,

                    /**
                     * takes the code block matched at this group, replaces it
                     * with the highlighted block, and optionally wraps it with
                     * a span with a name
                     *
                     * @param {string} block
                     * @param {string} replace_block
                     * @param {string|null} match_name
                     */
                    _replaceAndContinue = function(block, replace_block, match_name) {
                        replacement = _replaceAtPosition(_indexOfGroup(match, group_keys[i]), block, match_name ? _wrapCodeInSpan(match_name, replace_block) : replace_block, replacement);
                        processNextGroup();
                    };

                // if this is a sublanguage go and process the block using that language
                if (language) {
                    return _highlightBlockForLanguage(block, language, function(code) {
                        _replaceAndContinue(block, code);
                    });
                }

                // if this is a string then this match is directly mapped to selector
                // so all we have to do is wrap it in a span and continue
                if (typeof group === 'string') {
                    return _replaceAndContinue(block, block, group);
                }

                // the process group can be a single pattern or an array of patterns
                // _processCodeWithPatterns always expects an array so we convert it here
                _processCodeWithPatterns(block, process_group.length ? process_group : [process_group], function(code) {
                    _replaceAndContinue(block, code, group['matches'] ? group['name'] : 0);
                });
            };

        processGroup(0, group_keys, onMatchSuccess);
    }

    /**
     * should a language bypass the default patterns?
     *
     * if you call Rainbow.extend() and pass true as the third argument
     * it will bypass the defaults
     */
    function _bypassDefaultPatterns(language)
    {
        return bypass_defaults[language];
    }

    /**
     * returns a list of regex patterns for this language
     *
     * @param {string} language
     * @returns {Array}
     */
    function _getPatternsForLanguage(language) {
        var patterns = language_patterns[language] || [],
            default_patterns = language_patterns[DEFAULT_LANGUAGE] || [];

        return _bypassDefaultPatterns(language) ? patterns : patterns.concat(default_patterns);
    }

    /**
     * substring replace call to replace part of a string at a certain position
     *
     * @param {number} position         the position where the replacement should happen
     * @param {string} replace          the text we want to replace
     * @param {string} replace_with     the text we want to replace it with
     * @param {string} code             the code we are doing the replacing in
     * @returns {string}
     */
    function _replaceAtPosition(position, replace, replace_with, code) {
        var sub_string = code.substr(position);
        return code.substr(0, position) + sub_string.replace(replace, replace_with);
    }

   /**
     * sorts an object by index descending
     *
     * @param {Object} object
     * @return {Array}
     */
    function keys(object) {
        var locations = [],
            replacement,
            pos;

        for(var location in object) {
            if (object.hasOwnProperty(location)) {
                locations.push(location);
            }
        }

        // numeric descending
        return locations.sort(function(a, b) {
            return b - a;
        });
    }

    /**
     * processes a block of code using specified patterns
     *
     * @param {string} code
     * @param {Array} patterns
     * @returns void
     */
    function _processCodeWithPatterns(code, patterns, callback)
    {
        // we have to increase the level here so that the
        // replacements will not conflict with each other when
        // processing sub blocks of code
        ++CURRENT_LEVEL;

        // patterns are processed one at a time through this function
        function _workOnPatterns(patterns, i)
        {
            // still have patterns to process, keep going
            if (i < patterns.length) {
                return _processPattern(patterns[i]['pattern'], patterns[i], code, function() {
                    _workOnPatterns(patterns, ++i);
                });
            }

            // we are done processing the patterns
            // process the replacements and update the DOM
            _processReplacements(code, function(code) {

                // when we are done processing replacements
                // we are done at this level so we can go back down
                delete replacements[CURRENT_LEVEL];
                delete replacement_positions[CURRENT_LEVEL];
                --CURRENT_LEVEL;
                callback(code);
            });
        }

        _workOnPatterns(patterns, 0);
    }

    /**
     * process replacements in the string of code to actually update the markup
     *
     * @param {string} code         the code to process replacements in
     * @param {Function} onComplete   what to do when we are done processing
     * @returns void
     */
    function _processReplacements(code, onComplete) {

        /**
         * processes a single replacement
         *
         * @param {string} code
         * @param {Array} positions
         * @param {number} i
         * @param {Function} onComplete
         * @returns void
         */
        function _processReplacement(code, positions, i, onComplete) {
            if (i < positions.length) {
                ++replacement_counter;
                var pos = positions[i],
                    replacement = replacements[CURRENT_LEVEL][pos];
                code = _replaceAtPosition(pos, replacement['replace'], replacement['with'], code);

                // process next function
                var next = function() {
                    _processReplacement(code, positions, ++i, onComplete);
                };

                // use a timeout every 250 to not freeze up the UI
                return replacement_counter % 250 > 0 ? next() : setTimeout(next, 0);
            }

            onComplete(code);
        }

        var string_positions = keys(replacements[CURRENT_LEVEL]);
        _processReplacement(code, string_positions, 0, onComplete);
    }

    /**
     * takes a string of code and highlights it according to the language specified
     *
     * @param {string} code
     * @param {string} language
     * @param {Function} onComplete
     * @returns void
     */
    function _highlightBlockForLanguage(code, language, onComplete) {
        var patterns = _getPatternsForLanguage(language);
        _processCodeWithPatterns(_htmlEntities(code), patterns, onComplete);
    }

    /**
     * highlight an individual code block
     *
     * @param {Array} code_blocks
     * @param {number} i
     * @returns void
     */
    function _highlightCodeBlock(code_blocks, i, onComplete) {
        if (i < code_blocks.length) {
            var block = code_blocks[i],
                language = _getLanguageForBlock(block);

            if (!_hasClass(block, 'rainbow') && language) {
                language = language.toLowerCase();

                _addClass(block, 'rainbow');

                return _highlightBlockForLanguage(block.innerHTML, language, function(code) {
                    block.innerHTML = code;

                    // reset the replacement arrays
                    replacements = {};
                    replacement_positions = {};

                    // if you have a listener attached tell it that this block is now highlighted
                    if (onHighlight) {
                        onHighlight(block, language);
                    }

                    // process the next block
                    setTimeout(function() {
                        _highlightCodeBlock(code_blocks, ++i, onComplete);
                    }, 0);
                });
            }
            return _highlightCodeBlock(code_blocks, ++i, onComplete);
        }

        if (onComplete) {
            onComplete();
        }
    }

    /**
     * start highlighting all the code blocks
     *
     * @returns void
     */
    function _highlight(node, onComplete) {

        // the first argument can be an Event or a DOM Element
        // I was originally checking instanceof Event but that makes it break
        // when using mootools
        //
        // @see https://github.com/ccampbell/rainbow/issues/32
        //
        node = node && typeof node.getElementsByTagName == 'function' ? node : document;

        var pre_blocks = node.getElementsByTagName('pre'),
            code_blocks = node.getElementsByTagName('code'),
            i,
            final_pre_blocks = [],
            final_code_blocks = [];

        // first loop through all pre blocks to find which ones to highlight
        // also strip whitespace
        for (i = 0; i < pre_blocks.length; ++i) {

            // strip whitespace around code tags when they are inside of a pre tag
            // this makes the themes look better because you can't accidentally
            // add extra linebreaks at the start and end
            //
            // when the pre tag contains a code tag then strip any extra whitespace
            // for example
            // <pre>
            //      <code>var foo = true;</code>
            // </pre>
            //
            // will become
            // <pre><code>var foo = true;</code></pre>
            //
            // if you want to preserve whitespace you can use a pre tag on its own
            // without a code tag inside of it
            if (pre_blocks[i].getElementsByTagName('code').length) {
                pre_blocks[i].innerHTML = pre_blocks[i].innerHTML.replace(/^\s+/, '').replace(/\s+$/, '');
                continue;
            }

            // if the pre block has no code blocks then we are going to want to
            // process it directly
            final_pre_blocks.push(pre_blocks[i]);
        }

        // @see http://stackoverflow.com/questions/2735067/how-to-convert-a-dom-node-list-to-an-array-in-javascript
        // we are going to process all <code> blocks
        for (i = 0; i < code_blocks.length; ++i) {
            final_code_blocks.push(code_blocks[i]);
        }

        _highlightCodeBlock(final_code_blocks.concat(final_pre_blocks), 0, onComplete);
    }

    /**
     * public methods
     */
    return {

        /**
         * extends the language pattern matches
         *
         * @param {*} language     name of language
         * @param {*} patterns      array of patterns to add on
         * @param {boolean|null} bypass      if true this will bypass the default language patterns
         */
        extend: function(language, patterns, bypass) {

            // if there is only one argument then we assume that we want to
            // extend the default language rules
            if (arguments.length == 1) {
                patterns = language;
                language = DEFAULT_LANGUAGE;
            }

            bypass_defaults[language] = bypass;
            language_patterns[language] = patterns.concat(language_patterns[language] || []);
        },

        /**
         * call back to let you do stuff in your app after a piece of code has been highlighted
         *
         * @param {Function} callback
         */
        onHighlight: function(callback) {
            onHighlight = callback;
        },

        /**
         * method to set a global class that will be applied to all spans
         *
         * @param {string} class_name
         */
        addClass: function(class_name) {
            global_class = class_name;
        },

        /**
         * starts the magic rainbow
         *
         * @returns void
         */
        color: function() {

            // if you want to straight up highlight a string you can pass the string of code,
            // the language, and a callback function
            if (typeof arguments[0] == 'string') {
                return _highlightBlockForLanguage(arguments[0], arguments[1], arguments[2]);
            }

            // if you pass a callback function then we rerun the color function
            // on all the code and call the callback function on complete
            if (typeof arguments[0] == 'function') {
                return _highlight(0, arguments[0]);
            }

            // otherwise we use whatever node you passed in with an optional
            // callback function as the second parameter
            _highlight(arguments[0], arguments[1]);
        }
    };
}) ();

/**
 * adds event listener to start highlighting
 */
(function() {
    if (document.addEventListener) {
        return document.addEventListener('DOMContentLoaded', Rainbow.color, false);
    }
    window.attachEvent('onload', Rainbow.color);
}) ();

// When using Google closure compiler in advanced mode some methods
// get renamed.  This keeps a public reference to these methods so they can
// still be referenced from outside this library.
Rainbow["onHighlight"] = Rainbow.onHighlight;
Rainbow["addClass"] = Rainbow.addClass;


/**
 * Generic language patterns
 *
 * @author Craig Campbell
 * @version 1.0.10
 */
Rainbow.extend([
    {
        'matches': {
            1: {
                'name': 'keyword.operator',
                'pattern': /\=/g
            },
            2: {
                'name': 'string',
                'matches': {
                    'name': 'constant.character.escape',
                    'pattern': /\\('|"){1}/g
                }
            }
        },
        'pattern': /(\(|\s|\[|\=|:)(('|")([^\\\1]|\\.)*?(\3))/gm
    },
    {
        'name': 'comment',
        'pattern': /\/\*[\s\S]*?\*\/|(\/\/|\#)[\s\S]*?$/gm
    },
    {
        'name': 'constant.numeric',
        'pattern': /\b(\d+(\.\d+)?(e(\+|\-)?\d+)?(f|d)?|0x[\da-f]+)\b/gi
    },
    {
        'matches': {
            1: 'keyword'
        },
        'pattern': /\b(and|array|as|b(ool(ean)?|reak)|c(ase|atch|har|lass|on(st|tinue))|d(ef|elete|o(uble)?)|e(cho|lse(if)?|xit|xtends|xcept)|f(inally|loat|or(each)?|unction)|global|if|import|int(eger)?|long|new|object|or|pr(int|ivate|otected)|public|return|self|st(ring|ruct|atic)|switch|th(en|is|row)|try|(un)?signed|var|void|while)(?=\(|\b)/gi
    },
    {
        'name': 'constant.language',
        'pattern': /true|false|null/g
    },
    {
        'name': 'keyword.operator',
        'pattern': /\+|\!|\-|&(gt|lt|amp);|\||\*|\=/g
    },
    {
        'matches': {
            1: 'function.call'
        },
        'pattern': /(\w+?)(?=\()/g
    },
    {
        'matches': {
            1: 'storage.function',
            2: 'entity.name.function'
        },
        // 'pattern': /(function)\s(.*?)(?=\()/g
        'pattern': /(function)(?=\s)(.*?)(?=\()/g // <<< discard the whitespace match after `function`.
    }
]);


/**
 * Javascript patterns
 *
 * @author Craig Campbell
 * @version 1.0.8
 */
Rainbow.extend('javascript', [

    /**
     * matches $. or $(
     */
    {
        'name': 'selector',
        'pattern': /(\s|^)\$(?=\.|\()/g
    },
    {
        'name': 'support',
        'pattern': /\b(window|document)\b/g
    },
    {
        'matches': {
            1: 'support.property'
        },
        'pattern': /\.(length|node(Name|Value))\b/g
    },
    {
        'matches': {
            1: 'support.function'
        },
        'pattern': /(setTimeout|setInterval)(?=\()/g

    },
    {
        'matches': {
            1: 'support.method'
        },
        'pattern': /\.(getAttribute|push|getElementById|getElementsByClassName|log|setTimeout|setInterval)(?=\()/g
    },
    {
        'matches': {
            1: 'support.tag.script',
            2: [
                {
                    'name': 'string',
                    'pattern': /('|")(.*?)(\1)/g
                },
                {
                    'name': 'entity.tag.script',
                    'pattern': /(\w+)/g
                }
            ],
            3: 'support.tag.script'
        },
        'pattern': /(&lt;\/?)(script.*?)(&gt;)/g
    },

    /**
     * matches any escaped characters inside of a js regex pattern
     *
     * @see https://github.com/ccampbell/rainbow/issues/22
     *
     * this was causing single line comments to fail so it now makes sure
     * the opening / is not directly followed by a *
     *
     * @todo check that there is valid regex in match group 1
     */
    {
        'name': 'string.regexp',
        'matches': {
            1: 'string.regexp.open',
            2: {
                'name': 'constant.regexp.escape',
                'pattern': /\\(.){1}/g
            },
            3: 'string.regexp.close',
            4: 'string.regexp.modifier'
        },
        'pattern': /(\/)(?!\*)(.+)(\/)([igm]{0,3})/g
    },

    /**
     * matches runtime function declarations
     */
    {
        'matches': {
            1: 'storage',
            3: 'entity.function'
        },
        'pattern': /(var)?(\s|^)(\S*)(?=\s?=\s?function\()/g
    },

    /**
     * matches constructor call
     */
    {
        'matches': {
            1: 'keyword',
            2: 'entity.function'
        },
        // Fix for not capturing the space after `new`
        'pattern': /(new\s+)(.*)(?=\(.+\)$)/g
    },

    /**
     * matches any function call in the style functionName: function()
     */
    {
        'name': 'entity.function',
        'pattern': /(\w+)(?=:\s{0,}function)/g
    }
]);





/**
 * HTML patterns
 *
 * @author Craig Campbell
 * @version 1.0.7
 */
Rainbow.extend('html', [
    {
        'name': 'source.php.embedded',
        'matches': {
            2: {
                'language': 'php'
            }
        },
        'pattern': /&lt;\?=?(?!xml)(php)?([\s\S]*?)(\?&gt;)/gm
    },
    {
        'name': 'source.css.embedded',
        'matches': {
            0: {
                'language': 'css'
            }
        },
        'pattern': /&lt;style(.*?)&gt;([\s\S]*?)&lt;\/style&gt;/gm
    },
    {
        'name': 'source.js.embedded',
        'matches': {
            0: {
                'language': 'javascript'
            }
        },
        'pattern': /&lt;script(?! src)(.*?)&gt;([\s\S]*?)&lt;\/script&gt;/gm
    },
    {
        'name': 'comment.html',
        'pattern': /&lt;\!--[\S\s]*?--&gt;/g
    },
    {
        'matches': {
            1: 'support.tag.open',
            2: 'support.tag.close'
        },
        'pattern': /(&lt;)|(\/?\??&gt;)/g
    },
    {
        'name': 'support.tag',
        'matches': {
            1: 'support.tag',
            2: 'support.tag.special',
            3: 'support.tag-name'
        },
        'pattern': /(&lt;\??)(\/|\!?)(\w+)/g
    },
    {
        'matches': {
            1: 'support.attribute'
        },
        'pattern': /([a-z-]+)(?=\=)/gi
    },
    {
        'matches': {
            1: 'support.operator',
            2: 'string.quote',
            3: 'string.value',
            4: 'string.quote'
        },
        'pattern': /(=)('|")(.*?)(\2)/g
    },
    {
        'matches': {
            1: 'support.operator',
            2: 'support.value'
        },
        'pattern': /(=)([a-zA-Z\-0-9]*)\b/g
    },
    {
        'matches': {
            1: 'support.attribute'
        },
        'pattern': /\s(\w+)(?=\s|&gt;)(?![\s\S]*&lt;)/g
    }
], true);





/**
 * CSS patterns
 *
 * @author Craig Campbell
 * @version 1.0.9
 */
Rainbow.extend('css', [
    {
        'name': 'comment',
        'pattern': /\/\*[\s\S]*?\*\//gm
    },
    {
        'name': 'constant.hex-color',
        'pattern': /#([a-f0-9]{3}|[a-f0-9]{6})(?=;|\s|,|\))/gi
    },
    {
        'matches': {
            1: 'constant.numeric',
            2: 'keyword.unit'
        },
        'pattern': /(\d+)(px|em|cm|s|%)?/g
    },
    {
        'name': 'string',
        'pattern': /('|")(.*?)\1/g
    },
    {
        'name': 'support.css-property',
        'matches': {
            1: 'support.vendor-prefix'
        },
        'pattern': /(-o-|-moz-|-webkit-|-ms-)?[\w-]+(?=\s?:)(?!.*\{)/g
    },
    {
        'matches': {
            1: [
                {
                    'name': 'entity.name.sass',
                    'pattern': /&amp;/g
                },
                {
                    'name': 'direct-descendant',
                    'pattern': /&gt;/g
                },
                {
                    'name': 'entity.name.class',
                    'pattern': /\.[\w\-_]+/g
                },
                {
                    'name': 'entity.name.id',
                    'pattern': /\#[\w\-_]+/g
                },
                {
                    'name': 'entity.name.pseudo',
                    'pattern': /:[\w\-_]+/g
                },
                {
                    'name': 'entity.name.tag',
                    'pattern': /\w+/g
                }
            ]
        },
        'pattern': /([\w\ ,\n:\.\#\&\;\-_]+)(?=.*\{)/g
    },
    {
        'matches': {
            2: 'support.vendor-prefix',
            3: 'support.css-value'
        },
        'pattern': /(:|,)\s*(-o-|-moz-|-webkit-|-ms-)?([a-zA-Z-]*)(?=\b)(?!.*\{)/g
    }
], true);




// Extend rainbow javascript
window.Rainbow.extend( 'javascript', [
    {
        'name': 'null',
        'pattern': /\b(null|undefined)\b/g
    },
    {
        'name': 'line-break',
        'pattern': /\n/g
    },
    {
        'name': 'line-space',
        'pattern': / +/g
    },
    {
        'name': 'html-link',
        'pattern': /<a.+>.+<\/a>/g
    }
]);




// Extend rainbow html
window.Rainbow.extend( 'html', [
    {
        'name': 'line-break',
        'pattern': /\n/g
    },
    {
        'name': 'line-space',
        'pattern': / +/g
    }
]);




// Extend rainbow css
window.Rainbow.extend( 'css', [
    {
        'name': 'comment',
        'pattern': /\/\*[\s\S]*?\*\//gm
    },
    {
        'matches': {
            1: 'constant.numeric',
            2: 'keyword.unit'
        },
        'pattern': /(-?\d+)(em|px|cm|s|%)?/g
    }
], true );

