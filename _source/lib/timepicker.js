
/*jshint
   debug: true,
   devel: true,
   browser: true,
   asi: true,
   unused: true,
   boss: true
 */


/* ==========================================================================
   Build time picker components
   ========================================================================== */

/**
 * Globals and constants
 */
var HOURS_IN_DAY = 24,
    MINUTES_IN_HOUR = 60,
    HOURS_TO_NOON = 12,
    MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR



/**
 * The time picker constructor
 */
function TimePicker( picker, settings ) {

    var clock = this,
        elementDataValue = picker.$node.data( 'value' )

    clock.settings = settings

    // The queue of methods that will be used to build item objects.
    clock.queue = {
        interval: 'i',
        min: 'measure create',
        max: 'measure create',
        now: 'now create',
        select: 'parse create validate',
        highlight: 'create validate',
        view: 'create validate',
        disable: 'flipItem',
        enable: 'flipItem',
        flip: 'flipAll'
    }

    // The component's item object.
    clock.item = {}

    clock.item.interval = settings.interval || 30
    clock.item.disable = ( settings.disable || [] ).slice( 0 )
    clock.item.enable = -(function( collectionDisabled ) {
        return collectionDisabled[ 0 ] === true ? collectionDisabled.shift() : -1
    })( clock.item.disable )

    clock.
        set( 'min', settings.min || [ 0, 0 ] ).
        set( 'max', settings.max || [ HOURS_IN_DAY - 1, MINUTES_IN_HOUR - 1 ] ).
        set( 'now' ).
        set( 'select',

            // If there's a `value` or `data-value`, use that with formatting.
            // Otherwise default to the minimum selectable time.
            elementDataValue || picker.$node[ 0 ].value || clock.item.min,

            // Use the relevant format.
            { format: elementDataValue ? settings.formatSubmit : settings.format }
        ).

        // Setting the `highlight` also sets the `view`.
        set( 'highlight', clock.item.select )

    /**
     * The keycode to movement mapping.
     */
    clock.key = {
        40: 1, // Down
        38: -1, // Up
        39: 1, // Right
        37: -1, // Left
        go: function( timeChange ) {
            clock.set( 'highlight', clock.item.highlight.PICK + timeChange * clock.item.interval, { interval: timeChange * clock.item.interval } )
            this.render()
        }
    }


    /**
     * The time picker events.
     */
    clock.onRender = function( $holder ) {
        var $viewset = $holder.find( '.' + settings.klass.viewset )
        if ( $viewset.length ) {
            $holder[ 0 ].scrollTop = $viewset.position().top - ~~( $holder[ 0 ].clientHeight / 4 )
        }
        else {
            console.warn( 'Nothing to viewset with', clock.item.view )
        }
    }
    clock.onOpen = function( $holder ) {
        $holder.find( 'button' ).attr( 'disable', false )
    }
    clock.onClose = function( $holder ) {
        $holder.find( 'button' ).attr( 'disable', true )
    }

} //TimePicker


/**
 * Set a timepicker item object.
 */
TimePicker.prototype.set = function( type, value, options ) {

    var clock = this

    // Go through the queue of methods, and invoke the function. Update this
    // as the time unit, and set the final resultant as this item type.
    // * In the case of `enable`, keep the queue but set `disable` instead.
    //   And in the case of `flip`, keep the queue but set `enable` instead.
    clock.item[ ( type == 'enable' ? 'disable' : type == 'flip' ? 'enable' : type ) ] = clock.queue[ type ].split( ' ' ).map( function( method ) {
        return value = clock[ method ]( type, value, options )
    }).pop()

    // Check if we need to cascade through more updates.
    if ( type == 'highlight' ) {
        clock.set( 'view', clock.item.highlight, options )
    }
    else if ( type == 'interval' ) {
        clock.
            set( 'min', clock.item.min, options ).
            set( 'max', clock.item.max, options )
    }
    else if ( ( type == 'flip' || type == 'min' || type == 'max' || type == 'disable' || type == 'enable' ) && clock.item.select && clock.item.highlight ) {
        if ( type == 'min' ) {
            clock.set( 'max', clock.item.max, options )
        }
        clock.
            set( 'select', clock.item.select, options ).
            set( 'highlight', clock.item.highlight, options )
    }

    return clock
} //TimePicker.prototype.set


/**
 * Get a timepicker item object.
 */
TimePicker.prototype.get = function( type ) {
    return this.item[ type ]
} //TimePicker.prototype.get


/**
 * Create a picker time object.
 */
