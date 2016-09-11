const ACTION = require('constants/action')
const SCOPE  = require('constants/scope')

let actions  = require('actions')



describe('/actions', () => {


  //////////////
  // TEMPLATE //
  //////////////



  // describe('#format', () => {

  //   it('returns an actions that sets the template to use to format a value', () => {
  //     let template = 'yyyy-mm-dd'
  //     actions.format(template).should.eql({
  //       type    : ACTION.TYPE.FORMAT,
  //       payload : { template },
  //     })
  //   })

  // })





  /////////////
  // CONFIRM //
  /////////////



  describe('#confirm', () => {

    it('returns an action that confirms the selected value', () => {
      actions.confirm().should.eql({
        type : ACTION.TYPE.CONFIRM,
      })
    })

  })





  ////////////
  // SELECT //
  ////////////



  describe('#select', () => {

    it('returns an action that selects a value', () => {

      let scope    = SCOPE.DAYS
      let selected = null
      let template = 'yyyy-mm-dd'
      let value    = new Date(2014, 3, 20)

      actions.select({ scope, selected, template }, value).should.eql({
        type    : ACTION.TYPE.SELECT,
        payload : { scope, selected, template, value },
      })

    })

  })



  describe('#clear', () => {

    it('returns an action that clears the value', () => {
      actions.clear().should.eql({
        type    : ACTION.TYPE.SELECT,
        payload : {
          scope    : undefined,
          selected : undefined,
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

      let scope    = SCOPE.MONTHS
      let selected = null
      let template = 'yyyy-mm-dd'
      let value    = new Date(2012, 3, 20)

      actions.show({ scope, selected, template }, value).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : { scope, selected, template, value },
      })

    })

  })



  describe('#showPrevious', () => {

    it('returns an action that shows a scoped value from the previous view', () => {

      let scope    = SCOPE.MONTHS
      let selected = null
      let template = 'yyyy-mm-dd'
      let view     = new Date(2013, 3, 1)
      let value    = new Date(2012, 3, 1)

      actions.showPrevious({ scope, selected, template, view }).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : { scope, selected, template, value },
      })

    })


    it('returns an action that selects a scoped value from the previous view', () => {

      let scope    = SCOPE.MONTHS
      let selected = new Date(2013, 3, 20)
      let template = 'yyyy-mm-dd'
      let view     = new Date(2013, 3, 1)
      let value    = new Date(2012, 3, 20)

      actions.showPrevious({ scope, selected, template, view }).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : { scope, selected, template, value },
      })

    })

  })



  describe('#showNext', () => {

    it('returns an action that shows a scoped value from the next view', () => {

      let scope    = SCOPE.MONTHS
      let selected = null
      let template = 'yyyy-mm-dd'
      let view     = new Date(2013, 3, 1)
      let value    = new Date(2014, 3, 1)

      actions.showNext({ scope, selected, template, view }).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : { scope, selected, template, value },
      })

    })


    it('returns an action that selects a scoped value from the next view', () => {

      let scope    = SCOPE.MONTHS
      let selected = new Date(2013, 3, 20)
      let template = 'yyyy-mm-dd'
      let view     = new Date(2013, 3, 1)
      let value    = new Date(2014, 3, 20)

      actions.showNext({ scope, selected, template, view }).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : { scope, selected, template, value },
      })

    })

  })



  describe('#showToday', () => {

    it('returns an action that selects "today"', () => {

      let scope    = SCOPE.MONTHS
      let selected = null
      let template = 'yyyy-mm-dd'
      let today    = new Date(2013, 3, 20)
      let value    = new Date(2013, 3, 20)

      actions.showToday({ scope, selected, template, today }).should.eql({
        type    : ACTION.TYPE.SHOW,
        payload : { scope, selected, template, value },
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


})