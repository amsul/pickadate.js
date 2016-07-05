const ACTION        = require('constants/action')
const STATE         = require('constants/state')

let templateReducer = require('reducers/template')



describe('/templateReducer', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the template', () => {
      templateReducer[ACTION.TYPE.INITIALIZE]().should.eql(STATE.INITIAL.template)
    })


    it('initializes a custom template', () => {
      let state = 'yyyy-mm-dd'
      templateReducer[ACTION.TYPE.INITIALIZE](state).should.eql(state)
    })

  })



  describe('#[ACTION.TYPE.FORMAT]', () => {

    it('sets the template to use for formatting the selected value', () => {
      let state    = STATE.INITIAL.template
      let template = 'yyyy-mm-dd'
      templateReducer[ACTION.TYPE.FORMAT](state, { template }).should.eql(template)
    })

  })


})