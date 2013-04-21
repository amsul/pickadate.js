/*!
 * pickadate.js v3.0.0alpha, 2013-04-21
 * By Amsul (http://amsul.ca)
 * Hosted on http://amsul.github.io/pickadate.js
 * Licensed under MIT
 */

(function( $, document, undefined ) {"use strict";
/*jshint
   debug: true,
   devel: true,
   browser: true,
   asi: true,
   unused: true,
   boss: true
 */


/* ==========================================================================
   Build date picker components
   ========================================================================== */

/**
 * Globals and constants
 */
var DAYS_IN_WEEK = 7,
    WEEKS_IN_CALENDAR = 6



/**
 * The date picker constructor
 */
function DatePicker( picker, settings ) {

    var calendar = this,
        elementDataValue = picker.$node.data( 'value' )

    calendar.settings = settings

    // The queue of methods that will be used to build item objects.
    calendar.queue = {
        min: 'measure create',
        max: 'measure create',
        now: 'now create',
        select: 'parse create validate',
        highlight: 'navigate create validate',
        view: 'create viewset',
        disable: 'flipItem',
        enable: 'flipItem',
        flip: 'flipAll'
    }

    // The component's item object.
    calendar.item = {}

    calendar.item.disable = ( settings.disable || [] ).slice( 0 )
    calendar.item.enable = -(function( collectionDisabled ) {
        return collectionDisabled[ 0 ] === true ? collectionDisabled.shift() : -1
    })( calendar.item.disable )

    calendar.
        set( 'min', settings.min || -Infinity ).
        set( 'max', settings.max || Infinity ).
        set( 'now' ).
        set( 'select',

            // If there's a `value` or `data-value`, use that with formatting.
            // Otherwise default to the minimum selectable time.
            elementDataValue || picker.$node[ 0 ].value || calendar.item.now,

            // Use the relevant format and data property.
            { format: elementDataValue ? settings.formatSubmit : settings.format, data: !!elementDataValue }
        ).

        // Setting the `highlight` also sets the `view`.
        set( 'highlight', calendar.item.select )


    /**
     * The keycode to movement mapping.
     */
    calendar.key = {
        40: 7, // Down
        38: -7, // Up
        39: 1, // Right
        37: -1, // Left
        go: function( timeChange ) {
            calendar.set( 'highlight', [ calendar.item.highlight.YEAR, calendar.item.highlight.MONTH, calendar.item.highlight.DATE + timeChange ], { interval: timeChange } )
            this.render()
        }
    }


    /**
     * The time picker events.
     */
    calendar.onRender = function( $holder ) {
        var picker = this
        $holder.find( '.' + settings.klass.selectMonth ).on( 'change', function() {
            picker.set( 'highlight', [ calendar.get( 'view' ).YEAR, this.value, calendar.get( 'highlight' ).DATE ] )
            $holder.find( '.' + settings.klass.selectMonth ).focus()
        })
        $holder.find( '.' + settings.klass.selectYear ).on( 'change', function() {
            picker.set( 'highlight', [ this.value, calendar.get( 'view' ).MONTH, calendar.get( 'highlight' ).DATE ] )
            $holder.find( '.' + settings.klass.selectYear ).focus()
        })
    }
    calendar.onOpen = function( $holder ) {
        $holder.find( 'button, select' ).attr( 'disabled', false )
    }
    calendar.onClose = function( $holder ) {
        $holder.find( 'button, select' ).attr( 'disabled', true )
    }

} //DatePicker


/**
 * Set a datepicker item object.
 */
DatePicker.prototype.set = function( type, value, options ) {

    var calendar = this

    // Go through the queue of methods, and invoke the function. Update this
    // as the time unit, and set the final resultant as this item type.
    // * In the case of `enable`, keep the queue but set `disable` instead.
    //   And in the case of `flip`, keep the queue but set `enable` instead.
    calendar.item[ ( type == 'enable' ? 'disable' : type == 'flip' ? 'enable' : type ) ] = calendar.queue[ type ].split( ' ' ).map( function( method ) {
        return value = calendar[ method ]( type, value, options )
    }).pop()

    // Check if we need to cascade through more updates.
    if ( type == 'highlight' ) {
        calendar.set( 'view', calendar.item.highlight, options )
    }
    else if ( ( type == 'flip' || type == 'min' || type == 'max' || type == 'disable' || type == 'enable' ) && calendar.item.select && calendar.item.highlight ) {
        calendar.
            set( 'select', calendar.item.select, options ).
            set( 'highlight', calendar.item.highlight, options )
    }

    return calendar
} //DatePicker.prototype.set


/**
 * Get a datepicker item object.
 */
DatePicker.prototype.get = function( type ) {
    return this.item[ type ]
} //DatePicker.prototype.get


/**
 * Create a picker date object.
 */
DatePicker.prototype.create = function( type, value, options ) {

    var isInfiniteValue,
        calendar = this

    // If there's no value, use the type as the value.
    value = value === undefined ? type : value


    // If it's infinity, update the value.
    if ( value == -Infinity || value == Infinity ) {
        isInfiniteValue = value
    }

    // If it's an object, use the "time" value.
    else if ( isObject( value ) && isInteger( value.PICK ) ) {
        value = value.TIME
    }

    // If it's an array, convert it into a date.
    else if ( Array.isArray( value ) ) {
        value = new Date( value[ 0 ], value[ 1 ], value[ 2 ] )
    }

    // If it's a number or date object, make a normalized date.
    else if ( isInteger( value ) || isDate( value ) ) {
        value = calendar.normalize( new Date( value ), options )
    }

    // If it's a literal true or any other case, set it to now.
    else /*if ( value === true )*/ {
        value = calendar.now( type, value, options )
    }

    // Return the compiled object.
    return {
        YEAR: isInfiniteValue || value.getFullYear(),
        MONTH: isInfiniteValue || value.getMonth(),
        DATE: isInfiniteValue || value.getDate(),
        DAY: isInfiniteValue || value.getDay(),
        TIME: isInfiniteValue || value,
        PICK: isInfiniteValue || value.getTime()
    }
} //DatePicker.prototype.create


/**
 * Get the date today.
 */
DatePicker.prototype.now = function( type, value, options ) {
    value = new Date()
    if ( options && options.rel ) {
        value.setDate( value.getDate() + options.rel )
    }
    return this.normalize( value, options )
} //DatePicker.prototype.now


/**
 * Navigate to next/prev month.
 */
DatePicker.prototype.navigate = function( type, dateObject, options ) {
    if ( isObject( dateObject ) ) {
        dateObject = [ dateObject.YEAR, dateObject.MONTH + ( options && options.nav ? options.nav : 0 ), dateObject.DATE ]
    }
    return dateObject
}


/**
 * Normalize a date by setting the hours to midnight.
 */
DatePicker.prototype.normalize = function( value/*, options*/ ) {
    value.setHours( 0, 0, 0, 0 )
    return value
}


/**
 * Measure the range of dates.
 */
DatePicker.prototype.measure = function( type, value, options ) {

    var calendar = this

    if ( isInteger( value ) ) {
        options.rel = value
        value = calendar.now( type, value, options )
    }

    return value



    // var
    //     date = timeUnit || options.orig,
    //     calendar = this

    // // Make sure we have options to work with
    // if ( !options ) {
    //     console.warn( 'we might need some options', timeUnit, options )
    // }

    // // If it's a literal true, return the time right now.
    // // For `max`, time hasn't passed. But for `min` it has.
    // if ( timeUnit === true ) {

    //     // If it's relative a relative measure, set the time as past.
    //     // *** Find a better way to do this later.
    //     if ( options.type == 'max' || options.type == 'min' ) {
    //         options.past = 1
    //     }

    //     date = calendar.now( timeUnit, options )
    // }

    // else if ( Array.isArray( timeUnit || date ) ) {
    //     date = calendar.normalize( calendar.prepare( timeUnit || date ), options )
    // }

    // // If it's a number, return the time right now shifted relative by intervals.
    // else if ( !isNaN( timeUnit ) ) {

    //     // If it's relative a relative measure, set the time as past.
    //     // *** Find a better way to do this later.
    //     if ( options.type == 'max' || options.type == 'min' ) {
    //         options.past = 1
    //     }

    //     date = timeUnit * calendar.i + calendar.now( timeUnit, options )
    // }

    // // Return the date or default to 0.
    // return date || 0
} ///DatePicker.prototype.measure


/**
 * Create a viewset object based on navigation.
 */
DatePicker.prototype.viewset = function( type, dateObject/*, options*/ ) {
    return this.create([ dateObject.YEAR, dateObject.MONTH, 1 ])
}


/**
 * Validate a date as enabled.
 */
DatePicker.prototype.validate = function( type, dateObject, options ) {

    var calendar = this,
        interval = options && options.interval ? options.interval : 1

    // Check if the object is disabled.
    if ( calendar.disabled( dateObject ) ) {

        // Shift with the interval until we reach an enabled time.
        dateObject = calendar.shift( dateObject, interval )
    }

    // Scope the object into range.
    dateObject = calendar.scope( dateObject )

    // Do a second check to see if we landed on a disabled min/max.
    // In that case, shift using the opposite interval direction as before.
    if ( calendar.disabled( dateObject ) ) {
        dateObject = calendar.shift( dateObject, dateObject.PICK <= calendar.item.min.PICK ? 1 : dateObject.PICK >= calendar.item.max.PICK ? -1 : interval )
    }

    return dateObject
} //DatePicker.prototype.validate


/**
 * Check if an object is disabled.
 */
DatePicker.prototype.disabled = function( dateObject ) {

    var
        calendar = this,

        // Filter through the disabled dates to check if this is one.
        isDisabledTime = calendar.item.disable.filter( function( dateToDisable ) {

            // If the date is a number, match the weekday with 0index and `firstDay` check.
            if ( isInteger( dateToDisable ) ) {
                return dateObject.DAY == ( calendar.settings.firstDay ? dateToDisable : dateToDisable - 1 ) % 7
            }

            // If it's an array, create the object and match the exact date.
            if ( Array.isArray( dateToDisable ) ) {
                return dateObject.PICK == calendar.create( dateToDisable ).PICK
            }
        }).length

    // If the calendar is "enabled" flag is flipped, flip the condition.
    return calendar.item.enable === -1 ? !isDisabledTime : isDisabledTime
} //DatePicker.prototype.disabled


/**
 * Shift an object by an interval until we reach an enabled object.
 */
DatePicker.prototype.shift = function( dateObject, interval ) {

    var calendar = this,
        originalDateObject = dateObject

    // Keep looping as long as the time is disabled.
    while ( calendar.disabled( dateObject ) ) {

        // Increase/decrease the date by the key movement and keep looping.
        dateObject = calendar.create([ dateObject.YEAR, dateObject.MONTH, dateObject.DATE + ( interval || 1 ) ])

        // If we've looped through to the next month, break out of the loop.
        if ( dateObject.MONTH != originalDateObject.MONTH ) {
            break
        }
    }

    // Return the final object.
    return dateObject
} //DatePicker.prototype.shift


/**
 * Scope an object into range of min and max.
 */
DatePicker.prototype.scope = function( dateObject ) {
    var minTime = this.item.min.PICK,
        maxTime = this.item.max.PICK
    return this.create( dateObject.PICK > maxTime ? maxTime : dateObject.PICK < minTime ? minTime : dateObject )
} //DatePicker.prototype.scope


/**
 * Parse a string into a usable type.
 */
DatePicker.prototype.parse = function( type, value, options ) {

    var
        calendar = this,
        parsingObject = {}

    if ( !value || isInteger( value ) || Array.isArray( value ) || isDate( value ) || isObject( value ) && isInteger( value.PICK ) ) {
        return value
    }

    // We need a `.format` to parse the value.
    if ( !( options && options.format ) ) {
        throw "Need a formatting option to parse this.."
    }

    // Convert the format into an array and then map through it.
    calendar.formats.toArray( options.format ).map( function( label ) {

        var
            // Grab the formatting label.
            formattingLabel = calendar.formats[ label ],

            // The format length is from the formatting label function or the
            // label length without the escaping exclamation (!) mark.
            formatLength = formattingLabel ? triggerFunction( formattingLabel, calendar, [ value, parsingObject ] ) : label.replace( /^!/, '' ).length

        // If there's a format label, split the value up to the format length.
        // Then add it to the parsing object with appropriate label.
        if ( formattingLabel ) {
            parsingObject[ label ] = value.substr( 0, formatLength )
        }

        // Update the value as the substring from format length to end.
        value = value.substr( formatLength )
    })

    return [ parsingObject.yyyy || parsingObject.yy, +( parsingObject.mm || parsingObject.m ) - ( options.data ?  1 : 0 ), parsingObject.dd || parsingObject.d ]
} //DatePicker.prototype.parse


/**
 * Various formats to display the object in.
 */
DatePicker.prototype.formats = (function() {

    // Return the length of the first word in a collection.
    var getWordLengthFromCollection = function( string, collection, dateObject ) {

        // Grab the first word from the string.
        var word = string.match( /\w+/ )[ 0 ]

        // If there's no month index, add it to the date object
        if ( !dateObject.mm && !dateObject.m ) {
            dateObject.m = collection.indexOf( word )
        }

        // Return the length of the word.
        return word.length
    }

    return {

        d: function( string, dateObject ) {

            // If there's string, then get the digits length.
            // Otherwise return the selected date.
            return string ? getDigitsLength( string ) : dateObject.DATE
        },
        dd: function( string, dateObject ) {

            // If there's a string, then the length is always 2.
            // Otherwise return the selected date with a leading zero.
            return string ? 2 : leadZero( dateObject.DATE )
        },
        ddd: function( string, dateObject ) {

            // If there's a string, then get the length of the first word.
            // Otherwise return the short selected weekday.
            return string ? getFirstWordLength( string ) : this.settings.weekdaysShort[ dateObject.DAY ]
        },
        dddd: function( string, dateObject ) {

            // If there's a string, then get the length of the first word.
            // Otherwise return the full selected weekday.
            return string ? getFirstWordLength( string ) : this.settings.weekdaysFull[ dateObject.DAY ]
        },
        m: function( string, dateObject ) {

            // If there's a string, then get the length of the digits
            // Otherwise return the selected month with 0index compensation.
            return string ? getDigitsLength( string ) : dateObject.MONTH + 1
        },
        mm: function( string, dateObject ) {

            // If there's a string, then the length is always 2.
            // Otherwise return the selected month with 0index and leading zero.
            return string ? 2 : leadZero( dateObject.MONTH + 1 )
        },
        mmm: function( string, dateObject ) {

            var collection = this.settings.monthsShort

            // If there's a string, get length of the relevant month from the short
            // months collection. Otherwise return the selected month from that collection.
            return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ dateObject.MONTH ]
        },
        mmmm: function( string, dateObject ) {

            var collection = this.settings.monthsFull

            // If there's a string, get length of the relevant month from the full
            // months collection. Otherwise return the selected month from that collection.
            return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ dateObject.MONTH ]
        },
        yy: function( string, dateObject ) {

            // If there's a string, then the length is always 2.
            // Otherwise return the selected year by slicing out the first 2 digits.
            return string ? 2 : ( '' + dateObject.YEAR ).slice( 2 )
        },
        yyyy: function( string, dateObject ) {

            // If there's a string, then the length is always 4.
            // Otherwise return the selected year.
            return string ? 4 : dateObject.YEAR
        },

        // Create an array by splitting the formatting string passed.
        toArray: function( formatString ) { return formatString.split( /(d{1,4}|m{1,4}|y{4}|yy|!.)/g ) },

        // Format an object into a string using the formatting options.
        toString: function ( formatString, itemObject ) {
            var calendar = this
            return calendar.formats.toArray( formatString ).map( function( label ) {
                return triggerFunction( calendar.formats[ label ], calendar, [ 0, itemObject ] ) || label.replace( /^!/, '' )
            }).join( '' )
        }
    }
})() //DatePicker.prototype.formats


