
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

var CLASSES_PREFIX = 'picker__',
    $DOCUMENT = $( document )


/**
 * The picker constructor that creates a new date or time picker
 */
 function Picker( $ELEMENT, SETTINGS, COMPONENT, NAME ) {

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

                // If it’s already started, do nothing.
                if ( STATE && STATE.start ) return P


                // Update the picker states.
                STATE.methods = {}
                STATE.start = true
                STATE.open = false
                STATE.type = ELEMENT.type


                // Confirm focus state, save original type, convert into text input
                // to remove UA stylings, and set as readonly to prevent keyboard popup.
                ELEMENT.autofocus = ELEMENT == document.activeElement
                ELEMENT.type = 'text'
                ELEMENT.readOnly = true


                // Create a new picker component with the settings.
                P.component = new COMPONENT( P, SETTINGS )


                // Create the picker holder with a new wrapped component and bind the events.
                P.$holder = $( createNode( 'div', createWrappedComponent(), CLASSES.holder ) ).on({

                    // When something within the holder is focused, stop from bubbling
                    // to the doc and remove the “focused” state from the holder.
                    focusin: function( event ) {
                        P.$holder.removeClass( CLASSES.focused )
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
                // If the element has a value, use either the `data-value` or `value`.
                P._hidden = SETTINGS.formatSubmit ? $( '<input type=hidden name=' + ELEMENT.name + ( SETTINGS.hiddenSuffix || '_submit' ) + ( $ELEMENT.data( 'value' ) ? ' value="' + triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.formatSubmit, P.component.item.select ] ) : '' ) + '">' )[ 0 ] : undefined


                // Add the class and bind the events on the element.
                $ELEMENT.addClass( CLASSES.input ).

                    // On focus open the picker and add the “focused” state tothe holder.
                    on( 'focus.P' + STATE.id, focusToOpen ).

                    // On click, open the picker.
                    on( 'click.P' + STATE.id, P.open ).

                    // If the value changes, update the hidden input with the correct format.
                    on( 'change.P' + STATE.id, function() {
                        if ( P._hidden ) {
                            P._hidden.value = ELEMENT.value ? triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.formatSubmit, P.component.item.select ] ) : ''
                        }
                    }).

                    // Handle keyboard event based on the picker being opened or not.
                    on( 'keydown.P' + STATE.id, function( event ) {

                        var keycode = event.keyCode,

                            // Check if one of the delete keys was pressed
                            isKeycodeDelete = /^(8|46)$/.test( keycode )

                        // Check if `space` or `delete` was pressed or the picker is closed with a key movement.
                        if ( keycode == 32 || isKeycodeDelete || !STATE.open && P.component.key[ keycode ] ) {

                            // Prevent it from moving the page and bubbling to doc.
                            event.preventDefault()
                            event.stopPropagation()

                            // If `delete` was pressed, clear the values and close the picker.
                            // Otherwise open the picker.
                            if ( isKeycodeDelete ) { P.clear().close() }
                            else { P.open() }
                        }
                    }).

                    // If there’s a `data-value`, update the value of the element.
                    val( $ELEMENT.data( 'value' ) ? triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.format, P.component.item.select ] ) : '' ).

                    // Insert the holder and hidden input after the element.
                    after( P.$holder, P._hidden ).

                    // Store the picker data by component name.
                    data( NAME, P )


                // Bind the default component and settings events.
                P.on({
                    start: P.component.onStart,
                    render: P.component.onRender,
                    stop: P.component.onStop,
                    open: P.component.onOpen,
                    close: P.component.onClose,
                    set: P.component.onSet
                }).on({
                    start: SETTINGS.onStart,
                    render: SETTINGS.onRender,
                    stop: SETTINGS.onStop,
                    open: SETTINGS.onOpen,
                    close: SETTINGS.onClose,
                    set: SETTINGS.onSet
                })


                // If the element has autofocus, open the picker.
                if ( ELEMENT.autofocus ) {
                    P.open()
                }


                // Trigger queued the “start” and “render” events.
                return P.trigger( 'start' ).trigger( 'render' )
            }, //start


            /**
             * Render a new picker within the holder
             */
            render: function() {

                // Insert a new component in the holder.
                P.$holder.html( createWrappedComponent() )

                // Trigger the queued “render” events.
                return P.trigger( 'render' )
            }, //render


            /**
             * Destroy everything
             */
            stop: function() {

                // If it’s already stopped, do nothing.
                if ( !STATE.start ) return P

                // Then close the picker.
                P.close()

                // Remove the hidden field.
                if ( P._hidden ) {
                    P._hidden.parentNode.removeChild( P._hidden )
                }

                // Remove the holder.
                P.$holder.remove()

                // Remove the input class, unbind the events, and remove the stored data.
                $ELEMENT.removeClass( CLASSES.input ).off( '.P' + STATE.id ).removeData( NAME )

                // Restore the element state
                ELEMENT.type = STATE.type
                ELEMENT.readOnly = false

                // Trigger the queued “stop” events.
                P.trigger( 'stop' )

                // Reset the picker states.
                STATE.methods = {}
                STATE.start = false

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
                $ELEMENT.focus().addClass( CLASSES.active )

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

                // Trigger the queued “open” events.
                return P.trigger( 'open' )
            }, //open


            /**
             * Close the picker
             */
            close: function( giveFocus ) {

                // If we need to give focus, do it before changing states.
                if ( giveFocus ) {
                    // ....ah yes! It would’ve been incomplete without a crazy workaround for IE :|
                    // The focus is triggered *after* the close has completed - causing it
                    // to open again. So unbind and rebind the event at the next tick.
                    $ELEMENT.off( 'focus.P' + STATE.id ).focus()
                    setTimeout( function() {
                        $ELEMENT.on( 'focus.P' + STATE.id, focusToOpen )
                    }, 0 )
                }

                // If it’s already closed, do nothing.
                if ( !STATE.open ) return P

                // Set it as closed.
                STATE.open = false

                // Remove the “active” class.
                $ELEMENT.removeClass( CLASSES.active )

                // Remove the “opened” and “focused” class from the picker holder.
                P.$holder.removeClass( CLASSES.opened + ' ' + CLASSES.focused )

                // Bind the document events.
                $DOCUMENT.off( '.P' + STATE.id )

                // Trigger the queued “close” events.
                return P.trigger( 'close' )
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

                // Trigger queued “set” events and pass the `thingObject`.
                return P.trigger( 'set', thingObject )
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
            }, //get



            /**
             * Bind events on the things.
             */
            on: function( thing, method ) {

                var thingName, thingMethod,
                    thingIsObject = isObject( thing ),
                    thingObject = thingIsObject ? thing : {}

                if ( thing ) {

                    // If the thing isn’t an object, make it one.
                    if ( !thingIsObject ) {
                        thingObject[ thing ] = method
                    }

                    // Go through the things to bind to.
                    for ( thingName in thingObject ) {

                        // Grab the method of the thing.
                        thingMethod = thingObject[ thingName ]

                        // Make sure the thing methods collection exists.
                        STATE.methods[ thingName ] = STATE.methods[ thingName ] || []

                        // Add the method to the relative method collection.
                        STATE.methods[ thingName ].push( thingMethod )
                    }
                }

                return P
            }, //on


            /**
             * Fire off method events.
             */
            trigger: function( name, data ) {
                var methodList = STATE.methods[ name ]
                if ( methodList ) {
                    methodList.map( function( method ) {
                        triggerFunction( method, P, [ data ] )
                    })
                }
                return P
            } //trigger
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


    // For IE
    function focusToOpen() {
        P.open()
        P.$holder.addClass( CLASSES.focused )
    }


    // Return a new picker instance.
    return new PickerInstance()
} //Picker



/**
 * Extend the picker with a component and defaults.
 */
Picker.extend = function( name, Component, defaults ) {

    // Extend jQuery.
    $.fn[ name ] = function( options, action ) {

        // Grab the component data.
        var componentData = this.data( name )

        // If the picker is requested, return the data object.
        if ( options == 'picker' ) {
            return componentData
        }

        // If the component data exists and `options` is a string, carry out the action.
        if ( componentData && typeof options == 'string' ) {
            triggerFunction( componentData[ options ], componentData, [ action ] )
            return this
        }

        // Otherwise go through each matched element and if the component
        // doesn’t exist, create a new picker using `this` element
        // and merging the defaults and options with a deep copy.
        return this.each( function() {
            var $this = $( this )
            if ( !$this.data( name ) ) {
                new Picker( $this, $.extend( true, {}, $.fn[ name ].defaults, options ), Component, name )
            }
        })
    }

    // Set the defaults.
    $.fn[ name ].defaults = defaults
} //Picker.extend












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


