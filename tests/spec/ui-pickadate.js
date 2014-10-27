describe('shadow.Pickadate', function() {

    it('is an instance of the shadow picker', function() {
        expect(shadow.Picker.isClassOf(shadow.Pickadate)).toBe(true)
        expect(shadow.Pickadate.isInstanceOf(shadow.Picker)).toBe(true)
    })


    describe('.setup()', function() {

        var pickadate = shadow.Pickadate.create({
            $el: $('<div />')
        })

        var today = new Date()
        today = [today.getFullYear(), today.getMonth(), today.getDate()]

        it('sets up the date today', function() {
            expect(pickadate.attrs.today.value).toEqual(today)
        })

        it('sets up the highlight based on today', function() {
            expect(pickadate.attrs.highlight.value).toEqual(today)
        })

        it('sets up the view based on the highlight', function() {
            var view = [today[0], today[1], 1]
            expect(pickadate.attrs.view.value).toEqual(view)
        })

        it('sets up the select and highlight if there is a select attribute', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    select: [2003, 2, 13]
                }
            })
            expect(pickadate.attrs.select.value).toEqual([2003, 2, 13])
            expect(pickadate.attrs.highlight.value).toEqual([2003, 2, 13])
        })

        it('sets up the select and highlight with ranges if there is a select attribute', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    allowRange: true,
                    select: [[2003, 2, 13]]
                }
            })
            expect(pickadate.attrs.select.length).toBe(1)
            expect(pickadate.attrs.select[0].value).toEqual([2003, 2, 13])
            expect(pickadate.attrs.highlight.value).toEqual([2003, 2, 13])

            pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    allowRange: true,
                    select: [[2003, 2, 13], [2005, 4, 25]]
                }
            })
            expect(pickadate.attrs.select.length).toBe(2)
            expect(pickadate.attrs.select[0].value).toEqual([2003, 2, 13])
            expect(pickadate.attrs.select[1].value).toEqual([2005, 4, 25])
            expect(pickadate.attrs.highlight.value).toEqual([2005, 4, 25])
        })

        it('updates the view to the correct date when set', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            pickadate.attrs.view = [2014, 3, 20]
            expect(pickadate.attrs.view.date).toBe(1)
        })

        it('updates the highlight to cascade to update the view', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var view = [2013, 3, 1]
            expect(pickadate.attrs.view.value).not.toEqual(view)
            pickadate.attrs.highlight = [2013, 3, 20]
            expect(pickadate.attrs.view.value).toEqual(view)
        })

        it('updates the select to cascade to update the highlight', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var date = [2013, 3, 20]
            expect(pickadate.attrs.highlight.value).not.toEqual(date)
            pickadate.attrs.select = date
            expect(pickadate.attrs.highlight.value).toEqual(date)
        })

        it('updates the select to cascade to update the value', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var date = [2013, 3, 20]
            expect(pickadate.attrs.value).toBe(null)
            pickadate.attrs.select = date
            expect(pickadate.attrs.value).toEqual('20 April, 2013')
            pickadate.attrs.select = null
            expect(pickadate.attrs.value).toBe('')
        })

        it('updates the select with ranges while sorting the range', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    allowRange: true
                }
            })

            var fromDate = [2013, 3, 10]
            var toDate = [2013, 5, 20]
            pickadate.attrs.select = [fromDate, toDate]
            expect(pickadate.attrs.value).toEqual('10 April, 2013 - 20 June, 2013')

            fromDate = [2010, 4, 8]
            toDate = [2010, 7, 23]
            pickadate.attrs.select = [toDate, fromDate]
            expect(pickadate.attrs.value).toEqual('8 May, 2010 - 23 August, 2010')
        })

        it('updates the select with ranges as the same date into a single value', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    allowRange: true
                }
            })

            var fromDate = [2013, 3, 20]
            var toDate = [2013, 3, 20]
            pickadate.attrs.select = [fromDate, toDate]
            expect(pickadate.attrs.select.length).toBe(1)
            expect(pickadate.attrs.select[0].value).toEqual(fromDate)
            expect(pickadate.attrs.value).toEqual('20 April, 2013')

            var date = [2010, 8, 14]
            pickadate.attrs.select = [date]
            expect(pickadate.attrs.select.length).toBe(1)
            expect(pickadate.attrs.select[0].value).toEqual(date)
            expect(pickadate.attrs.value).toEqual('14 September, 2010')
        })

        it('updates the select with ranges to cascade to update the highlight', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    allowRange: true
                }
            })

            var fromDate = [2013, 3, 10]
            var toDate = [2013, 5, 20]
            pickadate.attrs.select = [fromDate, toDate]
            expect(pickadate.attrs.highlight.value).toEqual(toDate)

            fromDate = [2010, 4, 8]
            toDate = [2010, 7, 23]
            pickadate.attrs.select = [toDate, fromDate]
            expect(pickadate.attrs.highlight.value).toEqual(toDate)
        })
    })


    describe('.create()', function() {

        it('binds mousedown to select a value', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var $selector = pickadate.$host.find('[data-select]')
            var selection = shadow.Date.create($selector.data('select'))
            expect(pickadate.attrs.select).toBe(null)
            $selector.first().trigger('mousedown')
            $(document).trigger('mouseup')
            expect(pickadate.attrs.select).not.toBe(null)
            expect(pickadate.attrs.select.value).toEqual(selection.value)
        })

        it('binds clicks to highlight a value', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var $highlightor = pickadate.$host.find('[data-highlight]:not(.' + pickadate.classNames.highlighted + ')')
            var highlight = pickadate.attrs.highlight
            highlight = [highlight.year, highlight.month, highlight.date]
            expect(pickadate.attrs.highlight.value).toEqual(highlight)
            $highlightor.first().trigger('click')
            expect(pickadate.attrs.highlight.value).not.toEqual(highlight)
        })

        it('binds dragging to select a sorted range value', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    allowRange: true
                }
            })
            var attrs = pickadate.attrs

            var $host = pickadate.$host
            var $hook = $host.find('[data-select]').eq(22)
            $hook.trigger('mousedown')

            expect(attrs.select.length).toBe(1)
            expect($hook.data('select')).toBe(attrs.select[0].valueOf())

            var $upper = $host.find('[data-select]').eq(24)
            $upper.trigger('mouseenter')

            expect(attrs.select.length).toBe(2)
            expect($upper.data('select')).toBe(attrs.select[1].valueOf())

            var $lower = $host.find('[data-select]').eq(14)
            $lower.trigger('mouseenter')
            expect(attrs.select.length).toBe(2)
            expect($lower.data('select')).toBe(attrs.select[0].valueOf())
            expect($hook.data('select')).toBe(attrs.select[1].valueOf())

            $upper = $host.find('[data-select]').eq(28)
            $upper.trigger('mouseenter')

            expect(attrs.select.length).toBe(2)
            expect($hook.data('select')).toBe(attrs.select[0].valueOf())
            expect($upper.data('select')).toBe(attrs.select[1].valueOf())

            $hook = $host.find('[data-select]').eq(22)
            $hook.trigger('mouseenter')

            expect(attrs.select.length).toBe(1)
            expect($hook.data('select')).toBe(attrs.select[0].valueOf())

            $(document).trigger('mouseup')
        })

        it('binds dragging to select sorted multiple values')

        it('pauses dragging from changing months too quickly')
    })


    describe('.add()', function() {

        it('adds a unit to an attribute collection by providing a comparator')
    })


    describe('.remove()', function() {

        it('removes a unit from an attribute collection by providing a comparator')
    })


    describe('.parse()', function() {

        it('parses a string into a date value', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            expect(pickadate.parse('4 August, 1988')).toEqual([1988, 7, 4])
            pickadate.attrs.format = 'yyyy-mm-dd'
            expect(pickadate.parse('2012-12-21')).toEqual([2012, 11, 21])
        })

        xit('parses a string into a date range value', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    allowRange: true
                }
            })

            // expect(pickadate.parse('4 August, 1988 - 21 August, 1988')).toEqual([[1988, 7, 4], [1988, 7, 21]])

            // pickadate.attrs.format = 'yyyy-mm-dd'
            // expect(pickadate.parse('2012-12-21 - 2012-12-26')).toEqual([[2012, 11, 21], [2012, 11, 26]])

            pickadate.attrs.formatRange = '{, }'
            // expect(pickadate.parse('2013-11-18, 2013-11-23')).toEqual([[2013, 10, 18], [2013, 10, 23]])

            pickadate.attrs.format = 'd mmmm[, ]yyyy'
            expect(pickadate.parse('7 August, 1988, 24 August, 1988')).toEqual([[1988, 7, 7], [1988, 7, 24]])
        })

        it('parses a string into a multiple date value')
    })


    describe('.getNewSelection()', function() {

        it('returns a new selection given a value')

        it('returns a new selection given a value and “hook” date')

        it('returns a new selection with ranges allowed given a value')

        it('returns a new selection with ranges allowed given a value and “hook” date')

        it('returns a new selection with multiple allowed given a value')

        it('returns a new selection with multiple allowed given a value and “hook” date')
    })


    describe('.getNewRangeSelection()', function() {

        it('returns a new range selection given a value')

        it('returns a new range selection given a value and “hook” date')

    })


    describe('.getNewMultipleSelection()', function() {

        it('returns a new multiple selection given a value')

        it('returns a new multiple selection given a value and “hook” date')

    })


    describe('.getNewAssignment()', function() {

        it('returns a new date assignment given a value')

        it('returns a new range date assignment given a value')

        it('returns a new multiple date assignment given a value')

    })


    describe('.getNewRangeAssignment()', function() {

        it('returns a new range date assignment given a value')

    })


    describe('.getNewMultipleAssignment()', function() {

        it('returns a new range date assignment given a value')

    })


    describe('.cloneSelection()', function() {

        it('clones entire the selection')
    })


    describe('.cloneLastSelection()', function() {

        it('clones the last date in the selection')
    })


    describe('.nextEnabledDate()', function() {

        it('checks if a dates is below the min and returns the next enabled one', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    min: [2014, 4, 4]
                }
            })
            var date = pickadate.nextEnabledDate([2014, 4, 1])
            expect(date.value).toEqual(shadow.Date.create([2014, 4, 4]).value)
        })

        it('checks if a dates is above the max and returns the next enabled one', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    max: [2014, 4, 24]
                }
            })
            var date = pickadate.nextEnabledDate([2014, 5, 1])
            expect(date.value).toEqual(shadow.Date.create([2014, 4, 24]).value)
        })

        it('checks if a date exists in a month and returns the next existing one', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var date = pickadate.nextEnabledDate([2014, 1, 31])
            expect(date.value).toEqual(shadow.Date.create([2014, 1, 28]).value)
        })
    })


    describe('.isSelected()', function() {

        it('returns if a date is selected', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    select: [2013, 3, 4]
                }
            })
            var isSelected = pickadate.isSelected([2013, 3, 4])
            expect(isSelected).toBe(true)
            isSelected = pickadate.isSelected([2012, 4, 7])
            expect(isSelected).toBe(false)
        })

        it('returns if a date is selected given a comparison scope', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    select: [2013, 3, 4]
                }
            })
            var isSelected = pickadate.isSelected('month', [2013, 3, 14])
            expect(isSelected).toBe(true)
            isSelected = pickadate.isSelected('month', [2014, 3, 14])
            expect(isSelected).toBe(false)
            isSelected = pickadate.isSelected('year', [2013, 4, 4])
            expect(isSelected).toBe(true)
            isSelected = pickadate.isSelected('year', [2014, 3, 4])
            expect(isSelected).toBe(false)
        })

        it('returns if a date is selected with a range', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    allowRange: true,
                    select: [[2013, 3, 4], [2013, 5, 14]]
                }
            })
            var isSelected = pickadate.isSelected([2013, 4, 7])
            expect(isSelected).toBe(true)
            isSelected = pickadate.isSelected([2013, 3, 2])
            expect(isSelected).toBe(false)
            isSelected = pickadate.isSelected([2013, 5, 22])
            expect(isSelected).toBe(false)
        })

        it('returns if a date is selected with a range given a comparison scope', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    allowRange: true,
                    select: [[2013, 3, 4], [2013, 5, 14]]
                }
            })
            var isSelected = pickadate.isSelected('month', [2013, 4, 7])
            expect(isSelected).toBe(true)
            isSelected = pickadate.isSelected('month', [2012, 4, 7])
            expect(isSelected).toBe(false)
            isSelected = pickadate.isSelected('year', [2013, 2, 7])
            expect(isSelected).toBe(true)
            isSelected = pickadate.isSelected('year', [2012, 4, 7])
            expect(isSelected).toBe(false)
        })

        it('returns if a date is selected with multiple dates allowed')

        it('returns if a date is selected with multiple dates allowed and given a comparison scope')

        it('returns if a date is selected with multiple date ranges allowed')

        it('returns if a date is selected with multiple date ranges allowed and given a comparison scope')
    })


    describe('.isDisabled()', function() {

        it('returns if a date is disabled')

    })


    describe('.createHeader()', function() {

        it('creates a header container element with 3 navigation buttons', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var header = pickadate.createHeader()
            expect(header.nodeName).toBe('HEADER')
            expect(header.className).toBe(pickadate.classNames.header)
            var buttons = header.querySelectorAll('button')
            expect(buttons.length).toBe(3)
        })
    })


    describe('.createBody()', function() {

        it('creates a “focusable” body container element with 3 type of grids', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var classes = pickadate.classNames
            var body = pickadate.createBody()
            expect(body.nodeName).toBe('DIV')
            expect(body.tabIndex).toBe(0)
            expect(body.className).toBe(classes.body)
            var buttons = body.querySelectorAll('.' + classes.grid)
            expect(buttons.length).toBe(3)
        })
    })


    describe('.createFooter()', function() {

        it('creates a footer container element with a “today” and “clear” button', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var footer = pickadate.createFooter()
            expect(footer.nodeName).toBe('FOOTER')
            expect(footer.className).toBe(pickadate.classNames.footer)
            var buttons = footer.querySelectorAll('button')
            expect(buttons.length).toBe(2)
        })
    })


    describe('.createButtonNav()', function() {

        it('creates a directional nav button - either prev or next', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })

            var buttonNav = pickadate.createButtonNav()
            expect(buttonNav.nodeName).toBe('BUTTON')
            expect(buttonNav.className).toBe(pickadate.classNames.buttonPrev)

            buttonNav = pickadate.createButtonNav('next')
            expect(buttonNav.nodeName).toBe('BUTTON')
            expect(buttonNav.className).toBe(pickadate.classNames.buttonNext)
        })

        it('creates a disabled prev nav button if the month in view is the min', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.min = [2014, 4, 4]
            attrs.highlight = [2014, 4, 24]

            var buttonNav = pickadate.createButtonNav()
            var isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(true)

            buttonNav = pickadate.createButtonNav('next')
            isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(false)
        })

        it('creates a disabled next nav button if the month in view is the max', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.max = [2014, 4, 24]
            attrs.highlight = [2014, 4, 4]

            var buttonNav = pickadate.createButtonNav('next')
            var isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(true)

            buttonNav = pickadate.createButtonNav()
            isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(false)
        })

        it('creates a disabled prev nav button if the year in view is the min', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.min = [2013, 4, 4]
            attrs.highlight = [2013, 8, 24]
            attrs.show = 'months'

            var buttonNav = pickadate.createButtonNav()
            var isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(true)

            buttonNav = pickadate.createButtonNav('next')
            isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(false)
        })

        it('creates a disabled next nav button if the year in view is the max', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.max = [2023, 8, 4]
            attrs.highlight = [2023, 4, 24]
            attrs.show = 'months'

            var buttonNav = pickadate.createButtonNav('next')
            var isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(true)

            buttonNav = pickadate.createButtonNav()
            isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(false)
        })

        it('creates a disabled prev nav button if the decade in view is the min', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.min = [2013, 4, 4]
            attrs.highlight = [2018, 8, 24]
            attrs.show = 'years'

            var buttonNav = pickadate.createButtonNav()
            var isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(true)

            buttonNav = pickadate.createButtonNav('next')
            isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(false)
        })

        it('creates a disabled next nav button if the decade in view is the max', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.max = [2028, 8, 4]
            attrs.highlight = [2023, 4, 24]
            attrs.show = 'years'

            var buttonNav = pickadate.createButtonNav('next')
            var isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(true)

            buttonNav = pickadate.createButtonNav()
            isDisabled = buttonNav.disabled
            expect(isDisabled).toBe(false)
        })

        it('binds clicks to the prev nav button to go to the previous month', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            var buttonNav = pickadate.createButtonNav()
            var expectedYear = attrs.highlight.year
            var expectedMonth = attrs.highlight.month - 1
            var expectedHighlight = new Date(expectedYear, expectedMonth, 1)

            buttonNav.click()
            expect(attrs.highlight.year).toEqual(expectedHighlight.getFullYear())
            expect(attrs.highlight.month).toEqual(expectedHighlight.getMonth())
        })

        it('binds clicks to the next nav button to go to the next month', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            var buttonNav = pickadate.createButtonNav('next')
            var expectedYear = attrs.highlight.year
            var expectedMonth = attrs.highlight.month + 1
            var expectedDate = attrs.highlight.date
            var expectedHighlight = new Date(expectedYear, expectedMonth, expectedDate)

            buttonNav.click()
            expect(attrs.highlight.year).toEqual(expectedHighlight.getFullYear())
            expect(attrs.highlight.month).toEqual(expectedHighlight.getMonth())
            expect(attrs.highlight.date).toEqual(expectedHighlight.getDate())
        })

        it('binds clicks to the prev nav button to go to the previous year while showing the months', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.show = 'months'
            var buttonNav = pickadate.createButtonNav()
            var expectedYear = attrs.highlight.year - 1
            var expectedMonth = attrs.highlight.month
            var expectedDate = attrs.highlight.date
            var expectedHighlight = new Date(expectedYear, expectedMonth, expectedDate)

            buttonNav.click()
            expect(attrs.highlight.year).toEqual(expectedHighlight.getFullYear())
            expect(attrs.highlight.month).toEqual(expectedHighlight.getMonth())
            expect(attrs.highlight.date).toEqual(expectedHighlight.getDate())
        })

        it('binds clicks to the next nav button to go to the next year while showing the months', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.show = 'months'
            var buttonNav = pickadate.createButtonNav('next')
            var expectedYear = attrs.highlight.year + 1
            var expectedMonth = attrs.highlight.month
            var expectedDate = attrs.highlight.date
            var expectedHighlight = new Date(expectedYear, expectedMonth, expectedDate)

            buttonNav.click()
            expect(attrs.highlight.year).toEqual(expectedHighlight.getFullYear())
            expect(attrs.highlight.month).toEqual(expectedHighlight.getMonth())
            expect(attrs.highlight.date).toEqual(expectedHighlight.getDate())
        })

        it('binds clicks to the prev nav button to go to the previous decade while showing the years', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.show = 'years'
            var buttonNav = pickadate.createButtonNav()
            var expectedYear = attrs.highlight.year - 10
            var expectedMonth = attrs.highlight.month
            var expectedDate = attrs.highlight.date
            var expectedHighlight = new Date(expectedYear, expectedMonth, expectedDate)

            buttonNav.click()
            expect(attrs.highlight.year).toEqual(expectedHighlight.getFullYear())
            expect(attrs.highlight.month).toEqual(expectedHighlight.getMonth())
            expect(attrs.highlight.date).toEqual(expectedHighlight.getDate())
        })

        it('binds clicks to the next nav button to go to the next decade while showing the years', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.show = 'years'
            var buttonNav = pickadate.createButtonNav('next')
            var expectedYear = attrs.highlight.year + 10
            var expectedMonth = attrs.highlight.month
            var expectedDate = attrs.highlight.date
            var expectedHighlight = new Date(expectedYear, expectedMonth, expectedDate)

            buttonNav.click()
            expect(attrs.highlight.year).toEqual(expectedHighlight.getFullYear())
            expect(attrs.highlight.month).toEqual(expectedHighlight.getMonth())
            expect(attrs.highlight.date).toEqual(expectedHighlight.getDate())
        })

        it('updates the nav button when the view is set', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.min = [2014, 4, 4]
            attrs.max = [2014, 8, 28]
            attrs.highlight = [2014, 5, 24]

            var buttonNavPrev = pickadate.createButtonNav()
            var buttonNavNext = pickadate.createButtonNav('next')

            var isDisabledPrev = buttonNavPrev.disabled
            var isDisabledNext = buttonNavNext.disabled

            expect(isDisabledPrev).toBe(false)
            expect(isDisabledNext).toBe(false)

            attrs.view = [2014, 4, 1]

            isDisabledPrev = buttonNavPrev.disabled
            isDisabledNext = buttonNavNext.disabled

            expect(isDisabledPrev).toBe(true)
            expect(isDisabledNext).toBe(false)

            attrs.view = [2014, 8, 1]

            isDisabledPrev = buttonNavPrev.disabled
            isDisabledNext = buttonNavNext.disabled

            expect(isDisabledPrev).toBe(false)
            expect(isDisabledNext).toBe(true)
        })

        it('updates the nav button when the showing scope is set', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            attrs.min = [2014, 4, 4]
            attrs.max = [2014, 8, 28]
            attrs.highlight = [2014, 5, 24]

            var buttonNavPrev = pickadate.createButtonNav()
            var buttonNavNext = pickadate.createButtonNav('next')

            var isDisabledPrev = buttonNavPrev.disabled
            var isDisabledNext = buttonNavNext.disabled

            expect(isDisabledPrev).toBe(false)
            expect(isDisabledNext).toBe(false)

            attrs.show = 'months'

            isDisabledPrev = buttonNavPrev.disabled
            isDisabledNext = buttonNavNext.disabled

            expect(isDisabledPrev).toBe(true)
            expect(isDisabledNext).toBe(true)

            attrs.min = [2004, 4, 4]
            attrs.max = [2024, 8, 28]

            attrs.show = 'years'

            isDisabledPrev = buttonNavPrev.disabled
            isDisabledNext = buttonNavNext.disabled

            expect(isDisabledPrev).toBe(false)
            expect(isDisabledNext).toBe(false)
        })
    })


    describe('.createButtonScope()', function() {

        it('creates a scope changing button', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var buttonScope = pickadate.createButtonScope()

            expect(buttonScope.nodeName).toBe('BUTTON')
        })

        it('contains the month and year in scope while showing dates', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    view: [2014, 2, 4]
                }
            })

            var buttonScope = pickadate.createButtonScope()

            expect(buttonScope.textContent).toMatch(/\bMarch\b/)
            expect(buttonScope.textContent).toMatch(/\b2014\b/)
        })

        it('contains the year in scope while showing months', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    show: 'months',
                    view: [2014, 2, 4]
                }
            })
            var buttonScope = pickadate.createButtonScope()

            expect(buttonScope.textContent).not.toMatch(/\bMarch\b/)
            expect(buttonScope.textContent).toMatch(/\b2014\b/)
        })

        it('contains the decade in scope while showing years', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    show: 'years',
                    view: [2014, 2, 4]
                }
            })
            var buttonScope = pickadate.createButtonScope()

            expect(buttonScope.textContent).not.toMatch(/\bMarch\b/)
            expect(buttonScope.textContent).not.toMatch(/\b2014\b/)
            expect(buttonScope.textContent).toMatch(/\b2010\b/)
            expect(buttonScope.textContent).toMatch(/\b2019\b/)
        })

        it('binds click events to update the scope', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs

            var buttonScope = pickadate.createButtonScope()
            expect(attrs.show).toBe(null)

            buttonScope.click()
            expect(attrs.show).toBe('months')

            buttonScope.click()
            expect(attrs.show).toBe('years')

            buttonScope.click()
            expect(attrs.show).toBe(null)

            buttonScope.click()
            expect(attrs.show).toBe('months')
        })

        it('updates the button when the scope is set', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    view: [2014, 2, 1]
                }
            })
            var attrs = pickadate.attrs

            var buttonScope = pickadate.createButtonScope()

            expect(buttonScope.textContent).toMatch(/\bMarch\b/)
            expect(buttonScope.textContent).toMatch(/\b2014\b/)

            attrs.show = 'months'

            expect(buttonScope.textContent).not.toMatch(/\bMarch\b/)
            expect(buttonScope.textContent).toMatch(/\b2014\b/)

            attrs.show = 'years'

            expect(buttonScope.textContent).not.toMatch(/\bMarch\b/)
            expect(buttonScope.textContent).not.toMatch(/\b2014\b/)
            expect(buttonScope.textContent).toMatch(/\b2010\b/)
            expect(buttonScope.textContent).toMatch(/\b2019\b/)

            attrs.show = 'dates'

            expect(buttonScope.textContent).toMatch(/\bMarch\b/)
            expect(buttonScope.textContent).toMatch(/\b2014\b/)
        })

        it('updates the button when the view is set', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    view: [2014, 2, 1]
                }
            })
            var attrs = pickadate.attrs

            var buttonScope = pickadate.createButtonScope()
            expect(buttonScope.textContent).toMatch(/\bMarch\b/)

            attrs.view = [2014, 4, 1]
            expect(buttonScope.textContent).not.toMatch(/\bMarch\b/)
            expect(buttonScope.textContent).toMatch(/\bMay\b/)

            attrs.show = 'months'
            attrs.view = [2010, 4, 1]
            expect(buttonScope.textContent).not.toMatch(/\bMay\b/)
            expect(buttonScope.textContent).toMatch(/\b2010\b/)

            attrs.view = [1988, 4, 1]
            expect(buttonScope.textContent).toMatch(/\b1988\b/)

            attrs.show = 'years'
            attrs.view = [1932, 4, 1]
            expect(buttonScope.textContent).not.toMatch(/\b1988\b/)
            expect(buttonScope.textContent).toMatch(/\b1930\b/)
            expect(buttonScope.textContent).toMatch(/\b1939\b/)

            attrs.view = [1988, 4, 1]
            expect(buttonScope.textContent).toMatch(/\b1980\b/)
            expect(buttonScope.textContent).toMatch(/\b1989\b/)
        })
    })


    describe('.createButtonToday()', function() {

        it('creates a “today” button', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var buttonToday = pickadate.createButtonToday()
            expect(buttonToday.nodeName).toBe('BUTTON')
            expect(buttonToday.textContent).toBe(pickadate.dict.today)
        })

        it('binds clicks to set the highlight as “today”', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    highlight: [2012, 3, 20]
                }
            })
            var attrs = pickadate.attrs
            var buttonToday = pickadate.createButtonToday()
            var today = new Date()
            today = [today.getFullYear(), today.getMonth(), today.getDate()]
            expect(attrs.highlight.value).not.toEqual(today)
            buttonToday.click()
            expect(attrs.highlight.value).toEqual(today)
        })

        it('binds clicks to reset the scope', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs
            var buttonToday = pickadate.createButtonToday()
            expect(attrs.show).toBe(null)
            buttonToday.click()
            expect(attrs.show).toBe(null)
        })
    })


    describe('.createButtonClear()', function() {

        it('creates a “clear” button', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var buttonClear = pickadate.createButtonClear()
            expect(buttonClear.nodeName).toBe('BUTTON')
            expect(buttonClear.textContent).toBe(pickadate.dict.clear)
        })

        it('binds clicks to remove the selection', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    select: [2014, 3, 4]
                }
            })
            var attrs = pickadate.attrs
            var buttonClear = pickadate.createButtonClear()
            expect(attrs.select).not.toBe(null)
            buttonClear.click()
            expect(attrs.select).toBe(null)
        })

        it('binds clicks to remove the selection while ranges are allowed', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    allowRange: true,
                    select: [[2014, 3, 4]]
                }
            })
            var attrs = pickadate.attrs
            var buttonClear = pickadate.createButtonClear()
            expect(attrs.select).not.toBe(null)
            buttonClear.click()
            expect(attrs.select).toBe(null)
        })

        it('binds clicks to reset the scope', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var attrs = pickadate.attrs
            var buttonClear = pickadate.createButtonClear()
            expect(attrs.show).toBe(null)
            buttonClear.click()
            expect(attrs.show).toBe(null)
        })
    })


    describe('.createGrid()', function() {

        it('creates a grid container', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var grid = pickadate.createGrid()
            expect(grid.childNodes[0].nodeName).toBe('TABLE')
        })

        it('can be given a visibility scope', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var grid = pickadate.createGrid('months')
            expect(grid.hidden).toBe(true)
            pickadate.attrs.show = 'months'
            expect(grid.hidden).toBe(false)
            pickadate.attrs.show = null
            expect(grid.hidden).toBe(true)
        })

        it('can be given children elements', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />')
            })
            var grid = pickadate.createGrid(null,
                ['some', 'children', 'elements', shadow._.el('something')])
            var gridTable = grid.children[0]
            expect(gridTable.childNodes.length).toBe(4)
        })

        it('clears any selections within the grid', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    select: [2014, 2 ,3]
                }
            })
            var attrs = pickadate.attrs
            var classes = pickadate.classNames
            expect(pickadate.$el.find('.' + classes.selected).length).toBe(3)
            attrs.select = null
            expect(pickadate.$el.find('.' + classes.selected).length).toBe(0)
        })
    })


    describe('.createGridHeadYears()', function() {

        var pickadate = shadow.Pickadate.create({
            $el: $('<div />'),
            attrs: {
                view: [2003, 2, 1]
            }
        })
        var gridHeadYears = pickadate.createGridHeadYears()

        it('creates a grid head for holding the years of the decade in view', function() {
            expect(gridHeadYears.nodeName).toBe('THEAD')
            expect(gridHeadYears.textContent).toMatch(/\b2000\b/)
            expect(gridHeadYears.textContent).toMatch(/\b2009\b/)
        })

        it('updates the grid head text when the view is set', function() {
            pickadate.attrs.view = [1939, 2, 1]
            expect(gridHeadYears.textContent).not.toMatch(/\b2000\b/)
            expect(gridHeadYears.textContent).not.toMatch(/\b2009\b/)
            expect(gridHeadYears.textContent).toMatch(/\b1930\b/)
            expect(gridHeadYears.textContent).toMatch(/\b1939\b/)
        })
    })


    describe('.createGridHeadMonths()', function() {

        var pickadate = shadow.Pickadate.create({
            $el: $('<div />'),
            attrs: {
                view: [2003, 2, 1]
            }
        })
        var gridHeadMonths = pickadate.createGridHeadMonths()

        it('creates a grid head for holding the year of the month in view', function() {
            expect(gridHeadMonths.nodeName).toBe('THEAD')
            expect(gridHeadMonths.textContent).toBe('2003')
        })

        it('updates the grid head text when the view is set', function() {
            pickadate.attrs.view = [1939, 2, 1]
            expect(gridHeadMonths.textContent).toBe('1939')
        })
    })


    describe('.createGridHeadDates()', function() {

        var pickadate = shadow.Pickadate.create({
            $el: $('<div />'),
            attrs: {
                view: [2003, 2, 1]
            }
        })
        var gridHeadDates = pickadate.createGridHeadDates()

        it('creates a grid head for holding the days of the week', function() {
            expect(gridHeadDates.nodeName).toBe('THEAD')
            expect(gridHeadDates.textContent).toBe(
                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].join('')
            )
        })

        it('updates the grid head text when the first day is set', function() {
            pickadate.attrs.firstDay = 1
            expect(gridHeadDates.textContent).toBe(
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].join('')
            )
        })
    })

    describe('.createGridHeadDates() with showWeekNumbers', function() {

        var pickadate = shadow.Pickadate.create({
            $el: $('<div />'),
            attrs: {
                view: [2003, 2, 1]
            },
            showWeekNumbers: true
        })

        var gridHeadDates = pickadate.createGridHeadDates()

        it('creates a grid head for holding the days of the week', function() {
            expect(gridHeadDates.nodeName).toBe('THEAD')
            expect(gridHeadDates.textContent).toBe(
                ['Wk', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].join('')
            )
        })

        it('updates the grid head text when the first day is set', function() {
            pickadate.attrs.firstDay = 1
            expect(gridHeadDates.textContent).toBe(
                ['Wk', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].join('')
            )
        })
    })

    describe('.createGridBodyYears()', function() {

        var pickadate = shadow.Pickadate.create({
            $el: $('<div />'),
            attrs: {
                view: [2003, 2, 1]
            }
        })
        var gridBodyYears = pickadate.createGridBodyYears()

        it('creates a grid body with rows of years', function() {
            expect(gridBodyYears.nodeName).toBe('TBODY')
            expect(gridBodyYears.textContent).toBe(
                ['1999', '2000', '2001', '2002'].join('') +
                ['2003', '2004', '2005', '2006'].join('') +
                ['2007', '2008', '2009', '2010'].join('')
            )
        })

        it('updates the rows of years when the view is set', function() {
            pickadate.attrs.view = [1939, 2, 1]
            expect(gridBodyYears.textContent).toBe(
                ['1929', '1930', '1931', '1932'].join('') +
                ['1933', '1934', '1935', '1936'].join('') +
                ['1937', '1938', '1939', '1940'].join('')
            )
        })

        it('creates selected/highlighted/disabled grid cells', function() {

            var selected = gridBodyYears.querySelector('.' + pickadate.classNames.selected)
            var highlighted = gridBodyYears.querySelector('.' + pickadate.classNames.highlighted)

            expect(selected).toBe(null)
            expect(highlighted).toBe(null)

            pickadate.attrs.select = [1988, 7, 14]

            selected = gridBodyYears.querySelector('.' + pickadate.classNames.selected)
            highlighted = gridBodyYears.querySelector('.' + pickadate.classNames.selected)

            expect(selected.textContent).toBe('1988')
            expect(highlighted.textContent).toBe('1988')

            var disabled = gridBodyYears.querySelector('.' + pickadate.classNames.disabled)
            expect(disabled).toBe(null)

            pickadate.attrs.min = [1984, 7, 14]

            disabled = gridBodyYears.querySelectorAll('.' + pickadate.classNames.disabled)
            expect(disabled.length).toBe(5)
            expect(disabled[0].textContent).toBe('1979')
            expect(disabled[1].textContent).toBe('1980')
            expect(disabled[2].textContent).toBe('1981')
            expect(disabled[3].textContent).toBe('1982')
            expect(disabled[4].textContent).toBe('1983')
        })
    })


    describe('.createGridBodyMonths()', function() {

        var pickadate = shadow.Pickadate.create({
            $el: $('<div />'),
            attrs: {
                view: [2003, 2, 1]
            }
        })
        var gridBodyMonths = pickadate.createGridBodyMonths()

        it('creates a grid body with rows of months', function() {
            expect(gridBodyMonths.nodeName).toBe('TBODY')
            expect(gridBodyMonths.textContent).toBe(
                ['Jan', 'Feb', 'Mar', 'Apr'].join('') +
                ['May', 'Jun', 'Jul', 'Aug'].join('') +
                ['Sep', 'Oct', 'Nov', 'Dec'].join('')
            )
        })

        it('updates the rows of months when the view is set', function() {
            var highlight = $(gridBodyMonths).find('[data-highlight]').data('highlight')
            pickadate.attrs.view = [1939, 2, 1]
            var newHighlight = $(gridBodyMonths).find('[data-highlight]').data('highlight')
            expect(highlight).not.toEqual(newHighlight)
        })

        it('creates selected/highlighted/disabled grid cells', function() {

            var selected = gridBodyMonths.querySelector('.' + pickadate.classNames.selected)
            var highlighted = gridBodyMonths.querySelector('.' + pickadate.classNames.highlighted)

            expect(selected).toBe(null)
            expect(highlighted).toBe(null)

            pickadate.attrs.select = [1988, 7, 14]

            selected = gridBodyMonths.querySelector('.' + pickadate.classNames.selected)
            highlighted = gridBodyMonths.querySelector('.' + pickadate.classNames.selected)

            expect(selected.textContent).toBe('Aug')
            expect(highlighted.textContent).toBe('Aug')

            var disabled = gridBodyMonths.querySelector('.' + pickadate.classNames.disabled)
            expect(disabled).toBe(null)

            pickadate.attrs.min = [1988, 4, 14]

            disabled = gridBodyMonths.querySelectorAll('.' + pickadate.classNames.disabled)
            expect(disabled.length).toBe(4)
            expect(disabled[0].textContent).toBe('Jan')
            expect(disabled[1].textContent).toBe('Feb')
            expect(disabled[2].textContent).toBe('Mar')
            expect(disabled[3].textContent).toBe('Apr')
        })

        it('shifts the date if the target month doesn’t have as many days as the highlight month', function() {

            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    highlight: [2013, 2, 31]
                }
            })

            var gridBodyMonths = pickadate.createGridBodyMonths()
            var months = gridBodyMonths.querySelectorAll('td')
            var month = months[2]
            var shadowDate = shadow.Date.create(+month.dataset.highlight)
            expect(shadowDate.date).toBe(31)

            pickadate.attrs.highlight = [2013, 1, 31]
            gridBodyMonths = pickadate.createGridBodyMonths()
            months = gridBodyMonths.querySelectorAll('td')
            month = months[1]
            shadowDate = shadow.Date.create(+month.dataset.highlight)
            expect(shadowDate.date).toBe(28)
        })
    })


    describe('.createGridBodyDates()', function() {

        var pickadate = shadow.Pickadate.create({
            $el: $('<div />'),
            attrs: {
                view: [2013, 3, 1]
            }
        })
        var gridBodyDates = pickadate.createGridBodyDates()

        it('creates a grid body with rows of dates', function() {
            expect(gridBodyDates.nodeName).toBe('TBODY')
            expect(gridBodyDates.textContent).toBe(
                [31, 1, 2, 3, 4, 5, 6].join('') +
                [7, 8, 9, 10, 11, 12, 13].join('') +
                [14, 15, 16, 17, 18, 19, 20].join('') +
                [21, 22, 23, 24, 25, 26, 27].join('') +
                [28, 29, 30, 1, 2, 3, 4].join('') +
                [5, 6, 7, 8, 9, 10, 11].join('')
            )
        })

        it('updates the rows of dates when the view is set', function() {
            pickadate.attrs.view = [2013, 1, 1]
            expect(gridBodyDates.textContent).toBe(
                [27, 28, 29, 30, 31, 1, 2].join('') +
                [3, 4, 5, 6, 7, 8, 9].join('') +
                [10, 11, 12, 13, 14, 15, 16].join('') +
                [17, 18, 19, 20, 21, 22, 23].join('') +
                [24, 25, 26, 27, 28, 1, 2].join('') +
                [3, 4, 5, 6, 7, 8, 9].join('')
            )
        })

        it('updates the rows of dates when the first day is set', function() {
            pickadate.attrs.firstDay = 1
            expect(gridBodyDates.textContent).toBe(
                [28, 29, 30, 31, 1, 2, 3].join('') +
                [4, 5, 6, 7, 8, 9, 10].join('') +
                [11, 12, 13, 14, 15, 16, 17].join('') +
                [18, 19, 20, 21, 22, 23, 24].join('') +
                [25, 26, 27, 28, 1, 2, 3].join('') +
                [4, 5, 6, 7, 8, 9, 10].join('')
            )
        })

        it('shifts the rows forward by one when the first day is set and the month starts on Monday', function() {
            pickadate.attrs.view = [2013, 11, 1]
            expect(gridBodyDates.textContent).toBe(
                [25, 26, 27, 28, 29, 30, 1].join('') +
                [2, 3, 4, 5, 6, 7, 8].join('') +
                [9, 10, 11, 12, 13, 14, 15].join('') +
                [16, 17, 18, 19, 20, 21, 22].join('') +
                [23, 24, 25, 26, 27, 28, 29].join('') +
                [30, 31, 1, 2, 3, 4, 5].join('')
            )
        })

        it('creates selected/highlighted/disabled grid cells', function() {

            var selected = gridBodyDates.querySelector('.' + pickadate.classNames.selected)
            var highlighted = gridBodyDates.querySelector('.' + pickadate.classNames.highlighted)

            expect(selected).toBe(null)
            expect(highlighted).toBe(null)

            pickadate.attrs.select = [1988, 6, 14]

            selected = gridBodyDates.querySelector('.' + pickadate.classNames.selected)
            highlighted = gridBodyDates.querySelector('.' + pickadate.classNames.selected)

            expect(selected.textContent).toBe('14')
            expect(highlighted.textContent).toBe('14')

            var disabled = gridBodyDates.querySelector('.' + pickadate.classNames.disabled)
            expect(disabled).toBe(null)

            pickadate.attrs.min = [1988, 6, 4]

            disabled = gridBodyDates.querySelectorAll('.' + pickadate.classNames.disabled)
            expect(disabled.length).toBe(7)
            expect(disabled[0].textContent).toBe('27')
            expect(disabled[1].textContent).toBe('28')
            expect(disabled[2].textContent).toBe('29')
            expect(disabled[3].textContent).toBe('30')
            expect(disabled[4].textContent).toBe('1')
            expect(disabled[5].textContent).toBe('2')
            expect(disabled[6].textContent).toBe('3')
        })
    })


    describe('.template()', function() {

        it('builds out the pickadate’s template', function() {
            var $div = $('<div />')
            expect($div.html()).toBe('')
            shadow.Pickadate.create({
                $el: $div
            })
            expect($div.textContent).not.toBe('')
        })
    })


    describe('.attrs', function() {

        describe('.min', function() {

            it('determines the minimum date value', function() {
                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />'),
                    attrs: {
                        min: [2014, 4, 4]
                    }
                })
                pickadate.attrs.highlight = [2014, 4, 10]

                var dateTime = shadow.Date.create([2014, 4, 4]).time
                var $date = pickadate.$el.find('[data-select=' + dateTime + ']')
                expect($date.length).toBe(1)

                dateTime = shadow.Date.create([2014, 4, 3]).time
                $date = pickadate.$el.find('[data-select=' + dateTime + ']')
                expect($date.length).toBe(0)
            })

            it('can be updated after creation', function() {

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />')
                })
                var attrs = pickadate.attrs

                attrs.highlight = [2014, 4, 10]
                attrs.min = [2014, 4, 4]

                var dateTime = shadow.Date.create([2014, 4, 4]).time
                var $date = pickadate.$el.find('[data-select=' + dateTime + ']')
                expect($date.length).toBe(1)

                dateTime = shadow.Date.create([2014, 4, 3]).time
                $date = pickadate.$el.find('[data-select=' + dateTime + ']')
                expect($date.length).toBe(0)
            })

            it('updates the highlight if it is out of range', function() {

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />')
                })
                var attrs = pickadate.attrs

                attrs.highlight = [2014, 4, 10]

                attrs.min = [2014, 4, 4]
                expect(attrs.highlight.value).toEqual([2014, 4, 10])

                attrs.min = [2014, 4, 14]
                expect(attrs.highlight.value).toEqual([2014, 4, 14])
            })
        })

        describe('.max', function() {

            it('determines the maximum date value', function() {
                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />'),
                    attrs: {
                        max: [2014, 4, 24]
                    }
                })
                pickadate.attrs.highlight = [2014, 4, 10]

                var dateTime = shadow.Date.create([2014, 4, 24]).time
                var $date = pickadate.$el.find('[data-select=' + dateTime + ']')
                expect($date.length).toBe(1)

                dateTime = shadow.Date.create([2014, 4, 25]).time
                $date = pickadate.$el.find('[data-select=' + dateTime + ']')
                expect($date.length).toBe(0)
            })

            it('can be updated after creation', function() {

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />')
                })
                var attrs = pickadate.attrs

                attrs.highlight = [2014, 4, 10]
                attrs.max = [2014, 4, 24]

                var dateTime = shadow.Date.create([2014, 4, 24]).time
                var $date = pickadate.$el.find('[data-select=' + dateTime + ']')
                expect($date.length).toBe(1)

                dateTime = shadow.Date.create([2014, 4, 25]).time
                $date = pickadate.$el.find('[data-select=' + dateTime + ']')
                expect($date.length).toBe(0)
            })

            it('updates the highlight if it is out of range', function() {

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />')
                })
                var attrs = pickadate.attrs

                attrs.highlight = [2014, 4, 10]

                attrs.max = [2014, 4, 14]
                expect(attrs.highlight.value).toEqual([2014, 4, 10])

                attrs.max = [2014, 4, 4]
                expect(attrs.highlight.value).toEqual([2014, 4, 4])
            })
        })

        describe('.today', function() {

            it('determines the date today', function() {
                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />')
                })
                var today = pickadate.attrs.today
                var todayNode = pickadate.$el.find('.' + pickadate.classNames.now)[0]
                expect(todayNode.textContent).toBe('' + today.date)
            })
        })

        describe('.view', function() {

            it('determines the month in view', function() {

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />'),
                    attrs: {
                        view: [2013, 2, 4]
                    }
                })
                var attrs = pickadate.attrs
                var classes = pickadate.classNames
                var classButtonScope = '.' + classes.buttonScope.split(' ').join('.')

                expect(attrs.view.value).toEqual([2013, 2, 1])
                var $buttonScope = pickadate.$el.find(classButtonScope)
                expect($buttonScope.text()).toBe('March 2013')
            })

            it('can be updated after creation', function() {

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />')
                })
                var attrs = pickadate.attrs
                var dict = pickadate.dict
                var classes = pickadate.classNames
                var classButtonScope = '.' + classes.buttonScope.split(' ').join('.')

                var view = new Date()
                view = [view.getFullYear(), view.getMonth(), 1]
                expect(attrs.view.value).toEqual(view)
                var $buttonScope = pickadate.$el.find(classButtonScope)
                expect($buttonScope.text()).toBe(dict.monthsFull[view[1]]+ ' ' + view[0])
            })
        })

        describe('.highlight', function() {

            it('determines the date highlighted and the month in view', function() {

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />'),
                    attrs: {
                        highlight: [2013, 2, 4]
                    }
                })
                var attrs = pickadate.attrs
                var classes = pickadate.classNames
                var classButtonScope = '.' + classes.buttonScope.split(' ').join('.')
                var $highlight = pickadate.$el.find('.' + classes.highlighted)
                expect($highlight.text()).toBe('4Mar2013')

                expect(attrs.highlight.value).toEqual([2013, 2, 4])
                expect(attrs.view.value).toEqual([2013, 2, 1])
                var $buttonScope = pickadate.$el.find(classButtonScope)
                expect($buttonScope.text()).toBe('March 2013')
            })

            it('can be updated after creation', function() {

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />')
                })
                var attrs = pickadate.attrs
                var classes = pickadate.classNames
                var classButtonScope = '.' + classes.buttonScope.split(' ').join('.')

                attrs.highlight = [2013, 2, 4]

                var $highlight = pickadate.$el.find('.' + classes.highlighted)
                expect($highlight.text()).toBe('4Mar2013')
                var $buttonScope = pickadate.$el.find(classButtonScope)
                expect($buttonScope.text()).toBe('March 2013')
            })
        })

        describe('.select', function() {

            it('determines the date selected, the date highlighted, and the month in view', function() {

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />'),
                    attrs: {
                        select: [2013, 2, 4]
                    }
                })
                var attrs = pickadate.attrs
                var classes = pickadate.classNames
                var classButtonScope = '.' + classes.buttonScope.split(' ').join('.')

                var $select = pickadate.$el.find('.' + classes.selected)
                expect($select.text()).toBe('4Mar2013')
                var $highlight = pickadate.$el.find('.' + classes.highlighted)
                expect($highlight.text()).toBe('4Mar2013')

                expect(attrs.select.value).toEqual([2013, 2, 4])
                expect(attrs.highlight.value).toEqual([2013, 2, 4])
                expect(attrs.view.value).toEqual([2013, 2, 1])
                expect(attrs.value).toBe('4 March, 2013')
                var $buttonScope = pickadate.$el.find(classButtonScope)
                expect($buttonScope.text()).toBe('March 2013')
            })

            it('can be updated after creation', function() {

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />')
                })
                var attrs = pickadate.attrs
                var classes = pickadate.classNames
                var classButtonScope = '.' + classes.buttonScope.split(' ').join('.')

                attrs.select = [2013, 2, 4]

                var $select = pickadate.$el.find('.' + classes.selected)
                expect($select.text()).toBe('4Mar2013')
                var $highlight = pickadate.$el.find('.' + classes.highlighted)
                expect($highlight.text()).toBe('4Mar2013')
                var $month = pickadate.$el.find(classButtonScope)
                expect($month.text()).toBe('March 2013')
            })
        })

        describe('.value', function() {

            it('determines the element’s value, the date selected, the date highlighted, and the month in view', function() {

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />'),
                    attrs: {
                        value: '4 March, 2013'
                    }
                })
                var attrs = pickadate.attrs

                expect(attrs.value).toBe('4 March, 2013')
                expect(attrs.select.value).toEqual([2013, 2, 4])
                expect(attrs.highlight.value).toEqual([2013, 2, 4])
                expect(attrs.view.value).toEqual([2013, 2, 1])
            })

            xit('can only be declared at the time of creation', function() {

                // note: due to circular dependency. is there an elegant solution?

                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />')
                })
                var attrs = pickadate.attrs

                expect(attrs.value).toBe(null)
                expect(attrs.select).toBe(null)

                attrs.value = '4 March, 2013'

                expect(attrs.value).toBe('4 March, 2013')
                expect(attrs.select.value).not.toEqual([2013, 2, 4])
                expect(attrs.highlight.value).not.toEqual([2013, 2, 4])
                expect(attrs.view.value).not.toEqual([2013, 2, 1])
            })
        })

        describe('.format', function() {

            it('is used to format the value', function() {
                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />'),
                    attrs: {
                        select: [2012, 7, 14],
                        format: 'yyyy-mm-dd'
                    }
                })
                var attrs = pickadate.attrs
                expect(attrs.value).toBe('2012-08-14')
                attrs.format = 'dddd, d mmm, yyyy'
                expect(attrs.value).toBe('Tuesday, 14 Aug, 2012')
            })

            it('is used to parse the value', function() {
                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />'),
                    attrs: {
                        value: '2013-05-02',
                        format: 'yyyy-mm-dd'
                    }
                })
                var attrs = pickadate.attrs
                expect(attrs.select.value).toEqual([2013, 4, 2])
            })
        })

        describe('.firstDay', function() {

            it('is used to set the first day of the week to Monday', function() {
                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />'),
                    attrs: {
                        firstDay: 1
                    }
                })
                var $weekday = pickadate.$el.find('thead').children().first()
                expect($weekday.text()).toBe('Mon')
            })

            it('can be updated after creation', function() {
                var pickadate = shadow.Pickadate.create({
                    $el: $('<div />')
                })
                var previousFirstDate = pickadate.$el.find('td').first().text()
                pickadate.attrs.firstDay = 1
                var $weekday = pickadate.$el.find('thead').children().first()
                expect($weekday.text()).toBe('Mon')
                var $date = pickadate.$el.find('td').first()
                expect($date.text()).not.toBe(previousFirstDate)
            })
        })

    })


    describe('.formats', function() {

        describe('.d()', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    format: 'd mmmm, yyyy'
                }
            })
            it('formats a date array value into the date', function() {
                var date = shadow.Date.create([2014, 2, 5])
                expect(pickadate.formats.d(date)).toEqual(5)
                date = shadow.Date.create([2012, 10, 23])
                expect(pickadate.formats.d(date)).toEqual(23)
            })
            it('parses a date by slicing out the date unit', function() {
                var parsed = pickadate.formats.d('4 August, 1988', true)
                expect(parsed).toBe('4')
                parsed = pickadate.formats.d('14 August, 1988', true)
                expect(parsed).toBe('14')
            })
        })

        describe('.dd()', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    format: 'dd mmmm, yyyy'
                }
            })
            it('formats a date array value into the date with a leading zero', function() {
                var date = shadow.Date.create([2014, 2, 5])
                expect(pickadate.formats.dd(date)).toEqual('05')
                date = shadow.Date.create([2012, 10, 23])
                expect(pickadate.formats.dd(date)).toEqual('23')
            })
            it('parses a date with a leading zero by slicing out the date unit', function() {
                var parsed = pickadate.formats.d('04 August, 1988', true)
                expect(parsed).toBe('04')
                parsed = pickadate.formats.dd('14 August, 1988', true)
                expect(parsed).toBe('14')
            })
        })

        describe('.ddd()', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    format: 'ddd, d mmmm, yyyy'
                }
            })
            it('formats a date array value into the short weekday', function() {
                var date = shadow.Date.create([2014, 2, 5])
                expect(pickadate.formats.ddd.call(pickadate, date)).toEqual('Wed')
                date = shadow.Date.create([2012, 10, 23])
                expect(pickadate.formats.ddd.call(pickadate, date)).toEqual('Fri')
            })
            it('parses a short weekday by slicing out the weekday unit', function() {
                var parsed = pickadate.formats.ddd('Tue, 6 May, 2014', true)
                expect(parsed).toBe('Tue')
            })
        })

        describe('.dddd()', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    format: 'dddd, d mmmm, yyyy'
                }
            })
            it('formats a date array value into the full weekday', function() {
                var date = shadow.Date.create([2014, 2, 5])
                expect(pickadate.formats.dddd.call(pickadate, date)).toEqual('Wednesday')
                date = shadow.Date.create([2012, 10, 23])
                expect(pickadate.formats.dddd.call(pickadate, date)).toEqual('Friday')
            })
            it('parses a full weekday by slicing out the weekday unit', function() {
                var parsed = pickadate.formats.ddd('Tuesday, 6 May, 2014', true)
                expect(parsed).toBe('Tuesday')
            })
        })

        describe('.m()', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    format: 'm-d-yyyy'
                }
            })
            it('formats a date array value into the month', function() {
                var date = shadow.Date.create([2014, 2, 5])
                expect(pickadate.formats.m(date)).toEqual(3)
                date = shadow.Date.create([2012, 10, 23])
                expect(pickadate.formats.m(date)).toEqual(11)
            })
            it('parses a month by slicing out the month unit', function() {
                var parsed = pickadate.formats.m('4-20-2014', true)
                expect(parsed).toBe('4')
                parsed = pickadate.formats.m('10-20-2014', true)
                expect(parsed).toBe('10')
            })
        })

        describe('.mm()', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    format: 'mm-d-yyyy'
                }
            })
            it('formats a date array value into the month with a leading zero', function() {
                var date = shadow.Date.create([2014, 2, 5])
                expect(pickadate.formats.mm(date)).toEqual('03')
                date = shadow.Date.create([2012, 10, 23])
                expect(pickadate.formats.mm(date)).toEqual('11')
            })
            it('parses a month with a leading zero by slicing out the month unit', function() {
                var parsed = pickadate.formats.mm('04-20-2014', true)
                expect(parsed).toBe('04')
                parsed = pickadate.formats.mm('10-20-2014', true)
                expect(parsed).toBe('10')
            })
        })

        describe('.mmm()', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    format: 'mmm-d-yyyy'
                }
            })
            it('formats a date array value into the short month name', function() {
                var date = shadow.Date.create([2014, 2, 5])
                expect(pickadate.formats.mmm.call(pickadate, date)).toEqual('Mar')
                date = shadow.Date.create([2012, 10, 23])
                expect(pickadate.formats.mmm.call(pickadate, date)).toEqual('Nov')
            })
            it('parses a short month name by slicing out the month unit', function() {
                var parsed = pickadate.formats.mmm('Apr-20-2014', true)
                expect(parsed).toBe('Apr')
                parsed = pickadate.formats.mmm('Oct-20-2014', true)
                expect(parsed).toBe('Oct')
            })
        })

        describe('.mmmm()', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    format: 'mmmm-d-yyyy'
                }
            })
            it('formats a date array value into the full month name', function() {
                var date = shadow.Date.create([2014, 2, 5])
                expect(pickadate.formats.mmmm.call(pickadate, date)).toEqual('March')
                date = shadow.Date.create([2012, 10, 23])
                expect(pickadate.formats.mmmm.call(pickadate, date)).toEqual('November')
            })
            it('parses a full month name by slicing out the month unit', function() {
                var parsed = pickadate.formats.mmmm('April-20-2014', true)
                expect(parsed).toBe('April')
                parsed = pickadate.formats.mmmm('October-20-2014', true)
                expect(parsed).toBe('October')
            })
        })

        describe('.yyyy()', function() {
            var pickadate = shadow.Pickadate.create({
                $el: $('<div />'),
                attrs: {
                    format: 'yyyy-mm-dd'
                }
            })
            it('formats a date array value into the year', function() {
                var date = shadow.Date.create([2014, 2, 5])
                expect(pickadate.formats.yyyy(date)).toEqual(2014)
                date = shadow.Date.create([2012, 10, 23])
                expect(pickadate.formats.yyyy(date)).toEqual(2012)
            })
            it('parses a year by slicing out the year unit', function() {
                var parsed = pickadate.formats.yyyy('2014-04-20', true)
                expect(parsed).toBe('2014')
                parsed = pickadate.formats.yyyy('2010-12-04', true)
                expect(parsed).toBe('2010')
            })
        })

    })

})
