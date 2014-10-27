(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'shadow', 'picker'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        
        module.exports = factory(require('jquery'), require('shadow'), require('picker'));
    } else {
        // Browser globals (root is window)
        root.Pickadate = factory(root.$, root.shadow, root.Picker);
    }
}(this, function($, shadow, Picker) {

'use strict';

var _ = shadow._
var el = _.el
var $document = $(document)
var ShadowDate = shadow.Date.create.bind(shadow.Date)

/**
    Construct a pickadate shadow object.

    @static
    @class Pickadate
    @extends Picker
 */
var Pickadate = {
    name: 'Pickadate'
}

/**
 * Add a unit to a named attribute collection.
 */
Pickadate.add = function(name, value, collection) {
    this._super(name, value, function(unit, loopedUnit) {
        return loopedUnit.compare(unit)
    }, collection)
}
Pickadate.attrs = {

    /**
        The min range.

        @attribute attrs.min
        @type Array|Date|String|Number|shadow.Date
        @default null
     */
    min: null,


    /**
        The max range.

        @attribute attrs.max
        @type Array|Date|String|Number|shadow.Date
        @default null
     */
    max: null,


    /**
        The date today.

        @protected
        @attribute attrs.today
        @type shadow.Date
        @default null
     */
    today: null,


    /**
        The 1st date of the month in view.

        @private
        @attribute attrs.view
        @type shadow.Date
        @default null
     */
    view: null,


    /**
        The highlighted date that acts as a visual cue of focus.

        @attribute attrs.highlight
        @type Array|Date|String|Number|shadow.Date
        @default null
     */
    highlight: null,


    /**
        The selected date(s).

        @attribute attrs.select
        @type Array|Date|String|Number|shadow.Date
        @default null
     */
    select: null,


    /**
        The disabled date(s).

        @attribute attrs.disable
        @type Array|Date|String|Number|shadow.Date
        @default null
     */
    disable: null,


    /**
        The default formatting to use.

        @attribute attrs.format
        @type String
        @default 'd mmmm, yyyy'
     */
    format: 'd mmmm, yyyy',


    /**
        The first day of the week. Truth-y sets to Monday.

        @attribute attrs.firstDay
        @type Number
        @default null
     */
    firstDay: null,


    /**
        Show either the years, months, or dates grid.

        @attribute attrs.show
        @type String
        @default null
     */
    show: null

}
Pickadate.classNames = {

    host: ' --pickadate',

    header: 'box box--header',
    body: 'box box--body',
    footer: 'box box--footer',

    container: 'container',

    buttonScope: 'button button--scope',
    buttonPrev: 'button button--prev',
    buttonNext: 'button button--next',
    buttonToday: 'button button--today',
    buttonClear: 'button button--clear',
    buttonDisabled: 'button--disabled',

    grid: 'grid',
    gridTitle: 'grid-title',
    gridCell: 'grid-cell',
    disabled: 'grid-cell--disabled',
    selected: 'grid-cell--selected',
    highlighted: 'grid-cell--highlighted',
    now: 'grid-cell--now',
    infocus: 'grid-cell--infocus',
    outfocus: 'grid-cell--outfocus',
}
/**
 * Clone the last date in a selection.
 */
Pickadate.cloneLastSelection = function(value) {
    var pickadate = this
    var attrs = pickadate.attrs
    value = value || attrs.select
    if ( attrs.allowMultiple ) {
        console.log('todo');
        console.log(attrs.select);
    }
    else if ( attrs.allowRange ) {
        return ShadowDate(value[value.length - 1])
    }
    return ShadowDate(value)
}
/**
 * Clone a selection into shadow dates.
 */
Pickadate.cloneSelection = function(value) {
    var pickadate = this
    var attrs = pickadate.attrs
    value = value || attrs.select
    if ( attrs.allowMultiple ) {
        console.log('todo');
        return
    }
    if ( attrs.allowRange ) {
        return value.map(ShadowDate)
    }
    return ShadowDate(value)
}
/**
    Create an instance of a pickadate object.

    @static
    @method create
    @param {Object} options Options for the element’s prototype.
    @return {Pickadate} An instance of the pickadate element.
 */
Pickadate.create = function(options) {

    var pickadate = this._super(options)
    var attrs = pickadate.attrs

    pickadate.$host.on('mousedown.' + pickadate.id, '[data-select]', function(event) {

        // Prevent caret selection from occurring.
        event.preventDefault()

        // Grab the date to set.
        var originalDate = ShadowDate($(event.target).data('select'))

        // Keep a reference to this original date.
        var currentDate = originalDate

        // Set the initial selection.
        attrs.select = pickadate.getNewSelection(originalDate)

        // Update the previous date and update the selection.
        function updateSelection(newDate) {
            currentDate = newDate
            attrs.select = pickadate.getNewSelection(newDate, originalDate)
        }

        // Update the selection when moused over. If it’s over a different month,
        // add a pause before going to yet another different month.
        var timeout
        pickadate.$host.on('mouseenter.' + pickadate.id, '[data-select]', function(event) {
            var newDate = ShadowDate($(event.target).data('select'))
            if ( currentDate.month !== newDate.month ) {
                if ( timeout === undefined ) {
                    timeout = setTimeout(function() {
                        timeout = clearTimeout(timeout)
                    }, 1000)
                    updateSelection(newDate)
                }
            }
            else if ( !currentDate.compare(newDate) ) {
                updateSelection(newDate)
            }
        })

        $document.on('mouseup.' + pickadate.id, function(event) {
            pickadate.$host.off('mouseenter.' + pickadate.id, '[data-select]')
            $document.off('mouseup.' + pickadate.id)
        })

    })

    // Bind updating the highlight when clicked.
    pickadate.$host.on('click', '[data-highlight]', function(event) {
        var target = event.target
        var value = $(target).data('highlight')
        attrs.highlight = ShadowDate(value)
        if ( attrs.show == 'years' ) {
            attrs.show = 'months'
        }
        else {
            attrs.show = null
        }
    })

    return pickadate
}
Pickadate.dict = {

    /**
        Today label.

        @property dict.today
        @type String
        @default 'Today'
     */
    today: 'Today',


    /**
        Clear label.

        @property dict.clear
        @type String
        @default 'Clear'
     */
    clear: 'Clear',


    /**
        The list of full months.

        @property dict.monthsFull
        @type Array
        @default ['January', 'February', ...]
     */
    monthsFull: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],


    /**
        The list of short months.

        @property dict.monthsShort
        @type Array
        @default ['Jan', 'Feb', ...]
     */
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],


    /**
        The short table header text for weeknumbers.

        @property dict.weekNumberHeaderShort
        @type String
        @default 'Wk'
     */
    weekNumberHeaderShort: 'Wk',

    /**
        The table header text for weeknumbers.

        @property dict.weekNumberHeaderFull
        @type String
        @default 'Week number'
     */
    weekNumberHeaderFull: 'Week number',


    /**
        The list of full weekdays.

        @property dict.weekdaysFull
        @type Array
        @default ['Sunday', 'Monday', ...]
     */
    weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'],


    /**
        The list of short weekdays.

        @property dict.weekdaysShort
        @type Array
        @default ['Sun', 'Mon', ...]
     */
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
}

