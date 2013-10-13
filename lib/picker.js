
/*!
 * pickadate.js v3.3.0, 2013/10/13
 * By Amsul, http://amsul.ca
 * Hosted on http://amsul.github.io/pickadate.js
 * Licensed under MIT
 */

/*jshint
   debug: true,
   devel: true,
   browser: true,
   asi: true,
   unused: true,
   boss: true,
   eqnull: true
 */

(function ( factory ) {

    // Register as an anonymous module.
    if ( typeof define === 'function' && define.amd )
        define( 'picker', ['jquery'], factory )

    // Or using browser globals.
    else this.Picker = factory( jQuery )

}(function( $ ) {

var $document = $( document )


/**
 * The picker constructor that creates a blank picker.
 */
function PickerConstructor( ELEMENT, NAME, COMPONENT, OPTIONS ) {

    // If there’s no element, return the picker constructor.
    if ( !ELEMENT ) return PickerConstructor


    var
        // The state of the picker.
        STATE = {
            id: Math.abs( ~~( Math.random() * 1e9 ) )
        },


        // Merge the defaults and options passed.
        SETTINGS = COMPONENT ? $.extend( true, {}, COMPONENT.defaults, OPTIONS ) : OPTIONS || {},


        // Merge the default classes with the settings classes.
        CLASSES = $.extend( {}, PickerConstructor.klasses(), SETTINGS.klass ),


        // The element node wrapper into a jQuery object.
        $ELEMENT = $( ELEMENT ),


        // Pseudo picker constructor.
        PickerInstance = function() {
            return this.start()
        },


        // The picker prototype.
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


                // Confirm focus state, convert into text input to remove UA stylings,
                // and set as readonly to prevent keyboard popup.
                ELEMENT.autofocus = ELEMENT == document.activeElement
                ELEMENT.type = 'text'
                ELEMENT.readOnly = true


                // Create a new picker component with the settings.
                P.component = new COMPONENT( P, SETTINGS )


                // Create the picker root with a new wrapped holder and bind the events.
                P.$root = $( PickerConstructor._.node( 'div', createWrappedComponent(), CLASSES.picker ) ).
                    on({

                        // When something within the root is focused, stop from bubbling
                        // to the doc and remove the “focused” state from the root.
                        focusin: function( event ) {
                            P.$root.removeClass( CLASSES.focused )
                            event.stopPropagation()
                        },

                        // If the click is not on the root holder, stop it from bubbling to the doc.
                        'mousedown click': function( event ) {
                            if ( event.target != P.$root.children()[ 0 ] ) {
                                event.stopPropagation()
                            }
                        }
                    }).

                    // If there’s a click on an actionable element, carry out the actions.
                    on( 'click', '[data-pick], [data-nav], [data-clear]', function() {

                        var $target = $( this ),
                            targetData = $target.data(),
                            targetDisabled = $target.hasClass( CLASSES.navDisabled ) || $target.hasClass( CLASSES.disabled ),

                            // * For IE, non-focusable elements can be active elements as well
                            //   (http://stackoverflow.com/a/2684561).
                            activeElement = document.activeElement
                            activeElement = activeElement && ( activeElement.type || activeElement.href )

                        // If it’s disabled or nothing inside is actively focused, re-focus the element.
                        if ( targetDisabled || !$.contains( P.$root[0], activeElement ) ) {
                            ELEMENT.focus()
                        }

                        // If something is superficially changed, update the `highlight` based on the `nav`.
                        if ( targetData.nav && !targetDisabled ) {
                            P.set( 'highlight', P.component.item.highlight, { nav: targetData.nav } )
                        }

                        // If something is picked, set `select` then close with focus.
                        else if ( PickerConstructor._.isInteger( targetData.pick ) && !targetDisabled ) {
                            P.set( 'select', targetData.pick ).close( true )
                        }

                        // If a “clear” button is pressed, empty the values and close with focus.
                        else if ( targetData.clear ) {
                            P.clear().close( true )
                        }
                    }) //P.$root


                // If there’s a format for the hidden input element, create the element.
                if ( SETTINGS.formatSubmit ) {

                    P._hidden = $(
                        '<input ' +
                        'type=hidden ' +

                        // Create the name by using the original input plus a prefix and suffix.
                        'name="' + ( typeof SETTINGS.hiddenPrefix == 'string' ? SETTINGS.hiddenPrefix : '' ) +
                            ELEMENT.name +
                            ( typeof SETTINGS.hiddenSuffix == 'string' ? SETTINGS.hiddenSuffix : '_submit' ) +
                        '"' +

                        // If the element has a `data-value`, set the element `value` as well.
                        ( $ELEMENT.data( 'value' ) ?
                            ' value="' + PickerConstructor._.trigger( P.component.formats.toString, P.component, [ SETTINGS.formatSubmit, P.component.item.select ] ) + '"' :
                            ''
                        ) +
                        '>'
                    )[ 0 ]
                }


                // Add the class and bind the events on the element.
                $ELEMENT.addClass( CLASSES.input ).

                    // On focus/click, open the picker and adjust the root “focused” state.
                    on( 'focus.P' + STATE.id + ' click.P' + STATE.id, focusToOpen ).

                    // If the value changes, update the hidden input with the correct format.
                    on( 'change.P' + STATE.id, function() {
                        if ( P._hidden ) {
                            P._hidden.value = ELEMENT.value ? PickerConstructor._.trigger( P.component.formats.toString, P.component, [ SETTINGS.formatSubmit, P.component.item.select ] ) : ''
                        }
                    }).

                    // Handle keyboard event based on the picker being opened or not.
                    on( 'keydown.P' + STATE.id, function( event ) {

                        var keycode = event.keyCode,

                            // Check if one of the delete keys was pressed.
                            isKeycodeDelete = /^(8|46)$/.test( keycode )

                        // For some reason IE clears the input value on “escape”.
                        if ( keycode == 27 ) {
                            P.close()
                            return false
                        }

                        // Check if `space` or `delete` was pressed or the picker is closed with a key movement.
                        if ( keycode == 32 || isKeycodeDelete || !STATE.open && P.component.key[ keycode ] ) {

                            // Prevent it from moving the page and bubbling to doc.
                            event.preventDefault()
                            event.stopPropagation()

                            // If `delete` was pressed, clear the values and close the picker.
                            // Otherwise open the picker.
                            if ( isKeycodeDelete ) { P.clear().close() }
                            else { P.open() }
                        }
                    }).

                    // If there’s a `data-value`, update the value of the element.
                    val( $ELEMENT.data( 'value' ) ? PickerConstructor._.trigger( P.component.formats.toString, P.component, [ SETTINGS.format, P.component.item.select ] ) : ELEMENT.value ).

                    // Insert the hidden input after the element.
                    after( P._hidden ).

                    // Store the picker data by component name.
                    data( NAME, P )


                // Insert the root as specified in the settings.
                if ( SETTINGS.container ) $( SETTINGS.container ).append( P.$root )
                else $ELEMENT.after( P.$root )


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
             * Render a new picker
             */
            render: function( entireComponent ) {

                // Insert a new component holder in the root or box.
                if ( entireComponent ) P.$root.html( createWrappedComponent() )
                else P.$root.find( '.' + CLASSES.box ).html( P.component.nodes( STATE.open ) )

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
                if ( P._hidden ) {
                    P._hidden.parentNode.removeChild( P._hidden )
                }

                // Remove the root.
                P.$root.remove()

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


            /*
             * Open up the picker
             */
            open: function( dontGiveFocus ) {

                // If it’s already open, do nothing.
                if ( STATE.open ) return P

                // Add the “active” class.
                $ELEMENT.addClass( CLASSES.active )

                // Add the “opened” class to the picker root.
                P.$root.addClass( CLASSES.opened )

                // If we have to give focus, bind the element and doc events.
                if ( dontGiveFocus !== false ) {

                    // Set it as open.
                    STATE.open = true

                    // Pass focus to the element’s jQuery object.
                    $ELEMENT.trigger( 'focus' )

                    // Bind the document events.
                    $document.on( 'click.P' + STATE.id + ' focusin.P' + STATE.id, function( event ) {

                        // If the target of the event is not the element, close the picker picker.
                        // * Don’t worry about clicks or focusins on the root because those don’t bubble up.
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
                                PickerConstructor._.trigger( P.component.key.go, P, [ PickerConstructor._.trigger( keycodeToMove ) ] )
                            }

                            // On “enter”, if the highlighted item isn’t disabled, set the value and close.
                            else if ( !P.$root.find( '.' + CLASSES.highlighted ).hasClass( CLASSES.disabled ) ) {
                                P.set( 'select', P.component.item.highlight ).close()
                            }
                        }


                        // If the target is within the root and “enter” is pressed,
                        // prevent the default action and trigger a click on the target instead.
                        else if ( $.contains( P.$root[0], target ) && keycode == 13 ) {
                            event.preventDefault()
                            target.click()
                        }
                    })
                }

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
                    $ELEMENT.off( 'focus.P' + STATE.id ).trigger( 'focus' )
                    setTimeout( function() {
                        $ELEMENT.on( 'focus.P' + STATE.id, focusToOpen )
                    }, 0 )
                }

                // Remove the “active” class.
                $ELEMENT.removeClass( CLASSES.active )

                // Remove the “opened” and “focused” class from the picker root.
                P.$root.removeClass( CLASSES.opened + ' ' + CLASSES.focused )

                // If it’s open, update the state.
                if ( STATE.open ) {

                    // Set it as closed.
                    STATE.open = false

                    // Unbind the document events.
                    $document.off( '.P' + STATE.id )
                }

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
                    thingIsObject = PickerConstructor._.isObject( thing ),
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
                                PickerConstructor._.trigger( P.component.formats.toString, P.component, [ SETTINGS.format, P.component.get( thingItem ) ] )
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

                // Make sure there’s something to get.
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
                        return PickerConstructor._.trigger( P.component.formats.toString, P.component, [ format, P.component.get( thing ) ] )
                    }
                    return P.component.get( thing )
                }
            }, //get



            /**
             * Bind events on the things.
             */
            on: function( thing, method ) {

                var thingName, thingMethod,
                    thingIsObject = PickerConstructor._.isObject( thing ),
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
                        PickerConstructor._.trigger( method, P, [ data ] )
                    })
                }
                return P
            } //trigger
        } //PickerInstance.prototype


    /**
     * Wrap the picker holder components together.
     */
    function createWrappedComponent() {

        // Create a picker wrapper holder
        return PickerConstructor._.node( 'div',

            // Create a picker wrapper node
            PickerConstructor._.node( 'div',

                // Create a picker frame
                PickerConstructor._.node( 'div',

                    // Create a picker box node
                    PickerConstructor._.node( 'div',

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
            ),

            // Picker holder class
            CLASSES.holder
        ) //endreturn
    } //createWrappedComponent


    // Separated for IE
    function focusToOpen( event ) {

        // Stop the event from propagating to the doc.
        event.stopPropagation()

        // If it’s a focus event, add the “focused” class to the root.
        if ( event.type == 'focus' ) P.$root.addClass( CLASSES.focused )

        // And then finally open the picker.
        P.open()
    }


    // Return a new picker instance.
    return new PickerInstance()
} //PickerConstructor



/**
 * The default classes and prefix to use for the HTML classes.
 */
PickerConstructor.klasses = function( prefix ) {
    prefix = prefix || 'picker'
    return {

        picker: prefix,
        opened: prefix + '--opened',
        focused: prefix + '--focused',

        input: prefix + '__input',
        active: prefix + '__input--active',

        holder: prefix + '__holder',

        frame: prefix + '__frame',
        wrap: prefix + '__wrap',

        box: prefix + '__box'
    }
} //PickerConstructor.klasses



/**
 * PickerConstructor helper methods.
 */
PickerConstructor._ = {

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
    group: function( groupObject ) {

        var
            // Scope for the looped object
            loopObjectScope,

            // Create the nodes list
            nodesList = '',

            // The counter starts from the `min`
            counter = PickerConstructor._.trigger( groupObject.min, groupObject )


        // Loop from the `min` to `max`, incrementing by `i`
        for ( ; counter <= PickerConstructor._.trigger( groupObject.max, groupObject, [ counter ] ); counter += groupObject.i ) {

            // Trigger the `item` function within scope of the object
            loopObjectScope = PickerConstructor._.trigger( groupObject.item, groupObject, [ counter ] )

            // Splice the subgroup and create nodes out of the sub nodes
            nodesList += PickerConstructor._.node(
                groupObject.node,
                loopObjectScope[ 0 ],   // the node
                loopObjectScope[ 1 ],   // the classes
                loopObjectScope[ 2 ]    // the attributes
            )
        }

        // Return the list of nodes
        return nodesList
    }, //group


    /**
     * Create a dom node string
     */
    node: function( wrapper, item, klass, attribute ) {

        // If the item is false-y, just return an empty string
        if ( !item ) return ''

        // If the item is an array, do a join
        item = $.isArray( item ) ? item.join( '' ) : item

        // Check for the class
        klass = klass ? ' class="' + klass + '"' : ''

        // Check for any attributes
        attribute = attribute ? ' ' + attribute : ''

        // Return the wrapped item
        return '<' + wrapper + klass + attribute + '>' + item + '</' + wrapper + '>'
    }, //node


    /**
     * Lead numbers below 10 with a zero.
     */
    lead: function( number ) {
        return ( number < 10 ? '0': '' ) + number
    },


    /**
     * Trigger a function otherwise return the value.
     */
    trigger: function( callback, scope, args ) {
        return typeof callback == 'function' ? callback.apply( scope, args || [] ) : callback
    },


    /**
     * If the second character is a digit, length is 2 otherwise 1.
     */
    digits: function( string ) {
        return ( /\d/ ).test( string[ 1 ] ) ? 2 : 1
    },


    /**
     * Tell if something is an object.
     */
    isObject: function( value ) {
        return {}.toString.call( value ).indexOf( 'Object' ) > -1
    },


    /**
     * Tell if something is a date object.
     */
    isDate: function( value ) {
        return {}.toString.call( value ).indexOf( 'Date' ) > -1 && this.isInteger( value.getDate() )
    },


    /**
     * Tell if something is an integer.
     */
    isInteger: function( value ) {
        return {}.toString.call( value ).indexOf( 'Number' ) > -1 && value % 1 === 0
    }
} //PickerConstructor._



/**
 * Extend the picker with a component and defaults.
 */
PickerConstructor.extend = function( name, Component ) {

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
            PickerConstructor._.trigger( componentData[ options ], componentData, [ action ] )
            return this
        }

        // Otherwise go through each matched element and if the component
        // doesn’t exist, create a new picker using `this` element
        // and merging the defaults and options with a deep copy.
        return this.each( function() {
            var $this = $( this )
            if ( !$this.data( name ) ) {
                new PickerConstructor( this, name, Component, options )
            }
        })
    }

    // Set the defaults.
    $.fn[ name ].defaults = Component.defaults
} //PickerConstructor.extend



// Expose the picker constructor.
return PickerConstructor


}));



