const ACTION = require('constants/action')
const SCOPE  = require('constants/scope')
const STATE  = require('constants/state')

let actions  = require('actions')
let reducers = require('reducers')



describe('/reducers', () => {


  describe('#reduce', () => {

    it('reduces a state key by an action', () => {

      let state  = {}
      let action = actions.cycleScope()

      let nextState = reducers.reduce(state, action)

      nextState.should.eql({
        ...state,
        scope: SCOPE.DAYS,
      })
      nextState.should.not.be.exactly(state)

      let finalState = reducers.reduce(nextState, action)

      finalState.should.eql({
        ...nextState,
        scope: SCOPE.MONTHS,
      })
      finalState.should.not.be.exactly(nextState)

    })


    it('reduces multiple state keys by an action', () => {

      let state = {
        ...STATE.INITIAL,
        template: 'YYYY-MM-DD'
      }

      let value  = new Date(2014, 3, 20)
      let action = actions.select(state, value)

      let nextState = reducers.reduce(state, action)

      nextState.should.eql({
        ...state,
        scope    : SCOPE.DAYS,
        selected : value,
        view     : new Date(2014, 3, 1),
      })

    })


    it('does nothing if the state hasn’t changed', () => {

      let state  = {}
      let action = { type: 'ACTION_TYPE_TEST' }

      let nextState = reducers.reduce(state, action)

      nextState.should.eql(state)
      nextState.should.be.exactly(state)

    })

  })


})