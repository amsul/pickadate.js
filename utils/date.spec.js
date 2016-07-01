const LANGUAGE = require('constants/language')

let language   = require('language')
let dateUtil   = require('utils/date')



describe('/dateUtil', () => {


  ////////////
  // CREATE //
  ////////////



  describe('#create', () => {

    it('creates a new date from an epoch timestamp', () => {

      let expectedDate = new Date()
      let epochTime    = expectedDate.getTime()

      let actualDate = dateUtil.create(epochTime)
      actualDate.should.be.instanceOf(Date)
      actualDate.getTime().should.eql(epochTime)

    })


    it('does nothing if a date object is passed in', () => {

      let expectedDate = new Date()

      let actualDate = dateUtil.create(expectedDate)
      actualDate.should.be.exactly(expectedDate)

    })

  })





  ////////////
  // MONTHS //
  ////////////



  describe('#getFullMonthNames', () => {

    it('gets a list of the full month names', () => {

      let fullMonthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      fullMonthNames.should.eql(dateUtil.getFullMonthNames())

    })


    it('gets a list of the full month names for the correct language', () => {

      // Grab the original language
      let originalLanguage = language.current

      // Set the language to French
      language.current = LANGUAGE.FRENCH

      let fullMonthNames = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
      ]

      fullMonthNames.should.eql(dateUtil.getFullMonthNames())

      // Reset the original language
      language.current = originalLanguage

    })

  })



  describe('#getShortMonthNames', () => {

    it('gets a list of the short month names', () => {

      let shortMonthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]

      shortMonthNames.should.eql(dateUtil.getShortMonthNames())

    })


    it('gets a list of the short month names for the correct language', () => {

      // Grab the original language
      let originalLanguage = language.current

      // Set the language to French
      language.current = LANGUAGE.FRENCH

      let shortMonthNames = [
        'Jan',
        'Fev',
        'Mar',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Aou',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]

      shortMonthNames.should.eql(dateUtil.getShortMonthNames())

      // Reset the original language
      language.current = originalLanguage

    })

  })



  describe('#getFullMonthName', () => {

    it('gets the full name of a specific month', () => {
      let fullMonthName = 'June'
      fullMonthName.should.eql(dateUtil.getFullMonthName(5))
    })


    it('gets the full name of a specific month for the correct language', () => {

      // Grab the original language
      let originalLanguage = language.current

      // Set the language to French
      language.current = LANGUAGE.FRENCH

      let fullMonthName = 'Juin'

      fullMonthName.should.eql(dateUtil.getFullMonthName(5))

      // Reset the original language
      language.current = originalLanguage

    })

  })



  describe('#getShortMonthName', () => {

    it('gets the short name of a specific month', () => {
      let shortMonthName = 'Aug'
      shortMonthName.should.eql(dateUtil.getShortMonthName(7))
    })


    it('gets the short name of a specific month for the correct language', () => {

      // Grab the original language
      let originalLanguage = language.current

      // Set the language to French
      language.current = LANGUAGE.FRENCH

      let fullMonthName = 'Aou'

      fullMonthName.should.eql(dateUtil.getShortMonthName(7))

      // Reset the original language
      language.current = originalLanguage

    })

  })





  //////////
  // DAYS //
  //////////



  describe('#getFullDayNames', () => {

    it('gets a list of the full day names', () => {

      let fullDayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ]

      fullDayNames.should.eql(dateUtil.getFullDayNames())

    })


    it('gets a list of the full day names for the correct language', () => {

      // Grab the original language
      let originalLanguage = language.current

      // Set the language to French
      language.current = LANGUAGE.FRENCH

      let fullDayNames = [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
      ]

      fullDayNames.should.eql(dateUtil.getFullDayNames())

      // Reset the original language
      language.current = originalLanguage

    })

  })



  describe('#getShortDayNames', () => {

    it('gets a list of the short day names', () => {

      let shortDayNames = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
      ]

      shortDayNames.should.eql(dateUtil.getShortDayNames())

    })


    it('gets a list of the short day names for the correct language', () => {

      // Grab the original language
      let originalLanguage = language.current

      // Set the language to French
      language.current = LANGUAGE.FRENCH

      let shortDayNames = [
        'Dim',
        'Lun',
        'Mar',
        'Mer',
        'Jeu',
        'Ven',
        'Sam',
      ]

      shortDayNames.should.eql(dateUtil.getShortDayNames())

      // Reset the original language
      language.current = originalLanguage

    })

  })



  describe('#getFullDayName', () => {

    it('gets the full name of a specific day', () => {
      let fullDayName = 'Friday'
      fullDayName.should.eql(dateUtil.getFullDayName(5))
    })


    it('gets the full name of a specific day for the correct language', () => {

      // Grab the original language
      let originalLanguage = language.current

      // Set the language to French
      language.current = LANGUAGE.FRENCH

      let fullDayName = 'Vendredi'

      fullDayName.should.eql(dateUtil.getFullDayName(5))

      // Reset the original language
      language.current = originalLanguage

    })

  })



  describe('#getShortDayName', () => {

    it('gets the short name of a specific day', () => {
      let shortDayName = 'Fri'
      shortDayName.should.eql(dateUtil.getShortDayName(5))
    })


    it('gets the short name of a specific day for the correct language', () => {

      // Grab the original language
      let originalLanguage = language.current

      // Set the language to French
      language.current = LANGUAGE.FRENCH

      let shortDayName = 'Ven'

      shortDayName.should.eql(dateUtil.getShortDayName(5))

      // Reset the original language
      language.current = originalLanguage

    })

  })





  //////////////
  // CHECKERS //
  //////////////



  describe('#isSameDate', () => {

    it('returns `true` if two dates fall on the same date', () => {

      dateUtil.isSameDate(new Date(), new Date()).should.eql(true)
      dateUtil.isSameDate(new Date(2015, 6, 28), new Date(2015, 6, 28)).should.eql(true)
      dateUtil.isSameDate(new Date(2015, 6, 28), new Date(2015, 6, 28).getTime()).should.eql(true)
      dateUtil.isSameDate(new Date().getTime(), new Date().getTime()).should.eql(true)

    })


    it('returns `false` if two dates do not fall on the same date', () => {

      dateUtil.isSameDate(new Date(), new Date(2015, 6, 28)).should.eql(false)
      dateUtil.isSameDate(new Date(2015, 6, 27), new Date(2015, 6, 28)).should.eql(false)
      dateUtil.isSameDate(new Date(), new Date(2015, 6, 28).getTime()).should.eql(false)
      dateUtil.isSameDate(new Date().getTime(), new Date(2015, 6, 28).getTime()).should.eql(false)

    })


    it('returns `false` if invalid dates are passed', () => {

      dateUtil.isSameDate({}, new Date(2015, 6, 28)).should.eql(false)
      dateUtil.isSameDate(new Date(2015, 6, 28), {}).should.eql(false)

    })

  })



  describe('#isSameMonth', () => {

    it('returns `true` if two dates fall on the same month', () => {

      dateUtil.isSameMonth(new Date(2015, 6, 11), new Date(2015, 6, 28)).should.eql(true)
      dateUtil.isSameMonth(new Date(2015, 6, 28), new Date(2015, 6, 11).getTime()).should.eql(true)
      dateUtil.isSameMonth(new Date().getTime(), new Date().getTime()).should.eql(true)

    })


    it('returns `false` if two dates do not fall on the same month', () => {

      dateUtil.isSameMonth(new Date(), new Date(2015, 6, 28)).should.eql(false)
      dateUtil.isSameMonth(new Date(2015, 5, 28), new Date(2015, 6, 28)).should.eql(false)
      dateUtil.isSameMonth(new Date(2013, 6, 28), new Date(2015, 6, 28)).should.eql(false)
      dateUtil.isSameMonth(new Date(), new Date(2015, 6, 28).getTime()).should.eql(false)
      dateUtil.isSameMonth(new Date().getTime(), new Date(2015, 6, 28).getTime()).should.eql(false)

    })


    it('returns `false` if invalid dates are passed', () => {

      dateUtil.isSameMonth({}, new Date(2015, 6, 28)).should.eql(false)
      dateUtil.isSameMonth(new Date(2015, 6, 28), {}).should.eql(false)

    })

  })



  describe('#isSameYear', () => {

    it('returns `true` if two dates fall on the same year', () => {

      dateUtil.isSameYear(new Date(2015, 10, 11), new Date(2015, 6, 28)).should.eql(true)
      dateUtil.isSameYear(new Date(2015, 6, 28), new Date(2015, 2, 11).getTime()).should.eql(true)
      dateUtil.isSameYear(new Date().getTime(), new Date().getTime()).should.eql(true)

    })


    it('returns `false` if two dates do not fall on the same year', () => {

      dateUtil.isSameYear(new Date(), new Date(2015, 6, 28)).should.eql(false)
      dateUtil.isSameYear(new Date(2016, 6, 28), new Date(2015, 3, 28)).should.eql(false)
      dateUtil.isSameYear(new Date(2013, 6, 28), new Date(2015, 6, 28)).should.eql(false)
      dateUtil.isSameYear(new Date(), new Date(2015, 6, 28).getTime()).should.eql(false)
      dateUtil.isSameYear(new Date().getTime(), new Date(2015, 6, 28).getTime()).should.eql(false)

    })


    it('returns `false` if invalid dates are passed', () => {

      dateUtil.isSameYear({}, new Date(2015, 6, 28)).should.eql(false)
      dateUtil.isSameYear(new Date(2015, 6, 28), {}).should.eql(false)

    })

  })


})