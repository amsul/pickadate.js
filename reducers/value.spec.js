let sinon        = require('sinon')

const ACTION     = require('constants/action')
const SCOPE      = require('constants/scope')
const STATE      = require('constants/state')

let valueReducer = require('reducers/value')
let valueUtil    = require('utils/value')



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

      let scope    = SCOPE.DAYS
      let selected = null
      let template = 'yyyy-mm-dd'
      let value    = new Date(2014, 3, 20)

      let state   = STATE.INITIAL.value
      let payload = { scope, selected, template, value }

      let createDateToSetSpy = sinon.spy(valueUtil, 'createDateToSet')

      valueReducer[ACTION.TYPE.SELECT](state, payload)
        .should.eql('2014-04-20')

      createDateToSetSpy.callCount.should.eql(1)
      createDateToSetSpy.lastCall.args.should.eql([state, {
        scope,
        selected,
        value,
      }])

      createDateToSetSpy.restore()

    })


    it('sets the original state if the value has not changed', () => {

      let scope    = SCOPE.YEARS
      let selected = null
      let template = 'yyyy-mm-dd'
      let value    = new Date(2014, 3, 20)

      let state   = STATE.INITIAL.value
      let payload = { scope, selected, template, value }

      let createDateToSetSpy = sinon.spy(valueUtil, 'createDateToSet')

      valueReducer[ACTION.TYPE.SELECT](state, payload)
        .should.eql(STATE.INITIAL.value)

      createDateToSetSpy.callCount.should.eql(1)
      createDateToSetSpy.lastCall.args.should.eql([state, {
        scope,
        selected,
        value,
      }])

      createDateToSetSpy.restore()

    })


    it('clears the formatted value when there is no selected value', () => {

      let template = 'yyyy-mm-dd'
      let value    = null

      let state   = STATE.INITIAL.value
      let payload = { template, value }

      let createDateToSetSpy = sinon.spy(valueUtil, 'createDateToSet')

      valueReducer[ACTION.TYPE.SELECT](state, payload)
        .should.eql('')

      createDateToSetSpy.callCount.should.eql(0)

      createDateToSetSpy.restore()

    })

  })



  describe('#[ACTION.TYPE.SHOW]', () => {

    it('handles all the same scenarios as [ACTION.TYPE.SELECT]', () => {
      valueReducer[ACTION.TYPE.SHOW].should.be.exactly(valueReducer[ACTION.TYPE.SELECT])
    })

  })


})