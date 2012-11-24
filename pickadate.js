/*!
 * pickadate.js v1.2.4 - 23 November, 2012
 * By Amsul (http://amsul.ca)
 * Hosted on https://github.com/amsul/pickadate.js
 */

/**
 * TODO: scroll calendar into view
 * TODO: disable certain days
 * TODO: public method to pick a date
 *
 * TODO: shift year_selector if close to min/max date
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

        STRING_PREFIX_DATEPICKER = 'datepicker--',

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
        triggerFunction = function( func, scope, args ) {
            if ( typeof func == 'function' ) {
                return func.apply( scope, args )
            }
        },

        // Return numbers below 10 with a leading zero
        leadZero = function( number ) {
            return ( ( number < 10 ) ? '0': '' ) + number
        },

        // Create a dom node string
        createNode = function( wrapper, item, klass, data, attribute ) {

            // If the item is an array, do a join
            item = isArray( item ) ? item.join( '' ) : item

            // Check for a data binding
            data = data ? ' data-' + data.name + '="' + data.value + '"' : ''

            // Check for the class
            klass = klass ? ' class="' + klass + '"' : ''

            // Check for any other attributes
            attribute = attribute ? ' ' + attribute : ''

            // Return the wrapped item
            return '<' + wrapper + data + klass + attribute + '>' + item + '</' + wrapper + '>'
        }, //createNode

        // Create a `select` element string
        createSelector = function( collection, selectedIndex, klass, baseIndex, attribute ) {

            var selector = ''

            // Map through the collection
            collection.map( function( month, index ) {

                // Add a shift in index if needed
                index = baseIndex ? baseIndex + index : index

                // Create a string for the option value and
                // check if the month index matches the focused month
                var attributes = ( triggerFunction( attribute, collection, [ index ] ) || '' ) + 'value=' + index + ( selectedIndex == index ? ' selected' : '' )

                // Create the month option and add it to the selector
                selector += createNode( 'option', month, null, null, attributes )
            })

            // Create and return the select element string
            return createNode( 'select', selector, klass )
        },

        // Create a calendar date
        createDate = function( datePassed ) {

            var newDate


            // If the date passed is an array
            if ( isArray( datePassed ) ) {

                // Create the new date
                newDate = new Date( datePassed[ 0 ], datePassed[ 1 ], datePassed[ 2 ] )
            }


            // If date passed is a literal true
            else if ( datePassed === true ) {

                // Set new date to today
                newDate = new Date()

                // Set the time to midnight (for comparison purposes)
                newDate.setHours( 0, 0, 0, 0 )
            }


            // If date passed is a number
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

                    // If the element isn't an input field
                    // ensure that we create a hidden element
                    if ( element.nodeName != 'INPUT' ) {
                        SETTINGS.format_submit = SETTINGS.format_submit || 'yyyy-mm-dd'
                    }

                    // Otherwise convert into a regular text input
                    // to remove user-agent stylings and set
                    // the element as readonly
                    else {
                        element.type = 'text'
                        element.readOnly = true
                    }

                    return element
                })( $ELEMENT[ 0 ] ),

                // Today
                DATE_TODAY = getDateToday(),

                // The date selected
                DATE_SELECTED = getDateSelected(),

                // The minimum selectable date
                DATE_MIN = getDateMinOrMax( SETTINGS.date_min ),

                // The maximum selectable date
                // * A truthy second argument gets max date
                DATE_MAX = getDateMinOrMax( SETTINGS.date_max, 1 ),

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
                    namespacedClick = 'click.P',

                    /**
                     * The hidden input value to hold
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
                                val( ELEMENT.value ? getDateFormatted( formatSubmit ) : '' )[ 0 ]
                        ) : null
                    })( SETTINGS.format_submit ), //hiddenInput


                    /**
                     * Create the calendar table head
                     * that contains all the weekday labels
                     */
                    tableHead = (function() {

                        var
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
                        return createNode( 'thead',
                            createNode( STRING_TR,
                                weekdaysCollection.map( function( weekday ) {
                                    return createNode( 'th', weekday, SETTINGS.klass.weekdays )
                                })
                            )
                        ) //endreturn
                    })(), //tableHead


                    /**
                     * A collection of dates that are disabled
                     */
                    disabledDatesCollection = (function( datesCollection ) {

                        // If a collection was passed
                        // we need to create a calendar date object
                        if ( isArray( datesCollection ) ) {

                            // If the "all" flag is true,
                            // remove the flag from the collection and
                            // set the condition of which dates to disable
                            if ( datesCollection[ 0 ] === true ) {
                                createTableBody.disabled = datesCollection.shift()
                            }

                            // Map through the dates passed
                            // and return the collection
                            return datesCollection.map( function( date ) {

                                // Fix the month 0index
                                --date[ 1 ]

                                // Create the date and replace it in the collection
                                return createDate( date )
                            })
                        }
                    })( SETTINGS.dates_disabled ) //disabledDates


                /**
                 * Create the nav for next/prev month
                 */
                function createMonthNav() {

                    var

                        createMonthTag = function( upper ) {

                            // If the focused month is outside the range
                            // return an empty string
                            if ( ( upper && MONTH_FOCUSED.YEAR >= DATE_MAX.YEAR && MONTH_FOCUSED.MONTH >= DATE_MAX.MONTH ) || ( !upper && MONTH_FOCUSED.YEAR <= DATE_MIN.YEAR && MONTH_FOCUSED.MONTH <= DATE_MIN.MONTH ) ) {
                                return ''
                            }

                            var monthTag = 'month_' + ( upper ? 'next' : 'prev' )

                            // Otherwise, return the created tag
                            return createNode( STRING_DIV,
                                SETTINGS[ monthTag ],
                                SETTINGS.klass[ monthTag ],
                                { name: 'nav', value: ( upper || -1 ) }
                            ) //endreturn
                        } //createMonthTag

                    // Create and both the month tags
                    // * Passing a truthy argument
                    //   creates the "next" tag
                    return createMonthTag() + createMonthTag( 1 )
                } //createMonthNav


                /**
                 * Create the month label
                 */
                function createMonthLabel() {

                    var
                        // Grab the collection of months
                        monthsCollection = SETTINGS.show_months_full ? SETTINGS.months_full : SETTINGS.months_short


                    // If there's a need for a month selector
                    if ( SETTINGS.month_selector ) {

                        // Create and return a selector
                        // using the months collection
                        return createSelector( monthsCollection,

                            // Selected index
                            MONTH_FOCUSED.MONTH,

                            // Class
                            SETTINGS.klass.month_selector,

                            // Base index
                            0,

                            // If the month is outside of the range,
                            // set the attribute to disabled
                            function( month ) {
                                return validateMonth( month, MONTH_FOCUSED.YEAR, 'disabled ' ) || ''
                            }
                        ) //endreturn
                    }


                    // Otherwise just return the month focused
                    return createNode( STRING_DIV, monthsCollection[ MONTH_FOCUSED.MONTH ], SETTINGS.klass.month )
                } //createMonthLabel


                /**
                 * Create the year label
                 */
                function createYearLabel() {

                    var
                        yearFocused = MONTH_FOCUSED.YEAR,
                        yearSelector = SETTINGS.year_selector


                    if ( isArray( yearSelector ) ) {

                        var
                            // Figure out the first year to display
                            firstYear = (function( lowerRange, minYear ) {

                                // If a negative number is passed,
                                // subtract the relative difference
                                if ( lowerRange < 0 ) {
                                    var year = yearFocused + lowerRange
                                    return year > minYear ? year : minYear
                                }

                                // If it's less than the focused year
                                // lower range is the first year
                                if ( lowerRange < yearFocused ) {
                                    return lowerRange
                                }

                                // Otherwise just keep the focused year
                                return yearFocused
                            })( yearSelector[ 0 ], DATE_MIN.YEAR ),

                            // Figure out the last year to display
                            lastYear = (function( upperRange, maxYear ) {

                                // If the number passed is greater than
                                // the current year, upper range is last year
                                if ( upperRange > yearFocused ) {
                                    return upperRange
                                }

                                // If it's a positive number
                                // add the relative difference
                                if ( upperRange > 0 ) {
                                    var year = yearFocused + upperRange
                                    return year < maxYear ? year : maxYear
                                }

                                // Otherwise just keep the focused year
                                return yearFocused
                            })( yearSelector[ 1 ], DATE_MAX.YEAR ),

                            // Create a new array to hold the years
                            yearsCollection = []


                        // Add the years to the collection
                        for ( var index = 0; index <= lastYear - firstYear; index += 1 ) {
                            yearsCollection.push( firstYear + index )
                        }


                        // Create and return a selector
                        // for the years collection
                        return createSelector( yearsCollection,

                            // Selected index
                            yearFocused,

                            // Class
                            SETTINGS.klass.year_selector,

                            // Base index
                            firstYear
                        ) //endreturn
                    }

                    return createNode( STRING_DIV, yearFocused, SETTINGS.klass.year )
                } //createYearLabel


                /**
                 * Create the calendar table body
                 */
                function createTableBody() {

                    var
                        // The loop date object
                        loopDate,

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
                        countMonthDays = getCountDaysInMonth( MONTH_FOCUSED.YEAR, MONTH_FOCUSED.MONTH ),

                        // Count the days to shift the start of the month
                        countShiftby = getCountShiftDays( MONTH_FOCUSED.DATE, MONTH_FOCUSED.DAY ),

                        // Filter through the dates
                        // and return if looped date is to be disabled
                        disabledDates = (function() {

                            // Check if the looped date should be disabled.
                            var isDisabledDate = function( date ) {
                                return ( loopDate.TIME == date.TIME )
                            }


                            // If the table body should be disabled
                            if ( createTableBody.disabled ) {

                                // Return a function that maps the
                                // collection of dates to not disable
                                return function( date, i, collection ) {

                                    // Map the array of disabled dates
                                    // and check if this date matches one
                                    return ( collection.map( isDisabledDate ).indexOf( true ) < 0 )
                                }
                            }

                            // Otherwise check if this date should be disabled
                            return isDisabledDate
                        })(),


                        // Set the class and binding for each looped date.
                        // Returns an array with 2 items:
                        // 1) The classes string
                        // 2) The data binding object
                        createDateClassAndBinding = function( loopDate, isMonthFocused ) {

                            var
                                // Boolean check for date state
                                isDateDisabled = false,

                                // Create a collection for the classes
                                // with the default classes already included
                                klassCollection = [

                                    // The generic date class
                                    SETTINGS.klass.calendar_date,

                                    // The class for in or out of focus
                                    ( isMonthFocused ? SETTINGS.klass.day_infocus : SETTINGS.klass.day_outfocus )
                                ]


                            // If it's less than the minimum date
                            // or greater than the maximum date
                            // or if there are dates to disable
                            // and this looped date is one of them
                            if ( loopDate.TIME < DATE_MIN.TIME || loopDate.TIME > DATE_MAX.TIME || ( disabledDatesCollection && disabledDatesCollection.filter( disabledDates ).length ) ) {

                                // Flip the boolen
                                isDateDisabled = true

                                // Add the disabled class
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

                                // Return the classes joined
                                // by a single whitespace
                                klassCollection.join( ' ' ),

                                // Create the data binding object
                                // with the value as a string
                                {
                                    name: isDateDisabled ? 'disabled' : 'date',
                                    value: [
                                        loopDate.YEAR,
                                        loopDate.MONTH + 1,  // We do +1 just to give an appropriate display
                                        loopDate.DATE,
                                        loopDate.DAY,
                                        loopDate.TIME
                                    ].join( STRING_DATE_DIVIDER )
                                }
                            ]
                        } //createDateClassAndBinding



                    // Go through all the days in the calendar
                    // and map a calendar date
                    for ( var index = 0; index < DAYS_IN_CALENDAR; index += 1 ) {

                        // Get the distance between the index
                        // and the count to shift by.
                        // This will serve as the separator
                        // between the previous, current,
                        // and next months.
                        pseudoIndex = index - countShiftby


                        // Create a calendar date with
                        // a negative or positive pseudoIndex
                        loopDate = createDate([ MONTH_FOCUSED.YEAR, MONTH_FOCUSED.MONTH, pseudoIndex ])


                        // Set the date class and bindings on the looped date.
                        // If the pseudoIndex is greater than zero,
                        // and less than the days in the month,
                        // we need dates from the focused month.
                        classAndBinding = createDateClassAndBinding( loopDate, ( pseudoIndex > 0 && pseudoIndex <= countMonthDays ) )


                        // Create the looped date wrapper,
                        // and then create the table cell wrapper
                        // and finally pass it to the calendar array
                        calendarDates.push( createNode( 'td', createNode( STRING_DIV, loopDate.DATE, classAndBinding[ 0 ], classAndBinding[ 1 ] ) ) )


                        // Check if it's the end of a week.
                        // * We add 1 for 0index compensation
                        if ( ( index % DAYS_IN_WEEK ) + 1 == DAYS_IN_WEEK ) {

                            // Wrap the week and append it into the calendar weeks
                            calendarWeeks += createNode( STRING_TR, calendarDates.splice( 0, DAYS_IN_WEEK ) )
                        }

                    } //endfor



                    // Join the dates and wrap the calendar body
                    return createNode( 'tbody', calendarWeeks, SETTINGS.klass.calendar_body )
                } //createTableBody


                /**
                 * Create the wrapped calendar
                 * using the collection of calendar items
                 * and creating a new table body
                 */
                function createCalendarWrapped() {

                    // Create a calendar wrapper node
                    return createNode( STRING_DIV,

                        // Create a calendar box node
                        createNode( STRING_DIV,

                            // The prev/next month tags
                            createNode( STRING_DIV, createMonthNav(), SETTINGS.klass.month_nav ) +

                            // The calendar month tag
                            createNode( STRING_DIV, createMonthLabel(), SETTINGS.klass.month_box ) +

                            // The calendar year tag
                            createNode( STRING_DIV, createYearLabel(), SETTINGS.klass.year_box ) +

                            // The calendar table
                            // with a new calendar table body
                            createNode( 'table', [ tableHead, createTableBody() ], SETTINGS.klass.calendar ),

                            // Calendar box class
                            SETTINGS.klass.calendar_box
                        ),

                        // Calendar wrap class
                        SETTINGS.klass.calendar_wrap
                    ) //endreturn
                } //calendarWrapped


                /**
                 * Get the count of the number of days in a month
                 * given the month and year.
                 * This is calculated manually for this reason:
                 * http://jsperf.com/manual-month-days-vs-new-date/2
                 */
                function getCountDaysInMonth( year, month ) {

                    var
                        // Set flip based on if month is
                        // before or after July
                        flip = month > 6 ? true : false

                    // If it's February
                    if ( month == 1 ) {

                        // Check if it's a leap year according to:
                        // http://en.wikipedia.org/wiki/Leap_year#Algorithm
                        // If it's a leap year then 29 otherwise 28
                        return ( ( year % 400 ) === 0 || ( year % 100 ) !== 0 ) && ( year % 4 ) === 0 ? 29 : 28
                    }


                    // If it's an odd month index
                    if ( month % 2 ) {

                        // If it's after July then 31 otherwise 30
                        return flip ? 31 : 30
                    }


                    // If it's an even month index and
                    // it's after July then 30 otherwise 31
                    return flip ? 30 : 31
                } //getCountDaysInMonth


                /**
                 * Get the count of the number of
                 * days to shift the month by,
                 * given the date and day of week
                 */
                function getCountShiftDays( date, dayIndex ) {

                    var
                        // Get the column index for the
                        // day if month starts on 0
                        dayColumnIndexAtZero = date % DAYS_IN_WEEK,

                        // Get the difference between the actual
                        // day index and the column index at zero.
                        // Then, if the first day should be Monday,
                        // reduce the difference by 1
                        difference = dayIndex - dayColumnIndexAtZero + ( SETTINGS.first_day ? -1 : 0 )


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
                 * Stuff to do after a calendar
                 * has been rendered
                 */
                function postRender() {

                    // Find the month selector and bind the change event
                    $findInHolder( SETTINGS.klass.month_selector ).on({
                        change: function() { showMonth( +this.value ) }
                    })

                    // Find the year selector and bind the change event
                    $findInHolder( SETTINGS.klass.year_selector ).on({
                        change: function() { showMonth( MONTH_FOCUSED.MONTH, +this.value ) }
                    })
                } //postRender



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
                        calendarObject.id = ~~( Math.random() * 1e9 )


                        // Create a new wrapped calendar while
                        // creating the holder jQuery object
                        // and binding events
                        $HOLDER = $( createNode( STRING_DIV, createCalendarWrapped(), SETTINGS.klass.picker_holder ) ).on({
                            click: onClickCalendar
                        })


                        // Insert the calendar after the element
                        // while binding events
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


                        // If the element has autofocus
                        if ( ELEMENT.autofocus ) {

                            // Open the calendar
                            calendarObject.open()
                        }


                        // Do stuff after rendering the calendar
                        postRender()

                        return calendarObject
                    }, //init


                    /**
                     * Render a complete calendar
                     */
                    render: function() {

                        // Create a new wrapped calendar
                        // and place it within the holder
                        $HOLDER.html( createCalendarWrapped() )

                        // Do stuff after rendering the calendar
                        postRender()

                        return this
                    }, //render


                    /**
                     * Open the calendar
                     */
                    open: function() {

                        var
                            // Create a reference to this calendar object
                            calendarObject = this


                        // If it's already open, do nothing
                        if ( calendarObject.isOpen ) {
                            return calendarObject
                        }


                        // Set calendar as open
                        calendarObject.isOpen = true

                        // Add the "focused" class to the element
                        $ELEMENT.addClass( SETTINGS.klass.input_focus )

                        // Add the "opened" class to the calendar holder
                        $HOLDER.addClass( SETTINGS.klass.picker_open )


                        // Bind the click event to the window
                        $window.on( namespacedClick + calendarObject.id, function( event ) {

                            // If the calendar is opened
                            // and the target is not the element
                            if ( calendarObject.isOpen && ELEMENT != event.target ) {

                                // Close the calendar
                                calendarObject.close()
                            }
                        })


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


                        // Remove the "focused" class from the element
                        $ELEMENT.removeClass( SETTINGS.klass.input_focus )

                        // Remove the "opened" class from the calendar holder
                        $HOLDER.removeClass( SETTINGS.klass.picker_open )


                        // Unbind the click event from the window
                        $window.off( namespacedClick + calendarObject.id )


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
                    $daySelected = $findInHolder( SETTINGS.klass.day_selected )


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
                ELEMENT.value = getDateFormatted()


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
            function setMonthFocused( month, year ) {

                // Create and return the month focused
                // * We set the date to first of month
                //   because date doesn't matter here
                return ( MONTH_FOCUSED = createDate([ year, month, 1 ]) )
            } //setMonthFocused


            /**
             * Return the minimum or maximum date allowed on the calendar
             */
            function getDateMinOrMax( limit, upper ) {

                // If there's no limit, create an infinite date
                if ( !limit ) {
                    limit = upper ? Infinity : -Infinity
                    return {
                        YEAR: limit,
                        MONTH: limit,
                        TIME: limit
                    }
                }

                // If the limit is an array,
                // construct the date while fixing month 0index
                if ( isArray( limit ) ) {
                    return createDate([ limit[ 0 ], limit[ 1 ] - 1, limit[ 2 ] ])
                }

                // Check if a positive number was passed for upper limit
                // or a negative number was passed for lower limit
                if ( upper && limit > 0 || !upper && limit < 0 ) {

                    // Create a calendar date while setting
                    // the limit date by adding the number
                    return createDate([ DATE_TODAY.YEAR, DATE_TODAY.MONTH, DATE_TODAY.DATE + limit ])
                }


                // Otherwise set the limit to today
                return DATE_TODAY
            } //getDateMinOrMax


            /**
             * Return selected date in the
             * correct format
             */
            function getDateFormatted( format ) {

                // Go through the date formats array and
                // convert the format passed into an array to map
                return DATE_FORMATS.toArray( format || SETTINGS.format ).map( function( value ) {

                    // Trigger the date formats function
                    // or just return value itself
                    return triggerFunction( DATE_FORMATS[ value ] ) || value
                }).join( '' )
            } //getDateFormatted


            /**
             * Find something within the
             * calendar holder
             */
            function $findInHolder( klass ) {
                return $HOLDER.find( '.' + klass )
            } //$findInHolder


            /**
             * Show the month visible on the calendar
             */
            function showMonth( month, year ) {

                // Ensure we have a year to work with
                year = year || MONTH_FOCUSED.YEAR

                // Validate the month to be within
                // the minimum and maximum date
                month = validateMonth( month, year, DATE_MIN.MONTH, DATE_MAX.MONTH ) || month

                // Set the month to show in focus
                // while compensating for 0index
                setMonthFocused( month, year )

                // Then render a new calendar
                CALENDAR.render()

                // Trigger the onChangeMonth method within CALENDAR scope
                triggerFunction( SETTINGS.onChangeMonth, CALENDAR )
            } //showMonth


            /**
             * Validate a month by putting it within the date range
             */
            function validateMonth( month, year, minReturn, maxReturn ) {

                // If the month is less than the min month,
                // then return the min month
                if ( year <= DATE_MIN.YEAR && month < DATE_MIN.MONTH ) {
                    return minReturn
                }

                // If the month is more than the max month,
                // then return the max month
                if ( year >= DATE_MAX.YEAR && month > DATE_MAX.MONTH ) {
                    return maxReturn || minReturn
                }
            } //validateMonth



            /**
             * Handle all delegated click events on the calendar holder
             */
            function onClickCalendar( event ) {

                var
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

                    // Show the month according to the direction
                    showMonth( MONTH_FOCUSED.MONTH + targetData.nav )
                }


                // Put focus back onto the element
                $ELEMENT.focus()
            } //onClickCalendar




            // Return the exports
            return {
                open: CALENDAR.open,
                close: CALENDAR.close,
                show: function( month, year ) {

                    // Compensate for 0index months
                    showMonth( --month, year )
                },
                getSubmitValue: function() {
                    return ELEMENT_HIDDEN.value
                }
            }
        } //Picker



    /**
     * Extend jQuery
     */
    $.fn.pickadate = function( options ) {

        var pickadate = 'pickadate'

        // Merge the options with a deep copy
        options = $.extend( true, {}, $.fn.pickadate.defaults, options )

        // Check if it should be disabled
        // for browsers that natively support `type=date`
        if ( options.disable_picker ) { return this }

        return this.each( function() {
            var $this = $( this )
            if ( !$this.data( pickadate ) ) {
                $this.data( pickadate, new Picker( $this, options ) )
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

        // Month & year dropdown selectors
        month_selector: false,
        year_selector: false,

        // Date limits
        date_min: false,
        date_max: false,

        // Dates to disable
        dates_disabled: false,

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
            year_box: STRING_PREFIX_DATEPICKER + 'year__box',
            year_selector: STRING_PREFIX_DATEPICKER + 'year__selector',

            month: STRING_PREFIX_DATEPICKER + 'month',
            month_box: STRING_PREFIX_DATEPICKER + 'month__box',
            month_selector: STRING_PREFIX_DATEPICKER + 'month__selector',
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





