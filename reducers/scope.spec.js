const ACTION       = require('constants/action')
const SCOPE        = require('constants/scope')
const scopeReducer = require('reducers/scope')



describe('/scopeReducer', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the scope, defaulting to DAYS', () => {
      scopeReducer[ACTION.TYPE.INITIALIZE]().should.eql(SCOPE.DAYS)
    })


    it('initializes the scope with a specific value', () => {
      scopeReducer[ACTION.TYPE.INITIALIZE](SCOPE.DAYS).should.eql(SCOPE.DAYS)
      scopeReducer[ACTION.TYPE.INITIALIZE](SCOPE.MONTHS).should.eql(SCOPE.MONTHS)
      scopeReducer[ACTION.TYPE.INITIALIZE](SCOPE.YEARS).should.eql(SCOPE.YEARS)
    })

  })



  describe('#[ACTION.TYPE.CYCLE_SCOPE]', () => {

    it('cycles through the scopes', () => {
      scopeReducer[ACTION.TYPE.CYCLE_SCOPE](SCOPE.DAYS).should.eql(SCOPE.MONTHS)
      scopeReducer[ACTION.TYPE.CYCLE_SCOPE](SCOPE.MONTHS).should.eql(SCOPE.YEARS)
      scopeReducer[ACTION.TYPE.CYCLE_SCOPE](SCOPE.YEARS).should.eql(SCOPE.DAYS)
    })

  })



  describe('#[ACTION.TYPE.SELECT]', () => {

    it('shows the next deeper scope', () => {

      const payload = { value: new Date(2014, 3, 20) }

      scopeReducer[ACTION.TYPE.SELECT](SCOPE.YEARS, payload).should.eql(SCOPE.MONTHS)
      scopeReducer[ACTION.TYPE.SELECT](SCOPE.MONTHS, payload).should.eql(SCOPE.DAYS)
      scopeReducer[ACTION.TYPE.SELECT](SCOPE.DAYS, payload).should.eql(SCOPE.DAYS)
      scopeReducer[ACTION.TYPE.SELECT](undefined, payload).should.eql(SCOPE.DAYS)

    })


    it('shows the same scope if there is no new value', () => {

      const payload = {}

      scopeReducer[ACTION.TYPE.SELECT](SCOPE.YEARS, payload).should.eql(SCOPE.YEARS)
      scopeReducer[ACTION.TYPE.SELECT](SCOPE.MONTHS, payload).should.eql(SCOPE.MONTHS)
      scopeReducer[ACTION.TYPE.SELECT](SCOPE.DAYS, payload).should.eql(SCOPE.DAYS)

    })

  })


})