Pickadate.formats = {
    d: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\d{1,2}/)
            return value && value[0]
        }
        return value.date
    },
    dd: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\d{1,2}/)
            return value && value[0]
        }
        return leadZero(value.date)
    },
    ddd: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\w+/)
            return value && value[0]
        }
        var date = ShadowDate([value.year, value.month, value.date])
        return this.dict.weekdaysShort[date.day]
    },
    dddd: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\w+/)
            return value && value[0]
        }
        var date = ShadowDate([value.year, value.month, value.date])
        return this.dict.weekdaysFull[date.day]
    },
    m: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\d{1,2}/)
            return value && value[0]
        }
        return value.month + 1
    },
    mm: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\d{1,2}/)
            return value && value[0]
        }
        return leadZero(value.month + 1)
    },
    mmm: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\w+/)
            return value && value[0]
        }
        return this.dict.monthsShort[value.month]
    },
    mmmm: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\w+/)
            return value && value[0]
        }
        return this.dict.monthsFull[value.month]
    },
    yyyy: function(value, isParsing) {
        if ( isParsing ) {
            value = value.match(/^\d{4}/)
            return value && value[0]
        }
        return value.year
    }
}


/**
 * Add a leading zero for numbers below 9.
 */
function leadZero(number) {
    return (number > 9 ? '' : '0') + number
}
/**
 * Get a new date assignment to use for attributes.
 */
Pickadate.getNewAssignment = function(value) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( attrs.allowMultiple ) {
        return pickadate.getNewMultipleAssignment(value)
    }

    if ( attrs.allowRange ) {
        return pickadate.getNewRangeAssignment(value)
    }

    return ShadowDate(value)
}
/**
 * Get a new multiple date assignment to use for attributes.
 */
