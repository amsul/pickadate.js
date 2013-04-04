/*!
 * pickadate.js v3.0.0alpha, 2013-04-03
 * By Amsul (http://amsul.ca)
 * Hosted on http://amsul.github.com/pickadate.js
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

/**
 * Todo:
 * – Restart picker after stopping.
 * – Fix for "now" disabled.
 * – If time passed, list should update?
 * – Fix time "clear" button.
 * – WAI-ARIA support
 * – Lots more...
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

        $.extend( clock, {
            settings: settings,
            i: settings.interval || 30,
            div: ':',
            keyMove: {
                40: 1, // Down
                38: -1, // Up
                39: 1, // Right
                37: -1, // Left
                go: function( highlightedTimeObject, timeChange ) {

                    // Create and return a validated target object with the relative date change to "go" to.
                    return highlightedTimeObject ? clock.validate( timeChange * clock.i + highlightedTimeObject.TIME, timeChange ) : undefined
                }
            },
            formats: {
                h: function( string, timeObject ) {

                    // If there's string, then get the digits length.
                    // Otherwise return the selected hour in "standard" format.
                    return string ? getDigitsLength( string ) : timeObject.HOUR % HOURS_TO_NOON || HOURS_TO_NOON
                },
                hh: function( string, timeObject ) {

                    // If there's a string, then the length is always 2.
                    // Otherwise return the selected hour in "standard" format with a leading zero.
                    return string ? 2 : leadZero( timeObject.HOUR % HOURS_TO_NOON || HOURS_TO_NOON )
                },
                H: function( string, timeObject ) {

                    // If there's string, then get the digits length.
                    // Otherwise return the selected hour in "military" format as a string.
                    return string ? getDigitsLength( string ) : '' + timeObject.HOUR
                },
                HH: function( string, timeObject ) {

                    // If there's string, then get the digits length.
                    // Otherwise return the selected hour in "military" format with a leading zero.
                    return string ? getDigitsLength( string ) : leadZero( timeObject.HOUR )
                },
                i: function( string, timeObject ) {

                    // If there's a string, then the length is always 2.
                    // Otherwise return the selected minutes.
                    return string ? 2 : leadZero( timeObject.MINS )
                },
                a: function( string, timeObject ) {

                    // If there's a string, then the length is always 4.
                    // Otherwise check if it's more than "noon" and return either am/pm.
                    return string ? 4 : MINUTES_IN_DAY / 2 > timeObject.TIME % MINUTES_IN_DAY ? 'a.m.' : 'p.m.'
                },
                A: function( string, timeObject ) {

                    // If there's a string, then the length is always 2.
                    // Otherwise check if it's more than "noon" and return either am/pm.
                    return string ? 2 : MINUTES_IN_DAY / 2 > timeObject.TIME % MINUTES_IN_DAY ? 'AM' : 'PM'
                },

                // Create an array by splitting the formatting string passed.
                toArray: function( formatString ) { return formatString.split( /(h{1,2}|H{1,2}|i|a|A|!.)/g ) },

                // Format an object into a string using the formatting options.
                toString: function ( format, itemObject ) {
                    var clock = this,
                        formattings = clock.formats
                    return formattings.toArray( format ).map( function( label ) {
                        return triggerFunction( formattings[ label ], clock, [ 0, itemObject ] ) || label.replace( /^!/, '' )
                    }).join( '' )
                }
            },
            onStart: function( $holder ) {
                triggerFunction( this.settings.onStart, this, [ $holder ] )
            },
            onRender: function( $holder ) {

                var picker = this,
                    $highlighted = $holder.find( '.' + picker.settings.klass.highlighted )

                if ( $highlighted.length ) {
                    $holder[ 0 ].scrollTop = $highlighted.position().top - ~~( $holder[ 0 ].clientHeight / 4 )
                }
                else {
                    console.warn( 'Nothing to highlight' )
                }

                triggerFunction( picker.settings.onRender, picker, [ $holder ] )
            },
            onOpen: function( $holder ) {
                // $holder.find( 'button, select' ).attr( 'tabindex', 0 )
                triggerFunction( this.settings.onOpen, this, [ $holder ] )
            },
            onClose: function( $holder ) {
                // $holder.find( 'button, select' ).attr( 'tabindex', -1 )
                triggerFunction( this.settings.onClose, this, [ $holder ] )
            },
            onSet: function( $holder ) {
                triggerFunction( this.settings.onSet, this, [ $holder ] )
            },
            onStop: function( $holder ) {
                triggerFunction( this.settings.onStop, this, [ $holder ] )
            }
        })
    } //ClockPicker


    /**
     * Create a clock holder node.
     */
    ClockPicker.prototype.holder = function( picker ) {

        var
            clock = this,
            settings = clock.settings,
            pickerSelected = picker.get( 'select' ),
            pickerHighlighted = picker.get( 'highlight' ),
            pickerViewset = picker.get( 'view' ),
            pickerDisabledCollection = picker.get( 'disable' )


        return createNode( 'ul', createGroupOfNodes({
            min: picker.get( 'min' ).TIME,
            max: picker.get( 'max' ).TIME,
            i: clock.i,
            node: 'li',
            item: function( loopedTime ) {
                loopedTime = clock.object( loopedTime )
                return [
                    triggerFunction( clock.formats.toString, clock, [ settings.format, loopedTime ] ),
                    (function( klasses, timeMinutes ) {

                        if ( pickerSelected && pickerSelected.TIME == timeMinutes ) {
                            klasses.push( settings.klass.selected )
                        }

                        if ( pickerHighlighted && pickerHighlighted.TIME == timeMinutes ) {
                            klasses.push( settings.klass.highlighted )
                        }

                        if ( pickerViewset && pickerViewset.TIME == timeMinutes ) {
                            klasses.push( settings.klass.viewset )
                        }

                        if ( pickerDisabledCollection && clock.disable( pickerDisabledCollection, clock.object( timeMinutes ) ) ) {
                            klasses.push( settings.klass.disabled )
                        }

                        return klasses.join( ' ' )
                    })( [ settings.klass.listItem ], loopedTime.TIME ),
                    'data-pick=' + loopedTime.HOUR + clock.div + loopedTime.MINS
                ]
            }
        }) + createNode( 'li', settings.clear, settings.klass.clear, 'data-clear=1' ), settings.klass.list )
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
    ClockPicker.prototype.validate = function( timePassed, keyMovement ) {

        var
            clock = this,
            minLimitObject = clock.min(),
            maxLimitObject = clock.max(),

            // Make sure we have a time object to work with.
            timePassedObject = timePassed && !isNaN( timePassed.TIME ) ? timePassed : clock.object( timePassed )

        // If no time was passed or there was a key movement, normalize the time object into a "reachable" time.
        if ( !timePassed || keyMovement ) {

            timePassedObject = clock.object(

                // From the time passed, subtract the amount needed to get it within interval "reach".
                timePassedObject.TIME - (

                    // Get the remainder between the min and time passed and then get the remainder
                    // of that divided by the interval to get amount to decrease by.
                    (
                        minLimitObject.TIME ? timePassedObject.TIME % minLimitObject.TIME : timePassedObject.TIME
                    ) % clock.i

                // And then if there's a key movement, do nothing.
                // Otherwise add an interval because this time has passed.
                ) + ( keyMovement ? 0 : clock.i )
            )
        }

        // If we passed the lower bound, set the key movement upwards,
        // flip our "reached min" flag, and set the time to the lower bound.
        if ( timePassedObject.TIME < minLimitObject.TIME ) {
            keyMovement = 1
            clock.doneMin = 1
            timePassedObject = clock.object( minLimitObject.TIME )
        }

        // Otherwise if we passed the upper bound, set the key movement downwards,
        // flip our "reached max" flag, and set the time to the upper bound.
        else if ( timePassedObject.TIME > maxLimitObject.TIME ) {
            keyMovement = -1
            clock.doneMax = 1
            timePassedObject = clock.object( maxLimitObject.TIME )
        }

        // If we've hit the upper and lower bounds, set the time to now and move on.
        if ( clock.doneMin && clock.doneMax ) {
            timePassedObject = clock.now()
        }

        // Otherwise if there are times to disable and this is one of them,
        // shift using the interval until we reach an enabled time.
        else if ( clock.settings.disable && clock.disable( clock.settings.disable, timePassedObject ) ) {
            timePassedObject = clock.shift( timePassedObject, timePassedObject.TIME > maxLimitObject.TIME ? -1 : keyMovement || 1 )
        }

        // Reset the check for if we reached the min and max bounds.
        clock.doneMin = undefined
        clock.doneMax = undefined

        return timePassedObject
    } //ClockPicker.prototype.validate


    /////// like this??
    ClockPicker.prototype.now = ClockPicker.prototype.validate


    /**
     * Check if a time is disabled or not.
     */
    ClockPicker.prototype.disable = function( collection, timeObject ) {

        var clock = this,

            // Filter through the disabled times to check if this is one.
            isDisabledTime = collection.filter( function( timeToDisable ) {

                // If the time is a number, match the hours.
                if ( !isNaN( timeToDisable ) ) {
                    return timeObject.HOUR == timeToDisable
                }

                // If it's an array, create the object and match the times.
                if ( Array.isArray( timeToDisable ) ) {
                    return timeObject.TIME == clock.object( timeToDisable ).TIME
                }
            }).length

        // If the clock is flipped, flip the condition.
        return clock.props.get( 'flip' ) ? !isDisabledTime : isDisabledTime
    } // ClockPicker.prototype.disable


    /**
     * Shift a time by a certain interval until we reach an enabled one.
     */
    ClockPicker.prototype.shift = function( timeObject, keyMovement ) {

        var clock = this,
            minLimit = clock.min().TIME,
            maxLimit = clock.max().TIME

        // Keep looping as long as the time is disabled.
        while ( clock.disable( timeObject ) ) {

            // Increase/decrease the time by the key movement and keep looping.
            timeObject = clock.object( timeObject.TIME += ( keyMovement || clock.i ) * clock.i )

            // If we've looped beyond the limits, break out of the loop.
            if ( timeObject.TIME < minLimit || timeObject.TIME > maxLimit ) {
                break
            }
        }

        // Do a final validation check to make sure it's within bounds.
        return clock.validate( timeObject, keyMovement )
    } //ClockPicker.prototype.shift


    /**
     * Create the lower bounding time object.
     */
    ClockPicker.prototype.min = function() {

        var
            clock = this,
            limit = clock.settings.min,
            interval = clock.i,
            nowObject = clock.object()

        // If there's no limit, just create min as midnight.
        if ( !limit ) {
            return clock.object( 0 )
        }

        // If the limit is set to true, just return a normalized "now"
        // plus one interval because this time has passed.
        if ( limit === true ) {
            return clock.object( nowObject.TIME - ( ( limit.TIME ? nowObject.TIME % limit.TIME : nowObject.TIME ) % interval ) + interval )
        }

        // If the limit is a number, create a validated "now" object for a relative min object.
        if ( !isNaN( limit ) ) {
            return clock.object([ nowObject.HOUR, ( nowObject.MINS - nowObject.MINS % interval ) + ( limit + 1 ) * interval ])
        }

        // Otherwise create the object with whatever the limit is.
        return clock.object( limit )
    } //ClockPicker.prototype.min


    /**
     * Create the upper bounding time object.
     */
    ClockPicker.prototype.max = function() {

        var
            clock = this,
            settings = clock.settings,
            limit = settings.max,
            interval = clock.i,
            nowObject = clock.object()

        // If there's no limit, set it as a minute before next midnight.
        if ( !limit ) {
            limit = clock.object( MINUTES_IN_DAY - 1 )
        }

        // If the limit is set to true, just return a normalized "now"
        // plus one interval because this time has passed.
        else if ( limit === true ) {
            limit = clock.object( nowObject.TIME - ( ( limit.TIME ? nowObject.TIME % limit.TIME : nowObject.TIME ) % interval ) + interval )
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
        if ( limit.TIME < clock.min( settings ).TIME ) {
            limit = clock.object( limit.TIME + MINUTES_IN_DAY )
        }


        // Finally, make sure the max time is "reachable" using the interval and min limit.
        return clock.object( limit.TIME - ( ( clock.min( settings ).TIME ? limit.TIME % clock.min( settings ).TIME : limit.TIME ) % interval ) )
    } //ClockPicker.prototype.max


    /**
     * Create a time object from a format.
     */
    ClockPicker.prototype.parse = function( format, string ) {

        if ( !format ) throw "Need a format"

        var
            clock = this,
            parsingObject = {},
            formattings = clock.formats

        // Convert the format into an array and then map through it.
        formattings.toArray( format ).map( function( label ) {

            var
                // Grab the formatting label.
                formattingLabel = formattings[ label ],

                // The format length is from the formatting label function or the
                // label length without the escaping exclamation (!) mark.
                formatLength = formattingLabel ? triggerFunction( formattingLabel, clock, [ string, parsingObject ] ) : label.replace( /^!/, '' ).length

            // If there's a format label, split the string up to the format length.
            // Then add it to the parsing object with appropriate label.
            if ( formattingLabel ) {
                parsingObject[ label ] = string.substr( 0, formatLength )
            }

            // Update the time string as the substring from format length to end.
            string = string.substr( formatLength )
        })

        return +parsingObject.i + MINUTES_IN_HOUR * (

            +( parsingObject.H || parsingObject.HH ) ||

            ( +( parsingObject.h || parsingObject.hh ) + ( /^p/i.test( parsingObject.A || parsingObject.a ) ? 12 : 0 ) )
        )
    } //ClockPicker.prototype.parse








    /* ==========================================================================
       Build date picker components
       ========================================================================== */

    function CalendarPicker( settings ) {

        var
            calendar = this,

            // Return the length of the first word in a collection.
            getWordLengthFromCollection = function( string, collection, dateObject ) {

                // Grab the first word from the string.
                var word = string.match( /\w+/ )[ 0 ]

                // If there's no month index, add it to the date object
                if ( !dateObject.mm && !dateObject.m ) {
                    dateObject.m = collection.indexOf( word )
                }

                // Return the length of the word.
                return word.length
            }

        $.extend( calendar, {
            settings: settings,
            i: 1,
            div: '/',
            keyMove: {
                40: 7, // Down
                38: -7, // Up
                39: 1, // Right
                37: -1, // Left
                go: function( dateObject, dateChange ) {

                    var
                        picker = this,

                        // Create a validated target object with the relative date change.
                        targetDateObject = calendar.validate( [ dateObject.YEAR, dateObject.MONTH, dateObject.DATE + dateChange ], dateChange )

                    // If there's a month change, update the viewset.
                    if ( targetDateObject.MONTH != picker.get( 'view' ).MONTH ) {
                        picker.set( 'view', targetDateObject )
                    }

                    // Return the targetted date object to "go" to.
                    return targetDateObject
                }
            },
            formats: {
                d: function( string, dateObject ) {

                    // If there's string, then get the digits length.
                    // Otherwise return the selected date.
                    return string ? getDigitsLength( string ) : dateObject.DATE
                },
                dd: function( string, dateObject ) {

                    // If there's a string, then the length is always 2.
                    // Otherwise return the selected date with a leading zero.
                    return string ? 2 : leadZero( dateObject.DATE )
                },
                ddd: function( string, dateObject ) {

                    // If there's a string, then get the length of the first word.
                    // Otherwise return the short selected weekday.
                    return string ? getFirstWordLength( string ) : settings.weekdaysShort[ dateObject.DAY ]
                },
                dddd: function( string, dateObject ) {

                    // If there's a string, then get the length of the first word.
                    // Otherwise return the full selected weekday.
                    return string ? getFirstWordLength( string ) : settings.weekdaysFull[ dateObject.DAY ]
                },
                m: function( string, dateObject ) {

                    // If there's a string, then get the length of the digits
                    // Otherwise return the selected month with 0index compensation.
                    return string ? getDigitsLength( string ) : dateObject.MONTH + 1
                },
                mm: function( string, dateObject ) {

                    // If there's a string, then the length is always 2.
                    // Otherwise return the selected month with 0index and leading zero.
                    return string ? 2 : leadZero( dateObject.MONTH + 1 )
                },
                mmm: function( string, dateObject ) {

                    var collection = settings.monthsShort

                    // If there's a string, get length of the relevant month from the short
                    // months collection. Otherwise return the selected month from that collection.
                    return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ dateObject.MONTH ]
                },
                mmmm: function( string, dateObject ) {

                    var collection = settings.monthsFull

                    // If there's a string, get length of the relevant month from the full
                    // months collection. Otherwise return the selected month from that collection.
                    return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ dateObject.MONTH ]
                },
                yy: function( string, dateObject ) {

                    // If there's a string, then the length is always 2.
                    // Otherwise return the selected year by slicing out the first 2 digits.
                    return string ? 2 : ( '' + dateObject.YEAR ).slice( 2 )
                },
                yyyy: function( string, dateObject ) {

                    // If there's a string, then the length is always 4.
                    // Otherwise return the selected year.
                    return string ? 4 : dateObject.YEAR
                },

                // Create an array by splitting the formatting string passed.
                toArray: function( formatString ) { return formatString.split( /(d{1,4}|m{1,4}|y{4}|yy|!.)/g ) },

                // Format an object into a string using the formatting options.
                toString: function ( formatString, itemObject ) {
                    return calendar.formats.toArray( formatString ).map( function( label ) {
                        return triggerFunction( calendar.formats[ label ], calendar, [ 0, itemObject ] ) || label.replace( /^!/, '' )
                    }).join( '' )
                }
            }, //formats
            onStart: function( $holder ) {
                // console.log( 'what is ', this )
                triggerFunction( settings.onStart, this, [ $holder ] )
            },
            onRender: function( $holder ) {

                var picker = this

                $holder.find( '.' + settings.klass.selectMonth ).on( 'change', function() {
                    picker.set( 'view', [ calendar.props.get( 'view' ).YEAR, this.value, calendar.props.get( 'highlight' ).DATE ] )
                    $holder.find( '.' + settings.klass.selectMonth ).focus()
                })

                $holder.find( '.' + settings.klass.selectYear ).on( 'change', function() {
                    picker.set( 'view', [ this.value, calendar.props.get( 'view' ).MONTH, calendar.props.get( 'highlight' ).DATE ] )
                    $holder.find( '.' + settings.klass.selectYear ).focus()
                })

                triggerFunction( settings.onRender, picker, [ $holder ] )
            },
            onOpen: function( $holder ) {
                $holder.find( 'button, select' ).attr( 'tabindex', 0 )
                triggerFunction( settings.onOpen, this, [ $holder ] )
            },
            onClose: function( $holder ) {
                $holder.find( 'button, select' ).attr( 'tabindex', -1 )
                triggerFunction( settings.onClose, this, [ $holder ] )
            },
            onSet: function( $holder ) {
                triggerFunction( settings.onSet, this, [ $holder ] )
            },
            onStop: function( $holder ) {
                triggerFunction( settings.onStop, this, [ $holder ] )
            }
        })

    } //CalendarPicker


    /**
     * Create a calendar holder node.
     */
    CalendarPicker.prototype.holder = function( picker, properties ) {

        var
            calendar = this

        calendar.props = properties

        var
            settings = calendar.settings,
            minLimitObject = properties.get( 'min' ),
            maxLimitObject = properties.get( 'max' ),
            now = properties.get( 'now' ),
            selected = properties.get( 'select' ),
            highlighted = properties.get( 'highlight' ),
            viewset = properties.get( 'view' ),
            disabled = properties.get( 'disable' ),

            // Get the tab index state picker opened/closed.
            getTabindexState = function() {
                return 'tabindex=' + ( calendar.props.get( 'open' ) ? 0 : -1 )
            },

            // Create the nav for next/prev month.
            createMonthNav = function( next ) {

                // Otherwise, return the created month tag.
                return createNode(
                    STRING_DIV,
                    ' ',
                    settings.klass[ 'nav' + ( next ? 'Next' : 'Prev' ) ] + (

                        // If the focused month is outside the range, disabled the button.
                        ( next && viewset.YEAR >= maxLimitObject.YEAR && viewset.MONTH >= maxLimitObject.MONTH ) ||
                        ( !next && viewset.YEAR <= minLimitObject.YEAR && viewset.MONTH <= minLimitObject.MONTH ) ?
                        ' ' + settings.klass.navDisabled : ''
                    ),
                    'data-nav=' + ( next || -1 )
                ) //endreturn
            }, //createMonthNav


            // Create the month label
            createMonthLabel = function( monthsCollection ) {

                // If there are months to select, add a dropdown menu.
                if ( settings.selectMonths ) {

                    return createNode( 'select', createGroupOfNodes({
                        min: 0,
                        max: 11,
                        i: 1,
                        node: 'option',
                        item: function( loopedMonth ) {

                            return [

                                // The looped month and no classes.
                                monthsCollection[ loopedMonth ], 0,

                                // Set the value and selected index.
                                'value=' + loopedMonth +
                                ( viewset.MONTH == loopedMonth ? ' selected' : '' ) +
                                (
                                    (
                                        ( viewset.YEAR == minLimitObject.YEAR && loopedMonth < minLimitObject.MONTH ) ||
                                        ( viewset.YEAR == maxLimitObject.YEAR && loopedMonth > maxLimitObject.MONTH )
                                    ) ?
                                    ' disabled' : ''
                                )
                            ]
                        }
                    }), settings.klass.selectMonth )
                }

                // If there's a need for a month selector
                return createNode( STRING_DIV, monthsCollection[ viewset.MONTH ], settings.klass.month )
            }, //createMonthLabel


            // Create the year label
            createYearLabel = function() {

                var focusedYear = viewset.YEAR,

                // If years selector is set to a literal "true", set it to 5. Otherwise
                // divide in half to get half before and half after focused year.
                numberYears = settings.selectYears === true ? 5 : ~~( settings.selectYears / 2 )

                // If there are years to select, add a dropdown menu.
                if ( numberYears ) {

                    var
                        minYear = minLimitObject.YEAR,
                        maxYear = maxLimitObject.YEAR,
                        lowestYear = focusedYear - numberYears,
                        highestYear = focusedYear + numberYears

                    // If the min year is greater than the lowest year, increase the highest year
                    // by the difference and set the lowest year to the min year.
                    if ( minYear > lowestYear ) {
                        highestYear += minYear - lowestYear
                        lowestYear = minYear
                    }

                    // If the max year is less than the highest year, decrease the lowest year
                    // by the lower of the two: available and needed years. Then set the
                    // highest year to the max year.
                    if ( maxYear < highestYear ) {

                        var availableYears = lowestYear - minYear,
                            neededYears = highestYear - maxYear

                        lowestYear -= availableYears > neededYears ? neededYears : availableYears
                        highestYear = maxYear
                    }

                    return createNode( 'select', createGroupOfNodes({
                        min: lowestYear,
                        max: highestYear,
                        i: 1,
                        node: 'option',
                        item: function( loopedYear ) {
                            return [

                                // The looped year and no classes.
                                loopedYear, 0,

                                // Set the value and selected index.
                                'value=' + loopedYear + ( focusedYear == loopedYear ? ' selected' : '' )
                            ]
                        }
                    }), settings.klass.selectYear )
                }

                // Otherwise just return the year focused
                return createNode( STRING_DIV, focusedYear, settings.klass.year )
            }, //createYearLabel


            // Create the calendar table head using a copy of weekday labels collection.
            // * We do a copy so we don't mutate the original array.
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
            })( ( settings.showWeekdaysShort ? settings.weekdaysShort : settings.weekdaysFull ).slice( 0 ) ) //tableHead


        // Create and return the entire calendar.
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
                                min: DAYS_IN_WEEK * rowCounter - viewset.DAY + 1, // Add 1 for weekday 0index
                                max: function() {
                                    return this.min + DAYS_IN_WEEK - 1
                                },
                                i: 1,
                                node: 'td',
                                item: function( timeDate ) {

                                    // Convert the time date from a relative date to a date object
                                    timeDate = calendar.create([ viewset.YEAR, viewset.MONTH, timeDate + ( settings.firstDay ? 1 : 0 ) ])

                                    return [
                                        createNode(
                                            STRING_DIV,
                                            timeDate.DATE,
                                            (function( klasses ) {

                                                // Add the `infocus` or `outfocus` classes based on month in view.
                                                klasses.push( viewset.MONTH == timeDate.MONTH ? settings.klass.infocus : settings.klass.outfocus )

                                                // Add the `today` class if needed.
                                                if ( now.TIME == timeDate.TIME ) {
                                                    klasses.push( settings.klass.now )
                                                }

                                                // Add the `selected` class if something's selected and the time matches.
                                                if ( selected && selected.TIME == timeDate.TIME ) {
                                                    klasses.push( settings.klass.selected )
                                                }

                                                // Add the `highlighted` class if something's highlighted and the time matches.
                                                if ( highlighted && highlighted.TIME == timeDate.TIME ) {
                                                    klasses.push( settings.klass.highlighted )
                                                }

                                                // Add the `disabled` class if something's disabled and the object matches.
                                                if ( disabled && calendar.disable( disabled, timeDate ) || timeDate.TIME < minLimitObject.TIME || timeDate.TIME > maxLimitObject.TIME ) {
                                                    klasses.push( settings.klass.disabled )
                                                }

                                                return klasses.join( ' ' )
                                            })([ settings.klass.day ]),
                                            'data-pick=' + timeDate.YEAR + calendar.div + timeDate.MONTH + calendar.div + timeDate.DATE
                                        )
                                    ] //endreturn
                                }
                            })
                        ] //endreturn
                    }
                })
            ),
            settings.klass.table
        ) +

        createNode(
            STRING_DIV,
            createNode( 'button', settings.today, settings.klass.buttonToday, 'data-pick=' + now.YEAR + calendar.div + now.MONTH + calendar.div + now.DATE + ' ' + getTabindexState() ) + createNode( 'button', settings.clear, settings.klass.buttonClear, 'data-clear=1 ' + getTabindexState() ),
            settings.klass.footer
        ) //endreturn
    } //CalendarPicker.prototype.holder


    /**
     * Create picker component objects.
     */
    CalendarPicker.prototype.create = function( datePassed, defaultValue ) {

        // If the date passed already has a time, just return it.
        if ( datePassed && !isNaN( datePassed.TIME ) ) {
            return datePassed
        }

        // If the date passed is an array, create the time by splitting the items.
        else if ( Array.isArray( datePassed ) ) {
            datePassed = new Date( datePassed[ 0 ], datePassed[ 1 ], datePassed[ 2 ] )
        }

        // If the time passed is a number, create the time with the number.
        else if ( !isNaN( datePassed ) ) {
            datePassed = new Date( datePassed )
        }

        // Otherwise if there no default value, set the time to today and
        // set the time to midnight (for comparison purposes).
        else if ( !defaultValue ) {
            datePassed = new Date()
            datePassed.setHours( 0, 0, 0, 0 )
        }

        // Return the object.
        return {
            YEAR: defaultValue || datePassed.getFullYear(),
            MONTH: defaultValue || datePassed.getMonth(),
            DATE: defaultValue || datePassed.getDate(),
            DAY: defaultValue || datePassed.getDay(),
            TIME: defaultValue || datePassed.getTime(),
            OBJ: defaultValue || datePassed
        }
    } //CalendarPicker.prototype.create


    /**
     * Create a date object by validating it can be "reached".
     */
    CalendarPicker.prototype.validate = function( datePassed, keyMovement ) {

        var calendar = this,
            minLimitObject = calendar.props.get( 'min' ),
            maxLimitObject = calendar.props.get( 'max' ),

            // Make sure we have a date object to work with.
            datePassedObject = datePassed && !isNaN( datePassed.TIME ) ? datePassed : calendar.create( datePassed )

        // If we passed the lower bound, set the key movement upwards,
        // flip our "reached min" flag, and set the date to the lower bound.
        if ( datePassedObject.TIME < minLimitObject.TIME ) {
            keyMovement = 1
            calendar.doneMin = 1
            datePassedObject = minLimitObject
        }

        // Otherwise if we passed the upper bound, set the key movement downwards,
        // flip our "reached max" flag, and set the date to the upper bound.
        else if ( datePassedObject.TIME > maxLimitObject.TIME ) {
            keyMovement = -1
            calendar.doneMax = 1
            datePassedObject = maxLimitObject
        }

        // If we've hit the upper and lower bounds, set the date to now and move on.
        if ( calendar.doneMin && calendar.doneMax ) {
            datePassedObject = calendar.props.get( 'now' )
        }

        // Otherwise if there are dates to disable and this is one of them,
        // shift using the interval until we reach an enabled date.
        else if ( calendar.props.disable.length && calendar.disable( datePassedObject ) ) {
            datePassedObject = calendar.shift( datePassedObject, datePassedObject.TIME > maxLimitObject.TIME ? -1 : keyMovement || 1 )
        }

        // Reset the check for if we reached the min and max bounds.
        calendar.doneMin = undefined
        calendar.doneMax = undefined

        return datePassedObject
    } //CalendarPicker.prototype.validate


    /**
     * Check if a date is disabled or not.
     */
    CalendarPicker.prototype.disable = function( collection, dateObject ) {

        var calendar = this,

            // Filter through the disabled dates to check if this is one.
            isDisabledDate = collection.filter( function( dateToDisable ) {

                // If the date is a number, match the weekday with 0index and `firstDay` check.
                if ( !isNaN( dateToDisable ) ) {
                    return dateObject.DAY == ( calendar.settings.firstDay ? dateToDisable : dateToDisable - 1 ) % 7
                }

                // If it's an array, create the object and match the times.
                if ( Array.isArray( dateToDisable ) ) {
                    return dateObject.TIME == calendar.object( dateToDisable ).TIME
                }
            }).length

        // If the calendar is flipped, flip the condition.
        return calendar.props.get( 'flip' ) ? !isDisabledDate : isDisabledDate
    } // CalendarPicker.prototype.disable


    /**
     * Shift a date by a certain interval until we reach an enabled one.
     */
    CalendarPicker.prototype.shift = function( dateObject, keyMovement ) {

        var calendar = this,
            originalDateObject = dateObject

        // Keep looping as long as the date is disabled.
        while ( calendar.disable( dateObject ) ) {

            // Increase/decrease the date by the key movement and keep looping.
            dateObject = calendar.object([ dateObject.YEAR, dateObject.MONTH, dateObject.DATE + ( keyMovement || 1 ) ])

            // If we've looped through to the next month, break out of the loop.
            if ( dateObject.MONTH != originalDateObject.MONTH ) {
                break
            }
        }

        // Do a final validation check to make sure it's within bounds.
        return calendar.validate( dateObject, keyMovement )
    } //CalendarPicker.prototype.shift


    /**
     * Move to another month
     */
    CalendarPicker.prototype.move = function( datePassed, monthChange ) {
        return this.create([ datePassed.YEAR, datePassed.MONTH + monthChange, datePassed.DATE ])
    } //CalendarPicker.prototype.move


    // /**
    //  * Create the lower bounding date object.
    //  */
    // CalendarPicker.prototype.min = function() {

    //     var
    //         calendar = this,
    //         limit = calendar.SETTINGS.min,
    //         nowObject = calendar.object()

    //     // If the limit is set to true, just return today.
    //     if ( limit === true ) {
    //         return nowObject
    //     }

    //     // If there is a limit and its a number, create a
    //     // time object relative to today by adding the limit.
    //     if ( limit && !isNaN( limit ) ) {
    //         return calendar.object([ nowObject.YEAR, nowObject.MONTH, nowObject.DATE + limit ])
    //     }

    //     // If the limit is an array, construct the time object.
    //     if ( Array.isArray( limit ) ) {
    //         return calendar.object( limit )
    //     }

    //     // Otherwise create an infinite time.
    //     return calendar.object( 0, -Infinity )
    // }


    // /**
    //  * Create the upper bounding date object.
    //  */
    // CalendarPicker.prototype.max = function() {

    //     var
    //         calendar = this,
    //         limit = calendar.SETTINGS.max,
    //         nowObject = calendar.object()

    //     // If the limit is set to true, just return today.
    //     if ( limit === true ) {
    //         return nowObject
    //     }

    //     // If there is a limit and its a number, create a
    //     // time object relative to today by adding the limit.
    //     if ( limit && !isNaN( limit ) ) {
    //         return calendar.object([ nowObject.YEAR, nowObject.MONTH, nowObject.DATE + limit ])
    //     }

    //     // If the limit is an array, construct the time object.
    //     if ( Array.isArray( limit ) ) {
    //         return calendar.object( limit )
    //     }

    //     // Otherwise create an infinite time.
    //     return calendar.object( 0, Infinity )
    // }


    /**
     * Create a view object.
     */
    CalendarPicker.prototype.view = function( datePassed ) {
        return this.create([ datePassed.YEAR, datePassed.MONTH, 1 ])
    }


    /**
     * Create a time object from a format.
     */
    CalendarPicker.prototype.parse = function( format, string ) {

        if ( !format ) throw "Need a format"

        var
            calendar = this,
            parsingObject = {},
            formattings = calendar.formats

        // Convert the format into an array and then map through it.
        formattings.toArray( format ).map( function( label ) {

            var
                // Grab the formatting label.
                formattingLabel = formattings[ label ],

                // The format length is from the formatting label function or the
                // label length without the escaping exclamation (!) mark.
                formatLength = formattingLabel ? triggerFunction( formattingLabel, calendar, [ string, parsingObject ] ) : label.replace( /^!/, '' ).length

            // If there's a format label, split the string up to the format length.
            // Then add it to the parsing object with appropriate label.
            if ( formattingLabel ) {
                parsingObject[ label ] = string.substr( 0, formatLength )
            }

            // Update the time string as the substring from format length to end.
            string = string.substr( formatLength )
        })

        return calendar.create([ parsingObject.yyyy || parsingObject.yy, parsingObject.mm || parsingObject.m, parsingObject.dd || parsingObject.d ])
    } //CalendarPicker.prototype.parse








    /* ==========================================================================
       The Picker
       ========================================================================== */

    /**
     * The picker constructor that creates and returns a new date or time picker
     */
    var Picker = function( $ELEMENT, SETTINGS, COMPONENT ) {

        var
            // Cache.
            CACHE_OBJECT,


            // Shorthand for the classes.
            CLASSES = SETTINGS.klass,


            // The element node
            ELEMENT = (function( element ) {

                // Confirm the focus state, save the original type, convert into
                // a regular text input to remove user-agent stylings, and
                // set it as readonly to prevent keyboard popup.
                element.autofocus = ( element == document.activeElement )
                $ELEMENT._type = element.type
                element.type = 'text'
                element.readOnly = true
                return element
            })( $ELEMENT[ 0 ] ), //ELEMENT


            // Pseudo picker constructor
            PickerInstance = function() {
                return this.start()
            },


            // The picker prototype
            P = PickerInstance.prototype = {

                constructor: PickerInstance,

                $node: $ELEMENT,


                /**
                 * Initialize everything
                 */
                start: function() {

                    var elementDataValue = $ELEMENT.data( 'value' )

                    CACHE_OBJECT = createCacheObject().

                        // Create the "min" and "max" objects.
                        set( 'min', COMPONENT.create( SETTINGS.min, -Infinity ) ).
                        set( 'max', COMPONENT.create( SETTINGS.max, Infinity ) ).

                        // Create the "now" time object.
                        set( 'now', COMPONENT.create() ).

                        // Create a selection based on the `value` or `data-value` of the element.
                        set( 'select', COMPONENT.create( COMPONENT.parse( elementDataValue ? SETTINGS.formatSubmit : SETTINGS.format, elementDataValue || ELEMENT.value ) ) ).

                        // Create a highlight based on the "selected" object.
                        set( 'highlight', function( cacheObject ) { return cacheObject.select }).

                        // Create a view set based on the "highlighted" object.
                        set( 'view', function( cacheObject ) { return COMPONENT.view( cacheObject.highlight ) })


                    // Create the picker box with a new wrapped picker and bind the events.
                    CACHE_OBJECT.$box = $( createNode( STRING_DIV, createWrappedPicker(), CLASSES.holder ) ).on({

                        // When something within the holder is focused, make it appear so.
                        focusin: function( event ) {

                            // Remove the holder "focused" state from the holder.
                            CACHE_OBJECT.$box.removeClass( CLASSES.focused )

                            // Prevent the event from propagating to the doc.
                            event.stopPropagation()
                        },

                        // Prevent any mousedowns within the holder from bubbling to the doc.
                        mousedown: function( event ) {
                            if ( CACHE_OBJECT.$box.find( event.target ).length ) {
                                event.stopPropagation()
                            }
                        },

                        // When something within the holder is clicked, handle the various event.
                        click: function( event ) {

                            var $target = $( event.target ),
                                targetData = $target.data()

                            // Prevent the default action.
                            event.preventDefault()

                            // Check if the click is within the holder.
                            if ( CACHE_OBJECT.$box.find( $target[ 0 ] ).length ) {

                                // Stop it from propagating to the doc.
                                event.stopPropagation()

                                // Maintain the focus on the `input` element.
                                ELEMENT.focus()

                                // Set and close the picker if something is getting picked.
                                if ( targetData.pick && !$target.hasClass( CLASSES.disabled ) ) {
                                    P.set( 'select', targetData.pick.split( COMPONENT.div ) ).close()
                                }

                                // If something is superficially changed, navigate the picker.
                                else if ( targetData.nav && !$target.hasClass( CLASSES.navDisabled ) ) {
                                    P.set( 'view', COMPONENT.move( CACHE_OBJECT.get( 'highlight' ), targetData.nav ) )
                                }

                                // If a "clear" button is pressed, empty the values and close it.
                                else if ( targetData.clear ) {
                                    P.clear().close()
                                }
                            }
                        }
                    }) //CACHE_OBJECT.$box


                    // If there's a format for the hidden input element, create the element
                    // using the name of the original input plus suffix. Otherwise set it to null.
                    CACHE_OBJECT._hidden = SETTINGS.formatSubmit ? $( '<input type=hidden name=' + ELEMENT.name + ( SETTINGS.hiddenSuffix || '_submit' ) + ( ELEMENT.value || elementDataValue ? ' value=' + triggerFunction( COMPONENT.formats.toString, COMPONENT, [ SETTINGS.formatSubmit, PICKER.select ] ) : '' ) + '>' )[ 0 ] : undefined


                    // Bind the events on the `input` element and then
                    // insert the holder and hidden element after the element.
                    $ELEMENT.on( 'focus.P' + CACHE_OBJECT.id + ' click.P' + CACHE_OBJECT.id, function() {

                        // Open the calendar.
                        P.open()

                        // Add the "focused" state onto the holder.
                        CACHE_OBJECT.$box.addClass( CLASSES.focused )

                    }).on( 'change.P' + CACHE_OBJECT.id, function() {

                        // If there's a hidden input, update the value with formatting or clear it
                        if ( CACHE_OBJECT._hidden ) {
                            CACHE_OBJECT._hidden.value = ELEMENT.value ? triggerFunction( COMPONENT.formats.toString, COMPONENT, [ SETTINGS.formatSubmit, COMPONENT.select ] ) : ''
                        }

                    }).on( 'keydown.P' + CACHE_OBJECT.id, function() {

                        var
                            // Grab the keycode
                            keycode = event.keyCode,

                            // Check if one of the delete keys was pressed
                            isKeycodeDelete = keycode == 8 || keycode == 46

                        // Check if delete was pressed or the calendar is closed and there is a key movement
                        if ( isKeycodeDelete || !CACHE_OBJECT.get( 'open' ) && COMPONENT.keyMove[ keycode ] ) {

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

                    }).after([ CACHE_OBJECT.$box, CACHE_OBJECT._hidden ])

                    // Trigger the "start" event within scope of the picker.
                    triggerFunction( COMPONENT.onStart, P, [ CACHE_OBJECT.$box ] )

                    // Trigger the "render" event within scope of the picker.
                    triggerFunction( COMPONENT.onRender, P, [ CACHE_OBJECT.$box ] )

                    // If the element has autofocus, open the calendar
                    if ( ELEMENT.autofocus ) {
                        P.open()
                    }

                    return P
                }, //start


                /**
                 * Render a new picker within the holder
                 */
                render: function() {

                    // Insert a new picker in the holder.
                    CACHE_OBJECT.$box.html( createWrappedPicker() )

                    // Trigger the "render" event within scope of the picker.
                    triggerFunction( COMPONENT.onRender, P, [ CACHE_OBJECT.$box ] )

                    return P
                }, //render


                /**
                 * Destroy everything
                 */
                stop: function() {

                    // Firstly, close it.
                    P.close()

                    // Unbind the events on the `input` element.
                    $ELEMENT.off( '.P' + CACHE_OBJECT.id )

                    // Restore the element state
                    ELEMENT.type = $ELEMENT._type
                    ELEMENT.readOnly = false

                    // Remove the hidden field.
                    if ( CACHE_OBJECT._hidden ) {
                        CACHE_OBJECT._hidden.parentNode.removeChild( CACHE_OBJECT._hidden )
                    }

                    // Remove the holder.
                    CACHE_OBJECT.$box.remove()

                    // Reset the cache object.
                    CACHE_OBJECT = undefined

                    // Trigger the "stop" event within scope of the picker.
                    triggerFunction( COMPONENT.onStop, COMPONENT )

                    return P
                }, //stop


                /**
                 * Open up the picker
                 */
                open: function() {

                    // If it's already open, do nothing
                    if ( CACHE_OBJECT.get( 'open' ) ) return P

                    // Set it as open
                    CACHE_OBJECT.set( 'open', 1 )

                    // Make sure the element has focus then add the "active" class.
                    $ELEMENT.focus().addClass( CLASSES.inputActive )

                    // Add the "opened" class to the picker holder.
                    CACHE_OBJECT.$box.addClass( CLASSES.opened )

                    // Bind the document events.
                    $document.on( 'click.P' + CACHE_OBJECT.id + ' focusin.P' + CACHE_OBJECT.id, function( event ) {

                        // If the target of the event is not the element, close the picker picker.
                        // * Don't worry about clicks or focusins on the holder
                        //   because those are stopped from bubbling up.
                        if ( event.target != ELEMENT ) P.close()

                    }).on( 'mousedown.P' + CACHE_OBJECT.id, function( event ) {

                        // Maintain the focus on the `input` element.
                        ELEMENT.focus()

                        // Prevent the default action to keep focus on the `input` field.
                        event.preventDefault()

                    }).on( 'keydown.P' + CACHE_OBJECT.id, function( event ) {

                        var
                            // Get the keycode
                            keycode = event.keyCode,

                            // Translate that to a selection change
                            keycodeToMove = COMPONENT.keyMove[ keycode ]


                        // On escape, focus back onto the element and close the picker.
                        if ( keycode == 27 ) {
                            ELEMENT.focus()
                            P.close()
                        }

                        // Check if the target is the element and there's a key movement or enter key is pressed.
                        else if ( event.target == ELEMENT && ( keycodeToMove || keycode == 13 ) ) {

                            // Prevent the default action to stop it from moving the page.
                            event.preventDefault()

                            // If the keycode translates to a move, highlight the object.
                            if ( keycodeToMove ) {
                                P.set( 'highlight', triggerFunction( COMPONENT.keyMove.go, P, [ CACHE_OBJECT.get( 'highlight' ), keycodeToMove ] ) )
                            }

                            // Otherwise it's the enter key so select the highlighted time and then close it.
                            else {
                                P.set( 'select', CACHE_OBJECT.get( 'highlight' ) ).close()
                            }

                        } //if ELEMENT
                    })

                    // Trigger the "open" event within scope of the picker.
                    triggerFunction( COMPONENT.onOpen, P, [ CACHE_OBJECT.$box ] )

                    return P
                }, //open


                /**
                 * Close the picker
                 */
                close: function() {

                    // If it's already closed, do nothing
                    if ( !CACHE_OBJECT.get( 'open' ) ) return P

                    // Set it as closed
                    CACHE_OBJECT.set( 'open', 0 )

                    // Remove the "active" class.
                    $ELEMENT.removeClass( CLASSES.inputActive )

                    // Remove the "opened" class from the picker holder.
                    CACHE_OBJECT.$box.removeClass( CLASSES.opened )

                    // Bind the document events.
                    $document.off( '.P' + CACHE_OBJECT.id )

                    // Trigger the on close event within scope of the picker.
                    triggerFunction( COMPONENT.onClose, COMPONENT, [ CACHE_OBJECT.$box ] )

                    return P
                }, //close


                /**
                 * Clear the values
                 */
                clear: function() {
                    $ELEMENT.val( '' ).trigger( 'change' )
                    return P
                }, //clear


                /**
                 * Set the values
                 */
                set: function( type, item ) {

                    if ( typeof type != 'string' ) {
                        console.log( 'not string:', typeof type )
                        throw 'stop yo'
                    }


                    // Check if the `type` exists in the cache.
                    if ( CACHE_OBJECT.has( type ) ) {


                        // Create an object to set.
                        var objectToSet = COMPONENT.create( item )


                        if ( type == 'select' && item ) {

                            // Clear the values if there is no item.
                            if ( !item ) {
                                return P.clear()
                            }

                            // Stop if the time is disabled.
                            if ( CACHE_OBJECT.disable.length && COMPONENT.disable( CACHE_OBJECT.disable, objectToSet ) ) {
                                objectToSet = COMPONENT.validate( objectToSet )
                            }

                            // Select the time object.
                            CACHE_OBJECT.set( 'select', objectToSet )

                            // Update the element value and broadcast a change.
                            $ELEMENT.val( triggerFunction( COMPONENT.formats.toString, P, [ SETTINGS.format, objectToSet ] ) ).trigger( 'change' )

                            // Highlight the time object
                            CACHE_OBJECT.set( 'highlight', objectToSet )

                            // Update the viewset.
                            CACHE_OBJECT.set( 'view', function( cacheObject ) { return COMPONENT.view( cacheObject.highlight ) })
                        }

                        else if ( type == 'view' ) {

                            // Highlight the time object.
                            CACHE_OBJECT.set( 'highlight', objectToSet )

                            // Update the viewset.
                            CACHE_OBJECT.set( 'view', function() { return COMPONENT.view( objectToSet ) })
                        }

                        else {
                            CACHE_OBJECT.set( type, objectToSet )
                        }


                        // Render a new picker.
                        P.render()


                        // Trigger the "set" event within scope of the picker.
                        triggerFunction( COMPONENT.onSet, P, [ CACHE_OBJECT.$box ] )
                    }

                    return P
                }, //set


                /**
                 * Get the values
                 */
                get: function( type ) {
                    return CACHE_OBJECT.get( type ) || CACHE_OBJECT[ type ]
                },


                /**
                 * Disable a picker item
                 */
                disableItem: function( timePassed ) {

                    // Add or remove from collection based on the flipped status.
                    PICKER.disable = CACHE_OBJECT.get( 'flip' ) ? removeFromCollection( PICKER.disable, timePassed ) : addToCollection( PICKER.disable, timePassed )

                    // Revalidate the selected item.
                    PICKER.select = triggerFunction( PICKER.validate, P, PICKER.select )

                    // Update the highlight and viewset based on the "selected" item.
                    PICKER.view = PICKER.highlight = PICKER.select

                    // Then render a new picker.
                    return P.render()
                }, //disableItem


                /**
                 * Enable a picker item
                 */
                enableItem: function( timePassed ) {

                    // Add or remove from collection based on the flipped status.
                    PICKER.disable = CACHE_OBJECT.get( 'flip' ) ? addToCollection( PICKER.disable, timePassed ) : removeFromCollection( PICKER.disable, timePassed )

                    // Revalidate the selected item.
                    PICKER.select = triggerFunction( PICKER.validate, P, PICKER.select )

                    // Update the highlight and viewset based on the "selected" item.
                    PICKER.view = PICKER.highlight = PICKER.select

                    // Then render a new picker.
                    return P.render()
                } //enableItem

            } //PickerInstance.prototype



        /**
         * Create a hidden object for caching.
         */
        function createCacheObject() {

            var
                collectionDisabled = SETTINGS.disable || [],

                hiddenCacheObject = {

                    // Flip and adjust the disabled collection, if that.
                    flip: ( Array.isArray( collectionDisabled ) && collectionDisabled[ 0 ] === true ) ? collectionDisabled.shift() : undefined,

                    // Copy the collection of disabled items.
                    disable: collectionDisabled
                }

            return {

                // The unique ID.
                id: Math.abs( ~~( Math.random() * 1e9 ) ),

                set: function( thing, value ) {
                    hiddenCacheObject[ thing ] = triggerFunction( value, this, [ hiddenCacheObject ] )
                    return this
                },
                get: function( thing ) {
                    return hiddenCacheObject[ thing ]
                },
                has: function( thing ) {
                    return !!hiddenCacheObject[ thing ]
                }
            }
        } //createCacheObject


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
                        triggerFunction( COMPONENT.holder, COMPONENT, [ P, CACHE_OBJECT ] ),

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


        /**
         * Add an item to a collection.
         */
        function addToCollection( disabledItems, timePassed ) {

            // Add the item passed to the disabled items collection if it's not already there.
            if ( timePassed && disabledItems.indexOf( timePassed ) < 0 ) {
                disabledItems.push( timePassed )
            }

            return disabledItems
        } //addToCollection


        /**
         * Remove an item from a collection.
         */
        function removeFromCollection( disabledItems, timePassed ) {

            // Remove the disabled item from the collection by splicing up to the
            // item index and then concat with everything after that item.
            if ( timePassed && disabledItems.indexOf( timePassed ) > -1 ) {
                disabledItems = disabledItems.splice( 0, disabledItems.indexOf( timePassed ) ).concat( disabledItems.splice( disabledItems.indexOf( timePassed ) + 1 ) )
            }

            return disabledItems
        } //removeFromCollection


        // Return a new picker instance.
        return new PickerInstance()
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
     * If the second character is a digit, length is 2 otherwise 1.
     */
    function getDigitsLength( string ) {
        return ( /\d/ ).test( string[ 1 ] ) ? 2 : 1
    }









    /* ==========================================================================
       Extend jQuery
       ========================================================================== */

    /**
     * Map through the each picker type and extend jQuery
     */
    [ 'pickadate', 'pickatime' ].map( function( picker, index ) {

        var PickerComponent = index ? ClockPicker : CalendarPicker

        $.fn[ picker ] = function( options, action ) {

            var
                // Merge the options and defaults with a deep copy.
                settings = $.extend( true, {}, $.fn[ picker ].defaults, options ),

                // Check if this already has a picker
                thisPicker = this.data( picker )

            // Just stop if the picker should be disabled.
            ///////// if ( settings.disablePicker ) return this

            //
            if ( typeof options == 'string' && thisPicker ) {
                return triggerFunction( thisPicker[ options ], thisPicker, [ action ] )
            }

            return this.each( function() {
                var $this = $( this )
                if ( !$this.data( picker ) ) {
                    $this.data( picker, new Picker( $this, settings, new PickerComponent( settings ) ) )
                }
            })
        }
    })


    /**
     * Default options for the date picker
     */
    $.fn.pickadate.defaults = {

        // Today and clear
        today: 'Today',
        clear: 'Clear',

        // Months and weekdays
        monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        weekdaysFull: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

        // Display strings
        showMonthsFull: 1,
        showWeekdaysShort: 1,

        // The format to show on the `input` element
        format: 'd mmmm, yyyy',

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

            navPrev: STRING_PREFIX_PICKER + 'nav--prev',
            navNext: STRING_PREFIX_PICKER + 'nav--next',
            navDisabled: STRING_PREFIX_PICKER + 'nav--disabled',

            month: STRING_PREFIX_PICKER + 'month',
            year: STRING_PREFIX_PICKER + 'year',

            selectMonth: STRING_PREFIX_PICKER + 'select--month',
            selectYear: STRING_PREFIX_PICKER + 'select--year',

            weekdays: STRING_PREFIX_PICKER + 'weekday',

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

        // Clear
        clear: 'Clear',

        // The format to show on the `input` element
        format: 'h:i A',

        // The interval between each time
        interval: 30,

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
            now: STRING_PREFIX_PICKER + 'list-item--now',
            clear: STRING_PREFIX_PICKER + 'list-item--clear'
        }
    } //$.fn.pickatime.defaults




})( jQuery, document );