TimePicker.prototype.create = function( type, value, options ) {

    var clock = this

    // If there's no value, use the type as the value.
    value = value === undefined ? type : value

    // If it's an object, use the "pick" value.
    if ( isObject( value ) && isInteger( value.PICK ) ) {
        value = value.PICK
    }

    // If it's an array, convert it into minutes.
    else if ( Array.isArray( value ) ) {
        value = +value[ 0 ] * MINUTES_IN_HOUR + (+value[ 1 ])
    }

    // If no valid value is passed, set it to "now".
    else if ( !isInteger( value ) ) {
        value = clock.now( type, value, options )
    }

    // If we're setting the max, make sure it's greater than the min.
    if ( type == 'max' && value < clock.item.min.PICK ) {
        value += MINUTES_IN_DAY
    }

    // Normalize it into a "reachable" interval.
    value = clock.normalize( value, options )

    // Return the compiled object.
    return {

        // Divide to get hours from minutes.
        HOUR: ~~( HOURS_IN_DAY + value / MINUTES_IN_HOUR ) % HOURS_IN_DAY,

        // The remainder is the minutes.
        MINS: ( MINUTES_IN_HOUR + value % MINUTES_IN_HOUR ) % MINUTES_IN_HOUR,

        // The time in total minutes.
        TIME: ( MINUTES_IN_DAY + value ) % MINUTES_IN_DAY,

        // Reference to the "relative" value to pick.
        PICK: value
    }
} //TimePicker.prototype.create


/**
 * Get the time relative to now.
 */
TimePicker.prototype.now = function( type, value/*, options*/ ) {
    var date = new Date()
    // Add an interval because the time has passed.
    return ( ( isInteger( value ) ? value + 1 : 1 ) * this.item.interval ) + date.getHours() * MINUTES_IN_HOUR + date.getMinutes()
} //TimePicker.prototype.now


/**
 * Normalize minutes or an object to be "reachable" based on the interval.
 */
TimePicker.prototype.normalize = function( value/*, options*/ ) {
    // If it's a negative value, add one interval to keep it as "passed".
    return value - ( ( value < 0 ? this.item.interval : 0 ) + value % this.item.interval )
} //TimePicker.prototype.normalize


/**
 * Measure the range of minutes.
 */
TimePicker.prototype.measure = function( type, value, options ) {

    var clock = this

    // If it's an integer, we need to make it relative to now.
    if ( isInteger( value ) ) {
        value = clock.now( type, value, options )
    }

    // If it's a literal true, return the time right now.
    else if ( value === true ) {
        value = clock.now( type, value, options )
    }

    // If it's an object already, just normalize it.
    else if ( isObject( value ) && isInteger( value.PICK ) ) {
        value = clock.normalize( value.PICK, options )
    }

    return value
} ///TimePicker.prototype.measure


/**
 * Validate an object as enabled.
 */
TimePicker.prototype.validate = function( type, timeObject, options ) {

    var clock = this,
        interval = options && options.interval ? options.interval : clock.item.interval

    // Check if the object is disabled.
    if ( clock.disabled( timeObject ) ) {

        // Shift with the interval until we reach an enabled time.
        timeObject = clock.shift( timeObject, interval )
    }

    // Scope the object into range.
    timeObject = clock.scope( timeObject )

    // Do a second check to see if we landed on a disabled min/max.
    // In that case, shift using the opposite interval as before.
    if ( clock.disabled( timeObject ) ) {
        timeObject = clock.shift( timeObject, interval * -1 )
    }

    // Return the final object.
    return timeObject
} //TimePicker.prototype.validate


/**
 * Check if an object is disabled.
 */
TimePicker.prototype.disabled = function( timeObject ) {

    var
        clock = this,

        // Filter through the disabled times to check if this is one.
        isDisabledTime = clock.item.disable.filter( function( timeToDisable ) {

            // If the time is a number, match the hours.
            if ( isInteger( timeToDisable ) ) {
                return timeObject.HOUR == timeToDisable
            }

            // If it's an array, create the object and match the times.
            if ( Array.isArray( timeToDisable ) ) {
                return timeObject.PICK == clock.create( timeToDisable ).PICK
            }
        }).length

    // If the clock is "enabled" flag is flipped, flip the condition.
    return clock.item.enable === -1 ? !isDisabledTime : isDisabledTime
} //TimePicker.prototype.disabled


/**
 * Shift an object by an interval until we reach an enabled object.
 */
