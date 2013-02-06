/*!
 * pickadate.js v3.0.0 early unstable pre-pre-aplha build - 06 February, 2013
 * By Amsul (http://amsul.ca)
 * Hosted on https://github.com/amsul/pickadate.js
 * Licensed under MIT ("expat" flavour) license.
 */

/*jshint
   debug: true,
   devel: true,
   browser: true,
   asi: true,
   unused: true,
   eqnull: true
 */



;(function( $, document, undefined ) {

    'use strict';



    var

        // Globals & constants
        DAYS_IN_WEEK = 7,
        WEEKS_IN_CALENDAR = 6,
        DAYS_IN_CALENDAR = WEEKS_IN_CALENDAR * DAYS_IN_WEEK,

        MINUTES_IN_HOUR = 60,
        HOURS_IN_DAY = 24,
        MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR,

        STRING_DIV = 'div',
        STRING_PREFIX_DATEPICKER = 'pickadate__',

        $document = $( document ),

        $body = $( document.body ),


        /**
         * The picker constructor that creates a new date or time picker
         *
         * [1] jQuery object that contains the input element node
         * [2] The merged settings for each picker instance
         * [3] A truth-y value creates a time picker
         *
         * [R] A new initialized picker object
         */
        Picker = function( $ELEMENT, SETTINGS, IS_TIME ) {

            var

                // The classes
                CLASSES = SETTINGS.klass,


                // Now
                // TIME_NOW = createTime(),

                // Create the min time
                TIME_MIN = createTime( 0 ),

                // Create the max time
                TIME_MAX = createTime( MINUTES_IN_DAY ),


                // The element node
                ELEMENT = (function( element ) {

                    // Confirm the focus state, convert the element into
                    // a regular text input to remove user-agent stylings,
                    // and then set it as readonly to prevent keyboard popup
                    element.autofocus = ( element == document.activeElement )
                    element.type = 'text'
                    element.readOnly = true
                    return element
                })( $ELEMENT[ 0 ] ), //ELEMENT


                // If there's a format for the hidden input element, create the element
                // using the name of the original input plus suffix and update the value
                // with whatever is entered in the input on load. Otherwise set it to null.
                ELEMENT_HIDDEN = SETTINGS.formatSubmit ? $( '<input type=hidden name=' + ELEMENT.name + SETTINGS.hiddenSuffix + '>' ).val( ELEMENT.value ? getDateFormatted( SETTINGS.formatSubmit ) : '' )[ 0 ] : null,


                // The picker (date or time) object
                PICKER = {
                    id: ~~( Math.random() * 1e9 )
                }, //PICKER


                // Create the picker holder with a wrapped calendar or clock and bind the events
                $HOLDER = $( createNode( STRING_DIV, createWrappedPicker(), CLASSES.holder ) ).on( 'click', function( event ) {

                    // If the calendar is closed, do nothing
                    // * This is done to prevent the "enter" key propagating as a click
                    // if ( !PICKER.isOpen ) { return }

                    var
                        timeToSelect,

                        // Get the jQuery target
                        $target = $( event.target ),

                        // Get the target data
                        targetData = $target.data()


                    // Stop the event from bubbling to the document
                    event.stopPropagation()


                    // Put focus back onto the element
                    ELEMENT.focus()

                    // For IE, set the calendar to force close
                    // * This needs to be after `ELEMENT.focus()`
                    PICKER._IE = 1


                    // If a navigator button was clicked, show the relative month
                    if ( targetData.nav ) {
                        showMonth( MONTH_FOCUSED.MONTH + targetData.nav )
                    }

                    // If a clear button was clicked, clear the values and then close it
                    else if ( targetData.clear ) {
                        P.clear().close()
                    }

                    // If a date was clicked, split the target data into an array,
                    // set the date while floating the values, and then close it
                    else if ( targetData.date ) {
                        timeToSelect = targetData.date.split( '/' )
                        P.setDate( +timeToSelect[ 0 ], +timeToSelect[ 1 ], +timeToSelect[ 2 ] ).close()
                    }

                    // If a time was picked, set the time
                    else if ( targetData.pick ) {
                        P.set( targetData.pick.split( ':' ) )
                    }

                    // If the target is the holder, close the picker
                    else if ( $target[ 0 ] == $HOLDER[ 0 ] ) {
                        P.close()
                    }
                }),


                // Pseudo picker constructor
                Picker = function() {},


                // The base picker prototype
                P = Picker.prototype = {

                    // Link up the constructor
                    constructor: Picker,

                    // Easy access to the settings
                    settings: SETTINGS,

                    // Easy access to the element
                    $node: $ELEMENT,


                    /**
                     * Initialize everything
                     */
                    init: function() {

                        // Bind all the events to the element,
                        // and then insert everything after it
                        $ELEMENT.on({
                            'focus click': function() {
                                // console.log( 'yay' )
                            }
                        }).after( [ $HOLDER, ELEMENT_HIDDEN ] )

                        return P
                    }, //init


                    /**
                     * Set the time
                     */
                    set: function( timeArray ) {

                        // If there are 2 units of time, set the time
                        if ( timeArray.length == 2 ) {
                            setTimeSelected( timeArray, 0, 1 )
                        }

                        return P
                    }
                } //P


            /**
             * Create the list of times with a certain interval
             */
            function createClockList( interval ) {

                var timeobj, loopTime, classAndBinding,
                    list = ''

                for ( loopTime = TIME_MIN.TIME; loopTime < TIME_MAX.TIME; loopTime += interval ) {
                    timeobj = createTime( loopTime )
                    classAndBinding = createNodeClassAndBinding( timeobj, TIME_MIN, TIME_MAX, CLASSES.listItem, 1, IS_TIME )
                    list += createNode( 'li',
                        leadZero( timeobj.HOUR ) + ':' + leadZero( timeobj.MINS ),
                        classAndBinding[ 0 ],
                        classAndBinding[ 1 ]
                    )
                }

                return list
            } //createClockList


            /**
             * Create clock
             */
            function createClock() {

                // Create the clock list of times
                return createNode( 'ul',

                    createClockList( SETTINGS.timeStep ),

                    CLASSES.list
                )//endreturn
            } //createClock


            /**
             * Create the wrapped picker using the collection of
             * either calendar items or clock items
             */
            function createWrappedPicker() {

                // Create a picker wrapper node
                return createNode( STRING_DIV,

                    // Create a picker frame
                    createNode( STRING_DIV,

                        // Create the actual picker box node
                        createNode( STRING_DIV,

                            IS_TIME ? createClock() : createCalendar(), ////<<<<<<<<

                            // Picker type class
                            IS_TIME ? CLASSES.clock : CLASSES.calendar //////<<<<<<<
                        ),

                        // Picker wrapper class
                        CLASSES.wrap
                    ),

                    // Picker frame class
                    CLASSES.frame
                ) //endreturn
            } //createWrappedPicker


            /**
             * Set a time node as selected
             */
            function setTimeSelected( timeArray, isSuperficial, isTimeSelection ) {

                // If it's not just a superficial selection, update the `input` values
                if ( !isSuperficial ) {
                    setElementsValue( timeArray, isTimeSelection )
                }
            } //setTimeSelected


            /**
             * Set the time in the text `input` and hidden `input` nodes
             */
            function setElementsValue( timeArray, isTimeSelection ) {

                // Set the `input` node value and broadcast a "change" event
                $ELEMENT.val( timeArray ? getTimeFormatted( timeArray, isTimeSelection ) : '' ).trigger( 'change' )
            } //setElementsValue


            /**
             * Get a time nicely formatted for display
             */
            function getTimeFormatted( timeArray, isTimeSelection ) {

                if ( isTimeSelection ) {
                    var timeObj = createTime( timeArray )
                    return leadZero( timeObj.HOUR ) + ':' + leadZero( timeObj.MINS )
                }

                // Go through all the date formats and convert the format passed
                // into an array to map which we join into a string at the end.
                return DATE_FORMATS.toArray( format || SETTINGS.format ).map( function( value ) {

                    // Trigger the date formats function
                    // or just return value itself.
                    return triggerFunction( DATE_FORMATS[ value ], date || DATE_SELECTED ) || value
                }).join( '' )
            } //getTimeFormatted



            // Return an initialized picker
            return new P.init()
        } //Picker






    /**
     * Helper functions
     */

    // Check if a value is a function and trigger it, if that
    function triggerFunction( callback, scope ) {
        if ( typeof callback == 'function' ) {
            return callback.call( scope )
        }
    }

    // Return numbers below 10 with a leading zero
    function leadZero( number ) {
        return ( number < 10 ? '0': '' ) + number
    }

    // Create a dom node string
    function createNode( wrapper, item, klass, attribute ) {

        // If the item is false-y, just return an empty string
        if ( !item ) return ''

        // If the item is an array, do a join
        item = Array.isArray( item ) ? item.join( '' ) : item

        // Check for the class
        klass = klass ? ' class="' + klass + '"' : ''

        // Check for any attributes
        attribute = attribute ? ' ' + attribute : ''

        // Return the wrapped item
        return '<' + wrapper + klass + attribute + '>' + item + '</' + wrapper + '>'
    } //createNode

    // Create the class and binding for a looped date or time node.
    // Returns an array with 2 items:
    // 1) The classes as a string
    // 2) The data binding as a string
    function createNodeClassAndBinding( timeObj, minTimeObj, maxTimeObj, defaultKlasses, isInFocus, isTime ) {

        var
            // Check for time being enabled/disabled
            isTimeDisabled,

            dataBinding,

            // Create a collection for the classes with the defaults
            klassCollection = [ defaultKlasses ]


        // If the time object is for time, then we need those conditionals
        if ( isTime ) {

            //this will never happen because they will always be in range
            if ( timeObj.TIME < minTimeObj.TIME || timeObj.TIME > maxTimeObj.TIME ) {

            }

            // I can probably move this one level up
            dataBinding = [
                timeObj.HOUR,
                timeObj.MINS
            ].join( ':' )
        }

        else {

            // If the time object falls within the min/max range,
            // or there are disabled dates and this is one of them,
            // flip the "disabled" state to truthy and add the relevant class.
            if ( timeObj.TIME < minTimeObj.TIME || timeObj.TIME > maxTimeObj.TIME || ( DATES_TO_DISABLE && DATES_TO_DISABLE.filter( DISABLED_DATES, timeObj ).length ) ) {
                isTimeDisabled = 1
                klassCollection.push( CLASSES.dayDisabled )
            }


            // If it's today, add the class
            if ( timeObj.TIME == DATE_TODAY.TIME ) {
                klassCollection.push( CLASSES.dayToday )
            }


            // If it's the highlighted date, add the class
            if ( timeObj.TIME == DATE_HIGHLIGHTED.TIME ) {
                klassCollection.push( CLASSES.dayHighlighted )
            }


            // If it's the selected date, add the class
            if ( timeObj.TIME == DATE_SELECTED.TIME ) {
                klassCollection.push( CLASSES.daySelected )
            }

            dataBinding = [
                timeObj.YEAR,
                timeObj.MONTH + 1, // add 1 to display an accurate date
                timeObj.DATE
            ].join( '/' )
        }


        // Return an array with the classes and data binding
        return [

            // The classes joined by a single whitespace
            klassCollection.join( ' ' ),

            // And the data binding based on its "disabled" state
            'data-' + ( isTimeDisabled ? 'disabled' : 'pick' ) + '=' + dataBinding
        ]
    } //createNodeClassAndBinding

    // Create a calendar date
    function createDate( datePassed, unlimited ) {

        // If the date passed is an array
        if ( Array.isArray( datePassed ) ) {

            // Create the date
            datePassed = new Date( datePassed[ 0 ], datePassed[ 1 ], datePassed[ 2 ] )
        }

        // If the date passed is a number
        else if ( !isNaN( datePassed ) ) {

            // Create the date
            datePassed = new Date( datePassed )
        }


        // Otherwise if it's not unlimited
        else if ( !unlimited ) {

            // Set the date to today
            datePassed = new Date()

            // Set the time to midnight (for comparison purposes)
            datePassed.setHours( 0, 0, 0, 0 )
        }


        // Return the calendar date object
        return {
            YEAR: unlimited || datePassed.getFullYear(),
            MONTH: unlimited || datePassed.getMonth(),
            DATE: unlimited || datePassed.getDate(),
            DAY: unlimited || datePassed.getDay(),
            TIME: unlimited || datePassed.getTime(),
            OBJ: unlimited || datePassed
        }
    } //createDate

    // Create a clock time
    function createTime( timePassed ) {

        // If we have an array to deal with, float the values and convert into minutes.
        timePassed = Array.isArray( timePassed ) ? +timePassed[ 0 ] * MINUTES_IN_HOUR + (+timePassed[ 1 ]) : timePassed

        return {

            // Divide to get hours from minutes.
            HOUR: ~~( timePassed / MINUTES_IN_HOUR ),

            // The remainder is the minutes.
            MINS: timePassed % MINUTES_IN_HOUR,

            // Reference to total minutes.
            TIME: timePassed
        }
    } //createTime



    /**
     * Extend jQuery
     */
    $.fn.pickadate = function( options ) {

        var pickadate = 'pickadate'

        // Merge the options with a deep copy
        options = $.extend( true, {}, $.fn.pickadate.defaults, options )

        // Check if it should be disabled
        // for browsers that natively support `type=date`
        if ( options.disablePicker ) { return this }

        return this.each( function() {
            var $this = $( this )
            if ( this.nodeName == 'INPUT' && !$this.data( pickadate ) ) {
                $this.data( pickadate, new Picker( $this, options ) )
            }
        })
    } //$.fn.pickadate

    $.fn.pickatime = function( options ) {

        var pickatime = 'pickatime'

        // Merge the options with a deep copy
        options = $.extend( true, {}, $.fn.pickatime.defaults, options )

        // Check if it should be disabled
        // for browsers that natively support `type=date`
        if ( options.disablePicker ) { return this }

        return this.each( function() {
            var $this = $( this )
            if ( this.nodeName == 'INPUT' && !$this.data( pickatime ) ) {
                $this.data( pickatime, new Picker( $this, options, 1 ) )
            }
        })
    } //$.fn.pickatime



    /**
     * Default options for the date picker
     */
    $.fn.pickadate.defaults = {

        monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],

        weekdaysFull: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

        // Display strings
        monthPrev: '&#9664;',
        monthNext: '&#9654;',
        showMonthsFull: 1,
        showWeekdaysShort: 1,

        // Today and clear
        today: 'Today',
        clear: 'Clear',

        // Date format to show on the input element
        format: 'd mmmm, yyyy',

        // Date format to send to the server
        formatSubmit: 0,

        // Hidden element name suffix
        hiddenSuffix: '_submit',

        // First day of the week: 0 = Sunday, 1 = Monday
        firstDay: 0,

        // Month & year dropdown selectors
        monthSelector: 0,
        yearSelector: 0,

        // Date ranges
        dateMin: 0,
        dateMax: 0,

        // Dates to disable
        datesDisabled: 0,

        // Disable for browsers with native date support
        disablePicker: 0,

        // Events
        onOpen: 0,
        onClose: 0,
        onSelect: 0,
        onStart: 0,


        // Classes
        klass: {

            bodyActive: STRING_PREFIX_DATEPICKER + 'active',

            inputActive: STRING_PREFIX_DATEPICKER + 'input--active',

            holder: STRING_PREFIX_DATEPICKER + 'holder',
            opened: STRING_PREFIX_DATEPICKER + 'holder--opened',
            focused: STRING_PREFIX_DATEPICKER + 'holder--focused',

            frame: STRING_PREFIX_DATEPICKER + 'frame',
            wrap: STRING_PREFIX_DATEPICKER + 'wrap',

            calendar: STRING_PREFIX_DATEPICKER + 'calendar',

            table: STRING_PREFIX_DATEPICKER + 'table',

            header: STRING_PREFIX_DATEPICKER + 'header',

            monthPrev: STRING_PREFIX_DATEPICKER + 'nav--prev',
            monthNext: STRING_PREFIX_DATEPICKER + 'nav--next',

            month: STRING_PREFIX_DATEPICKER + 'month',
            year: STRING_PREFIX_DATEPICKER + 'year',

            selectMonth: STRING_PREFIX_DATEPICKER + 'select--month',
            selectYear: STRING_PREFIX_DATEPICKER + 'select--year',

            weekdays: STRING_PREFIX_DATEPICKER + 'weekday',

            body: STRING_PREFIX_DATEPICKER + 'body',

            day: STRING_PREFIX_DATEPICKER + 'day',
            dayDisabled: STRING_PREFIX_DATEPICKER + 'day--disabled',
            daySelected: STRING_PREFIX_DATEPICKER + 'day--selected',
            dayHighlighted: STRING_PREFIX_DATEPICKER + 'day--highlighted',
            dayToday: STRING_PREFIX_DATEPICKER + 'day--today',
            dayInfocus: STRING_PREFIX_DATEPICKER + 'day--infocus',
            dayOutfocus: STRING_PREFIX_DATEPICKER + 'day--outfocus',

            footer: STRING_PREFIX_DATEPICKER + 'footer',

            buttonClear: STRING_PREFIX_DATEPICKER + 'button--clear',
            buttonToday: STRING_PREFIX_DATEPICKER + 'button--today'
        }
    } //$.fn.pickadate.defaults


    /**
     * Default options for the date picker
     */
    $.fn.pickatime.defaults = {

        // Date format to show on the input element
        format: 'h:iA',

        // Date format to send to the server
        formatSubmit: 0,

        // Hidden element name suffix
        hiddenSuffix: '_submit',

        // timeMin: 0,
        // timeMax: 24,
        timeStep: 30,

        // Events
        onOpen: 0,
        onClose: 0,
        onSelect: 0,
        onStart: 0,


        // Classes
        klass: {

            bodyActive: STRING_PREFIX_DATEPICKER + 'active',

            inputActive: STRING_PREFIX_DATEPICKER + 'input--active',

            holder: STRING_PREFIX_DATEPICKER + 'holder',
            opened: STRING_PREFIX_DATEPICKER + 'holder--opened',
            focused: STRING_PREFIX_DATEPICKER + 'holder--focused',

            frame: STRING_PREFIX_DATEPICKER + 'frame',
            wrap: STRING_PREFIX_DATEPICKER + 'wrap',

            clock: STRING_PREFIX_DATEPICKER + 'clock',

            list: STRING_PREFIX_DATEPICKER + 'list',
            listItem: STRING_PREFIX_DATEPICKER + 'list-item'
        }
    } //$.fn.pickatime.defaults





})( jQuery, document );