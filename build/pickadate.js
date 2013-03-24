/*!
 * pickadate.js v3.0.0alpha, 2013-03-24
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

/**
 * Todo:
 * – Month & year selectors.
 * – Fix for all times disabled.
 * – If time passed, list should update?
 * – Adjust `PICKER` and `P`.
 * – WAI-ARIA support
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
        var picker = this
        return {
            div: ':',
            holder: picker.holder,
            object: picker.object,
            validate: picker.validate,
            parse: picker.parse,
            disable: picker.disable,
            shift: picker.shift,
            min: picker.min,
            max: picker.max,
            now: picker.validate,
            settings: settings,
            keyMove: {
                40: 1, // Down
                38: -1, // Up
                39: 1, // Right
                37: -1, // Left
                go: function( timeChange ) {

                    var clock = this,

                        // Create a validated target object with the relative date change.
                        targetDateObject = clock.validate( timeChange * clock.I + clock.HIGHLIGHT.TIME, timeChange )

                    // Return the targetted time object to "go" to.
                    return targetDateObject
                }
            },
            formats: {
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
                    return string ? 4 : MINUTES_IN_DAY / 2 > this.TIME % MINUTES_IN_DAY ? 'a.m.' : 'p.m.'
                },
                A: function( string ) {

                    // If there's a string, then the length is always 2.
                    // Otherwise check if it's more than "noon" and return either am/pm.
                    return string ? 2 : MINUTES_IN_DAY / 2 > this.TIME % MINUTES_IN_DAY ? 'AM' : 'PM'
                },

                // Create an array by splitting the formatting string passed.
                toArray: function( formatString ) { return formatString.split( /(h{1,2}|H{1,2}|i|a|A|!.)/g ) }
            },
            onRender: function( $picker ) {
                $picker[ 0 ].scrollTop = $picker.find( '.' + settings.klass.highlighted ).position().top - ~~( $picker[ 0 ].clientHeight / 4 )
            },
            onOpen: function() {
                // console.log( 'openeed' )
            },
            onClose: function() {
                // console.log( 'closed' )
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
            toDisable = clock.DISABLE

        return createNode( 'ul', createGroupOfNodes({
            min: clock.min().TIME,
            max: clock.max().TIME,
            i: clock.I,
            node: 'li',
            item: function( loopedTime ) {
                loopedTime = clock.object( loopedTime )
                return [
                    formatObjectToString( clock.formats, settings.format, loopedTime ),
                    (function( klasses, timeMinutes ) {

                        if ( clock.SELECT.length && clock.SELECT[ 0 ].TIME == timeMinutes ) {
                            klasses.push( settings.klass.selected )
                        }

                        if ( clock.HIGHLIGHT && clock.HIGHLIGHT.TIME == timeMinutes ) {
                            klasses.push( settings.klass.highlighted )
                        }

                        if ( clock.VIEWSET && clock.VIEWSET.TIME == timeMinutes ) {
                            klasses.push( settings.klass.viewset )
                        }

                        if ( toDisable && clock.disable( clock.object( timeMinutes ) ) ) {
                            klasses.push( settings.klass.disabled )
                        }

                        return klasses.join( ' ' )
                    })([ settings.klass.listItem ], loopedTime.TIME ),
                    'data-pick=' + loopedTime.HOUR + clock.div + loopedTime.MINS
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
    ClockPicker.prototype.validate = function( timePassed, keyMovement ) {

        var
            clock = this,
            minLimitObject = clock.min(),
            maxLimitObject = clock.max(),

            // Make sure we have a time object to work with.
            timePassedObject = timePassed && !isNaN( timePassed.TIME ) ? timePassed : clock.object( timePassed )

        // If no time was passed, normalize the time object into a "reachable" time.
        if ( !timePassed ) {

            timePassedObject = clock.object(

                // From the time passed, subtract the amount needed to get it within interval "reach".
                timePassedObject.TIME - (

                    // Get the remainder between the min and time passed and then get the remainder
                    // of that divided by the interval to get amount to decrease by.
                    (
                        minLimitObject.TIME ? timePassedObject.TIME % minLimitObject.TIME : timePassedObject.TIME
                    ) % clock.I

                // And then if there's a key movement, do nothing.
                // Otherwise add an interval because this time has passed.
                ) + ( keyMovement ? 0 : clock.I )
            )
        }

        if ( timePassedObject.TIME < minLimitObject.TIME ) {
            timePassedObject = minLimitObject
        }

        else if ( timePassedObject.TIME > maxLimitObject.TIME ) {
            timePassedObject = maxLimitObject
        }

        // If there are times to disable and this is one of them,
        // shift using the interval until we reach an enabled time.
        if ( clock.DISABLE && clock.disable( timePassedObject ) ) {
            timePassedObject = clock.shift( timePassedObject, timePassedObject.TIME > maxLimitObject.TIME ? -1 : keyMovement || 1 )
        }

        return timePassedObject
    } //ClockPicker.prototype.validate


    /**
     * Check if a time is disabled or not.
     */
    ClockPicker.prototype.disable = function( timeObject ) {

        var clock = this,

            // Filter through the disabled times to check if this is one.
            isDisabledTime = clock.DISABLE.filter( function( timeToDisable ) {

                // If the time is a number, match the hours.
                if ( !isNaN( timeToDisable ) ) {
                    return timeObject.HOUR == timeToDisable
                }

                // If it's an array, create the object and match the times.
                if ( Array.isArray( timeToDisable ) ) {
                    return timeObject.TIME == clock.object( timeToDisable ).TIME
                }
            }).length

        // If the clock is off, flip the condition.
        return clock.OFF ? !isDisabledTime : isDisabledTime
    } // ClockPicker.prototype.disable


    /**
     * Shift a time by a certain interval until we reach an enabled one.
     */
    ClockPicker.prototype.shift = function( timeObject, keyMovement ) {

        var clock = this,
            originalTimeObject = timeObject,
            minLimit = clock.MIN.TIME,
            maxLimit = clock.MAX.TIME

        // Keep looping as long as the time is disabled.
        while ( clock.disable( timeObject ) ) {

            // Increase/decrease the time by the key movement and keep looping.
            timeObject = clock.object( timeObject.TIME += ( keyMovement || clock.I ) * clock.I )

            // If we've looped beyond the limits, break out of the loop.
            if ( timeObject.TIME < minLimit ) {
                keyMovement = 1
                timeObject = originalTimeObject
                break
            }
            if ( timeObject.TIME > maxLimit ) {
                keyMovement = -1
                timeObject = originalTimeObject
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
            interval = clock.I,
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
            limit = clock.settings.max,
            interval = clock.I,
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
        if ( limit.TIME < clock.MIN.TIME ) {
            limit = clock.object( limit.TIME + MINUTES_IN_DAY )
        }


        // Finally, make sure the max time is "reachable" using the interval and min limit.
        return clock.object( limit.TIME - ( ( clock.MIN.TIME ? limit.TIME % clock.MIN.TIME : limit.TIME ) % clock.I ) )
    } //ClockPicker.prototype.max


    /**
     * Create a time object from a format.
     */
    ClockPicker.prototype.parse = function( format, string ) {

        if ( !format ) throw "Need a format"

        var parsingObject = {},
            formattings = this.formats

        // Convert the format into an array and then map through it.
        formattings.toArray( format ).map( function( label ) {

            // The format length is from the formatting function or the label
            // length without the escaping exclamation (!) mark.
            var formatLength = formattings[ label ] ? formattings[ label ]( string ) : label.replace( /^!/, '' ).length

            // If there's a format length, split the string up to the format length.
            // Then add it to the parsing object with appropriate label.
            if ( formattings[ label ] ) {
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
            picker = this,

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

        return {
            div: '/',
            holder: picker.holder,
            object: picker.object,
            validate: picker.validate,
            parse: picker.parse,
            disable: picker.disable,
            shift: picker.shift,
            now: picker.object,
            min: picker.min,
            max: picker.max,
            settings: settings,
            keyMove: {
                40: 7, // Down
                38: -7, // Up
                39: 1, // Right
                37: -1, // Left
                go: function( dateChange ) {

                    var
                        calendar = this,

                        // Create a validated target object with the relative date change.
                        targetDateObject = calendar.validate( [ calendar.HIGHLIGHT.YEAR, calendar.HIGHLIGHT.MONTH, calendar.HIGHLIGHT.DATE + dateChange ], dateChange )

                    // If there's a month change, update the viewset.
                    if ( targetDateObject.MONTH != calendar.VIEWSET.MONTH ) {
                        calendar.VIEWSET = targetDateObject
                    }

                    // Return the targetted date object to "go" to.
                    return targetDateObject
                }
            },
            formats: {
                d: function( string ) {

                    // If there's string, then get the digits length.
                    // Otherwise return the selected date.
                    return string ? getDigitsLength( string ) : this.DATE
                },
                dd: function( string ) {

                    // If there's a string, then the length is always 2.
                    // Otherwise return the selected date with a leading zero.
                    return string ? 2 : leadZero( this.DATE )
                },
                ddd: function( string ) {

                    // If there's a string, then get the length of the first word.
                    // Otherwise return the short selected weekday.
                    return string ? getFirstWordLength( string ) : settings.weekdaysShort[ this.DAY ]
                },
                dddd: function( string ) {

                    // If there's a string, then get the length of the first word.
                    // Otherwise return the full selected weekday.
                    return string ? getFirstWordLength( string ) : settings.weekdaysFull[ this.DAY ]
                },
                m: function( string ) {

                    // If there's a string, then get the length of the digits
                    // Otherwise return the selected month with 0index compensation.
                    return string ? getDigitsLength( string ) : this.MONTH + 1
                },
                mm: function( string ) {

                    // If there's a string, then the length is always 2.
                    // Otherwise return the selected month with 0index and leading zero.
                    return string ? 2 : leadZero( this.MONTH + 1 )
                },
                mmm: function( string, dateObject ) {

                    var collection = settings.monthsShort

                    // If there's a string, get length of the relevant month from the short
                    // months collection. Otherwise return the selected month from that collection.
                    return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ this.MONTH ]
                },
                mmmm: function( string, dateObject ) {

                    var collection = settings.monthsFull

                    // If there's a string, get length of the relevant month from the full
                    // months collection. Otherwise return the selected month from that collection.
                    return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ this.MONTH ]
                },
                yy: function( string ) {

                    // If there's a string, then the length is always 2.
                    // Otherwise return the selected year by slicing out the first 2 digits.
                    return string ? 2 : ( '' + this.YEAR ).slice( 2 )
                },
                yyyy: function( string ) {

                    // If there's a string, then the length is always 4.
                    // Otherwise return the selected year.
                    return string ? 4 : this.YEAR
                },

                // Create an array by splitting the formatting string passed.
                toArray: function( formatString ) { return formatString.split( /(d{1,4}|m{1,4}|y{4}|yy|!.)/g ) }
            }, //formats
            onOpen: function( $holder ) {
                $holder.find( 'button, select' ).attr( 'tabindex', 0 )
            },
            onClose: function( $holder ) {
                $holder.find( 'button, select' ).attr( 'tabindex', -1 )
            },
            onRender: function( $holder, pickerObject ) {

                var calendar = this

                $holder.find( '.' + settings.klass.selectMonth ).on( 'change', function() {
                    pickerObject.set( [ calendar.VIEWSET.YEAR, this.value, calendar.SELECT[ 0 ].DATE ], 1 )
                    $holder.find( '.' + settings.klass.selectMonth ).focus()
                })

                $holder.find( '.' + settings.klass.selectYear ).on( 'change', function() {
                    pickerObject.set( [ this.value, calendar.VIEWSET.MONTH, calendar.SELECT[ 0 ].DATE ], 1 )
                    $holder.find( '.' + settings.klass.selectYear ).focus()
                })

                triggerFunction( settings.onRender, calendar, [ $holder ] )
            }
        }
    } //CalendarPicker


    /**
     * Create a calendar holder node.
     */
    CalendarPicker.prototype.holder = function() {

        var
            calendar = this,
            settings = calendar.settings,

            // Get the tab index state picker opened/closed.
            getTabindexState = function() {
                return 'tabindex=' + ( calendar.isOpen ? 0 : -1 )
            },

            // Create the nav for next/prev month.
            createMonthNav = function( next ) {

                // Otherwise, return the created month tag.
                return createNode(
                    STRING_DIV,
                    ' ',
                    settings.klass[ 'nav' + ( next ? 'Next' : 'Prev' ) ] + (

                        // If the focused month is outside the range, disabled the button.
                        ( next && calendar.VIEWSET.YEAR >= calendar.MAX.YEAR && calendar.VIEWSET.MONTH >= calendar.MAX.MONTH ) ||
                        ( !next && calendar.VIEWSET.YEAR <= calendar.MIN.YEAR && calendar.VIEWSET.MONTH <= calendar.MIN.MONTH ) ?
                        ' ' + settings.klass.navDisabled : ''
                    ),
                    'data-nav=' + ( next || -1 )
                ) //endreturn
            }, //createMonthNav


            // Create the month label
            createMonthLabel = function( monthsCollection ) {

                var focusedMonth = calendar.VIEWSET.MONTH

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
                                ( focusedMonth == loopedMonth ? ' selected' : '' ) +
                                (
                                    (
                                        ( calendar.VIEWSET.YEAR == calendar.MIN.YEAR && loopedMonth < calendar.MIN.MONTH ) ||
                                        ( calendar.VIEWSET.YEAR == calendar.MAX.YEAR && loopedMonth > calendar.MAX.MONTH )
                                    ) ?
                                    ' disabled' : ''
                                )
                            ]
                        }
                    }), settings.klass.selectMonth )
                }

                // If there's a need for a month selector
                return createNode( STRING_DIV, monthsCollection[ focusedMonth ], settings.klass.month )
            }, //createMonthLabel


            // Create the year label
            createYearLabel = function() {

                var focusedYear = calendar.VIEWSET.YEAR,

                // If years selector is set to a literal "true", set it to 5. Otherwise
                // divide in half to get half before and half after focused year.
                numberYears = settings.selectYears === true ? 5 : ~~( settings.selectYears / 2 )

                // If there are years to select, add a dropdown menu.
                if ( numberYears ) {

                    var
                        minYear = calendar.MIN.YEAR,
                        maxYear = calendar.MAX.YEAR,
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


        // Update the viewset to the first day of the month.
        calendar.VIEWSET = calendar.object([ calendar.VIEWSET.YEAR, calendar.VIEWSET.MONTH, 1 ])


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
                                min: DAYS_IN_WEEK * rowCounter - calendar.VIEWSET.DAY + 1, // Add 1 for weekday 0index
                                max: function() {
                                    return this.min + DAYS_IN_WEEK - 1
                                },
                                i: 1,
                                node: 'td',
                                item: function( timeDate ) {

                                    // Convert the time date from a relative date to a date object
                                    timeDate = calendar.object([ calendar.VIEWSET.YEAR, calendar.VIEWSET.MONTH, timeDate + ( settings.firstDay ? 1 : 0 ) ])

                                    return [
                                        createNode(
                                            STRING_DIV,
                                            timeDate.DATE,
                                            (function( klasses ) {

                                                // Add the `infocus` or `outfocus` classes based on month in view.
                                                klasses.push( calendar.VIEWSET.MONTH == timeDate.MONTH ? settings.klass.infocus : settings.klass.outfocus )

                                                // Add the `selected` class if something's selected and the time matches.
                                                if ( calendar.SELECT.length && calendar.SELECT[ 0 ].TIME == timeDate.TIME ) {
                                                    klasses.push( settings.klass.selected )
                                                }

                                                // Add the `today` class if needed.
                                                if ( calendar.NOW.TIME == timeDate.TIME ) {
                                                    klasses.push( settings.klass.now )
                                                }

                                                // Add the `highlighted` class if something's highlighted and the time matches.
                                                if ( calendar.HIGHLIGHT && calendar.HIGHLIGHT.TIME == timeDate.TIME ) {
                                                    klasses.push( settings.klass.highlighted )
                                                }

                                                // Add the `disabled` class if something's disabled and the object matches.
                                                if ( calendar.DISABLE && calendar.disable( timeDate ) || timeDate.TIME < calendar.MIN.TIME || timeDate.TIME > calendar.MAX.TIME ) {
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
                }),
                settings.klass.body
            ),
            settings.klass.table
        ) +

        createNode(
            STRING_DIV,
            createNode( 'button', settings.today, settings.klass.buttonToday, 'data-pick=' + calendar.NOW.YEAR + calendar.div + calendar.NOW.MONTH + calendar.div + calendar.NOW.DATE + ' ' + getTabindexState() ) + createNode( 'button', settings.clear, settings.klass.buttonClear, 'data-clear=1 ' + getTabindexState() ),
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
    CalendarPicker.prototype.validate = function( datePassed, keyMovement ) {

        var calendar = this,
            minLimitObject = calendar.MIN,
            maxLimitObject = calendar.MAX,

            // Make sure we have a date object to work with.
            datePassedObject = datePassed && !isNaN( datePassed.TIME ) ? datePassed : calendar.object( datePassed )


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
            datePassedObject = calendar.NOW
        }

        // Otherwise if there are dates to disable and this is one of them,
        // shift using the interval until we reach an enabled date.
        else if ( calendar.DISABLE && calendar.disable( datePassedObject ) ) {
            datePassedObject = calendar.shift( datePassedObject, datePassedObject.TIME > maxLimitObject.TIME ? -1 : keyMovement || 1 )
        }

        // Reset the check for if we reached the min and max bounds.
        calendar.doneMin = 0
        calendar.doneMax = 0

        return datePassedObject
    } //CalendarPicker.prototype.validate


    /**
     * Check if a date is disabled or not.
     */
    CalendarPicker.prototype.disable = function( dateObject ) {

        var calendar = this,

            // Filter through the disabled dates to check if this is one.
            isDisabledDate = calendar.DISABLE.filter( function( dateToDisable ) {

                // If the date is a number, match the weekday with 0index and `firstDay` check.
                if ( !isNaN( dateToDisable ) ) {
                    return dateObject.DAY == ( calendar.settings.firstDay ? dateToDisable : dateToDisable - 1 ) % 7
                }

                // If it's an array, create the object and match the times.
                if ( Array.isArray( dateToDisable ) ) {
                    return dateObject.TIME == calendar.object( dateToDisable ).TIME
                }
            }).length

        // If the calendar is off, flip the condition.
        return calendar.OFF ? !isDisabledDate : isDisabledDate
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
     * Create the lower bounding date object.
     */
    CalendarPicker.prototype.min = function() {

        var
            calendar = this,
            limit = calendar.settings.min,
            nowObject = calendar.object()

        // If the limit is set to true, just return today.
        if ( limit === true ) {
            return nowObject
        }

        // If there is a limit and its a number, create a
        // time object relative to today by adding the limit.
        if ( limit && !isNaN( limit ) ) {
            return calendar.object([ nowObject.YEAR, nowObject.MONTH, nowObject.DATE + limit ])
        }

        // If the limit is an array, construct the time object.
        if ( Array.isArray( limit ) ) {
            return calendar.object( limit )
        }

        // Otherwise create an infinite time.
        return calendar.object( 0, -Infinity )
    }


    /**
     * Create the upper bounding date object.
     */
    CalendarPicker.prototype.max = function() {

        var
            calendar = this,
            limit = calendar.settings.max,
            nowObject = calendar.object()

        // If the limit is set to true, just return today.
        if ( limit === true ) {
            return nowObject
        }

        // If there is a limit and its a number, create a
        // time object relative to today by adding the limit.
        if ( limit && !isNaN( limit ) ) {
            return calendar.object([ nowObject.YEAR, nowObject.MONTH, nowObject.DATE + limit ])
        }

        // If the limit is an array, construct the time object.
        if ( Array.isArray( limit ) ) {
            return calendar.object( limit )
        }

        // Otherwise create an infinite time.
        return calendar.object( 0, Infinity )
    }


    /**
     * Create the upper or lower bounding date object.
     */
    CalendarPicker.prototype.bounds = function( upper ) {

        console.log( 'fix this' )

        var
            calendar = this,
            limit = upper ? calendar.settings.max : calendar.settings.min

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

        if ( !format ) throw "Need a format"

        var parsingObject = {},
            formattings = this.formats

        // Convert the format into an array and then map through it.
        formattings.toArray( format ).map( function( label ) {

            // The format length is from the formatting function or the label
            // length without the escaping exclamation (!) mark.
            var formatLength = formattings[ label ] ? formattings[ label ]( string, parsingObject ) : label.replace( /^!/, '' ).length

            // If there's a format length, split the string up to the format length.
            // Then add it to the parsing object with appropriate label.
            if ( formattings[ label ] ) {
                parsingObject[ label ] = string.substr( 0, formatLength )
            }

            // Update the time string as the substring from format length to end.
            string = string.substr( formatLength )
        })

        return this.object([ parsingObject.yyyy || parsingObject.yy, parsingObject.mm || parsingObject.m, parsingObject.dd || parsingObject.d ])
    }








    /* ==========================================================================
       The Picker
       ========================================================================== */

    /**
     * The picker constructor that creates and returns a new date or time picker
     */
    var Picker = function( $ELEMENT, SETTINGS, FUNK ) {

        var
            // Shorthand for the classes
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


            // The picker object
            PICKER = (function( pickerObject, elementDataValue ) {

                pickerObject.ID = ~~( Math.random() * 1e9 )
                pickerObject.I = SETTINGS.interval || 1

                // Store the `min` and `max` bounding limits.
                pickerObject.MIN = pickerObject.min()
                pickerObject.MAX = pickerObject.max()

                // If the first item is a literal `true`, we need to disabled all the items.
                // Remove the flag from the collection and flip the condition of which items to disable.
                if ( Array.isArray( SETTINGS.disable ) && SETTINGS.disable[ 0 ] === true ) {
                    pickerObject.OFF = SETTINGS.disable.shift()
                }

                // Store the disabled items.
                pickerObject.DISABLE = SETTINGS.disable

                // The `now` time object.
                pickerObject.NOW = pickerObject.now()

                // The default selection is based on the `value` or `data-value` of the element.
                pickerObject.SELECT = [
                    pickerObject.validate(
                        pickerObject.parse( elementDataValue ? SETTINGS.formatSubmit : SETTINGS.format, elementDataValue || ELEMENT.value )
                    )
                ]

                // The default highlight and viewset are based on the "selected" or "default" item.
                pickerObject.VIEWSET = pickerObject.HIGHLIGHT = pickerObject.SELECT[ 0 ] || pickerObject.validate()

                // Return the picker object
                return pickerObject
            })( new FUNK( SETTINGS ), $ELEMENT.data( 'value' ) ), //PICKER


            // If there's a format for the hidden input element, create the element
            // using the name of the original input plus suffix. Otherwise set it to null.
            ELEMENT_HIDDEN = SETTINGS.formatSubmit ? $( '<input type=hidden name=' + ELEMENT.name + SETTINGS.hiddenSuffix + ( PICKER.SELECT.length ? ' value=' + formatObjectToString( PICKER.formats, SETTINGS.formatSubmit, PICKER.SELECT[ 0 ] ) : '' ) + '>' )[ 0 ] : null,


            // Create the picker holder with a new wrapped picker and bind the events.
            $HOLDER = $( createNode( STRING_DIV, createWrappedPicker(), CLASSES.holder ) ).on({

                // When something within the holder is focused, make it appear so.
                focusin: function( event ) {

                    // Remove the holder "focused" state from the holder.
                    $HOLDER.removeClass( CLASSES.focused )

                    // Prevent the event from propagating to the doc.
                    event.stopPropagation()
                },

                // Prevent any mousedowns within the holder from bubbling to the doc.
                mousedown: function( event ) {
                    if ( $HOLDER.find( event.target ).length ) {
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
                    if ( $HOLDER.find( $target[ 0 ] ).length ) {

                        // Stop it from propagating to the doc.
                        event.stopPropagation()

                        // Maintain the focus on the `input` element.
                        ELEMENT.focus()

                        // Set and close the picker if something is getting picked.
                        if ( targetData.pick && !$target.hasClass( CLASSES.disabled ) ) {
                            P.set( targetData.pick.split( PICKER.div ) ).close()
                        }

                        // If something is superficially changed, navigate the picker.
                        else if ( targetData.nav && !$target.hasClass( CLASSES.navDisabled ) ) {
                            P.set( [ PICKER.HIGHLIGHT.YEAR, PICKER.HIGHLIGHT.MONTH + targetData.nav, PICKER.HIGHLIGHT.DATE ], 1 )
                        }

                        // If a "clear" button is pressed, empty the values and close it.
                        else if ( targetData.clear ) {
                            P.clear().close()
                        }
                    }
                }
            }),


            // Pseudo picker constructor
            Picker = function() {},


            // The picker prototype
            P = Picker.prototype = {

                constructor: Picker,

                $node: $ELEMENT,


                /**
                 * Initialize everything
                 */
                start: function() {

                    // Bind the events on the `input` element and then
                    // insert the holder and hidden element after the element.
                    $ELEMENT.on( 'focus.P' + PICKER.ID + ' click.P' + PICKER.ID, function() {

                        // Open the calendar.
                        P.open()

                        // Add the "focused" state onto the holder.
                        $HOLDER.addClass( CLASSES.focused )

                    }).on( 'change.P' + PICKER.ID, function() {

                        // If there's a hidden input, update the value with formatting or clear it
                        if ( ELEMENT_HIDDEN ) {
                            ELEMENT_HIDDEN.value = ELEMENT.value ? formatObjectToString( PICKER.formats, SETTINGS.formatSubmit, PICKER.SELECT[ 0 ] ) : ''
                        }

                    }).on( 'keydown.P' + PICKER.ID, function() {

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

                    }).after([ $HOLDER, ELEMENT_HIDDEN ])

                    // Trigger the "start" event within scope of the picker.
                    triggerFunction( PICKER.onStart, PICKER, [ $HOLDER ] )

                    // Trigger the "render" event within scope of the picker.
                    triggerFunction( PICKER.onRender, PICKER, [ $HOLDER, P ] )

                    return P
                }, //start


                /**
                 * Destroy everything
                 */
                stop: function() {

                    // Firstly, close it.
                    P.close()

                    // Unbind the events on the `input` element.
                    $ELEMENT.off( '.P' + PICKER.ID )

                    // Restore the element state
                    ELEMENT.type = $ELEMENT._type
                    ELEMENT.readOnly = false

                    // Remove the hidden field.
                    if ( ELEMENT_HIDDEN ) {
                        ELEMENT_HIDDEN.parentNode.removeChild( ELEMENT_HIDDEN )
                    }

                    // Remove the holder.
                    $HOLDER.remove()

                    // Trigger the "stop" event within scope of the picker.
                    triggerFunction( PICKER.onStop, PICKER )

                    return P
                }, //stop


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

                        // Maintain the focus on the `input` element.
                        ELEMENT.focus()

                        // Prevent the default action to keep focus on the `input` field.
                        event.preventDefault()

                    }).on( 'keydown.P' + PICKER.ID, function( event ) {

                        var
                            // Get the keycode
                            keycode = event.keyCode,

                            // Translate that to a selection change
                            keycodeToMove = PICKER.keyMove[ keycode ]


                        // On escape, focus back onto the element and close the picker.
                        if ( keycode == 27 ) {
                            ELEMENT.focus()
                            P.close()
                        }

                        // Check if the target is the element and there's a key movement or enter key is pressed.
                        else if ( event.target == ELEMENT && ( keycodeToMove || keycode == 13 ) ) {

                            // Prevent the default action to stop it from moving the page.
                            event.preventDefault()

                            // If the keycode translates to a move, superficially set the time.
                            // * Truthy second argument makes it a superficial selection.
                            if ( keycodeToMove ) {
                                P.set( triggerFunction( PICKER.keyMove.go, PICKER, [ keycodeToMove ] ), 1 )
                            }

                            // Otherwise it's the enter key so select the highlighted or selected time and then close it.
                            else {
                                P.set( PICKER.HIGHLIGHT ).close()
                            }

                        } //if ELEMENT
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
                    $ELEMENT.val( '' ).trigger( 'change' )
                    return P
                }, //clear


                /**
                 * Set the values
                 */
                set: function( timePassed, isSuperficial ) {

                    // Clear the values if there is no time.
                    if ( !timePassed ) {
                        P.clear()
                    }

                    // Otherwise set the validated object as selected.
                    else {

                        // Validate and create a time object.
                        var timeObject = timePassed && !isNaN( timePassed.TIME ) ? timePassed : PICKER.object( timePassed )

                        // Stop if it's not a superficial selection and the time is disabled.
                        if ( !isSuperficial && PICKER.DISABLE.length && triggerFunction( PICKER.disable, PICKER, [ timeObject ] ) ) {
                            return P
                        }

                        // Check it's not just a superficial selection
                        if ( !isSuperficial ) {

                            // Select the time object
                            PICKER.SELECT = [ timeObject ]

                            // Update the element value
                            $ELEMENT.val( formatObjectToString( PICKER.formats, SETTINGS.format, timeObject ) ).trigger( 'change' )
                        }

                        // Highlight the time object
                        PICKER.VIEWSET = PICKER.HIGHLIGHT = timeObject

                        // Then render a new picker
                        createNewPicker()
                    }

                    return P
                } //set

            } //Picker.prototype



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


        /**
         * Create a new picker within the holder.
         */
        function createNewPicker() {

            // Insert a new picker in the holder.
            $HOLDER.html( createWrappedPicker() )

            // Trigger the "render" event within scope of the picker.
            triggerFunction( PICKER.onRender, PICKER, [ $HOLDER, P ] )
        } //createNewPicker


        // Return a new initialized picker
        return new P.start()
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

    /**
     * Format an object into a string using the formatting options.
     */
    function formatObjectToString( formattings, format, itemObject ) {
        return formattings.toArray( format ).map( function( value ) {
            return triggerFunction( formattings[ value ], itemObject ) || value.replace( /^!/, '' )
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

            // Merge the options and defaults with a deep copy.
            var settings = $.extend( true, {}, $.fn[ picker ].defaults, options )

            // Just stop if the picker should be disabled.
            if ( settings.disablePicker ) return this

            return this.each( function() {
                var $this = $( this )

                // If the picker hasn't been attached, do it.
                if ( !$this.data( picker ) ) {
                    $this.data( picker, new Picker( $this, settings, index ? ClockPicker : CalendarPicker ) )
                }

                //
                if ( typeof options == 'string' ) {
                    triggerFunction( $this.data( picker )[ options ] )
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
        formatSubmit: '',

        // Hidden `input` element name suffix
        hiddenSuffix: '_submit',

        // Strings (with translation support) for months and weekdays
        monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        weekdaysFull: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

        // Display strings
        showMonthsFull: 1,
        showWeekdaysShort: 1,

        // Selectors
        selectYears: 0,
        selectMonths: 0,

        // Today and clear
        today: 'Today',
        clear: 'Clear',

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

            navPrev: STRING_PREFIX_PICKER + 'nav--prev',
            navNext: STRING_PREFIX_PICKER + 'nav--next',
            navDisabled: STRING_PREFIX_PICKER + 'nav--disabled',

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
        max: 0,

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