/**
 * Flip an item as enabled or disabled.
 */
DatePicker.prototype.flipItem = function( type, value/*, options*/ ) {

    var calendar = this,
        collection = calendar.item.disable,
        isFlipped = calendar.item.enable === -1

    if ( !isFlipped && type == 'enable' || isFlipped && type == 'disable' ) {
        collection = calendar.removeDisabled( collection, value )
    }
    else if ( !isFlipped && type == 'disable' || isFlipped && type == 'enable' ) {
        collection = calendar.addDisabled( collection, value )
    }

    return collection
} //DatePicker.prototype.flipItem


/**
 * Flip all items as disabled or enabled.
 */
DatePicker.prototype.flipAll = function( type, value/*, options*/ ) {
    return value === false ? 1 : -1
}


/**
 * Add an item to the disabled collection.
 */
DatePicker.prototype.addDisabled = function( collection, item ) {
    var calendar = this
    item.map( function( timeUnit ) {
        if ( !calendar.filterDisabled( collection, timeUnit ).length ) {
            collection.push( timeUnit )
        }
    })
    return collection
} //DatePicker.prototype.addDisabled


/**
 * Remove an item from the disabled collection.
 */
DatePicker.prototype.removeDisabled = function( collection, item ) {
    var calendar = this
    item.map( function( timeUnit ) {
        collection = calendar.filterDisabled( collection, timeUnit, 1 )
    })
    return collection
} //DatePicker.prototype.removeDisabled