Pickadate.getNewMultipleAssignment = function(collection) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( !Array.isArray(collection) ) {
        throw new Error('To get multiple assignments, an array must be used.')
    }

    if ( attrs.allowRange ) {
        return collection.map(function(unit) {
            return pickadate.getNewRangeAssignment(unit)
        })
    }

    return collection.map(ShadowDate).sort(function(prev, current) {
        return prev.compare('greater', current) ? 1 : -1
    })
}
/**
 * Get a new mutiple selection by passing a date.
 * An optional shadow date can be passed as a “hook” for a range.
 */
Pickadate.getNewMultipleSelection = function(date, hookedDate) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( !attrs.allowMultiple ) {
        throw new Error('Multiple selections are not allowed.')
    }

    if ( attrs.select ) {

        var selections = attrs.select.slice(0)

        if ( attrs.allowRange ) {

            var lastRange = selections[selections.length - 1]

            if ( hookedDate && lastRange.length === 1 && hookedDate.compare(lastRange[0]) ) {
                selections[selections.length - 1] = [hookedDate, date]
                return selections
            }

            var newRange = pickadate.getNewRangeSelection(date, hookedDate)

            if ( hookedDate ) {
                selections[selections.length - 1] = newRange
                return selections
            }

            for ( var i = 0; i < selections.length; i++ ) {
                var range = selections[i]
                if ( date.compareRange(range) ) {
                    return selections
                }
            }

            console.log('todo:', 'check for overlapping ranges before pushing a new one')

            selections.push(newRange)

            return selections
        }

        var comparator = function(unit, loopedUnit) {
            return loopedUnit.compare(unit)
        }

        if ( _.isWithin(selections, date, comparator) ) {
            return selections
        }

        selections.push(date)

        return selections
    }

    return attrs.allowRange ? [[date]] : [date]
}
/**
 * Get a new range date assignment to use for attributes.
 */
Pickadate.getNewRangeAssignment = function(range) {

    if ( range.length > 2 ) {
        throw new Error('A range can have a maximum of 2 dates; a lower and upper bound.')
    }

    range = range.map(ShadowDate)

    if ( range.length === 1 || range[0].compare(range[1]) ) {
        return [range[0]]
    }

    return range.sort(function(prev, current) {
        return prev.compare('greater', current) ? 1 : -1
    })
}
/**
 * Get a new range selection by passing a date.
 * An optional shadow date can be passed as a “hook” for a range.
 */
Pickadate.getNewRangeSelection = function(date, hookedDate) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( !attrs.allowRange ) {
        throw new Error('Range selections are not allowed.')
    }

    if ( attrs.allowMultiple ) {

        if ( !attrs.select || !hookedDate ) {
            return [date]
        }

        return [hookedDate || attrs.select[attrs.select.length - 1][0], date]
    }

    if ( !attrs.select || !hookedDate && attrs.select.length === 2 ) {
        return [date]
    }

    return [hookedDate || attrs.select[0], date]
}
/**
 * Get a new selection by passing a date.
 * An optional shadow date can be passed as a “hook” for a range.
 * An optional boolean can be passed to wrap the date into an array.
 */
Pickadate.getNewSelection = function(value, hookedDate) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( attrs.allowMultiple ) {
        return pickadate.getNewMultipleSelection(value, hookedDate)
    }

    if ( attrs.allowRange ) {
        return pickadate.getNewRangeSelection(value, hookedDate)
    }

    return value
}
/**
 * Check if a date is selected.
 * Optionally, a “comparison” can be passed to scope the comparison.
 */
Pickadate.isSelected = function(comparison, date) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( !attrs.select ) {
        return false
    }

    if ( arguments.length < 2 ) {
        date = comparison
        comparison = ''
    }

    if ( attrs.allowMultiple ) {
        if ( attrs.allowRange ) {
            for ( var i = 0; i < attrs.select.length; i++ ) {
                var range = attrs.select[i]
                if ( ShadowDate(date).compareRange(comparison, range) ) {
                    return true
                }
            }
            return false
        }
        return _.isWithin(attrs.select, date, function(unit, loopedUnit) {
            return loopedUnit.compare(comparison, unit)
        })
    }

    if ( attrs.allowRange ) {
        return ShadowDate(date).compareRange(comparison, attrs.select)
    }

    return attrs.select.compare(comparison, date)
}
/**
 * Check if a date is disabled.
 * Optionally, a “comparison” can be passed to scope the comparison.
 */
Pickadate.isDisabled = function(comparison, date) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( arguments.length < 2 ) {
        date = comparison
        comparison = ''
    }

    date = ShadowDate(date)

    // First, check if any disabled unit matches the date.
    if (isWithinDisabledCollection(attrs.disable, date)) {
        return true
    }

    // Next, check if it’s within the min/max range.
    if (
        attrs.min.compare('greater', date) ||
        attrs.max.compare('lesser', date)
    ) {
        return true
    }

    // Otherwise it’s not disabled.
    return false
}


