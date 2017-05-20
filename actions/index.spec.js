const actions  = require('actions')
const ACTION   = require('constants/action')
const LANGUAGE = require('constants/language')
const PERIOD   = require('constants/period')



describe('/actions', () => {


  //////////////
  // TEMPLATE //
  //////////////



  // describe('#format', () => {

  //   it(
  //     'returns an actions that sets the template to use to format a value',
  //   () => {
  //     let template = 'YYYY-MM-DD'
  //     actions.format(template).should.eql({
  //       type    : ACTION.TYPE.FORMAT,
  //       payload : { template },
  //     })
  //   })

  // })





  ////////////
  // SELECT //
  ////////////



  describe('#select', () => {

    it('returns an action that selects a value', () => {

      const value = '20 April, 2016'

      actions.select(value).should.eql({
        type    : ACTION.TYPE.SELECT,
        payload : { template: undefined, value },
      })

    })


    it('returns an action that selects a value with a custom template', () => {

      const value    = '2016/20/04'
      const template = 'YYYY/MM/DD'

      actions.select(value, template).should.eql({
        type    : ACTION.TYPE.SELECT,
        payload : { template, value },
      })

    })

  })



  describe('#clear', () => {

    it('returns an action that clears the value', () => {
      actions.clear().should.eql({
        type    : ACTION.TYPE.SELECT,
        payload : { template: undefined, value: null },
      })
    })

  })



  describe('#selectInPreviousPeriod', () => {

    it('returns an action that shows a scoped value from the previous view', () => {
      actions.selectInPreviousPeriod().should.eql({
        type    : ACTION.TYPE.SELECT_IN_PERIOD,
        payload : { period: PERIOD.ID.PREVIOUS },
      })
    })

  })



  describe('#selectInNextPeriod', () => {

    it('returns an action that shows a scoped value from the previous view', () => {
      actions.selectInNextPeriod().should.eql({
        type    : ACTION.TYPE.SELECT_IN_PERIOD,
        payload : { period: PERIOD.ID.NEXT },
      })
    })

  })



  describe('#selectInTodayPeriod', () => {

    it('returns an action that selects "today"', () => {
      actions.selectInTodayPeriod().should.eql({
        type    : ACTION.TYPE.SELECT_IN_PERIOD,
        payload : { period: PERIOD.ID.TODAY },
      })
    })

  })





  ///////////
  // SCOPE //
  ///////////



  describe('#cycleScope', () => {

    it('returns an action that cycles to the next scope', () => {
      actions.cycleScope().should.eql({
        type: ACTION.TYPE.CYCLE_SCOPE,
      })
    })

  })





  /////////////
  // DISABLE //
  /////////////



  describe('#disable', () => {

    it('returns an action that disables dates and days', () => {
      actions.disable(1, 2, new Date(2014, 3, 20)).should.eql({
        type    : ACTION.TYPE.DISABLE,
        payload : { values: [1, 2, new Date(2014, 3, 20)] },
      })
    })

  })



  describe('#enable', () => {

    it('returns an action that enables dates and days', () => {
      actions.enable(1, 2, new Date(2014, 3, 20)).should.eql({
        type    : ACTION.TYPE.ENABLE,
        payload : { values: [1, 2, new Date(2014, 3, 20)] },
      })
    })

  })





  //////////////
  // LANGUAGE //
  //////////////



  describe('#setLanguage', () => {

    it('returns an action that sets the language', () => {
      actions.setLanguage(LANGUAGE.FRENCH).should.eql({
        type    : ACTION.TYPE.SET_LANGUAGE,
        payload : { language: LANGUAGE.FRENCH },
      })
    })

  })





  ///////////////
  // FIRST DAY //
  ///////////////



  describe('#setFirstDay', () => {

    it('returns an action that sets the first day of the week', () => {
      actions.setFirstDay(3).should.eql({
        type    : ACTION.TYPE.SET_FIRST_DAY,
        payload : { firstDay: 3 },
      })
    })

  })


})
