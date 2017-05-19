const sinon        = require('sinon')

const DAY          = require('constants/day')
const LANGUAGE     = require('constants/language')
const MONTH        = require('constants/month')
const SCOPE        = require('constants/scope')
const calendarUtil = require('utils/calendar')
const dateUtil     = require('utils/date')



describe('/calendarUtil', () => {


  //////////////
  // WEEKDAYS //
  //////////////



  describe('#getWeekdays', () => {

    it('gets the short weekdays', () => {

      const language = LANGUAGE.ENGLISH
      const weekdays = calendarUtil.getWeekdays(language)

      weekdays.should.eql(DAY.SHORT[LANGUAGE.ENGLISH])

    })


    it('gets the long weekdays')


    it('gets the short weekdays for the correct language')


    it('gets the long weekdays for the correct language')

  })





  //////////////////////
  // DATE COLLECTIONS //
  //////////////////////



  describe('#getDatesForRows', () => {

    it(
      'gets the dates for rows of years, with the state scope of YEARS ',
    () => {

      const year  = 2014
      const month = 3

      const decadeStartYear = 2010
      const expectedDatesForRows = [
        [
          new Date(decadeStartYear, month, 1),
          new Date(decadeStartYear + 1, month, 1),
          new Date(decadeStartYear + 2, month, 1),
          new Date(decadeStartYear + 3, month, 1),
          new Date(decadeStartYear + 4, month, 1),
        ],
        [
          new Date(decadeStartYear + 5, month, 1),
          new Date(decadeStartYear + 6, month, 1),
          new Date(decadeStartYear + 7, month, 1),
          new Date(decadeStartYear + 8, month, 1),
          new Date(decadeStartYear + 9, month, 1),
        ],
      ]

      const scope = SCOPE.YEARS
      const view  = new Date(year, month, 20)

      const state = { scope, view }

      const datesForRows = calendarUtil.getDatesForRows(state.view, state.scope)

      datesForRows.should.eql(expectedDatesForRows)

    })


    it(
      'gets the dates for rows of months, with the state scope of MONTHS',
    () => {

      const year = 2014

      const expectedDatesForRows = [
        [
          new Date(year, 0, 1),
          new Date(year, 1, 1),
          new Date(year, 2, 1),
          new Date(year, 3, 1),
        ],
        [
          new Date(year, 4, 1),
          new Date(year, 5, 1),
          new Date(year, 6, 1),
          new Date(year, 7, 1),
        ],
        [
          new Date(year, 8, 1),
          new Date(year, 9, 1),
          new Date(year, 10, 1),
          new Date(year, 11, 1),
        ],
      ]

      const scope = SCOPE.MONTHS
      const view  = new Date(year, 3, 20)

      const state = { scope, view }

      const datesForRows = calendarUtil.getDatesForRows(state.view, state.scope)

      datesForRows.should.eql(expectedDatesForRows)

    })


    it('gets the dates for rows of weeks, with the state scope of DAYS', () => {

      const year  = 2014
      const month = 3

      const expectedDatesForRows = [
        [
          new Date(year, month, -1),
          new Date(year, month, 0),
          new Date(year, month, 1),
          new Date(year, month, 2),
          new Date(year, month, 3),
          new Date(year, month, 4),
          new Date(year, month, 5),
        ],
        [
          new Date(year, month, 6),
          new Date(year, month, 7),
          new Date(year, month, 8),
          new Date(year, month, 9),
          new Date(year, month, 10),
          new Date(year, month, 11),
          new Date(year, month, 12),
        ],
        [
          new Date(year, month, 13),
          new Date(year, month, 14),
          new Date(year, month, 15),
          new Date(year, month, 16),
          new Date(year, month, 17),
          new Date(year, month, 18),
          new Date(year, month, 19),
        ],
        [
          new Date(year, month, 20),
          new Date(year, month, 21),
          new Date(year, month, 22),
          new Date(year, month, 23),
          new Date(year, month, 24),
          new Date(year, month, 25),
          new Date(year, month, 26),
        ],
        [
          new Date(year, month, 27),
          new Date(year, month, 28),
          new Date(year, month, 29),
          new Date(year, month, 30),
          new Date(year, month, 31),
          new Date(year, month, 32),
          new Date(year, month, 33),
        ],
        [
          new Date(year, month, 34),
          new Date(year, month, 35),
          new Date(year, month, 36),
          new Date(year, month, 37),
          new Date(year, month, 38),
          new Date(year, month, 39),
          new Date(year, month, 40),
        ],
      ]

      const scope = SCOPE.DAYS
      const view  = new Date(year, month, 20)

      const state = { scope, view }

      const datesForRows = calendarUtil.getDatesForRows(state.view, state.scope)

      datesForRows.should.eql(expectedDatesForRows)

    })

  })



  describe('#getDatesForRowsOfYears', () => {

    it('gets the dates for rows of years, given a year and month', () => {

      const year  = 2014
      const month = 3

      const decadeStartYear = 2010
      const expectedDatesForRowsOfYears = [
        [
          new Date(decadeStartYear, month, 1),
          new Date(decadeStartYear + 1, month, 1),
          new Date(decadeStartYear + 2, month, 1),
          new Date(decadeStartYear + 3, month, 1),
          new Date(decadeStartYear + 4, month, 1),
        ],
        [
          new Date(decadeStartYear + 5, month, 1),
          new Date(decadeStartYear + 6, month, 1),
          new Date(decadeStartYear + 7, month, 1),
          new Date(decadeStartYear + 8, month, 1),
          new Date(decadeStartYear + 9, month, 1),
        ],
      ]

      const datesForRowsOfYears = calendarUtil.getDatesForRowsOfYears(
        year,
        month
      )

      datesForRowsOfYears.should.eql(expectedDatesForRowsOfYears)

    })

  })



  describe('#getDatesForRowsOfMonths', () => {

    it('gets the dates for rows of months, given a year', () => {

      const year = 2014

      const expectedDatesForRowsOfMonths = [
        [
          new Date(year, 0, 1),
          new Date(year, 1, 1),
          new Date(year, 2, 1),
          new Date(year, 3, 1),
        ],
        [
          new Date(year, 4, 1),
          new Date(year, 5, 1),
          new Date(year, 6, 1),
          new Date(year, 7, 1),
        ],
        [
          new Date(year, 8, 1),
          new Date(year, 9, 1),
          new Date(year, 10, 1),
          new Date(year, 11, 1),
        ],
      ]

      const datesForRowsOfMonths = calendarUtil.getDatesForRowsOfMonths(year)

      datesForRowsOfMonths.should.eql(expectedDatesForRowsOfMonths)

    })

  })



  describe('#getDatesForRowsOfWeeks', () => {

    it('gets the dates for rows of weeks, given a year and month', () => {

      const year  = 2014
      const month = 3

      const expectedDatesForRowsOfWeeks = [
        [
          new Date(year, month, -1),
          new Date(year, month, 0),
          new Date(year, month, 1),
          new Date(year, month, 2),
          new Date(year, month, 3),
          new Date(year, month, 4),
          new Date(year, month, 5),
        ],
        [
          new Date(year, month, 6),
          new Date(year, month, 7),
          new Date(year, month, 8),
          new Date(year, month, 9),
          new Date(year, month, 10),
          new Date(year, month, 11),
          new Date(year, month, 12),
        ],
        [
          new Date(year, month, 13),
          new Date(year, month, 14),
          new Date(year, month, 15),
          new Date(year, month, 16),
          new Date(year, month, 17),
          new Date(year, month, 18),
          new Date(year, month, 19),
        ],
        [
          new Date(year, month, 20),
          new Date(year, month, 21),
          new Date(year, month, 22),
          new Date(year, month, 23),
          new Date(year, month, 24),
          new Date(year, month, 25),
          new Date(year, month, 26),
        ],
        [
          new Date(year, month, 27),
          new Date(year, month, 28),
          new Date(year, month, 29),
          new Date(year, month, 30),
          new Date(year, month, 31),
          new Date(year, month, 32),
          new Date(year, month, 33),
        ],
        [
          new Date(year, month, 34),
          new Date(year, month, 35),
          new Date(year, month, 36),
          new Date(year, month, 37),
          new Date(year, month, 38),
          new Date(year, month, 39),
          new Date(year, month, 40),
        ],
      ]

      const datesForRowsOfWeeks = calendarUtil.getDatesForRowsOfWeeks(
        year,
        month
      )

      datesForRowsOfWeeks.should.eql(expectedDatesForRowsOfWeeks)

    })

  })



  describe('#getDatesForWeek', () => {

    it('gets the dates for a week, give a year, month, and week index', () => {

      const year  = 2014
      const month = 4

      for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {

        const expectedDatesForWeek = [
          new Date(year, month, -3 + (weekIndex * 7)),
          new Date(year, month, -2 + (weekIndex * 7)),
          new Date(year, month, -1 + (weekIndex * 7)),
          new Date(year, month, 0 + (weekIndex * 7)),
          new Date(year, month, 1 + (weekIndex * 7)),
          new Date(year, month, 2 + (weekIndex * 7)),
          new Date(year, month, 3 + (weekIndex * 7)),
        ]

        const datesForWeek = calendarUtil.getDatesForWeek(
          year,
          month,
          weekIndex
        )

        datesForWeek.should.eql(expectedDatesForWeek)

      }

    })

  })





  /////////////////////////
  // NEXT RELATIVE DATES //
  /////////////////////////



  describe('#getDateOfNextScope', () => {

    it('gets the date of the next scope, given a date with the scope of YEARS', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.YEARS)
      startDate.should.eql(new Date(2024, 3, 20))
    })


    it('gets the closest date of the next scope, given a date with the scope of YEARS', () => {
      const dateObject = new Date(2012, 1, 29)
      const startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.YEARS)
      startDate.should.eql(new Date(2022, 1, 28))
    })


    it('gets the date of the next scope, given a date with the scope of MONTHS', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.MONTHS)
      startDate.should.eql(new Date(2015, 3, 20))
    })


    it('gets the closest date of the next scope, given a date with the scope of MONTHS', () => {
      const dateObject = new Date(2012, 1, 29)
      const startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.MONTHS)
      startDate.should.eql(new Date(2013, 1, 28))
    })


    it('gets the date of the next scope, given a date with the scope of DAYS', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.DAYS)
      startDate.should.eql(new Date(2014, 4, 20))
    })


    it('gets the closest date of the next scope, given a date with the scope of DAYS', () => {
      const dateObject = new Date(2012, 0, 31)
      const startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.DAYS)
      startDate.should.eql(new Date(2012, 1, 29))
    })

  })



  describe('#getDateOfNextDecade', () => {

    it('gets the date of the next decade, given a date', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfNextDecade(dateObject)
      startDate.should.eql(new Date(2024, 3, 20))
    })


    it('gets the closest date of the next decade, given a date', () => {
      const dateObject = new Date(2012, 1, 29)
      const startDate  = calendarUtil.getDateOfNextDecade(dateObject)
      startDate.should.eql(new Date(2022, 1, 28))
    })

  })



  describe('#getDateOfNextYear', () => {

    it('gets the date of the next year, given a date', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfNextYear(dateObject)
      startDate.should.eql(new Date(2015, 3, 20))
    })


    it('gets the closest date of the next year, given a date', () => {
      const dateObject = new Date(2012, 1, 29)
      const startDate  = calendarUtil.getDateOfNextYear(dateObject)
      startDate.should.eql(new Date(2013, 1, 28))
    })

  })



  describe('#getDateOfNextMonth', () => {

    it('gets the date of the next month, given a date', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfNextMonth(dateObject)
      startDate.should.eql(new Date(2014, 4, 20))
    })


    it('gets the closest date of the next month, given a date', () => {
      const dateObject = new Date(2012, 0, 31)
      const startDate  = calendarUtil.getDateOfNextMonth(dateObject)
      startDate.should.eql(new Date(2012, 1, 29))
    })

  })





  /////////////////////////////
  // PREVIOUS RELATIVE DATES //
  /////////////////////////////



  describe('#getDateOfPreviousScope', () => {

    it('gets the date of the previous scope, given a date with the scope of YEARS', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.YEARS)
      startDate.should.eql(new Date(2004, 3, 20))
    })


    it('gets the closest date of the previous scope, given a date with the scope of YEARS', () => {
      const dateObject = new Date(2012, 1, 29)
      const startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.YEARS)
      startDate.should.eql(new Date(2002, 1, 28))
    })


    it('gets the date of the previous scope, given a date with the scope of MONTHS', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.MONTHS)
      startDate.should.eql(new Date(2013, 3, 20))
    })


    it('gets the closest date of the previous scope, given a date with the scope of MONTHS', () => {
      const dateObject = new Date(2012, 1, 29)
      const startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.MONTHS)
      startDate.should.eql(new Date(2011, 1, 28))
    })


    it('gets the date of the previous scope, given a date with the scope of DAYS', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.DAYS)
      startDate.should.eql(new Date(2014, 2, 20))
    })


    it('gets the closest date of the previous scope, given a date with the scope of DAYS', () => {
      const dateObject = new Date(2012, 2, 31)
      const startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.DAYS)
      startDate.should.eql(new Date(2012, 1, 29))
    })

  })



  describe('#getDateOfPreviousDecade', () => {

    it('gets the date of the previous decade, given a date', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfPreviousDecade(dateObject)
      startDate.should.eql(new Date(2004, 3, 20))
    })


    it('gets the closest date of the previous decade, given a date', () => {
      const dateObject = new Date(2012, 1, 29)
      const startDate  = calendarUtil.getDateOfPreviousDecade(dateObject)
      startDate.should.eql(new Date(2002, 1, 28))
    })

  })



  describe('#getDateOfPreviousYear', () => {

    it('gets the date of the previous year, given a date', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfPreviousYear(dateObject)
      startDate.should.eql(new Date(2013, 3, 20))
    })


    it('gets the closest date of the previous year, given a date', () => {
      const dateObject = new Date(2012, 1, 29)
      const startDate  = calendarUtil.getDateOfPreviousYear(dateObject)
      startDate.should.eql(new Date(2011, 1, 28))
    })

  })



  describe('#getDateOfPreviousMonth', () => {

    it('gets the date of the previous month, given a date', () => {
      const dateObject = new Date(2014, 3, 20)
      const startDate  = calendarUtil.getDateOfPreviousMonth(dateObject)
      startDate.should.eql(new Date(2014, 2, 20))
    })


    it('gets the closest date of the previous month, given a date', () => {
      const dateObject = new Date(2012, 2, 31)
      const startDate  = calendarUtil.getDateOfPreviousMonth(dateObject)
      startDate.should.eql(new Date(2012, 1, 29))
    })

  })





  /////////////////
  // START DATES //
  /////////////////



  describe('#getStartDateOfMonth', () => {

    it('gets the start date of a month, given a date', () => {

      calendarUtil.getStartDateOfMonth(new Date(2014, 3, 20))
        .should.eql(new Date(2014, 3, 1))

      calendarUtil.getStartDateOfMonth(new Date(2014, 3, 20).getTime())
        .should.eql(new Date(2014, 3, 1))

    })

  })



  describe('#getStartDateOfMonthInNextScope', () => {

    it('gets the start date of a month in the next scope, with the scope as DAYS', () => {

      const scope = SCOPE.DAYS

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20), scope)
        .should.eql(new Date(2014, 4, 1))

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20).getTime(), scope)
        .should.eql(new Date(2014, 4, 1))

    })


    it('gets the start date of a month in the next scope, with the scope as MONTHS', () => {

      const scope = SCOPE.MONTHS

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20), scope)
        .should.eql(new Date(2015, 3, 1))

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20).getTime(), scope)
        .should.eql(new Date(2015, 3, 1))

    })


    it('gets the start date of a month in the next scope, with the scope as YEARS', () => {

      const scope = SCOPE.YEARS

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20), scope)
        .should.eql(new Date(2024, 3, 1))

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20).getTime(), scope)
        .should.eql(new Date(2024, 3, 1))

    })

  })



  describe('#getStartDateOfMonthInPreviousScope', () => {

    it('gets the start date of a month in the next scope, with the scope as DAYS', () => {

      const scope = SCOPE.DAYS

      calendarUtil.getStartDateOfMonthInPreviousScope(new Date(2014, 3, 20), scope)
        .should.eql(new Date(2014, 2, 1))

      calendarUtil.getStartDateOfMonthInPreviousScope(new Date(2014, 3, 20).getTime(), scope)
        .should.eql(new Date(2014, 2, 1))

    })


    it('gets the start date of a month in the next scope, with the scope as MONTHS', () => {

      const scope = SCOPE.MONTHS

      calendarUtil.getStartDateOfMonthInPreviousScope(new Date(2014, 3, 20), scope)
        .should.eql(new Date(2013, 3, 1))

      calendarUtil.getStartDateOfMonthInPreviousScope(new Date(2014, 3, 20).getTime(), scope)
        .should.eql(new Date(2013, 3, 1))

    })


    it('gets the start date of a month in the next scope, with the scope as YEARS', () => {

      const scope = SCOPE.YEARS

      calendarUtil.getStartDateOfMonthInPreviousScope(new Date(2014, 3, 20), scope)
        .should.eql(new Date(2004, 3, 1))

      calendarUtil.getStartDateOfMonthInPreviousScope(new Date(2014, 3, 20).getTime(), scope)
        .should.eql(new Date(2004, 3, 1))

    })

  })





  ////////////
  // LABELS //
  ////////////



  describe('#getLabel', () => {

    it('gets the label for a date given the scope of YEARS', () => {
      const label = calendarUtil.getLabel(
        new Date(2014, 3, 20), SCOPE.YEARS, LANGUAGE.ENGLISH
      )
      label.should.eql('2014')
    })


    it('gets the label for a date given the scope of MONTHS', () => {
      const label = calendarUtil.getLabel(
        new Date(2014, 3, 20), SCOPE.MONTHS, LANGUAGE.ENGLISH
      )
      label.should.eql(MONTH.SHORT[LANGUAGE.ENGLISH][3])
    })


    it('gets the label for a date given the scope of DAYS', () => {
      const label = calendarUtil.getLabel(
        new Date(2014, 3, 20), SCOPE.DAYS, LANGUAGE.ENGLISH
      )
      label.should.eql('20')
    })

  })





  //////////////
  // CHECKERS //
  //////////////



  describe('#isDisabled', () => {

    const disabled = {
      dates      : [new Date(2017, 3, 20)],
      days       : [1, 4],
      exceptions : [new Date(2017, 4, 19)],
    }

    const options = {
      disabled,
      maximum : new Date(2017, 11, 5),
      minimum : new Date(2017, 0, 3),
      scope   : SCOPE.DAYS,
    }


    it('returns `true` if the date is included in the disabled days', () => {

      const dateObject = new Date(2017, 4, 22)

      calendarUtil
        .isDisabled(dateObject, options)
        .should.eql(true)

    })


    it('returns `true` if the date is included in the disabled dates', () => {

      const dateObject = new Date(2017, 3, 20)

      calendarUtil
        .isDisabled(dateObject, options)
        .should.eql(true)

    })


    it('returns `true` if the date is before the minimum', () => {

      const dateObject = new Date(2016, 3, 20)

      // Create the spy to ensure the date is correctly being checked
      const isBeforeSpy = sinon.spy(dateUtil, 'isBefore')

      calendarUtil
        .isDisabled(dateObject, options)
        .should.eql(true)

      // Ensure the spy was called as expected
      isBeforeSpy.callCount.should.eql(1)
      isBeforeSpy.lastCall.args.should.eql([
        dateObject,
        options.minimum,
        options.scope,
      ])

      // Clean up
      isBeforeSpy.restore()

    })


    it('returns `true` if the date is after the maximum', () => {

      const dateObject = new Date(2018, 3, 20)

      // Create the spy to ensure the date is correctly being checked
      const isAfterSpy = sinon.spy(dateUtil, 'isAfter')

      calendarUtil
        .isDisabled(dateObject, options)
        .should.eql(true)

      // Ensure the spy was called as expected
      isAfterSpy.callCount.should.eql(1)
      isAfterSpy.lastCall.args.should.eql([
        dateObject,
        options.maximum,
        options.scope,
      ])

      // Clean up
      isAfterSpy.restore()

    })


    it(
      'returns `false` if the date is included in the disabled exceptions',
    () => {

      const dateObject = new Date(2017, 4, 19)

      calendarUtil
        .isDisabled(dateObject, options)
        .should.eql(false)

    })


    it(
      'returns `false` if the date is ' +
      'not included in the disabled dates, days, and exceptions ' +
      'nor is it before the minimum or after the maximum',
    () => {

      const dateObject = new Date(2017, 4, 2)

      calendarUtil
        .isDisabled(dateObject, options)
        .should.eql(false)

    })

  })


})