/**
 * Filter through the disabled collection to find a time unit.
 */
DatePicker.prototype.filterDisabled = function( collection, timeUnit, isRemoving ) {
    var timeIsArray = Array.isArray( timeUnit )
    return collection.filter( function( disabledTimeUnit ) {
        var isMatch = !timeIsArray && timeUnit === disabledTimeUnit ||
            timeIsArray && Array.isArray( disabledTimeUnit ) && timeUnit.toString() === disabledTimeUnit.toString()
        return isRemoving ? !isMatch : isMatch
    })
} //DatePicker.prototype.filterDisabled


/**
 * Create a string for the nodes in the picker.
 */
DatePicker.prototype.nodes = function( isOpen ) {

    var
        calendar = this,
        settings = calendar.settings,
        nowObject = calendar.item.now,
        selectedObject = calendar.item.select,
        highlightedObject = calendar.item.highlight,
        viewsetObject = calendar.item.view,
        disabledCollection = calendar.item.disable,
        minLimitObject = calendar.item.min,
        maxLimitObject = calendar.item.max,


        // Create the calendar table head using a copy of weekday labels collection.
        // * We do a copy so we don't mutate the original array.
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
                    max: DAYS_IN_WEEK - 1,
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
        })( ( settings.showWeekdaysFull ? settings.weekdaysFull : settings.weekdaysShort ).slice( 0 ) ), //tableHead


        // Create the nav for next/prev month.
        createMonthNav = function( next ) {

            // Otherwise, return the created month tag.
            return createNode(
                'div',
                ' ',
                settings.klass[ 'nav' + ( next ? 'Next' : 'Prev' ) ] + (

                    // If the focused month is outside the range, disabled the button.
                    ( next && viewsetObject.YEAR >= maxLimitObject.YEAR && viewsetObject.MONTH >= maxLimitObject.MONTH ) ||
                    ( !next && viewsetObject.YEAR <= minLimitObject.YEAR && viewsetObject.MONTH <= minLimitObject.MONTH ) ?
                    ' ' + settings.klass.navDisabled : ''
                ),
                'data-nav=' + ( next || -1 )
            ) //endreturn
        }, //createMonthNav


        // Create the month label
        createMonthLabel = function( monthsCollection ) {

            // If there are months to select, add a dropdown menu.
            if ( settings.selectMonths ) {

                return createNode( 'select', createGroupOfNodes({
                    min: 0,
                    max: 11,
                    i: 1,
                    node: 'option',
                    item: function( loopedMonth ) {

                        return [

                            // The looped month and no classes.
                            monthsCollection[ loopedMonth ], 0,

                            // Set the value and selected index.
                            'value=' + loopedMonth +
                            ( viewsetObject.MONTH == loopedMonth ? ' selected' : '' ) +
                            (
                                (
                                    ( viewsetObject.YEAR == minLimitObject.YEAR && loopedMonth < minLimitObject.MONTH ) ||
                                    ( viewsetObject.YEAR == maxLimitObject.YEAR && loopedMonth > maxLimitObject.MONTH )
                                ) ?
                                ' disabled' : ''
                            )
                        ]
                    }
                }), settings.klass.selectMonth )
            }

            // If there's a need for a month selector
            return createNode( 'div', monthsCollection[ viewsetObject.MONTH ], settings.klass.month )
        }, //createMonthLabel


        // Create the year label
        createYearLabel = function() {

            var focusedYear = viewsetObject.YEAR,

            // If years selector is set to a literal "true", set it to 5. Otherwise
            // divide in half to get half before and half after focused year.
            numberYears = settings.selectYears === true ? 5 : ~~( settings.selectYears / 2 )

            // If there are years to select, add a dropdown menu.
            if ( numberYears ) {

                var
                    minYear = minLimitObject.YEAR,
                    maxYear = maxLimitObject.YEAR,
                    lowestYear = focusedYear - numberYears,
                    highestYear = focusedYear + numberYears

                // If the min year is greater than the lowest year, increase the highest year
                // by the difference and set the lowest year to the min year.
                if ( minYear > lowestYear ) {
                    highestYear += minYear - lowestYear
                    lowestYear = minYear
                }

                // If the max year is less than the highest year, decrease the lowest year
                // by the lower of the two: available and needed years. Then set the
                // highest year to the max year.
                if ( maxYear < highestYear ) {

                    var availableYears = lowestYear - minYear,
                        neededYears = highestYear - maxYear

                    lowestYear -= availableYears > neededYears ? neededYears : availableYears
                    highestYear = maxYear
                }

                return createNode( 'select', createGroupOfNodes({
                    min: lowestYear,
                    max: highestYear,
                    i: 1,
                    node: 'option',
                    item: function( loopedYear ) {
                        return [

                            // The looped year and no classes.
                            loopedYear, 0,

                            // Set the value and selected index.
                            'value=' + loopedYear + ( focusedYear == loopedYear ? ' selected' : '' )
                        ]
                    }
                }), settings.klass.selectYear )
            }

            // Otherwise just return the year focused
            return createNode( 'div', focusedYear, settings.klass.year )
        } //createYearLabel


    // Create and return the entire calendar.
    return createNode(
        'div',
        createMonthNav() + createMonthNav( 1 ) +
        createMonthLabel( settings.showMonthsShort ? settings.monthsShort : settings.monthsFull ) +
        createYearLabel(),
        settings.klass.header
    ) + createNode(
        'table',
        tableHead +
        createNode(
            'tbody',
            createGroupOfNodes({
                min: 0,
                max: WEEKS_IN_CALENDAR - 1,
                i: 1,
                node: 'tr',
                item: function( rowCounter ) {

                    return [
                        createGroupOfNodes({
                            min: DAYS_IN_WEEK * rowCounter - viewsetObject.DAY + 1, // Add 1 for weekday 0index
                            max: function() {
                                return this.min + DAYS_IN_WEEK - 1
                            },
                            i: 1,
                            node: 'td',
                            item: function( timeDate ) {

                                // Convert the time date from a relative date to a date object
                                timeDate = calendar.create([ viewsetObject.YEAR, viewsetObject.MONTH, timeDate + ( settings.firstDay ? 1 : 0 ) ])

                                return [
                                    createNode(
                                        'div',
                                        timeDate.DATE,
                                        (function( klasses ) {

                                            // Add the `infocus` or `outfocus` classes based on month in view.
                                            klasses.push( viewsetObject.MONTH == timeDate.MONTH ? settings.klass.infocus : settings.klass.outfocus )

                                            // Add the `today` class if needed.
                                            if ( nowObject.PICK == timeDate.PICK ) {
                                                klasses.push( settings.klass.now )
                                            }

                                            // Add the `selected` class if something's selected and the time matches.
                                            if ( selectedObject && selectedObject.PICK == timeDate.PICK ) {
                                                klasses.push( settings.klass.selected )
                                            }

                                            // Add the `highlighted` class if something's highlighted and the time matches.
                                            if ( highlightedObject && highlightedObject.PICK == timeDate.PICK ) {
                                                klasses.push( settings.klass.highlighted )
                                            }

                                            // Add the `disabled` class if something's disabled and the object matches.
                                            if ( disabledCollection && calendar.disabled( timeDate ) || timeDate.PICK < minLimitObject.PICK || timeDate.PICK > maxLimitObject.PICK ) {
                                                klasses.push( settings.klass.disabled )
                                            }

                                            return klasses.join( ' ' )
                                        })([ settings.klass.day ]),
                                        'data-pick=' + timeDate.PICK
                                    )
                                ] //endreturn
                            }
                        })
                    ] //endreturn
                }
            })
        ),
        settings.klass.table
    ) +

    createNode(
        'div',
        createNode( 'button', settings.today, settings.klass.buttonToday, 'data-pick=' + nowObject.PICK + ( isOpen ? '' : ' disabled' ) ) +
        createNode( 'button', settings.clear, settings.klass.buttonClear, 'data-clear=1' + ( isOpen ? '' : ' disabled' ) ),
        settings.klass.footer
    ) //endreturn
} //DatePicker.prototype.nodes














