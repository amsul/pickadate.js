
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true
 */



/**
 * Weekday labels
 */
$( '#demo__weekdaysShort' ).pickadate({
    weekdaysShort: [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ],
    showMonthsShort: true
})



/**
 * Translations
 */
$( '#demo__translations' ).pickadate({
    monthsFull: [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ],
    monthsShort: [ 'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec' ],
    weekdaysShort: [ 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam' ],
    today: 'aujourd\'hui',
    clear: 'effacer'
})



/**
 * Buttons
 */
$( '#demo__buttons' ).pickadate({
    // Any false-y value will hide the button.
    today: '',
    clear: 'Clear selection'
})



/**
 * Formats
 */
var $demoFormats = $( '#demo__formats' ).pickadate({
    format: 'You selecte!d: dddd, dd mmm, yyyy',
    formatSubmit: 'yyyy-mm-dd',
    hiddenSuffix: '--submit',
    onSet: function() {
        $demoFormats.
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
$( '#demo__selectors--a' ).pickadate({
    selectYears: true,
    selectMonths: true
})
$( '#demo__selectors--b' ).pickadate({
    selectYears: 4
})



/**
 * First weekday
 */
$( '#demo__firstDay' ).pickadate({
    firstDay: 1
})



/**
 * Limits
 */

// Limits as specific dates using JavaScript date objects.
$( '#demo__limits--a' ).pickadate({
    min: new Date(2013,3,20),
    max: new Date(2013,7,14)
})

// Limits as specific dates using arrays.
$( '#demo__limits--b' ).pickadate({
    min: [2013,3,20],
    max: [2013,7,14]
})

// Limits as dates relative to today.
$( '#demo__limits--c' ).pickadate({
    min: -15,
    max: true
})



/**
 * Disable dates
 */

// Disable a specific set of dates using arrays
// formatted as [ YEAR, MONTH, DATE ].
$( '#demo__disable-dates--a' ).pickadate({
    disable: [
        [2013,3,3],
        [2013,3,12],
        [2013,3,20],
        [2013,3,29]
    ]
})

// Disable an arbitrary set of dates using integers
// from 1 - 7 representing the day of week.
$( '#demo__disable-dates--b' ).pickadate({
    disable: [
        1, 4, 7
    ]
})

// Set the first array item to `true` to disable all the dates.
// Then selectively enable specific or arbitrary sets of dates.
$( '#demo__disable-dates--c' ).pickadate({
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
$( '#demo__events' ).pickadate({
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
    $input_isOpen = $( '#demo__api-isOpen' ).pickadate({
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
    $input_start_stop = $( '#demo__api-start-stop' ).pickadate({
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
    $input_render = $( '#demo__api-render' ).pickadate(),
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
var $button_get__a = $( '#button__api-get--a' ),
    $input_get__a = $( '#demo__api-get--a' ).pickadate(),
    picker_get__a = $input_get__a.pickadate( 'picker' )
$button_get__a.on( 'click', function( event ) {
    console.log( picker_get__a.get() )
    event.stopPropagation()
})

//select
var $input_get__b = $( '#demo__api-get--b' ).pickadate(),
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

