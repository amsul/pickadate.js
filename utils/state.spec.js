const SCOPE   = require('constants/scope')

let stateUtil = require('utils/state')



describe('/stateUtil', () => {


  /////////////////////
  // CHANGE CHECKERS //
  /////////////////////



  describe('#isChanging', () => {

    it('returns `true` if certain properties of a state are changing')

  })



  describe('#isChangingAny', () => {

    it('returns `true` if any of certain properties of a state are changing', () => {

      let state     = { 0: 'zero', 1: 'one', 2: 'two', 3: 'three' }
      let nextState = { ...state, 1: 'ONE' }

      stateUtil.isChangingAny(state, nextState, '0', '1', '2').should.eql(true)
      stateUtil.isChangingAny(state, nextState, '0', '1').should.eql(true)
      stateUtil.isChangingAny(state, nextState, '1', '3').should.eql(true)

    })


    it('returns `false` if all of certain properties of a state are not changing', () => {

      let state     = { 0: 'zero', 1: 'one', 2: 'two', 3: 'three' }
      let nextState = { ...state, 1: 'ONE' }

      stateUtil.isChangingAny(state, nextState, '2', '3').should.eql(false)
      stateUtil.isChangingAny(state, nextState, '0', '2', '3').should.eql(false)

    })

  })



  describe('#isNotChanging', () => {

    it('...')

  })





  ////////////////////
  // STATE CHECKERS //
  ////////////////////



  describe('#isDisabled', () => {

    it('returns `true` if a certain date is disabled', () => {

      let state = {
        disabled: {
          dates      : [new Date(2016, 3, 20)],
          days       : [1, 2],
          exceptions : [new Date(2016, 3, 4)],
        }
      }

      stateUtil.isDisabled(state, new Date(2016, 3, 20)).should.eql(true)
      stateUtil.isDisabled(state, new Date(2016, 3, 11)).should.eql(true)

    })


    it('returns `false` if a certain date is disabled', () => {

      let state = {
        disabled: {
          dates      : [new Date(2016, 3, 20)],
          days       : [1, 2],
          exceptions : [new Date(2016, 3, 4)],
        }
      }

      stateUtil.isDisabled(state, new Date(2016, 3, 21)).should.eql(false)
      stateUtil.isDisabled(state, new Date(2016, 3, 4)).should.eql(false)

    })

  })



  describe('#isSelected', () => {

    it('returns `true` if a certain date is the same as the "selected" one with the scope as DAYS', () => {

      let state = {
        selected : new Date(2013, 3, 20),
        scope    : SCOPE.DAYS,
      }

      stateUtil.isSelected(state, new Date(2013, 3, 20)).should.eql(true)
      stateUtil.isSelected(state, new Date(2013, 3, 20, 4, 20)).should.eql(true)

    })


    it('returns `false` if a certain date is not the same as the "selected" one with the scope as DAYS', () => {

      let state = {
        selected : new Date(2013, 3, 20),
        scope    : SCOPE.DAYS,
      }

      stateUtil.isSelected(state, new Date(2013, 3, 19)).should.eql(false)
      stateUtil.isSelected(state, new Date(2013, 5, 20)).should.eql(false)
      stateUtil.isSelected(state, new Date(2012, 3, 20, 4, 20)).should.eql(false)

    })


    it('returns `true` if a certain date is the same as the "selected" one with the scope as MONTHS', () => {

      let state = {
        selected : new Date(2013, 3, 20),
        scope    : SCOPE.MONTHS,
      }

      stateUtil.isSelected(state, new Date(2013, 3, 20)).should.eql(true)
      stateUtil.isSelected(state, new Date(2013, 3, 24)).should.eql(true)
      stateUtil.isSelected(state, new Date(2013, 3, 13, 4, 20)).should.eql(true)

    })


    it('returns `false` if a certain date is not the same as the "selected" one with the scope as MONTHS', () => {

      let state = {
        selected : new Date(2013, 3, 20),
        scope    : SCOPE.MONTHS,
      }

      stateUtil.isSelected(state, new Date(2013, 2, 20)).should.eql(false)
      stateUtil.isSelected(state, new Date(2013, 5, 20)).should.eql(false)
      stateUtil.isSelected(state, new Date(2012, 2, 29, 4, 20)).should.eql(false)

    })


    it('returns `true` if a certain date is the same as the "selected" one with the scope as YEARS', () => {

      let state = {
        selected : new Date(2013, 3, 20),
        scope    : SCOPE.YEARS,
      }

      stateUtil.isSelected(state, new Date(2013, 5, 20)).should.eql(true)
      stateUtil.isSelected(state, new Date(2013, 0, 24)).should.eql(true)
      stateUtil.isSelected(state, new Date(2013, 11, 13, 4, 20)).should.eql(true)

    })


    it('returns `false` if a certain date is not the same as the "selected" one with the scope as YEARS', () => {

      let state = {
        selected : new Date(2013, 3, 20),
        scope    : SCOPE.YEARS,
      }

      stateUtil.isSelected(state, new Date(2012, 3, 20)).should.eql(false)
      stateUtil.isSelected(state, new Date(2015, 5, 20)).should.eql(false)
      stateUtil.isSelected(state, new Date(2012, 2, 29, 4, 20)).should.eql(false)

    })

  })



  describe('#isToday', () => {

    it('returns `true` if a certain date is the same as "today" with the scope as DAYS', () => {

      let state = {
        today : new Date(2013, 3, 20),
        scope : SCOPE.DAYS,
      }

      stateUtil.isToday(state, new Date(2013, 3, 20)).should.eql(true)
      stateUtil.isToday(state, new Date(2013, 3, 20, 4, 20)).should.eql(true)

    })


    it('returns `false` if a certain date is not the same as "today" with the scope as DAYS', () => {

      let state = {
        today : new Date(2013, 3, 20),
        scope : SCOPE.DAYS,
      }

      stateUtil.isToday(state, new Date(2013, 3, 19)).should.eql(false)
      stateUtil.isToday(state, new Date(2013, 2, 20, 4, 20)).should.eql(false)

    })


    it('returns `false` if the scope is MONTHS', () => {

      let state = {
        today : new Date(2013, 3, 20),
        scope : SCOPE.MONTHS,
      }

      stateUtil.isToday(state, new Date(2013, 3, 20)).should.eql(false)

    })


    it('returns `false` if the scope is YEARS', () => {

      let state = {
        today : new Date(2013, 3, 20),
        scope : SCOPE.YEARS,
      }

      stateUtil.isToday(state, new Date(2013, 3, 20)).should.eql(false)

    })

  })


})