//     /* ==========================================================================
//        Build date picker components
//        ========================================================================== */


//     /**
//      * Create a date object by validating it can be "reached".
//      */
//     CalendarPicker.prototype.validate = function( datePassed, keyMovement ) {

//         var calendar = this,
//             minLimitObject = calendar.props.get( 'min' ),
//             maxLimitObject = calendar.props.get( 'max' ),

//             // Make sure we have a date object to work with.
//             datePassedObject = datePassed && !isNaN( datePassed.TIME ) ? datePassed : calendar.create( datePassed )

//         // If we passed the lower bound, set the key movement upwards,
//         // flip our "reached min" flag, and set the date to the lower bound.
//         if ( datePassedObject.TIME < minLimitObject.TIME ) {
//             keyMovement = 1
//             calendar.doneMin = 1
//             datePassedObject = minLimitObject
//         }

//         // Otherwise if we passed the upper bound, set the key movement downwards,
//         // flip our "reached max" flag, and set the date to the upper bound.
//         else if ( datePassedObject.TIME > maxLimitObject.TIME ) {
//             keyMovement = -1
//             calendar.doneMax = 1
//             datePassedObject = maxLimitObject
//         }

//         // If we've hit the upper and lower bounds, set the date to now and move on.
//         if ( calendar.doneMin && calendar.doneMax ) {
//             datePassedObject = calendar.props.get( 'now' )
//         }