function isWithinDisabledCollection(collection, date) {

    if ( !collection ) {
        return false
    }

    return collection.some(function(disabledUnit) {

        if (typeof disabledUnit == 'number') {
            // date.compare('day', disabledUnit)
            return date.day === disabledUnit
        }

        if (Array.isArray(disabledUnit)) {

            // If it’s a range, check if it contains the date.
            if (disabledUnit.length == 2) {
                console.log('TODO: check if date is within the range', disabledUnit)
                return
            }

            // Otherwise compare it as a date.
            return date.compare(disabledUnit)
        }

        console.log('TODO:', _.isTypeOf(disabledUnit))
        console.log('Compare against:', disabledUnit)
    })
}
/**
 * Checks if a date is disabled and then returns the next enabled one.
 */
Pickadate.nextEnabledDate = function(value) {

    var pickadate = this
    var attrs = pickadate.attrs

    if ( _.isTypeOf(value, 'date') ) {
        value = [value.getFullYear(), value.getMonth(), value.getDate()]
    }
    else if ( shadow.Date.isClassOf(value) ) {
        value = value.value
    }

    if ( attrs.min.compare('greater', value) ) {
        value = attrs.min.value
    }

    else if ( attrs.max.compare('lesser', value) ) {
        value = attrs.max.value
    }

    var safety = 100
    var year = value[0]
    var month = value[1]
    var date = value[2]
    var targetDate = ShadowDate([year, month, date])

    month = (month + 12) % 12

    while ( safety && targetDate.month !== month ) {

        if ( !safety ) throw 'fell into infinite loop..'
        safety -= 1

        date -= 1
        targetDate = ShadowDate([year, month, date])
    }

    return targetDate
}
/**
 * Parse a date into it’s attribute format.
 */
Pickadate.parse = function(string) {

    var pickadate = this
    var value = pickadate._super(string)

    if ( !value ) {
        return null
    }

    var attrs = pickadate.attrs
    var dict = pickadate.dict

    var parseUnit = function(unit) {
        var month
        if ( 'mmmm' in unit ) {
            month = dict.monthsFull.indexOf(unit.mmmm)
            if ( month < 0 ) {
                throw new Error('No month named “' + unit.mmmm + '” found.')
            }
        }
        else if ( 'mmm' in unit ) {
            month = dict.monthsShort.indexOf(unit.mmm)
            if ( month < 0 ) {
                throw new Error('No month named “' + unit.mmm + '” found.')
            }
        }
        return [
            ~~unit.yyyy,
            month !== undefined ? month :
                ~~('mm' in unit ? unit.mm : unit.m) - 1,
            ~~('dd' in unit ? unit.dd : unit.d)
        ]
    }

    if ( attrs.allowMultiple ) {
        console.log('todo');
        return
    }

    if ( attrs.allowRange ) {
        return value.map(parseUnit)
    }

    return parseUnit(value)
}
/**
 * Remove a unit from a named attribute collection.
 */
Pickadate.remove = function(name, value, collection) {
    this._super(name, value, function(unit, loopedUnit) {
        return loopedUnit.compare(unit)
    }, collection)
}
/**
    @method setup
 */
