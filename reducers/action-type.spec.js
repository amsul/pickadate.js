const sinon             = require('sinon')

const ACTION            = require('constants/action')
const actionTypeReducer = require('reducers/action-type')
const domainReducer     = require('reducers/domain')
const reducerUtil       = require('utils/reducer')



describe('/actionTypeReducer', () => {


  describe('#[ACTION.TYPE.CYCLE_SCOPE]', () => {
    it('reduces a state with the CYCLE_SCOPE action', () => {

      const state = {}
      const action = {
        type: ACTION.TYPE.CYCLE_SCOPE,
      }
      const reducedState = {}

      const reducerUtilMock = sinon.mock(reducerUtil)
      reducerUtilMock
        .expects('reduceAll')
        .once()
        .withExactArgs(state, action, [
          domainReducer.scope,
        ])
        .returns(reducedState)

      const returnValue = actionTypeReducer[ACTION.TYPE.CYCLE_SCOPE](
        state,
        action,
      )

      reducerUtilMock.verify()
      reducedState.should.be.exactly(returnValue)

    })
  })



  describe('#[ACTION.TYPE.DISABLE]', () => {
    it('reduces a state with the DISABLE action', () => {

      const state = {}
      const action = {
        type: ACTION.TYPE.DISABLE,
      }
      const reducedState = {}

      const reducerUtilMock = sinon.mock(reducerUtil)
      reducerUtilMock
        .expects('reduceAll')
        .once()
        .withExactArgs(state, action, [
          domainReducer.disabled,
        ])
        .returns(reducedState)

      const returnValue = actionTypeReducer[ACTION.TYPE.DISABLE](
        state,
        action,
      )

      reducerUtilMock.verify()
      reducedState.should.be.exactly(returnValue)

    })
  })



  describe('#[ACTION.TYPE.ENABLE]', () => {
    it('reduces a state with the ENABLE action', () => {

      const state = {}
      const action = {
        type: ACTION.TYPE.ENABLE,
      }
      const reducedState = {}

      const reducerUtilMock = sinon.mock(reducerUtil)
      reducerUtilMock
        .expects('reduceAll')
        .once()
        .withExactArgs(state, action, [
          domainReducer.disabled,
        ])
        .returns(reducedState)

      const returnValue = actionTypeReducer[ACTION.TYPE.ENABLE](
        state,
        action,
      )

      reducerUtilMock.verify()
      reducedState.should.be.exactly(returnValue)

    })
  })



  describe('#[ACTION.TYPE.INITIALIZE]', () => {
    it('reduces a state with the INITIALIZE action', () => {

      const state = {}
      const action = {
        type: ACTION.TYPE.INITIALIZE,
      }
      const reducedState = {}

      const reducerUtilMock = sinon.mock(reducerUtil)
      reducerUtilMock
        .expects('reduceAll')
        .once()
        .withExactArgs(state, action, [
          domainReducer.disabled,
          domainReducer.firstDay,
          domainReducer.language,
          domainReducer.scope,
          domainReducer.today,
          domainReducer.template,
          domainReducer.selected,
          domainReducer.view,
        ])
        .returns(reducedState)

      const returnValue = actionTypeReducer[ACTION.TYPE.INITIALIZE](
        state,
        action,
      )

      reducerUtilMock.verify()
      reducedState.should.be.exactly(returnValue)

    })
  })



  describe('#[ACTION.TYPE.SELECT]', () => {
    it('reduces a state with the SELECT action', () => {

      const state = {}
      const action = {
        type: ACTION.TYPE.SELECT,
      }
      const reducedState = {}

      const reducerUtilMock = sinon.mock(reducerUtil)
      reducerUtilMock
        .expects('reduceAll')
        .once()
        .withExactArgs(state, action, [
          domainReducer.selected,
          domainReducer.view,
          domainReducer.scope,
        ])
        .returns(reducedState)

      const returnValue = actionTypeReducer[ACTION.TYPE.SELECT](
        state,
        action,
      )

      reducerUtilMock.verify()
      reducedState.should.be.exactly(returnValue)

    })
  })



  describe('#[ACTION.TYPE.SELECT_IN_PERIOD]', () => {
    it('reduces a state with the SELECT_IN_PERIOD action', () => {

      const state = {}
      const action = {
        type: ACTION.TYPE.SELECT_IN_PERIOD,
      }
      const reducedState = {}

      const reducerUtilMock = sinon.mock(reducerUtil)
      reducerUtilMock
        .expects('reduceAll')
        .once()
        .withExactArgs(state, action, [
          domainReducer.selected,
          domainReducer.view,
        ])
        .returns(reducedState)

      const returnValue = actionTypeReducer[ACTION.TYPE.SELECT_IN_PERIOD](
        state,
        action,
      )

      reducerUtilMock.verify()
      reducedState.should.be.exactly(returnValue)

    })
  })



  describe('#[ACTION.TYPE.SET_FIRST_DAY]', () => {
    it('reduces a state with the SET_FIRST_DAY action', () => {

      const state = {}
      const action = {
        type: ACTION.TYPE.SET_FIRST_DAY,
      }
      const reducedState = {}

      const reducerUtilMock = sinon.mock(reducerUtil)
      reducerUtilMock
        .expects('reduceAll')
        .once()
        .withExactArgs(state, action, [
          domainReducer.firstDay,
        ])
        .returns(reducedState)

      const returnValue = actionTypeReducer[ACTION.TYPE.SET_FIRST_DAY](
        state,
        action,
      )

      reducerUtilMock.verify()
      reducedState.should.be.exactly(returnValue)

    })
  })



  describe('#[ACTION.TYPE.SET_LANGUAGE]', () => {
    it('reduces a state with the SET_LANGUAGE action', () => {

      const state = {}
      const action = {
        type: ACTION.TYPE.SET_LANGUAGE,
      }
      const reducedState = {}

      const reducerUtilMock = sinon.mock(reducerUtil)
      reducerUtilMock
        .expects('reduceAll')
        .once()
        .withExactArgs(state, action, [
          domainReducer.language,
        ])
        .returns(reducedState)

      const returnValue = actionTypeReducer[ACTION.TYPE.SET_LANGUAGE](
        state,
        action,
      )

      reducerUtilMock.verify()
      reducedState.should.be.exactly(returnValue)

    })
  })


})