//         // Otherwise if there are dates to disable and this is one of them,
//         // shift using the interval until we reach an enabled date.
//         else if ( calendar.props.disable.length && calendar.disable( datePassedObject ) ) {
//             datePassedObject = calendar.shift( datePassedObject, datePassedObject.TIME > maxLimitObject.TIME ? -1 : keyMovement || 1 )
//         }

//         // Reset the check for if we reached the min and max bounds.
//         calendar.doneMin = undefined
//         calendar.doneMax = undefined

//         return datePassedObject
//     } //CalendarPicker.prototype.validate


//     // /**
//     //  * Create the lower bounding date object.
//     //  */
//     // CalendarPicker.prototype.min = function() {

//     //     var
//     //         calendar = this,
//     //         limit = calendar.SETTINGS.min,
//     //         nowObject = calendar.object()

//     //     // If the limit is set to true, just return today.
//     //     if ( limit === true ) {
//     //         return nowObject
//     //     }

//     //     // If there is a limit and its a number, create a
//     //     // time object relative to today by adding the limit.
//     //     if ( limit && !isNaN( limit ) ) {
//     //         return calendar.object([ nowObject.YEAR, nowObject.MONTH, nowObject.DATE + limit ])
//     //     }

//     //     // If the limit is an array, construct the time object.
//     //     if ( Array.isArray( limit ) ) {
//     //         return calendar.object( limit )
//     //     }

//     //     // Otherwise create an infinite time.
//     //     return calendar.object( 0, -Infinity )
//     // }


//     // /**
//     //  * Create the upper bounding date object.
//     //  */
//     // CalendarPicker.prototype.max = function() {

//     //     var
//     //         calendar = this,
//     //         limit = calendar.SETTINGS.max,
//     //         nowObject = calendar.object()

//     //     // If the limit is set to true, just return today.
//     //     if ( limit === true ) {
//     //         return nowObject
//     //     }

//     //     // If there is a limit and its a number, create a
//     //     // time object relative to today by adding the limit.
//     //     if ( limit && !isNaN( limit ) ) {
//     //         return calendar.object([ nowObject.YEAR, nowObject.MONTH, nowObject.DATE + limit ])
//     //     }

//     //     // If the limit is an array, construct the time object.
//     //     if ( Array.isArray( limit ) ) {
//     //         return calendar.object( limit )
//     //     }

//     //     // Otherwise create an infinite time.
//     //     return calendar.object( 0, Infinity )
//     // }





/*jshint
   debug: true,
   devel: true,
   browser: true,
   asi: true,
   unused: true,
   boss: true
 */


