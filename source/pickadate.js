/*!
 * pickadate.js v1.3.9 - 05 December, 2012
 * By Amsul (http://amsul.ca)
 * Hosted on https://github.com/amsul/pickadate.js
 * Licensed under MIT ("expat" flavour) license.
 */

/**
 * TODO: scroll calendar into view
 * TODO: click to close on iOS
 */

/*jshint
   debug: true,
   devel: true,
   browser: true,
   asi: true,
   unused: true
 */



;(function( $, window, document, undefined ) {

    'use strict';



    var

        // Globals & constants
        DAYS_IN_WEEK = 7,
        WEEKS_IN_CALENDAR = 6,
        DAYS_IN_CALENDAR = WEEKS_IN_CALENDAR * DAYS_IN_WEEK,

        STRING_DIV = 'div',
        STRING_PREFIX_DATEPICKER = 'pickadate__',

        $document = $( document ),


        /**
         * The picker constructor that acceps the
         * jQuery element and the merged settings
         */
        Picker = function( $ELEMENT, SETTINGS ) {

            var
                // Pseudo picker constructor
                Picker = function() {},


                // The element node
                ELEMENT = (function( element ) {

                    // Check the autofocus state, convert the element into
                    // a regular text input to remove user-agent stylings,
                    // and then set the element as readonly
                    element.autofocus = ( element == document.activeElement )
                    element.type = 'text'
                    element.readOnly = true
                    return element
                })( $ELEMENT[ 0 ] ), //ELEMENT


                // The calendar object
                CALENDAR = {
                    id: ~~( Math.random() * 1e9 )
                }, //CALENDAR


                // The classes
                CLASSES = SETTINGS.klass,


                // Create calendar object for today
                DATE_TODAY = createDate(),


                // Set the min date
                DATE_MIN = setDateMinOrMax( SETTINGS.dateMin ),


                // Set the max date
                // * A truthy second argument creates max date
                DATE_MAX = setDateMinOrMax( SETTINGS.dateMax, 1 ),


                // Create a collection of dates to disable
                DATES_TO_DISABLE = (function( datesCollection ) {

                    // If a collection was passed
                    // we need to create a calendar date object
                    if ( Array.isArray( datesCollection ) ) {

                        // If the "all" flag is true,
                        // remove the flag from the collection and
                        // flip the condition of which dates to disable
                        if ( datesCollection[ 0 ] === true ) {
                            CALENDAR.disabled = datesCollection.shift()
                        }

                        // Map through the dates passed
                        // and return the collection
                        return datesCollection.map( function( date ) {

                            // If the date is a number, return the date minus 1
                            // for weekday 0index plus the first day of the week
                            if ( !isNaN( date ) ) {
                                return --date + SETTINGS.firstDay
                            }

                            // Otherwise assume it's an array and fix the month 0index
                            --date[ 1 ]

                            // Then create and return the date,
                            // replacing it in the collection
                            return createDate( date )
                        })
                    }
                })( SETTINGS.datesDisabled ), //DATES_TO_DISABLE


                // Create a function that will filter through the dates
                // and return true if looped date is to be disabled
                DISABLED_DATES = (function() {

                    // Check if the looped date should be disabled
                    // based on the time being the same as a disabled date
                    // or the day index being within the collection
                    var isDisabledDate = function( date ) {
                        return this.TIME == date.TIME || DATES_TO_DISABLE.indexOf( this.DAY ) > -1
                    }


                    // If all calendar dates should be disabled,
                    // return a function that maps each date
                    // in the collection of dates to not disable.
                    // Otherwise check if this date should be disabled
                    return CALENDAR.disabled ? function( date, i, collection ) {

                            // Map the array of disabled dates
                            // and check if this is not one
                            return ( collection.map( isDisabledDate, this ).indexOf( true ) < 0 )
                        } : isDisabledDate
                })(), //DISABLED_DATES


                // Create calendar object for the highlighted day
                DATE_HIGHLIGHTED = (function( dateDataValue, dateEntered ) {

                    // If there a date `data-value`
                    if ( dateDataValue ) {

                        // Set the date entered to an empty object
                        dateEntered = {}

                        // Map through the submit format array
                        DATE_FORMATS.toArray( SETTINGS.formatSubmit ).map( function( formatItem ) {

                            // If the formatting length function exists, invoke it with the
                            // the format length in the `data-value` and the date we are creating.
                            // Otherwise it is the length of the formatting item being mapped
                            var formattingLength = DATE_FORMATS[ formatItem ] ? DATE_FORMATS[ formatItem ]( dateDataValue, dateEntered ) : formatItem.length

                            // If the formatting length function exists, slice up
                            // the value and pass it into the date we're creating.
                            if ( DATE_FORMATS[ formatItem ] ) {
                                dateEntered[ formatItem ] = dateDataValue.slice( 0, formattingLength )
                            }

                            // Update the remainder of the string by slicing the format length
                            dateDataValue = dateDataValue.slice( formattingLength )
                        })

                        // Finally, create an array with the date entered while
                        // parsing each item as an integer and compensating for 0index
                        dateEntered = [ +(dateEntered.yyyy || dateEntered.yy), +(dateEntered.mm || dateEntered.m) - 1, +(dateEntered.dd || dateEntered.d) ]
                    }


                    // Otherwise, try to parse the date in the input
                    else {
                        dateEntered = Date.parse( dateEntered )
                    }


                    // If there's a valid date in the input or the dateEntered
                    // is now an array, create a validated date with it.
                    // Otherwise set the highlighted date to today after validating.
                    return createValidatedDate( !isNaN( dateEntered ) || Array.isArray( dateEntered ) ? dateEntered : DATE_TODAY )
                })( ELEMENT.getAttribute( 'data-value' ), ELEMENT.value ),


                // The date selected is initially the date highlighted
                DATE_SELECTED = DATE_HIGHLIGHTED,


                // Month focused is based on highlighted date
                MONTH_FOCUSED = DATE_HIGHLIGHTED,


                // If there's a format for the hidden input element, create the element
                // using the name of the original input plus suffix and update the value
                // with whatever is entered in the input on load. Otherwise set it to zero.
                ELEMENT_HIDDEN = SETTINGS.formatSubmit ? $( '<input type=hidden name=' + ELEMENT.name + SETTINGS.hiddenSuffix + '>' ).val( ELEMENT.value ? P.getDate( SETTINGS.formatSubmit ) : '' )[ 0 ] : null,


                // Create the calendar table head with weekday labels
                // by "copying" the weekdays collection based on the settings.
                // * We do a copy so we don't mutate the original array.
                TABLE_HEAD = (function( weekdaysCollection ) {

                    // If the first day should be Monday
                    if ( SETTINGS.firstDay ) {

                        // Grab Sunday and push it to the end of the collection
                        weekdaysCollection.push( weekdaysCollection.splice( 0, 1 )[ 0 ] )
                    }

                    // Go through each day of the week
                    // and return a wrapped header row.
                    // Take the result and apply another
                    // table head wrapper to group it all.
                    return createNode( 'thead',
                        createNode( 'tr',
                            weekdaysCollection.map( function( weekday ) {
                                return createNode( 'th', weekday, CLASSES.weekdays )
                            })
                        )
                    )
                })( ( SETTINGS.showWeekdaysShort ? SETTINGS.weekdaysShort : SETTINGS.weekdaysFull ).slice( 0 ) ), //TABLE_HEAD


                // Create the calendar holder with a new wrapped calendar and bind the click
                $HOLDER = $( createNode( STRING_DIV, createCalendarWrapped(), CLASSES.holder ) ).on( 'click', onClickCalendar ),


                // Translate a keycode to a relative change in date
                KEYCODE_TO_DATE = {

                    // Down
                    40: 7,

                    // Up
                    38: -7,

                    // Right
                    39: 1,

                    // Left
                    37: -1
                }, //KEYCODE_TO_DATE


                // The date in various formats
                DATE_FORMATS = (function() {

                    // Get the length of the first word
                    function getFirstWordLength( string ) {
                        return string.match( /\w+/ )[ 0 ].length
                    }

                    // If the second character is a digit, length is 2 otherwise 1.
                    function getDigitsLength( string ) {
                        return (/\d/).test( string[ 1 ] ) ? 2 : 1
                    }

                    // Get the length of the month from a string
                    function getMonthLength( string, dateObj, collection ) {

                        // Grab the first word
                        var word = string.match( /\w+/ )[ 0 ]

                        // If there's no index for the date object's month,
                        // find it in the relevant months collection and add 1
                        // because we subtract 1 when we create the date object
                        if ( !dateObj.mm && !dateObj.m ) {
                            dateObj.m = collection.indexOf( word ) + 1
                        }

                        // Return the length of the word
                        return word.length
                    }


                    // Return the date formats object
                    return {
                        d: function( string ) {

                            // If there's string, then get the digits length.
                            // Otherwise return the selected date.
                            return string ? getDigitsLength( string ) : DATE_SELECTED.DATE
                        },
                        dd: function( string ) {

                            // If there's a string, then the length is always 2.
                            // Otherwise return the selected date with a leading zero.
                            return string ? 2 : leadZero( DATE_SELECTED.DATE )
                        },
                        ddd: function( string ) {

                            // If there's a string, then get the length of the first word.
                            // Otherwise return the short selected weekday.
                            return string ? getFirstWordLength( string ) : SETTINGS.weekdaysShort[ DATE_SELECTED.DAY ]
                        },
                        dddd: function( string ) {

                            // If there's a string, then get the length of the first word.
                            // Otherwise return the full selected weekday.
                            return string ? getFirstWordLength( string ) : SETTINGS.weekdaysFull[ DATE_SELECTED.DAY ]
                        },
                        m: function( string ) {

                            // If there's a string, then get the length of the digits
                            // Otherwise return the selected month with 0index compensation.
                            return string ? getDigitsLength( string ) : DATE_SELECTED.MONTH + 1
                        },
                        mm: function( string ) {

                            // If there's a string, then the length is always 2.
                            // Otherwise return the selected month with 0index and leading zero.
                            return string ? 2 : leadZero( DATE_SELECTED.MONTH + 1 )
                        },
                        mmm: function( string, dateObject ) {

                            var collection = SETTINGS.monthsShort

                            // If there's a string, get length of the relevant month string
                            // from the short months collection. Otherwise return the
                            // selected month from that collection.
                            return string ? getMonthLength( string, dateObject, collection ) : collection[ DATE_SELECTED.MONTH ]
                        },
                        mmmm: function( string, dateObject ) {

                            var collection = SETTINGS.monthsFull

                            // If there's a string, get length of the relevant month string
                            // from the full months collection. Otherwise return the
                            // selected month from that collection.
                            return string ? getMonthLength( string, dateObject, collection ) : collection[ DATE_SELECTED.MONTH ]
                        },
                        yy: function( string ) {

                            // If there's a string, then the length is always 2.
                            // Otherwise return the selected year by slicing out the first 2 digits.
                            return string ? 2 : ( '' + DATE_SELECTED.YEAR ).slice( 2 )
                        },
                        yyyy: function( string ) {

                            // If there's a string, then the length is always 4.
                            // Otherwise return the selected year.
                            return string ? 4 : DATE_SELECTED.YEAR
                        },

                        // Create an array by splitting the format passed
                        toArray: function( format ) { return format.split( /(?=\b)(d{1,4}|m{1,4}|y{4}|yy)+(\b)/g ) }

                    } //endreturn
                })(), //DATE_FORMATS


                // The picker prototype
                P = Picker.prototype = {

                    constructor: Picker,

                    /**
                     * Initialize everything
                     */
                    init: function() {

                        // Insert everything after the element
                        // while binding the events to the element
                        $ELEMENT.on({
                            'focusin click': P.open,
                            keydown: function( event ) {

                                var keycode = event.keyCode

                                // If backspace was pressed or if the calendar
                                // is closed and the keycode warrants a date change,
                                // prevent it from going any further.
                                if ( keycode == 8 || !CALENDAR.isOpen && KEYCODE_TO_DATE[ keycode ] ) {

                                    // Prevent it from moving the page
                                    event.preventDefault()

                                    // Prevent it from propagating to document
                                    event.stopPropagation()

                                    // Open the calendar if backspace wasn't pressed
                                    if ( keycode != 8 ) {
                                        P.open()
                                    }
                                }
                            }
                        }).after( [ $HOLDER, ELEMENT_HIDDEN ] )


                        // If the element has autofocus open the calendar
                        if ( ELEMENT.autofocus ) {
                            P.open()
                        }


                        // Do stuff after rendering the calendar
                        postRender()


                        // Trigger the onStart method within scope of the picker
                        triggerFunction( SETTINGS.onStart, P )


                        return P
                    }, //init


                    /**
                     * Open the calendar
                     */
                    open: function() {

                        // If it's already open, do nothing
                        if ( CALENDAR.isOpen ) { return P }


                        // Set calendar as open
                        CALENDAR.isOpen = true


                        // Add the "focused" class to the element
                        $ELEMENT.addClass( CLASSES.inputFocus )


                        // Add the "opened" class to the calendar holder
                        $HOLDER.addClass( CLASSES.open )


                        // Allow month and year selectors to be focusable
                        if ( CALENDAR.selectMonth ) {
                            CALENDAR.selectMonth.tabIndex = 0
                        }
                        if ( CALENDAR.selectYear ) {
                            CALENDAR.selectYear.tabIndex = 0
                        }


                        // Bind all the events to the document
                        $document.on( 'click.P' + CALENDAR.id + ' focusin.P' + CALENDAR.id + ' keydown.P' + CALENDAR.id, onDocumentEvent )


                        // Trigger the onOpen method within scope of the picker
                        triggerFunction( SETTINGS.onOpen, P )

                        return P
                    }, //open


                    /**
                     * Close the calendar
                     */
                    close: function() {

                        // Set calendar as closed
                        CALENDAR.isOpen = false


                        // Remove the "focused" class from the element
                        $ELEMENT.removeClass( CLASSES.inputFocus )

                        // Remove the "opened" class from the calendar holder
                        $HOLDER.removeClass( CLASSES.open )


                        // Disable month and year selectors from being focusable
                        if ( CALENDAR.selectMonth ) {
                            CALENDAR.selectMonth.tabIndex = -1
                        }
                        if ( CALENDAR.selectYear ) {
                            CALENDAR.selectYear.tabIndex = -1
                        }


                        // Unbind the Picker events from the document
                        $document.off( '.P' + CALENDAR.id )


                        // Trigger the onClose method within scope of the picker
                        triggerFunction( SETTINGS.onClose, P )

                        return P
                    }, //close


                    /**
                     * Show a month in focus with 0index compensation
                     */
                    show: function( month, year ) {
                        showMonth( --month, year )
                        return P
                    }, //show


                    /**
                     * Get the selected date in any format
                     */
                    getDate: function( format ) {

                        // Go through the date formats array and
                        // convert the format passed into an array to map
                        // which we join into a string at the end
                        return DATE_FORMATS.toArray( format || SETTINGS.format ).map( function( value ) {

                            // Trigger the date formats function
                            // or just return value itself
                            return triggerFunction( DATE_FORMATS[ value ] ) || value
                        }).join( '' )
                    }, //getDate


                    /**
                     * Set the date with month 0index compensation
                     * and an option to do a superficial selection
                     */
                    setDate: function( year, month, date, isSuperficial ) {

                        // Compensate for month 0index and create a validated date.
                        // Then set it as the date selected
                        setDateSelected( createValidatedDate([ year, --month, date ]), isSuperficial )
                        return P
                    }, //setDate


                    /**
                     * Get the min or max date based on
                     * the argument being truthy or falsey
                     */
                    getDateLimit: function( upper ) {
                        return upper ? DATE_MAX : DATE_MIN
                    }, //getDateLimit


                    /**
                     * Set the min or max date based on second
                     * argument being truthy or falsey.
                     */
                    setDateLimit: function( date, upper ) {

                        // Set the relevant date
                        if ( upper ) DATE_MAX = setDateMinOrMax( date, 1 )
                        else DATE_MIN = setDateMinOrMax( date )

                        // Render a new calendar
                        calendarRender()

                        return P
                    } //setDateLimit


                } //Picker.prototype




            /**
             * Create the nav for next/prev month
             */
            function createMonthNav( next ) {

                // If the focused month is outside the range
                // return an empty string
                if ( ( next && MONTH_FOCUSED.YEAR >= DATE_MAX.YEAR && MONTH_FOCUSED.MONTH >= DATE_MAX.MONTH ) || ( !next && MONTH_FOCUSED.YEAR <= DATE_MIN.YEAR && MONTH_FOCUSED.MONTH <= DATE_MIN.MONTH ) ) {
                    return ''
                }

                var monthTag = 'month' + ( next ? 'Next' : 'Prev' )

                // Otherwise, return the created tag
                return createNode( STRING_DIV,
                    SETTINGS[ monthTag ],
                    CLASSES[ monthTag ],
                    'data-nav=' + ( next || -1 )
                ) //endreturn
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
                                'value=' + monthIndex + ( MONTH_FOCUSED.MONTH == monthIndex ? ' selected' : '' ) +

                                // Plus the disabled attribute if it's an invalid month
                                ( isInvalidMonth( monthIndex, MONTH_FOCUSED.YEAR, ' disabled' ) || '' )
                            )
                        }),

                        // The month selector class
                        CLASSES.monthSelector,

                        // And some tabindex
                        'tabindex=' + ( CALENDAR.isOpen ? 0 : -1 )

                    // Otherwise just return the month focused
                    ) : createNode( STRING_DIV, monthsCollection[ MONTH_FOCUSED.MONTH ], CLASSES.month )
            } //createMonthLabel


            /**
             * Create the year label
             */
            function createYearLabel() {

                var
                    yearFocused = MONTH_FOCUSED.YEAR,
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
                        CLASSES.yearSelector,

                        // And some tabindex
                        'tabindex=' + ( CALENDAR.isOpen ? 0 : -1 )
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
                    // by getting the 0-th date of the next month
                    countMonthDays = createDate([ MONTH_FOCUSED.YEAR, MONTH_FOCUSED.MONTH + 1, 0 ]).DATE,

                    // Count the days to shift the start of the month
                    countShiftby = getCountShiftDays( MONTH_FOCUSED.DATE, MONTH_FOCUSED.DAY ),


                    // Set the class and binding for each looped date.
                    // Returns an array with 2 items:
                    // 1) The classes string
                    // 2) The data binding string
                    createDateClassAndBinding = function( loopDate, isMonthFocused ) {

                        var
                            // Boolean check for date state
                            isDateDisabled = false,

                            // Create a collection for the classes
                            // with the default classes already included
                            klassCollection = [

                                // The generic day class
                                CLASSES.day,

                                // The class for in or out of focus
                                ( isMonthFocused ? CLASSES.dayInfocus : CLASSES.dayOutfocus )
                            ]


                        // If it's less than the minimum date
                        // or greater than the maximum date
                        // or if there are dates to disable
                        // and this looped date is one of them
                        if ( loopDate.TIME < DATE_MIN.TIME || loopDate.TIME > DATE_MAX.TIME || ( DATES_TO_DISABLE && DATES_TO_DISABLE.filter( DISABLED_DATES, loopDate ).length ) ) {

                            // Flip the boolen
                            isDateDisabled = true

                            // Add the disabled class
                            klassCollection.push( CLASSES.dayDisabled )
                        }


                        // If it's today, add the class
                        if ( loopDate.TIME == DATE_TODAY.TIME ) {
                            klassCollection.push( CLASSES.dayToday )
                        }


                        // If it's the highlighted date, add the class
                        if ( loopDate.TIME == DATE_HIGHLIGHTED.TIME ) {
                            klassCollection.push( CLASSES.dayHighlighted )
                        }


                        // If it's the selected date, add the class
                        if ( loopDate.TIME == DATE_SELECTED.TIME ) {
                            klassCollection.push( CLASSES.daySelected )
                        }


                        // Return an array with the classes and data binding
                        return [

                            // Return the classes joined
                            // by a single whitespace
                            klassCollection.join( ' ' ),

                            // Create the data binding object
                            // with the value as a string
                            'data-' + ( isDateDisabled ? 'disabled' : 'date' ) + '=' + [
                                loopDate.YEAR,
                                loopDate.MONTH,
                                loopDate.DATE,
                                loopDate.DAY,
                                loopDate.TIME
                            ].join( '/' )
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
                        calendarWeeks += createNode( 'tr', calendarDates.splice( 0, DAYS_IN_WEEK ) )
                    }

                } //endfor



                // Join the dates and wrap the calendar body
                return createNode( 'tbody', calendarWeeks, CLASSES.calendarBody )
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
                        // * Truthy argument creates "next" tag
                        createNode( STRING_DIV, createMonthNav() + createMonthNav( 1 ), CLASSES.monthNav ) +

                        // The calendar month tag
                        createNode( STRING_DIV, createMonthLabel( SETTINGS.showMonthsFull ? SETTINGS.monthsFull : SETTINGS.monthsShort ), CLASSES.monthWrap ) +

                        // The calendar year tag
                        createNode( STRING_DIV, createYearLabel(), CLASSES.yearWrap ) +

                        // The calendar table with table head
                        // and a new calendar table body
                        createNode( 'table', [ TABLE_HEAD, createTableBody() ], CLASSES.calendarTable ),

                        // Calendar class
                        CLASSES.calendar
                    ),

                    // Calendar wrap class
                    CLASSES.calendarWrap
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
                    difference = dayIndex - dayColumnIndexAtZero + ( SETTINGS.firstDay ? -1 : 0 )


                // Compare the day index if the
                // month starts on the first day
                // with the day index
                // the date actually falls on
                return dayIndex >= dayColumnIndexAtZero ?

                    // If the actual position is greater
                    // shift by the difference in the two
                    difference :

                    // Otherwise shift by the adding the negative
                    // difference to the days in week
                    DAYS_IN_WEEK + difference
            } //getCountShiftDays



            /**
             * Set a date as selected or only highlighted
             */
            function setDateSelected( dateTargeted, isHighlight ) {

                // Set the target as the highlight
                DATE_HIGHLIGHTED = dateTargeted

                // Set the target as the focus
                MONTH_FOCUSED = dateTargeted

                // If it's just a highlight, render a new calendar
                if ( isHighlight ) {
                    calendarRender()
                }

                // Otherwise set the element value as well
                // * A truthy second argument renders new calendar
                else {
                    setElementsValue( dateTargeted, 1 )
                }
            } //setDateSelected



            /**
             * Set the date in the input element and hidden input
             */
            function setElementsValue( dateTargeted, updateCalendar ) {

                // Set the target as the selection
                DATE_SELECTED = dateTargeted

                // Set the element value as the formatted date
                ELEMENT.value = P.getDate()

                // If there's a hidden input,
                // set the value with the submit format
                if ( ELEMENT_HIDDEN ) {
                    ELEMENT_HIDDEN.value = P.getDate( SETTINGS.formatSubmit )
                }

                // If the calendar should be updated, render a new one
                if ( updateCalendar ) {
                    calendarRender()
                }

                // Trigger the onSelect method within scope of the picker
                triggerFunction( SETTINGS.onSelect, P )
            } //setElementsValue



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
                month = isInvalidMonth( month, year ) || month

                // Set the month to show in focus
                setMonthFocused( month, year )

                // Then render a new calendar
                calendarRender()
            } //showMonth


            /**
             * Create the min or max date allowed on the calendar
             * * A truthy second argument creates the max date
             */
            function setDateMinOrMax( limit, upper ) {

                // If the limit is set to true, just return today
                if ( limit === true ) {
                    return DATE_TODAY
                }

                // If the limit is an array, construct the date
                // while fixing month 0index
                if ( Array.isArray( limit ) ) {
                    --limit[ 1 ]
                    return createDate( limit )
                }

                // If there is a limit and its a number, create a
                // calendar date relative to today by adding the limit
                if ( limit && !isNaN( limit ) ) {
                    return createDate([ DATE_TODAY.YEAR, DATE_TODAY.MONTH, DATE_TODAY.DATE + limit ])
                }

                // Otherwise create an infinite date
                limit = upper ? Infinity : -Infinity
                return {
                    YEAR: limit,
                    MONTH: limit,
                    TIME: limit
                }
            } //setDateMinOrMax


            /**
             * Create a validated date
             */
            function createValidatedDate( datePassed, direction ) {


                // If the date passed isn't a date, create one
                datePassed = !datePassed.TIME ? createDate( datePassed ) : datePassed


                // If there are disabled dates
                if ( DATES_TO_DISABLE ) {

                    // Create a reference to the original date passed
                    var originalDate = datePassed

                    // Check if this date is disabled. If it is,
                    // then keep adding the direction (or 1) to the date
                    // until we get to a date that's enabled.
                    while ( DATES_TO_DISABLE.filter( DISABLED_DATES, datePassed ).length ) {

                        // Create the next date based on the direction
                        datePassed = createDate([ datePassed.YEAR, datePassed.MONTH, datePassed.DATE + ( direction || 1 ) ])

                        // If we've looped through to another month,
                        // then increase/decrease the date by one and
                        // continue looping with the new original date
                        if ( datePassed.MONTH != originalDate.MONTH ) {
                            datePassed = createDate([ originalDate.YEAR, originalDate.MONTH, direction > 0 ? ++originalDate.DATE : --originalDate.DATE ])
                            originalDate = datePassed
                        }
                    }
                }


                // If it's less that min date, set it to min date
                // by creating a validated date by adding one
                // until we find an enabled date
                if ( datePassed.TIME < DATE_MIN.TIME ) {
                    datePassed = createValidatedDate( DATE_MIN )
                }


                // If it's more than max date, set it to max date
                // by creating a validated date by subtracting one
                // until we find an enabled date
                else if ( datePassed.TIME > DATE_MAX.TIME ) {
                    datePassed = createValidatedDate( DATE_MAX, -1 )
                }


                // Finally, return the date
                return datePassed
            } //createValidatedDate


            /**
             * Validate a month by comparing with the date range.
             * If outside the range, returns the value passed.
             * Otherwise returns nothing.
             */
            function isInvalidMonth( month, year, returnValue ) {

                // If the month is less than the min month,
                // then return the return value or min month
                if ( year <= DATE_MIN.YEAR && month < DATE_MIN.MONTH ) {
                    return returnValue || DATE_MIN.MONTH
                }

                // If the month is more than the max month,
                // then return the return value or max month
                if ( year >= DATE_MAX.YEAR && month > DATE_MAX.MONTH ) {
                    return returnValue || DATE_MAX.MONTH
                }
            } //isInvalidMonth



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

                // Find and store the month selector
                CALENDAR.selectMonth = $findInHolder( CLASSES.monthSelector ).on({

                    // *** For iOS ***
                    click: function( event ) { event.stopPropagation() },

                    // Bind the change event
                    change: function() {

                        // Show the month based on the option selected
                        // while parsing as a float
                        showMonth( +this.value )

                        // Find the new month selector and focus back on it
                        $findInHolder( CLASSES.monthSelector ).focus()
                    }
                })[ 0 ]

                // Find and store the year selector
                CALENDAR.selectYear = $findInHolder( CLASSES.yearSelector ).on({

                    // *** For iOS ***
                    click: function( event ) { event.stopPropagation() },

                    // Bind the change event
                    change: function() {

                        // Show the year based on the option selected
                        // and month currently in focus while parsing as a float
                        showMonth( MONTH_FOCUSED.MONTH, +this.value )

                        // Find the new year selector and focus back on it
                        $findInHolder( CLASSES.yearSelector ).focus()
                    }
                })[ 0 ]
            } //postRender






            /**
             * Handle all delegated click events on the calendar holder
             */
            function onClickCalendar( event ) {

                var
                    // Get the jQuery target
                    $target = $( event.target ),

                    // Get the target data
                    targetData = $target.data()


                // Stop the event from bubbling up to the document
                event.stopPropagation()


                // Put focus back onto the element
                $ELEMENT.focus()


                // If there's a date provided
                if ( targetData.date ) {

                    // Split the target data into an array
                    var dateToSelect = targetData.date.split( '/' )

                    // Create the a calendar date object from the
                    // array while floating the values
                    dateToSelect = {
                        YEAR: +dateToSelect[ 0 ],
                        MONTH: +dateToSelect[ 1 ],
                        DATE: +dateToSelect[ 2 ],
                        DAY: +dateToSelect[ 3 ],
                        TIME: +dateToSelect[ 4 ]
                    }

                    // Set the date as selected
                    // * Falsy second argument updates the element values
                    setDateSelected( dateToSelect, false, $target )

                    // Close the calendar
                    P.close()
                }


                // If there's a navigator provided
                if ( targetData.nav ) {

                    // Show the month according to the direction
                    showMonth( MONTH_FOCUSED.MONTH + targetData.nav )
                }
            } //onClickCalendar



            /**
             * Handle all document events when the calendar is open
             */
            function onDocumentEvent( event ) {

                var
                    // Get the keycode
                    keycode = event.keyCode,

                    // Get the target
                    target = event.target


                // If target is not the element, nor the select
                // menus, close the calendar.
                if ( target != ELEMENT && target != CALENDAR.selectMonth && target != CALENDAR.selectYear ) {
                    P.close()
                    return
                }

                // If the target is the select menu, remove the
                // "focus" state from the input element
                if ( target == CALENDAR.selectMonth || target == CALENDAR.selectYear ) {
                    $ELEMENT.removeClass( CLASSES.inputFocus )
                    return
                }


                // If theres a keycode and the target is the element
                if ( keycode && target == ELEMENT ) {


                    // Prevent the default action if a "super" key
                    // is not held and the tab key isn't pressed,
                    // prevent the default action
                    if ( !event.metaKey && keycode != 9 ) {
                        event.preventDefault()
                    }


                    // On enter, set the element value as the highlighted date
                    // * Truthy second argument renders a new calendar
                    if ( keycode == 13 ) {
                        setElementsValue( DATE_HIGHLIGHTED, 1 )
                        P.close()
                        return
                    }


                    // On escape, close the calendar
                    if ( keycode == 27 ) {
                        P.close()
                        return
                    }


                    // If the keycode translates to a date change,
                    // set the date as superficially selected by
                    // creating new validated dates - incrementing by the date change.
                    // * Truthy second argument makes it a superficial selection
                    if ( KEYCODE_TO_DATE[ keycode ] ) {
                        setDateSelected( createValidatedDate( [ MONTH_FOCUSED.YEAR, MONTH_FOCUSED.MONTH, DATE_HIGHLIGHTED.DATE + KEYCODE_TO_DATE[ keycode ] ], KEYCODE_TO_DATE[ keycode ] ), 1 )
                    }

                } //if ELEMENT
            } //onDocumentEvent


            // Return a new initialized picker
            return new P.init()
        } //Picker





    /**
     * Helper functions
     */

    // Check if a value is a function
    // and trigger it, if that
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

        // If the item is an array, do a join
        item = Array.isArray( item ) ? item.join( '' ) : item

        // Check for the class
        klass = klass ? ' class="' + klass + '"' : ''

        // Check for any attributes
        attribute = attribute ? ' ' + attribute : ''

        // Return the wrapped item
        return '<' + wrapper + klass + attribute + '>' + item + '</' + wrapper + '>'
    } //createNode

    // Create a calendar date
    function createDate( datePassed ) {

        // If the date passed is an array
        if ( Array.isArray( datePassed ) ) {

            // Create the date
            datePassed = new Date( datePassed[ 0 ], datePassed[ 1 ], datePassed[ 2 ] )
        }


        // Otherwise
        else {

            // Set the date to today
            datePassed = new Date()

            // Set the time to midnight (for comparison purposes)
            datePassed.setHours( 0, 0, 0, 0 )
        }


        // Return the calendar date object
        return {
            YEAR: datePassed.getFullYear(),
            MONTH: datePassed.getMonth(),
            DATE: datePassed.getDate(),
            DAY: datePassed.getDay(),
            TIME: datePassed.getTime()
        }
    } //createDate




    /**
     * Extend jQuery
     */
    $.fn.pickadate = function( options ) {

        var pickadate = 'pickadate'

        // Merge the options with a deep copy
        options = $.extend( true, {}, $.fn.pickadate.defaults, options )

        // Check if it should be disabled
        // for browsers that natively support `type=date`
        if ( options.disablePicker ) { return this }

        return this.each( function() {
            var $this = $( this )
            if ( this.nodeName == 'INPUT' && !$this.data( pickadate ) ) {
                $this.data( pickadate, new Picker( $this, options ) )
            }
        })
    } //$.fn.pickadate



    /**
     * Default options for the picker
     */
    $.fn.pickadate.defaults = {

        monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],

        weekdaysFull: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

        monthPrev: '&#9664;',
        monthNext: '&#9654;',

        // Display strings
        showMonthsFull: true,
        showWeekdaysShort: true,

        // Date format to show on the input element
        format: 'd mmmm, yyyy',

        // Date format to send to the server
        formatSubmit: false,

        // Hidden element name suffix
        hiddenSuffix: '_submit',

        // First day of the week: 0 = Sunday, 1 = Monday
        firstDay: 0,

        // Month & year dropdown selectors
        monthSelector: false,
        yearSelector: false,

        // Date ranges
        dateMin: false,
        dateMax: false,

        // Dates to disable
        datesDisabled: false,

        // Disable for browsers with native date support
        disablePicker: false,

        // Events
        onOpen: null,
        onClose: null,
        onSelect: null,
        onStart: null,


        // Classes
        klass: {

            inputFocus: STRING_PREFIX_DATEPICKER + 'input--focused',

            holder: STRING_PREFIX_DATEPICKER + 'holder',
            open: STRING_PREFIX_DATEPICKER + 'holder--opened',

            calendar: STRING_PREFIX_DATEPICKER + 'calendar',
            calendarWrap: STRING_PREFIX_DATEPICKER + 'calendar--wrap',
            calendarTable: STRING_PREFIX_DATEPICKER + 'calendar--table',
            calendarBody: STRING_PREFIX_DATEPICKER + 'calendar--body',

            year: STRING_PREFIX_DATEPICKER + 'year',
            yearWrap: STRING_PREFIX_DATEPICKER + 'year--wrap',
            yearSelector: STRING_PREFIX_DATEPICKER + 'year--selector',

            month: STRING_PREFIX_DATEPICKER + 'month',
            monthWrap: STRING_PREFIX_DATEPICKER + 'month--wrap',
            monthSelector: STRING_PREFIX_DATEPICKER + 'month--selector',
            monthNav: STRING_PREFIX_DATEPICKER + 'month--nav',
            monthPrev: STRING_PREFIX_DATEPICKER + 'month--prev',
            monthNext: STRING_PREFIX_DATEPICKER + 'month--next',

            week: STRING_PREFIX_DATEPICKER + 'week',
            weekdays: STRING_PREFIX_DATEPICKER + 'weekday',

            day: STRING_PREFIX_DATEPICKER + 'day',
            dayDisabled: STRING_PREFIX_DATEPICKER + 'day--disabled',
            daySelected: STRING_PREFIX_DATEPICKER + 'day--selected',
            dayHighlighted: STRING_PREFIX_DATEPICKER + 'day--highlighted',
            dayToday: STRING_PREFIX_DATEPICKER + 'day--today',
            dayInfocus: STRING_PREFIX_DATEPICKER + 'day--infocus',
            dayOutfocus: STRING_PREFIX_DATEPICKER + 'day--outfocus'
        }
    } //$.fn.pickadate.defaults



})( jQuery, window, document );






