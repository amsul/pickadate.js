/*!
 * pickadate.js v1.1.5 - 22 November, 2012
 * By Amsul (http://amsul.ca)
 * Hosted on https://github.com/amsul/pickadate.js
 */

/**
 * TODO: month & year dropdown selectors
 * TODO: scroll calendar into view
 *
 * improve: getDateRange
 * improve: setDateSelected
 */

/*jshint
   debug: true,
   devel: true,
   browser: true,
   asi: true
 */



;(function( $, window, document, undefined ) {

    'use strict';



    var

        // Globals & constants
        DAYS_IN_WEEK = 7,
        WEEKS_IN_CALENDAR = 6,
        DAYS_IN_CALENDAR = WEEKS_IN_CALENDAR * DAYS_IN_WEEK,

        STRING_DIV = 'div',
        STRING_TR = 'tr',
        STRING_DATE_DIVIDER = '/',

        STRING_PREV = 'prev',
        STRING_NEXT = 'next',

        STRING_PREFIX_DATEPICKER = 'datepicker--',

        NAMESPACED_CLICK = 'click.P',

        $window = $( window ),


        /**
         * Helper functions
         */

        // Check if a value is an array
        isArray = Array.isArray || function( value ) {
            return {}.toString.call( value ) == '[object Array]'
        },

        // Check if a value is a function
        // and trigger it, if that
        triggerFunction = function( func, scope ) {
            if ( typeof func == 'function' ) {
                func.call( scope )
            }
        },

        // Return numbers below 10 with a leading zero
        leadZero = function( number ) {
            return ( ( number < 10 ) ? '0': '' ) + number
        },

        // Create a dom node string
        create = function( wrapper, item, klass, data ) {

            // If the item is an array, do a join
            item = ( isArray( item ) ) ? item.join( '' ) : item

            // Check for a data binding
            data = ( data && data.name ) ? ' data-' + data.name + '="' + data.value + '"' : ''

            // Check for a class
            klass = ( klass ) ? ' class="' + klass + '"' : ''

            // Return the wrapped item
            return '<' + wrapper + data + klass + '>' + item + '</' + wrapper + '>'
        }, //create

        // Create a calendar date
        createDate = function( datePassed ) {

            var newDate


            // If the date passed is an array
            if ( isArray( datePassed ) ) {

                // Create the new date
                newDate = new Date( datePassed[ 0 ], datePassed[ 1 ], datePassed[ 2 ] )
            }


            // If datePassed is true
            else if ( datePassed === true ) {

                // Set new date to today
                newDate = new Date()

                // Set the time to midnight (for comparison purposes)
                newDate.setHours( 0, 0, 0, 0 )
            }


            // If datePassed is a number
            else if ( !isNaN( datePassed ) ) {

                // Create a new date with it
                newDate = new Date( datePassed )
            }


            // Return the calendar date object
            return {
                YEAR: newDate.getFullYear(),
                MONTH: newDate.getMonth(),
                DATE: newDate.getDate(),
                DAY: newDate.getDay(),
                TIME: newDate.getTime()
            }
        }, //createDate




        /**
         * Create a Picker
         */
        Picker = function( $ELEMENT, SETTINGS ) {

            var
                // The calendar holder
                $HOLDER,

                // The hidden input element
                ELEMENT_HIDDEN,

                // Store the node passed
                ELEMENT = (function( element ) {

                    // Convert into a regular text input
                    // to remove user-agent stylings
                    element.type = 'text'

                    // Set the element as readonly
                    element.readOnly = true

                    // If the element isn't an input field
                    // ensure that we create a hidden element
                    if ( element.nodeName != 'INPUT' ) {
                        SETTINGS.format_submit = SETTINGS.format_submit || 'yyyy-mm-dd'
                    }

                    return element
                })( $ELEMENT[ 0 ] ),

                // Today
                DATE_TODAY = getDateToday(),

                // The date selected
                DATE_SELECTED = getDateSelected(),

                // The minimum selectable date
                DATE_MIN = getDateRange( SETTINGS.date_min ),

                // The maximum selectable date
                // * A truthy second argument gets max date
                DATE_MAX = getDateRange( SETTINGS.date_max, 1 ),

                // The month in focus on the calendar
                MONTH_FOCUSED = getMonthFocused(),

                // The date in various formats
                DATE_FORMATS = {
                    d: function() { return DATE_SELECTED.DATE },
                    dd: function() { return leadZero( DATE_SELECTED.DATE ) },
                    ddd: function() { return SETTINGS.weekdays_short[ DATE_SELECTED.DAY ] },
                    dddd: function() { return SETTINGS.weekdays_full[ DATE_SELECTED.DAY ] },
                    m: function() { return DATE_SELECTED.MONTH + 1 },
                    mm: function() { return leadZero( DATE_SELECTED.MONTH + 1 ) },
                    mmm: function() { return SETTINGS.months_short[ DATE_SELECTED.MONTH ] },
                    mmmm: function() { return SETTINGS.months_full[ DATE_SELECTED.MONTH ] },
                    yy: function() { return DATE_SELECTED.YEAR.toString().substr( 2, 2 ) },
                    yyyy: function() { return DATE_SELECTED.YEAR },

                    // Create an array by splitting the format passed
                    toArray: function( format ) { return format.split( /(?=\b)(d{1,4}|m{1,4}|y{4}|yy)+(\b)/g ) }
                }, //DATE_FORMATS


                // Create a calendar object and
                // immediately initialize it
                CALENDAR = createCalendar().init()



            /**
             * Create a calendar object
             */
            function createCalendar() {

                var

                    /**
                     * The hidden input value to keep
                     * the value to send use on the server-side
                     */
                    hiddenInput = (function( formatSubmit ) {

                        // Check if there's a format for submit value.
                        // Otherwise return null
                        return ( formatSubmit ) ? (

                            // Create the hidden input value using
                            // the name of the original input with a suffix.
                            // And then update the value with whatever
                            // is entered in the input on load
                            ELEMENT_HIDDEN = $( '<input type=hidden name=' + ELEMENT.name + '_submit>' ).
                                val( ( ELEMENT.value ) ? getDateFormatted( formatSubmit ) : '' )[ 0 ]
                        ) : null
                    })( SETTINGS.format_submit ),


                    /**
                     * Create the calendar table head
                     * that contains all the weekday labels
                     */
                    tableHead = (function() {

                        var
                            wrappedTableHead = function( weekday ) {
                                return create( 'th', weekday, SETTINGS.klass.weekdays )
                            },
                            weekdaysCollection = ( SETTINGS.show_weekdays_short ) ? SETTINGS.weekdays_short : SETTINGS.weekdays_full

                        // If the first day should be Monday
                        if ( SETTINGS.first_day ) {

                            // Grab Sunday and push it to the end of the collection
                            weekdaysCollection.push( weekdaysCollection.splice( 0, 1 )[ 0 ] )
                        }

                        // Go through each day of the week
                        // and return a wrapped header row.
                        // Take the result and apply another
                        // table head wrapper to group
                        return create( 'thead', create( STRING_TR, weekdaysCollection.map( wrappedTableHead ) ) )
                    })(),


                    /**
                     * Create the calendar table body
                     */
                    createTableBody = function() {

                        var
                            // The loop date object
                            loopDate,

                            // A pseudo index will be the divider
                            // between the previous month and the
                            // focused month
                            pseudoIndex,

                            // An array that will holde the
                            // classes and binding for each
                            // looped date
                            classAndBinding,

                            // Boolean to check if looped day is
                            // of the month in focus or not.
                            // Initially set to true
                            isMonthFocused = true,

                            // Collection of the dates visible on the calendar
                            // * This gets discarded at the end
                            calendarDates = [],

                            // Collection of weeks visible on calendar
                            calendarWeeks = [],

                            // Count the number of days
                            // in the focused month
                            countMonthDays = getCountDaysInMonth( MONTH_FOCUSED.YEAR, MONTH_FOCUSED.MONTH ),

                            // Count the days to shift the start of the month
                            countShiftby = getCountShiftDays( MONTH_FOCUSED.DATE, MONTH_FOCUSED.DAY ),


                            // Set the class and binding for each looped date.
                            // Returns an array with 2 items:
                            // 1) The classes string
                            // 2) The data binding object
                            setDateClassAndBinding = function( loopDate ) {

                                var
                                    // Boolean check for date state
                                    isDateDisabled = false,

                                    // Create a collection for the classes
                                    // with the default class already included
                                    klassCollection = [ SETTINGS.klass.calendar_date ]


                                // Set the class as in or out of focus
                                // depending on the month
                                klassCollection.push( ( isMonthFocused ) ? SETTINGS.klass.day_infocus : SETTINGS.klass.day_outfocus )


                                // If it's less than the minimum date
                                // or greater than the maximum date
                                if ( loopDate.TIME < DATE_MIN.TIME || loopDate.TIME > DATE_MAX.TIME ) {
                                    isDateDisabled = true
                                    klassCollection.push( SETTINGS.klass.day_disabled )
                                }


                                // If it's today, add the class
                                if ( loopDate.TIME == DATE_TODAY.TIME ) {
                                    klassCollection.push( SETTINGS.klass.day_today )
                                }


                                // If it's the selected date, add the class
                                if ( loopDate.TIME == DATE_SELECTED.TIME ) {
                                    klassCollection.push( SETTINGS.klass.day_selected )
                                }


                                // Return an array with the classes and data binding
                                return [

                                    // Return the joined collection
                                    klassCollection.join( ' ' ),

                                    // Create the data binding object
                                    // with the value as a string
                                    {
                                        name: ( isDateDisabled ) ? 'disabled' : 'date',
                                        value: [
                                            loopDate.YEAR,
                                            loopDate.MONTH + 1,  // We do +1 just to give an appropriate display
                                            loopDate.DATE,
                                            loopDate.DAY,
                                            loopDate.TIME
                                        ].join( STRING_DATE_DIVIDER )
                                    }
                                ]
                            } //setDateClassAndBinding


                        // Go through all the days in the calendar
                        // and map a calendar date
                        for ( var index = 0; index < DAYS_IN_CALENDAR; index += 1 ) {

                            // Get the distance between the index
                            // and the count to shift by.
                            // This will serve as the separator
                            // between the previous, current,
                            // and next months.
                            pseudoIndex = index - countShiftby


                            // If the pseudoIndex is zero or negative,
                            // we need the dates from the previous month.
                            // If the pseudoIndex is greater than the days
                            // in the month, we need dates from the next month.
                            // Otherwise we need dates from the focused month.
                            isMonthFocused = ( pseudoIndex <= 0 || pseudoIndex > countMonthDays ) ? false : true


                            // Create a calendar date with
                            // a negative or positive pseudoIndex
                            loopDate = createDate([ MONTH_FOCUSED.YEAR, MONTH_FOCUSED.MONTH, pseudoIndex ])


                            // Set the date class and bindings on the looped date
                            classAndBinding = setDateClassAndBinding( loopDate )


                            // Create the looped date wrapper,
                            // and then create the table cell wrapper
                            // and finally pass it to the calendar array
                            calendarDates.push( create( 'td', create( STRING_DIV, loopDate.DATE, classAndBinding[ 0 ], classAndBinding[ 1 ] ) ) )


                            // Check if it's the end of a week.
                            // * We add 1 for 0index compensation
                            if ( ( index % DAYS_IN_WEEK ) + 1 == DAYS_IN_WEEK ) {

                                // Wrap the week and pass it into the calendar weeks
                                calendarWeeks.push( create( STRING_TR, calendarDates.splice( 0, DAYS_IN_WEEK ) ) )
                            }

                        } //endfor



                        // Join the dates and wrap the calendar body
                        return create( 'tbody', calendarWeeks, SETTINGS.klass.calendar_body )
                    }, //createTableBody


                    /**
                     * Get the nav for next and previous
                     * month as a string
                     */
                    createMonthNav = function() {

                        var
                            createMonthTag = function( tagName ) {

                                // If the tag is STRING_PREV, and month focused is
                                // less or equal to the minimum date month,
                                // or if tag is STRING_NEXT month focused is
                                // greater or equal to the maximum date month,
                                // return an empty string
                                if ( DATE_MIN && ( tagName == STRING_PREV && MONTH_FOCUSED.MONTH <= DATE_MIN.MONTH && MONTH_FOCUSED.YEAR <= DATE_MIN.YEAR ) || DATE_MAX && ( tagName == STRING_NEXT && MONTH_FOCUSED.MONTH >= DATE_MAX.MONTH && MONTH_FOCUSED.YEAR >= DATE_MAX.YEAR ) ) {
                                    return ''
                                }

                                // Otherwise, return the created tag
                                return create( STRING_DIV, SETTINGS[ 'month_' + tagName ], SETTINGS.klass[ 'month_' + tagName ], { name: 'nav', value: tagName } )
                            }

                        return createMonthTag( STRING_PREV ) + createMonthTag( STRING_NEXT )
                    }, //createMonthNav


                    /**
                     * Get the focused month as a label
                     * based on the settings
                     */
                    getMonthLabel = function() {
                        return ( ( SETTINGS.show_months_full ) ? SETTINGS.months_full : SETTINGS.months_short )[ MONTH_FOCUSED.MONTH ]
                    }, //getMonthLabel


                    /**
                     * Get the default collection
                     * of items in a calendar
                     * * Depends on at least one calendar body
                     */
                    getDefaultCalendarItems = function() {
                        return [

                            // The prev/next month tags
                            create( STRING_DIV, createMonthNav(), SETTINGS.klass.month_nav ),

                            // The calendar month tag
                            create( STRING_DIV, getMonthLabel(), SETTINGS.klass.month ),

                            // The calendar year tag
                            create( STRING_DIV, MONTH_FOCUSED.YEAR, SETTINGS.klass.year )
                        ]
                    }, //getDefaultCalendarItems


                    /**
                     * Get the count of the number of days in a month
                     * given the month and year.
                     * This is calculated manually for this reason:
                     * http://jsperf.com/manual-month-days-vs-new-date
                     */
                    getCountDaysInMonth = function( year, month ) {

                        var
                            isLeap,

                            // Set flip based on if month is
                            // before or after July
                            flip = ( month > 6 ) ? true : false

                        // If it's February
                        if ( month == 1 ) {

                            // Check if it's a leap year
                            // according to: http://en.wikipedia.org/wiki/Leap_year#Algorithm
                            isLeap = ( ( ( year % 400 ) === 0 || ( year % 100 ) !== 0 ) && ( year % 4 ) === 0 )

                            // If it's a leap year
                            // then 29 otherwise 28
                            return ( isLeap ) ? 29 : 28
                        }


                        // If it's an odd month index
                        if ( month % 2 ) {

                            // If it's after July then 31
                            // otherwise 30
                            return ( flip ) ? 31 : 30
                        }


                        // If it's an even month index
                        // and it's after July then 30
                        // otherwise 31
                        return ( flip ) ? 30 : 31
                    }, //getCountDaysInMonth


                    /**
                     * Get the count of the number of
                     * days to shift the month by,
                     * given the date and day of week
                     */
                    getCountShiftDays = function( date, dayIndex ) {

                        var
                            // Get the column index for the
                            // day if month starts on 0
                            dayColumnIndexAtZero = date % DAYS_IN_WEEK,

                            // Get the difference between the actual
                            // day index and the column index at zero.
                            // Then, if the first day should be Monday,
                            // reduce the difference by 1
                            difference = dayIndex - dayColumnIndexAtZero + ( ( SETTINGS.first_day ) ? -1 : 0 )


                        // Compare the day index if the
                        // month starts on the first day
                        // with the day index
                        // the date actually falls on
                        return ( dayIndex >= dayColumnIndexAtZero ) ?

                            // If the actual position is greater
                            // shift by the difference in the two
                            difference :

                            // Otherwise shift by the adding the negative
                            // difference to the days in week
                            DAYS_IN_WEEK + difference
                    } //getCountShiftDays



                /**
                 * Return the calendar object methods
                 */
                return {


                    /**
                     * Initialize the calendar object
                     */
                    init: function() {

                        var
                            // Create a reference to this calendar object
                            calendarObject = this


                        // Create a random calendar object id
                        calendarObject.id = Math.floor( Math.random() * 1e9 )


                        // Render a new calendar
                        calendarObject.render()

                        // If the element has focus on load
                        if ( ELEMENT == document.activeElement ) {

                            // Trigger the focus handler
                            $ELEMENT.trigger( 'focus' )
                        }

                        return calendarObject
                    }, //init


                    /**
                     * Render a complete calendar
                     */
                    render: function() {

                        var
                            // Create a reference to this calendar object
                            calendarObject = this,

                            // Create the wrapped calendar
                            // using the collection of calendar items
                            // and creating a new table body
                            calendarWrapped = (function() {

                                var
                                    // First create a new calendar table body
                                    tableBody = createTableBody(),

                                    // Then get the default calendar items
                                    collection = getDefaultCalendarItems()

                                // Create the calendar table,
                                // and push it into the collection
                                collection.push( create( 'table', [ tableHead, tableBody ], SETTINGS.klass.calendar ) )

                                // Return the collection
                                // wrapped in a calendar box
                                return create( STRING_DIV,
                                    create( STRING_DIV,
                                        collection,
                                        SETTINGS.klass.calendar_box
                                    ),
                                    SETTINGS.klass.calendar_wrap
                                )
                            })() //calendarWrapped



                        // If a calendar holder already exists
                        if ( $HOLDER ) {

                            // Just replace it with the calendar string
                            $HOLDER.html( calendarWrapped )

                            // And then return
                            return calendarObject
                        }


                        // Otherwise if there's no calendar holder
                        // wrap the calendar with the holder and
                        // create the jQuery object
                        // while binding delegated events
                        $HOLDER = $( create( STRING_DIV, calendarWrapped, SETTINGS.klass.picker_holder ) ).on({
                            click: onClickCalendar
                        })


                        // Insert the calendar after the element
                        // while binding the events
                        $ELEMENT.on({

                            // On tab, close the calendar
                            keydown: function( event ) {
                                if ( event.keyCode == 9 ) {
                                    calendarObject.close()
                                }
                            },

                            // On focus, open the calendar
                            focusin: function() { calendarObject.open() }

                        }).after( [ $HOLDER, hiddenInput ] )


                        // Return the calendarObject
                        return calendarObject
                    }, //render


                    /**
                     * Open the calendar
                     */
                    open: function() {

                        var
                            // Create a reference to this calendar object
                            calendarObject = this,

                            /**
                             * Check if the click position requires
                             * the calendar to be closed
                             */
                            onClickWindow = function( event ) {

                                // If the calendar is opened
                                // and the target is not the element
                                if ( calendarObject.isOpen && ELEMENT != event.target ) {

                                    // Close the calendar
                                    calendarObject.close()
                                }
                            } //onClickWindow


                        // If it's already open, do nothing
                        if ( calendarObject.isOpen ) {
                            return calendarObject
                        }


                        // Set calendar as open
                        calendarObject.isOpen = true

                        // Add the "opened" class to the element
                        $ELEMENT.addClass( SETTINGS.klass.input_focus )

                        // Add the "opened" class to the calendar holder
                        $HOLDER.addClass( SETTINGS.klass.picker_open )

                        // Bind the click event to the window
                        $window.on( NAMESPACED_CLICK + calendarObject.id, onClickWindow )

                        // Trigger the onOpen method within calendarObject scope
                        triggerFunction( SETTINGS.onOpen, calendarObject )

                        return calendarObject
                    }, //open


                    /**
                     * Close the calendar
                     */
                    close: function() {

                        var
                            // Create a reference to this calendar object
                            calendarObject = this

                        // Set calendar as closed
                        calendarObject.isOpen = false

                        // Remove the "opened" class from the element
                        $ELEMENT.removeClass( SETTINGS.klass.input_focus )

                        // Remove the "opened" class from the calendar holder
                        $HOLDER.removeClass( SETTINGS.klass.picker_open )

                        // Unbind the click event from the window
                        $window.off( NAMESPACED_CLICK + calendarObject.id )

                        // Trigger the onClose method within calendarObject scope
                        triggerFunction( SETTINGS.onClose, calendarObject )

                        return calendarObject
                    } //close

                } //endreturn
            } //createCalendar


            /**
             * Return today's date calendar object
             */
            function getDateToday() {

                // Create a new date for today
                return DATE_TODAY || ( DATE_TODAY = createDate( true ) )
            } //getDateToday


            /**
             * Return the date that determines
             * which date is selected
             */
            function getDateSelected() {

                // If there's a date selected, return it
                // otherwise figure out the date
                return DATE_SELECTED || ( DATE_SELECTED = (function( dateEntered ) {

                    // If there's no valid date in the input,
                    // get and return today's date
                    if ( isNaN( dateEntered ) ) {
                        return DATE_TODAY
                    }

                    // Otherwise, create and return a new date
                    // using the date entered
                    return createDate( dateEntered )
                })( Date.parse( ELEMENT.value ) ))
            } //getDateSelected


            /**
             * Set a day as selected by receiving
             * the day jQuery object that was clicked
             */
            function setDateSelected( dateArray, $dayTargeted ) {

                var
                    // The calendar date targeted
                    dateTargeted,

                    // Get the selected day
                    $daySelected = findSelectedDay()


                // If no date was passed, just return it
                if ( !dateArray ) {
                    return false
                }


                // Create the targetted date from the
                // date array passed and float the values
                dateTargeted = {
                    YEAR: +dateArray[ 0 ],
                    MONTH: +dateArray[ 1 ] - 1, // We minus 1 to get the month at 0index
                    DATE: +dateArray[ 2 ],
                    DAY: +dateArray[ 3 ],
                    TIME: +dateArray[ 4 ]
                }


                // Set the target as the newly selected date
                DATE_SELECTED = dateTargeted


                // If it's the same month
                if ( dateTargeted.MONTH == MONTH_FOCUSED.MONTH ) {

                    // Remove the "selected" state from the selected node
                    $daySelected.removeClass( SETTINGS.klass.day_selected )

                    // Add the "selected" state to the targeted node
                    $dayTargeted.addClass( SETTINGS.klass.day_selected )
                }


                // Otherwise if there's been a change in month
                else {

                    // Set the target as the newly focused month
                    MONTH_FOCUSED = dateTargeted

                    // Render a new calendar
                    CALENDAR.render()
                }


                // Set the element value as the formatted date
                // and then broadcast the change event
                $ELEMENT.
                    val( getDateFormatted() ).
                    trigger( 'change' )


                // If there's a hidden input
                if ( ELEMENT_HIDDEN ) {

                    // Set the hidden value using the submit format
                    ELEMENT_HIDDEN.value = getDateFormatted( SETTINGS.format_submit )
                }


                // Trigger the onSelect method within CALENDAR scope
                triggerFunction( SETTINGS.onSelect, CALENDAR )

                // Close the calendar
                CALENDAR.close()
            } //setDateSelected


            /**
             * Return the date that determines
             * the month to show in focus
             */
            function getMonthFocused() {

                // If there's a date set to focus, return it
                // otherwise focus on the date selected
                return MONTH_FOCUSED || ( MONTH_FOCUSED = DATE_SELECTED )
            } //getMonthFocused


            /**
             * Set the date that determines
             * the month to show in focus
             */
            function setMonthFocused( year, month ) {

                // Create and return the month focused
                // * We set the date to first of month
                //   because date doesn't matter here
                return ( MONTH_FOCUSED = createDate([ year, month, 1 ]) )
            } //setMonthFocused


            /**
             * Return the minimum or maximum date allowed on the calendar
             */
            function getDateRange( limit, upper ) {

                // Return false if there is no limit
                if ( !limit ) { return false }

                // If the limit is an array,
                // construct the date while fixing month 0index
                if ( isArray( limit ) ) {
                    return createDate([ limit[ 0 ], limit[ 1 ] - 1, limit[ 2 ] ])
                }

                // Check if a positive number was passed
                // for upper limit only
                if ( upper && !isNaN( limit ) && limit > 0 ) {

                    // Create a calendar date while
                    // setting the maximum date by adding the number
                    return createDate([ DATE_TODAY.YEAR, DATE_TODAY.MONTH, DATE_TODAY.DATE + limit ])
                }

                // Otherwise set the minimum date to today
                // and return the new calendar date
                return DATE_TODAY
            } //getDateRange


            /**
             * Return selected date in the
             * correct format
             */
            function getDateFormatted( format ) {

                // Go through the date formats array and
                // convert the format passed into an array to map
                return DATE_FORMATS.toArray( format || SETTINGS.format ).map( function( value ) {

                    // Check if the format exists and
                    // invoke the function to get the value
                    // otherwise just return value itself
                    return ( DATE_FORMATS[ value ] ) ? DATE_FORMATS[ value ]() : value
                }).join( '' )
            } //getDateFormatted


            /**
             * Find the day element node
             * of the selected day
             */
            function findSelectedDay() {
                return $HOLDER.find( '.' + SETTINGS.klass.day_selected )
            } //findSelectedDay


            /**
             * Change the month visible
             * on the calendar
             */
            function changeMonth( relativeDirection ) {

                // Set the month to show in focus
                setMonthFocused( MONTH_FOCUSED.YEAR, MONTH_FOCUSED.MONTH + relativeDirection )

                // Then render a new calendar
                CALENDAR.render()

                // Trigger the onChangeMonth method within CALENDAR scope
                triggerFunction( SETTINGS.onChangeMonth, CALENDAR )
            } //changeMonth


            /**
             * Update the selected day
             * when receiving a delegated
             * click on the calendar holder
             */
            function onClickCalendar( event ) {

                var
                    direction,

                    // Get the jQuery target
                    $target = $( event.target ),

                    // Get the target data
                    targetData = $target.data()


                // Stop the event from bubbling up to the window
                event.stopPropagation()


                // If there's a date provided
                if ( targetData.date ) {

                    // Set the selected day
                    setDateSelected( targetData.date.split( STRING_DATE_DIVIDER ), $target )

                    return
                }


                // If there's a navigator provided
                if ( targetData.nav ) {

                    direction = ( targetData.nav == STRING_PREV ) ? -1 : 1

                    // Change the month according to direction
                    changeMonth( direction )
                }


                // Put focus back onto the element
                $ELEMENT.focus()
            } //onClickCalendar




            // Return the exports
            return {
                open: CALENDAR.open,
                close: CALENDAR.close
            }
        } //Picker



    /**
     * Extend jQuery
     */
    $.fn.pickadate = function( options ) {

        var namespacedWidget = 'widgets.pickadate'

        // Merge the options with a deep copy
        options = $.extend( true, {}, $.fn.pickadate.defaults, options )

        // Check if it should be disabled
        // for browsers that natively support `type=date`
        if ( options.disable_picker ) { return this }

        return this.each( function() {
            var $this = $( this )
            if ( !$this.data( namespacedWidget ) ) {
                $this.data( namespacedWidget, new Picker( $this, options ) )
            }
        })
    } //pickadate


    /**
     * Default options for the picker
     */
    $.fn.pickadate.defaults = {

        months_full: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        months_short: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],

        weekdays_full: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekdays_short: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

        month_prev: '&#9664;',
        month_next: '&#9654;',

        // Date limits
        date_min: false,
        date_max: false,

        // Display strings on the calendar
        show_months_full: true,
        show_weekdays_short: true,

        // Date format to show on the input element
        format: 'd mmmm, yyyy',

        // Date format to send to the server
        format_submit: false,

        // Disable for browsers with native date support
        disable_picker: false,

        // First day of the week: 0 = Sunday, 1 = Monday
        first_day: 0,

        // Events
        onOpen: null,
        onClose: null,
        onSelect: null,
        onChangeMonth: null,


        // Classes
        klass: {

            input_focus: STRING_PREFIX_DATEPICKER + 'input__focused',

            picker_open: STRING_PREFIX_DATEPICKER + 'opened',
            picker_holder: STRING_PREFIX_DATEPICKER + 'holder',

            calendar_wrap: STRING_PREFIX_DATEPICKER + 'calendar__wrap',
            calendar_box: STRING_PREFIX_DATEPICKER + 'calendar__box',

            calendar: STRING_PREFIX_DATEPICKER + 'calendar',
            calendar_body: STRING_PREFIX_DATEPICKER + 'calendar__body',
            calendar_date: STRING_PREFIX_DATEPICKER + 'calendar__date',

            year: STRING_PREFIX_DATEPICKER + 'year',

            month: STRING_PREFIX_DATEPICKER + 'month',
            month_nav: STRING_PREFIX_DATEPICKER + 'month__nav',
            month_prev: STRING_PREFIX_DATEPICKER + 'month__prev',
            month_next: STRING_PREFIX_DATEPICKER + 'month__next',

            week: STRING_PREFIX_DATEPICKER + 'week',
            weekdays: STRING_PREFIX_DATEPICKER + 'weekday',

            day_disabled: STRING_PREFIX_DATEPICKER + 'day__disabled',
            day_selected: STRING_PREFIX_DATEPICKER + 'day__selected',
            day_today: STRING_PREFIX_DATEPICKER + 'day__today',
            day_infocus: STRING_PREFIX_DATEPICKER + 'day__infocus',
            day_outfocus: STRING_PREFIX_DATEPICKER + 'day__outfocus',

            box_months: STRING_PREFIX_DATEPICKER + 'holder__months',
            box_years: STRING_PREFIX_DATEPICKER + 'holder__years',
            box_weekdays: STRING_PREFIX_DATEPICKER + 'holder__weekdays'
        }

    } //pickadate.defaults


})( jQuery, window, document );