/* ==========================================================================
   Build time picker components
   ========================================================================== */

/**
 * Globals and constants
 */
var HOURS_IN_DAY = 24,
    MINUTES_IN_HOUR = 60,
    HOURS_TO_NOON = 12,
    MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR



/**
 * The time picker constructor
 */
function TimePicker( picker, settings ) {

    var clock = this,
        elementDataValue = picker.$node.data( 'value' )

    clock.settings = settings

    // The queue of methods that will be used to build item objects.
    clock.queue = {
        interval: 'i',
        min: 'measure create',
        max: 'measure create',
        now: 'now create',
        select: 'parse create validate',
        highlight: 'create validate',
        view: 'create validate',
        disable: 'flipItem',
        enable: 'flipItem',
        flip: 'flipAll'
    }

    // The component's item object.
    clock.item = {}

    clock.item.interval = settings.interval || 30
    clock.item.disable = ( settings.disable || [] ).slice( 0 )
    clock.item.enable = -(function( collectionDisabled ) {
        return collectionDisabled[ 0 ] === true ? collectionDisabled.shift() : -1
    })( clock.item.disable )

    clock.
        set( 'min', settings.min || [ 0, 0 ] ).
        set( 'max', settings.max || [ HOURS_IN_DAY - 1, MINUTES_IN_HOUR - 1 ] ).
        set( 'now' ).
        set( 'select',

            // If there's a `value` or `data-value`, use that with formatting.
            // Otherwise default to the minimum selectable time.
            elementDataValue || picker.$node[ 0 ].value || clock.item.min,

            // Use the relevant format.
            { format: elementDataValue ? settings.formatSubmit : settings.format }
        ).

        // Setting the `highlight` also sets the `view`.
        set( 'highlight', clock.item.select )

    /**
     * The keycode to movement mapping.
     */
    clock.key = {
        40: 1, // Down
        38: -1, // Up
        39: 1, // Right
        37: -1, // Left
        go: function( timeChange ) {
            clock.set( 'highlight', clock.item.highlight.PICK + timeChange * clock.item.interval, { interval: timeChange * clock.item.interval } )
            this.render()
        }
    }


    /**
     * The time picker events.
     */
    clock.onRender = function( $holder ) {
        var $viewset = $holder.find( '.' + settings.klass.viewset )
        if ( $viewset.length ) {
            $holder[ 0 ].scrollTop = $viewset.position().top - ~~( $holder[ 0 ].clientHeight / 4 )
        }
        else {
            console.warn( 'Nothing to viewset with', clock.item.view )
        }
    }
    clock.onOpen = function( $holder ) {
        $holder.find( 'button' ).attr( 'disable', false )
    }
    clock.onClose = function( $holder ) {
        $holder.find( 'button' ).attr( 'disable', true )
    }

} //TimePicker


/**
 * Set a timepicker item object.
 */
TimePicker.prototype.set = function( type, value, options ) {

    var clock = this

    // Go through the queue of methods, and invoke the function. Update this
    // as the time unit, and set the final resultant as this item type.
    // * In the case of `enable`, keep the queue but set `disable` instead.
    //   And in the case of `flip`, keep the queue but set `enable` instead.
    clock.item[ ( type == 'enable' ? 'disable' : type == 'flip' ? 'enable' : type ) ] = clock.queue[ type ].split( ' ' ).map( function( method ) {
        return value = clock[ method ]( type, value, options )
    }).pop()

    // Check if we need to cascade through more updates.
    if ( type == 'highlight' ) {
        clock.set( 'view', clock.item.highlight, options )
    }
    else if ( type == 'interval' ) {
        clock.
            set( 'min', clock.item.min, options ).
            set( 'max', clock.item.max, options )
    }
    else if ( ( type == 'flip' || type == 'min' || type == 'max' || type == 'disable' || type == 'enable' ) && clock.item.select && clock.item.highlight ) {
        if ( type == 'min' ) {
            clock.set( 'max', clock.item.max, options )
        }
        clock.
            set( 'select', clock.item.select, options ).
            set( 'highlight', clock.item.highlight, options )
    }

    return clock
} //TimePicker.prototype.set


/**
 * Get a timepicker item object.
 */
TimePicker.prototype.get = function( type ) {
    return this.item[ type ]
} //TimePicker.prototype.get


/**
 * Create a picker time object.
 */
TimePicker.prototype.create = function( type, value, options ) {

    var clock = this

    // If there's no value, use the type as the value.
    value = value === undefined ? type : value

    // If it's an object, use the "pick" value.
    if ( isObject( value ) && isInteger( value.PICK ) ) {
        value = value.PICK
    }

    // If it's an array, convert it into minutes.
    else if ( Array.isArray( value ) ) {
        value = +value[ 0 ] * MINUTES_IN_HOUR + (+value[ 1 ])
    }

    // If no valid value is passed, set it to "now".
    else if ( !isInteger( value ) ) {
        value = clock.now( type, value, options )
    }

    // If we're setting the max, make sure it's greater than the min.
    if ( type == 'max' && value < clock.item.min.PICK ) {
        value += MINUTES_IN_DAY
    }

    // Normalize it into a "reachable" interval.
    value = clock.normalize( value, options )

    // Return the compiled object.
    return {

        // Divide to get hours from minutes.
        HOUR: ~~( HOURS_IN_DAY + value / MINUTES_IN_HOUR ) % HOURS_IN_DAY,

        // The remainder is the minutes.
        MINS: ( MINUTES_IN_HOUR + value % MINUTES_IN_HOUR ) % MINUTES_IN_HOUR,

        // The time in total minutes.
        TIME: ( MINUTES_IN_DAY + value ) % MINUTES_IN_DAY,

        // Reference to the "relative" value to pick.
        PICK: value
    }
} //TimePicker.prototype.create


/**
 * Get the time relative to now.
 */
