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
        var gridHeaders = document.createDocumentFragment()

        if (attrs.showWeekNumbers) {
            gridHeaders.appendChild( createWeekNumber() )
        }

        gridHeaders.appendChild( createWeekdays() )

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