TimePicker.prototype.shift = function( timeObject, interval ) {

    var
        clock = this

    // Keep looping as long as the time is disabled.
    while ( clock.disabled( timeObject ) ) {

        // Increase/decrease the time by the interval and keep looping.
        timeObject = clock.create( timeObject.PICK += interval || clock.item.interval )

        // If we've looped beyond the limits, break out of the loop.
        if ( timeObject.PICK <= clock.item.min.PICK || timeObject.PICK >= clock.item.max.PICK ) {
            break
        }
    }

    // Return the final object.
    return timeObject
} //TimePicker.prototype.shift


/**
 * Scope an object to be within range of min and max.
 */
TimePicker.prototype.scope = function( timeObject ) {
    var minLimit = this.item.min.PICK,
        maxLimit = this.item.max.PICK
    return this.create( timeObject.PICK > maxLimit ? maxLimit : timeObject.PICK < minLimit ? minLimit : timeObject )
} //TimePicker.prototype.scope


/**
 * Parse a string into a usable type.
 */
TimePicker.prototype.parse = function( type, value, options ) {

    var
        clock = this,
        parsingObject = {}

    if ( !value || isInteger( value ) || Array.isArray( value ) || isDate( value ) || isObject( value ) && isInteger( value.PICK ) ) {
        return value
    }

    // We need a `.format` to parse the value.
    if ( !( options && options.format ) ) {
        throw "Need a formatting option to parse this.."
    }

    // Convert the format into an array and then map through it.
    clock.formats.toArray( options.format ).map( function( label ) {

        var
            // Grab the formatting label.
            formattingLabel = clock.formats[ label ],

            // The format length is from the formatting label function or the
            // label length without the escaping exclamation (!) mark.
            formatLength = formattingLabel ? triggerFunction( formattingLabel, clock, [ value, parsingObject ] ) : label.replace( /^!/, '' ).length

        // If there's a format label, split the value up to the format length.
        // Then add it to the parsing object with appropriate label.
        if ( formattingLabel ) {
            parsingObject[ label ] = value.substr( 0, formatLength )
        }

        // Update the time value as the substring from format length to end.
        value = value.substr( formatLength )
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
TimePicker.prototype.flipItem = function( type, value/*, options*/ ) {

    var clock = this,
        collection = clock.item.disable,
        isFlipped = clock.item.enable === -1

    if ( !isFlipped && type == 'enable' || isFlipped && type == 'disable' ) {
        collection = clock.removeDisabled( collection, value )
    }
    else if ( !isFlipped && type == 'disable' || isFlipped && type == 'enable' ) {
        collection = clock.addDisabled( collection, value )
    }

    return collection
} //TimePicker.prototype.flipItem


/**
 * Flip all items as disabled or enabled.
 */
TimePicker.prototype.flipAll = function( type, value/*, options*/ ) {
    return value === false ? 1 : -1
}


/**
 * Add an item to the disabled collection.
 */
TimePicker.prototype.addDisabled = function( collection, item ) {
    var clock = this
    item.map( function( timeUnit ) {
        if ( !clock.filterDisabled( collection, timeUnit ).length ) {
            collection.push( timeUnit )
        }
    })
    return collection
} //TimePicker.prototype.addDisabled


/**
 * Remove an item from the disabled collection.
 */
TimePicker.prototype.removeDisabled = function( collection, item ) {
    var clock = this
    item.map( function( timeUnit ) {
        collection = clock.filterDisabled( collection, timeUnit, 1 )
    })
    return collection
} //TimePicker.prototype.removeDisabled


/**
 * Filter through the disabled collection to find a time unit.
 */
TimePicker.prototype.filterDisabled = function( collection, timeUnit, isRemoving ) {
    var timeIsArray = Array.isArray( timeUnit )
    return collection.filter( function( disabledTimeUnit ) {
        var isMatch = !timeIsArray && timeUnit === disabledTimeUnit ||
            timeIsArray && Array.isArray( disabledTimeUnit ) && timeUnit.toString() === disabledTimeUnit.toString()
        return isRemoving ? !isMatch : isMatch
    })
} //TimePicker.prototype.filterDisabled


/**
 * The division to use for the range intervals.
 */
TimePicker.prototype.i = function( type, value/*, options*/ ) {
    return isInteger( value ) && value > 0 ? value : this.item.interval
}


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
        i: clock.item.interval,
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
    }) + createNode( 'li', createNode( 'button', settings.clear, settings.klass.buttonClear, 'data-clear=1' + ( isOpen ? '' : ' disabled' ) ) ), settings.klass.list )
} //TimePicker.prototype.nodes

