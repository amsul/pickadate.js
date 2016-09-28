const DAY        = require('constants/day')
const LANGUAGE   = require('constants/language')
const MONTH      = require('constants/month')
const SCOPE      = require('constants/scope')

let calendarUtil = require('utils/calendar')



describe('/calendarUtil', () => {


  //////////////
  // WEEKDAYS //
  //////////////



  describe('#getWeekdays', () => {

    it('gets the short weekdays', () => {

      let language = LANGUAGE.ENGLISH
      let weekdays = calendarUtil.getWeekdays(language)

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

    it('gets the dates for rows of years, with the state scope of YEARS ', () => {

      let year  = 2014
      let month = 3

      let decadeStartYear = 2010
      let expectedDatesForRows = [
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

      let scope = SCOPE.YEARS
      let view  = new Date(year, month, 20)

      let state = { scope, view }

      let datesForRows = calendarUtil.getDatesForRows(state.view, state.scope)

      datesForRows.should.eql(expectedDatesForRows)

    })


    it('gets the dates for rows of months, with the state scope of MONTHS', () => {

      let year = 2014

      let expectedDatesForRows = [
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

      let scope = SCOPE.MONTHS
      let view  = new Date(year, 3, 20)

      let state = { scope, view }

      let datesForRows = calendarUtil.getDatesForRows(state.view, state.scope)

      datesForRows.should.eql(expectedDatesForRows)

    })


    it('gets the dates for rows of weeks, with the state scope of DAYS', () => {

      let year  = 2014
      let month = 3

      let expectedDatesForRows = [
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

      let scope = SCOPE.DAYS
      let view  = new Date(year, month, 20)

      let state = { scope, view }

      let datesForRows = calendarUtil.getDatesForRows(state.view, state.scope)

      datesForRows.should.eql(expectedDatesForRows)

    })

  })



  describe('#getDatesForRowsOfYears', () => {

    it('gets the dates for rows of years, given a year and month', () => {

      let year  = 2014
      let month = 3

      let decadeStartYear = 2010
      let expectedDatesForRowsOfYears = [
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

      let datesForRowsOfYears = calendarUtil.getDatesForRowsOfYears(year, month)

      datesForRowsOfYears.should.eql(expectedDatesForRowsOfYears)

    })

  })



  describe('#getDatesForRowsOfMonths', () => {

    it('gets the dates for rows of months, given a year', () => {

      let year = 2014

      let expectedDatesForRowsOfMonths = [
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

      let datesForRowsOfMonths = calendarUtil.getDatesForRowsOfMonths(year)

      datesForRowsOfMonths.should.eql(expectedDatesForRowsOfMonths)

    })

  })



  describe('#getDatesForRowsOfWeeks', () => {

    it('gets the dates for rows of weeks, given a year and month', () => {

      let year  = 2014
      let month = 3

      let expectedDatesForRowsOfWeeks = [
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

      let datesForRowsOfWeeks = calendarUtil.getDatesForRowsOfWeeks(year, month)

      datesForRowsOfWeeks.should.eql(expectedDatesForRowsOfWeeks)

    })

  })



  describe('#getDatesForWeek', () => {

    it('gets the dates for a week, give a year, month, and week index', () => {

      let year  = 2014
      let month = 4

      for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {

        let expectedDatesForWeek = [
          new Date(year, month, -3 + (weekIndex * 7)),
          new Date(year, month, -2 + (weekIndex * 7)),
          new Date(year, month, -1 + (weekIndex * 7)),
          new Date(year, month, 0 + (weekIndex * 7)),
          new Date(year, month, 1 + (weekIndex * 7)),
          new Date(year, month, 2 + (weekIndex * 7)),
          new Date(year, month, 3 + (weekIndex * 7)),
        ]

        let datesForWeek = calendarUtil.getDatesForWeek(year, month, weekIndex)

        datesForWeek.should.eql(expectedDatesForWeek)

      }

    })

  })





  /////////////////////////
  // NEXT RELATIVE DATES //
  /////////////////////////



  describe('#getDateOfNextScope', () => {

    it('gets the date of the next scope, given a date with the scope of YEARS', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.YEARS)
      startDate.should.eql(new Date(2024, 3, 20))
    })


    it('gets the closest date of the next scope, given a date with the scope of YEARS', () => {
      let dateObject = new Date(2012, 1, 29)
      let startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.YEARS)
      startDate.should.eql(new Date(2022, 1, 28))
    })


    it('gets the date of the next scope, given a date with the scope of MONTHS', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.MONTHS)
      startDate.should.eql(new Date(2015, 3, 20))
    })


    it('gets the closest date of the next scope, given a date with the scope of MONTHS', () => {
      let dateObject = new Date(2012, 1, 29)
      let startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.MONTHS)
      startDate.should.eql(new Date(2013, 1, 28))
    })


    it('gets the date of the next scope, given a date with the scope of DAYS', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.DAYS)
      startDate.should.eql(new Date(2014, 4, 20))
    })


    it('gets the closest date of the next scope, given a date with the scope of DAYS', () => {
      let dateObject = new Date(2012, 0, 31)
      let startDate  = calendarUtil.getDateOfNextScope(dateObject, SCOPE.DAYS)
      startDate.should.eql(new Date(2012, 1, 29))
    })

  })



  describe('#getDateOfNextDecade', () => {

    it('gets the date of the next decade, given a date', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfNextDecade(dateObject)
      startDate.should.eql(new Date(2024, 3, 20))
    })


    it('gets the closest date of the next decade, given a date', () => {
      let dateObject = new Date(2012, 1, 29)
      let startDate  = calendarUtil.getDateOfNextDecade(dateObject)
      startDate.should.eql(new Date(2022, 1, 28))
    })

  })



  describe('#getDateOfNextYear', () => {

    it('gets the date of the next year, given a date', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfNextYear(dateObject)
      startDate.should.eql(new Date(2015, 3, 20))
    })


    it('gets the closest date of the next year, given a date', () => {
      let dateObject = new Date(2012, 1, 29)
      let startDate  = calendarUtil.getDateOfNextYear(dateObject)
      startDate.should.eql(new Date(2013, 1, 28))
    })

  })



  describe('#getDateOfNextMonth', () => {

    it('gets the date of the next month, given a date', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfNextMonth(dateObject)
      startDate.should.eql(new Date(2014, 4, 20))
    })


    it('gets the closest date of the next month, given a date', () => {
      let dateObject = new Date(2012, 0, 31)
      let startDate  = calendarUtil.getDateOfNextMonth(dateObject)
      startDate.should.eql(new Date(2012, 1, 29))
    })

  })





  /////////////////////////////
  // PREVIOUS RELATIVE DATES //
  /////////////////////////////



  describe('#getDateOfPreviousScope', () => {

    it('gets the date of the previous scope, given a date with the scope of YEARS', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.YEARS)
      startDate.should.eql(new Date(2004, 3, 20))
    })


    it('gets the closest date of the previous scope, given a date with the scope of YEARS', () => {
      let dateObject = new Date(2012, 1, 29)
      let startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.YEARS)
      startDate.should.eql(new Date(2002, 1, 28))
    })


    it('gets the date of the previous scope, given a date with the scope of MONTHS', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.MONTHS)
      startDate.should.eql(new Date(2013, 3, 20))
    })


    it('gets the closest date of the previous scope, given a date with the scope of MONTHS', () => {
      let dateObject = new Date(2012, 1, 29)
      let startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.MONTHS)
      startDate.should.eql(new Date(2011, 1, 28))
    })


    it('gets the date of the previous scope, given a date with the scope of DAYS', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.DAYS)
      startDate.should.eql(new Date(2014, 2, 20))
    })


    it('gets the closest date of the previous scope, given a date with the scope of DAYS', () => {
      let dateObject = new Date(2012, 2, 31)
      let startDate  = calendarUtil.getDateOfPreviousScope(dateObject, SCOPE.DAYS)
      startDate.should.eql(new Date(2012, 1, 29))
    })

  })



  describe('#getDateOfPreviousDecade', () => {

    it('gets the date of the previous decade, given a date', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfPreviousDecade(dateObject)
      startDate.should.eql(new Date(2004, 3, 20))
    })


    it('gets the closest date of the previous decade, given a date', () => {
      let dateObject = new Date(2012, 1, 29)
      let startDate  = calendarUtil.getDateOfPreviousDecade(dateObject)
      startDate.should.eql(new Date(2002, 1, 28))
    })

  })



  describe('#getDateOfPreviousYear', () => {

    it('gets the date of the previous year, given a date', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfPreviousYear(dateObject)
      startDate.should.eql(new Date(2013, 3, 20))
    })


    it('gets the closest date of the previous year, given a date', () => {
      let dateObject = new Date(2012, 1, 29)
      let startDate  = calendarUtil.getDateOfPreviousYear(dateObject)
      startDate.should.eql(new Date(2011, 1, 28))
    })

  })



  describe('#getDateOfPreviousMonth', () => {

    it('gets the date of the previous month, given a date', () => {
      let dateObject = new Date(2014, 3, 20)
      let startDate  = calendarUtil.getDateOfPreviousMonth(dateObject)
      startDate.should.eql(new Date(2014, 2, 20))
    })


    it('gets the closest date of the previous month, given a date', () => {
      let dateObject = new Date(2012, 2, 31)
      let startDate  = calendarUtil.getDateOfPreviousMonth(dateObject)
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

      let scope = SCOPE.DAYS

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20), scope)
        .should.eql(new Date(2014, 4, 1))

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20).getTime(), scope)
        .should.eql(new Date(2014, 4, 1))

    })


    it('gets the start date of a month in the next scope, with the scope as MONTHS', () => {

      let scope = SCOPE.MONTHS

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20), scope)
        .should.eql(new Date(2015, 3, 1))

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20).getTime(), scope)
        .should.eql(new Date(2015, 3, 1))

    })


    it('gets the start date of a month in the next scope, with the scope as YEARS', () => {

      let scope = SCOPE.YEARS

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20), scope)
        .should.eql(new Date(2024, 3, 1))

      calendarUtil.getStartDateOfMonthInNextScope(new Date(2014, 3, 20).getTime(), scope)
        .should.eql(new Date(2024, 3, 1))

    })

  })



  describe('#getStartDateOfMonthInPreviousScope', () => {

    it('gets the start date of a month in the next scope, with the scope as DAYS', () => {

      let scope = SCOPE.DAYS

      calendarUtil.getStartDateOfMonthInPreviousScope(new Date(2014, 3, 20), scope)
        .should.eql(new Date(2014, 2, 1))

      calendarUtil.getStartDateOfMonthInPreviousScope(new Date(2014, 3, 20).getTime(), scope)
        .should.eql(new Date(2014, 2, 1))

    })


    it('gets the start date of a month in the next scope, with the scope as MONTHS', () => {

      let scope = SCOPE.MONTHS

      calendarUtil.getStartDateOfMonthInPreviousScope(new Date(2014, 3, 20), scope)
        .should.eql(new Date(2013, 3, 1))

      calendarUtil.getStartDateOfMonthInPreviousScope(new Date(2014, 3, 20).getTime(), scope)
        .should.eql(new Date(2013, 3, 1))

    })


    it('gets the start date of a month in the next scope, with the scope as YEARS', () => {

      let scope = SCOPE.YEARS

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
      let label = calendarUtil.getLabel(
        new Date(2014, 3, 20), SCOPE.YEARS, LANGUAGE.ENGLISH
      )
      label.should.eql('2014')
    })


    it('gets the label for a date given the scope of MONTHS', () => {
      let label = calendarUtil.getLabel(
        new Date(2014, 3, 20), SCOPE.MONTHS, LANGUAGE.ENGLISH
      )
      label.should.eql(MONTH.SHORT[LANGUAGE.ENGLISH][3])
    })


    it('gets the label for a date given the scope of DAYS', () => {
      let label = calendarUtil.getLabel(
        new Date(2014, 3, 20), SCOPE.DAYS, LANGUAGE.ENGLISH
      )
      label.should.eql('20')
    })

  })


})