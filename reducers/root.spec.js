const actions     = require('actions')
const SCOPE       = require('constants/scope')
const rootReducer = require('reducers/root')
const stateUtil   = require('utils/state')



describe('#rootReducer', () => {

  it('reduces a state key by an action', () => {

    const state = {
      scope: SCOPE.DAYS,
    }
    const action = actions.cycleScope()

    const nextState = rootReducer(state, action)
    nextState.should.eql({
      ...state,
      scope: SCOPE.MONTHS,
    })
    nextState.should.not.be.exactly(state)

    const finalState = rootReducer(nextState, action)
    finalState.should.eql({
      ...nextState,
      scope: SCOPE.YEARS,
    })
    finalState.should.not.be.exactly(nextState)

  })


  it('reduces multiple state keys by an action', () => {

    const state  = stateUtil.getInitial()
    const value  = new Date(2014, 3, 20)
    const action = actions.select(value)

    const nextState = rootReducer(state, action)

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

    const nextState = rootReducer(state, action)

    nextState.should.eql(state)
    nextState.should.be.exactly(state)

  })

})