Pickadate.setup = function() {

    var pickadate = this
    var attrs = pickadate.attrs

    pickadate._super()

    // Set the starting “today”.
    attrs.today = ShadowDate(true)

    // Set the starting limit dates.
    attrs.min = ShadowDate(attrs.min)
    attrs.max = ShadowDate(attrs.max)

    // Set the starting select.
    if ( attrs.select ) {
        attrs.select = pickadate.cloneSelection()
        attrs.highlight = pickadate.cloneLastSelection()
    }

    // Set the starting highlight.
    else if ( attrs.highlight ) {
        attrs.highlight = ShadowDate(attrs.highlight)
    }
    else {
        attrs.highlight = ShadowDate(attrs.today)
    }

    // Set the starting view.
    if ( attrs.view ) {
        attrs.view = ShadowDate(attrs.view, { setToTheFirst: true })
    }
    else {
        attrs.view = ShadowDate(attrs.highlight, { setToTheFirst: true })
    }

    // Whenever the select is assigned, format it accordingly.
    pickadate.on('assign:select.' + pickadate.id, function(event) {
        var value = event.value
        if ( value ) {
            event.value = pickadate.getNewAssignment(value)
        }
    })

    // Whenever the highlight is assigned, format it accordingly.
    pickadate.on('assign:highlight.' + pickadate.id, function(event) {
        var value = pickadate.nextEnabledDate(event.value)
        event.value = ShadowDate(value)
    })

    // Whenever the view is assigned, the date should be the month’s first.
    pickadate.on('assign:view.' + pickadate.id, function(event) {
        var value = event.value
        value = ShadowDate(value)
        event.value = ShadowDate([value.year, value.month, 1])
    })

    // Whenever the min/max is assigned, create a shadow date.
    pickadate.on('assign:min.' + pickadate.id + ' assign:max.' + pickadate.id, function(event) {
        event.value = ShadowDate(event.value)
    })

    // Whenever the highlight is updated, the view should be updated.
    pickadate.on('set:highlight.' + pickadate.id, function(event) {
        attrs.view = event.value
    })

    // Whenever the select is updated, the highlight should be updated.
    pickadate.on('set:select.' + pickadate.id, function(event) {
        var value = event.value
        if ( value ) {
            if ( attrs.allowMultiple && attrs.allowRange ) {
                var unit = value[value.length - 1]
                value = unit[unit.length - 1]
            }
            else if ( attrs.allowMultiple || attrs.allowRange ) {
                value = value[value.length - 1]
            }
            attrs.highlight = value
        }
    })

    // Whenever the min is updated, the highlight should be updated.
    pickadate.on('set:min.' + pickadate.id, function(event) {
        attrs.highlight = attrs.highlight
    })

    // Whenever the max is updated, the highlight should be updated.
    pickadate.on('set:max.' + pickadate.id, function(event) {
        attrs.highlight = attrs.highlight
    })

    // Whenever a selection is added/removed, re-set the select.
    pickadate.on('add:select.' + pickadate.id + ' remove:select.' + pickadate.id, function(event) {
        if ( attrs.allowMultiple || attrs.allowRange ) {
            attrs.select = event.value.length ? event.value : null
        }
    })

    return pickadate
}
Pickadate.createHeader = function() {
    var pickadate = this
    return el({ name: 'header', klass: pickadate.classNames.header }, [
        pickadate.createButtonScope(),
        pickadate.createButtonNav(),
        pickadate.createButtonNav('next')
    ])
}

Pickadate.createBody = function() {

    var pickadate = this

    var body = el({
        klass: pickadate.classNames.body,
        attrs: { tabIndex: 0 }
    }, [
        pickadate.createGrid(null, [
            pickadate.createGridHeadDates(),
            pickadate.createGridBodyDates()
        ]),
        pickadate.createGrid('months', [
            pickadate.createGridHeadMonths(),
            pickadate.createGridBodyMonths()
        ]),
        pickadate.createGrid('years', [
            pickadate.createGridHeadYears(),
            pickadate.createGridBodyYears()
        ])
    ])

    return body
}

Pickadate.createFooter = function() {
    var pickadate = this
    var classes = pickadate.classNames
    return el({ name: 'footer', klass: classes.footer }, [
        pickadate.createButtonToday(),
        pickadate.createButtonClear()
    ])
}

Pickadate.createButtonNav = function(direction) {

    var pickadate = this
    var attrs = pickadate.attrs
    var classes = pickadate.classNames

    var isNext = direction == 'next'

    var buttonNav = el({
        name: 'button',
        klass: classes[ isNext ? 'buttonNext' : 'buttonPrev'],
        attrs: { type: 'button' }
    })

    var updateNavNode = function() {
        var isDisabled
        var comparisonFor = attrs.show == 'years' ? 'decade' :
            attrs.show == 'months' ? 'year' : 'month'
        if ( isNext ) {
            isDisabled = attrs.max.compare(comparisonFor + ' lesser equal', attrs.view)
        }
        else {
            isDisabled = attrs.min.compare(comparisonFor + ' greater equal', attrs.view)
        }
        if ( isDisabled ) {
            buttonNav.classList.add(classes.buttonDisabled)
            buttonNav.disabled = true
        }
        else if ( buttonNav.disabled ) {
            buttonNav.classList.remove(classes.buttonDisabled)
            buttonNav.disabled = false
        }
    }

    updateNavNode()

    // Bind updating the highlight when the nav button is clicked.
    $(buttonNav).on('click', function() {
        var year = attrs.highlight.year
        var month = attrs.highlight.month
        var date = attrs.highlight.date
        var shift = isNext ? 1 : -1
        if ( attrs.show == 'years' ) {
            year += shift * 10
        }
        else if ( attrs.show == 'months' ) {
            year += shift
        }
        else {
            month += shift
        }
        attrs.highlight = [year, month, date]
    })

    // Bind updating the year and month labels.
    pickadate.on('set:view.' + pickadate.id, function() {
        updateNavNode()
    })
    pickadate.on('set:show.' + pickadate.id, function() {
        updateNavNode()
    })

    return buttonNav
}

