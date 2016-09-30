let sinon      = require('sinon')

const LANGUAGE = require('constants/language')

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



  describe('#createInMonth', () => {

    it('creates a date clamped in a month', () => {

      dateUtil.createInMonth(2013, 2, 31)
        .should.eql(new Date(2013, 2, 31))

      dateUtil.createInMonth(2013, 1, 31)
        .should.eql(new Date(2013, 1, 28))

    })

  })





  ////////////////////
  // FORMAT & PARSE //
  ////////////////////



  describe('#format', () => {

    it('formats a date object with a given template', () => {

      let dateObject = new Date(2014, 3, 2)

      dateUtil.format(dateObject, 'YYYY-MM-DD', LANGUAGE.ENGLISH)
        .should.eql('2014-04-02')

      dateUtil.format(dateObject, 'YYYY-M-D', LANGUAGE.ENGLISH)
        .should.eql('2014-4-2')

      dateUtil.format(dateObject, 'DDDD, D MMM, YYYY', LANGUAGE.ENGLISH)
        .should.eql('Wednesday, 2 Apr, 2014')

      dateUtil.format(dateObject, 'DDD, DD MMMM, YYYY', LANGUAGE.ENGLISH)
        .should.eql('We, 02 April, 2014')

    })


    it('formats a date object with a given template that has escaped characters', () => {

      let dateObject = new Date(2014, 3, 2)

      dateUtil.format(dateObject, 'ESCAPED CHARS [YYYY] MMMM DD', LANGUAGE.ENGLISH)
        .should.eql('ESCAPED CHARS YYYY April 02')

      dateUtil.format(dateObject, 'ESCAPED CHARS YYYY MMMM [DD]', LANGUAGE.ENGLISH)
        .should.eql('ESCAPED CHARS 2014 April DD')

      dateUtil.format(dateObject, '[MMM SO YUMMAY! @ ]YYYY MM DD', LANGUAGE.ENGLISH)
        .should.eql('MMM SO YUMMAY! @ 2014 04 02')

      dateUtil.format(dateObject, '[MMM] SO YUMMAY! @ YYYY MM DD', LANGUAGE.ENGLISH)
        .should.eql('MMM SO YUMMAY! @ 2014 04 02')

      dateUtil.format(dateObject, '[YEP MMM YUMMAY]! @ YYYY MM DD', LANGUAGE.ENGLISH)
        .should.eql('YEP MMM YUMMAY! @ 2014 04 02')

    })


    describe('(HOOK_FORMATTER.D)', () => {
      it('formats a date object as the date', () => {
        dateUtil.format(new Date(2014, 3, 2), 'D', LANGUAGE.ENGLISH).should.eql('2')
        dateUtil.format(new Date(2014, 3, 17), 'D', LANGUAGE.ENGLISH).should.eql('17')
      })
    })


    describe('(HOOK_FORMATTER.DD)', () => {
      it('formats a date object as the padded date', () => {
        dateUtil.format(new Date(2014, 3, 2), 'DD', LANGUAGE.ENGLISH).should.eql('02')
        dateUtil.format(new Date(2014, 3, 17), 'DD', LANGUAGE.ENGLISH).should.eql('17')
      })
    })


    describe('(HOOK_FORMATTER.DDD)', () => {
      it('formats a date object as the short named date', () => {
        dateUtil.format(new Date(2014, 3, 2), 'DDD', LANGUAGE.ENGLISH).should.eql('We')
        dateUtil.format(new Date(2014, 3, 17), 'DDD', LANGUAGE.ENGLISH).should.eql('Th')
      })
    })


    describe('(HOOK_FORMATTER.DDDD)', () => {
      it('formats a date object as the full named date', () => {
        dateUtil.format(new Date(2014, 3, 2), 'DDDD', LANGUAGE.ENGLISH).should.eql('Wednesday')
        dateUtil.format(new Date(2014, 3, 17), 'DDDD', LANGUAGE.ENGLISH).should.eql('Thursday')
      })
    })


    describe('(HOOK_FORMATTER.M)', () => {
      it('formats a date object as the date', () => {
        dateUtil.format(new Date(2014, 3, 2), 'M', LANGUAGE.ENGLISH).should.eql('4')
        dateUtil.format(new Date(2014, 11, 17), 'M', LANGUAGE.ENGLISH).should.eql('12')
      })
    })


    describe('(HOOK_FORMATTER.MM)', () => {
      it('formats a date object as the padded date', () => {
        dateUtil.format(new Date(2014, 3, 2), 'MM', LANGUAGE.ENGLISH).should.eql('04')
        dateUtil.format(new Date(2014, 11, 17), 'MM', LANGUAGE.ENGLISH).should.eql('12')
      })
    })


    describe('(HOOK_FORMATTER.MMM)', () => {
      it('formats a date object as the short named date', () => {
        dateUtil.format(new Date(2014, 3, 2), 'MMM', LANGUAGE.ENGLISH).should.eql('Apr')
        dateUtil.format(new Date(2014, 11, 17), 'MMM', LANGUAGE.ENGLISH).should.eql('Dec')
      })
    })


    describe('(HOOK_FORMATTER.MMMM)', () => {
      it('formats a date object as the full named date', () => {
        dateUtil.format(new Date(2014, 3, 2), 'MMMM', LANGUAGE.ENGLISH).should.eql('April')
        dateUtil.format(new Date(2014, 11, 17), 'MMMM', LANGUAGE.ENGLISH).should.eql('December')
      })
    })


    describe('(HOOK_FORMATTER.YYYY)', () => {
      it('formats a date object as the year', () => {
        dateUtil.format(new Date(2014, 3, 2), 'YYYY', LANGUAGE.ENGLISH).should.eql('2014')
        dateUtil.format(new Date(2014, 11, 17), 'YYYY', LANGUAGE.ENGLISH).should.eql('2014')
      })
    })


    describe('(HOOK_FORMATTER.H)', () => {
      it('formats a date object as the 24-hours', () => {
        dateUtil.format(new Date(2014, 3, 2, 4), 'H', LANGUAGE.ENGLISH).should.eql('4')
        dateUtil.format(new Date(2014, 11, 17, 18), 'H', LANGUAGE.ENGLISH).should.eql('18')
        dateUtil.format(new Date(2014, 11, 17, 23), 'H', LANGUAGE.ENGLISH).should.eql('23')
      })
    })


    describe('(HOOK_FORMATTER.HH)', () => {
      it('formats a date object as the padded 24-hours', () => {
        dateUtil.format(new Date(2014, 3, 2, 4), 'HH', LANGUAGE.ENGLISH).should.eql('04')
        dateUtil.format(new Date(2014, 11, 17, 18), 'HH', LANGUAGE.ENGLISH).should.eql('18')
        dateUtil.format(new Date(2014, 11, 17, 23), 'HH', LANGUAGE.ENGLISH).should.eql('23')
      })
    })


    describe('(HOOK_FORMATTER.h)', () => {
      it('formats a date object as the 12-hours', () => {
        dateUtil.format(new Date(2014, 3, 2, 4), 'h', LANGUAGE.ENGLISH).should.eql('4')
        dateUtil.format(new Date(2014, 11, 17, 18), 'h', LANGUAGE.ENGLISH).should.eql('6')
        dateUtil.format(new Date(2014, 11, 17, 23), 'h', LANGUAGE.ENGLISH).should.eql('11')
        dateUtil.format(new Date(2014, 11, 17, 12), 'h', LANGUAGE.ENGLISH).should.eql('12')
      })
    })


    describe('(HOOK_FORMATTER.hh)', () => {
      it('formats a date object as the padded 12-hours', () => {
        dateUtil.format(new Date(2014, 3, 2, 4), 'hh', LANGUAGE.ENGLISH).should.eql('04')
        dateUtil.format(new Date(2014, 11, 17, 18), 'hh', LANGUAGE.ENGLISH).should.eql('06')
        dateUtil.format(new Date(2014, 11, 17, 23), 'hh', LANGUAGE.ENGLISH).should.eql('11')
      })
    })


    describe('(HOOK_FORMATTER.m)', () => {
      it('formats a date object as the minutes', () => {
        dateUtil.format(new Date(2014, 3, 2, 4, 7), 'm', LANGUAGE.ENGLISH).should.eql('7')
        dateUtil.format(new Date(2014, 11, 17, 18, 49), 'm', LANGUAGE.ENGLISH).should.eql('49')
      })
    })


    describe('(HOOK_FORMATTER.mm)', () => {
      it('formats a date object as the padded minutes', () => {
        dateUtil.format(new Date(2014, 3, 2, 4, 7), 'mm', LANGUAGE.ENGLISH).should.eql('07')
        dateUtil.format(new Date(2014, 11, 17, 18, 49), 'mm', LANGUAGE.ENGLISH).should.eql('49')
      })
    })


    describe('(HOOK_FORMATTER.a)', () => {
      it('formats a date object as the lower-case meridiem', () => {
        dateUtil.format(new Date(2014, 3, 2, 4, 7), 'a', LANGUAGE.ENGLISH).should.eql('a.m.')
        dateUtil.format(new Date(2014, 11, 17, 18, 49), 'a', LANGUAGE.ENGLISH).should.eql('p.m.')
      })
    })


    describe('(HOOK_FORMATTER.A)', () => {
      it('formats a date object as the upper-case meridiem', () => {
        dateUtil.format(new Date(2014, 3, 2, 4, 7), 'A', LANGUAGE.ENGLISH).should.eql('AM')
        dateUtil.format(new Date(2014, 11, 17, 18, 49), 'A', LANGUAGE.ENGLISH).should.eql('PM')
      })
    })


    describe('(HOOK_FORMATTER.s)', () => {
      it('formats a date object as the padded seconds', () => {
        dateUtil.format(new Date(2014, 3, 2, 4, 7, 51), 's', LANGUAGE.ENGLISH).should.eql('51')
        dateUtil.format(new Date(2014, 11, 17, 18, 49, 3), 's', LANGUAGE.ENGLISH).should.eql('3')
      })
    })


    describe('(HOOK_FORMATTER.ss)', () => {
      it('formats a date object as the padded seconds', () => {
        dateUtil.format(new Date(2014, 3, 2, 4, 7, 51), 'ss', LANGUAGE.ENGLISH).should.eql('51')
        dateUtil.format(new Date(2014, 11, 17, 18, 49, 3), 'ss', LANGUAGE.ENGLISH).should.eql('03')
      })
    })

  })



  describe('#parse', () => {

    it('parses a date string with a given template', () => {

      dateUtil.parse('2014-04-20', 'YYYY-MM-DD', LANGUAGE.ENGLISH)
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('2014-4-20', 'YYYY-M-D', LANGUAGE.ENGLISH)
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('20 April, 2014', 'D MMMM, YYYY', LANGUAGE.ENGLISH)
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('20 Apr, 2014', 'DD MMM, YYYY', LANGUAGE.ENGLISH)
        .should.eql(new Date(2014, 3, 20))

    })


    it('parses a date string with a given template that has escaped characters', () => {

      dateUtil.parse('YYYY 2014-04-20', '[YYYY] YYYY-MM-DD', LANGUAGE.ENGLISH)
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('ESCAPE THE D! 2014-4-20', 'ESCAPE THE [D]! YYYY-M-D', LANGUAGE.ENGLISH)
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('20 April, 2014 ESCAPE MM IN THE MIDDLE', 'D MMMM, YYYY [ESCAPE MM IN THE MIDDLE]', LANGUAGE.ENGLISH)
        .should.eql(new Date(2014, 3, 20))

      dateUtil.parse('ESCAPE 20 Apr ALL THE THINGS! M DDD, 2014', '[ESCAPE] DD MMM [ALL] [THE THINGS!] [M DDD], YYYY', LANGUAGE.ENGLISH)
        .should.eql(new Date(2014, 3, 20))

    })


    it('returns `null` if a valid year, month, and date are not found', () => {

      let errorStub = sinon.stub(console, 'error')

      true.should.eql(null == dateUtil.parse('lol-04-20', 'YYYY-MM-DD', LANGUAGE.ENGLISH))
      errorStub.callCount.should.eql(1)
      errorStub.lastCall.args.length.should.eql(4)
      errorStub.lastCall.args[0].should.match(/Unable to parse.+ Expected to match/)
      errorStub.lastCall.args[1].should.eql('lol-04-20')
      errorStub.lastCall.args[2].should.eql('YYYY')
      errorStub.lastCall.args[3].should.eql(0)

      true.should.eql(null == dateUtil.parse('2014-wut-20', 'YYYY-M-D', LANGUAGE.ENGLISH))
      errorStub.callCount.should.eql(2)
      errorStub.lastCall.args.length.should.eql(4)
      errorStub.lastCall.args[0].should.match(/Unable to parse.+ Expected to match/)
      errorStub.lastCall.args[1].should.eql('2014-wut-20')
      errorStub.lastCall.args[2].should.eql('M')
      errorStub.lastCall.args[3].should.eql(5)

      true.should.eql(null == dateUtil.parse('? April, 2014', 'D MMMM, YYYY', LANGUAGE.ENGLISH))
      errorStub.callCount.should.eql(3)
      errorStub.lastCall.args.length.should.eql(4)
      errorStub.lastCall.args[0].should.match(/Unable to parse.+ Expected to match/)
      errorStub.lastCall.args[1].should.eql('? April, 2014')
      errorStub.lastCall.args[2].should.eql('D')
      errorStub.lastCall.args[3].should.eql(0)

      true.should.eql(null == dateUtil.parse('20 Apr, ✌️', 'DD MMM, YYYY', LANGUAGE.ENGLISH))
      errorStub.callCount.should.eql(4)
      errorStub.lastCall.args.length.should.eql(4)
      errorStub.lastCall.args[0].should.match(/Unable to parse.+ Expected to match/)
      errorStub.lastCall.args[1].should.eql('20 Apr, ✌️')
      errorStub.lastCall.args[2].should.eql('YYYY')
      errorStub.lastCall.args[3].should.eql(8)

      true.should.eql(null == dateUtil.parse('20 4, ✌️', 'D M, YYYY', LANGUAGE.ENGLISH))
      errorStub.callCount.should.eql(5)
      errorStub.lastCall.args.length.should.eql(4)
      errorStub.lastCall.args[0].should.match(/Unable to parse.+ Expected to match/)
      errorStub.lastCall.args[1].should.eql('20 4, ✌️')
      errorStub.lastCall.args[2].should.eql('YYYY')
      errorStub.lastCall.args[3].should.eql(6)

      errorStub.restore()


    })


    describe('(HOOK_PARSER.D)', () => {
      it('parses a date string as the date', () => {
        dateUtil.parse('3 Apr, 2016', 'D MMM, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3))
        dateUtil.parse('20 Apr, 2016', 'D MMM, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 20))
      })
    })


    describe('(HOOK_PARSER.DD)', () => {
      it('parses a date string as the padded date', () => {
        dateUtil.parse('03 Apr, 2016', 'DD MMM, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3))
        dateUtil.parse('20 Apr, 2016', 'DD MMM, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 20))
      })
    })


    describe('(HOOK_PARSER.M)', () => {
      it('parses a date string as the month', () => {
        dateUtil.parse('3 4, 2016', 'D M, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3))
        dateUtil.parse('20 12, 2016', 'D M, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20))
      })
    })


    describe('(HOOK_PARSER.MM)', () => {
      it('parses a date string as the padded month', () => {
        dateUtil.parse('3 04, 2016', 'D MM, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3))
        dateUtil.parse('20 12, 2016', 'D MM, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20))
      })
    })


    describe('(HOOK_PARSER.MMM)', () => {
      it('parses a date string as the short named month', () => {
        dateUtil.parse('3 Apr, 2016', 'D MMM, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3))
        dateUtil.parse('20 Dec, 2016', 'D MMM, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20))
      })
    })


    describe('(HOOK_PARSER.MMMM)', () => {
      it('parses a date string as the full named month', () => {
        dateUtil.parse('3 April, 2016', 'D MMMM, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3))
        dateUtil.parse('20 December, 2016', 'D MMMM, YYYY', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20))
      })
    })


    describe('(HOOK_PARSER.H)', () => {
      it('parses a date string as the 24-hours', () => {
        dateUtil.parse('3 4, 2016 @ 17', 'D M, YYYY @ H', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 17))
        dateUtil.parse('20 12, 2016 @ 2', 'D M, YYYY @ H', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 2))
      })
    })


    describe('(HOOK_PARSER.HH)', () => {
      it('parses a date string as the padded 24-hours', () => {
        dateUtil.parse('3 4, 2016 @ 17', 'D M, YYYY @ HH', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 17))
        dateUtil.parse('20 12, 2016 @ 02', 'D M, YYYY @ HH', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 2))
      })
    })


    describe('(HOOK_PARSER.h)', () => {
      it('parses a date string as the 12-hours', () => {
        dateUtil.parse('3 4, 2016 @ 5 AM', 'D M, YYYY @ h A', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 5))
        dateUtil.parse('3 4, 2016 @ 5 PM', 'D M, YYYY @ h A', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 17))
        dateUtil.parse('3 4, 2016 @ 5 a.m.', 'D M, YYYY @ h a', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 5))
        dateUtil.parse('3 4, 2016 @ 5 p.m.', 'D M, YYYY @ h a', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 17))
        dateUtil.parse('20 12, 2016 @ 11 AM', 'D M, YYYY @ h A', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 11))
        dateUtil.parse('20 12, 2016 @ 11 PM', 'D M, YYYY @ h A', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 23))
        dateUtil.parse('20 12, 2016 @ 11 a.m.', 'D M, YYYY @ h a', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 11))
        dateUtil.parse('20 12, 2016 @ 11 p.m.', 'D M, YYYY @ h a', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 23))
      })
    })


    describe('(HOOK_PARSER.hh)', () => {
      it('parses a date string as the padded 12-hours', () => {
        dateUtil.parse('3 4, 2016 @ 05 AM', 'D M, YYYY @ hh A', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 5))
        dateUtil.parse('3 4, 2016 @ 05 PM', 'D M, YYYY @ hh A', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 17))
        dateUtil.parse('3 4, 2016 @ 05 a.m.', 'D M, YYYY @ hh a', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 5))
        dateUtil.parse('3 4, 2016 @ 05 p.m.', 'D M, YYYY @ hh a', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 17))
        dateUtil.parse('20 12, 2016 @ 11 AM', 'D M, YYYY @ hh A', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 11))
        dateUtil.parse('20 12, 2016 @ 11 PM', 'D M, YYYY @ hh A', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 23))
        dateUtil.parse('20 12, 2016 @ 11 a.m.', 'D M, YYYY @ hh a', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 11))
        dateUtil.parse('20 12, 2016 @ 11 p.m.', 'D M, YYYY @ hh a', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 23))
      })
    })


    describe('(HOOK_PARSER.m)', () => {
      it('parses a date string as the minutes', () => {
        dateUtil.parse('3 4, 2016 @ 17:8', 'D M, YYYY @ HH:m', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 17, 8))
        dateUtil.parse('20 12, 2016 @ 02:13', 'D M, YYYY @ HH:m', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 2, 13))
      })
    })


    describe('(HOOK_PARSER.mm)', () => {
      it('parses a date string as the minutes', () => {
        dateUtil.parse('3 4, 2016 @ 17:08', 'D M, YYYY @ HH:mm', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 17, 8))
        dateUtil.parse('20 12, 2016 @ 02:13', 'D M, YYYY @ HH:mm', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 2, 13))
      })
    })


    describe('(HOOK_PARSER.s)', () => {
      it('parses a date string as the minutes', () => {
        dateUtil.parse('3 4, 2016 @ 17:08:6', 'D M, YYYY @ HH:mm:s', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 17, 8, 6))
        dateUtil.parse('20 12, 2016 @ 02:13:19', 'D M, YYYY @ HH:mm:s', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 2, 13, 19))
      })
    })


    describe('(HOOK_PARSER.ss)', () => {
      it('parses a date string as the minutes', () => {
        dateUtil.parse('3 4, 2016 @ 17:08:06', 'D M, YYYY @ HH:mm:ss', LANGUAGE.ENGLISH).should.eql(new Date(2016, 3, 3, 17, 8, 6))
        dateUtil.parse('20 12, 2016 @ 02:13:19', 'D M, YYYY @ HH:mm:ss', LANGUAGE.ENGLISH).should.eql(new Date(2016, 11, 20, 2, 13, 19))
      })
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

      fullMonthNames.should.eql(dateUtil.getFullMonthNames(LANGUAGE.ENGLISH))

    })


    it('gets a list of the full month names for the correct language', () => {

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

      fullMonthNames.should.eql(dateUtil.getFullMonthNames(LANGUAGE.FRENCH))

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

      shortMonthNames.should.eql(dateUtil.getShortMonthNames(LANGUAGE.ENGLISH))

    })


    it('gets a list of the short month names for the correct language', () => {

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

      shortMonthNames.should.eql(dateUtil.getShortMonthNames(LANGUAGE.FRENCH))

    })

  })



  describe('#getFullMonthName', () => {

    it('gets the full name of a specific month', () => {
      let fullMonthName = 'June'
      fullMonthName.should.eql(dateUtil.getFullMonthName(LANGUAGE.ENGLISH, 5))
    })


    it('gets the full name of a specific month for the correct language', () => {
      let fullMonthName = 'Juin'
      fullMonthName.should.eql(dateUtil.getFullMonthName(LANGUAGE.FRENCH, 5))
    })

  })



  describe('#getShortMonthName', () => {

    it('gets the short name of a specific month', () => {
      let shortMonthName = 'Aug'
      shortMonthName.should.eql(dateUtil.getShortMonthName(LANGUAGE.ENGLISH, 7))
    })


    it('gets the short name of a specific month for the correct language', () => {
      let fullMonthName = 'Aou'
      fullMonthName.should.eql(dateUtil.getShortMonthName(LANGUAGE.FRENCH, 7))
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

      fullDayNames.should.eql(dateUtil.getFullDayNames(LANGUAGE.ENGLISH))

    })


    it('gets a list of the full day names for the correct language', () => {

      let fullDayNames = [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
      ]

      fullDayNames.should.eql(dateUtil.getFullDayNames(LANGUAGE.FRENCH))

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

      shortDayNames.should.eql(dateUtil.getShortDayNames(LANGUAGE.ENGLISH))

    })


    it('gets a list of the short day names for the correct language', () => {

      let shortDayNames = [
        'Dim',
        'Lun',
        'Mar',
        'Mer',
        'Jeu',
        'Ven',
        'Sam',
      ]

      shortDayNames.should.eql(dateUtil.getShortDayNames(LANGUAGE.FRENCH))

    })

  })



  describe('#getFullDayName', () => {

    it('gets the full name of a specific day', () => {
      let fullDayName = 'Friday'
      fullDayName.should.eql(dateUtil.getFullDayName(LANGUAGE.ENGLISH, 5))
    })


    it('gets the full name of a specific day for the correct language', () => {
      let fullDayName = 'Vendredi'
      fullDayName.should.eql(dateUtil.getFullDayName(LANGUAGE.FRENCH, 5))
    })

  })



  describe('#getShortDayName', () => {

    it('gets the short name of a specific day', () => {
      let shortDayName = 'Fr'
      shortDayName.should.eql(dateUtil.getShortDayName(LANGUAGE.ENGLISH, 5))
    })


    it('gets the short name of a specific day for the correct language', () => {
      let shortDayName = 'Ven'
      shortDayName.should.eql(dateUtil.getShortDayName(LANGUAGE.FRENCH, 5))
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