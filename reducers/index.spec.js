const actions  = require('actions')
const SCOPE    = require('constants/scope')
const STATE    = require('constants/state')
const reducers = require('reducers')



describe('/reducers', () => {


  describe('#reduce', () => {

    it('reduces a state key by an action', () => {

      const state  = {}
      const action = actions.cycleScope()

      const nextState = reducers.reduce(state, action)

      nextState.should.eql({
        ...state,
        scope: SCOPE.DAYS,
      })
      nextState.should.not.be.exactly(state)

      const finalState = reducers.reduce(nextState, action)

      finalState.should.eql({
        ...nextState,
        scope: SCOPE.MONTHS,
      })
      finalState.should.not.be.exactly(nextState)

    })


    it('reduces multiple state keys by an action', () => {

      const state = {
        ...STATE.INITIAL,
        template: 'YYYY-MM-DD',
      }

      const value  = new Date(2014, 3, 20)
      const action = actions.select(state, value)

      const nextState = reducers.reduce(state, action)

      nextState.should.eql({
        ...state,
        scope    : SCOPE.DAYS,
        selected : value,
        view     : new Date(2014, 3, 1),
      })

    })


    it('does nothing if the state hasn’t changed', () => {

      const state  = {}
      const action = { type: 'ACTION_TYPE_TEST' }

      const nextState = reducers.reduce(state, action)

      nextState.should.eql(state)
      nextState.should.be.exactly(state)

    })

  })


})
