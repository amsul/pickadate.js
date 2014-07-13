(function(global, factory) {

    // Register as an anonymous module.
    if ( typeof define == 'function' && define.amd )
        define('ui-pickadate', ['jquery', 'shadow', 'ui-picker'], factory)

    // Or using browser globals.
    else factory(global.jQuery, global.shadow)

}(this, function($, shadow) { 'use strict';


var _ = shadow._
var el = _.el

// Add a leading zero for numbers below 9.
var leadZero = function(number) {
    return (number > 9 ? '' : '0') + number
}

// Assign a value that allows multiple units.
var assignValueAsMultiple = function(value, allowRange) {
    var pickadate = this
    var intoDateAttr = pickadate.intoDateAttr
    if ( !Array.isArray(value) ) {
        value = [value]
    }
    if ( allowRange ) {
        value = value.filter(function(unit) {
            return unit.length
        })
    }
    return value.map(function(valueItem) {
        return allowRange ?
            assignValueAsRange.call(pickadate, valueItem) :
            intoDateAttr(valueItem)
    })
}

// Assign a value that allows a range.
var assignValueAsRange = function(value) {
    var pickadate = this
    var compare = pickadate.compare
    var intoDateAttr = pickadate.intoDateAttr
    if ( !Array.isArray(value) ) {
        value = [value]
    }
    if ( value.length > 1 ) {
        if ( compare(value[0], value[1]) ) {
            value.pop()
        }
        else {
            var fromValue = value[0]
            var toValue = value[1]
            if ( compare(fromValue, 'greater', toValue) ) {
                fromValue = value[1]
                toValue = value[0]
            }
            value = [fromValue, toValue]
        }
    }
    return value.map(function(valueItem) {
        return intoDateAttr(valueItem)
    })
}


/**
 * Construct a pickadate object.
 */
shadow('pickadate', {

    extend: 'picker',

    attrs: {

        // The min/max range.
        min: null,
        max: null,

        // The date today.
        today: null,

        // The 1st date of the month in view.
        view: null,

        // The highlighted date that acts as a visual cue of focus.
        highlight: null,

        // The selected date that mirrors the value.
        select: null,

        // The default formatting to use.
        format: 'd mmmm, yyyy',

        // The first day of the week. Truth-y sets to Monday.
        firstDay: null,

        // Show either the months or dates grid.
        show: null
    },

    dict: {

        // Today and clear labels.
        today: 'Today',
        clear: 'Clear',

        // The months.
        monthsFull: ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

        // The weekdays.
        weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
            'Friday', 'Saturday'],
        weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },

    classNames: {

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
    },

    formats: {
        d: function(value, isParsing) {
            if ( isParsing ) {
                value = value.match(/^\d{1,2}/)
                return value && value[0]
            }
            return value[2]
        },
        dd: function(value, isParsing) {
            if ( isParsing ) {
                value = value.match(/^\d{1,2}/)
                return value && value[0]
            }
            return leadZero(value[2])
        },
        ddd: function(value, isParsing) {
            if ( isParsing ) {
                value = value.match(/^\w+/)
                return value && value[0]
            }
            var day = new Date(value[0], value[1], value[2])
            return this.dict.weekdaysShort[day.getDay()]
        },
        dddd: function(value, isParsing) {
            if ( isParsing ) {
                value = value.match(/^\w+/)
                return value && value[0]
            }
            var day = new Date(value[0], value[1], value[2])
            return this.dict.weekdaysFull[day.getDay()]
        },
        m: function(value, isParsing) {
            if ( isParsing ) {
                value = value.match(/^\d{1,2}/)
                return value && value[0]
            }
            return value[1] + 1
        },
        mm: function(value, isParsing) {
            if ( isParsing ) {
                value = value.match(/^\d{1,2}/)
                return value && value[0]
            }
            return leadZero(value[1] + 1)
        },
        mmm: function(value, isParsing) {
            if ( isParsing ) {
                value = value.match(/^\w+/)
                return value && value[0]
            }
            return this.dict.monthsShort[value[1]]
        },
        mmmm: function(value, isParsing) {
            if ( isParsing ) {
                value = value.match(/^\w+/)
                return value && value[0]
            }
            return this.dict.monthsFull[value[1]]
        },
        yyyy: function(value, isParsing) {
            if ( isParsing ) {
                value = value.match(/^\d{4}/)
                return value && value[0]
            }
            return value[0]
        }
    },


    /**
     * Setup the attrs before everything gets sealed
     * and before getters and setters are made.
     */
    setup: function() {

        var pickadate = this
        var attrs = pickadate.attrs
        var intoDateAttr = pickadate.intoDateAttr

        pickadate._super()

        // Set the starting “today”.
        attrs.today = intoDateAttr(new Date())

        // Set the starting limit dates.
        if ( attrs.min ) {
            attrs.min = intoDateAttr(attrs.min)
        }
        if ( attrs.max ) {
            attrs.max = intoDateAttr(attrs.max)
        }

        // Set the starting select.
        if ( attrs.select ) {
            if ( attrs.allowMultiple ) {
                console.log(attrs.select);
            }
            else if ( attrs.allowRange ) {
                console.log(attrs.select);
                // attrs.select = attrs.select.map(function(value) {
                //     return intoDateAttr(value)
                // })
                // attrs.highlight = intoDateAttr(attrs.select[attrs.select.length - 1])
            }
            else {
                attrs.select = intoDateAttr(attrs.select)
                attrs.highlight = intoDateAttr(attrs.select)
            }
        }

        // Set the starting highlight.
        else if ( attrs.highlight ) {
            attrs.highlight = intoDateAttr(attrs.highlight)
        }
        else {
            attrs.highlight = intoDateAttr(attrs.today)
        }

        // Set the starting view.
        if ( attrs.view ) {
            attrs.view = intoDateAttr([attrs.view[0], attrs.view[1], 1])
        }
        else {
            attrs.view = intoDateAttr([attrs.highlight[0], attrs.highlight[1], 1])
        }

        // Whenever the select is assigned, format it accordingly.
        pickadate.on('assign:select.' + pickadate.id, function(event) {
            var value = event.value
            if ( value && attrs.allowMultiple ) {
                value = assignValueAsMultiple.call(pickadate, value, attrs.allowRange)
                value = value.length ? value : null
            }
            else if ( value && attrs.allowRange ) {
                value = assignValueAsRange.call(pickadate, value)
            }
            else {
                value = intoDateAttr(value)
            }
            event.value = value
        })

        // Whenever the highlight is assigned, format it accordingly.
        pickadate.on('assign:highlight.' + pickadate.id, function(event) {
            var value = pickadate.nextEnabledDate(event.value)
            event.value = intoDateAttr(value)
        })

        // Whenever the view is assigned, the date should be the month’s first.
        pickadate.on('assign:view.' + pickadate.id, function(event) {
            var value = event.value
            event.value = intoDateAttr([value[0], value[1], 1])
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
        if ( attrs.allowMultiple || attrs.allowRange ) {
            pickadate.on('add:select.' + pickadate.id + ' remove:select.' + pickadate.id, function(event) {
                attrs.select = event.value.length ? event.value : null
            })
        }

        return pickadate
    }, //setup


    /**
     * Create a pickadate object.
     */
    create: function(options) {

        var pickadate = this._super(options)
        var attrs = pickadate.attrs

        // Bind updating the select when clicked.
        pickadate.$host.on('click', '[data-select]', function(event) {
            var target = event.target
            var value = $(target).data('select')
            var selectedDate = new Date(value)
            if ( attrs.allowMultiple ) {
                if ( attrs.select ) {
                    var index = -1
                    if ( attrs.allowRange && attrs.select.some(function(unit, unitIndex) {
                        index = unitIndex
                        return _.indexIn(unit, selectedDate, pickadate.compare) > -1
                    }) ) {
                        pickadate.remove('select', selectedDate, attrs.select[index])
                    }
                    else if ( _.indexIn(attrs.select, selectedDate, pickadate.compare) > -1 ) {
                        pickadate.remove('select', selectedDate)
                    }
                    else {
                        if ( event.shiftKey ) {
                            pickadate.add('select', selectedDate, attrs.select[attrs.select.length - 1])
                        }
                        else {
                            pickadate.add('select', attrs.allowRange ? [selectedDate] : selectedDate)
                        }
                    }
                }
                else {
                    attrs.select = attrs.allowRange ? [[selectedDate]] : [selectedDate]
                }
            }
            else if ( attrs.allowRange ) {
                if ( attrs.select && attrs.select.length === 1 ) {
                    pickadate.add('select', selectedDate)
                }
                else {
                    attrs.select = [selectedDate]
                }
            }
            else {
                attrs.select = selectedDate
            }
        })

        // Prevent caret selection from occurring.
        pickadate.$host.on('mousedown', '[data-select]', function(event) {
            if ( event.shiftKey ) {
                event.preventDefault()
            }
        })

        // Bind updating the highlight when clicked.
        pickadate.$host.on('click', '[data-highlight]', function(event) {
            var target = event.target
            var value = $(target).data('highlight')
            attrs.highlight = new Date(value)
            if ( attrs.show == 'years' ) {
                attrs.show = 'months'
            }
            else {
                attrs.show = null
            }
        })

        return pickadate
    },


    /**
     * Add a unit to a named attribute collection.
     */
    add: function(name, value, collection) {
        this._super(name, value, this.compare, collection)
    },


    /**
     * Remove a unit from a named attribute collection.
     */
    remove: function(name, value, collection) {
        this._super(name, value, this.compare, collection)
    },


    /**
     * Parse a date into it’s attribute format.
     */
    parse: function(string) {
        var pickadate = this
        var value = pickadate._super(string)
        if ( !value ) {
            return null
        }
        var month
        if ( 'mmmm' in value ) {
            month = pickadate.dict.monthsFull.indexOf(value.mmmm)
        }
        else if ( 'mmm' in value ) {
            month = pickadate.dict.monthsShort.indexOf(value.mmm)
        }
        return [
            ~~value.yyyy,
            month !== undefined ? month :
                ~~('mm' in value ? value.mm : value.m) - 1,
            ~~('dd' in value ? value.dd : value.d)
        ]
    },


    /**
     * Compare two dates in various ways.
     */
    compare: function(one, comparison, two) {

        var args = arguments

        if ( args.length < 3 ) {
            two = args[1]
            comparison = ''
        }

        if ( !one || !two ) {
            return false
        }

        var toDate = function(value) {
            if ( Array.isArray(value) ) {
                return new Date(value[0], value[1], value[2])
            }
            return new Date(value)
        }

        one = toDate(one)
        two = toDate(two)

        if ( comparison.match(/^decade ?/) ) {
            comparison = comparison.replace(/^decade ?/, '')
            one = one.getFullYear()
            one = one - (one % 10)
            two = two.getFullYear()
            two = two - (two % 10)
        }

        else if ( comparison.match(/^year ?/) ) {
            comparison = comparison.replace(/^year ?/, '')
            one = one.getFullYear()
            two = two.getFullYear()
        }

        else if ( comparison.match(/^month ?/) ) {
            comparison = comparison.replace(/^month ?/, '')
            one.setDate(1)
            two.setDate(1)
        }
        else if ( comparison.match(/^date ?/) ) {
            comparison = comparison.replace(/^date ?/, '')
        }

        if ( _.isTypeOf(one, 'date') ) {
            one = one.getTime()
        }
        if ( _.isTypeOf(two, 'date') ) {
            two = two.getTime()
        }

        if ( comparison == 'greater equal' ) {
            return one >= two
        }

        if ( comparison == 'lesser equal' ) {
            return one <= two
        }

        if ( comparison == 'greater' ) {
            return one > two
        }

        if ( comparison == 'lesser' ) {
            return one < two
        }

        return one === two
    },


    /**
     * Convert a date representation into a valid date array.
     */
    intoDateAttr: function(value) {
        if ( !value ) {
            return value
        }
        if ( Array.isArray(value) ) {
            value = new Date(value[0], value[1], value[2])
        }
        if ( _.isTypeOf(value, 'date') ) {
            value = [value.getFullYear(), value.getMonth(), value.getDate()]
        }
        Object.freeze(value)
        return value
    },


    /**
     * Checks if a date is disabled and then returns the next enabled one.
     */
    nextEnabledDate: function(value) {

        var pickadate = this
        var attrs = pickadate.attrs

        if ( _.isTypeOf(value, 'date') ) {
            value = [value.getFullYear(), value.getMonth(), value.getDate()]
        }

        if ( pickadate.compare(attrs.min, 'greater', value) ) {
            value = attrs.min.slice(0)
        }

        else if ( pickadate.compare(attrs.max, 'lesser', value) ) {
            value = attrs.max.slice(0)
        }

        var safety = 100
        var year = value[0]
        var month = value[1]
        var date = value[2]
        var targetDate = new Date(year, month, date)

        month = (month + 12) % 12

        while ( safety && targetDate.getMonth() !== month ) {

            if ( !safety ) throw 'fell into infinite loop..'
            safety -= 1

            date -= 1
            targetDate = new Date(year, month, date)
        }

        return targetDate
    },

    isSelected: function(date, comparison) {

        var pickadate = this
        var attrs = pickadate.attrs

        if ( !attrs.select ) {
            return false
        }

        var isInRange = function(range, date) {
            if ( range.length === 1 ) {
                return compare(range[0], comparison, date)
            }
            var lowerBound = range[0]
            var upperBound = range[1]
            return compare(lowerBound, comparison + ' lesser equal', date) &&
                compare(upperBound, comparison + ' greater equal', date)
        }

        var compare = pickadate.compare
        comparison = comparison || 'date'

        if ( attrs.allowMultiple ) {
            if ( attrs.allowRange ) {
                for ( var i = 0; i < attrs.select.length; i++ ) {
                    var unit = attrs.select[i]
                    if ( isInRange(unit, date) ) {
                        return true
                    }
                }
                return false
            }
            for ( var i = 0; i < attrs.select.length; i++ ) {
                var selection = attrs.select[i]
                if ( compare(selection, comparison, date) ) {
                    return true
                }
            }
            return false
        }

        else if ( attrs.allowRange ) {
            return isInRange(attrs.select, date)
        }

        return compare(attrs.select, comparison, date)
    },


    decadeOf: function(year) {
        var offset = year % 10
        year -= offset
        return [year, year + (10 - 1)]
    },


    createHeader: function() {
        var pickadate = this
        return el({ name: 'header', klass: pickadate.classNames.header }, [
            pickadate.createButtonScope(),
            pickadate.createButtonNav(),
            pickadate.createButtonNav('next')
        ])
    },

    createBody: function() {

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
    },

    createFooter: function() {
        var pickadate = this
        var classes = pickadate.classNames
        return el({ name: 'footer', klass: classes.footer }, [
            pickadate.createButtonToday(),
            pickadate.createButtonClear()
        ])
    },

    createButtonNav: function(direction) {

        var pickadate = this
        var attrs = pickadate.attrs
        var classes = pickadate.classNames
        var compare = pickadate.compare

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
                isDisabled = compare(attrs.max, comparisonFor + ' lesser equal', attrs.view)
            }
            else {
                isDisabled = compare(attrs.min, comparisonFor + ' greater equal', attrs.view)
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
            var year = attrs.highlight[0]
            var month = attrs.highlight[1]
            var date = attrs.highlight[2]
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
    },

    createButtonScope: function() {

        var pickadate = this
        var attrs = pickadate.attrs
        var classes = pickadate.classNames
        var months = pickadate.dict.monthsFull

        var scopedText = function() {
            var year = attrs.view[0]
            var month = attrs.view[1]
            if ( attrs.show == 'years' ) {
                var decade = pickadate.decadeOf(year)
                return decade.join(' - ')
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
            buttonScope.innerText = scopedText()
        })
        pickadate.on('set:view.' + pickadate.id, function(event) {

            var value = event.value
            var year = value[0]
            var month = value[1]

            var previousValue = event.previousValue
            var previousYear = previousValue[0]
            var previousMonth = previousValue[1]

            if ( year !== previousYear || month !== previousMonth ) {
                buttonScope.innerText = scopedText()
            }
        })

        return buttonScope
    },

    createButtonToday: function() {
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
    },

    createButtonClear: function() {
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
    },

    createGrid: function(scope, children) {

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
    },

    createGridHeadYears: function() {

        var pickadate = this
        var year = pickadate.attrs.view[0]
        var decadeRange = function(yr) {
            var decade = pickadate.decadeOf(yr)
            return decade.join(' - ')
        }

        var yearsNode = el({
            name: 'th',
            attrs: { scope: 'col', colspan: 4 }
        }, decadeRange(year))

        pickadate.on('set:view.' + pickadate.id, function(event) {
            var newYear = event.value[0]
            if ( newYear !== year ) {
                year = newYear
                yearsNode.innerText = decadeRange(year)
            }
        })

        return el({ name: 'thead' }, yearsNode)
    },

    createGridHeadMonths: function() {

        var pickadate = this
        var year = pickadate.attrs.view[0]

        var yearNode = el({ name: 'th', attrs: { scope: 'col', colspan: 4 } }, year)

        pickadate.on('set:view.' + pickadate.id, function(event) {
            var newYear = event.value[0]
            if ( newYear !== year ) {
                year = newYear
                yearNode.innerText = year
            }
        })

        return el({ name: 'thead' }, yearNode)
    },

    createGridHeadDates: function() {

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

        var gridHead = el({ name: 'thead' }, createWeekdays())

        // Bind updating the dates grid.
        pickadate.on('set:firstDay.' + pickadate.id, function() {
            gridHead.innerHTML = ''
            gridHead.appendChild(createWeekdays())
        })

        return gridHead
    },

    createGridBodyYears: function() {

        var pickadate = this
        var attrs = pickadate.attrs
        var classes = pickadate.classNames
        var compare = pickadate.compare

        var createGridCellYear = function(year) {

            var date = new Date(year, attrs.highlight[1], attrs.highlight[2])
            var dateTime = date.getTime()

            var isDisabled = compare(attrs.min, 'year greater', dateTime) ||
                compare(attrs.max, 'year lesser', dateTime)

            var yearNode = el({
                name: 'td',
                klass: classes.gridCell +
                    ' ' + (compare(attrs.view, 'decade', date) ? classes.infocus : classes.outfocus) +
                    (pickadate.isSelected(dateTime, 'year') ? ' ' + classes.selected : '') +
                    (compare(attrs.highlight, 'year', dateTime) ? ' ' + classes.highlighted : '') +
                    (compare(attrs.today, 'year', dateTime) ? ' ' + classes.now : '') +
                    (isDisabled ? ' ' + classes.disabled : '')
            }, year)

            if ( !isDisabled ) {
                yearNode.setAttribute('data-highlight', dateTime)
            }

            return yearNode
        }

        var createGridRowGroupYears = function() {

            var frag = document.createDocumentFragment()
            var year = attrs.view[0]
            var decadeStart = pickadate.decadeOf(year)[0]

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
    },

    createGridBodyMonths: function() {

        var pickadate = this
        var classes = pickadate.classNames
        var attrs = pickadate.attrs
        var dict = pickadate.dict
        var compare = pickadate.compare

        var createGridCellMonth = function(month) {

            var months = dict.monthsShort
            var targetDate = [attrs.view[0], month, attrs.highlight[2]]
            var date = new Date(targetDate[0], targetDate[1], targetDate[2])

            if ( date.getMonth() !== month ) {
                date = pickadate.nextEnabledDate(targetDate)
            }

            var dateTime = date.getTime()

            var isDisabled = compare(attrs.min, 'month greater', dateTime) ||
                compare(attrs.max, 'month lesser', dateTime)

            var monthNode = el({
                name: 'td',
                klass: classes.gridCell +
                    (pickadate.isSelected(dateTime, 'month') ? ' ' + classes.selected : '') +
                    (compare(attrs.highlight, 'month', dateTime) ? ' ' + classes.highlighted : '') +
                    (compare(attrs.today, 'month', dateTime) ? ' ' + classes.now : '') +
                    (isDisabled ? ' ' + classes.disabled : '')
            }, months[date.getMonth()])

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
    },

    createGridBodyDates: function() {

        var pickadate = this
        var attrs = pickadate.attrs
        var classes = pickadate.classNames
        var compare = pickadate.compare

        var createGridCellDay = function(year, month, day) {

            var date = new Date(year, month, day)
            var dateTime = date.getTime()

            var isDisabled = compare(attrs.min, 'greater', dateTime) ||
                compare(attrs.max, 'lesser', dateTime)

            var dayNode = el({
                name: 'td',
                klass: classes.gridCell +
                    ' ' + (attrs.view[1] === date.getMonth() ? classes.infocus : classes.outfocus) +
                    (pickadate.isSelected(dateTime) ? ' ' + classes.selected : '') +
                    (compare(attrs.highlight, dateTime) ? ' ' + classes.highlighted : '') +
                    (compare(attrs.today, dateTime) ? ' ' + classes.now : '') +
                    (isDisabled ? ' ' + classes.disabled : '')
            }, date.getDate())

            if ( !isDisabled ) {
                dayNode.setAttribute('data-select', dateTime)
            }

            return dayNode
        }

        var createGridRowWeek = function(year, month, week) {

            var firstDay = attrs.firstDay
            var offset = new Date(year, month, 1).getDay()
            var frag = document.createDocumentFragment()

            for ( var i = 1; i <= 7; i++ ) {
                var day = (week * 7) + i - offset
                if ( firstDay ) day += 1
                frag.appendChild(createGridCellDay(year, month, day))
            }

            return el({ name: 'tr' }, frag)
        }

        var createGridRowGroupDates = function() {

            var year = attrs.view[0]
            var month = attrs.view[1]
            var firstDay = attrs.firstDay
            var frag = document.createDocumentFragment()

            var offset = 0
            if ( firstDay && new Date(year, month, 1).getDay() === 0 ) {
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
    },


    /**
     * Build out the templating for the pickadate.
     */
    template: function() {

        var pickadate = this

        // Grab the fragment and add the segments.
        var frag = pickadate.content
        frag.appendChild(pickadate.createHeader())
        frag.appendChild(pickadate.createBody())
        frag.appendChild(pickadate.createFooter())

        // Finally, apply the super wrapper.
        return pickadate._super()
    }

}) //shadow('pickadate')


}));
