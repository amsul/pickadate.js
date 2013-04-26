/*!
 * pickadate.js v3.0.0alpha, 2013-04-26
 * By Amsul (http://amsul.ca)
 * Hosted on http://amsul.github.io/pickadate.js
 * Licensed under MIT
 */

(function( $, document, undefined ) {"use strict";
/*jshint
   debug: true,
   devel: true,
   browser: true,
   asi: true,
   unused: true,
   boss: true,
   eqnull: true
 */


/* ==========================================================================
   The picker base
   ========================================================================== */

var STRING_PREFIX_PICKER = 'pickadate__',
    $DOCUMENT = $( document ),


/**
 * The picker constructor that creates a new date or time picker
 */
Picker = function( $ELEMENT, SETTINGS, COMPONENT ) {

    var
        // The state of the picker.
        STATE = {
            id: Math.abs( ~~( Math.random() * 1e9 ) )
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

                // Update the picker state.
                STATE.start = true
                STATE.open = false
                STATE.type = ELEMENT.type


                // Confirm focus state, save original type, convert into text input
                // to remove UA stylings, and set as readonly to prevent keyboard popup.
                ELEMENT.autofocus = ELEMENT == document.activeElement
                ELEMENT.type = 'text'
                ELEMENT.readOnly = true


                // Create a new picker component with the settings and default value/format combo.
                P.component = new COMPONENT( P, SETTINGS )


                // Create the picker holder with a new wrapped component and bind the events.
                P.$holder = $( createNode( 'div', createWrappedComponent(), CLASSES.holder ) ).on({

                    // When something within the holder is focused, make it appear so.
                    focusin: function( event ) {

                        // Remove the input “focused” state from the holder.
                        P.$holder.removeClass( CLASSES.focused )

                        // Prevent the event from propagating to the doc.
                        event.stopPropagation()
                    },

                    // If the event is not on the holder itself, stop it from bubbling to the doc.
                    mousedown: function( event ) {
                        if ( event.target != P.$holder[ 0 ] ) {
                            event.stopPropagation()
                        }
                    },

                    // When something within the holder is clicked, handle the various event.
                    click: function( event ) {

                        var target = event.target,
                            $target = $( target ),
                            targetData = $target.data()

                        // If the event is not on the holder itself, handle the clicks within.
                        if ( target != P.$holder[ 0 ] ) {

                            // Stop it from propagating to the doc.
                            event.stopPropagation()

                            // If nothing inside is actively focused and the picker is open, re-focus the element.
                            if ( !P.$holder.find( document.activeElement ).length && STATE.open ) {
                                ELEMENT.focus()
                            }

                            // If something is superficially changed, update the `highlight` based on the `nav`.
                            if ( targetData.nav && !$target.hasClass( CLASSES.navDisabled ) ) {
                                P.set( 'highlight', P.component.item.highlight, { nav: targetData.nav } )
                            }

                            // If something is picked, set `select` and `highlight`, then close with focus.
                            else if ( isInteger( targetData.pick ) && !$target.hasClass( CLASSES.disabled ) ) {
                                P.set({ select: targetData.pick, highlight: targetData.pick }).close( true )
                            }

                            // If a “clear” button is pressed, empty the values and close with focus.
                            else if ( targetData.clear ) {
                                P.clear().close( true )
                            }
                        }
                    }
                }) //P.$holder


                // If there’s a format for the hidden input element, create the element
                // using the name of the original input plus suffix. Otherwise set it to null.
                P._hidden = SETTINGS.formatSubmit ? $( '<input type=hidden name=' + ELEMENT.name + ( SETTINGS.hiddenSuffix || '_submit' ) + ( ELEMENT.value || $ELEMENT.data( 'value' ) ? ' value="' + triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.formatSubmit, P.component.item.select ] ) : '' ) + '">' )[ 0 ] : undefined


                // Bind the events on the `input` element and then
                // insert the holder and hidden element after the element.
                $ELEMENT.on( 'focus.P' + STATE.id + ' click.P' + STATE.id, function() {

                    // Open the calendar.
                    P.open()

                    // Add the input “focused” state onto the holder.
                    P.$holder.addClass( CLASSES.focused )

                }).on( 'change.P' + STATE.id, function() {

                    // If there's a hidden input, update the value with the correct format.
                    if ( P._hidden ) {
                        P._hidden.value = ELEMENT.value ? triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.formatSubmit, P.component.item.select ] ) : ''
                    }

                }).on( 'keydown.P' + STATE.id, function( event ) {

                    var
                        // Grab the keycode
                        keycode = event.keyCode,

                        // Check if one of the delete keys was pressed
                        isKeycodeDelete = keycode == 8 || keycode == 46

                    // Check if `space` or `delete` was pressed or the calendar is closed with a key movement.
                    if ( keycode == 32 || isKeycodeDelete || !STATE.open && P.component.key[ keycode ] ) {

                        // Prevent it from moving the page.
                        event.preventDefault()

                        // Prevent it from bubbling to doc.
                        event.stopPropagation()

                        // If `delete` was pressed, clear the values and close the picker.
                        if ( isKeycodeDelete ) {
                            P.clear().close()
                        }

                        // Otherwise open the calendar.
                        else {
                            P.open()
                        }
                    }

                }).after([ P.$holder, P._hidden ])


                // Trigger the component “start” event within scope of the picker.
                triggerFunction( P.component.onStart, P )

                // Trigger the settings “start” event within scope of the picker.
                triggerFunction( SETTINGS.onStart, P )

                // Trigger the component “render” event within scope of the picker.
                triggerFunction( P.component.onRender, P )

                // Trigger the settings “render” event within scope of the picker.
                triggerFunction( SETTINGS.onRender, P )

                // If the element has autofocus, open the calendar.
                if ( ELEMENT.autofocus ) {
                    P.open()
                }

                return P
            }, //start


            /**
             * Render a new picker within the holder
             */
            render: function() {

                // Insert a new component in the holder.
                P.$holder.html( createWrappedComponent() )

                // Trigger the component “render” event within scope of the picker.
                triggerFunction( P.component.onRender, P )

                // Trigger the settings “render” event within scope of the picker.
                triggerFunction( SETTINGS.onRender, P )

                return P
            }, //render


            /**
             * Destroy everything
             */
            stop: function() {

                // Update the picker state.
                STATE.start = false

                // Cache the stop event for a bit.
                var stopEvent = P.component.onStop

                // Then close the picker.
                P.close()

                // Unbind the events on the `input` element.
                $ELEMENT.off( '.P' + STATE.id )

                // Restore the element state
                ELEMENT.type = STATE.type
                ELEMENT.readOnly = false

                // Remove the hidden field.
                if ( P._hidden ) {
                    P._hidden.parentNode.removeChild( P._hidden )
                }

                // Remove the holder.
                P.$holder.remove()

                // Reset the component object.
                P.component = undefined

                // Trigger the component “stop” event within scope of the picker.
                triggerFunction( stopEvent, P )

                // Trigger the settings “stop” event within scope of the picker.
                triggerFunction( SETTINGS.onStop, P )

                return P
            }, //stop


            /**
             * Open up the picker
             */
            open: function() {

                // If it’s already open, do nothing.
                if ( STATE.open ) return P

                // Set it as open.
                STATE.open = true

                // Make sure the element has focus then add the “active” class.
                $ELEMENT.focus().addClass( CLASSES.inputActive )

                // Add the “opened” class to the picker holder.
                P.$holder.addClass( CLASSES.opened )

                // Bind the document events.
                $DOCUMENT.on( 'click.P' + STATE.id + ' focusin.P' + STATE.id, function( event ) {

                    // If the target of the event is not the element, close the picker picker.
                    // * Don’t worry about clicks or focusins on the holder because those don’t bubble up.
                    //   Also, for Firefox, a click on an `option` element bubbles up directly
                    //   to the doc. So make sure the target wasn't the doc.
                    if ( event.target != ELEMENT && event.target != document ) P.close()

                }).on( 'keydown.P' + STATE.id, function( event ) {

                    var
                        // Get the keycode.
                        keycode = event.keyCode,

                        // Translate that to a selection change.
                        keycodeToMove = P.component.key[ keycode ],

                        // Grab the target.
                        target = event.target


                    // On escape, close the picker and give focus.
                    if ( keycode == 27 ) {
                        P.close( true )
                    }


                    // Check if there is a key movement or “enter” keypress on the element.
                    else if ( target == ELEMENT && ( keycodeToMove || keycode == 13 ) ) {

                        // Prevent the default action to stop page movement.
                        event.preventDefault()

                        // Trigger the key movement action.
                        if ( keycodeToMove ) {
                            triggerFunction( P.component.key.go, P, [ keycodeToMove ] )
                        }

                        // Or on “enter”, select the highlighted date and close.
                        else {
                            P.set( 'select', P.component.item.highlight ).close()
                        }
                    }


                    // If the target is within the holder and “enter” is pressed,
                    // prevent the default action and trigger a click on the target instead.
                    else if ( P.$holder.find( target ).length && keycode == 13 ) {
                        event.preventDefault()
                        target.click()
                    }
                })

                // Trigger the component “open” event within scope of the picker.
                triggerFunction( P.component.onOpen, P )

                // Trigger the settings “open” event within scope of the picker.
                triggerFunction( SETTINGS.onOpen, P )

                return P
            }, //open


            /**
             * Close the picker
             */
            close: function( giveFocus ) {

                // If we need to give focus, do it before changing states.
                if ( giveFocus ) ELEMENT.focus()

                // If it’s already closed, do nothing.
                if ( !STATE.open ) return P

                // Set it as closed.
                STATE.open = false

                // Remove the “active” class.
                $ELEMENT.removeClass( CLASSES.inputActive )

                // Remove the “opened” class from the picker holder.
                P.$holder.removeClass( CLASSES.opened )

                // Bind the document events.
                $DOCUMENT.off( '.P' + STATE.id )

                // Trigger the component “close’ event within scope of the picker.
                triggerFunction( P.component.onClose, P )

                // Trigger the settings “close” event within scope of the picker.
                triggerFunction( SETTINGS.onClose, P )

                return P
            }, //close


            /**
             * Clear the values
             */
            clear: function() {
                return P.set( 'clear' )
            }, //clear


            /**
             * Set something
             */
            set: function( thing, value, options ) {

                var thingItem, thingValue,
                    thingIsObject = isObject( thing ),
                    thingObject = thingIsObject ? thing : {}

                if ( thing ) {

                    // If the thing isn’t an object, make it one.
                    if ( !thingIsObject ) {
                        thingObject[ thing ] = value
                    }

                    // Go through the things of items to set.
                    for ( thingItem in thingObject ) {

                        // Grab the value of the thing.
                        thingValue = thingObject[ thingItem ]

                        // First, if the item exists and there’s a value, set it.
                        if ( P.component.item[ thingItem ] ) {
                            P.component.set( thingItem, thingValue, options || {} )
                        }

                        // Then, check to update the element value and broadcast a change.
                        if ( thingItem == 'select' || thingItem == 'clear' ) {
                            $ELEMENT.val( thingItem == 'clear' ? '' :
                                triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.format, P.component.get( thingItem ) ] )
                            ).trigger( 'change' )
                        }
                    }

                    // Render a new picker.
                    P.render()
                }

                // Trigger the component “set” event within scope of the picker.
                triggerFunction( P.component.onSet, P )

                // Trigger the settings “set” event within scope of the picker.
                triggerFunction( SETTINGS.onSet, P, [ thingObject ] )

                return P
            }, //set


            /**
             * Get something
             */
            get: function( thing, format ) {

                // Make sure there's something to get.
                thing = thing || 'value'

                // If a picker state exists, return that.
                if ( STATE[ thing ] != null ) {
                    return STATE[ thing ]
                }

                // Return the value, if that.
                if ( thing == 'value' ) {
                    return ELEMENT.value
                }

                // Check if a component item exists, return that.
                if ( P.component.item[ thing ] ) {
                    if ( typeof format == 'string' ) {
                        return triggerFunction( P.component.formats.toString, P.component, [ format, P.component.get( thing ) ] )
                    }
                    return P.component.get( thing )
                }
            } //get
        } //PickerInstance.prototype


    /**
     * Wrap the picker components together.
     */
    function createWrappedComponent() {

        // Create a picker wrapper node
        return createNode( 'div',

            // Create a picker frame
            createNode( 'div',

                // Create a picker box node
                createNode( 'div',

                    // Create the components nodes.
                    P.component.nodes( STATE.open ),

                    // The picker box class
                    CLASSES.box
                ),

                // Picker wrap class
                CLASSES.wrap
            ),

            // Picker frame class
            CLASSES.frame
        ) //endreturn
    } //createWrappedComponent


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
 * Trigger a function otherwise return the value.
 */
