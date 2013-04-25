
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
                ELEMENT.autofocus = ( ELEMENT == document.activeElement ) || ELEMENT.autofocus
                ELEMENT.type = 'text'
                ELEMENT.readOnly = true


                // Create a new picker component with the settings and default value/format combo.
                P.component = new COMPONENT( P, SETTINGS )


                // Create the picker holder with a new wrapped picker and bind the events.
                P.$holder = $( createNode( 'div', createWrappedPicker(), CLASSES.holder ) ).on({

                    // When something within the holder is focused, make it appear so.
                    focusin: function( event ) {

                        // Remove the holder "focused" state from the holder.
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

                        var $target = $( event.target ),
                            targetData = $target.data(),
                            activeElement = document.activeElement

                        // Prevent the default action.
                        event.preventDefault()

                        // If the event is not on the holder itself, handle clicks within.
                        if ( event.target != P.$holder[ 0 ] ) {

                            // Stop it from propagating to the doc.
                            event.stopPropagation()

                            // Maintain focus on the `input` element if no picker item is focused.
                            if ( activeElement != ELEMENT && !P.$holder.find( activeElement ).length ) {
                                ELEMENT.focus()
                            }

                            // If something is getting picked, update the `select` and `highlight` and then close.
                            if ( isInteger( targetData.pick ) && !$target.hasClass( CLASSES.disabled ) ) {
                                P.set({ select: targetData.pick, highlight: targetData.pick }).close()
                            }

                            // If something is superficially changed, update the `highlight` based on the `nav`.
                            else if ( targetData.nav && !$target.hasClass( CLASSES.navDisabled ) ) {
                                P.set( 'highlight', P.component.item.highlight, { nav: targetData.nav } )
                            }

                            // If a "clear" button is pressed, empty the values and close it.
                            else if ( targetData.clear ) {
                                P.clear().close()
                            }
                        }
                    }
                }) //P.$holder


                // If there's a format for the hidden input element, create the element
                // using the name of the original input plus suffix. Otherwise set it to null.
                P._hidden = SETTINGS.formatSubmit ? $( '<input type=hidden name=' + ELEMENT.name + ( SETTINGS.hiddenSuffix || '_submit' ) + ( ELEMENT.value || $ELEMENT.data( 'value' ) ? ' value="' + triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.formatSubmit, P.component.item.select ] ) : '' ) + '">' )[ 0 ] : undefined


                // Bind the events on the `input` element and then
                // insert the holder and hidden element after the element.
                $ELEMENT.on( 'focus.P' + STATE.id + ' click.P' + STATE.id, function() {

                    // Open the calendar.
                    P.open()

                    // Add the "focused" state onto the holder.
                    P.$holder.addClass( CLASSES.focused )

                }).on( 'change.P' + STATE.id, function() {

                    // If there's a hidden input, update the value with formatting or clear it
                    if ( P._hidden ) {
                        P._hidden.value = ELEMENT.value ? triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.formatSubmit, P.component.item.select ] ) : ''
                    }

                }).on( 'keydown.P' + STATE.id, function( event ) {

                    var
                        // Grab the keycode
                        keycode = event.keyCode,

                        // Check if one of the delete keys was pressed
                        isKeycodeDelete = keycode == 8 || keycode == 46

                    // Check if delete was pressed or the calendar is closed and there is a key movement
                    if ( isKeycodeDelete || !STATE.open && P.component.key[ keycode ] ) {

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

                }).after([ P.$holder, P._hidden ])


                // Trigger the "start" event within scope of the picker.
                triggerFunction( P.component.onStart, P )

                // Trigger the settings "start" event within scope of the picker.
                triggerFunction( SETTINGS.onStart, P )

                // Trigger the "render" event within scope of the picker.
                triggerFunction( P.component.onRender, P )

                // Trigger the settings "render" event within scope of the picker.
                triggerFunction( SETTINGS.onRender, P )

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
                P.$holder.html( createWrappedPicker() )

                // Trigger the "render" event within scope of the picker.
                triggerFunction( P.component.onRender, P )

                // Trigger the settings "render" event within scope of the picker.
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

                // Trigger the "stop" event within scope of the picker.
                triggerFunction( stopEvent, P )

                // Trigger the settings "stop" event within scope of the picker.
                triggerFunction( SETTINGS.onStop, P )

                return P
            }, //stop


            /**
             * Open up the picker
             */
            open: function() {

                // If it's already open, do nothing.
                if ( STATE.open ) return P

                // Set it as open.
                STATE.open = true

                // Make sure the element has focus then add the "active" class.
                $ELEMENT.focus().addClass( CLASSES.inputActive )

                // Add the "opened" class to the picker holder.
                P.$holder.addClass( CLASSES.opened )

                // Bind the document events.
                $DOCUMENT.on( 'click.P' + STATE.id + ' focusin.P' + STATE.id, function( event ) {

                    // If the target of the event is not the element, close the picker picker.
                    // * Don't worry about clicks or focusins on the holder
                    //   because those are stopped from bubbling up.
                    //   Also, for Firefox, a click on an `option` element bubbles up directly
                    //   to the doc. So make sure the target wasn't the doc also.
                    if ( event.target != ELEMENT && event.target != document ) P.close()

                })/*.on( 'mousedown.P' + STATE.id, function( event ) {

                    // Maintain the focus on the `input` element.
                    ELEMENT.focus()

                    // Prevent the default action to keep focus on the `input` field.
                    event.preventDefault()

                })*/.on( 'keydown.P' + STATE.id, function( event ) {

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
                            P.set( 'select', P.component.item.highlight ).close()
                        }

                    } //if ELEMENT
                })

                // Trigger the "open" event within scope of the picker.
                triggerFunction( P.component.onOpen, P )

                // Trigger the settings "open" event within scope of the picker.
                triggerFunction( SETTINGS.onOpen, P )

                return P
            }, //open


            /**
             * Close the picker
             */
            close: function() {

                // If it's already closed, do nothing.
                if ( !STATE.open ) return P

                // Set it as closed.
                STATE.open = false

                // Remove the "active" class.
                $ELEMENT.removeClass( CLASSES.inputActive )

                // Remove the "opened" class from the picker holder.
                P.$holder.removeClass( CLASSES.opened )

                // Bind the document events.
                $DOCUMENT.off( '.P' + STATE.id )

                // Trigger the on close event within scope of the picker.
                triggerFunction( P.component.onClose, P )

                // Trigger the settings "close" event within scope of the picker.
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

                var
                    thingIsObject = isObject( thing ),
                    object = thingIsObject ? thing : {}

                if ( thing ) {

                    // If the thing isn't an object, make it one.
                    if ( !thingIsObject ) {
                        object[ thing ] = value
                    }

                    // Go through the things of items to set.
                    for ( thing in object ) {

                        // If the item exists, set it first.
                        if ( P.component.item[ thing ] ) {
                            P.component.set( thing, object[ thing ], options || {} )
                        }

                        // Then update the element value and broadcast a change, if that.
                        if ( thing == 'select' || thing == 'clear' ) {
                            $ELEMENT.val( thing == 'clear' ? '' :
                                triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.format, P.component.get( thing ) ] )
                            ).trigger( 'change' )
                        }
                    }

                    // Render a new picker.
                    P.render()
                }

                // Trigger the component "set" event within scope of the picker.
                triggerFunction( P.component.onSet, P )

                // Trigger the settings "set" event within scope of the picker.
                triggerFunction( SETTINGS.onSet, P, [ thing, value ] )

                return P
            }, //set


            /**
             * Get something
             */
            get: function( thing, format ) {

                if ( STATE[ thing ] != null ) {
                    return STATE[ thing ]
                }

                // Make sure there's something to get.
                thing = thing || 'value'

                if ( typeof thing == 'string' ) {

                    if ( thing == 'value' ) {
                        return ELEMENT.value
                    }

                    if ( P.component.item[ thing ] ) {

                        if ( typeof format == 'string' ) {
                            return triggerFunction( P.component.formats.toString, P.component, [ format, P.component.get( thing ) ] )
                        }
                        return P.component.get( thing )
                    }
                }
            }, //get


            /**
             * Flip the switch to disable items
             */
            disableAll: function( value ) {
                P.component.set( 'flip', value )
                return P.render()
            } //disableAll
        } //PickerInstance.prototype


    /**
     * Wrap the picker components together.
     */
    function createWrappedPicker() {

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


