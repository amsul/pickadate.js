const ACTION        = require('constants/action')
const SCOPE         = require('constants/scope')
const domainReducer = require('reducers/domain')



describe('/domainReducer.scope', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('sets the scope', () => {

      const state   = { scope: SCOPE.DAYS }
      const payload = { scope: SCOPE.MONTHS }

      const nextState = domainReducer
        .scope[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ scope: SCOPE.MONTHS })

    })


    it('defaults to the original state if no value is passed', () => {

      const state   = { scope: SCOPE.DAYS }
      const payload = { scope: null }

      const nextState = domainReducer
        .scope[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.be.exactly(state)
      nextState.should.eql({ scope: SCOPE.DAYS })

    })


    it('defaults to the original state if unchanged', () => {

      const state   = { scope: SCOPE.DAYS }
      const payload = { scope: SCOPE.DAYS }

      const nextState = domainReducer
        .scope[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.be.exactly(state)
      nextState.should.eql({ scope: SCOPE.DAYS })

    })

  })



  describe('#[ACTION.TYPE.CYCLE_SCOPE]', () => {

    it('cycles through the scopes from DAYS to MONTHS', () => {

      const state = {
        scope: SCOPE.DAYS,
      }

      const nextState = domainReducer
        .scope[ACTION.TYPE.CYCLE_SCOPE](state)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ scope: SCOPE.MONTHS })

    })


    it('cycles through the scopes from MONTHS to YEARS', () => {

      const state = {
        scope: SCOPE.MONTHS,
      }

      const nextState = domainReducer
        .scope[ACTION.TYPE.CYCLE_SCOPE](state)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ scope: SCOPE.YEARS })

    })


    it('cycles through the scopes from YEARS to DAYS', () => {

      const state = {
        scope: SCOPE.YEARS,
      }

      const nextState = domainReducer
        .scope[ACTION.TYPE.CYCLE_SCOPE](state)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ scope: SCOPE.DAYS })

    })


    it('defaults to set the scope to DAYS', () => {

      const state = {}

      const nextState = domainReducer
        .scope[ACTION.TYPE.CYCLE_SCOPE](state)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ scope: SCOPE.DAYS })

    })

  })


  describe('#[ACTION.TYPE.SELECT]', () => {

    it(
      'zooms in the scope from YEARS to MONTHS if a value is being selected',
    () => {

      const state = {
        scope: SCOPE.YEARS
      }
      const value = new Date(2014, 3, 20)

      const nextState = domainReducer
        .scope[ACTION.TYPE.SELECT](state, { value })

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ scope: SCOPE.MONTHS })

    })


    it(
      'zooms in the scope from MONTHS to DAYS if a value is being selected',
    () => {

      const state = {
        scope: SCOPE.MONTHS
      }
      const value = new Date(2014, 3, 20)

      const nextState = domainReducer
        .scope[ACTION.TYPE.SELECT](state, { value })

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ scope: SCOPE.DAYS })

    })


    it('returns the original state if the scope is DAYS', () => {

      const state = {
        scope: SCOPE.DAYS
      }
      const value = new Date(2014, 3, 20)

      const nextState = domainReducer
        .scope[ACTION.TYPE.SELECT](state, { value })

      nextState.should.be.exactly(state)
      nextState.should.eql({ scope: SCOPE.DAYS })

    })


    it('returns the original state if no value is being selected', () => {

      const state = {
        scope: SCOPE.YEARS
      }
      const value = null

      const nextState = domainReducer
        .scope[ACTION.TYPE.SELECT](state, { value })

      nextState.should.be.exactly(state)
      nextState.should.eql({ scope: SCOPE.YEARS })

    })

  })


})