Pickadate.createButtonScope = function() {

    var pickadate = this
    var attrs = pickadate.attrs
    var classes = pickadate.classNames
    var months = pickadate.dict.monthsFull

    var scopedText = function() {
        var view = attrs.view
        var year = view.year
        var month = view.month
        if ( attrs.show == 'years' ) {
            return view.decade
        }
        if ( attrs.show == 'months' ) {
            return year
        }
        return months[month] + ' ' + year
    }

    var buttonScope = el({
        name: 'button',
        klass: classes.buttonScope,
        attrs: { type: 'button' }
    }, scopedText())

    // Bind the click event to show the months grid.
    $(buttonScope).on('click', function() {
        attrs.show = attrs.show == 'years' ? null :
            attrs.show == 'months' ? 'years' : 'months'
    })

    // Bind updating the year and month labels.
    pickadate.on('set:show.' + pickadate.id, function() {
        buttonScope.textContent = scopedText()
    })
    pickadate.on('set:view.' + pickadate.id, function(event) {

        var value = event.value
        var year = value.year
        var month = value.month

        var previousValue = event.previousValue
        var previousYear = previousValue.year
        var previousMonth = previousValue.month

        if ( year !== previousYear || month !== previousMonth ) {
            buttonScope.textContent = scopedText()
        }
    })

    return buttonScope
}

Pickadate.createButtonToday = function() {
    var pickadate = this
    var attrs = pickadate.attrs
    var todayNode = el({
        name: 'button',
        klass: pickadate.classNames.buttonToday,
        attrs: { type: 'button' }
    }, pickadate.dict.today)
    $(todayNode).on('click', function() {
        attrs.highlight = attrs.today
        if ( attrs.show ) {
            attrs.show = null
        }
    })
    return todayNode
}

Pickadate.createButtonClear = function() {
    var pickadate = this
    var attrs = pickadate.attrs
    var clearNode = el({
        name: 'button',
        klass: pickadate.classNames.buttonClear,
        attrs: { type: 'button' }
    }, pickadate.dict.clear)
    $(clearNode).on('click', function() {
        attrs.select = null
        if ( attrs.show ) {
            attrs.show = null
        }
    })
    return clearNode
}

Pickadate.createGrid = function(scope, children) {

    if ( !scope ) {
        scope = null
    }

    var pickadate = this
    var attrs = pickadate.attrs
    var classes = pickadate.classNames
    var updateHiddenState = function(value) {
        grid.hidden = value !== scope
    }

    // Create the grid container holder.
    var grid = el(classes.container,
        el({ name: 'table', klass: classes.grid }, children))

    // Set the starting hidden state.
    updateHiddenState(attrs.show)

    // Bind the update to reveal the grid.
    pickadate.on('set:show.' + pickadate.id, function(event) {
        updateHiddenState(event.value)
    })

    // Bind the update to remove the selections.
    pickadate.on('set:select.' + pickadate.id, function(event) {
        if ( !event.value ) {
            $(grid).find('.' + classes.selected).
                removeClass(classes.selected)
        }
    })

    return grid
}

Pickadate.createGridHeadYears = function() {

    var pickadate = this
    var view = pickadate.attrs.view

    var yearsNode = el({
        name: 'th',
        attrs: { scope: 'col', colspan: 4 }
    }, view.decade)

    var year = view.year
    pickadate.on('set:view.' + pickadate.id, function(event) {
        var newYear = event.value.year
        if ( newYear !== year ) {
            year = newYear
            yearsNode.textContent = event.value.decade
        }
    })

    return el({ name: 'thead' }, yearsNode)
}

Pickadate.createGridHeadMonths = function() {

    var pickadate = this
    var year = pickadate.attrs.view.year

    var yearNode = el({
        name: 'th',
        attrs: { scope: 'col', colspan: 4 }
    }, year)

    pickadate.on('set:view.' + pickadate.id, function(event) {
        var newYear = event.value.year
        if ( newYear !== year ) {
            year = newYear
            yearNode.textContent = year
        }
    })

    return el({ name: 'thead' }, yearNode)
}

