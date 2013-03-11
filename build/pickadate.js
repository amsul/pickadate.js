/*!
 * pickadate.js v3.0.0.alpha, 2013-03-11
 * By Amsul (http://amsul.ca)
 * Hosted on http://amsul.github.com/pickadate.js/
 * Licensed under MIT ("expat" flavour) license.
 */

/**
 * Legacy browser support
 */

/**
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * http://blog.stevenlevithan.com/archives/cross-browser-split
 */
var nativeSplit = String.prototype.split, compliantExecNpcg = /()??/.exec('')[1] === undefined
String.prototype.split = function(separator, limit) {
    var str = this
    if (Object.prototype.toString.call(separator) !== '[object RegExp]') {
        return nativeSplit.call(str, separator, limit)
    }
    var output = [],
        flags = (separator.ignoreCase ? 'i' : '') +
                (separator.multiline  ? 'm' : '') +
                (separator.extended   ? 'x' : '') +
                (separator.sticky     ? 'y' : ''),
        lastLastIndex = 0,
        separator2, match, lastIndex, lastLength
    separator = new RegExp(separator.source, flags + 'g')
    str += ''
    if (!compliantExecNpcg) {
        separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags)
    }
    limit = limit === undefined ? -1 >>> 0 : limit >>> 0
    while (match = separator.exec(str)) {
        lastIndex = match.index + match[0].length
        if (lastIndex > lastLastIndex) {
            output.push(str.slice(lastLastIndex, match.index))
            if (!compliantExecNpcg && match.length > 1) {
                match[0].replace(separator2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                        if (arguments[i] === undefined) {
                            match[i] = undefined
                        }
                    }
                })
            }
            if (match.length > 1 && match.index < str.length) {
                Array.prototype.push.apply(output, match.slice(1))
            }
            lastLength = match[0].length
            lastLastIndex = lastIndex
            if (output.length >= limit) {
                break
            }
        }
        if (separator.lastIndex === match.index) {
            separator.lastIndex++
        }
    }
    if (lastLastIndex === str.length) {
        if (lastLength || !separator.test('')) {
            output.push('')
        }
    } else {
        output.push(str.slice(lastLastIndex))
    }
    return output.length > limit ? output.slice(0, limit) : output
}


// isArray support
if ( !Array.isArray ) {
    Array.isArray = function( value ) {
        return {}.toString.call( value ) == '[object Array]'
    }
}


// Map array support
if ( ![].map ) {
    Array.prototype.map = function ( callback, self ) {
        var array = this, len = array.length, newArray = new Array( len )
        for ( var i = 0; i < len; i++ ) {
            if ( i in array ) {
                newArray[ i ] = callback.call( self, array[ i ], i, array )
            }
        }
        return newArray
    }
}


// Filter array support
if ( ![].filter ) {
    Array.prototype.filter = function( callback ) {
        if ( this == null ) throw new TypeError()
        var t = Object( this ), len = t.length >>> 0
        if ( typeof callback != 'function' ) throw new TypeError()
        var newArray = [], thisp = arguments[ 1 ]
        for ( var i = 0; i < len; i++ ) {
          if ( i in t ) {
            var val = t[ i ]
            if ( callback.call( thisp, val, i, t ) ) newArray.push( val )
          }
        }
        return newArray
    }
}


