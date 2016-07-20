let sinon     = require('sinon')

const SCOPE   = require('constants/scope')

let dateUtil  = require('utils/date')
let valueUtil = require('utils/value')



describe('/valueUtil', () => {


  describe('#createDateToSet', () => {

    it('returns the original state if nothing is selected and the scope isn’t DAYS', () => {

      let scope    = SCOPE.YEARS
      let selected = null
      let value    = new Date(2013, 3, 20).getTime()

      let state   = new Date(2013, 1, 17)
      let payload = { scope, selected, value }

      let nextValue = valueUtil.createDateToSet(state, payload)

      nextValue.should.be.exactly(state)

    })


    it('creates a new date to set if nothing is selected', () => {

      let scope    = SCOPE.DAYS
      let selected = null
      let value    = new Date(2013, 3, 20).getTime()

      let state   = selected
      let payload = { scope, selected, value }

      let nextValue = valueUtil.createDateToSet(state, payload)

      nextValue.should.eql(new Date(2013, 3, 20))

    })


    it('returns the original state if the selected value is on the same date as the value', () => {

      let scope    = SCOPE.YEARS
      let selected = new Date(2013, 3, 20)
      let value    = new Date(2013, 3, 20).getTime()

      let state   = selected
      let payload = { scope, selected, value }

      let nextValue = valueUtil.createDateToSet(state, payload)

      nextValue.should.be.exactly(state)

    })


    it('returns a new date if scope is DAYS and the selected value is not on the same date as the value', () => {

      let scope    = SCOPE.DAYS
      let selected = new Date(2013, 3, 17)
      let value    = new Date(2013, 3, 20).getTime()

      let state   = selected
      let payload = { scope, selected, value }

      let nextValue = valueUtil.createDateToSet(state, payload)

      nextValue.should.eql(new Date(2013, 3, 20))

    })


    it('returns a new date in the year and month of the currently selected value if the scope is not DAYS', () => {

      let scope    = SCOPE.YEARS
      let selected = new Date(2013, 2, 31)
      let value    = new Date(2012, 1, 20).getTime()

      let state   = selected
      let payload = { scope, selected, value }

      let createInMonthSpy = sinon.spy(dateUtil, 'createInMonth')

      let nextValue = valueUtil.createDateToSet(state, payload)

      createInMonthSpy.callCount.should.eql(1)
      createInMonthSpy.lastCall.args.should.eql([2012, 1, 31])

      nextValue.should.eql(new Date(2012, 1, 29))

      createInMonthSpy.restore()

    })

  })


})