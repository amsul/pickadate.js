const sinon        = require('sinon')

const SCOPE        = require('constants/scope')
const dateUtil     = require('utils/date')
const selectedUtil = require('utils/selected')



describe('/selectedUtil', () => {


  describe('#createDateToSet', () => {

    it('returns the original state if nothing is selected and the scope isn’t DAYS', () => {

      const scope    = SCOPE.YEARS
      const selected = null
      const value    = new Date(2013, 3, 20).getTime()

      const state   = new Date(2013, 1, 17)
      const payload = { scope, selected, value }

      const nextValue = selectedUtil.createDateToSet(state, payload)

      nextValue.should.be.exactly(state)

    })


    it('creates a new date to set if nothing is selected', () => {

      const scope    = SCOPE.DAYS
      const selected = null
      const value    = new Date(2013, 3, 20).getTime()

      const state   = selected
      const payload = { scope, selected, value }

      const nextValue = selectedUtil.createDateToSet(state, payload)

      nextValue.should.eql(new Date(2013, 3, 20))

    })


    it('returns the original state if the selected value is on the same date as the value', () => {

      const scope    = SCOPE.YEARS
      const selected = new Date(2013, 3, 20)
      const value    = new Date(2013, 3, 20).getTime()

      const state   = selected
      const payload = { scope, selected, value }

      const nextValue = selectedUtil.createDateToSet(state, payload)

      nextValue.should.be.exactly(state)

    })


    it('returns a new date if scope is DAYS and the selected value is not on the same date as the value', () => {

      const scope    = SCOPE.DAYS
      const selected = new Date(2013, 3, 17)
      const value    = new Date(2013, 3, 20).getTime()

      const state   = selected
      const payload = { scope, selected, value }

      const nextValue = selectedUtil.createDateToSet(state, payload)

      nextValue.should.eql(new Date(2013, 3, 20))

    })


    it('returns a new date in the year and month of the currently selected value if the scope is not DAYS', () => {

      const scope    = SCOPE.YEARS
      const selected = new Date(2013, 2, 31)
      const value    = new Date(2012, 1, 20).getTime()

      const state   = selected
      const payload = { scope, selected, value }

      const createInMonthSpy = sinon.spy(dateUtil, 'createInMonth')

      const nextValue = selectedUtil.createDateToSet(state, payload)

      createInMonthSpy.callCount.should.eql(1)
      createInMonthSpy.lastCall.args.should.eql([2012, 1, 31])

      nextValue.should.eql(new Date(2012, 1, 29))

      createInMonthSpy.restore()

    })

  })


})
