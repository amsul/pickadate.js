
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true
 */



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
    today: 'aujourd\'hui',
    clear: 'effacer'
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
$( '#date_demo__formats' ).pickadate({
    format: 'You selecte!d: dddd, dd mmm, yyyy',
    formatSubmit: 'yyyy-mm-dd',
    hiddenSuffix: '--submit',
    onSet: function() {
        this.$node.
            closest( '.js__fieldset' ).
            after( '<div class="section__block section__block--notification-green">' +
                '<p>Value to submit: <code>' +
                    this.get({ select: 'yyyy/mm/dd' }) +
                '</code></p></div>'
            )
    }
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

// Disable a specific set of dates using arrays
// formatted as [ YEAR, MONTH, DATE ].
$( '#date_demo__disable-dates--a' ).pickadate({
    disable: [
        [2013,3,3],
        [2013,3,12],
        [2013,3,20],
        [2013,3,29]
    ]
})

// Disable an arbitrary set of dates using integers
// from 1 - 7 representing the day of week.
$( '#date_demo__disable-dates--b' ).pickadate({
    disable: [
        1, 4, 7
    ]
})

// Set the first array item to `true` to disable all the dates.
// Then selectively enable specific or arbitrary sets of dates.
$( '#date_demo__disable-dates--c' ).pickadate({
    disable: [
        true,
        1, 4, 7,
        [2013,3,3],
        [2013,3,12],
        [2013,3,20],
        [2013,3,29]
    ]
})



/**
 * Disable dates
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
$( '#time_demo__formats' ).pickatime({
    format: 'T!ime: HHi',
    formatSubmit: 'HH:i',
    hiddenSuffix: '--submit',
    onSet: function() {
        this.$node.
            closest( '.js__fieldset' ).
            after( '<div class="section__block section__block--notification-green">' +
                '<p>Value to submit: <code>' +
                    this.get({ select: 'yyyy/mm/dd' }) +
                '</code></p></div>'
            )
    }
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



/**
 * Disable dates
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
    $input_open_close = $( '#date_demo__api-open-close' ).pickadate({
        onOpen: function() {
            $button_open_close.text( 'Close' )
        },
        onClose: function() {
            $button_open_close.text( 'Open' )
        }
    }),
    picker_open_close = $input_open_close.pickadate( 'picker' )
$button_open_close.on( 'click', function( event ) {
    if ( picker_open_close.isOpen() ) {
        picker_open_close.close()
    }
    else {
        picker_open_close.open()
    }
    event.stopPropagation()
})



/**
 * API demo: isOpen
 */
var $button_isOpen = $( '#button__api-isOpen' ),
    $input_isOpen = $( '#date_demo__api-isOpen' ).pickadate({
        onOpen: function() {
            alert( 'The picker is open: ' + this.isOpen() )
        }
    }),
    picker_isOpen = $input_isOpen.pickadate( 'picker' )
$button_isOpen.on( 'click', function( event ) {
    alert( 'The picker is open: ' + picker_isOpen.isOpen() )
    event.stopPropagation()
})



/**
 * API demo: start-stop
 */
var $button_start_stop = $( '#button__api-start-stop' ),
    $input_start_stop = $( '#date_demo__api-start-stop' ).pickadate({
        onStart: function() {
            $button_start_stop.text( 'Stop' )
        },
        onStop: function() {
            $button_start_stop.text( 'Start' )
        }
    }),
    picker_start_stop = $input_start_stop.pickadate( 'picker' )
$button_start_stop.on( 'click', function( event ) {
    picker_start_stop[ $button_start_stop.text().toLowerCase() ]()
    event.stopPropagation()
})



/**
 * API demo: render
 */
var manglePicker = function( picker ) {
        var today = new Date(),
            todayString = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear()
        picker.$holder.find( '.pickadate__box' ).
            prepend('<p class="text-center">Hello there! Today is <code>' + todayString + '</code></p>')
    },
    $button_render = $( '#button__api-render' ),
    $input_render = $( '#date_demo__api-render' ).pickadate(),
    picker_render = $input_render.pickadate( 'picker' )
$button_render.on( 'click', function( event ) {
    if ( $button_render.text() == 'Render' ) {
        picker_render.render()
        $button_render.text( 'Add stuff' )
    }
    else {
        manglePicker( picker_render )
        $button_render.text( 'Render' )
    }
    event.stopPropagation()
})



/**
 * API demo: clear
 */
var $button_clear = $( '#button__api-clear' ),
    $input_clear = $( '#date_demo__api-clear' ).pickadate(),
    picker_clear = $input_clear.pickadate( 'picker' )
$button_clear.on( 'click', function( event ) {
    picker_clear.clear()
    event.stopPropagation()
})



/**
 * API demo: get
 */

//value
var $button_get__a = $( '#button__api-get--a' ),
    $input_get__a = $( '#date_demo__api-get--a' ).pickadate(),
    picker_get__a = $input_get__a.pickadate( 'picker' )
$button_get__a.on( 'click', function( event ) {
    console.log( picker_get__a.get() )
    event.stopPropagation()
})

//select
var $input_get__b = $( '#date_demo__api-get--b' ).pickadate(),
    picker_get__b = $input_get__b.pickadate( 'picker' )
$( '#button__api-get--b' ).on( 'click', function( event ) {
    console.log( picker_get__b.get( 'select' ) )
    event.stopPropagation()
})
$( '#button__api-get--c' ).on( 'click', function( event ) {
    console.log( picker_get__b.get( 'highlight' ) )
    event.stopPropagation()
})
$( '#button__api-get--d' ).on( 'click', function( event ) {
    console.log( picker_get__b.get( 'view' ) )
    event.stopPropagation()
})



/*
 * Initialize all the others
 */
$( '.js__datepicker' ).pickadate()
$( '.js__timepicker' ).pickatime()

