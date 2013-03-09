
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



    /* ==========================================================================
       Globals, constants, and strings
       ========================================================================== */

    var
        HOURS_IN_DAY = 24,
        HOURS_TO_NOON = 12,
        MINUTES_IN_HOUR = 60,
        MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR,

        STRING_DIV = 'div',
        STRING_PREFIX_PICKER = 'pickadate__'








    /* ==========================================================================
       Build time picker components
       ========================================================================== */

    /**
     * Create a clock using the settings, scoped within the picker object.
     */
    function createClock( settings, picker ) {

        return createNode( 'ul', createGroupOfNodes({
            min: picker.min.TIME,
            max: picker.max.TIME,
            i: picker.i,
            node: 'li',
            item: function( timeMinutes ) {
                return [
                    getNumberToTime( settings.format, timeMinutes ),
                    (function( klasses ) {

                        if ( picker.look.length && picker.look[ 0 ].TIME == timeMinutes ) {
                            klasses.push( settings.klass.highlighted )
                        }

                        if ( picker.pick.length && picker.pick[ 0 ].TIME == timeMinutes ) {
                            klasses.push( settings.klass.selected )
                        }

                        return klasses.join( ' ' )
                    })([ settings.klass.listItem ]),
                    'data-time=' + timeMinutes
                ]
            }
        }), settings.klass.list )
    } //createClock


    /**
     * Create a wrapper time object
     */
    function createTime( timePassed ) {

        // If the time passed is an array, float the values and convert into total minutes.
        if ( Array.isArray( timePassed ) ) {
            timePassed = +timePassed[ 0 ] * MINUTES_IN_HOUR + (+timePassed[ 1 ])
        }

        // If the time passed is not a number, create the time for "now".
        else if ( isNaN( timePassed ) ) {
            timePassed = new Date()
            timePassed = timePassed.getHours() * MINUTES_IN_HOUR + timePassed.getMinutes()
        }

        // By now, the time passed should be an integer
        return {

            // Divide to get hours from minutes.
            HOUR: ~~( timePassed / MINUTES_IN_HOUR ),

            // The remainder is the minutes.
            MINS: timePassed % MINUTES_IN_HOUR,

            // Reference to total minutes.
            TIME: timePassed
        }
    } //createTime


    /**
     * Create a time object by validating it can be "reached".
     */
    function createTimeValidated( settings, interval, timePassed ) {

        // Make sure we have a time object to work with.
        timePassed = timePassed && timePassed.TIME ? timePassed : createTime( timePassed )

        // If there are times to disable, make sure this isn't one of them.
        if ( settings.disable && isDisabled( timePassed ) ) {
            console.log( settings.disable, timePassed )
        }

        // Make sure the time is "reachable" using the interval.
        return createTime( timePassed.TIME - ( timePassed.TIME % interval ) )
    } //createTimeValidated


    /**
     * Create the bounding time objects.
     */
    function createTimeBoundaries( settings, interval ) {

        var
            minTimeObject = createTime( settings.min ),
            maxTimeObject = createTime( settings.max ),

            // Check if a time object is in the disabled collection.
            isDisabled = function( timePassed ) {
                return settings.disable.indexOf( timePassed.TIME ) > -1
            }

        // If there are times to disable, make sure this isn't one of them.
        if ( settings.disable && isDisabled( minTimeObject ) ) {
            console.log( settings.disable, minTimeObject )
        }

        // Make sure the max time is "reachable" using the interval.
        maxTimeObject = createTime( maxTimeObject.TIME - ( maxTimeObject.TIME % interval ) )

        // Return a collection of the min and max time objects
        return [ minTimeObject, maxTimeObject ]
    } //createTimeBoundaries


    /**
     * Create a time object from a format.
     */
    function createTimeObjectWithFormat( format, string ) {
        return createTime( getReformattedString( format, string ).split( ':' ) )
    }






    /* ==========================================================================
       Build date picker components
       ========================================================================== */

    /**
     * Create a calendar using the settings, scoped within the picker object.
     */
    function createCalendar( settings, picker ) {

        console.log( picker )

        var
            // Create the nav for next/prev month.
            createMonthNav = function( next ) {

                // If the focused month is outside the range, return an empty string.
                // if ( ( next && TIME_FOCUSED.YEAR >= LIMIT_MAX.YEAR && TIME_FOCUSED.MONTH >= LIMIT_MAX.MONTH ) || ( !next && TIME_FOCUSED.YEAR <= LIMIT_MIN.YEAR && TIME_FOCUSED.MONTH <= LIMIT_MIN.MONTH ) ) {
                //     return ''
                // }

                // Otherwise, return the created month tag
                var monthTag = 'month' + ( next ? 'Next' : 'Prev' )
                return createNode( STRING_DIV, settings[ monthTag ], settings.klass[ monthTag ], 'data-nav=' + ( next || -1 ) )
            }, //createMonthNav


            // Create the month label
            createMonthLabel = function( monthsCollection ) {

                // If there's a need for a month selector
                return settings.monthSelector ?

                    // Create the dom string node for a select element
                    createNode( 'select',

                        // Map through the months collection
                        monthsCollection.map( function( month, monthIndex ) {

                            // Create a dom string node for each option
                            return createNode( 'option',

                                // With the month and no classes
                                month, 0,

                                // Set the value and selected index
                                'value=' + monthIndex + ( 1/*TIME_FOCUSED.MONTH*/ == monthIndex ? ' selected' : '' ) +

                                // Plus the disabled attribute if month is disabled
                                ( isMonthDisabled( monthIndex, 2013/*TIME_FOCUSED.YEAR*/ ) ? ' disabled' : '' )
                            )
                        }),

                        // The month selector class
                        settings.klass.selectMonth,

                        // And some tabindex
                        getTabindexState()

                    // Otherwise just return the month focused
                    ) : createNode( STRING_DIV, monthsCollection[ 1/*TIME_FOCUSED.MONTH*/ ], settings.klass.month )
            }, //createMonthLabel


            // Create the year label
            createYearLabel = function() {

                var
                    yearFocused = 2013/*TIME_FOCUSED.YEAR*/,
                    yearsInSelector = settings.yearSelector


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
                return createNode( STRING_DIV, yearFocused, settings.klass.year )
            }, //createYearLabel


            // Create the calendar table head using a copy of weekday labels collection.
            tableHead = (function( collection ) {

                // If the first day should be Monday, move Sunday to the end.
                if ( settings.firstDay ) {
                    collection.push( collection.shift() )
                }

                // Create and return the table head group.
                return createNode(
                    'thead',
                    createGroupOfNodes({
                        min: 0,
                        max: 7 - 1,
                        i: 1,
                        node: 'th',
                        item: function( counter ) {
                            return [
                                collection[ counter ],
                                settings.klass.weekdays
                            ]
                        }
                    })
                ) //endreturn
            })( settings.showWeekdaysShort ? settings.weekdaysShort : settings.weekdaysFull ) //tableHead


        return createNode(
            STRING_DIV,
            createMonthNav() + createMonthNav( 1 ) +
            createMonthLabel( settings.showMonthsFull ? settings.monthsFull : settings.monthsShort ) +
            createYearLabel(),
            settings.klass.header
        ) +

        createNode(
            'table',
            tableHead +
            createNode(
                'tbody',
                createGroupOfNodes({
                    min: 0,
                    max: 6 - 1,
                    i: 1,
                    node: 'tr',
                    item: function( rowCounter ) {

                        return [
                            createGroupOfNodes({
                                min: createDate([ 2013, 0, 27 ]).DATE + 7 * rowCounter,
                                max: function() {
                                    return picker.min + 7 - 1
                                },
                                i: 1,
                                node: 'td',
                                item: function( cellCounter ) {
                                    var date = createDate([ 2013, 0, cellCounter + settings.firstDay ])
                                    return [
                                        createNode(
                                            STRING_DIV,
                                            date.DATE,
                                            (function( klasses ) {

                                                if ( picker.look.length && picker.look[ 0 ].TIME == timeMinutes ) {
                                                    klasses.push( settings.klass.highlighted )
                                                }

                                                if ( picker.pick.length && picker.pick[ 0 ].TIME == timeMinutes ) {
                                                    klasses.push( settings.klass.selected )
                                                }

                                                return klasses.join( ' ' )
                                            })([ settings.klass.day ]),
                                            'data-date=' + date.YEAR + '/' + ( date.MONTH + 1 ) + '/' + date.DATE
                                        )
                                    ] //endreturn
                                }
                            })
                        ] //endreturn
                    }
                }),
                settings.klass.body
            ),
            settings.klass.table
        ) +

        createNode(
            STRING_DIV,
            createNode( 'button', settings.today, settings.klass.buttonToday, 'data-pick=' + "getTimeFormatted( 'yyyy/mm/dd', NOW )" + ' ' + "getTabindexState()" ) + createNode( 'button', settings.clear, settings.klass.buttonClear, 'data-clear=1 ' + "getTabindexState()" ),
            settings.klass.footer
        ) //endreturn
    } //createCalendar


    /**
     * Create a wrapper date object
     */
    function createDate( datePassed, unlimited ) {

        // If the time passed is an array, create the time by splitting the items
        if ( Array.isArray( datePassed ) ) {
            datePassed = new Date( datePassed[ 0 ], datePassed[ 1 ], datePassed[ 2 ] )
        }

        // If the time passed is a number, create the time with the number
        else if ( !isNaN( datePassed ) ) {
            datePassed = new Date( datePassed )
        }

        // Otherwise if it's not unlimited, set the time to today and
        // set the time to midnight (for comparison purposes)
        else if ( !unlimited ) {
            datePassed = new Date()
            datePassed.setHours( 0, 0, 0, 0 )
        }

        // Return the time object
        return {
            YEAR: unlimited || datePassed.getFullYear(),
            MONTH: unlimited || datePassed.getMonth(),
            DATE: unlimited || datePassed.getDate(),
            DAY: unlimited || datePassed.getDay(),
            TIME: unlimited || datePassed.getTime(),
            OBJ: unlimited || datePassed
        }
    } //createDate


    /**
     * Create the bounding date objects.
     */
    function createDateBoundaries( settings ) {

        return [ settings.min, settings.max ].map( function( limit, upper ) {

            // If there is a limit and its a number, create a
            // time object relative to today by adding the limit.
            if ( limit && !isNaN( limit ) ) {
                return createDate([ NOW.YEAR, NOW.MONTH, NOW.DATE + limit ])
            }

            // If the limit is set to true, just return today
            if ( limit === true ) {
                return NOW
            }

            // If the limit is an array, construct the time by fixing month 0index
            if ( Array.isArray( limit ) ) {
                --limit[ 1 ]
                return createDate( limit )
            }

            // Otherwise create an infinite time
            return createDate( 0, upper ? Infinity : -Infinity )
        })
    } //createDateBoundaries


    /**
     * Create a date object by validating it can be "reached".
     */
    function createDateValidated( settings, interval, datePassed ) {

        // Make sure we have a date object to work with.
        datePassed = datePassed && datePassed.TIME ? datePassed : createDate( datePassed )

        if ( datePassed.TIME < this.min.TIME ) {
            return this.min
        }

        if ( datePassed.TIME > this.max.TIME ) {
            return this.max
        }

        // If there are times to disable, make sure this isn't one of them.
        if ( settings.disable && isDisabled( datePassed ) ) {
            console.log( settings.disable, datePassed )
        }

        return datePassed
    } //createTimeValidated








    /* ==========================================================================
       The Picker
       ========================================================================== */

    /**
     * The picker constructor that creates and returns a new date or time picker
     */
    var Picker = function( $ELEMENT, SETTINGS, FUNK ) {

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

                    $ELEMENT.after( [ $HOLDER, ELEMENT_HIDDEN ] )

                    return P
                } //init

            }, //Picker.prototype


            // The picker object
            PICKER = (function() {

                var
                    i = SETTINGS.interval || 1,
                    timeBoundaries = FUNK.bounds( SETTINGS, i )

                return {
                    id: ~~( Math.random() * 1e9 ),
                    i: i,
                    min: timeBoundaries[ 0 ],
                    max: timeBoundaries[ 1 ],
                    look: [],
                    pick: [],
                    add: function( item, isSuperficial ) {
                        ( isSuperficial ? this.look : this.pick ).push( item )
                    },
                    remove: function( item ) {
                        if ( this.pick.indexOf( item ) > -1 ) {
                            console.log( 'remove this' )
                        }
                    }
                }
            })(), //PICKER


            // The element node
            ELEMENT = (function( element, dataValue ) {

                PICKER.now = triggerFunction( FUNK.validate, PICKER, [ SETTINGS ] )

                var valueObject

                // If there's a `data-value`, set the value while parsing with the submit format.
                if ( dataValue ) {
                    valueObject = FUNK.parse( SETTINGS.formatSubmit, dataValue )
                    PICKER.add( valueObject )
                }

                // Add a default superficial selection. Truth-y second argument makes it superficial.
                PICKER.add( valueObject || PICKER.now, 1 )

                // console.log( FUNK )

                // console.log( PICKER )

                // Confirm the focus state, convert the element into
                // a regular text input to remove user-agent stylings,
                // and then set it as readonly to prevent keyboard popup
                element.autofocus = ( element == document.activeElement )
                element.type = 'text'
                element.readOnly = true
                return element
            })( $ELEMENT[ 0 ], $ELEMENT.data( 'value' ) ), //ELEMENT


            // If there's a format for the hidden input element, create the element
            // using the name of the original input plus suffix and update the value
            // with whatever is entered in the input on load. Otherwise set it to null.
            ELEMENT_HIDDEN = SETTINGS.formatSubmit ?
                $( '<input type=hidden name=' + ELEMENT.name + SETTINGS.hiddenSuffix + '>' ).val(

                    // If there is a date to pick, set it
                    PICKER.pick.length ?

                        // If there's a `data-value`, format it with the submit format.
                        FUNK.format( SETTINGS.formatSubmit, $ELEMENT.data( 'value' ) ) :

                        // Otherwise leave it empty.
                        ''
                )[ 0 ] :
                null,


            // The classes
            CLASSES = SETTINGS.klass,


            // Create the picker holder with a new wrapped picker and bind the events
            $HOLDER = $( createNode( STRING_DIV, createWrappedPicker(), CLASSES.holder ) )



        /**
         * Wrap the picker components together.
         */
        function createWrappedPicker() {

            // Create a picker wrapper node
            return createNode( STRING_DIV,

                // Create a picker frame
                createNode( STRING_DIV,

                    // Create a picker box node
                    createNode( STRING_DIV,

                        // Create the components using the settings and picker
                        FUNK.holder( SETTINGS, PICKER ),

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


        // Return a new initialized picker
        return new P.init()
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
     * Return numbers below 10 with a leading zero
     */
    function leadZero( number ) {
        return ( number < 10 ? '0': '' ) + number
    }


    /**
     * Check if a value is a function and trigger it, if that
     */
    function triggerFunction( callback, scope, args ) {
        if ( typeof callback == 'function' ) {
            return callback.apply( scope, args || [] )
        }
        return callback
    }


    /**
     * Get the time in various formats
     */
    var timeFormattingObject = {

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

        // Create an array by splitting the formatting string passed.
        toArray: function( formatString ) { return formatString.split( /(h{1,2}|H{1,2}|i|a|A|!.)/g ) }
    }

    // If the second character is a digit, length is 2 otherwise 1.
    function getDigitsLength( string ) {
        return ( /\d/ ).test( string[ 1 ] ) ? 2 : 1
    }

    function getReformattedString( format, timeString ) {

        return timeFormattingObject.toArray( format ).map( function( value ) {

            // If the formatting length function exists, invoke it.
            // Otherwise it's the length of the formatting item being mapped
            // (while removing escaped characters).
            var formattingLength = timeFormattingObject[ value ] ? timeFormattingObject[ value ]( timeString ) : value.replace( /^!/, '' ).length

            // If there's a format length,
            if ( formattingLength ) {

                var asdf = timeString.substr( 0, formattingLength )

                timeString = timeString.substr( formattingLength )

                return asdf
            }

            return value.replace( /^!/, '' )
        }).join( '' )
    }

    function getNumberToTime( format, timeNumber ) {
        return timeFormattingObject.toArray( format ).map( function( value ) {
            return triggerFunction( timeFormattingObject[ value ], createTime( timeNumber ) ) || value.replace( /^!/, '' )
        }).join( '' )
    }









    /* ==========================================================================
       Extend jQuery
       ========================================================================== */

    /**
     * Map through the each picker type and extend jQuery
     */
    [ 'pickadate', 'pickatime' ].map( function( picker, index ) {

        var funk = {
            bounds: index ? createTimeBoundaries : createDateBoundaries,
            validate: index ? createTimeValidated : createDateValidated,
            item: index ? createTime : createDate,
            format: index ? getReformattedString : getReformattedString,
            holder: index ? createClock : createCalendar,
            parse: index ? createTimeObjectWithFormat : createTimeObjectWithFormat
        }

        $.fn[ picker ] = function( options ) {

            // Merge the options with a deep copy
            options = $.extend( true, {}, $.fn[ picker ].defaults, options )

            // Just stop if the picker should be disabled
            if ( options.disablePicker ) return this

            return this.each( function() {
                var $this = $( this )
                if ( !$this.data( picker ) ) {
                    $this.data( picker, new Picker( $this, options, funk ) )
                }
            })
        }
    })


    /**
     * Default options for the date picker
     */
    $.fn.pickadate.defaults = {

        // The format to show on the `input` element
        format: 'd mmmm, yyyy',

        // The format to send to the server
        formatSubmit: 'yyyy/mm/dd',

        // Hidden `input` element name suffix
        hiddenSuffix: '_submit',

        // Strings (with translation support) for months and weekdays
        monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        weekdaysFull: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

        // Today and clear
        today: 'Today',
        clear: 'Clear',

        // Display strings
        monthPrev: '&#9664;',
        monthNext: '&#9654;',
        showMonthsFull: 1,
        showWeekdaysShort: 1,

        // First day of the week: 0 = Sunday, 1 = Monday
        firstDay: 0,

        // The time limits
        min: 0,
        max: 0,

        // Times to disable
        disable: 0,

        // Disable for browsers with native date support
        disablePicker: 0,


        // Classes
        klass: {

            inputActive: STRING_PREFIX_PICKER + 'input--active',

            holder: STRING_PREFIX_PICKER + 'holder ' + STRING_PREFIX_PICKER + 'holder--opened',
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

        // The format to show on the `input` element
        format: 'h:i A',

        // The format to send to the server
        formatSubmit: 'HH:i',

        // Hidden element name suffix
        hiddenSuffix: '_submit',

        // The interval between each time
        interval: 30,

        // The time limits
        min: 0,
        max: [ HOURS_IN_DAY , -1 ],

        // Times to disable
        disable: 0,

        // Disable for browsers with native date support
        disablePicker: 0,

        // Classes
        klass: {

            inputActive: STRING_PREFIX_PICKER + 'input--active',

            holder: STRING_PREFIX_PICKER + 'holder ' + STRING_PREFIX_PICKER + 'holder--time ' + STRING_PREFIX_PICKER + 'holder--opened ' + STRING_PREFIX_PICKER + 'holder--focused',
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




})( jQuery, document );