TimePicker.prototype.now = function( type, value/*, options*/ ) {
    var date = new Date()
    // Add an interval because the time has passed.
    return ( ( isInteger( value ) ? value + 1 : 1 ) * this.item.interval ) + date.getHours() * MINUTES_IN_HOUR + date.getMinutes()
} //TimePicker.prototype.now


/**
 * Normalize minutes or an object to be "reachable" based on the interval.
 */
TimePicker.prototype.normalize = function( value/*, options*/ ) {
    // If it's a negative value, add one interval to keep it as "passed".
    return value - ( ( value < 0 ? this.item.interval : 0 ) + value % this.item.interval )
} //TimePicker.prototype.normalize


/**
 * Measure the range of minutes.
 */
TimePicker.prototype.measure = function( type, value, options ) {

    var clock = this

    // If it's an integer, we need to make it relative to now.
    if ( isInteger( value ) ) {
        value = clock.now( type, value, options )
    }

    // If it's a literal true, return the time right now.
    else if ( value === true ) {
        value = clock.now( type, value, options )
    }

    // If it's an object already, just normalize it.
    else if ( isObject( value ) && isInteger( value.PICK ) ) {
        value = clock.normalize( value.PICK, options )
    }

    return value
} ///TimePicker.prototype.measure


/**
 * Validate an object as enabled.
 */
TimePicker.prototype.validate = function( type, timeObject, options ) {

    var clock = this,
        interval = options && options.interval ? options.interval : clock.item.interval

    // Check if the object is disabled.
    if ( clock.disabled( timeObject ) ) {

        // Shift with the interval until we reach an enabled time.
        timeObject = clock.shift( timeObject, interval )
    }

    // Scope the object into range.
    timeObject = clock.scope( timeObject )

    // Do a second check to see if we landed on a disabled min/max.
    // In that case, shift using the opposite interval as before.
    if ( clock.disabled( timeObject ) ) {
        timeObject = clock.shift( timeObject, interval * -1 )
    }

    // Return the final object.
    return timeObject
} //TimePicker.prototype.validate


/**
 * Check if an object is disabled.
 */
TimePicker.prototype.disabled = function( timeObject ) {

    var
        clock = this,

        // Filter through the disabled times to check if this is one.
        isDisabledTime = clock.item.disable.filter( function( timeToDisable ) {

            // If the time is a number, match the hours.
            if ( isInteger( timeToDisable ) ) {
                return timeObject.HOUR == timeToDisable
            }

            // If it's an array, create the object and match the times.
            if ( Array.isArray( timeToDisable ) ) {
                return timeObject.PICK == clock.create( timeToDisable ).PICK
            }
        }).length

    // If the clock is "enabled" flag is flipped, flip the condition.
    return clock.item.enable === -1 ? !isDisabledTime : isDisabledTime
} //TimePicker.prototype.disabled


/**
 * Shift an object by an interval until we reach an enabled object.
 */
TimePicker.prototype.shift = function( timeObject, interval ) {

    var
        clock = this

    // Keep looping as long as the time is disabled.
    while ( clock.disabled( timeObject ) ) {

        // Increase/decrease the time by the interval and keep looping.
        timeObject = clock.create( timeObject.PICK += interval || clock.item.interval )

        // If we've looped beyond the limits, break out of the loop.
        if ( timeObject.PICK <= clock.item.min.PICK || timeObject.PICK >= clock.item.max.PICK ) {
            break
        }
    }

    // Return the final object.
    return timeObject
} //TimePicker.prototype.shift


/**
 * Scope an object to be within range of min and max.
 */
TimePicker.prototype.scope = function( timeObject ) {
    var minLimit = this.item.min.PICK,
        maxLimit = this.item.max.PICK
    return this.create( timeObject.PICK > maxLimit ? maxLimit : timeObject.PICK < minLimit ? minLimit : timeObject )
} //TimePicker.prototype.scope


/**
 * Parse a string into a usable type.
 */
TimePicker.prototype.parse = function( type, value, options ) {

    var
        clock = this,
        parsingObject = {}

    if ( !value || isInteger( value ) || Array.isArray( value ) || isDate( value ) || isObject( value ) && isInteger( value.PICK ) ) {
        return value
    }

    // We need a `.format` to parse the value.
    if ( !( options && options.format ) ) {
        throw "Need a formatting option to parse this.."
    }

    // Convert the format into an array and then map through it.
    clock.formats.toArray( options.format ).map( function( label ) {

        var
            // Grab the formatting label.
            formattingLabel = clock.formats[ label ],

            // The format length is from the formatting label function or the
            // label length without the escaping exclamation (!) mark.
            formatLength = formattingLabel ? triggerFunction( formattingLabel, clock, [ value, parsingObject ] ) : label.replace( /^!/, '' ).length

        // If there's a format label, split the value up to the format length.
        // Then add it to the parsing object with appropriate label.
        if ( formattingLabel ) {
            parsingObject[ label ] = value.substr( 0, formatLength )
        }

        // Update the time value as the substring from format length to end.
        value = value.substr( formatLength )
    })

    return +parsingObject.i + MINUTES_IN_HOUR * (

        +( parsingObject.H || parsingObject.HH ) ||

        ( +( parsingObject.h || parsingObject.hh ) + ( /^p/i.test( parsingObject.A || parsingObject.a ) ? 12 : 0 ) )
    )
} //TimePicker.prototype.parse


/**
 * Various formats to display the object in.
 */