Pickadate.createGridHeadDates = function() {

    var pickadate = this
    var classes = pickadate.classNames
    var attrs = pickadate.attrs
    var dict = pickadate.dict

    var createWeekdays = function() {
        var frag = document.createDocumentFragment()
        var weekdaysShort = dict.weekdaysShort.slice(0)
        var weekdaysFull = dict.weekdaysFull.slice(0)
        var firstDay = attrs.firstDay
        if ( firstDay ) {
            weekdaysShort.push( weekdaysShort.shift() )
            weekdaysFull.push( weekdaysFull.shift() )
        }

        for ( var i = 0; i < 7; i++ ) {
            var weekday = el({
                name: 'th',
                klass: classes.gridTitle,
                attrs: { scope: 'col', title: weekdaysFull[i] }
            }, weekdaysShort[i])
            frag.appendChild(weekday)
        }
        return frag
    }

    var createWeekNumber = function() {
        var weekNumberHead = el({
            name: 'th',
            klass: classes.gridTitle,
            attrs: { scope: 'col', title: dict.weekNumberHeaderFull }
        }, dict.weekNumberHeaderShort)

        return weekNumberHead
    }

    var createHeaders = function() {
        var gridHeaders = createWeekdays()

        if (attrs.showWeekNumbers) {
            gridHeaders.insertBefore( createWeekNumber(), gridHeaders.firstElementChild )
        }

        return gridHeaders
    }

    var gridHead = el({ name: 'thead' }, createHeaders() )

    // Bind updating the dates grid.
    pickadate.on('set:firstDay.' + pickadate.id, function() {
        gridHead.innerHTML = ''
        gridHead.appendChild(createHeaders())
    })

    return gridHead
}

Pickadate.createGridBodyYears = function() {

    var pickadate = this
    var attrs = pickadate.attrs
    var classes = pickadate.classNames

    var createGridCellYear = function(year) {

        var date = ShadowDate([year, attrs.highlight.month, attrs.highlight.date])
        var dateTime = date.time

        var isDisabled = attrs.min.compare('year greater', dateTime) ||
            attrs.max.compare('year lesser', dateTime)

        var yearNode = el({
            name: 'td',
            klass: classes.gridCell +
                ' ' + (attrs.view.compare('decade', date) ? classes.infocus : classes.outfocus) +
                (pickadate.isSelected('year', dateTime) ? ' ' + classes.selected : '') +
                (attrs.highlight.compare('year', dateTime) ? ' ' + classes.highlighted : '') +
                (attrs.today.compare('year', dateTime) ? ' ' + classes.now : '') +
                (isDisabled ? ' ' + classes.disabled : '')
        }, year)

        if ( !isDisabled ) {
            yearNode.setAttribute('data-highlight', dateTime)
        }

        return yearNode
    }

    var createGridRowGroupYears = function() {

        var frag = document.createDocumentFragment()
        var decadeStart = attrs.view.decade.start

        for ( var i = 0; i < 3; i++ ) {
            var row = el({ name: 'tr' })
            for ( var j = 0; j < 4; j++ ) {
                var index = j + (i * 4) - 1
                var yearNode = createGridCellYear(decadeStart + index)
                row.appendChild(yearNode)
            }
            frag.appendChild(row)
        }

        return frag
    }

    // Create the grid body containing the years.
    var gridBodyYears = el({ name: 'tbody' }, createGridRowGroupYears())

    // Bind re-rendering the years’ grid body.
    pickadate.on('set:view.' + pickadate.id, function() {
        gridBodyYears.innerHTML = ''
        gridBodyYears.appendChild(createGridRowGroupYears())
    })

    return gridBodyYears
}

Pickadate.createGridBodyMonths = function() {

    var pickadate = this
    var classes = pickadate.classNames
    var attrs = pickadate.attrs
    var dict = pickadate.dict

    var createGridCellMonth = function(month) {

        var targetDate = [attrs.view.year, month, attrs.highlight.date]
        var date = ShadowDate(targetDate)

        if ( date.month !== month ) {
            date = pickadate.nextEnabledDate(targetDate)
        }

        var dateTime = date.time

        var isDisabled = attrs.min.compare('month greater', dateTime) ||
            attrs.max.compare('month lesser', dateTime)

        var months = dict.monthsShort
        var monthNode = el({
            name: 'td',
            klass: classes.gridCell +
                (pickadate.isSelected('month', dateTime) ? ' ' + classes.selected : '') +
                (attrs.highlight.compare('month', dateTime) ? ' ' + classes.highlighted : '') +
                (attrs.today.compare('month', dateTime) ? ' ' + classes.now : '') +
                (isDisabled ? ' ' + classes.disabled : '')
        }, months[date.month])

        if ( !isDisabled ) {
            monthNode.setAttribute('data-highlight', dateTime)
        }

        return monthNode
    }

    var createGridRowGroupMonths = function() {

        var frag = document.createDocumentFragment()

        for ( var i = 0; i < 3; i++ ) {
            var row = el({ name: 'tr' })
            for ( var j = 0; j < 4; j++ ) {
                var index = j + (i * 4)
                var monthNode = createGridCellMonth(index)
                row.appendChild(monthNode)
            }
            frag.appendChild(row)
        }

        return frag
    }

    // Create the grid body containing the months.
    var gridBodyMonths = el({ name: 'tbody' }, createGridRowGroupMonths())

    // Bind re-rendering the months’ grid body.
    pickadate.on('set:view.' + pickadate.id, function() {
        gridBodyMonths.innerHTML = ''
        gridBodyMonths.appendChild(createGridRowGroupMonths())
    })

    return gridBodyMonths
}

