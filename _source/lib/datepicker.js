
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

        // $holder.find( '.' + settings.klass.selectMonth ).on( 'change', function() {
        //     picker.set( 'view', [ calendar.props.get( 'view' ).YEAR, this.value, calendar.props.get( 'highlight' ).DATE ] )
        //     $holder.find( '.' + settings.klass.selectMonth ).focus()
        // })

        // $holder.find( '.' + settings.klass.selectYear ).on( 'change', function() {
        //     picker.set( 'view', [ this.value, calendar.props.get( 'view' ).MONTH, calendar.props.get( 'highlight' ).DATE ] )
        //     $holder.find( '.' + settings.klass.selectYear ).focus()
        // })

        triggerFunction( settings.onRender, picker, [ $holder ] )
    }
    calendar.onStart = function( $holder ) {
        triggerFunction( settings.onStart, this, [ $holder ] )
    }
    calendar.onOpen = function( $holder ) {
        $holder.find( 'button, select' ).attr( 'disabled', false )
        triggerFunction( settings.onOpen, this, [ $holder ] )
    }
    calendar.onClose = function( $holder ) {
        $holder.find( 'button, select' ).attr( 'disabled', true )
        triggerFunction( settings.onClose, this, [ $holder ] )
    }
    calendar.onSet = function( $holder ) {
        triggerFunction( settings.onSet, this, [ $holder ] )
    }
    calendar.onStop = function( $holder ) {
        triggerFunction( settings.onStop, this, [ $holder ] )
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
        })( ( settings.showWeekdaysShort ? settings.weekdaysShort : settings.weekdaysFull ).slice( 0 ) ), //tableHead


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
        createMonthLabel( settings.showMonthsFull ? settings.monthsFull : settings.monthsShort ) +
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



