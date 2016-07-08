let sinon      = require('sinon')

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





  ////////////////////
  // FORMAT & PARSE //
  ////////////////////



  describe('#format', () => {

    it('formats a date object with a given template', () => {

      let dateObject = new Date(2014, 3, 2)

      dateUtil.format(dateObject, 'yyyy-mm-dd').should.eql('2014-04-02')
      dateUtil.format(dateObject, 'yyyy-m-d').should.eql('2014-4-2')
      dateUtil.format(dateObject, 'dddd, d mmm, yyyy').should.eql('Wednesday, 2 Apr, 2014')
      dateUtil.format(dateObject, 'ddd, dd mmmm, yyyy').should.eql('We, 02 April, 2014')

    })


    it('formats a date object with a given template that has escaped characters', () => {

      let dateObject = new Date(2014, 3, 2)

      dateUtil.format(dateObject, 'escaped chars [yyyy] mmmm dd')
        .should.eql('escaped chars yyyy April 02')

      dateUtil.format(dateObject, 'escaped chars yyyy mmmm [dd]')
        .should.eql('escaped chars 2014 April dd')

      dateUtil.format(dateObject, '[mmm so yummay! @ ]yyyy mm dd')
        .should.eql('mmm so yummay! @ 2014 04 02')

      dateUtil.format(dateObject, '[mmm] so yummay! @ yyyy mm dd')
        .should.eql('mmm so yummay! @ 2014 04 02')

      dateUtil.format(dateObject, '[yep mmm yummay]! @ yyyy mm dd')
        .should.eql('yep mmm yummay! @ 2014 04 02')

    })

  })



  describe('#parse', () => {

    it('parses a date string with a given template', () => {

      dateUtil.parse('2014-04-20', 'yyyy-mm-dd')
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('2014-4-20', 'yyyy-m-d')
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('20 April, 2014', 'd mmmm, yyyy')
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('20 Apr, 2014', 'dd mmm, yyyy')
        .should.eql(new Date(2014, 3, 20))

    })


    it('parses a date string with a given template that has escaped characters', () => {

      dateUtil.parse('yyyy 2014-04-20', '[yyyy] yyyy-mm-dd')
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('escape the d! 2014-4-20', 'escape the [d]! yyyy-m-d')
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('20 April, 2014 escape mm in the middle', 'd mmmm, yyyy [escape mm in the middle]')
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('escape 20 Apr all the things! m ddd, 2014', '[escape] dd mmm [all] [the things!] [m ddd], yyyy')
        .should.eql(new Date(2014, 3, 20))

    })


    it('returns `null` if a valid year, month, and date are not found', () => {

      let errorStub = sinon.stub(console, 'error')

      true.should.eql(null == dateUtil.parse('lol-04-20', 'yyyy-mm-dd'))
      errorStub.callCount.should.eql(1)
      errorStub.lastCall.args.length.should.eql(4)
      errorStub.lastCall.args[0].should.match(/Unable to parse.+ Expected to match/)
      errorStub.lastCall.args[1].should.eql('lol-04-20')
      errorStub.lastCall.args[2].should.eql('yyyy')
      errorStub.lastCall.args[3].should.eql(0)

      true.should.eql(null == dateUtil.parse('2014-wut-20', 'yyyy-m-d'))
      errorStub.callCount.should.eql(2)
      errorStub.lastCall.args.length.should.eql(4)
      errorStub.lastCall.args[0].should.match(/Unable to parse.+ Expected to match/)
      errorStub.lastCall.args[1].should.eql('2014-wut-20')
      errorStub.lastCall.args[2].should.eql('m')
      errorStub.lastCall.args[3].should.eql(5)

      true.should.eql(null == dateUtil.parse('? April, 2014', 'd mmmm, yyyy'))
      errorStub.callCount.should.eql(3)
      errorStub.lastCall.args.length.should.eql(4)
      errorStub.lastCall.args[0].should.match(/Unable to parse.+ Expected to match/)
      errorStub.lastCall.args[1].should.eql('? April, 2014')
      errorStub.lastCall.args[2].should.eql('d')
      errorStub.lastCall.args[3].should.eql(0)

      true.should.eql(null == dateUtil.parse('20 Apr, ✌️', 'dd mmm, yyyy'))
      errorStub.callCount.should.eql(4)
      errorStub.lastCall.args.length.should.eql(4)
      errorStub.lastCall.args[0].should.match(/Unable to parse.+ Expected to match/)
      errorStub.lastCall.args[1].should.eql('20 Apr, ✌️')
      errorStub.lastCall.args[2].should.eql('yyyy')
      errorStub.lastCall.args[3].should.eql(8)

      true.should.eql(null == dateUtil.parse('20 4, ✌️', 'd m, yyyy'))
      errorStub.callCount.should.eql(5)
      errorStub.lastCall.args.length.should.eql(4)
      errorStub.lastCall.args[0].should.match(/Unable to parse.+ Expected to match/)
      errorStub.lastCall.args[1].should.eql('20 4, ✌️')
      errorStub.lastCall.args[2].should.eql('yyyy')
      errorStub.lastCall.args[3].should.eql(6)

      errorStub.restore()


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
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
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
      let shortDayName = 'Fr'
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