Pickadate.calculateWeekNumber = function(year, month, day) {

    var pickadate = this
    var attrs = pickadate.attrs
    var firstJan, weekNumber, targetDate

    targetDate = new Date( year, month, day + ( attrs.firstDay ? 1 : 0 ) )
    firstJan = new Date( year, 0, 1 )
    weekNumber =  Math.ceil( ( ( ( targetDate - firstJan ) / 86400000 ) + firstJan.getDay() + 1 ) / 7 )

    if ( weekNumber > 52 ) {
        weekNumber = 1
    }

    return weekNumber
}

Pickadate.createGridBodyDates = function() {

    var pickadate = this
    var attrs = pickadate.attrs
    var classes = pickadate.classNames

    var createGridCellWeekNumber = function(year, month, day) {

        return el({
            name: 'th',
            klass: classes.gridCell
        }, pickadate.calculateWeekNumber(year, month, day))
    }

    var createGridCellDay = function(year, month, day) {

        var date = ShadowDate([year, month, day])
        var dateTime = date.time

        var isDateOfMonth = attrs.view.month === date.month
        var isDisabled = pickadate.isDisabled(dateTime)
        var isSelected = pickadate.isSelected(dateTime)
        var isHighlighted = attrs.highlight.compare(dateTime)
        var isToday = attrs.today.compare(dateTime)

        var dayNode = el({
            name: 'td',
            klass: classes.gridCell + ' ' +
                (isDateOfMonth ? classes.infocus : classes.outfocus) +
                (isDisabled ? ' ' + classes.disabled : '') +
                (isSelected ? ' ' + classes.selected : '') +
                (isHighlighted ? ' ' + classes.highlighted : '') +
                (isToday ? ' ' + classes.now : '')
        }, date.date)

        if ( !isDisabled ) {
            dayNode.setAttribute('data-select', dateTime)
        }

        return dayNode
    }

    var createGridRowWeek = function(year, month, week) {

        var day
        var firstDay = attrs.firstDay
        var offset = ShadowDate([year, month, 1]).day
        var frag = document.createDocumentFragment()

        var calculateWeekDay = function(week, dayNumber, offset) {
            return (week * 7) + dayNumber - (offset || 0)
        }

        if ( attrs.showWeekNumbers ) {
            day = calculateWeekDay(week, 1, offset)
            frag.appendChild(createGridCellWeekNumber(year, month, day))
        }

        for ( var i = 1; i <= 7; i++ ) {
            day = calculateWeekDay(week, i, offset)
            if ( firstDay ) day += 1

            frag.appendChild(createGridCellDay(year, month, day))
        }

        return el({ name: 'tr' }, frag)
    }

    var createGridRowGroupDates = function() {

        var year = attrs.view.year
        var month = attrs.view.month
        var firstDay = attrs.firstDay
        var frag = document.createDocumentFragment()

        var offset = 0
        if ( firstDay && ShadowDate([year, month, 1]).day === 0 ) {
            offset = -1
        }

        for ( var i = 0; i <= 5; i++ ) {
            frag.appendChild(createGridRowWeek(year, month, i + offset))
        }

        return frag
    }

    var gridBodyDates = el({ name: 'tbody' }, createGridRowGroupDates())

    // Bind re-rendering the dates’ grid body.
    var events = 'set:view.' + pickadate.id + ' set:firstDay.' + pickadate.id
    pickadate.on(events, function() {
        gridBodyDates.innerHTML = ''
        gridBodyDates.appendChild(createGridRowGroupDates())
    })

    return gridBodyDates
}


/**
 * Build out the templating for the pickadate.
 */
Pickadate.template = function() {

    var pickadate = this

    // Grab the fragment and add the segments.
    var frag = pickadate.content
    frag.appendChild(pickadate.createHeader())
    frag.appendChild(pickadate.createBody())
    frag.appendChild(pickadate.createFooter())

    // Finally, apply the super wrapper.
    return pickadate._super()
}


Pickadate = Picker.extend(Pickadate)

return Pickadate

}));
