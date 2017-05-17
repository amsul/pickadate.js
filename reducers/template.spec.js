const ACTION          = require('constants/action')
const STATE           = require('constants/state')
const templateReducer = require('reducers/template')



describe('/templateReducer', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the template', () => {
      templateReducer[ACTION.TYPE.INITIALIZE]().should.eql(STATE.INITIAL.template)
    })


    it('initializes a custom template', () => {
      const state = 'YYYY-MM-DD'
      templateReducer[ACTION.TYPE.INITIALIZE](state).should.eql(state)
    })

  })



  // describe('#[ACTION.TYPE.FORMAT]', () => {

  //   it('sets the template to use for formatting the selected value', () => {
  //     let state    = STATE.INITIAL.template
  //     let template = 'YYYY-MM-DD'
  //     templateReducer[ACTION.TYPE.FORMAT](state, { template }).should.eql(template)
  //   })

  // })


})
