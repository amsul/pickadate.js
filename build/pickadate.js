/*!
 * pickadate.js v3.0.0alpha, 2013-04-10
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
   eqnull: true,
   boss: true
 */


/**
 * Todo:
 * – Datepicker tests.
 * – Datepicker options & methods.
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


    function TimePicker( picker, settings, defaultValueObject ) {

        var clock = this

        clock.settings = settings
        clock.i = settings.interval || 30

        // The queue of methods that will be used to build item objects.
        clock.queue = {
            min: 'measure create',
            max: 'measure create',
            now: 'now create',
            select: 'parse normalize validate create',
            highlight: 'validate create',
            view: 'validate create',
            disable: 'flipItem',
            enable: 'flipItem'
        }

        // The component's item object.
        clock.item = {}

        clock.item.disable = ( settings.disable || [] ).slice( 0 )
        clock.item.enable = -(function( collectionDisabled ) {
            return collectionDisabled[ 0 ] === true ? collectionDisabled.shift() : -1
        })( clock.item.disable )

        clock.
            set( 'min', settings.min, { orig: 0 } ).
            set( 'max', settings.max, { orig: [ HOURS_IN_DAY - 1, MINUTES_IN_HOUR - 1 ] } ).
            set( 'now', 0, { past: 1 } ).

            // Setting `select` also sets the `highlight` and `view`.
            set( 'select', defaultValueObject.value || clock.item.now.PICK, { format: defaultValueObject.format } )


        /**
         * The keycode to movement mapping.
         */
        clock.key = {
            40: 1, // Down
            38: -1, // Up
            39: 1, // Right
            37: -1, // Left
            go: function( timeChange ) {
                clock.set( 'highlight', clock.create( clock.item.highlight.PICK + timeChange * clock.i ), { interval: timeChange * clock.i } )
                this.render()
            }
        }


        /**
         * The time picker events.
         */
        clock.onRender = function( $holder ) {
            var picker = this,
                $viewset = $holder.find( '.' + settings.klass.viewset )
            if ( $viewset.length ) {
                $holder[ 0 ].scrollTop = $viewset.position().top - ~~( $holder[ 0 ].clientHeight / 4 )
            }
            else {
                console.warn( 'Nothing to viewset with', clock.item.view )
            }
            triggerFunction( settings.onRender, picker, [ $holder ] )
        }
        clock.onStart = function( $holder ) {
            triggerFunction( settings.onStart, this, [ $holder ] )
        }
        clock.onOpen = function( $holder ) {
            $holder.find( 'button' ).attr( 'disable', false )
            triggerFunction( settings.onOpen, this, [ $holder ] )
        }
        clock.onClose = function( $holder ) {
            $holder.find( 'button' ).attr( 'disable', true )
            triggerFunction( settings.onClose, this, [ $holder ] )
        }
        clock.onSet = function( $holder ) {
            triggerFunction( settings.onSet, this, [ $holder ] )
        }
        clock.onStop = function( $holder ) {
            triggerFunction( settings.onStop, this, [ $holder ] )
        }

    } //TimePicker


    /**
     * Set a timepicker item object.
     */
    TimePicker.prototype.set = function( type, timeUnit, options ) {

        var
            clock = this,

            // Split to get a queue of methods.
            methodsQueue = ( clock.queue[ type ] || '' ).split( ' ' )


        if ( methodsQueue[ 0 ] === '' ) {
            console.log( 'nothing queued up...', type, timeUnit, methodsQueue )
            return clock
        }

        if ( !options ) {
            console.warn( 'no options..but going on', type )
        }

        // Make sure we have options to pass
        options = options || {}

        // Attach the type to the options
        options.type = type

        // Go through each method, invoke the function, update the time unit,
        // and set the final resultant as this item type.
        clock.item[ type ] = methodsQueue.map( function( method ) {
            return timeUnit = clock[ method ]( timeUnit, options )
        }).pop()

        // Improve this later
        if ( type == 'select' ) {
            clock.set( 'highlight', timeUnit, options )
        }
        else if ( type == 'highlight' ) {
            clock.set( 'view', timeUnit, options )
        }

        return clock
    } //TimePicker.prototype.set


    /**
     * Get a timepicker item object.
     */
    TimePicker.prototype.get = function( type ) {
        return this.item[ type ] || this[ type ]
    } //TimePicker.prototype.get


    /**
     * Create a picker time object based on the minutes.
     */
    TimePicker.prototype.create = function( minutes, options ) {

        // If it's already an object, just return it.
        if ( minutes && !isNaN( minutes.PICK ) ) {
            return minutes
        }

        // If it's an array, prepare it into minutes.
        if ( Array.isArray( minutes ) ) {
            minutes = this.prepare( minutes )
        }

        // If no valid minutes are passed, set it to "now" with the options.
        if ( isNaN( minutes ) ) {
            minutes = this.now( options )
        }

        // Return the compiled object.
        return {

            // Divide to get hours from minutes.
            HOUR: ~~( HOURS_IN_DAY + minutes / MINUTES_IN_HOUR ) % HOURS_IN_DAY,

            // The remainder is the minutes.
            MINS: ( MINUTES_IN_HOUR + minutes % MINUTES_IN_HOUR ) % MINUTES_IN_HOUR,

            // The time in total minutes.
            TIME: ( MINUTES_IN_DAY + minutes ) % MINUTES_IN_DAY,

            // Reference to the "relative" minutes to pick.
            PICK: minutes
        }
    } //TimePicker.prototype.create


    /**
     * Get the time minutes for right now.
     */
    TimePicker.prototype.now = function( ignore, options ) {
        var date = new Date()
        return this.normalize( date.getHours() * MINUTES_IN_HOUR + date.getMinutes(), options )
    } //TimePicker.prototype.now


    /**
     * Normalize minutes or an object to be "reachable" based on the interval.
     */
    TimePicker.prototype.normalize = function( minutes, options ) {

        // Prepare an array or object into minutes.
        minutes = this.prepare( minutes )

        // Add an interval to the minutes, if that. Then subtract the remainder
        // of minutes divided by the interval to get it within "reach".
        return minutes + ( options && options.past ? this.i : 0 ) - ( minutes % this.i )
    } //TimePicker.prototype.normalize


    /**
     * Prepare an object or an array into minutes.
     */
    TimePicker.prototype.prepare = function( minutes ) {

        // If it's an array, convert it into minutes by expecting: [ {{hour}}, {{minutes}} ].
        if ( Array.isArray( minutes ) ) {
            minutes = +minutes[ 0 ] * MINUTES_IN_HOUR + (+minutes[ 1 ])
        }

        return minutes
    } //TimePicker.prototype.prepare


    /**
     * Measure the range of minutes.
     */
    TimePicker.prototype.measure = function( timeUnit, options ) {

        var
            minutes = timeUnit || options.orig,
            clock = this

        // Make sure we have options to work with
        if ( !options ) {
            console.warn( 'we might need some options', timeUnit, options )
        }

        // If it's a literal true, return the time right now.
        // For `max`, time hasn't passed. But for `min` it has.
        if ( timeUnit === true ) {

            // If it's relative a relative measure, set the time as past.
            // *** Find a better way to do this later.
            if ( options.type == 'max' || options.type == 'min' ) {
                options.past = 1
            }

            minutes = clock.now( timeUnit, options )
        }

        else if ( Array.isArray( timeUnit || minutes ) ) {
            minutes = clock.normalize( clock.prepare( timeUnit || minutes ), options )
        }

        // If it's a number, return the time right now shifted relative by intervals.
        else if ( !isNaN( timeUnit ) ) {

            // If it's relative a relative measure, set the time as past.
            // *** Find a better way to do this later.
            if ( options.type == 'max' || options.type == 'min' ) {
                options.past = 1
            }

            minutes = timeUnit * clock.i + clock.now( timeUnit, options )
        }

        // Return the minutes or default to 0.
        return minutes || 0
    } ///TimePicker.prototype.measure


    /**
     * Validate an object as enabled.
     */
    TimePicker.prototype.validate = function( timeUnit, options ) {

        var clock = this

        // If this time unit is disabled, shift until we reach an enabled time.
        if ( clock.settings.disable && clock.disabled( timeUnit ) ) {
            timeUnit = clock.shift( timeUnit, options )
        }

        // Scope the time unit in to range and create an object
        timeUnit = clock.create( clock.scope( timeUnit.PICK || timeUnit, options ) )

        // Improve this later. But for now, do a second check for if the scoped object
        // is disabled. If it is, then shift in the opposite direction.
        if ( clock.settings.disable && clock.disabled( timeUnit ) ) {
            options.interval = options.interval * -1
            timeUnit = clock.shift( timeUnit, options )
        }

        return timeUnit.PICK || timeUnit
    } //TimePicker.prototype.validate


    /**
     * Check if an object is disabled.
     */
    TimePicker.prototype.disabled = function( object ) {

        var
            clock = this,

            // Filter through the disabled times to check if this is one.
            isDisabledTime = clock.item.disable.filter( function( timeToDisable ) {

                // If the time is a number, match the hours.
                if ( !isNaN( timeToDisable ) ) {
                    return object.HOUR == timeToDisable
                }

                // If it's an array, create the object and match the times.
                if ( Array.isArray( timeToDisable ) ) {
                    return object.PICK == clock.create( timeToDisable ).PICK
                }
            }).length

        // If the clock is "enabled" flag is flipped, flip the condition.
        return clock.item.enable === -1 ? !isDisabledTime : isDisabledTime
    } //TimePicker.prototype.disabled


    /**
     * Shift an object by an interval until we reach an enabled object.
     */
    TimePicker.prototype.shift = function( object, options ) {

        var clock = this

        // Keep looping as long as the time is disabled.
        while ( clock.disabled( object ) ) {

            // Increase/decrease the time by the key movement and keep looping.
            object = clock.create( object.PICK += options.interval || clock.i, options )

            // If we've looped beyond the limits, break out of the loop.
            if ( object.PICK < clock.item.min.PICK || object.PICK > clock.item.max.PICK ) {
                break
            }
        }

        // Return the final object.
        return object
    } //TimePicker.prototype.shift


    /**
     * Scope minutes into range of min and max.
     */
    TimePicker.prototype.scope = function( minutes, options ) {
        var minTime = this.item.min.PICK,
            maxTime = this.item.max.PICK
        return minutes > maxTime ? maxTime : minutes < minTime ? minTime : minutes
    } //TimePicker.prototype.scope


    /**
     * Parse a string into an object.
     */
    TimePicker.prototype.parse = function( string, options ) {

        if ( typeof string == 'number' && !isNaN( string ) || Array.isArray( string ) ) {
            return string
        }

        if ( !options ) {
            console.warn( 'Need a formats option', string )
            return string
        }

        var
            clock = this,
            parsingObject = {},
            formattings = clock.formats

        // Convert the format into an array and then map through it.
        formattings.toArray( options.format ).map( function( label ) {

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
    } //TimePicker.prototype.parse


    /**
     * Various formats to display the object in.
     */
    TimePicker.prototype.formats = {

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
            return string ? 4 : MINUTES_IN_DAY / 2 > timeObject.PICK % MINUTES_IN_DAY ? 'a.m.' : 'p.m.'
        },
        A: function( string, timeObject ) {

            // If there's a string, then the length is always 2.
            // Otherwise check if it's more than "noon" and return either am/pm.
            return string ? 2 : MINUTES_IN_DAY / 2 > timeObject.PICK % MINUTES_IN_DAY ? 'AM' : 'PM'
        },

        // Create an array by splitting the formatting string passed.
        toArray: function( formatString ) { return formatString.split( /(h{1,2}|H{1,2}|i|a|A|!.)/g ) },

        // Format an object into a string using the formatting options.
        toString: function ( formatString, itemObject ) {
            var clock = this
            return clock.formats.toArray( formatString ).map( function( label ) {
                return triggerFunction( clock.formats[ label ], clock, [ 0, itemObject ] ) || label.replace( /^!/, '' )
            }).join( '' )
        }
    } //TimePicker.prototype.formats


    /**
     * Flip an item as enabled or disabled.
     */
    TimePicker.prototype.flipItem = function( timeUnit, options ) {
        var clock = this,
            isFlipped = clock.item.enable === -1
        if ( !isFlipped && options.enable || isFlipped && options.disable ) {
            clock.removeDisabled( timeUnit, options )
        }
        else if ( !isFlipped && options.disable || isFlipped && options.enable ) {
            clock.addDisabled( timeUnit, options )
        }
        return clock.item.disable
    } //TimePicker.prototype.flipItem


    /**
     * Add an item to the disabled collection.
     */
    TimePicker.prototype.addDisabled = function( timeUnit/*, options*/ ) {
        var clock = this
        if ( !clock.filterDisabled( timeUnit ).length ) {
            clock.item.disable.push( timeUnit )
        }
        return clock.item.disable
    } //TimePicker.prototype.addDisabled


    /**
     * Remove an item from the disabled collection.
     */
    TimePicker.prototype.removeDisabled = function( timeUnit/*, options*/ ) {
        var clock = this
        clock.item.disable = clock.filterDisabled( timeUnit, 1 )
        return clock.item.disable
    } //TimePicker.prototype.removeDisabled


    /**
     * Filter through the disabled collection to find a time unit.
     */
    TimePicker.prototype.filterDisabled = function( timeUnit, isRemoving ) {
        var timeIsArray = Array.isArray( timeUnit )
        return this.item.disable.filter( function( disabledTimeUnit ) {
            var isMatch = !timeIsArray && timeUnit === disabledTimeUnit ||
                timeIsArray && Array.isArray( disabledTimeUnit ) && timeUnit.toString() === disabledTimeUnit.toString()
            return isRemoving ? !isMatch : isMatch
        })
    } //TimePicker.prototype.filterDisabled


    /**
     * Create a string for the nodes in the picker.
     */
    TimePicker.prototype.nodes = function( isOpen ) {

        var
            clock = this,
            settings = clock.settings,
            selectedObject = clock.item.select,
            highlightedObject = clock.item.highlight,
            viewsetObject = clock.item.view,
            disabledCollection = clock.item.disable

        return createNode( 'ul', createGroupOfNodes({
            min: clock.item.min.PICK,
            max: clock.item.max.PICK,
            i: clock.i,
            node: 'li',
            item: function( loopedTime ) {
                loopedTime = clock.create( loopedTime )
                return [
                    triggerFunction( clock.formats.toString, clock, [ settings.format, loopedTime ] ),
                    (function( klasses, timeMinutes ) {

                        if ( selectedObject && selectedObject.PICK == timeMinutes ) {
                            klasses.push( settings.klass.selected )
                        }

                        if ( highlightedObject && highlightedObject.PICK == timeMinutes ) {
                            klasses.push( settings.klass.highlighted )
                        }

                        if ( viewsetObject && viewsetObject.PICK == timeMinutes ) {
                            klasses.push( settings.klass.viewset )
                        }

                        if ( disabledCollection && clock.disabled( loopedTime ) ) {
                            klasses.push( settings.klass.disabled )
                        }

                        return klasses.join( ' ' )
                    })( [ settings.klass.listItem ], loopedTime.PICK ),
                    'data-pick=' + loopedTime.PICK
                ]
            }
        }) + createNode( 'li', createNode( 'button', settings.clear, settings.klass.clear, 'data-clear=1' + ( isOpen ? '' : ' disabled' ) ) ), settings.klass.list )
    } //TimePicker.prototype.nodes






    /* ==========================================================================
       Build date picker components
       ========================================================================== */


    function DatePicker( picker, settings, defaultValueObject ) {

        var calendar = this

        calendar.settings = settings
        calendar.i = 1

        // The queue of methods that will be used to build item objects.
        calendar.queue = {
            min: 'measure create',
            max: 'measure create',
            now: 'now create',
            select: 'parse validate create',//'parse normalize validate create',
            highlight: 'validate create',
            view: 'validate create',
            disable: 'flipItem',
            enable: 'flipItem'
        }

        // The component's item object.
        calendar.item = {}

        calendar.item.disable = ( settings.disable || [] ).slice( 0 )
        calendar.item.enable = -(function( collectionDisabled ) {
            return collectionDisabled[ 0 ] === true ? collectionDisabled.shift() : -1
        })( calendar.item.disable )

        calendar.
            set( 'min', settings.min, { orig: -Infinity } ).
            set( 'max', settings.max, { orig: Infinity } ).
            set( 'now', 0, { past: 1 } ).

            // Setting `select` also sets the `highlight` and `view`.
            set( 'select', defaultValueObject.value || calendar.item.now.PICK, { format: defaultValueObject.format } )


        /**
         * The keycode to movement mapping.
         */
        calendar.key = {
            40: 7, // Down
            38: -7, // Up
            39: 1, // Right
            37: -1, // Left
            go: function( timeChange ) {
                calendar.set( 'highlight', calendar.create([ calendar.item.highlight.YEAR, calendar.item.highlight.MONTH, calendar.item.highlight.DATE + timeChange ]), { interval: timeChange } )
                this.render()
            }
        }


        /**
         * The time picker events.
         */
        calendar.onRender = function( $holder ) {
            triggerFunction( settings.onRender, picker, [ $holder ] )
        }
        calendar.onStart = function( $holder ) {
            triggerFunction( settings.onStart, this, [ $holder ] )
        }
        calendar.onOpen = function( $holder ) {
            $holder.find( 'button, select' ).attr( 'disabled', false )
            triggerFunction( settings.onOpen, this, [ $holder ] )
        }
        calendar.onClose = function( $holder ) {
            $holder.find( 'button, select' ).attr( 'disabled', true )
            triggerFunction( settings.onClose, this, [ $holder ] )
        }
        calendar.onSet = function( $holder ) {
            triggerFunction( settings.onSet, this, [ $holder ] )
        }
        calendar.onStop = function( $holder ) {
            triggerFunction( settings.onStop, this, [ $holder ] )
        }

    } //DatePicker


    /**
     * Set a datepicker item object.
     */
    DatePicker.prototype.set = function( type, timeUnit, options ) {

        var
            clock = this,

            // Split to get a queue of methods.
            methodsQueue = ( clock.queue[ type ] || '' ).split( ' ' )


        if ( methodsQueue[ 0 ] === '' ) {
            console.log( 'nothing queued up...', type, timeUnit, methodsQueue )
            return clock
        }

        if ( !options ) {
            console.warn( 'no options..but going on', type )
        }

        // Make sure we have options to pass
        options = options || {}

        // Attach the type to the options
        options.type = type

        // Go through each method, invoke the function, update the time unit,
        // and set the final resultant as this item type.
        clock.item[ type ] = methodsQueue.map( function( method ) {
            return timeUnit = clock[ method ]( timeUnit, options )
        }).pop()

        // Improve this later
        if ( type == 'select' ) {
            clock.set( 'highlight', timeUnit, options )
        }
        else if ( type == 'highlight' && !options.nav ) {
            clock.set( 'view', timeUnit, options )
        }
        else if ( type == 'view' && options.nav ) {
            clock.set( 'highlight', timeUnit, options )
        }

        return clock
    } //DatePicker.prototype.set


    /**
     * Get a datepicker item object.
     */
    DatePicker.prototype.get = function( type ) {
        return this.item[ type ] || this[ type ]
    } //DatePicker.prototype.get


    /**
     * Create a picker date object based on the time unit.
     */
    DatePicker.prototype.create = function( date, options ) {

        // Check if we just need an infinite object
        var infiniteObject = date == -Infinity || date == Infinity ? date : undefined

        // If it's already an object, just return it.
        if ( date && !isNaN( date.PICK ) ) {
            return date
        }

        // If it's an array, prepare it into date.
        if ( Array.isArray( date ) ) {
            date = this.prepare( date )
        }

        // If the time passed is a number, create the time with the number.
        else if ( !isNaN( date ) ) {
            date = new Date( date )
        }

        // If no valid date are passed, set it to "now" with the options.
        else {
            date = this.now( date, options )
        }

        // // Return the compiled object.
        return {
            YEAR: infiniteObject || date.getFullYear(),
            MONTH: infiniteObject || date.getMonth(),
            DATE: infiniteObject || date.getDate(),
            DAY: infiniteObject || date.getDay(),
            TIME: infiniteObject || date,
            PICK: infiniteObject || date.getTime()
        }
    } //DatePicker.prototype.create


    /**
     * Get the date today.
     */
    DatePicker.prototype.now = function( ignore, options ) {
        return this.normalize( new Date(), options )
    } //DatePicker.prototype.now


    /**
     * Normalize a date object to be "reachable".
     */
    DatePicker.prototype.normalize = function( date, options ) {

        // Prepare an array or object into date.
        date = this.prepare( date )

        // Set the hours to midnight for comparison.
        date.setHours( 0, 0, 0, 0 )

        // Add an interval to the date, if that. Then subtract the remainder
        // of date divided by the interval to get it within "reach".
        return date// + ( options && options.past ? this.i : 0 ) - ( date % this.i )
    } //DatePicker.prototype.normalize


    /**
     * Prepare an object or an array into a date.
     */
    DatePicker.prototype.prepare = function( date ) {

        // If it's an array, convert it into date by expecting: [ {{year}}, {{month}}, {{date}} ].
        if ( Array.isArray( date ) ) {
            date = new Date( date[ 0 ], date[ 1 ], date[ 2 ] )
        }

        return date
    } //DatePicker.prototype.prepare


    /**
     * Measure the range of dates.
     */
    DatePicker.prototype.measure = function( timeUnit, options ) {

        var
            minutes = timeUnit || options.orig,
            clock = this

        // Make sure we have options to work with
        if ( !options ) {
            console.warn( 'we might need some options', timeUnit, options )
        }

        // If it's a literal true, return the time right now.
        // For `max`, time hasn't passed. But for `min` it has.
        if ( timeUnit === true ) {

            // If it's relative a relative measure, set the time as past.
            // *** Find a better way to do this later.
            if ( options.type == 'max' || options.type == 'min' ) {
                options.past = 1
            }

            minutes = clock.now( timeUnit, options )
        }

        else if ( Array.isArray( timeUnit || minutes ) ) {
            minutes = clock.normalize( clock.prepare( timeUnit || minutes ), options )
        }

        // If it's a number, return the time right now shifted relative by intervals.
        else if ( !isNaN( timeUnit ) ) {

            // If it's relative a relative measure, set the time as past.
            // *** Find a better way to do this later.
            if ( options.type == 'max' || options.type == 'min' ) {
                options.past = 1
            }

            minutes = timeUnit * clock.i + clock.now( timeUnit, options )
        }

        // Return the minutes or default to 0.
        return minutes || 0
    } ///DatePicker.prototype.measure


    /**
     * Validate an object as enabled.
     */
    DatePicker.prototype.validate = function( timeUnit, options ) {

        var calendar = this

        // If we're validating a view, set it to the first of the month.
        if ( options.type == 'view' && !isNaN( timeUnit.PICK ) ) {
            timeUnit = calendar.create([ timeUnit.YEAR, timeUnit.MONTH + ( options.nav || 0 ), 1 ])
        }

        // If the viewset changes, update the highlight.
        else if ( options.type == 'highlight' && options.nav ) {
            timeUnit = calendar.create([ calendar.item.view.YEAR, calendar.item.view.MONTH, calendar.item.highlight.DATE ])
        }


        // If this time unit is disabled, shift until we reach an enabled time.
        if ( calendar.settings.disable && calendar.disabled( timeUnit ) ) {
            timeUnit = calendar.shift( timeUnit, options )
        }

        // Scope the time unit in to range and create an object
        timeUnit = calendar.create( calendar.scope( timeUnit.PICK || timeUnit, options ) )

        // Improve this later. But for now, do a second check for if the scoped object
        // is disabled. If it is, then shift in the opposite direction.
        if ( calendar.settings.disable && calendar.disabled( timeUnit ) ) {
            options.interval = options.interval * -1
            timeUnit = calendar.shift( timeUnit, options )
        }

        return timeUnit.PICK || timeUnit
    } //DatePicker.prototype.validate


    // /**
    //  * Create a viewset object based on navigation.
    //  */
    // DatePicker.prototype.viewset = function( timeUnit, options ) {
    //     return this.create([ timeUnit.YEAR, timeUnit.MONTH + options.nav, 1 ])
    // } //DatePicker.prototype.viewset


    /**
     * Check if an object is disabled.
     */
    DatePicker.prototype.disabled = function( object ) {

        var
            calendar = this,

            // Filter through the disabled dates to check if this is one.
            isDisabledTime = calendar.item.disable.filter( function( timeToDisable ) {

                // If the time is a number, match the hours.
                if ( !isNaN( timeToDisable ) ) {
                    console.log( 'no hours', object.HOUR )
                    return object.HOUR == timeToDisable
                }

                // If it's an array, create the object and match the dates.
                if ( Array.isArray( timeToDisable ) ) {
                    return object.PICK == calendar.create( timeToDisable ).PICK
                }
            }).length

        // If the calendar is "enabled" flag is flipped, flip the condition.
        return calendar.item.enable === -1 ? !isDisabledTime : isDisabledTime
    } //DatePicker.prototype.disabled


    /**
     * Scope a date into range of min and max.
     */
    DatePicker.prototype.scope = function( date, options ) {
        var minTime = this.item.min.PICK,
            maxTime = this.item.max.PICK
        return date > maxTime ? maxTime : date < minTime ? minTime : date
    } //DatePicker.prototype.scope


    /**
     * Parse a string into an object.
     */
    DatePicker.prototype.parse = function( string, options ) {

        if ( typeof string == 'number' && !isNaN( string ) || Array.isArray( string ) ) {
            return string
        }

        if ( !options ) {
            console.warn( 'Need a formats option', string )
            return string
        }

        var
            calendar = this,
            parsingObject = {},
            formattings = calendar.formats

        // Convert the format into an array and then map through it.
        formattings.toArray( options.format ).map( function( label ) {

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

        console.log( parsingObject )

        // return +parsingObject.i + MINUTES_IN_HOUR * (

        //     +( parsingObject.H || parsingObject.HH ) ||

        //     ( +( parsingObject.h || parsingObject.hh ) + ( /^p/i.test( parsingObject.A || parsingObject.a ) ? 12 : 0 ) )
        // )
    } //DatePicker.prototype.parse


    /**
     * Various formats to display the object in.
     */
    DatePicker.prototype.formats = {

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
            return string ? getFirstWordLength( string ) : this.settings.weekdaysShort[ dateObject.DAY ]
        },
        dddd: function( string, dateObject ) {

            // If there's a string, then get the length of the first word.
            // Otherwise return the full selected weekday.
            return string ? getFirstWordLength( string ) : this.settings.weekdaysFull[ dateObject.DAY ]
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

            var collection = this.settings.monthsShort

            // If there's a string, get length of the relevant month from the short
            // months collection. Otherwise return the selected month from that collection.
            return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ dateObject.MONTH ]
        },
        mmmm: function( string, dateObject ) {

            var collection = this.settings.monthsFull

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
            var calendar = this
            return calendar.formats.toArray( formatString ).map( function( label ) {
                return triggerFunction( calendar.formats[ label ], calendar, [ 0, itemObject ] ) || label.replace( /^!/, '' )
            }).join( '' )
        }
    } //DatePicker.prototype.formats


    /**
     * Create a string for the nodes in the picker.
     */
    DatePicker.prototype.nodes = function( isOpen ) {

        var
            calendar = this,
            settings = calendar.settings,
            nowObject = calendar.item.now,
            selectedObject = calendar.item.select,
            highlightedObject = calendar.item.highlight,
            viewsetObject = calendar.item.view,
            disabledCollection = calendar.item.disable,
            minLimitObject = calendar.item.min,
            maxLimitObject = calendar.item.max,


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
                        max: DAYS_IN_WEEK - 1,
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
            })( ( settings.showWeekdaysShort ? settings.weekdaysShort : settings.weekdaysFull ).slice( 0 ) ), //tableHead


            // Create the nav for next/prev month.
            createMonthNav = function( next ) {

                // Otherwise, return the created month tag.
                return createNode(
                    STRING_DIV,
                    ' ',
                    settings.klass[ 'nav' + ( next ? 'Next' : 'Prev' ) ] + (

                        // If the focused month is outside the range, disabled the button.
                        ( next && viewsetObject.YEAR >= maxLimitObject.YEAR && viewsetObject.MONTH >= maxLimitObject.MONTH ) ||
                        ( !next && viewsetObject.YEAR <= minLimitObject.YEAR && viewsetObject.MONTH <= minLimitObject.MONTH ) ?
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
                                ( viewsetObject.MONTH == loopedMonth ? ' selected' : '' ) +
                                (
                                    (
                                        ( viewsetObject.YEAR == minLimitObject.YEAR && loopedMonth < minLimitObject.MONTH ) ||
                                        ( viewsetObject.YEAR == maxLimitObject.YEAR && loopedMonth > maxLimitObject.MONTH )
                                    ) ?
                                    ' disabled' : ''
                                )
                            ]
                        }
                    }), settings.klass.selectMonth )
                }

                // If there's a need for a month selector
                return createNode( STRING_DIV, monthsCollection[ viewsetObject.MONTH ], settings.klass.month )
            }, //createMonthLabel


            // Create the year label
            createYearLabel = function() {

                var focusedYear = viewsetObject.YEAR,

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
            } //createYearLabel


        // Create and return the entire calendar.
        return createNode(
            STRING_DIV,
            createMonthNav() + createMonthNav( 1 ) +
            createMonthLabel( settings.showMonthsFull ? settings.monthsFull : settings.monthsShort ) +
            createYearLabel(),
            settings.klass.header
        ) + createNode(
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
                                min: DAYS_IN_WEEK * rowCounter - viewsetObject.DAY + 1, // Add 1 for weekday 0index
                                max: function() {
                                    return this.min + DAYS_IN_WEEK - 1
                                },
                                i: 1,
                                node: 'td',
                                item: function( timeDate ) {

                                    // Convert the time date from a relative date to a date object
                                    timeDate = calendar.create([ viewsetObject.YEAR, viewsetObject.MONTH, timeDate + ( settings.firstDay ? 1 : 0 ) ])

                                    return [
                                        createNode(
                                            STRING_DIV,
                                            timeDate.DATE,
                                            (function( klasses ) {

                                                // Add the `infocus` or `outfocus` classes based on month in view.
                                                klasses.push( viewsetObject.MONTH == timeDate.MONTH ? settings.klass.infocus : settings.klass.outfocus )

                                                // Add the `today` class if needed.
                                                if ( nowObject.PICK == timeDate.PICK ) {
                                                    klasses.push( settings.klass.now )
                                                }

                                                // Add the `selected` class if something's selected and the time matches.
                                                if ( selectedObject && selectedObject.PICK == timeDate.PICK ) {
                                                    klasses.push( settings.klass.selected )
                                                }

                                                // Add the `highlighted` class if something's highlighted and the time matches.
                                                if ( highlightedObject && highlightedObject.PICK == timeDate.PICK ) {
                                                    klasses.push( settings.klass.highlighted )
                                                }

                                                // Add the `disabled` class if something's disabled and the object matches.
                                                if ( disabledCollection && calendar.disabled( disabledCollection, timeDate ) || timeDate.PICK < minLimitObject.PICK || timeDate.PICK > maxLimitObject.PICK ) {
                                                    klasses.push( settings.klass.disabled )
                                                }

                                                return klasses.join( ' ' )
                                            })([ settings.klass.day ]),
                                            'data-pick=' + timeDate.PICK
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
            createNode( 'button', settings.today, settings.klass.buttonToday, 'data-pick=' + nowObject.PICK + ( isOpen ? '' : ' disabled' ) ) +
            createNode( 'button', settings.clear, settings.klass.buttonClear, 'data-clear=1' + ( isOpen ? '' : ' disabled' ) ),
            settings.klass.footer
        ) //endreturn
    } //DatePicker.prototype.nodes









    /* ==========================================================================
       The Picker
       ========================================================================== */

    /**
     * The picker constructor that creates and returns a new date or time picker
     */
    var Picker = function( $ELEMENT, SETTINGS, COMPONENT ) {

        var
            // The state of the picker.
            STATE = {
                ID: Math.abs( ~~( Math.random() * 1e9 ) )
            },


            // Shorthand for the classes.
            CLASSES = SETTINGS.klass,


            // The element node.
            ELEMENT = $ELEMENT[ 0 ], //ELEMENT


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

                    var
                        elementDataValue = $ELEMENT.data( 'value' )


                    // Confirm focus state, save original type, convert into text input
                    // to remove UA stylings, and set as readonly to prevent keyboard popup.
                    ELEMENT.autofocus = ( ELEMENT == document.activeElement )
                    STATE.TYPE = ELEMENT.type
                    ELEMENT.type = 'text'
                    ELEMENT.readOnly = true


                    // Create a new picker component with the settings and default value/format combo.
                    P.component = new COMPONENT( P, SETTINGS, {
                        value: elementDataValue || ELEMENT.value,
                        format: elementDataValue ? SETTINGS.formatSubmit : SETTINGS.format
                    })


                    // Create the picker box with a new wrapped picker and bind the events.
                    P.$box = $( createNode( STRING_DIV, createWrappedPicker(), CLASSES.holder ) ).on({

                        // When something within the holder is focused, make it appear so.
                        focusin: function( event ) {

                            // Remove the holder "focused" state from the holder.
                            P.$box.removeClass( CLASSES.focused )

                            // Prevent the event from propagating to the doc.
                            event.stopPropagation()
                        },

                        // Prevent any mousedowns within the holder from bubbling to the doc.
                        mousedown: function( event ) {
                            if ( P.$box.find( event.target ).length ) {
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
                            if ( P.$box.find( $target[ 0 ] ).length ) {

                                // Stop it from propagating to the doc.
                                event.stopPropagation()

                                // Maintain the focus on the `input` element.
                                ELEMENT.focus()

                                // Set and close the picker if something is getting picked.
                                if ( !isNaN( targetData.pick ) && !$target.hasClass( CLASSES.disabled ) ) {
                                    P.set({ select: targetData.pick }).close()
                                }

                                // If something is superficially changed, navigate the picker.
                                else if ( targetData.nav && !$target.hasClass( CLASSES.navDisabled ) ) {
                                    P.set({ view: P.component.item.view, nav: targetData.nav })
                                }

                                // If a "clear" button is pressed, empty the values and close it.
                                else if ( targetData.clear ) {
                                    P.clear().close()
                                }
                            }
                        }
                    }) //P.$box


                    // If there's a format for the hidden input element, create the element
                    // using the name of the original input plus suffix. Otherwise set it to null.
                    P._hidden = SETTINGS.formatSubmit ? $( '<input type=hidden name=' + ELEMENT.name + ( SETTINGS.hiddenSuffix || '_submit' ) + ( ELEMENT.value || elementDataValue ? ' value="' + triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.formatSubmit, P.component.item.select ] ) : '' ) + '">' )[ 0 ] : undefined


                    // Bind the events on the `input` element and then
                    // insert the holder and hidden element after the element.
                    $ELEMENT.on( 'focus.P' + STATE.ID + ' click.P' + STATE.ID, function() {

                        // Open the calendar.
                        P.open()

                        // Add the "focused" state onto the holder.
                        P.$box.addClass( CLASSES.focused )

                    }).on( 'change.P' + STATE.ID, function() {

                        // If there's a hidden input, update the value with formatting or clear it
                        if ( P._hidden ) {
                            P._hidden.value = ELEMENT.value ? triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.formatSubmit, P.component.item.select ] ) : ''
                        }

                    }).on( 'keydown.P' + STATE.ID, function( event ) {

                        var
                            // Grab the keycode
                            keycode = event.keyCode,

                            // Check if one of the delete keys was pressed
                            isKeycodeDelete = keycode == 8 || keycode == 46

                        // Check if delete was pressed or the calendar is closed and there is a key movement
                        if ( isKeycodeDelete || !STATE.OPEN && P.component.key[ keycode ] ) {

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

                    }).after([ P.$box, P._hidden ])


                    // Trigger the "start" event within scope of the picker.
                    triggerFunction( P.component.onStart, P, [ P.$box ] )

                    // Trigger the "render" event within scope of the picker.
                    triggerFunction( P.component.onRender, P, [ P.$box ] )

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
                    P.$box.html( createWrappedPicker() )

                    // Trigger the "render" event within scope of the picker.
                    triggerFunction( P.component.onRender, P, [ P.$box ] )

                    return P
                }, //render


                /**
                 * Destroy everything
                 */
                stop: function() {

                    // Cache the stop event for a bit.
                    var stopEvent = P.component.onStop

                    // Then close the picker.
                    P.close()

                    // Unbind the events on the `input` element.
                    $ELEMENT.off( '.P' + STATE.ID )

                    // Restore the element state
                    ELEMENT.type = STATE.TYPE
                    ELEMENT.readOnly = false

                    // Remove the hidden field.
                    if ( P._hidden ) {
                        P._hidden.parentNode.removeChild( P._hidden )
                    }

                    // Remove the holder.
                    P.$box.remove()

                    // Reset the component object.
                    P.component = undefined

                    // Trigger the "stop" event within scope of the picker.
                    triggerFunction( stopEvent, P )

                    return P
                }, //stop


                /**
                 * Open up the picker
                 */
                open: function() {

                    // If it's already open, do nothing.
                    if ( STATE.OPEN ) return P

                    // Set it as open.
                    STATE.OPEN = 1

                    // Make sure the element has focus then add the "active" class.
                    $ELEMENT.focus().addClass( CLASSES.inputActive )

                    // Add the "opened" class to the picker holder.
                    P.$box.addClass( CLASSES.opened )

                    // Bind the document events.
                    $document.on( 'click.P' + STATE.ID + ' focusin.P' + STATE.ID, function( event ) {

                        // If the target of the event is not the element, close the picker picker.
                        // * Don't worry about clicks or focusins on the holder
                        //   because those are stopped from bubbling up.
                        if ( event.target != ELEMENT ) P.close()

                    }).on( 'mousedown.P' + STATE.ID, function( event ) {

                        // Maintain the focus on the `input` element.
                        ELEMENT.focus()

                        // Prevent the default action to keep focus on the `input` field.
                        event.preventDefault()

                    }).on( 'keydown.P' + STATE.ID, function( event ) {

                        var
                            // Get the keycode
                            keycode = event.keyCode,

                            // Translate that to a selection change
                            keycodeToMove = P.component.key[ keycode ]


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
                                triggerFunction( P.component.key.go, P, [ keycodeToMove ] )
                            }

                            // Otherwise it's the enter key so select the highlighted time and then close it.
                            else {
                                P.set({ select: P.component.item.highlight.PICK }).close()
                            }

                        } //if ELEMENT
                    })

                    // Trigger the "open" event within scope of the picker.
                    triggerFunction( P.component.onOpen, P, [ P.$box ] )

                    return P
                }, //open


                /**
                 * Close the picker
                 */
                close: function() {

                    // If it's already closed, do nothing.
                    if ( !STATE.OPEN ) return P

                    // Set it as closed.
                    STATE.OPEN = 0

                    // Remove the "active" class.
                    $ELEMENT.removeClass( CLASSES.inputActive )

                    // Remove the "opened" class from the picker holder.
                    P.$box.removeClass( CLASSES.opened )

                    // Bind the document events.
                    $document.off( '.P' + STATE.ID )

                    // Trigger the on close event within scope of the picker.
                    triggerFunction( P.component.onClose, P, [ P.$box ] )

                    return P
                }, //close


                /**
                 * Clear the values
                 */
                clear: function() {
                    return P.set({ clear: 1 })
                }, //clear


                /**
                 * Set the values
                 */
                set: function( options ) {

                    if ( !isObject( options ) ) {
                        console.log( 'not sure what to do here', options )
                        return P
                    }

                    // Go through each property within the options to set.
                    for ( var property in options ) {

                        // If this type of item exists, then set it the options by type.
                        if ( P.component.item[ property ] ) {
                            P.component.set( property, options[ property ], options )
                        }

                        // Update the element value and broadcast a change, if that.
                        if ( property == 'select' || options.clear ) {
                            $ELEMENT.val( options.clear ? '' : triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.format, P.component.get( property ) ] ) ).trigger( 'change' )
                        }

                        // Render a new picker.
                        P.render()

                        // Trigger the "set" event within scope of the picker.
                        triggerFunction( P.component.onSet, P, [ P.$box ] )
                    }

                    return P
                }, //set


                /**
                 * Get the values
                 */
                get: function( options ) {

                    // If it's a string, either get the value or the component item object itself.
                    if ( typeof options == 'string' ) {
                        return options == 'value' ? ELEMENT.value : P.component.item[ options ]
                    }

                    // Confirm that the options are passed as an object.
                    if ( isObject( options ) ) {

                        // Go through each property within the options to get.
                        for ( var property in options ) {

                            // If this type of item exists, then get it based on the options.
                            if ( P.component.item[ property ] ) {
                                return triggerFunction( P.component.formats.toString, P.component, [ options[ property ], P.component.get( property ) ] )
                            }
                        }
                    }
                }, //get


                /**
                 * Get the open state
                 */
                isOpen: function() {
                    return !!STATE.OPEN
                }

            } //PickerInstance.prototype


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

                        // Create the components nodes.
                        P.component.nodes( STATE.OPEN ),

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
     * Lead numbers below 10 with a zero.
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
     * Tell if something is an object.
     */
    function isObject( object ) {
        return {}.toString.call( object ).indexOf( 'Object' ) > -1
    }









    /* ==========================================================================
       Extend jQuery
       ========================================================================== */

    /**
     * Map through the each picker type and extend jQuery
     */
    [ 'pickadate', 'pickatime' ].map( function( picker, index ) {

        $.fn[ picker ] = function( options, action ) {

            var
                // Merge the options and defaults with a deep copy.
                settings = $.extend( true, {}, $.fn[ picker ].defaults, options ),

                thisPickerData = this.data( picker )

            // If it's already invoked and `options` is a string, carry out the action.
            if ( thisPickerData && typeof options == 'string' ) {
                return options == 'picker' ? thisPickerData : triggerFunction( thisPickerData[ options ], thisPickerData, [ action ] )
            }

            // Otherwise look through each one of the matched elements
            // and if it doesn't have any picker data, create and link one.
            return this.each( function() {
                var $this = $( this )
                if ( !$this.data( picker ) ) {
                    $this.data( picker, new Picker( $this, settings, index ? TimePicker : DatePicker ) )
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

















//     /* ==========================================================================
//        Build date picker components
//        ========================================================================== */

//     function CalendarPicker( settings ) {

//         var
//             calendar = this,

//             // Return the length of the first word in a collection.
//             getWordLengthFromCollection = function( string, collection, dateObject ) {

//                 // Grab the first word from the string.
//                 var word = string.match( /\w+/ )[ 0 ]

//                 // If there's no month index, add it to the date object
//                 if ( !dateObject.mm && !dateObject.m ) {
//                     dateObject.m = collection.indexOf( word )
//                 }

//                 // Return the length of the word.
//                 return word.length
//             }

//         $.extend( calendar, {
//             onStart: function( $holder ) {
//                 // console.log( 'what is ', this )
//                 triggerFunction( settings.onStart, this, [ $holder ] )
//             },
//             onRender: function( $holder ) {

//                 var picker = this

//                 $holder.find( '.' + settings.klass.selectMonth ).on( 'change', function() {
//                     picker.set( 'view', [ calendar.props.get( 'view' ).YEAR, this.value, calendar.props.get( 'highlight' ).DATE ] )
//                     $holder.find( '.' + settings.klass.selectMonth ).focus()
//                 })

//                 $holder.find( '.' + settings.klass.selectYear ).on( 'change', function() {
//                     picker.set( 'view', [ this.value, calendar.props.get( 'view' ).MONTH, calendar.props.get( 'highlight' ).DATE ] )
//                     $holder.find( '.' + settings.klass.selectYear ).focus()
//                 })

//                 triggerFunction( settings.onRender, picker, [ $holder ] )
//             }
//         })

//     } //CalendarPicker


//     /**
//      * Create a date object by validating it can be "reached".
//      */
//     CalendarPicker.prototype.validate = function( datePassed, keyMovement ) {

//         var calendar = this,
//             minLimitObject = calendar.props.get( 'min' ),
//             maxLimitObject = calendar.props.get( 'max' ),

//             // Make sure we have a date object to work with.
//             datePassedObject = datePassed && !isNaN( datePassed.TIME ) ? datePassed : calendar.create( datePassed )

//         // If we passed the lower bound, set the key movement upwards,
//         // flip our "reached min" flag, and set the date to the lower bound.
//         if ( datePassedObject.TIME < minLimitObject.TIME ) {
//             keyMovement = 1
//             calendar.doneMin = 1
//             datePassedObject = minLimitObject
//         }

//         // Otherwise if we passed the upper bound, set the key movement downwards,
//         // flip our "reached max" flag, and set the date to the upper bound.
//         else if ( datePassedObject.TIME > maxLimitObject.TIME ) {
//             keyMovement = -1
//             calendar.doneMax = 1
//             datePassedObject = maxLimitObject
//         }

//         // If we've hit the upper and lower bounds, set the date to now and move on.
//         if ( calendar.doneMin && calendar.doneMax ) {
//             datePassedObject = calendar.props.get( 'now' )
//         }

//         // Otherwise if there are dates to disable and this is one of them,
//         // shift using the interval until we reach an enabled date.
//         else if ( calendar.props.disable.length && calendar.disable( datePassedObject ) ) {
//             datePassedObject = calendar.shift( datePassedObject, datePassedObject.TIME > maxLimitObject.TIME ? -1 : keyMovement || 1 )
//         }

//         // Reset the check for if we reached the min and max bounds.
//         calendar.doneMin = undefined
//         calendar.doneMax = undefined

//         return datePassedObject
//     } //CalendarPicker.prototype.validate


//     /**
//      * Check if a date is disabled or not.
//      */
//     CalendarPicker.prototype.disable = function( collection, dateObject ) {

//         var calendar = this,

//             // Filter through the disabled dates to check if this is one.
//             isDisabledDate = collection.filter( function( dateToDisable ) {

//                 // If the date is a number, match the weekday with 0index and `firstDay` check.
//                 if ( !isNaN( dateToDisable ) ) {
//                     return dateObject.DAY == ( calendar.settings.firstDay ? dateToDisable : dateToDisable - 1 ) % 7
//                 }

//                 // If it's an array, create the object and match the times.
//                 if ( Array.isArray( dateToDisable ) ) {
//                     return dateObject.TIME == calendar.create( dateToDisable ).TIME
//                 }
//             }).length

//         // If the calendar is flipped, flip the condition.
//         return calendar.props.get( 'flip' ) ? !isDisabledDate : isDisabledDate
//     } // CalendarPicker.prototype.disable


//     /**
//      * Shift a date by a certain interval until we reach an enabled one.
//      */
//     CalendarPicker.prototype.shift = function( dateObject, keyMovement ) {

//         var calendar = this,
//             originalDateObject = dateObject

//         // Keep looping as long as the date is disabled.
//         while ( calendar.disable( dateObject ) ) {

//             // Increase/decrease the date by the key movement and keep looping.
//             dateObject = calendar.create([ dateObject.YEAR, dateObject.MONTH, dateObject.DATE + ( keyMovement || 1 ) ])

//             // If we've looped through to the next month, break out of the loop.
//             if ( dateObject.MONTH != originalDateObject.MONTH ) {
//                 break
//             }
//         }

//         // Do a final validation check to make sure it's within bounds.
//         return calendar.validate( dateObject, keyMovement )
//     } //CalendarPicker.prototype.shift


//     /**
//      * Move to another month
//      */
//     CalendarPicker.prototype.move = function( datePassed, monthChange ) {
//         return this.create([ datePassed.YEAR, datePassed.MONTH + monthChange, datePassed.DATE ])
//     } //CalendarPicker.prototype.move


//     // /**
//     //  * Create the lower bounding date object.
//     //  */
//     // CalendarPicker.prototype.min = function() {

//     //     var
//     //         calendar = this,
//     //         limit = calendar.SETTINGS.min,
//     //         nowObject = calendar.object()

//     //     // If the limit is set to true, just return today.
//     //     if ( limit === true ) {
//     //         return nowObject
//     //     }

//     //     // If there is a limit and its a number, create a
//     //     // time object relative to today by adding the limit.
//     //     if ( limit && !isNaN( limit ) ) {
//     //         return calendar.object([ nowObject.YEAR, nowObject.MONTH, nowObject.DATE + limit ])
//     //     }

//     //     // If the limit is an array, construct the time object.
//     //     if ( Array.isArray( limit ) ) {
//     //         return calendar.object( limit )
//     //     }

//     //     // Otherwise create an infinite time.
//     //     return calendar.object( 0, -Infinity )
//     // }


//     // /**
//     //  * Create the upper bounding date object.
//     //  */
//     // CalendarPicker.prototype.max = function() {

//     //     var
//     //         calendar = this,
//     //         limit = calendar.SETTINGS.max,
//     //         nowObject = calendar.object()

//     //     // If the limit is set to true, just return today.
//     //     if ( limit === true ) {
//     //         return nowObject
//     //     }

//     //     // If there is a limit and its a number, create a
//     //     // time object relative to today by adding the limit.
//     //     if ( limit && !isNaN( limit ) ) {
//     //         return calendar.object([ nowObject.YEAR, nowObject.MONTH, nowObject.DATE + limit ])
//     //     }

//     //     // If the limit is an array, construct the time object.
//     //     if ( Array.isArray( limit ) ) {
//     //         return calendar.object( limit )
//     //     }

//     //     // Otherwise create an infinite time.
//     //     return calendar.object( 0, Infinity )
//     // }


//     /**
//      * Create a time object from a format.
//      */
//     CalendarPicker.prototype.parse = function( format, string ) {

//         if ( !format ) throw "Need a format"

//         var
//             calendar = this,
//             parsingObject = {},
//             formattings = calendar.formats

//         // Convert the format into an array and then map through it.
//         formattings.toArray( format ).map( function( label ) {

//             var
//                 // Grab the formatting label.
//                 formattingLabel = formattings[ label ],

//                 // The format length is from the formatting label function or the
//                 // label length without the escaping exclamation (!) mark.
//                 formatLength = formattingLabel ? triggerFunction( formattingLabel, calendar, [ string, parsingObject ] ) : label.replace( /^!/, '' ).length

//             // If there's a format label, split the string up to the format length.
//             // Then add it to the parsing object with appropriate label.
//             if ( formattingLabel ) {
//                 parsingObject[ label ] = string.substr( 0, formatLength )
//             }

//             // Update the time string as the substring from format length to end.
//             string = string.substr( formatLength )
//         })

//         return calendar.create([ parsingObject.yyyy || parsingObject.yy, parsingObject.mm || parsingObject.m, parsingObject.dd || parsingObject.d ])
//     } //CalendarPicker.prototype.parse