function triggerFunction( callback, scope, args ) {
    return typeof callback == 'function' ? callback.apply( scope, args || [] ) : callback
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
function isObject( value ) {
    return {}.toString.call( value ).indexOf( 'Object' ) > -1
}


/**
 * Tell if something is a date object.
 */
function isDate( value ) {
    return {}.toString.call( value ).indexOf( 'Date' ) > -1
}


/**
 * Tell if something is an integer.
 */
function isInteger( value ) {
    return {}.toString.call( value ).indexOf( 'Number' ) > -1 && value % 1 === 0
}



/**
 * Extend jQuery with a picker type and defaults
 */
function jQueryExtend( Component, name, defaults ) {

    // Extend jQuery
    $.fn[ name ] = function( options, action ) {

        var
            // Merge the options and defaults with a deep copy.
            settings = $.extend( true, {}, $.fn[ name ].defaults, options ),

            // Grab the picker data if that.
            thisPickerData = this.data( name )

        // If it's already invoked and `options` is a string, carry out the action.
        if ( thisPickerData && typeof options == 'string' ) {
            return options == 'picker' ? thisPickerData : triggerFunction( thisPickerData[ options ], thisPickerData, [ action ] )
        }

        // Otherwise look through each one of the matched elements
        // and if it doesn't have any picker data, create and link one.
        return this.each( function() {
            var $this = $( this )
            if ( !$this.data( name ) ) {
                $this.data( name, new Picker( $this, settings, Component ) )
            }
        })
    }

    // Set the defaults
    $.fn[ name ].defaults = defaults
} //jQueryExtend




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
        enable: 'flipItem'
    }

    // The component's item object.
    clock.item = {}

    clock.item.interval = settings.interval || 30
    clock.item.disable = ( settings.disable || [] ).slice( 0 )
    clock.item.enable = -(function( collectionDisabled ) {
        return collectionDisabled[ 0 ] === true ? collectionDisabled.shift() : -1
    })( clock.item.disable )

    clock.
        set( 'min', settings.min ).
        set( 'max', settings.max ).
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
            clock.set( 'highlight', clock.item.highlight.pick + timeChange * clock.item.interval, { interval: timeChange * clock.item.interval } )
            this.render()
        }
    }


    /**
     * The time picker events.
     */
    clock.onRender = function() {
        var $holder = this.$holder,
            $viewset = $holder.find( '.' + settings.klass.viewset )
        if ( $viewset.length ) {
            $holder[ 0 ].scrollTop = $viewset.position().top - ~~( $holder[ 0 ].clientHeight / 4 )
        }
        else {
            console.warn( 'Nothing to viewset with', clock.item.view )
        }
    }
    clock.onOpen = function() {
        this.$holder.find( 'button' ).attr( 'disable', false )
    }
    clock.onClose = function() {
        this.$holder.find( 'button' ).attr( 'disable', true )
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
    if ( isObject( value ) && isInteger( value.pick ) ) {
        value = value.pick
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
    if ( type == 'max' && value < clock.item.min.pick ) {
        value += MINUTES_IN_DAY
    }

    // Normalize it into a "reachable" interval.
    value = clock.normalize( value, options )

    // Return the compiled object.
    return {

        // Divide to get hours from minutes.
        hour: ~~( HOURS_IN_DAY + value / MINUTES_IN_HOUR ) % HOURS_IN_DAY,

        // The remainder is the minutes.
        mins: ( MINUTES_IN_HOUR + value % MINUTES_IN_HOUR ) % MINUTES_IN_HOUR,

        // The time in total minutes.
        time: ( MINUTES_IN_DAY + value ) % MINUTES_IN_DAY,

        // Reference to the "relative" value to pick.
        pick: value
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

    // If it's anything false-y, set it to the default.
    if ( !value ) {
        value = type == 'min' ? [ 0, 0 ] : [ HOURS_IN_DAY - 1, MINUTES_IN_HOUR - 1 ]
    }

    // If it's a literal true, or an integer, make it relative to now.
    else if ( value === true || isInteger( value ) ) {
        value = clock.now( type, value, options )
    }

    // If it's an object already, just normalize it.
    else if ( isObject( value ) && isInteger( value.pick ) ) {
        value = clock.normalize( value.pick, options )
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
                return timeObject.hour == timeToDisable
            }

            // If it's an array, create the object and match the times.
            if ( Array.isArray( timeToDisable ) ) {
                return timeObject.pick == clock.create( timeToDisable ).pick
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
        timeObject = clock.create( timeObject.pick += interval || clock.item.interval )

        // If we've looped beyond the limits, break out of the loop.
        if ( timeObject.pick <= clock.item.min.pick || timeObject.pick >= clock.item.max.pick ) {
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
    var minLimit = this.item.min.pick,
        maxLimit = this.item.max.pick
    return this.create( timeObject.pick > maxLimit ? maxLimit : timeObject.pick < minLimit ? minLimit : timeObject )
} //TimePicker.prototype.scope


/**
 * Parse a string into a usable type.
 */
TimePicker.prototype.parse = function( type, value, options ) {

    var
        clock = this,
        parsingObject = {}

    if ( !value || isInteger( value ) || Array.isArray( value ) || isDate( value ) || isObject( value ) && isInteger( value.pick ) ) {
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
        return string ? getDigitsLength( string ) : timeObject.hour % HOURS_TO_NOON || HOURS_TO_NOON
    },
    hh: function( string, timeObject ) {

        // If there's a string, then the length is always 2.
        // Otherwise return the selected hour in "standard" format with a leading zero.
        return string ? 2 : leadZero( timeObject.hour % HOURS_TO_NOON || HOURS_TO_NOON )
    },
    H: function( string, timeObject ) {

        // If there's string, then get the digits length.
        // Otherwise return the selected hour in "military" format as a string.
        return string ? getDigitsLength( string ) : '' + timeObject.hour
    },
    HH: function( string, timeObject ) {

        // If there's string, then get the digits length.
        // Otherwise return the selected hour in "military" format with a leading zero.
        return string ? getDigitsLength( string ) : leadZero( timeObject.hour )
    },
    i: function( string, timeObject ) {

        // If there's a string, then the length is always 2.
        // Otherwise return the selected minutes.
        return string ? 2 : leadZero( timeObject.mins )
    },
    a: function( string, timeObject ) {

        // If there's a string, then the length is always 4.
        // Otherwise check if it's more than "noon" and return either am/pm.
        return string ? 4 : MINUTES_IN_DAY / 2 > timeObject.time % MINUTES_IN_DAY ? 'a.m.' : 'p.m.'
    },
    A: function( string, timeObject ) {

        // If there's a string, then the length is always 2.
        // Otherwise check if it's more than "noon" and return either am/pm.
        return string ? 2 : MINUTES_IN_DAY / 2 > timeObject.time % MINUTES_IN_DAY ? 'AM' : 'PM'
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

    // Flip the enabled and disabled times.
    if ( value == 'flip' ) {
        clock.item.enable = isFlipped ? 1 : -1
    }

    // Check if we have to add/remove from collection.
    else if ( !isFlipped && type == 'enable' || isFlipped && type == 'disable' ) {
        collection = clock.removeDisabled( collection, value )
    }
    else if ( !isFlipped && type == 'disable' || isFlipped && type == 'enable' ) {
        collection = clock.addDisabled( collection, value )
    }

    return collection
} //TimePicker.prototype.flipItem


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
        min: clock.item.min.pick,
        max: clock.item.max.pick,
        i: clock.item.interval,
        node: 'li',
        item: function( loopedTime ) {
            loopedTime = clock.create( loopedTime )
            return [
                triggerFunction( clock.formats.toString, clock, [ settings.formatLabel || settings.format, loopedTime ] ),
                (function( klasses, timeMinutes ) {

                    if ( selectedObject && selectedObject.pick == timeMinutes ) {
                        klasses.push( settings.klass.selected )
                    }

                    if ( highlightedObject && highlightedObject.pick == timeMinutes ) {
                        klasses.push( settings.klass.highlighted )
                    }

                    if ( viewsetObject && viewsetObject.pick == timeMinutes ) {
                        klasses.push( settings.klass.viewset )
                    }

                    if ( disabledCollection && clock.disabled( loopedTime ) ) {
                        klasses.push( settings.klass.disabled )
                    }

                    return klasses.join( ' ' )
                })( [ settings.klass.listItem ], loopedTime.pick ),
                'data-pick=' + loopedTime.pick
            ]
        }
    }) + createNode( 'li', createNode( 'button', settings.clear, settings.klass.buttonClear, 'data-clear=1' + ( isOpen ? '' : ' disabled' ) ) ), settings.klass.list )
} //TimePicker.prototype.nodes







/* ==========================================================================
   Extend jQuery with the component time picker and defaults
   ========================================================================== */

jQueryExtend( TimePicker, 'pickatime', {

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

        box: STRING_PREFIX_PICKER + 'box',

        list: STRING_PREFIX_PICKER + 'list',
        listItem: STRING_PREFIX_PICKER + 'list-item',

        disabled: STRING_PREFIX_PICKER + 'list-item--disabled',
        selected: STRING_PREFIX_PICKER + 'list-item--selected',
        highlighted: STRING_PREFIX_PICKER + 'list-item--highlighted',
        viewset: STRING_PREFIX_PICKER + 'list-item--viewset',
        now: STRING_PREFIX_PICKER + 'list-item--now',

        buttonClear: STRING_PREFIX_PICKER + 'button--clear'
    }
});



})( jQuery, document );