// Index of array support
if ( ![].indexOf ) {
    Array.prototype.indexOf = function( searchElement ) {
        if ( this == null ) throw new TypeError()
        var t = Object( this ), len = t.length >>> 0
        if ( len === 0 ) return -1
        var n = 0
        if ( arguments.length > 1 ) {
            n = Number( arguments[ 1 ] )
            if ( n != n ) {
                n = 0
            }
            else if ( n != 0 && n != Infinity && n != -Infinity ) {
                n = ( n > 0 || -1 ) * Math.floor( Math.abs( n ) )
            }
        }
        if ( n >= len ) return -1
        var k = n >= 0 ? n : Math.max( len - Math.abs( n ), 0 )
        for ( ; k < len; k++ ) {
            if ( k in t && t[ k ] === searchElement ) return k
        }
        return -1
    }
}

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



    /* ==========================================================================
       Globals, constants, and strings
       ========================================================================== */

    var
        HOURS_IN_DAY = 24,
        HOURS_TO_NOON = 12,
        MINUTES_IN_HOUR = 60,
        MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR,
        DAYS_IN_WEEK = 7,
        WEEKS_IN_CALENDAR = 6,

        STRING_DIV = 'div',
        STRING_PREFIX_PICKER = 'pickadate__',

        $document = $( document )








    /* ==========================================================================
       Build time picker components
       ========================================================================== */


    function ClockPicker( settings ) {
        var clock = this
        return {
            holder: clock.holder,
            object: clock.object,
            validate: clock.validate,
            parse: clock.parse,
            disable: clock.disable,
            shift: clock.shift,
            min: clock.min,
            max: clock.max,
            now: clock.validate,
            settings: settings,
            keyMove: {

                // Down
                40: 7,

                // Up
                38: -7,

                // Right
                39: 1,

                // Left
                37: -1
            }, //keyMove
            onRender: function( $picker ) {
                if ( !this.VIEWSET ) throw "No viewset"
                $picker[ 0 ].scrollTop = $picker.find( '.' + settings.klass.viewset ).position().top - ~~( $picker[ 0 ].clientHeight / 4 )
            },
            onOpen: function() {
                console.log( 'openeed' )
            },
            onClose: function() {
                console.log( 'closed' )
            }
        }
    } //ClockPicker


    /**
     * Create a clock holder node.
     */
    ClockPicker.prototype.holder = function() {

        var
            clock = this,
            settings = clock.settings,
            toDisable = clock.settings.disable


        return createNode( 'ul', createGroupOfNodes({
            min: clock.min().TIME,
            max: clock.max().TIME,
            i: clock.settings.interval,
            node: 'li',
            item: function( timeMinutes ) {
                timeMinutes = timeMinutes % MINUTES_IN_DAY
                return [
                    formatObjectToString( settings.format, clock.object( timeMinutes ) ),
                    (function( klasses ) {

                        if ( clock.HIGHLIGHT.length && clock.HIGHLIGHT[ 0 ].TIME == timeMinutes ) {
                            klasses.push( settings.klass.highlighted )
                        }

                        if ( clock.SELECT.length && clock.SELECT[ 0 ].TIME == timeMinutes ) {
                            klasses.push( settings.klass.selected )
                        }

                        if ( clock.VIEWSET && clock.VIEWSET.TIME == timeMinutes ) {
                            klasses.push( settings.klass.viewset )
                        }

                        if ( toDisable && clock.disable( clock.object( timeMinutes ) ).length ) {
                            klasses.push( settings.klass.disabled )
                        }

                        return klasses.join( ' ' )
                    })([ settings.klass.listItem ]),
                    'data-pick=' + timeMinutes
                ]
            }
        }), settings.klass.list )
    } //ClockPicker.prototype.holder


    /**
     * Create a clock item object.
     */
    ClockPicker.prototype.object = function( timePassed ) {

        // If the time passed is an array, float the values and convert into total minutes.
        if ( Array.isArray( timePassed ) ) {
            timePassed = +timePassed[ 0 ] * MINUTES_IN_HOUR + (+timePassed[ 1 ])
        }

        // If the time passed is not a number, create the time for "now".
        else if ( isNaN( timePassed ) ) {
            timePassed = new Date()
            timePassed = timePassed.getHours() * MINUTES_IN_HOUR + timePassed.getMinutes()
        }

        // By now, the time passed should be an integer
        return {

            // Divide to get hours from minutes.
            HOUR: ~~( timePassed / MINUTES_IN_HOUR ),

            // The remainder is the minutes.
            MINS: timePassed % MINUTES_IN_HOUR,

            // Reference to total minutes.
            TIME: timePassed
        }
    } //ClockPicker.prototype.object


    /**
     * Create a clock time object by validating it can be "reached".
     */
    ClockPicker.prototype.validate = function( timePassed ) {

        var clock = this,
            minLimit = clock.min().TIME,
            interval = clock.settings.interval


        // Make sure we have a time object to work with.
        timePassed = timePassed && timePassed.TIME ? timePassed : clock.object( timePassed )


        // If there are times to disable and this is one of them,
        // shift using the interval until we reach an enabled time.
        if ( clock.settings.disable && clock.disable( timePassed ).length ) {
            return clock.shift( timePassed )
        }


        // Create and return a clock object.
        return clock.object(

            // From the time passed, subtract the amount needed to get it within interval "reach"
            timePassed.TIME - (

                // Get the remainder between the min and time passed and then get the remainder
                // of that divided by the interval to get amount to decrease by.
                (
                    minLimit ? timePassed.TIME % minLimit : timePassed.TIME
                ) % interval

            ) +

            // And then add an interval because this time has passed
            interval
        ) //endreturn
    } //ClockPicker.prototype.validate


    /**
     * Check if a time is disabled or not.
     */
    ClockPicker.prototype.disable = function( timeObject ) {

        var clock = this

        return clock.settings.disable.filter( function( timeToDisable ) {

            // If the time is a number, match the hours.
            if ( !isNaN( timeToDisable ) ) {
                return timeObject.HOUR == timeToDisable
            }

            // If it's an array, create the object and match the times.
            if ( Array.isArray( timeToDisable ) ) {
                return timeObject.TIME == clock.object( timeToDisable ).TIME
            }
        })
    } // ClockPicker.prototype.disable


    /**
     * Shift a time by a certain interval until we reach an enabled one.
     */
    ClockPicker.prototype.shift = function( timeObject ) {

        var clock = this

        while ( clock.disable( timeObject ).length ) {

            // Increase by the interval and keep looping.
            timeObject = clock.object( timeObject.TIME += clock.settings.interval )
        }

        return timeObject
    } //ClockPicker.prototype.shift


    /**
     * Create the lower bounding time object.
     */
    ClockPicker.prototype.min = function() {

        var
            clock = this,
            limit = clock.settings.min,
            interval = clock.settings.interval,
            nowObject = clock.object()

        // If there's no limit, just create min as midnight.
        if ( !limit ) {
            limit = clock.object( 0 )
        }

        // If the limit is a number, create a validated "now" object for a relative min object.
        else if ( !isNaN( limit ) ) {
            limit = clock.object([ nowObject.HOUR, ( nowObject.MINS - nowObject.MINS % interval ) + ( limit + 1 ) * interval ])
        }

        // If it's an array, just create the time.
        else if ( Array.isArray( limit ) ) {
            limit = clock.object( limit )
        }

        else {
            console.log( limit )
            throw 'now??'
        }


        return limit
    } //ClockPicker.prototype.min


    /**
     * Create the upper bounding time object.
     */
    ClockPicker.prototype.max = function() {

        var
            clock = this,
            limit = clock.settings.max,
            interval = clock.settings.interval,
            nowObject = clock.object()

        // If there's no limit, ....
        if ( !limit ) {
            limit = clock.object( 0 )
            throw "now what?"
            // return clock.object( 0 )
        }

        // If the limit is a number, create a max limit relative to "now".
        else if ( !isNaN( limit ) ) {
            limit = clock.object([ nowObject.HOUR, ( nowObject.MINS - nowObject.MINS % interval ) + ( limit + 1 ) * interval ])
        }

        // If it's an array, just create the time.
        else if ( Array.isArray( limit ) ) {
            limit = clock.object( limit )
        }


        // If the max is less than min, add a day
        if ( limit.TIME < clock.min.TIME ) {
            limit = clock.object( limit.TIME + MINUTES_IN_DAY )
            console.log( limit )
        }

        // Finally, make sure the max time is "reachable" using the interval.
        return clock.object( limit.TIME - ( limit.TIME % interval ) )
    } //ClockPicker.prototype.max


    /**
     * Create a time object from a format.
     */
    ClockPicker.prototype.parse = function( format, string ) {
        return this.object( getReformattedString( format, string ).split( ':' ) )
    }








    /* ==========================================================================
       Build date picker components
       ========================================================================== */

    function CalendarPicker( settings ) {
        var calendar = this
        return {
            holder: calendar.holder,
            object: calendar.object,
            validate: calendar.validate,
            parse: calendar.parse,
            now: calendar.validate,
            min: calendar.min,
            max: calendar.max,
            settings: settings
        }
    } //CalendarPicker


    /**
     * Create a calendar holder node.
     */
    CalendarPicker.prototype.holder = function() {

        var
            calendar = this,
            settings = calendar.settings,

            // Create the nav for next/prev month.
            createMonthNav = function( next ) {

                // If the focused month is outside the range, return an empty string.
                // if ( ( next && calendar.now.YEAR >= LIMIT_MAX.YEAR && calendar.now.MONTH >= LIMIT_MAX.MONTH ) || ( !next && calendar.now.YEAR <= LIMIT_MIN.YEAR && calendar.now.MONTH <= LIMIT_MIN.MONTH ) ) {
                //     return ''
                // }

                // Otherwise, return the created month tag
                var monthTag = 'month' + ( next ? 'Next' : 'Prev' )
                return createNode( STRING_DIV, settings[ monthTag ], settings.klass[ monthTag ], 'data-nav=' + ( next || -1 ) )
            }, //createMonthNav


            // Create the month label
            createMonthLabel = function( monthsCollection ) {

                // If there's a need for a month selector
                return createNode( STRING_DIV, monthsCollection[ calendar.VIEWSET.MONTH ], settings.klass.month )
            }, //createMonthLabel


            // Create the year label
            createYearLabel = function() {

                // Otherwise just return the year focused
                return createNode( STRING_DIV, calendar.VIEWSET.YEAR, settings.klass.year )
            }, //createYearLabel


            // Create the calendar table head using a copy of weekday labels collection.
            tableHead = (function( collection ) {

                // If the first day should be Monday, move Sunday to the end.
                if ( settings.firstDay ) {
                    collection.push( collection.shift() )
                }

                // Create and return the table head group.
                return createNode(
                    'thead',
                    createGroupOfNodes({
                        min: 0,
                        max: 7 - 1,
                        i: 1,
                        node: 'th',
                        item: function( counter ) {
                            return [
                                collection[ counter ],
                                settings.klass.weekdays
                            ]
                        }
                    })
                ) //endreturn
            })( settings.showWeekdaysShort ? settings.weekdaysShort : settings.weekdaysFull ) //tableHead


        return createNode(
            STRING_DIV,
            createMonthNav() + createMonthNav( 1 ) +
            createMonthLabel( settings.showMonthsFull ? settings.monthsFull : settings.monthsShort ) +
            createYearLabel(),
            settings.klass.header
        ) +

        createNode(
            'table',
            tableHead +
            createNode(
                'tbody',
                createGroupOfNodes({
                    min: 0,
                    max: WEEKS_IN_CALENDAR - 1,
                    i: 1,
                    node: 'tr',
                    item: function( rowCounter ) {

                        return [
                            createGroupOfNodes({
                                min: DAYS_IN_WEEK * rowCounter - calendar.VIEWSET.DAY + 1,
                                max: function() {
                                    return this.min + DAYS_IN_WEEK - 1
                                },
                                i: 1,
                                node: 'td',
                                item: function( timeDate ) {
                                    timeDate = calendar.object([ calendar.VIEWSET.YEAR, calendar.VIEWSET.MONTH, timeDate + settings.firstDay ])
                                    return [
                                        createNode(
                                            STRING_DIV,
                                            timeDate.DATE,
                                            (function( klasses ) {

                                                if ( calendar.HIGHLIGHT.length && calendar.HIGHLIGHT[ 0 ].TIME == timeDate.TIME ) {
                                                    klasses.push( settings.klass.highlighted )
                                                }

                                                if ( calendar.SELECT.length && calendar.SELECT[ 0 ].TIME == timeDate.TIME ) {
                                                    klasses.push( settings.klass.selected )
                                                }

                                                if ( calendar.VIEWSET.MONTH == timeDate.MONTH ) {
                                                    klasses.push( settings.klass.infocus )
                                                }
                                                else {
                                                    klasses.push( settings.klass.outfocus )
                                                }

                                                return klasses.join( ' ' )
                                            })([ settings.klass.day ]),
                                            'data-pick=' + timeDate.YEAR + '/' + ( timeDate.MONTH + 1 ) + '/' + timeDate.DATE
                                        )
                                    ] //endreturn
                                }
                            })
                        ] //endreturn
                    }
                }),
                settings.klass.body
            ),
            settings.klass.table
        ) +

        createNode(
            STRING_DIV,
            createNode( 'button', settings.today, settings.klass.buttonToday, 'data-pick=' + "getTimeFormatted( 'yyyy/mm/dd', NOW )" + ' ' + "getTabindexState()" ) + createNode( 'button', settings.clear, settings.klass.buttonClear, 'data-clear=1 ' + "getTabindexState()" ),
            settings.klass.footer
        ) //endreturn
    } //CalendarPicker.prototype.holder


    /**
     * Create a date item object.
     */
    CalendarPicker.prototype.object = function( datePassed, unlimited ) {

        // If the time passed is an array, create the time by splitting the items.
        if ( Array.isArray( datePassed ) ) {
            datePassed = new Date( datePassed[ 0 ], datePassed[ 1 ], datePassed[ 2 ] )
        }

        // If the time passed is a number, create the time with the number.
        else if ( !isNaN( datePassed ) ) {
            datePassed = new Date( datePassed )
        }

        // Otherwise if it's not unlimited, set the time to today and
        // set the time to midnight (for comparison purposes).
        else if ( !unlimited ) {
            datePassed = new Date()
            datePassed.setHours( 0, 0, 0, 0 )
        }

        // Return the date object.
        return {
            YEAR: unlimited || datePassed.getFullYear(),
            MONTH: unlimited || datePassed.getMonth(),
            DATE: unlimited || datePassed.getDate(),
            DAY: unlimited || datePassed.getDay(),
            TIME: unlimited || datePassed.getTime(),
            OBJ: unlimited || datePassed
        }
    } //CalendarPicker.prototype.object = function


    /**
     * Create a date object by validating it can be "reached".
     */
    CalendarPicker.prototype.validate = function( datePassed ) {

        var calendar = this

        // Make sure we have a date object to work with.
        datePassed = datePassed && datePassed.TIME ? datePassed : calendar.object( datePassed )

        if ( datePassed.TIME < this.min.TIME ) {
            return this.min
        }

        if ( datePassed.TIME > this.max.TIME ) {
            return this.max
        }

        // If there are times to disable, make sure this isn't one of them.
        if ( calendar.settings.disable && clock.disable( datePassed ).length ) {
            console.log( calendar.settings.disable, datePassed )
        }

        return datePassed
    } //CalendarPicker.prototype.validate


    /**
     * Create the lower bounding date object.
     */
    CalendarPicker.prototype.min = function() {
        return this.bounds()
    }


    /**
     * Create the upper bounding date object.
     */
    CalendarPicker.prototype.max = function() {
        return this.bounds( 1 )
    }


    /**
     * Create the upper or lower bounding date object.
     */
    CalendarPicker.prototype.bounds = function( upper ) {

        var
            calendar = this,
            limit = upper ? this.settings.max : this.settings.min

        // If there is a limit and its a number, create a
        // time object relative to today by adding the limit.
        if ( limit && !isNaN( limit ) ) {
            return calendar.object([ NOW.YEAR, NOW.MONTH, NOW.DATE + limit ])
        }

        // If the limit is set to true, just return today
        if ( limit === true ) {
            return NOW
        }

        // If the limit is an array, construct the time by fixing month 0index
        if ( Array.isArray( limit ) ) {
            --limit[ 1 ]
            return calendar.object( limit )
        }

        // Otherwise create an infinite time
        return calendar.object( 0, upper ? Infinity : -Infinity )
    }


    /**
     * Create a time object from a format.
     */
    CalendarPicker.prototype.parse = function( format, string ) {
        return this.object( getReformattedString( format, string ).split( '/' ) )
    }








    /* ==========================================================================
       The Picker
       ========================================================================== */

    /**
     * The picker constructor that creates and returns a new date or time picker
     */
    var Picker = function( $ELEMENT, SETTINGS, FUNK ) {

        var
            // Pseudo picker constructor
            Picker = function() {},


            // The picker prototype
            P = Picker.prototype = {

                constructor: Picker,

                $node: $ELEMENT,


                /**
                 * Initialize everything
                 */
                init: function() {

                    // Bind the events on the `input` element and then
                    // insert the holder and hidden element after the element.
                    $ELEMENT.on({
                        'focus click': function() {

                            // Open the calendar.
                            P.open()

                            // Add the "focused" state onto the holder.
                            $HOLDER.addClass( CLASSES.focused )
                        },
                        keydown: function() {

                            var
                                // Grab the keycode
                                keycode = event.keyCode,

                                // Check if one of the delete keys was pressed
                                isKeycodeDelete = keycode == 8 || keycode == 46

                            // Check if delete was pressed or the calendar is closed and there is a key movement
                            if ( isKeycodeDelete || !PICKER.isOpen && PICKER.keyMove[ keycode ] ) {

                                // Prevent it from moving the page.
                                event.preventDefault()

                                // Prevent it from bubbling to doc.
                                event.stopPropagation()

                                // If backspace was pressed, clear the values and close the picker
                                if ( isKeycodeDelete ) {
                                    P.clear().close()
                                }

                                // Otherwise open the calendar
                                else {
                                    P.open()
                                }
                            }
                        }
                    }).after( [ $HOLDER, ELEMENT_HIDDEN ] )

                    // Trigger the on render event within scope of the picker.
                    triggerFunction( PICKER.onRender, PICKER, [ $HOLDER ] )

                    return P
                }, //init


                /**
                 * Open up the picker
                 */
                open: function() {

                    // If it's already open, do nothing
                    if ( PICKER.isOpen ) return P

                    // Set it as open
                    PICKER.isOpen = 1

                    // Make sure the element has focus then add the "active" class.
                    $ELEMENT.focus().addClass( CLASSES.inputActive )

                    // Add the "opened" class to the picker holder.
                    $HOLDER.addClass( CLASSES.opened )

                    // Bind the document events.
                    $document.on( 'click.P' + PICKER.ID + ' focusin.P' + PICKER.ID, function( event ) {

                        // If the target of the event is not the element, close the picker picker.
                        // * Don't worry about clicks or focusins on the holder
                        //   because those are stopped from bubbling up.
                        if ( event.target != ELEMENT ) P.close()

                    }).on( 'mousedown.P' + PICKER.ID, function( event ) {

                        // Prevent the default action to keep focus on the `input` field.
                        event.preventDefault()

                    }).on( 'keydown.P' + PICKER.ID, function( event ) {

                        var
                            // Get the keycode
                            keycode = event.keyCode,

                            // Translate that to a selection change
                            keycodeToMove = PICKER.keyMove[ keycode ]


                        // On escape, focus back onto the element and close the picker
                        if ( keycode == 27 ) {
                            ELEMENT.focus()
                            P.close()
                        }

                    })

                    // Trigger the on open event within scope of the picker.
                    triggerFunction( PICKER.onOpen, PICKER, [ $HOLDER ] )

                    return P
                }, //open


                /**
                 * Close the picker
                 */
                close: function() {

                    // If it's already closed, do nothing
                    if ( !PICKER.isOpen ) return P

                    // Set it as closed
                    PICKER.isOpen = 0

                    // Remove the "active" class.
                    $ELEMENT.removeClass( CLASSES.inputActive )

                    // Remove the "opened" class from the picker holder.
                    $HOLDER.removeClass( CLASSES.opened )

                    // Bind the document events.
                    $document.off( '.P' + PICKER.ID )

                    // Trigger the on close event within scope of the picker.
                    triggerFunction( PICKER.onClose, PICKER, [ $HOLDER ] )

                    return P
                }, //close


                /**
                 * Clear the values
                 */
                clear: function() {

                    console.log( 'clear the damn values' )
                }

            }, //Picker.prototype


            // The picker object
            PICKER = (function( pickerObject, dataValue ) {

                pickerObject.ID = ~~( Math.random() * 1e9 )
                pickerObject.I = SETTINGS.interval || 1
                pickerObject.DISABLE = []
                pickerObject.SELECT = []
                pickerObject.HIGHLIGHT = []


                // If there's a `data-value`, set the value while parsing with the submit format and then validating.
                if ( dataValue ) {
                    pickerObject.SELECT.push( pickerObject.validate( pickerObject.parse( SETTINGS.formatSubmit, dataValue ) ) )
                }


                // Add a default superficial selection as the "selected" item or the "default" one.
                pickerObject.HIGHLIGHT.push( pickerObject.SELECT[ 0 ] || pickerObject.validate() )

                // If there is an item value selected, set it as the viewset
                pickerObject.VIEWSET = pickerObject.SELECT[ 0 ] || pickerObject.validate()


                return pickerObject
            })( new FUNK( SETTINGS ), $ELEMENT.data( 'value' ) ), //PICKER


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
            ELEMENT_HIDDEN = SETTINGS.formatSubmit ?

                $( '<input type=hidden name=' + ELEMENT.name + SETTINGS.hiddenSuffix + '>' ).val(

                    // If there is a date to select, set it
                    PICKER.SELECT.length ?

                        // If there's a `data-value`, parse it with the submit format.
                        "PICKER.parse( SETTINGS.formatSubmit, $ELEMENT.data( 'value' ) )" :

                        // Otherwise leave it empty.
                        ''
                )[ 0 ] :
                null,


            // The classes
            CLASSES = SETTINGS.klass,


            // Create the picker holder with a new wrapped picker and bind the events.
            $HOLDER = $( createNode( STRING_DIV, createWrappedPicker(), CLASSES.holder ) ).on({

                // When something within the holder is focused, make it appear so.
                focusin: function( event ) {

                    // Remove the holder "focused" state from the holder.
                    $HOLDER.removeClass( CLASSES.focused )

                    // Prevent the event from propagating to the doc.
                    event.stopPropagation()
                },

                // When something within the holder is clicked, handle the various event.
                click: function( event ) {

                    // If the click is within the holder, stop it from propagating to the doc.
                    if ( $HOLDER.find( event.target ).length ) {
                        event.stopPropagation()
                        // ELEMENT.focus()
                    }
                }
            })



        /**
         * Wrap the picker components together.
         */
        function createWrappedPicker() {

            // Create a picker wrapper node
            return createNode( STRING_DIV,

                // Create a picker frame
                createNode( STRING_DIV,

                    // Create a picker box node
                    createNode( STRING_DIV,

                        // Create the components using the settings and picker
                        PICKER.holder(),

                        // The picker item class
                        CLASSES.item
                    ),

                    // Picker wrap class
                    CLASSES.wrap
                ),

                // Picker frame class
                CLASSES.frame
            ) //endreturn
        } //createWrappedPicker


        // Return a new initialized picker
        return new P.init()
    } //Picker









    /* ==========================================================================
       Helper funtions
       ========================================================================== */

    /**
     * Create a group of nodes. Expects:
     * `
        {
            min:    {Integer},
            max:    {Integer},
            i:      {Integer},
            node:   {String},
            item:   {Function}
        }
     * `
     */
    function createGroupOfNodes( groupObject ) {

        var
            // Scope for the looped object
            loopObjectScope,

            // Create the nodes list
            nodesList = '',

            // The counter starts from the `min`
            counter = triggerFunction( groupObject.min, groupObject )


        // Loop from the `min` to `max`, incrementing by `i`
        for ( ; counter <= triggerFunction( groupObject.max, groupObject, [ counter ] ); counter += groupObject.i ) {

            // Trigger the `item` function within scope of the object
            loopObjectScope = triggerFunction( groupObject.item, groupObject, [ counter ] )

            // Splice the subgroup and create nodes out of the sub nodes
            nodesList += createNode(
                groupObject.node,
                loopObjectScope[ 0 ],   // the node
                loopObjectScope[ 1 ],   // the classes
                loopObjectScope[ 2 ]    // the attributes
            )
        }

        // Return the list of nodes
        return nodesList
    } //createGroupOfNodes


    /**
     * Create a dom node string
     */
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


    /**
     * Return numbers below 10 with a leading zero
     */
    function leadZero( number ) {
        return ( number < 10 ? '0': '' ) + number
    }


    /**
     * Check if a value is a function and trigger it, if that
     */
    function triggerFunction( callback, scope, args ) {
        if ( typeof callback == 'function' ) {
            return callback.apply( scope, args || [] )
        }
        return callback
    }


    /**
     * Get the time in various formats
     */
    var timeFormattingObject = {

        h: function( string ) {

            // If there's string, then get the digits length.
            // Otherwise return the selected hour in "standard" format.
            return string ? getDigitsLength( string ) : this.HOUR % HOURS_TO_NOON || HOURS_TO_NOON
        },

        hh: function( string ) {

            // If there's a string, then the length is always 2.
            // Otherwise return the selected hour in "standard" format with a leading zero.
            return string ? 2 : leadZero( this.HOUR % HOURS_TO_NOON || HOURS_TO_NOON )
        },

        H: function( string ) {

            // If there's string, then get the digits length.
            // Otherwise return the selected hour in "military" format as a string.
            return string ? getDigitsLength( string ) : '' + this.HOUR
        },

        HH: function( string ) {

            // If there's string, then get the digits length.
            // Otherwise return the selected hour in "military" format with a leading zero.
            return string ? getDigitsLength( string ) : leadZero( this.HOUR )
        },

        i: function( string ) {

            // If there's a string, then the length is always 2.
            // Otherwise return the selected minutes.
            return string ? 2 : leadZero( this.MINS )
        },

        a: function( string ) {

            // If there's a string, then the length is always 4.
            // Otherwise check if it's more than "noon" and return either am/pm.
            return string ? 4 : MINUTES_IN_DAY / 2 > this.TIME ? 'a.m.' : 'p.m.'
        },

        A: function( string ) {

            // If there's a string, then the length is always 2.
            // Otherwise check if it's more than "noon" and return either am/pm.
            return string ? 2 : MINUTES_IN_DAY / 2 > this.TIME ? 'AM' : 'PM'
        },

        // Create an array by splitting the formatting string passed.
        toArray: function( formatString ) { return formatString.split( /(h{1,2}|H{1,2}|i|a|A|!.)/g ) }
    }

    // If the second character is a digit, length is 2 otherwise 1.
    function getDigitsLength( string ) {
        return ( /\d/ ).test( string[ 1 ] ) ? 2 : 1
    }

    function getReformattedString( format, timeString ) {

        return timeFormattingObject.toArray( format ).map( function( value ) {

            // If the formatting length function exists, invoke it.
            // Otherwise it's the length of the formatting item being mapped
            // (while removing escaped characters).
            var formattingLength = timeFormattingObject[ value ] ? timeFormattingObject[ value ]( timeString ) : value.replace( /^!/, '' ).length

            // If there's a format length,
            if ( formattingLength ) {

                // Split the time string up to the format length.
                var tempString = timeString.substr( 0, formattingLength )

                // Update the time string as the substring from format length to end.
                timeString = timeString.substr( formattingLength )

                return tempString
            }

            return value.replace( /^!/, '' )
        }).join( '' )
    }

    function formatObjectToString( format, timeObject ) {
        return timeFormattingObject.toArray( format ).map( function( value ) {
            return triggerFunction( timeFormattingObject[ value ], timeObject ) || value.replace( /^!/, '' )
        }).join( '' )
    }









    /* ==========================================================================
       Extend jQuery
       ========================================================================== */

    /**
     * Map through the each picker type and extend jQuery
     */
    [ 'pickadate', 'pickatime' ].map( function( picker, index ) {

        $.fn[ picker ] = function( options ) {

            // Merge the options with a deep copy
            options = $.extend( true, {}, $.fn[ picker ].defaults, options )

            // Just stop if the picker should be disabled
            if ( options.disablePicker ) return this

            return this.each( function() {
                var $this = $( this )
                if ( !$this.data( picker ) ) {
                    $this.data( picker, new Picker( $this, options, index ? ClockPicker : CalendarPicker ) )
                }
            })
        }
    })


    /**
     * Default options for the date picker
     */
    $.fn.pickadate.defaults = {

        // The format to show on the `input` element
        format: 'd mmmm, yyyy',

        // The format to send to the server
        formatSubmit: 'yyyy/mm/dd',

        // Hidden `input` element name suffix
        hiddenSuffix: '_submit',

        // Strings (with translation support) for months and weekdays
        monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        weekdaysFull: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

        // Today and clear
        today: 'Today',
        clear: 'Clear',

        // Display strings
        monthPrev: '&#9664;',
        monthNext: '&#9654;',
        showMonthsFull: 1,
        showWeekdaysShort: 1,

        // First day of the week: 0 = Sunday, 1 = Monday
        firstDay: 0,

        // The time limits
        min: 0,
        max: 0,

        // Times to disable
        disable: 0,

        // Disable for browsers with native date support
        disablePicker: 0,


        // Classes
        klass: {

            inputActive: STRING_PREFIX_PICKER + 'input--active',

            holder: STRING_PREFIX_PICKER + 'holder',
            opened: STRING_PREFIX_PICKER + 'holder--opened',
            focused: STRING_PREFIX_PICKER + 'holder--focused',

            frame: STRING_PREFIX_PICKER + 'frame',
            wrap: STRING_PREFIX_PICKER + 'wrap',

            item: STRING_PREFIX_PICKER + 'calendar',

            table: STRING_PREFIX_PICKER + 'table',

            header: STRING_PREFIX_PICKER + 'header',

            monthPrev: STRING_PREFIX_PICKER + 'nav--prev',
            monthNext: STRING_PREFIX_PICKER + 'nav--next',

            month: STRING_PREFIX_PICKER + 'month',
            year: STRING_PREFIX_PICKER + 'year',

            selectMonth: STRING_PREFIX_PICKER + 'select--month',
            selectYear: STRING_PREFIX_PICKER + 'select--year',

            weekdays: STRING_PREFIX_PICKER + 'weekday',

            body: STRING_PREFIX_PICKER + 'body',

            day: STRING_PREFIX_PICKER + 'day',
            disabled: STRING_PREFIX_PICKER + 'day--disabled',
            selected: STRING_PREFIX_PICKER + 'day--selected',
            highlighted: STRING_PREFIX_PICKER + 'day--highlighted',
            now: STRING_PREFIX_PICKER + 'day--today',
            infocus: STRING_PREFIX_PICKER + 'day--infocus',
            outfocus: STRING_PREFIX_PICKER + 'day--outfocus',

            footer: STRING_PREFIX_PICKER + 'footer',

            buttonClear: STRING_PREFIX_PICKER + 'button--clear',
            buttonToday: STRING_PREFIX_PICKER + 'button--today'
        }
    } //$.fn.pickadate.defaults


    /**
     * Default options for the time picker
     */
    $.fn.pickatime.defaults = {

        // The format to show on the `input` element
        format: 'h:i A',

        // The format to send to the server
        formatSubmit: '',

        // Hidden element name suffix
        hiddenSuffix: '_submit',

        // The interval between each time
        interval: 30,

        // The time limits
        min: 0,
        max: [ HOURS_IN_DAY, -1 ],

        // Times to disable
        disable: 0,

        // Disable for browsers with native date support
        disablePicker: 0,

        // Classes
        klass: {

            inputActive: STRING_PREFIX_PICKER + 'input--active',

            holder: STRING_PREFIX_PICKER + 'holder ' + STRING_PREFIX_PICKER + 'holder--time',
            opened: STRING_PREFIX_PICKER + 'holder--opened',
            focused: STRING_PREFIX_PICKER + 'holder--focused',

            frame: STRING_PREFIX_PICKER + 'frame',
            wrap: STRING_PREFIX_PICKER + 'wrap',

            item: STRING_PREFIX_PICKER + 'clock',

            list: STRING_PREFIX_PICKER + 'list',
            listItem: STRING_PREFIX_PICKER + 'list-item',

            disabled: STRING_PREFIX_PICKER + 'list-item--disabled',
            selected: STRING_PREFIX_PICKER + 'list-item--selected',
            highlighted: STRING_PREFIX_PICKER + 'list-item--highlighted',
            viewset: STRING_PREFIX_PICKER + 'list-item--viewset',
            now: STRING_PREFIX_PICKER + 'list-item--now'
        }
    } //$.fn.pickatime.defaults




})( jQuery, document );




