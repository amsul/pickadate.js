const ACTION     = require('constants/action')
const STATE      = require('constants/state')

let valueReducer = require('reducers/value')



describe('/valueReducer', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the value', () => {
      valueReducer[ACTION.TYPE.INITIALIZE]().should.eql(STATE.INITIAL.value)
    })


    it('initializes a custom value', () => {
      let state = '20 April, 2014'
      valueReducer[ACTION.TYPE.INITIALIZE](state).should.eql(state)
    })

  })



  describe('#[ACTION.TYPE.SELECT]', () => {

    it('sets the formatted value based on the selected value', () => {

      let state    = STATE.INITIAL.value
      let template = 'yyyy-mm-dd'
      let value    = new Date(2014, 3, 20)

      valueReducer[ACTION.TYPE.SELECT](state, { template, value })
        .should.eql('2014-04-20')

    })


    it('clears the formatted value when there is no selected value', () => {

      let state    = STATE.INITIAL.value
      let template = 'yyyy-mm-dd'
      let value    = null

      valueReducer[ACTION.TYPE.SELECT](state, { template, value })
        .should.eql('')

    })

  })


})