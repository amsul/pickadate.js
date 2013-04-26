
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
        enable: 'flipItem'
    }

    // The component's item object.
    calendar.item = {}

    calendar.item.disable = ( settings.disable || [] ).slice( 0 )
    calendar.item.enable = -(function( collectionDisabled ) {
        return collectionDisabled[ 0 ] === true ? collectionDisabled.shift() : -1
    })( calendar.item.disable )

    calendar.
        set( 'min', settings.min ).
        set( 'max', settings.max ).
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
            calendar.set( 'highlight', [ calendar.item.highlight.year, calendar.item.highlight.month, calendar.item.highlight.date + timeChange ], { interval: timeChange } )
            this.render()
        }
    }


    /**
     * The time picker events.
     */
    calendar.onRender = function() {
        var picker = this
        picker.$holder.find( '.' + settings.klass.selectMonth ).on( 'change', function() {
            picker.set( 'highlight', [ calendar.get( 'view' ).year, this.value, calendar.get( 'highlight' ).date ] )
            picker.$holder.find( '.' + settings.klass.selectMonth ).focus()
        })
        picker.$holder.find( '.' + settings.klass.selectYear ).on( 'change', function() {
            picker.set( 'highlight', [ this.value, calendar.get( 'view' ).month, calendar.get( 'highlight' ).date ] )
            picker.$holder.find( '.' + settings.klass.selectYear ).focus()
        })
    }
    calendar.onOpen = function() {
        this.$holder.find( 'button, select' ).attr( 'disabled', false )
    }
    calendar.onClose = function() {
        this.$holder.find( 'button, select' ).attr( 'disabled', true )
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

    // If it's an object, use the “time” value.
    else if ( isObject( value ) && isInteger( value.pick ) ) {
        value = value.obj
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
        year: isInfiniteValue || value.getFullYear(),
        month: isInfiniteValue || value.getMonth(),
        date: isInfiniteValue || value.getDate(),
        day: isInfiniteValue || value.getDay(),
        obj: isInfiniteValue || value,
        pick: isInfiniteValue || value.getTime()
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
        dateObject = [ dateObject.year, dateObject.month + ( options && options.nav ? options.nav : 0 ), dateObject.date ]
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
DatePicker.prototype.measure = function( type, value/*, options*/ ) {

    var calendar = this

    // If it's anything false-y, remove the limits.
    if ( !value ) {
        value = type == 'min' ? -Infinity : Infinity
    }

    // If it's an integer, get a date relative to today.
    else if ( isInteger( value ) ) {
        value = calendar.now( type, value, { rel: value } )
    }

    return value
} ///DatePicker.prototype.measure


/**
 * Create a viewset object based on navigation.
 */
DatePicker.prototype.viewset = function( type, dateObject/*, options*/ ) {
    return this.create([ dateObject.year, dateObject.month, 1 ])
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
        dateObject = calendar.shift( dateObject, dateObject.pick <= calendar.item.min.pick ? 1 : dateObject.pick >= calendar.item.max.pick ? -1 : interval )
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
                return dateObject.day === ( calendar.settings.firstDay ? dateToDisable : dateToDisable - 1 ) % 7
            }

            // If it's an array, create the object and match the exact date.
            if ( Array.isArray( dateToDisable ) ) {
                return dateObject.pick === calendar.create( dateToDisable ).pick
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

    interval = interval || 1

    // Keep looping as long as the time is disabled.
    while ( calendar.disabled( dateObject ) ) {

        // Increase/decrease the date by the key movement and keep looping.
        dateObject = calendar.create([ dateObject.year, dateObject.month, dateObject.date + interval ])

        // Check if we've looped through over 2 months in either direction.
        if ( Math.abs( dateObject.month - originalDateObject.month ) > 2 ) {

            // Reset the date object to the original date.
            dateObject = originalDateObject

            // If the calendar is flipped, go in the opposite direction.
            if ( calendar.item.enable === -1 ) {
                interval = interval < 0 ? 1 : -1
            }
            // Otherwise go in the same direction.
            else {
                interval = interval < 0 ? -1 : 1
            }
        }

        // If we've gone beyond the limits, break out of the loop.
        if ( dateObject.pick <= calendar.item.min.pick || dateObject.pick >= calendar.item.max.pick ) {
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
    var minTime = this.item.min.pick,
        maxTime = this.item.max.pick
    return this.create( dateObject.pick > maxTime ? maxTime : dateObject.pick < minTime ? minTime : dateObject )
} //DatePicker.prototype.scope


/**
 * Parse a string into a usable type.
 */
DatePicker.prototype.parse = function( type, value, options ) {

    var
        calendar = this,
        parsingObject = {}

    if ( !value || isInteger( value ) || Array.isArray( value ) || isDate( value ) || isObject( value ) && isInteger( value.pick ) ) {
        return value
    }

    // We need a `.format` to parse the value.
    if ( !( options && options.format ) ) {
        // should probably default to the default format.
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
            return string ? getDigitsLength( string ) : dateObject.date
        },
        dd: function( string, dateObject ) {

            // If there's a string, then the length is always 2.
            // Otherwise return the selected date with a leading zero.
            return string ? 2 : leadZero( dateObject.date )
        },
        ddd: function( string, dateObject ) {

            // If there's a string, then get the length of the first word.
            // Otherwise return the short selected weekday.
            return string ? getFirstWordLength( string ) : this.settings.weekdaysShort[ dateObject.day ]
        },
        dddd: function( string, dateObject ) {

            // If there's a string, then get the length of the first word.
            // Otherwise return the full selected weekday.
            return string ? getFirstWordLength( string ) : this.settings.weekdaysFull[ dateObject.day ]
        },
        m: function( string, dateObject ) {

            // If there's a string, then get the length of the digits
            // Otherwise return the selected month with 0index compensation.
            return string ? getDigitsLength( string ) : dateObject.month + 1
        },
        mm: function( string, dateObject ) {

            // If there's a string, then the length is always 2.
            // Otherwise return the selected month with 0index and leading zero.
            return string ? 2 : leadZero( dateObject.month + 1 )
        },
        mmm: function( string, dateObject ) {

            var collection = this.settings.monthsShort

            // If there's a string, get length of the relevant month from the short
            // months collection. Otherwise return the selected month from that collection.
            return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ dateObject.month ]
        },
        mmmm: function( string, dateObject ) {

            var collection = this.settings.monthsFull

            // If there's a string, get length of the relevant month from the full
            // months collection. Otherwise return the selected month from that collection.
            return string ? getWordLengthFromCollection( string, collection, dateObject ) : collection[ dateObject.month ]
        },
        yy: function( string, dateObject ) {

            // If there's a string, then the length is always 2.
            // Otherwise return the selected year by slicing out the first 2 digits.
            return string ? 2 : ( '' + dateObject.year ).slice( 2 )
        },
        yyyy: function( string, dateObject ) {

            // If there's a string, then the length is always 4.
            // Otherwise return the selected year.
            return string ? 4 : dateObject.year
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

    // Flip the enabled and disabled dates.
    if ( value == 'flip' ) {
        calendar.item.enable = isFlipped ? 1 : -1
    }

    // Check if we have to add/remove from collection.
    else if ( !isFlipped && type == 'enable' || isFlipped && type == 'disable' ) {
        collection = calendar.removeDisabled( collection, value )
    }
    else if ( !isFlipped && type == 'disable' || isFlipped && type == 'enable' ) {
        collection = calendar.addDisabled( collection, value )
    }

    return collection
} //DatePicker.prototype.flipItem


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
                    ( next && viewsetObject.year >= maxLimitObject.year && viewsetObject.month >= maxLimitObject.month ) ||
                    ( !next && viewsetObject.year <= minLimitObject.year && viewsetObject.month <= minLimitObject.month ) ?
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
                            ( viewsetObject.month == loopedMonth ? ' selected' : '' ) +
                            (
                                (
                                    ( viewsetObject.year == minLimitObject.year && loopedMonth < minLimitObject.month ) ||
                                    ( viewsetObject.year == maxLimitObject.year && loopedMonth > maxLimitObject.month )
                                ) ?
                                ' disabled' : ''
                            )
                        ]
                    }
                }), settings.klass.selectMonth )
            }

            // If there's a need for a month selector
            return createNode( 'div', monthsCollection[ viewsetObject.month ], settings.klass.month )
        }, //createMonthLabel


        // Create the year label
        createYearLabel = function() {

            var focusedYear = viewsetObject.year,

            // If years selector is set to a literal "true", set it to 5. Otherwise
            // divide in half to get half before and half after focused year.
            numberYears = settings.selectYears === true ? 5 : ~~( settings.selectYears / 2 )

            // If there are years to select, add a dropdown menu.
            if ( numberYears ) {

                var
                    minYear = minLimitObject.year,
                    maxYear = maxLimitObject.year,
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
                            min: DAYS_IN_WEEK * rowCounter - viewsetObject.day + 1, // Add 1 for weekday 0index
                            max: function() {
                                return this.min + DAYS_IN_WEEK - 1
                            },
                            i: 1,
                            node: 'td',
                            item: function( timeDate ) {

                                // Convert the time date from a relative date to a date object
                                timeDate = calendar.create([ viewsetObject.year, viewsetObject.month, timeDate + ( settings.firstDay ? 1 : 0 ) ])

                                return [
                                    createNode(
                                        'div',
                                        timeDate.date,
                                        (function( klasses ) {

                                            // Add the `infocus` or `outfocus` classes based on month in view.
                                            klasses.push( viewsetObject.month == timeDate.month ? settings.klass.infocus : settings.klass.outfocus )

                                            // Add the `today` class if needed.
                                            if ( nowObject.pick == timeDate.pick ) {
                                                klasses.push( settings.klass.now )
                                            }

                                            // Add the `selected` class if something's selected and the time matches.
                                            if ( selectedObject && selectedObject.pick == timeDate.pick ) {
                                                klasses.push( settings.klass.selected )
                                            }

                                            // Add the `highlighted` class if something's highlighted and the time matches.
                                            if ( highlightedObject && highlightedObject.pick == timeDate.pick ) {
                                                klasses.push( settings.klass.highlighted )
                                            }

                                            // Add the `disabled` class if something's disabled and the object matches.
                                            if ( disabledCollection && calendar.disabled( timeDate ) || timeDate.pick < minLimitObject.pick || timeDate.pick > maxLimitObject.pick ) {
                                                klasses.push( settings.klass.disabled )
                                            }

                                            return klasses.join( ' ' )
                                        })([ settings.klass.day ]),
                                        'data-pick=' + timeDate.pick
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
        createNode( 'button', settings.today, settings.klass.buttonToday, 'data-pick=' + nowObject.pick + ( isOpen ? '' : ' disabled' ) ) +
        createNode( 'button', settings.clear, settings.klass.buttonClear, 'data-clear=1' + ( isOpen ? '' : ' disabled' ) ),
        settings.klass.footer
    ) //endreturn
} //DatePicker.prototype.nodes







/* ==========================================================================
   Extend jQuery with the component date picker and defaults
   ========================================================================== */

jQueryExtend( DatePicker, 'pickadate', {

    // Months and weekdays
    monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
    monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    weekdaysFull: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
    weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

    // Today and clear
    today: 'Today',
    clear: 'Clear',

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
}); //jQueryExtend