TimePicker.prototype.formats = {

    h: function( string, timeObject ) {

        // If there's string, then get the digits length.
        // Otherwise return the selected hour in "standard" format.
        return string ? getDigitsLength( string ) : timeObject.HOUR % HOURS_TO_NOON || HOURS_TO_NOON
    },
    hh: function( string, timeObject ) {

        // If there's a string, then the length is always 2.
        // Otherwise return the selected hour in "standard" format with a leading zero.
        return string ? 2 : leadZero( timeObject.HOUR % HOURS_TO_NOON || HOURS_TO_NOON )
    },
    H: function( string, timeObject ) {

        // If there's string, then get the digits length.
        // Otherwise return the selected hour in "military" format as a string.
        return string ? getDigitsLength( string ) : '' + timeObject.HOUR
    },
    HH: function( string, timeObject ) {

        // If there's string, then get the digits length.
        // Otherwise return the selected hour in "military" format with a leading zero.
        return string ? getDigitsLength( string ) : leadZero( timeObject.HOUR )
    },
    i: function( string, timeObject ) {

        // If there's a string, then the length is always 2.
        // Otherwise return the selected minutes.
        return string ? 2 : leadZero( timeObject.MINS )
    },
    a: function( string, timeObject ) {

        // If there's a string, then the length is always 4.
        // Otherwise check if it's more than "noon" and return either am/pm.
        return string ? 4 : MINUTES_IN_DAY / 2 > timeObject.TIME % MINUTES_IN_DAY ? 'a.m.' : 'p.m.'
    },
    A: function( string, timeObject ) {

        // If there's a string, then the length is always 2.
        // Otherwise check if it's more than "noon" and return either am/pm.
        return string ? 2 : MINUTES_IN_DAY / 2 > timeObject.TIME % MINUTES_IN_DAY ? 'AM' : 'PM'
    },

    // Create an array by splitting the formatting string passed.
    toArray: function( formatString ) { return formatString.split( /(h{1,2}|H{1,2}|i|a|A|!.)/g ) },

    // Format an object into a string using the formatting options.
    toString: function ( formatString, itemObject ) {
        var clock = this
        return clock.formats.toArray( formatString ).map( function( label ) {
            return triggerFunction( clock.formats[ label ], clock, [ 0, itemObject ] ) || label.replace( /^!/, '' )
        }).join( '' )
    }
} //TimePicker.prototype.formats


/**
 * Flip an item as enabled or disabled.
 */
TimePicker.prototype.flipItem = function( type, value/*, options*/ ) {

    var clock = this,
        collection = clock.item.disable,
        isFlipped = clock.item.enable === -1

    if ( !isFlipped && type == 'enable' || isFlipped && type == 'disable' ) {
        collection = clock.removeDisabled( collection, value )
    }
    else if ( !isFlipped && type == 'disable' || isFlipped && type == 'enable' ) {
        collection = clock.addDisabled( collection, value )
    }

    return collection
} //TimePicker.prototype.flipItem


/**
 * Flip all items as disabled or enabled.
 */
TimePicker.prototype.flipAll = function( type, value/*, options*/ ) {
    return value === false ? 1 : -1
}


/**
 * Add an item to the disabled collection.
 */
TimePicker.prototype.addDisabled = function( collection, item ) {
    var clock = this
    item.map( function( timeUnit ) {
        if ( !clock.filterDisabled( collection, timeUnit ).length ) {
            collection.push( timeUnit )
        }
    })
    return collection
} //TimePicker.prototype.addDisabled


/**
 * Remove an item from the disabled collection.
 */
TimePicker.prototype.removeDisabled = function( collection, item ) {
    var clock = this
    item.map( function( timeUnit ) {
        collection = clock.filterDisabled( collection, timeUnit, 1 )
    })
    return collection
} //TimePicker.prototype.removeDisabled


/**
 * Filter through the disabled collection to find a time unit.
 */
TimePicker.prototype.filterDisabled = function( collection, timeUnit, isRemoving ) {
    var timeIsArray = Array.isArray( timeUnit )
    return collection.filter( function( disabledTimeUnit ) {
        var isMatch = !timeIsArray && timeUnit === disabledTimeUnit ||
            timeIsArray && Array.isArray( disabledTimeUnit ) && timeUnit.toString() === disabledTimeUnit.toString()
        return isRemoving ? !isMatch : isMatch
    })
} //TimePicker.prototype.filterDisabled


/**
 * The division to use for the range intervals.
 */
TimePicker.prototype.i = function( type, value/*, options*/ ) {
    return isInteger( value ) && value > 0 ? value : this.item.interval
}


/**
 * Create a string for the nodes in the picker.
 */
TimePicker.prototype.nodes = function( isOpen ) {

    var
        clock = this,
        settings = clock.settings,
        selectedObject = clock.item.select,
        highlightedObject = clock.item.highlight,
        viewsetObject = clock.item.view,
        disabledCollection = clock.item.disable

    return createNode( 'ul', createGroupOfNodes({
        min: clock.item.min.PICK,
        max: clock.item.max.PICK,
        i: clock.item.interval,
        node: 'li',
        item: function( loopedTime ) {
            loopedTime = clock.create( loopedTime )
            return [
                triggerFunction( clock.formats.toString, clock, [ settings.format, loopedTime ] ),
                (function( klasses, timeMinutes ) {

                    if ( selectedObject && selectedObject.PICK == timeMinutes ) {
                        klasses.push( settings.klass.selected )
                    }

                    if ( highlightedObject && highlightedObject.PICK == timeMinutes ) {
                        klasses.push( settings.klass.highlighted )
                    }

                    if ( viewsetObject && viewsetObject.PICK == timeMinutes ) {
                        klasses.push( settings.klass.viewset )
                    }

                    if ( disabledCollection && clock.disabled( loopedTime ) ) {
                        klasses.push( settings.klass.disabled )
                    }

                    return klasses.join( ' ' )
                })( [ settings.klass.listItem ], loopedTime.PICK ),
                'data-pick=' + loopedTime.PICK
            ]
        }
    }) + createNode( 'li', createNode( 'button', settings.clear, settings.klass.buttonClear, 'data-clear=1' + ( isOpen ? '' : ' disabled' ) ) ), settings.klass.list )
} //TimePicker.prototype.nodes



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
                        console.log( 'click', event.target.nodeName )
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
                triggerFunction( SETTINGS.onSet, P, [ P.$box ] )

                return P
            }, //set


            /**
             * Get the values
             */
            get: function( options ) {

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




})( jQuery, document );