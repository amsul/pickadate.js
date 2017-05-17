const actions  = require('actions')
const ACTION   = require('constants/action')
const LANGUAGE = require('constants/language')
const SCOPE    = require('constants/scope')



describe('/actions', () => {


  //////////////
  // TEMPLATE //
  //////////////



  // describe('#format', () => {

  //   it('returns an actions that sets the template to use to format a value', () => {
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

      const language = LANGUAGE.ENGLISH
      const scope    = SCOPE.DAYS
      const template = 'D MMMM, YYYY'
      const value    = '20 April, 2016'

      actions.select({ language, scope, template }, value).should.eql({
        type    : ACTION.TYPE.SELECT,
        payload : { language, scope, template, value },
      })

    })


    it('returns an action that selects a value with a custom template', () => {

      const language      = LANGUAGE.ENGLISH
      const scope         = SCOPE.DAYS
      const template      = 'D MMMM, YYYY'
      const value         = '2016/20/04'
      const valueTemplate = 'YYYY/MM/DD'

      actions.select({ language, scope, template }, value, valueTemplate).should.eql({
        type    : ACTION.TYPE.SELECT,
        payload : {
          language,
          scope,
          template: valueTemplate,
          value,
        },
      })

    })

  })



  describe('#clear', () => {

    it('returns an action that clears the value', () => {
      actions.clear().should.eql({
        type    : ACTION.TYPE.SELECT,
        payload : {
          language : undefined,
          scope    : undefined,
          template : undefined,
          value    : null,
        },
      })
    })

  })





  //////////
  // SHOW //
  //////////



  describe('#show', () => {

    it('returns an action that shows a scoped value', () => {

      const language = LANGUAGE.ENGLISH
      const scope    = SCOPE.MONTHS
      const template = 'D MMMM, YYYY'
      const value    = '20 April, 2016'

      actions.show({ language, scope, template }, value).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : { language, scope, template, value },
      })

    })


    it('returns an action that show a scoped value with a custom template', () => {

      const language      = LANGUAGE.ENGLISH
      const scope         = SCOPE.MONTHS
      const template      = 'D MMMM, YYYY'
      const value         = '2016/20/04'
      const valueTemplate = 'YYYY/MM/DD'

      actions.show({ language, scope, template }, value, valueTemplate).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : {
          language,
          scope,
          template: valueTemplate,
          value,
        },
      })

    })

  })



  describe('#showPrevious', () => {

    it('returns an action that shows a scoped value from the previous view', () => {

      const scope    = SCOPE.MONTHS
      const selected = null
      const view     = new Date(2013, 3, 1)
      const value    = new Date(2012, 3, 1)

      actions.showPrevious({ scope, selected, view }).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : {
          language: undefined,
          scope,
          template: undefined,
          value,
        },
      })

    })


    it('returns an action that selects a scoped value from the previous view', () => {

      const scope    = SCOPE.MONTHS
      const selected = new Date(2013, 3, 20)
      const view     = new Date(2013, 3, 1)
      const value    = new Date(2012, 3, 20)

      actions.showPrevious({ scope, selected, view }).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : {
          language: undefined,
          scope,
          template: undefined,
          value,
        },
      })

    })

  })



  describe('#showNext', () => {

    it('returns an action that shows a scoped value from the next view', () => {

      const scope    = SCOPE.MONTHS
      const selected = null
      const view     = new Date(2013, 3, 1)
      const value    = new Date(2014, 3, 1)

      actions.showNext({ scope, selected, view }).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : {
          language: undefined,
          scope,
          template: undefined,
          value,
        },
      })

    })


    it('returns an action that selects a scoped value from the next view', () => {

      const scope    = SCOPE.MONTHS
      const selected = new Date(2013, 3, 20)
      const view     = new Date(2013, 3, 1)
      const value    = new Date(2014, 3, 20)

      actions.showNext({ scope, selected, view }).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : {
          language: undefined,
          scope,
          template: undefined,
          value,
        },
      })

    })

  })



  describe('#showToday', () => {

    it('returns an action that selects "today"', () => {

      const scope = SCOPE.MONTHS
      const today = new Date(2013, 3, 20)
      const value = new Date(2013, 3, 20)

      actions.showToday({ scope, today }).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : {
          language: undefined,
          scope,
          template: undefined,
          value,
        },
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
      actions.disable({}, 1, 2, new Date(2014, 3, 20)).should.eql({
        type    : ACTION.TYPE.DISABLE,
        payload : { values: [1, 2, new Date(2014, 3, 20)] },
      })
    })

  })



  describe('#enable', () => {

    it('returns an action that enables dates and days', () => {
      actions.enable({}, 1, 2, new Date(2014, 3, 20)).should.eql({
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
      actions.setLanguage({}, LANGUAGE.FRENCH).should.eql({
        type    : ACTION.TYPE.SET_LANGUAGE,
        payload : { value: LANGUAGE.FRENCH },
      })
    })

  })





  ///////////////
  // FIRST DAY //
  ///////////////



  describe('#setFirstDay', () => {

    it('returns an action that sets the first day of the week', () => {
      actions.setFirstDay({}, 3).should.eql({
        type    : ACTION.TYPE.SET_FIRST_DAY,
        payload : { value: 3 },
      })
    })


    it('ensures the value is within the valid range of days', () => {

      actions.setFirstDay({}, 11).should.eql({
        type    : ACTION.TYPE.SET_FIRST_DAY,
        payload : { value: 4 },
      })

      actions.setFirstDay({}, 7).should.eql({
        type    : ACTION.TYPE.SET_FIRST_DAY,
        payload : { value: 0 },
      })

    })

  })


})
