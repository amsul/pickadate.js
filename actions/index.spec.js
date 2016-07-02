const ACTION = require('constants/action')
const SCOPE  = require('constants/scope')

let actions  = require('actions')



describe('/actions', () => {


  //////////////
  // TEMPLATE //
  //////////////



  describe('#format', () => {

    it('returns an actions that sets the template to use to format a value', () => {
      let template = 'yyyy-mm-dd'
      actions.format(template).should.eql({
        type    : ACTION.TYPE.FORMAT,
        payload : { template },
      })
    })

  })





  ////////////
  // SELECT //
  ////////////



  describe('#select', () => {

    it('returns an action that selects a value for the picker', () => {
      let template = 'yyyy-mm-dd'
      let value    = new Date(2014, 3, 20)
      actions.select(value, template).should.eql({
        type    : ACTION.TYPE.SELECT,
        payload : { template, value },
      })
    })

  })



  describe('#clear', () => {

    it('returns an action that clears the value of the picker', () => {
      actions.clear().should.eql({
        type    : ACTION.TYPE.SELECT,
        payload : { template: undefined, value: null },
      })
    })

  })





  //////////
  // VIEW //
  //////////



  describe('#showPreviousView', () => {

    it('returns an action that shows the previous view of a certain scope', () => {
      let scope = SCOPE.MONTHS
      actions.showPreviousView(scope).should.eql({
        type    : ACTION.TYPE.SHOW_PREVIOUS_VIEW,
        payload : { scope },
      })
    })

  })



  describe('#showNextView', () => {

    it('returns an action that shows the next view of a certain scope', () => {
      let scope = SCOPE.MONTHS
      actions.showNextView(scope).should.eql({
        type    : ACTION.TYPE.SHOW_NEXT_VIEW,
        payload : { scope },
      })
    })

  })



  describe('#showView', () => {

    it('returns an action that shows the view of a certain date', () => {
      let view = new Date(2014, 3, 20)
      actions.showView(view).should.eql({
        type    : ACTION.TYPE.SHOW_VIEW,
        payload : { view },
      })
    })

  })





  ///////////
  // SCOPE //
  ///////////



  describe('#cycleScope', () => {

    it('returns an action that cycles to the next scope of the picker', () => {
      actions.cycleScope().should.eql({
        type: ACTION.TYPE.CYCLE_SCOPE,
      })
    })

  })


})