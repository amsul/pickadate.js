
/*jshint
   debug: true,
   devel: true,
   browser: true,
   asi: true,
   unused: true,
   boss: true
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


                // Confirm focus state, save original type, convert into text input
                // to remove UA stylings, and set as readonly to prevent keyboard popup.
                ELEMENT.autofocus = ( ELEMENT == document.activeElement ) || ELEMENT.autofocus
                STATE.TYPE = ELEMENT.type
                ELEMENT.type = 'text'
                ELEMENT.readOnly = true


                // Create a new picker component with the settings and default value/format combo.
                P.component = new COMPONENT( P, SETTINGS )


                // Create the picker box with a new wrapped picker and bind the events.
                P.$box = $( createNode( 'div', createWrappedPicker(), CLASSES.holder ) ).on({

                    // When something within the holder is focused, make it appear so.
                    focusin: function( event ) {

                        // Remove the holder "focused" state from the holder.
                        P.$box.removeClass( CLASSES.focused )

                        // Prevent the event from propagating to the doc.
                        event.stopPropagation()
                    },

                    // If the event is not on the box itself, stop it from bubbling to the doc.
                    mousedown: function( event ) {
                        if ( event.target != P.$box[ 0 ] ) {
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

                        // If the event is not on the box itself, handle clicks within.
                        if ( event.target != P.$box[ 0 ] ) {

                            // Stop it from propagating to the doc.
                            event.stopPropagation()

                            // Maintain focus on the `input` element if no picker item is focused.
                            if ( activeElement != ELEMENT && !P.$box.find( activeElement ).length ) {
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
                }) //P.$box


                // If there's a format for the hidden input element, create the element
                // using the name of the original input plus suffix. Otherwise set it to null.
                P._hidden = SETTINGS.formatSubmit ? $( '<input type=hidden name=' + ELEMENT.name + ( SETTINGS.hiddenSuffix || '_submit' ) + ( ELEMENT.value || $ELEMENT.data( 'value' ) ? ' value="' + triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.formatSubmit, P.component.item.select ] ) : '' ) + '">' )[ 0 ] : undefined


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

                // Trigger the settings "start" event within scope of the picker.
                triggerFunction( SETTINGS.onStart, P, [ P.$box ] )

                // Trigger the "render" event within scope of the picker.
                triggerFunction( P.component.onRender, P, [ P.$box ] )

                // Trigger the settings "render" event within scope of the picker.
                triggerFunction( SETTINGS.onRender, P, [ P.$box ] )

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

                // Trigger the settings "render" event within scope of the picker.
                triggerFunction( SETTINGS.onRender, P, [ P.$box ] )

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

                // Trigger the settings "stop" event within scope of the picker.
                triggerFunction( SETTINGS.onStop, P, [ P.$box ] )

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
                $DOCUMENT.on( 'click.P' + STATE.ID + ' focusin.P' + STATE.ID, function( event ) {

                    // If the target of the event is not the element, close the picker picker.
                    // * Don't worry about clicks or focusins on the holder
                    //   because those are stopped from bubbling up.
                    //   Also, for Firefox, a click on an `option` element bubbles up directly
                    //   to the doc. So make sure the target wasn't the doc also.
                    if ( event.target != ELEMENT && event.target != document ) P.close()

                })/*.on( 'mousedown.P' + STATE.ID, function( event ) {

                    // Maintain the focus on the `input` element.
                    ELEMENT.focus()

                    // Prevent the default action to keep focus on the `input` field.
                    event.preventDefault()

                })*/.on( 'keydown.P' + STATE.ID, function( event ) {

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
                triggerFunction( P.component.onOpen, P, [ P.$box ] )

                // Trigger the settings "open" event within scope of the picker.
                triggerFunction( SETTINGS.onOpen, P, [ P.$box ] )

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
                $DOCUMENT.off( '.P' + STATE.ID )

                // Trigger the on close event within scope of the picker.
                triggerFunction( P.component.onClose, P, [ P.$box ] )

                // Trigger the settings "close" event within scope of the picker.
                triggerFunction( SETTINGS.onClose, P, [ P.$box ] )

                return P
            }, //close


            /**
             * Clear the values
             */
            clear: function() {
                return P.set( 'clear' )
            }, //clear


            /**
             * Set the values
             */
            set: function( type, value, options ) {

                var
                    typeIsObject = isObject( type ),
                    object = typeIsObject ? type : {}

                // If the type isn't an object, make it one.
                if ( !typeIsObject ) {
                    object[ type ] = value
                }

                // Go through the types of items to set.
                for ( type in object ) {

                    // If the item exists, set it.
                    if ( P.component.item[ type ] ) {
                        P.component.set( type, object[ type ], options || {} )
                    }

                    // Update the element value and broadcast a change, if that.
                    if ( type == 'select' || type == 'clear' ) {
                        $ELEMENT.val( type == 'clear' ? '' :
                            triggerFunction( P.component.formats.toString, P.component, [ SETTINGS.format, P.component.get( type ) ] )
                        ).trigger( 'change' )
                    }
                }

                // Render a new picker.
                P.render()

                // Trigger the component "set" event within scope of the picker.
                triggerFunction( P.component.onSet, P, [ P.$box ] )

                // Trigger the settings "set" event within scope of the picker.
                triggerFunction( SETTINGS.onSet, P, [ P.$box, object ] )

                return P
            }, //set


            /**
             * Get the values
             */
            get: function( options ) {

                // Make sure there's something to get.
                options = options || 'value'

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
            },


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
                    P.component.nodes( STATE.OPEN ),

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
 * Default options for the date picker.
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

        box: STRING_PREFIX_PICKER + 'box',

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
} //$.fn.pickatime.defaults




