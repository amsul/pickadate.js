/*!
 * pickadate.js v1.3 - 26 November, 2012
 * By Amsul (http://amsul.ca)
 * Hosted on https://github.com/amsul/pickadate.js
 * Licensed under MIT ("expat" flavour) license.
 */

/**
 * TODO: scroll calendar into view
 * TODO: keyboard a11y
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

        STRING_PREFIX_DATEPICKER = 'pickadate__',

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
        createSelector = function( collection, selectedIndex, klass, baseIndex, attributeFunc ) {

            var selector = ''

            // Map through the collection
            collection.map( function( month, index ) {

                // Add a shift in index if needed
                index = baseIndex ? baseIndex + index : index

                // Trigger the attribute function within the collection scope
                // and then append the value and "selected" tag as needed
                var attributes = ( triggerFunction( attributeFunc, collection, [ index ] ) || '' ) + 'value=' + index + ( selectedIndex == index ? ' selected' : '' )

                // Create the month option and add it to the selector
                selector += createNode( 'option', month, null, null, attributes )
            })

            // Create and return the select element string
            return createNode( 'select', selector, klass )
        }, //createSelector

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


                // The calendar object
                CALENDAR = {
                    id: ~~( Math.random() * 1e9 )
                }, //CALENDAR


                // The public methods
                EXPORTS = {
                    open: function() {
                        calendarOpen()
                        return this
                    },
                    close: function() {
                        calendarClose()
                        return this
                    },
                    show: function( month, year ) {
                        showMonth( --month, year )
                        return this
                    },
                    getDate: function() {
                        return ( ELEMENT_HIDDEN ? ELEMENT_HIDDEN.value : ELEMENT.value )
                    },
                    setDate: function( year, month, date ) {
                        setDateSelected( createDate( [ year, --month, date ] ) )
                        return this
                    }
                }, //EXPORTS


                // The classes
                CLASSES = SETTINGS.klass,


                // The element node passed
                ELEMENT = (function( element ) {

                    // If the element isn't an input field
                    // ensure that we create a hidden element
                    if ( element.nodeName != 'INPUT' ) {
                        SETTINGS.format_submit = SETTINGS.format_submit || 'yyyy-mm-dd'
                    }

                    // Otherwise check the focus state,
                    // convert into a regular text input
                    // to remove user-agent stylings,
                    // and set element as readonly
                    else {
                        element.autofocus = ( element == document.activeElement )
                        element.type = 'text'
                        element.readOnly = true
                    }

                    return element
                })( $ELEMENT[ 0 ] ), //ELEMENT


                // The hidden input element
                ELEMENT_HIDDEN = (function( formatSubmit ) {

                    // Check if there's a format for submit value.
                    // Otherwise return null
                    return ( formatSubmit ) ? (

                        // Create the hidden input value using
                        // the name of the original input with a suffix.
                        // And then update the value with whatever
                        // is entered in the input on load
                        ELEMENT_HIDDEN = $( '<input type=hidden name=' + ELEMENT.name + SETTINGS.hidden_suffix + '>' ).
                            val( ELEMENT.value ? getDateFormatted( formatSubmit ) : '' )[ 0 ]
                    ) : null
                })( SETTINGS.format_submit ),


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


                // Create a collection of dates to disable
                DATES_TO_DISABLE = (function( datesCollection ) {

                    // If a collection was passed
                    // we need to create a calendar date object
                    if ( isArray( datesCollection ) ) {

                        // If the "all" flag is true,
                        // remove the flag from the collection and
                        // set the condition of which dates to disable
                        if ( datesCollection[ 0 ] === true ) {
                            CALENDAR.disabled = datesCollection.shift()
                        }

                        // Map through the dates passed
                        // and return the collection
                        return datesCollection.map( function( date ) {

                            // If the date is a number, set disabledWeekdays to true
                            // and return the date minus 1 for weekday 0index
                            // plus the first day of the week
                            if ( !isNaN( date ) ) {
                                CALENDAR.disabledDays = true
                                return --date + SETTINGS.first_day
                            }

                            // Otherwise Fix the month 0index
                            --date[ 1 ]

                            // Then create and return the date,
                            // replacing it in the collection
                            return createDate( date )
                        })
                    }
                })( SETTINGS.dates_disabled ), //DATES_TO_DISABLE


                // Create a function that will filter through the dates
                // and return true if looped date is to be disabled
                DISABLED_DATES = (function() {

                    // Check if the looped date should be disabled
                    // based on the time being the same as a disabled date
                    // or the day index of the week being within the collection
                    var isDisabledDate = function( date ) {
                        return this.TIME == date.TIME || ( CALENDAR.disabledDays && DATES_TO_DISABLE.indexOf( this.DAY ) > -1 )
                    }


                    // If all calendar dates should be disabled
                    if ( CALENDAR.disabled ) {

                        // Return a function that maps the
                        // collection of dates to not disable
                        return function( date, i, collection ) {

                            // Map the array of disabled dates
                            // and check if this is not one
                            return ( collection.map( isDisabledDate, this ).indexOf( true ) < 0 )
                        }
                    }

                    // Otherwise check if this date should be disabled
                    return isDisabledDate
                })(), //DISABLED_DATES


                // Create the calendar table head with weekday labels
                // by copying the weekdays collection based on the settings
                TABLE_HEAD = (function( weekdaysCollection ) {

                    // If the first day should be Monday
                    if ( SETTINGS.first_day ) {

                        // Grab Sunday and push it to the end of the collection
                        weekdaysCollection.push( weekdaysCollection.splice( 0, 1 )[ 0 ] )
                    }

                    // Go through each day of the week
                    // and return a wrapped header row.
                    // Take the result and apply another
                    // table head wrapper to group it all
                    return createNode( 'thead',
                        createNode( STRING_TR,
                            weekdaysCollection.map( function( weekday ) {
                                return createNode( 'th', weekday, CLASSES.weekdays )
                            })
                        )
                    )
                })( ( SETTINGS.show_weekdays_short ? SETTINGS.weekdays_short : SETTINGS.weekdays_full ).slice( 0 ) ), //TABLE_HEAD


                // Initialize everything
                initialize = (function() {

                    // Create a new wrapped calendar while
                    // creating the jQuery holder object
                    // and binding events to the holder
                    $HOLDER = $( createNode( STRING_DIV, createCalendarWrapped(), CLASSES.picker_holder ) ).on({
                        click: onClickCalendar
                    })


                    // Insert everything after the element
                    // while binding events to the element
                    $ELEMENT.on({

                        // On tab, close the calendar
                        keydown: function( event ) {
                            if ( event.keyCode == 9 ) {
                                calendarClose()
                            }
                        },

                        // On focus, open the calendar
                        focusin: function() { calendarOpen() }

                    }).after( [ $HOLDER, ELEMENT_HIDDEN ] )


                    // Do stuff after rendering the calendar
                    postRender()


                    // If the element has autofocus
                    if ( ELEMENT.autofocus ) {

                        // Open the calendar
                        calendarOpen()
                    }

                    // Trigger the onStart method within exports scope
                    triggerFunction( SETTINGS.onStart, EXPORTS )
                })() //initialize


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
                            CLASSES[ monthTag ],
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
                        CLASSES.month_selector,

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
                return createNode( STRING_DIV, monthsCollection[ MONTH_FOCUSED.MONTH ], CLASSES.month )
            } //createMonthLabel


            /**
             * Create the year label
             */
            function createYearLabel() {

                var
                    yearFocused = MONTH_FOCUSED.YEAR,
                    yearsInSelector = SETTINGS.year_selector


                // If there is a need for a years selector
                // then create a dropdown within the valid range
                if ( yearsInSelector ) {

                    // If year selector setting is true, default to 5.
                    // Otherwise divide the years in selector in half
                    // to get half before and half after
                    yearsInSelector = ( yearsInSelector === true ) ? 5 : ~~( yearsInSelector / 2 )

                    var
                        // Create a collection to hold the years
                        yearsCollection = [],

                        // The lowest year possible is the difference between
                        // the focused year and the number of years in the selector
                        lowestYear = yearFocused - yearsInSelector,

                        // The first year is the lower of the two numbers.
                        // The lowest year or the minimum year.
                        firstYear = getNumberInRange( lowestYear, DATE_MIN.YEAR ),

                        // The highest year is the sum of the focused year
                        // and the years in selector plus the left over years.
                        highestYear = yearFocused + yearsInSelector + ( firstYear - lowestYear ),

                        // The last year is the higher of the two numbers.
                        // The highest year or the maximum year.
                        lastYear = getNumberInRange( highestYear, DATE_MAX.YEAR, 1 )


                    // Check if there are left over years to put in the selector
                    yearsInSelector = highestYear - lastYear


                    // If there are left overs
                    if ( yearsInSelector ) {

                        // The first year is the lower of the two numbers.
                        // The lowest year minus years in selector, or the minimum year
                        firstYear = getNumberInRange( lowestYear - yearsInSelector, DATE_MIN.YEAR )
                    }


                    // Add the years to the collection by looping through the range
                    for ( var index = 0; index <= lastYear - firstYear; index += 1 ) {
                        yearsCollection.push( firstYear + index )
                    }


                    // Create and return a selector
                    // for the years collection
                    return createSelector( yearsCollection,

                        // Selected index
                        yearFocused,

                        // Class
                        CLASSES.year_selector,

                        // Base index
                        firstYear
                    ) //endreturn
                }

                return createNode( STRING_DIV, yearFocused, CLASSES.year )
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
                                CLASSES.calendar_date,

                                // The class for in or out of focus
                                ( isMonthFocused ? CLASSES.day_infocus : CLASSES.day_outfocus )
                            ]


                        // If it's less than the minimum date
                        // or greater than the maximum date
                        // or if there are dates to disable
                        // and this looped date is one of them
                        if ( loopDate.TIME < DATE_MIN.TIME || loopDate.TIME > DATE_MAX.TIME || ( DATES_TO_DISABLE && DATES_TO_DISABLE.filter( DISABLED_DATES, loopDate ).length ) ) {

                            // Flip the boolen
                            isDateDisabled = true

                            // Add the disabled class
                            klassCollection.push( CLASSES.day_disabled )
                        }


                        // If it's today, add the class
                        if ( loopDate.TIME == DATE_TODAY.TIME ) {
                            klassCollection.push( CLASSES.day_today )
                        }


                        // If it's the selected date, add the class
                        if ( loopDate.TIME == DATE_SELECTED.TIME ) {
                            klassCollection.push( CLASSES.day_selected )
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
                return createNode( 'tbody', calendarWeeks, CLASSES.calendar_body )
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
                        createNode( STRING_DIV, createMonthNav(), CLASSES.month_nav ) +

                        // The calendar month tag
                        createNode( STRING_DIV, createMonthLabel(), CLASSES.month_box ) +

                        // The calendar year tag
                        createNode( STRING_DIV, createYearLabel(), CLASSES.year_box ) +

                        // The calendar table with table head
                        // and a new calendar table body
                        createNode( 'table', [ TABLE_HEAD, createTableBody() ], CLASSES.calendar ),

                        // Calendar box class
                        CLASSES.calendar_box
                    ),

                    // Calendar wrap class
                    CLASSES.calendar_wrap
                ) //endreturn
            } //calendarWrapped


            /**
             * Get the number that's allowed within an
             * upper or lower limit. A truthy third argument
             * test against the upper limit.
             */
            function getNumberInRange( number, limit, upper ) {

                // If we need to test against the upper limit
                // and number is less than the limit,
                // or we need to test against the lower limit
                // and number is more than the limit,
                // return the number. Otherwise return the limit.
                return ( ( upper && number < limit ) || ( !upper && number > limit ) ? number : limit )
            } //getNumberInRange


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
            function setDateSelected( datePassed, $dayTargeted ) {

                var
                    // Get the selected day
                    $daySelected = $findInHolder( CLASSES.day_selected )



                // Set the target as the newly selected date
                // by checking if it's an array or calendar date object
                DATE_SELECTED = isArray( datePassed ) ?

                    // Create the targetted date from the
                    // date array passed and float the values
                    // and compensate for month 0index
                    {
                        YEAR: +datePassed[ 0 ],
                        MONTH: +datePassed[ 1 ] - 1,
                        DATE: +datePassed[ 2 ],
                        DAY: +datePassed[ 3 ],
                        TIME: +datePassed[ 4 ]
                    } : datePassed


                // If there's a targeted node and it's the same month
                if ( $dayTargeted && DATE_SELECTED.MONTH == MONTH_FOCUSED.MONTH ) {

                    // Remove the "selected" state from the selected node
                    $daySelected.removeClass( CLASSES.day_selected )

                    // Add the "selected" state to the targeted node
                    $dayTargeted.addClass( CLASSES.day_selected )
                }


                // Otherwise if there's been a change in month
                else {

                    // Set the target as the newly focused month
                    MONTH_FOCUSED = DATE_SELECTED

                    // Render a new calendar
                    calendarRender()
                }


                // Set the element value as the formatted date
                ELEMENT.value = getDateFormatted()


                // If there's a hidden input
                if ( ELEMENT_HIDDEN ) {

                    // Set the hidden value using the submit format
                    ELEMENT_HIDDEN.value = getDateFormatted( SETTINGS.format_submit )
                }


                // Trigger the onSelect method within exports scope
                triggerFunction( SETTINGS.onSelect, EXPORTS )

                return CALENDAR
            } //setDateSelected


            /**
             * Return the date that determines
             * the month to show in focus
             */
            function getMonthFocused() {

                // If there's a date set to focus, return it
                // otherwise focus on the date selected
                return MONTH_FOCUSED || ( MONTH_FOCUSED = getDateSelected() )
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
             * Get the min or max date allowed on the calendar
             * * A truthy second argument gets the max date
             */
            function getDateMinOrMax( limit, upper ) {


                // If the limit is set to true,
                // just return today
                if ( limit === true ) {
                    return DATE_TODAY
                }


                // If the limit is an array,
                // construct the date while fixing month 0index
                if ( isArray( limit ) ) {
                    --limit[ 1 ]
                    return createDate( limit )
                }


                // Check if a positive number was passed for upper limit
                // or a negative number was passed for lower limit
                if ( upper && limit > 0 || !upper && limit < 0 ) {

                    // Create a calendar date while setting
                    // the limit date by adding the number
                    return createDate([ DATE_TODAY.YEAR, DATE_TODAY.MONTH, DATE_TODAY.DATE + limit ])
                }


                // Otherwise there's no limit,
                // so create an infinite date
                limit = upper ? Infinity : -Infinity
                return {
                    YEAR: limit,
                    MONTH: limit,
                    TIME: limit
                }
            } //getDateMinOrMax


            /**
             * Return selected date in the format passed
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
             * Find something within the calendar holder
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
                calendarRender()

                return CALENDAR
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
             * Render a new calendar
             */
            function calendarRender() {

                // Create a new wrapped calendar
                // and place it within the holder
                $HOLDER.html( createCalendarWrapped() )

                // Do stuff after rendering the calendar
                postRender()
            } //calendarRender


            /**
             * Stuff to do after a calendar has been rendered
             */
            function postRender() {

                // Find the month selector and bind the change event
                $findInHolder( CLASSES.month_selector ).on({
                    change: function() { showMonth( +this.value ) }
                })

                // Find the year selector and bind the change event
                $findInHolder( CLASSES.year_selector ).on({
                    change: function() { showMonth( MONTH_FOCUSED.MONTH, +this.value ) }
                })
            } //postRender


            /**
             * Open the calendar
             */
            function calendarOpen() {

                // If it's already open, do nothing
                if ( CALENDAR.isOpen ) {
                    return CALENDAR
                }


                // Set calendar as open
                CALENDAR.isOpen = true


                // Add the "focused" class to the element
                $ELEMENT.addClass( CLASSES.input_focus )

                // Add the "opened" class to the calendar holder
                $HOLDER.addClass( CLASSES.picker_open )


                // Bind the click event to the window
                $window.on( 'click.P' + CALENDAR.id, function( event ) {

                    // If the calendar is opened
                    // and the target is not the element
                    if ( CALENDAR.isOpen && ELEMENT != event.target ) {

                        // Close the calendar
                        calendarClose()
                    }
                })


                // Trigger the onOpen method within exports scope
                triggerFunction( SETTINGS.onOpen, EXPORTS )

                return CALENDAR
            } //calendarOpen


            /**
             * Close the calendar
             */
            function calendarClose() {

                // Set calendar as closed
                CALENDAR.isOpen = false


                // Remove the "focused" class from the element
                $ELEMENT.removeClass( CLASSES.input_focus )

                // Remove the "opened" class from the calendar holder
                $HOLDER.removeClass( CLASSES.picker_open )


                // Unbind the click event from the window
                $window.off( 'click.P' + CALENDAR.id )


                // Trigger the onClose method within exports scope
                triggerFunction( SETTINGS.onClose, EXPORTS )

                return CALENDAR
            } //calendarClose



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

                    // Close the calendar
                    calendarClose()

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
            return EXPORTS
        } //Picker



    /**
     * Default options for the picker
     */
    Picker.defaults = {

        months_full: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        months_short: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],

        weekdays_full: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekdays_short: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

        month_prev: '&#9664;',
        month_next: '&#9654;',

        // Display strings
        show_months_full: true,
        show_weekdays_short: true,

        // Date format to show on the input element
        format: 'd mmmm, yyyy',

        // Date format to send to the server
        format_submit: false,

        // Hidden element name suffix
        hidden_suffix: '_submit',

        // First day of the week: 0 = Sunday, 1 = Monday
        first_day: 0,

        // Month & year dropdown selectors
        month_selector: false,
        year_selector: false,

        // Date ranges
        date_min: false,
        date_max: false,

        // Dates to disable
        dates_disabled: false,

        // Disable for browsers with native date support
        disable_picker: false,

        // Events
        onOpen: null,
        onClose: null,
        onSelect: null,
        onStart: null,


        // Classes
        klass: {

            input_focus: STRING_PREFIX_DATEPICKER + 'input--focused',

            picker_holder: STRING_PREFIX_DATEPICKER + 'holder',
            picker_open: STRING_PREFIX_DATEPICKER + 'holder--opened',

            calendar_wrap: STRING_PREFIX_DATEPICKER + 'calendar--wrap',
            calendar_box: STRING_PREFIX_DATEPICKER + 'calendar--box',

            calendar: STRING_PREFIX_DATEPICKER + 'calendar',
            calendar_body: STRING_PREFIX_DATEPICKER + 'calendar--body',
            calendar_date: STRING_PREFIX_DATEPICKER + 'calendar--date',

            year: STRING_PREFIX_DATEPICKER + 'year',
            year_box: STRING_PREFIX_DATEPICKER + 'year--box',
            year_selector: STRING_PREFIX_DATEPICKER + 'year--selector',

            month: STRING_PREFIX_DATEPICKER + 'month',
            month_box: STRING_PREFIX_DATEPICKER + 'month--box',
            month_selector: STRING_PREFIX_DATEPICKER + 'month--selector',
            month_nav: STRING_PREFIX_DATEPICKER + 'month--nav',
            month_prev: STRING_PREFIX_DATEPICKER + 'month--prev',
            month_next: STRING_PREFIX_DATEPICKER + 'month--next',

            week: STRING_PREFIX_DATEPICKER + 'week',
            weekdays: STRING_PREFIX_DATEPICKER + 'weekday',

            day_disabled: STRING_PREFIX_DATEPICKER + 'day--disabled',
            day_selected: STRING_PREFIX_DATEPICKER + 'day--selected',
            day_today: STRING_PREFIX_DATEPICKER + 'day--today',
            day_infocus: STRING_PREFIX_DATEPICKER + 'day--infocus',
            day_outfocus: STRING_PREFIX_DATEPICKER + 'day--outfocus',

            box_months: STRING_PREFIX_DATEPICKER + 'holder--months',
            box_years: STRING_PREFIX_DATEPICKER + 'holder--years',
            box_weekdays: STRING_PREFIX_DATEPICKER + 'holder--weekdays'
        }
    } //Picker.defaults


    /**
     * Extend jQuery
     */
    $.fn.pickadate = function( options ) {

        var pickadate = 'pickadate'

        // Merge the options with a deep copy
        options = $.extend( true, {}, Picker.defaults, options )

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



})( jQuery, window, document );





