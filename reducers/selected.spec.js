const sinon           = require('sinon')

const ACTION          = require('constants/action')
const LANGUAGE        = require('constants/language')
const SCOPE           = require('constants/scope')
const selectedReducer = require('reducers/selected')
const selectedUtil    = require('utils/selected')



describe('/selectedReducer', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the selected date, defaulting to null', () => {
      const state   = undefined
      const payload = {}
      true.should.eql(null == selectedReducer[ACTION.TYPE.INITIALIZE](state, payload))
    })


    it('initializes the selected date with a specific value', () => {
      const state   = new Date(2013, 3, 20)
      const payload = {}
      selectedReducer[ACTION.TYPE.INITIALIZE](state, payload).should.be.exactly(state)
    })


    it('initializes the selected date with a specific epoch timestamp', () => {
      const state   = new Date(2013, 3, 20).getTime()
      const payload = {}
      selectedReducer[ACTION.TYPE.INITIALIZE](state, payload).getTime().should.eql(state)
    })


    it('initializes the selected date with a specific payload value', () => {
      const state   = undefined
      const payload = { value: new Date(2014, 3, 20) }
      selectedReducer[ACTION.TYPE.INITIALIZE](state, payload).should.eql(new Date(2014, 3, 20))
    })


    it('initializes the selected date with a specific payload value, template, and language', () => {
      const state   = undefined
      const payload = { language: LANGUAGE.ENGLISH, template: 'MMMM DD, YYYY', value: 'April 20, 2014' }
      selectedReducer[ACTION.TYPE.INITIALIZE](state, payload).should.eql(new Date(2014, 3, 20))
    })

  })



  describe('#[ACTION.TYPE.SELECT]', () => {

    it('sets the selected date', () => {

      const scope    = SCOPE.DAYS
      const template = 'YYYY-MM-DD'
      const value    = new Date(2013, 3, 20).getTime()

      const state   = null
      const payload = { scope, template, value }

      const createDateToSetSpy = sinon.spy(selectedUtil, 'createDateToSet')

      selectedReducer[ACTION.TYPE.SELECT](state, payload).getTime()
        .should.eql(value)

      createDateToSetSpy.callCount.should.eql(1)
      createDateToSetSpy.lastCall.args.should.eql([state, {
        scope,
        selected: state,
        value,
      }])

      createDateToSetSpy.restore()

    })


    it('sets the selected date by parsing the value', () => {

      const language    = LANGUAGE.ENGLISH
      const scope       = SCOPE.DAYS
      const template    = 'D MMMM, YYYY'
      const value       = '20 April, 2016'
      const parsedValue = new Date(2016, 3, 20)

      const state   = null
      const payload = { language, scope, template, value }

      const createDateToSetSpy = sinon.spy(selectedUtil, 'createDateToSet')

      selectedReducer[ACTION.TYPE.SELECT](state, payload)
        .should.eql(parsedValue)

      createDateToSetSpy.callCount.should.eql(1)
      createDateToSetSpy.lastCall.args.should.eql([state, {
        scope,
        selected : state,
        value    : parsedValue,
      }])

      createDateToSetSpy.restore()

    })


    it('uses the original state if the value is the same as the selected date', () => {

      const scope    = SCOPE.DAYS
      const template = 'YYYY-MM-DD'
      const value    = new Date(2013, 3, 20, 4, 20)

      const state   = new Date(2013, 3, 20)
      const payload = { scope, template, value }

      const createDateToSetSpy = sinon.spy(selectedUtil, 'createDateToSet')

      selectedReducer[ACTION.TYPE.SELECT](state, payload).should.be.exactly(state)

      createDateToSetSpy.callCount.should.eql(1)
      createDateToSetSpy.lastCall.args.should.eql([state, {
        scope,
        selected: state,
        value,
      }])

      createDateToSetSpy.restore()

    })


    it('unsets the selected date', () => {

      const state   = new Date(2013, 3, 20)
      const payload = { value: null }

      const createDateToSetSpy = sinon.spy(selectedUtil, 'createDateToSet')

      true.should.eql(null == selectedReducer[ACTION.TYPE.SELECT](state, payload))

      createDateToSetSpy.callCount.should.eql(0)

      createDateToSetSpy.restore()

    })

  })



  describe('#[ACTION.TYPE.SHOW]', () => {

    it('handles all the same scenarios as [ACTION.TYPE.SELECT]', () => {
      selectedReducer[ACTION.TYPE.SHOW].should.be.exactly(selectedReducer[ACTION.TYPE.SELECT])
    })

  })


})
