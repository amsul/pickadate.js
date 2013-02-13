/*!
 * pickadate.js v3.0.0 early aplha build - 13 February, 2013
 * By Amsul (http://amsul.ca)
 * Hosted on https://github.com/amsul/pickadate.js
 * Licensed under MIT ("expat" flavour) license.
 */

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



    var

        // Globals & constants
        DAYS_IN_WEEK = 7,
        WEEKS_IN_CALENDAR = 6,
        DAYS_IN_CALENDAR = WEEKS_IN_CALENDAR * DAYS_IN_WEEK,

        MINUTES_IN_HOUR = 60,
        HOURS_IN_DAY = 24,
        HOURS_TO_NOON = 12,
        MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR,

        STRING_DIV = 'div',
        STRING_PREFIX_PICKER = 'pickadate__',

        isIE = navigator.userAgent.match( /MSIE/ ),

        $document = $( document ),


        /**
         * The picker constructor that creates and returns a new date or time picker
         */
        Picker = function( $ELEMENT, SETTINGS, IS_TIME_PICKER ) {

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


                        // Bind all the events to the element,
                        // and then insert everything after it
                        $ELEMENT.on({
                            'focus click': function() {

                                // If it's not IE or it is IE and the calendar is not
                                // being force closed, then open the calendar
                                if ( !isIE || ( isIE && !PICKER._IE ) ) {
                                    P.open()
                                }

                                // Add the focused state to the holder
                                $HOLDER.addClass( CLASSES.focused )

                                // Then flip the IE force close to false
                                PICKER._IE = 0
                            },
                            blur: function() {
                                $HOLDER.removeClass( CLASSES.focused )
                            },
                            change: function() {

                                // If there's a hidden input, update the value with formatting or clear it
                                if ( ELEMENT_HIDDEN ) {
                                    ELEMENT_HIDDEN.value = ELEMENT.value ? getTimeFormatted( SETTINGS.formatSubmit ) : ''
                                }
                            },
                            keydown: function( event ) {

                                var
                                    // Grab the keycode
                                    keycode = event.keyCode,

                                    // Check if one of the delete keys was pressed
                                    isKeycodeDelete = keycode == 8 || keycode == 46

                                // If backspace was pressed or the calendar is closed and the keycode
                                // warrants a selection move, prevent it from going any further.
                                if ( isKeycodeDelete || !PICKER.isOpen && KEYCODE_TO_MOVE[ keycode ] ) {

                                    // Prevent it from moving the page
                                    event.preventDefault()

                                    // Prevent it from propagating to document
                                    eventPreventPropagation( event )

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


                        // If the element has autofocus, open the calendar
                        if ( ELEMENT.autofocus ) {
                            P.open()
                        }


                        // Update the calendar items
                        PICKER.items = getUpdatedPickerItems()


                        // Trigger the `onStart` method within scope of the picker
                        triggerFunction( SETTINGS.onStart, P )


                        return P
                    }, //init


                    /**
                     * Open the picker
                     */
                    open: function() {

                        // If it's already open, do nothing
                        if ( PICKER.isOpen ) return P


                        // Set picker as open
                        PICKER.isOpen = 1


                        // Toggle the tabindex of "focusable" picker items
                        togglePickerElements( 0 )


                        // Make sure the element has focus and then
                        // add the "active" class to the element
                        $ELEMENT.focus().addClass( CLASSES.inputActive )

                        // Add the "opened" class to the picker holder
                        $HOLDER.addClass( CLASSES.opened )


                        // Bind all the events to the document
                        // while namespacing it with the picker ID
                        $document.on( 'focusin.P' + PICKER.id, function( event ) {

                            // If the target is not within the holder,
                            // and is not the element, then close the picker
                            if ( !$HOLDER.find( event.target ).length && event.target != ELEMENT ) P.close()

                        }).on( 'click.P' + PICKER.id, function( event ) {

                            // If the target of the click is not the element,
                            // then close the picker picker
                            // * We don't worry about clicks on the holder
                            //   because those are stopped from bubbling to the doc
                            if ( event.target != ELEMENT ) P.close()

                        }).on( 'keydown.P' + PICKER.id, function( event ) {

                            var
                                // Get the keycode
                                keycode = event.keyCode,

                                // Translate that to a selection change
                                keycodeToMove = KEYCODE_TO_MOVE[ keycode ]


                            // On escape, focus back onto the element and close the picker
                            if ( keycode == 27 ) {
                                ELEMENT.focus()
                                P.close()
                            }


                            // If the target is the element and there's a keycode to selection
                            // translation or the enter key was pressed
                            else if ( event.target == ELEMENT && ( keycodeToMove || keycode == 13 ) ) {

                                // Prevent the default action to stop it from moving the page
                                event.preventDefault()

                                // If the keycode translates to a selection change, superficially select
                                // the time by incrementally (based on time change) creating new validated times.
                                // * Truthy second argument makes it a superficial selection
                                if ( keycodeToMove ) {
                                    setTimeSelected(
                                        createValidatedTime(
                                            IS_TIME_PICKER ?
                                                TIME_HIGHLIGHTED.TIME + SETTINGS.interval * ( keycodeToMove > 0 ? 1 : -1 ) :
                                                [ TIME_HIGHLIGHTED.YEAR, TIME_HIGHLIGHTED.MONTH, TIME_HIGHLIGHTED.DATE + keycodeToMove ],
                                            keycodeToMove
                                        ),
                                    1 )
                                }

                                // Otherwise it's the enter key so set the element value as the
                                // highlighted time, render a new picker, and then close it
                                else {
                                    setElementsValue( TIME_HIGHLIGHTED )
                                    renderPicker()
                                    P.close()
                                }

                            } //if ELEMENT
                        })


                        // Trigger the onOpen method within scope of the picker
                        triggerFunction( SETTINGS.onOpen, P )

                        return P
                    }, //open


                    /**
                     * Close the picker
                     */
                    close: function() {

                        // If it's already closed, do nothing
                        if ( !PICKER.isOpen ) return P


                        // Set picker as closed
                        PICKER.isOpen = 0


                        // Toggle the tabindex of "focusable" picker items
                        togglePickerElements( -1 )


                        // Remove the "active" class from the element
                        $ELEMENT.removeClass( CLASSES.inputActive )

                        // Remove the "opened" class from the picker holder
                        $HOLDER.removeClass( CLASSES.opened )


                        // Unbind the Picker events from the document
                        $document.off( '.P' + PICKER.id )


                        // Trigger the onClose method within scope of the picker
                        triggerFunction( SETTINGS.onClose, P )

                        return P
                    }, //close


                    /**
                     * Show a time in view on the picker
                     */
                    show: function( timeUnit1, timeUnit2 ) {

                        // If it's a date picker, compensate for month 0index
                        showInView( IS_TIME_PICKER ? timeUnit1 : --timeUnit1, timeUnit2 )
                        return P
                    }, //show


                    /**
                     * Clear the value of the input elements
                     */
                    clear: function() {

                        // Clear the elements value
                        setElementsValue( 0 )

                        // Render a new picker
                        renderPicker()

                        return P
                    }, //clear


                    /**
                     * Get the selected time in any format.
                     */
                    get: function( format ) {

                        // If the format is a literal true, return the underlying JS Date object.
                        // If the element has no value, just return an empty string.
                        // Otherwise return the formatted time.
                        return format === true ? TIME_SELECTED.OBJ : !ELEMENT.value ? '' : getTimeFormatted( format )
                    }, //get


                    /**
                     * Set the time with an option to do a superficial selection
                     */
                    set: function( timeArray, isSuperficial ) {

                        // If there's no time, we need to clear the value
                        if ( !timeArray ) {
                            P.clear()
                        }

                        // Confirm that the time passed is an array
                        else if ( Array.isArray( timeArray ) ) {

                            // If it's a date picker, compensate for month 0index
                            if ( !IS_TIME_PICKER ) { --timeArray[ 1 ] }

                            // Set the validated time as selected.
                            setTimeSelected( createValidatedTime( timeArray ), isSuperficial )
                        }

                        return P
                    }, //set


                    /**
                     * Get the min or max limit based on `upper` being truthy or falsey
                     */
                    getLimit: function( upper, format ) {
                        return getTimeFormatted( format, upper ? LIMIT_MAX : LIMIT_MIN )
                    }, //getLimit


                    /**
                     * Set the min or max limit based on `upper` being truthy or falsey.
                     */
                    setLimit: function( limit, upper ) {

                        // If it's the upper limit
                        if ( upper ) {

                            // Set the max time
                            LIMIT_MAX = createTimeBoundaryObj( limit, upper )

                            if ( IS_TIME_PICKER ) {

                                // If highlighted time is more than max time set it to max time
                                if ( TIME_HIGHLIGHTED.TIME > LIMIT_MAX.TIME ) {
                                    TIME_FOCUSED = TIME_HIGHLIGHTED = createValidatedTime( LIMIT_MAX, -1 )
                                }
                            }

                            else {

                                // If focused month is more than max time set it to max time
                                if ( TIME_FOCUSED.TIME > LIMIT_MAX.TIME ) {
                                    TIME_FOCUSED = createValidatedTime( LIMIT_MAX, -1 )
                                }
                            }
                        }

                        // Otherwise it's the lower limit
                        else {

                            // So set the min time
                            LIMIT_MIN = createTimeBoundaryObj( limit )

                            if ( IS_TIME_PICKER ) {

                                // If highlighted time is less than min time set it to min time
                                if ( TIME_HIGHLIGHTED.TIME < LIMIT_MIN.TIME ) {
                                    TIME_FOCUSED = TIME_HIGHLIGHTED = createValidatedTime( LIMIT_MIN )
                                }
                            }

                            else {

                                // If focused month is less than min time set it to min time
                                if ( TIME_FOCUSED.TIME < LIMIT_MIN.TIME ) {
                                    TIME_FOCUSED = createValidatedTime( LIMIT_MIN )
                                }
                            }
                        }

                        // Render a new picker
                        renderPicker()

                        return P
                    } //setLimit
                }, //Picker.prototype


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


                // The picker object
                PICKER = {
                    id: ~~( Math.random() * 1e9 )
                }, //PICKER


                // The classes
                CLASSES = SETTINGS.klass,


                // The time in various formats
                TIME_FORMATS = (function() {

                    // Get the length of the first word
                    function getFirstWordLength( string ) {
                        return string.match( /\w+/ )[ 0 ].length
                    }

                    // If the second character is a digit, length is 2 otherwise 1.
                    function getDigitsLength( string ) {
                        return ( /\d/ ).test( string[ 1 ] ) ? 2 : 1
                    }

                    // Get the length of the month from a string
                    function getMonthLength( string, date, collection ) {

                        // Grab the first word
                        var word = string.match( /\w+/ )[ 0 ]

                        // If there's no index for the date object's month,
                        // find it in the relevant months collection and add 1
                        // because we subtract 1 when we create the date object
                        if ( !date.mm && !date.m ) {
                            date.m = collection.indexOf( word ) + 1
                        }

                        // Return the length of the word
                        return word.length
                    }


                    // Return the time formats object
                    return {
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
                            return string ? getFirstWordLength( string ) : SETTINGS.weekdaysShort[ this.DAY ]
                        },
                        dddd: function( string ) {

                            // If there's a string, then get the length of the first word.
                            // Otherwise return the full selected weekday.
                            return string ? getFirstWordLength( string ) : SETTINGS.weekdaysFull[ this.DAY ]
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
                        mmm: function( string, date ) {

                            var collection = SETTINGS.monthsShort

                            // If there's a string, get length of the relevant month string
                            // from the short months collection. Otherwise return the
                            // selected month from that collection.
                            return string ? getMonthLength( string, date, collection ) : collection[ this.MONTH ]
                        },
                        mmmm: function( string, date ) {

                            var collection = SETTINGS.monthsFull

                            // If there's a string, get length of the relevant month string
                            // from the full months collection. Otherwise return the
                            // selected month from that collection.
                            return string ? getMonthLength( string, date, collection ) : collection[ this.MONTH ]
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

                        // Create an array by splitting the format passed
                        toArray: function( format ) { return format.split( IS_TIME_PICKER ? /(h{1,2}|H{1,2}|i|a|A|!.)/g : /(d{1,4}|m{1,4}|y{4}|yy|!.)/g ) }

                    } //endreturn
                })(), //TIME_FORMATS


                // Create time object for now
                NOW = createTimeObj(),


                // Create the min limit time object
                LIMIT_MIN = createTimeBoundaryObj( SETTINGS.minLimit ),


                // Create the max limit time object
                // * A truthy second argument creates the upper limit
                LIMIT_MAX = createTimeBoundaryObj( SETTINGS.maxLimit, 1 ),


                // Create a pseudo min and max limit for disabled
                // pickers as the respective opposite limit
                PSEUDO_LIMIT_MIN = LIMIT_MAX,
                PSEUDO_LIMIT_MAX = LIMIT_MIN,


                // Create a collection of times to disable
                TIMES_TO_DISABLE = (function( timesCollection ) {

                    // If a collection was passed, we need to create time objects
                    if ( Array.isArray( timesCollection ) ) {

                        // If the "all" flag is true, remove the flag from the collection
                        // and flip the condition of which times to disable
                        if ( timesCollection[ 0 ] === true ) {
                            PICKER.off = timesCollection.shift()
                        }


                        // Map through the times passed and return the collection
                        return timesCollection.map( function( timeToDisable ) {

                            // If the time is a number, we have to disable hours/weekdays
                            if ( !isNaN( timeToDisable ) ) {

                                // If it's the time picker, just return the time as the "hour"
                                if ( IS_TIME_PICKER ) return timeToDisable

                                // Otherwise we need to disable weekdays, so flip the "off days" boolean
                                PICKER.offDays = 1

                                // If the first day flag is truthy, we maintain the
                                // 0index of the weekday by getting the remainder from 7.
                                // Otherwise return the weekday with 0index compensation.
                                return SETTINGS.firstDay ? timeToDisable % DAYS_IN_WEEK : --timeToDisable
                            }

                            // Otherwise if it's not a time picker, it's a date array so fix the month 0index
                            if ( !IS_TIME_PICKER ) {
                                --timeToDisable[ 1 ]
                            }

                            // Then create and return the time object, replacing it in the collection
                            return createTimeObj( timeToDisable )
                        })
                    }
                })( SETTINGS.disable ), //TIMES_TO_DISABLE


                // Create a function that will filter through the times
                // and return true if the looped time is to be disabled
                DISABLED_TIMES = (function() {

                    // Check if the looped time should be disabled
                    // based on the time being the same as a disabled time
                    // or the day index being within the collection
                    var isDisabledTime = function( timeObj ) {
                        return this.TIME == timeObj.TIME || TIMES_TO_DISABLE.indexOf( this.DAY || this.HOUR ) > -1
                    }


                    // If all picker times should be disabled
                    if ( PICKER.off ) {

                        // Map through all the times to disable
                        TIMES_TO_DISABLE.map( function( timeObj ) {

                            if ( IS_TIME_PICKER && !isNaN( timeObj ) ) {

                                // If the looped time is less than the latest lowest hour
                                // and greater than the minimum hour, then set it as the lower limit
                                if ( timeObj < PSEUDO_LIMIT_MIN.HOUR && timeObj > LIMIT_MIN.HOUR ) {
                                    PSEUDO_LIMIT_MIN = createTimeObj([ timeObj, 0 ])
                                }

                                // If the looped time is more than the latest highest hour and less
                                // than or equal to the maximum hour, then set it as the upper limit by
                                // adding an hour and subtracting the interval to get last "reachable" time.
                                if ( timeObj > PSEUDO_LIMIT_MAX.HOUR && timeObj <= LIMIT_MAX.HOUR ) {
                                    PSEUDO_LIMIT_MAX = createTimeObj([ timeObj + 1, -SETTINGS.interval ])
                                }
                            }

                            else {

                                // If the looped time is less than the latest lowest time
                                // and greater than the minimum time, then set it as the lower limit
                                if ( timeObj.TIME < PSEUDO_LIMIT_MIN.TIME && timeObj.TIME > LIMIT_MIN.TIME ) {
                                    PSEUDO_LIMIT_MIN = timeObj
                                }

                                // If the looped time is more than the latest highest time and less
                                // than or equal to the maximum time, then set it as the upper limit
                                if ( timeObj.TIME > PSEUDO_LIMIT_MAX.TIME && timeObj.TIME <= LIMIT_MAX.TIME ) {
                                    PSEUDO_LIMIT_MAX = timeObj
                                }
                            }
                        })

                        // Finally, return a function that maps each time in the collection
                        // of times to disable and checks if this is not one.
                        return function( time, i, collection ) {
                            return ( collection.map( isDisabledTime, this ).indexOf( true ) < 0 )
                        }
                    }


                    // Otherwise just return the function that checks if a time is disabled
                    return isDisabledTime
                })(), //DISABLED_TIMES


                // Create time object for the highlighted time
                TIME_HIGHLIGHTED = (function( elemDataValue, elemValue ) {

                    // If there an element `data-value`
                    if ( elemDataValue || IS_TIME_PICKER ) {

                        // If there's no data value, replace it with the elem value
                        elemDataValue = elemDataValue || elemValue

                        // Set the element value entered to an empty object
                        elemValue = {}

                        // Map through the submit format array
                        TIME_FORMATS.toArray( SETTINGS.formatSubmit || SETTINGS.format ).map( function( formatItem ) {

                            // If the formatting length function exists, invoke it
                            // with the `data-value` and the time object we are creating.
                            // Otherwise it's the length of the formatting item being mapped
                            // (while removing escaped characters).
                            var formattingLength = TIME_FORMATS[ formatItem ] ? TIME_FORMATS[ formatItem ]( elemDataValue, elemValue ) : formatItem.replace( /^!/, '' ).length

                            // If the formatting length function exists, slice up
                            // the value and pass it into the time object we're creating.
                            if ( TIME_FORMATS[ formatItem ] ) {
                                elemValue[ formatItem ] = elemDataValue.slice( 0, formattingLength )
                            }

                            // Update the remainder of the string by slicing away the format length
                            elemDataValue = elemDataValue.slice( formattingLength )
                        })

                        // Create an array with the time object units while parsing each item as an integer.
                        elemValue = IS_TIME_PICKER ?
                            [
                                // If no "military" format, get the "standard" format and add 12 based on AM/PM
                                +( elemValue.HH || elemValue.H ) || +( elemValue.hh || elemValue.h ) + ( /^p/i.test( elemValue.A || elemValue.a ) ? HOURS_TO_NOON : 0 ),
                                +elemValue.i
                            ] :
                            [
                                +( elemValue.yyyy || elemValue.yy ),
                                +( elemValue.mm || elemValue.m ) - 1, // Compensate for month 0index
                                +( elemValue.dd || elemValue.d )
                            ]
                    }


                    // Otherwise, try to natively parse the value in the input
                    else {
                        elemValue = Date.parse( elemValue )
                    }


                    // Return a validated time object.
                    return createValidatedTime(

                        // If elem value parsed as a native Date Object
                        elemValue && ( !isNaN( elemValue ) ||

                        // Or it is now an array with valid integer time units
                        Array.isArray( elemValue ) && !elemValue.filter( function( timeUnit ) { return isNaN( timeUnit ) }).length ) ?

                            // Then use the elem value
                            elemValue :

                            // Otherwise use the current time object
                            NOW
                    ) //endreturn

                })( ELEMENT.getAttribute( 'data-value' ), ELEMENT.value ), //TIME_HIGHLIGHTED


                // The time selected is initially the time highlighted
                TIME_SELECTED = TIME_HIGHLIGHTED,


                // The time focused is based on highlighted time
                TIME_FOCUSED = TIME_HIGHLIGHTED,


                // If there's a format for the hidden input element, create the element
                // using the name of the original input plus suffix and update the value
                // with whatever is entered in the input on load. Otherwise set it to null.
                ELEMENT_HIDDEN = SETTINGS.formatSubmit ? $( '<input type=hidden name=' + ELEMENT.name + SETTINGS.hiddenSuffix + '>' ).val( ELEMENT.value ? getTimeFormatted( SETTINGS.formatSubmit ) : '' )[ 0 ] : null,


                // If it's not a time picker, then create the calendar table head with
                // weekday labels by "copying" the weekdays collection based on the settings.
                // * We do a copy so we don't mutate the original array.
                TABLE_HEAD = IS_TIME_PICKER ? 0 : (function( weekdaysCollection ) {

                    // If the first day should be Monday, then grab
                    // Sunday and push it to the end of the collection
                    if ( SETTINGS.firstDay ) {
                        weekdaysCollection.push( weekdaysCollection.splice( 0, 1 )[ 0 ] )
                    }

                    // Go through each day of the week and return a wrapped header row.
                    // Take the result and apply anoth table head wrapper to group it all.
                    return createNode( 'thead',
                        createNode( 'tr',
                            weekdaysCollection.map( function( weekday ) {
                                return createNode( 'th', weekday, CLASSES.weekdays )
                            })
                        )
                    )
                })( ( SETTINGS.showWeekdaysShort ? SETTINGS.weekdaysShort : SETTINGS.weekdaysFull ).slice( 0 ) ), //TABLE_HEAD


                // Create the picker holder with a new wrapped picker and bind the events
                $HOLDER = $( createNode( STRING_DIV, createWrappedPicker(), CLASSES.holder ) ).on( 'mousedown', function( event ) {

                    // If the target of the event is not one of the picker items,
                    // prevent default action to keep focus on the input element
                    if ( PICKER.items.indexOf( event.target ) < 0 ) {
                        event.preventDefault()
                    }
                }).on( 'click', function( event ) {

                    // If the picker is closed and there appears to be no click, do nothing
                    // * This is done to prevent the "enter" key propagating as a click.
                    //   On all browsers (except old IEs) the client click x & y are 0.
                    if ( !PICKER.isOpen && !event.clientX && !event.clientY ) {
                        return
                    }

                    var
                        // Get the jQuery target
                        $target = $( event.target ),

                        // Get the target data
                        targetData = $target.data()


                    // Stop the event from bubbling to the document
                    eventPreventPropagation( event )


                    // Put focus back onto the element
                    ELEMENT.focus()

                    // For IE, set the picker to force close
                    // * This needs to be after `ELEMENT.focus()`
                    PICKER._IE = 1


                    // If a navigator button was clicked,
                    // show the month in the relative direction
                    if ( targetData.nav ) {
                        showInView( TIME_FOCUSED.MONTH + targetData.nav )
                    }

                    // If a clear button was clicked,
                    // clear the elements value and then close it
                    else if ( targetData.clear ) {
                        P.clear().close()
                    }

                    // If a date or time was clicked, split it into an array
                    // of time units, set the time, and then close the picker.
                    else if ( targetData.pick ) {
                        P.set( targetData.pick.split( IS_TIME_PICKER ? ':' : '/' ) ).close()
                    }

                    // If the target is the holder, close the picker
                    else if ( $target[ 0 ] == $HOLDER[ 0 ] ) {
                        P.close()
                    }
                }), // $HOLDER


                // Translate a keycode to a relative change in time
                KEYCODE_TO_MOVE = {

                    // Down
                    40: 7,

                    // Up
                    38: -7,

                    // Right
                    39: 1,

                    // Left
                    37: -1
                } //KEYCODE_TO_MOVE



            /**
             * Create a time object
             */
            function createTimeObj( timePassed, unlimited ) {

                // If it's a time picker
                if ( IS_TIME_PICKER ) {

                    // If the time passed is an array, float the values and convert into total minutes.
                    if ( Array.isArray( timePassed ) ) {
                        timePassed = +timePassed[ 0 ] * MINUTES_IN_HOUR + (+timePassed[ 1 ])
                    }

                    // If the time passed is not a number, create the time for "now".
                    else if ( isNaN( timePassed ) ) {
                        timePassed = new Date()
                        timePassed = timePassed.getHours() * MINUTES_IN_HOUR /*+ timePassed.getMinutes()*/
                        // console.log( timePassed.getHours() , timePassed.getMinutes(), SETTINGS.interval )
                    }


                    return {

                        // Divide to get hours from minutes.
                        HOUR: ~~( timePassed / MINUTES_IN_HOUR ),

                        // The remainder is the minutes.
                        MINS: timePassed % MINUTES_IN_HOUR,

                        // Reference to total minutes.
                        TIME: timePassed
                    }
                }


                // If the time passed is an array, create the time by splitting the items
                if ( Array.isArray( timePassed ) ) {
                    timePassed = new Date( timePassed[ 0 ], timePassed[ 1 ], timePassed[ 2 ] )
                }

                // If the time passed is a number, create the time with the number
                else if ( !isNaN( timePassed ) ) {
                    timePassed = new Date( timePassed )
                }

                // Otherwise if it's not unlimited, set the time to today and
                // set the time to midnight (for comparison purposes)
                else if ( !unlimited ) {
                    timePassed = new Date()
                    timePassed.setHours( 0, 0, 0, 0 )
                }

                // Return the time object
                return {
                    YEAR: unlimited || timePassed.getFullYear(),
                    MONTH: unlimited || timePassed.getMonth(),
                    DATE: unlimited || timePassed.getDate(),
                    DAY: unlimited || timePassed.getDay(),
                    TIME: unlimited || timePassed.getTime(),
                    OBJ: unlimited || timePassed
                }
            } //createTimeObj


            /**
             * Create a bounding time allowed on the picker
             * * A truthy second argument creates the upper boundary
             */
            function createTimeBoundaryObj( limit, upper ) {

                // If there is a limit and its a number, create a
                // time object relative to today by adding the limit.
                if ( limit && !isNaN( limit ) ) {
                    return createTimeObj( IS_TIME_PICKER ?
                        [ NOW.HOUR, SETTINGS.interval * ( limit + Math.ceil( NOW.MINS / SETTINGS.interval ) ) ] :
                        [ NOW.YEAR, NOW.MONTH, NOW.DATE + limit ]
                    ) //endreturn
                }

                // If it's a time picker, just create a time object
                if ( IS_TIME_PICKER ) {
                    return createTimeObj( limit )
                }

                // If the limit is set to true, just return today
                if ( limit === true ) {
                    return NOW
                }

                // If the limit is an array, construct the time by fixing month 0index
                if ( Array.isArray( limit ) ) {
                    --limit[ 1 ]
                    return createTimeObj( limit )
                }

                // Otherwise create an infinite time
                return createTimeObj( 0, upper ? Infinity : -Infinity )
            } //createTimeBoundaryObj


            /**
             * Create a validated time
             */
            function createValidatedTime( timeObj, direction, skipMonthCheck ) {

                // If the time object does not have a time property, create a time object
                timeObj = isNaN( timeObj.TIME ) ? createTimeObj( timeObj ) : timeObj

                // If it's a time picker, make sure the minutes are "reachable" based on the interval
                if ( IS_TIME_PICKER && LIMIT_MIN ) {

                    // If we can "reach" a date based on the lower limit and interval, then do nothing
                    timeObj = timeObj.TIME % SETTINGS.interval == LIMIT_MIN.TIME % SETTINGS.interval ? timeObj :

                        // Otherwise, create a time object by first getting the difference between the lower limit and
                        // time object passed. Then get the remainder based on the time interval. Subtract that
                        // from the time interval and we have the "minutes" needed to increase the time by to get to
                        // the next "reachable" time. Yeah... I think this gets most edge cases.
                        createTimeObj( timeObj.TIME + ( SETTINGS.interval - (( timeObj.TIME - LIMIT_MIN.TIME ) % SETTINGS.interval) ) )
                }

                // If the picker "disabled" flag is truthy and there are only disabled weekdays
                // ^ This is some confusing shit right here.
                if ( PICKER.off && !PICKER.offDays ) {

                    // If the time is less than the pseudo min limit or greater than pseudo max limit,
                    // set it as the pseudo time limit. Otherwise keep it the same.
                    timeObj = timeObj.TIME < PSEUDO_LIMIT_MIN.TIME ? PSEUDO_LIMIT_MIN : timeObj.TIME > PSEUDO_LIMIT_MAX.TIME ? PSEUDO_LIMIT_MAX : timeObj
                }

                // If there are disabled times
                if ( TIMES_TO_DISABLE ) {

                    // Create a reference to the original time passed
                    var originalTime = timeObj

                    // Confirm we have a direction to work with
                    direction = direction || 1

                    // Check if this time is disabled. If it is, then keep creating
                    // new the time objects until we get to a time that's enabled.
                    while ( TIMES_TO_DISABLE.filter( DISABLED_TIMES, timeObj ).length ) {

                        // Otherwise create the next time based on the direction
                        timeObj = createTimeObj(
                            IS_TIME_PICKER ?
                                [ timeObj.HOUR, ( direction > 0 ? 1 : -1 ) * SETTINGS.interval + timeObj.MINS ] :
                                [ timeObj.YEAR, timeObj.MONTH, direction + timeObj.DATE ]
                        )

                        // Check if the month check should be skipped to avoid extra loops.
                        // Otherwise if we've gone through to another month, create a new
                        // time based on the direction being less than zero (rather than more).
                        // Then set this new time as the original and looped time.
                        if ( !IS_TIME_PICKER && !skipMonthCheck && timeObj.MONTH != originalTime.MONTH ) {
                            originalTime = timeObj = createTimeObj([ originalTime.YEAR, originalTime.MONTH, direction < 0 ? --originalTime.DATE : ++originalTime.DATE ])
                        }
                    }
                }


                // If it's less that min limit, set it to min limit by creating
                // a validated time while adding one until we find an enabled time.
                // * A truthy third argument skips the month check.
                if ( timeObj.TIME < LIMIT_MIN.TIME ) {
                    timeObj = createValidatedTime( LIMIT_MIN, 1, 1 )
                }


                // If it's more than max limit, set it to max limit by creating
                // a validated time while subtracting one until we find an enabled time.
                // * A truthy third argument skips the month check.
                else if ( timeObj.TIME > LIMIT_MAX.TIME ) {
                    timeObj = createValidatedTime( LIMIT_MAX, -1, 1 )
                }


                // Finally, return the time object
                return timeObj
            } //createValidatedTime


            /**
             * Create the nav for next/prev month
             */
            function createMonthNav( next ) {

                // If the focused month is outside the range, return an empty string
                if ( ( next && TIME_FOCUSED.YEAR >= LIMIT_MAX.YEAR && TIME_FOCUSED.MONTH >= LIMIT_MAX.MONTH ) || ( !next && TIME_FOCUSED.YEAR <= LIMIT_MIN.YEAR && TIME_FOCUSED.MONTH <= LIMIT_MIN.MONTH ) ) {
                    return ''
                }

                // Otherwise, return the created month tag
                var monthTag = 'month' + ( next ? 'Next' : 'Prev' )
                return createNode( STRING_DIV, SETTINGS[ monthTag ], CLASSES[ monthTag ], 'data-nav=' + ( next || -1 ) )
            } //createMonthNav


            /**
             * Create the month label
             */
            function createMonthLabel( monthsCollection ) {

                // If there's a need for a month selector
                return SETTINGS.monthSelector ?

                    // Create the dom string node for a select element
                    createNode( 'select',

                        // Map through the months collection
                        monthsCollection.map( function( month, monthIndex ) {

                            // Create a dom string node for each option
                            return createNode( 'option',

                                // With the month and no classes
                                month, 0,

                                // Set the value and selected index
                                'value=' + monthIndex + ( TIME_FOCUSED.MONTH == monthIndex ? ' selected' : '' ) +

                                // Plus the disabled attribute if month is disabled
                                ( isMonthDisabled( monthIndex, TIME_FOCUSED.YEAR ) ? ' disabled' : '' )
                            )
                        }),

                        // The month selector class
                        CLASSES.selectMonth,

                        // And some tabindex
                        getTabindexState()

                    // Otherwise just return the month focused
                    ) : createNode( STRING_DIV, monthsCollection[ TIME_FOCUSED.MONTH ], CLASSES.month )
            } //createMonthLabel


            /**
             * Create the year label
             */
            function createYearLabel() {

                var
                    yearFocused = TIME_FOCUSED.YEAR,
                    yearsInSelector = SETTINGS.yearSelector


                // If there is a need for a years selector
                // then create a dropdown within the valid range
                if ( yearsInSelector ) {

                    // If year selector setting is true, default to 5.
                    // Otherwise divide the years in selector in half
                    // to get half before and half after
                    yearsInSelector = yearsInSelector === true ? 5 : ~~( yearsInSelector / 2 )

                    var
                        // Create a collection to hold the years
                        yearsCollection = [],

                        // The lowest year possible is the difference between
                        // the focused year and the number of years in the selector
                        lowestYear = yearFocused - yearsInSelector,

                        // The first year is the lower of the two numbers:
                        // the lowest year or the minimum year.
                        firstYear = getNumberInRange( lowestYear, LIMIT_MIN.YEAR ),

                        // The highest year is the sum of the focused year
                        // and the years in selector plus the left over years.
                        highestYear = yearFocused + yearsInSelector + ( firstYear - lowestYear ),

                        // The last year is the higher of the two numbers:
                        // the highest year or the maximum year.
                        lastYear = getNumberInRange( highestYear, LIMIT_MAX.YEAR, 1 )


                    // In case there are leftover years to put in the selector,
                    // we need to get the lower of the two numbers:
                    // the lowest year minus leftovers, or the minimum year
                    firstYear = getNumberInRange( lowestYear - ( highestYear - lastYear ), LIMIT_MIN.YEAR )


                    // Add the years to the collection by looping through the range
                    for ( var index = 0; index <= lastYear - firstYear; index += 1 ) {
                        yearsCollection.push( firstYear + index )
                    }


                    // Create the dom string node for a select element
                    return createNode( 'select',

                        // Map through the years collection
                        yearsCollection.map( function( year ) {

                            // Create a dom string node for each option
                            return createNode( 'option',

                                // With the year and no classes
                                year, 0,

                                // Set the value and selected index
                                'value=' + year + ( yearFocused == year ? ' selected' : '' )
                            )
                        }),

                        // The year selector class
                        CLASSES.selectYear,

                        // And some tabindex
                        getTabindexState()
                    )
                }


                // Otherwise just return the year focused
                return createNode( STRING_DIV, yearFocused, CLASSES.year )
            } //createYearLabel


            /**
             * Create the calendar table body
             */
            function createTableBody() {

                var
                    // The loop date object
                    timeObj,

                    // A pseudo index will be the divider between
                    // the previous month and the focused month
                    pseudoIndex,

                    // An array that will hold the classes
                    // and binding for each looped date
                    classAndBinding,

                    // Collection of the dates visible on the calendar
                    // * This gets discarded at the end
                    calendarDates = [],

                    // Weeks visible on the calendar
                    calendarWeeks = '',

                    // Count the number of days in the focused month
                    // by getting the 0-th date of the next month
                    countMonthDays = createTimeObj([ TIME_FOCUSED.YEAR, TIME_FOCUSED.MONTH + 1, 0 ]).DATE,

                    // Count the days to shift the start of the month
                    // by getting the day the first of the month falls on
                    // and subtracting 1 to compensate for day 1index
                    // or 2 if "Monday" should be the first day.
                    countShiftby = createTimeObj([ TIME_FOCUSED.YEAR, TIME_FOCUSED.MONTH, 1 ]).DAY + ( SETTINGS.firstDay ? -2 : -1 )


                // If the count to shift by is less than the first day
                // of the month, then add a week.
                countShiftby += countShiftby < -1 ? 7 : 0


                // Go through all the days in the calendar and map a calendar date
                for ( var index = 0; index < DAYS_IN_CALENDAR; index += 1 ) {

                    // Get the distance between the index and the count
                    // to shift by. This will serve as the separator
                    // between the previous, current, and next months.
                    pseudoIndex = index - countShiftby


                    // Create a time object with a negative or positive pseudoIndex
                    timeObj = createTimeObj([ TIME_FOCUSED.YEAR, TIME_FOCUSED.MONTH, pseudoIndex ])


                    // Set the date class and bindings on the looped date.
                    // If the pseudoIndex is greater than zero,
                    // and less or equal to the days in the month,
                    // we need dates from the focused month.
                    classAndBinding = createNodeClassAndBinding( timeObj, [ CLASSES.day, pseudoIndex > 0 && pseudoIndex <= countMonthDays ? CLASSES.infocus : CLASSES.outfocus ] )


                    // Create the looped date wrapper,
                    // and then create the table cell wrapper
                    // and finally pass it to the calendar array
                    calendarDates.push( createNode( 'td', createNode( STRING_DIV, timeObj.DATE, classAndBinding[ 0 ], classAndBinding[ 1 ] ) ) )


                    // Check if it's the end of a week.
                    // * We add 1 for 0index compensation
                    if ( ( index % DAYS_IN_WEEK ) + 1 == DAYS_IN_WEEK ) {

                        // Wrap the week and append it into the calendar weeks
                        calendarWeeks += createNode( 'tr', calendarDates.splice( 0, DAYS_IN_WEEK ) )
                    }

                } //endfor



                // Join the dates and wrap the calendar body
                return createNode( 'tbody', calendarWeeks, CLASSES.body )
            } //createTableBody


            /**
             * Create the class and data binding for a time object of a node.
             * Returns an array with 2 items:
             * 1) The classes string
             * 2) The data binding string
             */
            function createNodeClassAndBinding( timeObj, defaultKlasses ) {

                var
                    // State check for time being enabled/disabled
                    isTimeDisabled,

                    // The data binding
                    dataBinding,

                    // Create a collection for the classes
                    // with the default classes already included
                    klassCollection = defaultKlasses || []


                // If it's less than the minimum limit or greater than the maximum limit,
                // or if there are times to disable and this time object is one of them,
                // flip the "disabled" state to truthy and add the "disabled" class
                if ( timeObj.TIME < LIMIT_MIN.TIME || timeObj.TIME > LIMIT_MAX.TIME || ( TIMES_TO_DISABLE && TIMES_TO_DISABLE.filter( DISABLED_TIMES, timeObj ).length ) ) {
                    isTimeDisabled = 1
                    klassCollection.push( CLASSES.disabled )
                }


                // If it's the highlighted time, add the class
                if ( timeObj.TIME == TIME_HIGHLIGHTED.TIME ) {
                    klassCollection.push( CLASSES.highlighted )
                }


                // If it's the selected time, add the class
                if ( timeObj.TIME == TIME_SELECTED.TIME ) {
                    klassCollection.push( CLASSES.selected )
                }


                // Only for the time picker
                if ( IS_TIME_PICKER ) {

                    // If it's the viewset time for focus, add the class
                    if ( timeObj.TIME == TIME_FOCUSED.TIME ) {
                        klassCollection.push( CLASSES.viewset )
                    }

                    // The time data binding
                    dataBinding = [
                        timeObj.HOUR,
                        timeObj.MINS
                    ].join( ':' )
                }

                // Only for the date picker
                else {

                    // If it's today, add the class
                    if ( timeObj.TIME == NOW.TIME ) {
                        klassCollection.push( CLASSES.now )
                    }

                    // The date data binding
                    dataBinding = [
                        timeObj.YEAR,
                        timeObj.MONTH + 1, // add 1 to display an accurate date
                        timeObj.DATE
                    ].join( '/' )
                }


                // Return an array with the classes and data binding
                return [

                    // The classes joined by a single whitespace
                    klassCollection.join( ' ' ),

                    // And the data binding based on its "disabled" state
                    'data-' + ( isTimeDisabled ? 'disabled' : 'pick' ) + '=' + dataBinding
                ]
            } //createTimeObjClassAndBinding


            /**
             * Create the "today" and "clear" buttons
             */
            function createTodayAndClear() {
                return createNode( 'button', SETTINGS.today, CLASSES.buttonToday, 'data-pick=' + getTimeFormatted( 'yyyy/mm/dd', NOW ) + ' ' + getTabindexState() ) + createNode( 'button', SETTINGS.clear, CLASSES.buttonClear, 'data-clear=1 ' + getTabindexState() )
            } //createTodayAndClear


            /**
             * Create the calendar specific items
             */
            function createCalendar() {

                // The calendar header
                return createNode( STRING_DIV,

                    // The prev/next month tags
                    // * Truthy argument creates "next" tag
                    createMonthNav() + createMonthNav( 1 ) +

                    // Create the month label
                    createMonthLabel( SETTINGS.showMonthsFull ? SETTINGS.monthsFull : SETTINGS.monthsShort ) +

                    // Create the year label
                    createYearLabel(),

                    // The header class
                    CLASSES.header
                 ) +

                // The calendar table with table head
                // and a new calendar table body
                createNode( 'table', [ TABLE_HEAD, createTableBody() ], CLASSES.table ) +

                // Create the "today" and "clear" buttons
                createNode( STRING_DIV, createTodayAndClear(), CLASSES.footer )
            } //createCalendar


            /**
             * Create the list of times using the interval
             */
            function createClockList() {

                var timeObj, loopTime, classAndBinding,
                    list = ''

                for ( loopTime = LIMIT_MIN.TIME; loopTime <= LIMIT_MAX.TIME; loopTime += SETTINGS.interval ) {
                    timeObj = createTimeObj( loopTime )
                    classAndBinding = createNodeClassAndBinding( timeObj, [ CLASSES.listItem ] )
                    list += createNode( 'li',
                        getTimeFormatted( 0, timeObj ),
                        classAndBinding[ 0 ],
                        classAndBinding[ 1 ]
                    )
                }

                return list
            } //createClockList


            /**
             * Create the clock specific items
             */
            function createClock() {
                return createNode( 'ul',
                    createClockList(),
                    CLASSES.list
                ) //endreturn
            } //createClock


            /**
             * Create the wrapped picker using the collection
             * of all picker items and a new clock or calendar
             */
            function createWrappedPicker() {

                // Create a picker wrapper node
                return createNode( STRING_DIV,

                    // Create a picker frame
                    createNode( STRING_DIV,

                        // Create a picker box node
                        createNode( STRING_DIV,

                            IS_TIME_PICKER ? createClock() : createCalendar(),

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
             * Get the number that's allowed within an upper or lower limit.
             * * A truthy third argument tests against the upper limit.
             */
            function getNumberInRange( number, limit, upper ) {

                // If we need to test against the upper limit
                // and number is less than the limit,
                // or we need to test against the lower limit
                // and number is more than the limit,
                // return the number. Otherwise return the limit.
                return ( upper && number < limit ) || ( !upper && number > limit ) ? number : limit
            } //getNumberInRange


            /**
             * Check if the month is within the time limits.
             */
            function isMonthDisabled( month, year ) {

                // True if the month is less than the min limit or greater than the max limit
                return ( year <= LIMIT_MIN.YEAR && month < LIMIT_MIN.MONTH ) || ( year >= LIMIT_MAX.YEAR && month > LIMIT_MAX.MONTH )
            } //isMonthDisabled


            /**
             * Get the tabindex based on the picker open/closed state
             */
            function getTabindexState() {
                return 'tabindex=' + ( PICKER.isOpen ? 0 : -1 )
            }


            /**
             * Get a time object in any format. Defaults to getting the superficially selected time.
             */
            function getTimeFormatted( format, timeObj ) {

                // Go through all the time formats and convert the format passed
                // into an array to map which we join into a string at the end.
                return TIME_FORMATS.toArray( format || SETTINGS.format ).map( function( value ) {

                    // Trigger the time formats function
                    // or just return value itself.
                    return triggerFunction( TIME_FORMATS[ value ], timeObj || TIME_SELECTED ) || value.replace( /^!/, '' )
                }).join( '' )
            } //getTimeFormatted


            /**
             * Set a time as selected or superficially selected
             */
            function setTimeSelected( timeObj, isSuperficial ) {

                // Stop if it's not a valid time object
                if ( isNaN( timeObj.TIME ) ) return

                // Set the target as the highlight
                TIME_HIGHLIGHTED = timeObj

                // Set the target as the focus
                TIME_FOCUSED = timeObj

                // If it's not just a superficial selection,
                // update the input elements values
                if ( !isSuperficial ) {
                    setElementsValue( timeObj )
                }

                // Then render a new picker
                renderPicker()
            } //setTimeSelected


            /**
             * Set the time in the input element and trigger a change event
             */
            function setElementsValue( timeObj ) {

                // If there's a time targeted, update the selected time
                TIME_SELECTED = timeObj || TIME_SELECTED

                // Set the element value as the formatted time
                // if there was a time targeted. Otherwise clear it.
                // And then broadcast a change event.
                $ELEMENT.val( timeObj ? getTimeFormatted() : '' ).trigger( 'change' )

                // Trigger the onSet method within scope of the picker
                triggerFunction( SETTINGS.onSet, P )
            } //setElementsValue


            /**
             * Find something within the picker holder
             */
            function $findInHolder( klass ) {
                return $HOLDER.find( '.' + klass )
            } //$findInHolder


            /**
             * Show a time in view on the picker.
             */
            function showInView( monthOrHour, yearOrMinutes ) {

                // Ensure we have a year or minutes to work with.
                yearOrMinutes = yearOrMinutes || IS_TIME_PICKER ? 0 : TIME_FOCUSED.YEAR

                // Create a validated time and set it as focused time.
                TIME_FOCUSED = createValidatedTime( IS_TIME_PICKER ? [ monthOrHour, yearOrMinutes ] : [ yearOrMinutes, monthOrHour, 1 ] )

                // Then render a new picker
                renderPicker()
            } //showInView


            /**
             * Toggle the picker elements as "tab-able" by mapping
             * through the picker items and updating the tabindex.
             */
            function togglePickerElements( tabindex ) {
                PICKER.items.map( function( item ) {
                    if ( item ) item.tabIndex = tabindex
                })
            } //togglePickerElements


            /**
             * Get an updated collection of picker items.
             * The time picker has no items so returns an empty array.
             */
            function getUpdatedPickerItems() {

                // If it's a time picker, make sure the "viewset" node is in view
                // and then return an empty array because it has no picker items.
                if ( IS_TIME_PICKER ) {
                    $HOLDER[ 0 ].scrollTop = $findInHolder( CLASSES.viewset ).position().top - ~~( $HOLDER[ 0 ].clientHeight / 4 )
                    return []
                }

                return [

                    // The "today" button
                    $findInHolder( CLASSES.buttonToday )[ 0 ],

                    // The "clear" button
                    $findInHolder( CLASSES.buttonClear )[ 0 ],

                    // The month selector
                    $findInHolder( CLASSES.selectMonth ).on({

                        // *** For iOS ***
                        click: eventPreventPropagation,

                        // Bind the change event
                        change: function() {

                            // Show the month by floating the option selected
                            showInView( +this.value )

                            // Find the new month selector and focus back on it
                            $findInHolder( CLASSES.selectMonth ).focus()
                        }
                    })[ 0 ],

                    // The year selector
                    $findInHolder( CLASSES.selectYear ).on({

                        // *** For iOS ***
                        click: eventPreventPropagation,

                        // Bind the change event
                        change: function() {

                            // Show the year by floating the option selected and month in focus
                            showInView( TIME_FOCUSED.MONTH, +this.value )

                            // Find the new year selector and focus back on it
                            $findInHolder( CLASSES.selectYear ).focus()
                        }
                    })[ 0 ]
                ]
            } //getUpdatedPickerItems


            /**
             * Render a new picker
             */
            function renderPicker() {

                // Create a new wrapped calendar and place it within the holder
                $HOLDER.html( createWrappedPicker() )

                // Update the calendar items
                PICKER.items = getUpdatedPickerItems()
            } //renderPicker


            /**
             * Prevent an event from propagating further
             */
            function eventPreventPropagation( event ) {
                event.stopPropagation()
            } //eventPreventPropagation


            // Return a new initialized picker
            return new P.init()
        } //Picker





    /**
     * Helper functions
     */

    // Check if a value is a function and trigger it, if that
    function triggerFunction( callback, scope ) {
        if ( typeof callback == 'function' ) {
            return callback.call( scope )
        }
    }

    // Return numbers below 10 with a leading zero
    function leadZero( number ) {
        return ( number < 10 ? '0': '' ) + number
    }

    // Create a dom node string
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
     * Map through the each picker type and extend jQuery
     */
    [ 'pickadate', 'pickatime' ].map( function( picker, index ) {

        // Create the jQuery extension
        $.fn[ picker ] = function( options ) {

            // Merge the options with a deep copy
            options = $.extend( true, {}, $.fn[ picker ].defaults, options )

            // Just stop if the picker should be disabled
            if ( options.disablePicker ) return this

            return this.each( function() {
                var $this = $( this )
                if ( this.nodeName == 'INPUT' && !$this.data( picker ) ) {
                    $this.data( picker, new Picker( $this, options, index ) )
                }
            })
        }
    })



    /**
     * Default options for the date picker
     */
    $.fn.pickadate.defaults = {

        // Strings (with translation support) for months and weekdays
        monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        weekdaysFull: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

        // Display strings
        monthPrev: '&#9664;',
        monthNext: '&#9654;',
        showMonthsFull: 1,
        showWeekdaysShort: 1,

        // Today and clear
        today: 'Today',
        clear: 'Clear',

        // The format to show on the `input` element
        format: 'd mmmm, yyyy',

        // The format to send to the server
        formatSubmit: 0,

        // Hidden `input` element name suffix
        hiddenSuffix: '_submit',

        // First day of the week: 0 = Sunday, 1 = Monday
        firstDay: 0,

        // Month & year dropdown selectors
        monthSelector: 0,
        yearSelector: 0,

        // The time limits
        minLimit: 0,
        maxLimit: 0,

        // Times to disable
        disable: 0,

        // Disable for browsers with native date support
        disablePicker: 0,

        // Events
        onOpen: 0,
        onClose: 0,
        onSet: 0,
        onStart: 0,


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

        // The interval between each time
        interval: 30,

        // The format to show on the `input` element
        format: 'h:i A',

        // The format to send to the server
        formatSubmit: 0,

        // Hidden element name suffix
        hiddenSuffix: '_submit',

        // The time limits
        minLimit: 0,
        maxLimit: [ HOURS_IN_DAY , -1 ],

        // Times to disable
        disable: 0,

        // Disable for browsers with native date support
        disablePicker: 0,

        // Events
        onOpen: 0,
        onClose: 0,
        onSet: 0,
        onStart: 0,


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



})( jQuery, document );





