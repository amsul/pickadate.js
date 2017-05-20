const lolex         = require('lolex')

const ACTION        = require('constants/action')
const PERIOD        = require('constants/period')
const SCOPE         = require('constants/scope')
const domainReducer = require('reducers/domain')
const stateUtil     = require('utils/state')



describe('/domainReducer.selected', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the selected date', () => {

      const state    = stateUtil.getInitial()
      const selected = new Date(2014, 3, 20)

      const nextState = domainReducer
        .selected[ACTION.TYPE.INITIALIZE](state, { selected })

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ ...state, selected })

    })


    it('initializes the selected date by parsing a string', () => {

      const state    = stateUtil.getInitial()
      const selected = '20 April, 2014'

      const nextState = domainReducer
        .selected[ACTION.TYPE.INITIALIZE](state, { selected })

      nextState.should.not.be.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(2014, 3, 20),
      })

    })


    it('initializes the selected date using a unix timestamp', () => {

      const state    = stateUtil.getInitial()
      const selected = new Date(2014, 3, 20).getTime()

      const nextState = domainReducer
        .selected[ACTION.TYPE.INITIALIZE](state, { selected })

      nextState.should.not.be.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(2014, 3, 20),
      })

    })


    it('returns the original state if there is no value', () => {

      // Freeze time
      const clock = lolex.install()

      const state    = stateUtil.getInitial()
      const selected = null

      const nextState = domainReducer
        .selected[ACTION.TYPE.INITIALIZE](state, { selected })

      nextState.should.be.exactly(state)
      nextState.should.eql(stateUtil.getInitial())

      // Clean up
      clock.uninstall()

    })


    it('returns the original state if the value is disabled', () => {

      // Freeze time
      const clock = lolex.install()

      const state = stateUtil.getInitial({
        disabled: {
          dates: [new Date(2014, 3, 20)]
        }
      })
      const selected = new Date(2014, 3, 20)

      const nextState = domainReducer
        .selected[ACTION.TYPE.INITIALIZE](state, { selected })

      nextState.should.be.exactly(state)
      nextState.should.eql(stateUtil.getInitial({
        disabled: {
          dates: [new Date(2014, 3, 20)]
        }
      }))

      // Clean up
      clock.uninstall()

    })

  })



  describe('#[ACTION.TYPE.SELECT]', () => {

    it('sets the selected date', () => {

      const state = stateUtil.getInitial()
      const value = new Date(2014, 3, 20)

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT](state, { value })

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ ...state, selected: value })

    })


    it('sets the selected date by parsing a string', () => {

      const state = stateUtil.getInitial()
      const value = '20 April, 2014'

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT](state, { value })

      nextState.should.not.be.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(2014, 3, 20),
      })

    })


    it(
      'returns the original state if there is no value nor selected date',
    () => {

      // Freeze time
      const clock = lolex.install()

      const state = stateUtil.getInitial()
      const value = null

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT](state, { value })

      nextState.should.be.exactly(state)
      nextState.should.eql(stateUtil.getInitial())

      // Clean up
      clock.uninstall()

    })


    it(
      'returns the original state if the value is the same as the selected',
    () => {

      // Freeze time
      const clock = lolex.install()

      const state = stateUtil.getInitial({
        selected: new Date(2014, 3, 20)
      })

      domainReducer
        .selected[ACTION.TYPE.SELECT](state, { value: '20 April, 2014' })
        .should.eql(stateUtil.getInitial({
          selected: new Date(2014, 3, 20)
        }))

      domainReducer
        .selected[ACTION.TYPE.SELECT](state, { value: new Date(2014, 3, 20) })
        .should.eql(stateUtil.getInitial({
          selected: new Date(2014, 3, 20)
        }))

      domainReducer
        .selected[ACTION.TYPE.SELECT](state, {
          value: new Date(2014, 3, 20).getTime()
        })
        .should.eql(stateUtil.getInitial({
          selected: new Date(2014, 3, 20)
        }))

      // Clean up
      clock.uninstall()

    })


    it('returns the original state if the value is disabled', () => {

      // Freeze time
      const clock = lolex.install()

      const state = stateUtil.getInitial({
        disabled: {
          dates: [new Date(2014, 3, 20)]
        }
      })
      const selected = new Date(2014, 3, 20)

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT](state, { selected })

      nextState.should.be.exactly(state)
      nextState.should.eql(stateUtil.getInitial({
        disabled: {
          dates: [new Date(2014, 3, 20)]
        }
      }))

      // Clean up
      clock.uninstall()

    })


    it('clears the selected date if there is no value', () => {

      const state = stateUtil.getInitial({
        selected: new Date(2014, 3, 20)
      })
      const value = null

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT](state, { value })

      nextState.should.not.be.exactly(state)
      nextState.should.eql({
        ...state,
        selected: null,
      })

    })

  })



  describe('#[ACTION.TYPE.SELECT_IN_PERIOD]', () => {

    it(
      'sets the selected date in the PREVIOUS period with scope as DAYS',
    () => {

      // Freeze time
      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      const state  = stateUtil.getInitial()
      const period = PERIOD.ID.PREVIOUS

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT_IN_PERIOD](state, { period })

      nextState.should.be.not.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(2014, 2, 20),
      })

      // Clean up
      clock.uninstall()

    })


    it(
      'sets the selected date in the PREVIOUS period with scope as MONTHS',
    () => {

      // Freeze time
      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      const state = stateUtil.getInitial({
        scope: SCOPE.MONTHS
      })
      const period = PERIOD.ID.PREVIOUS

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT_IN_PERIOD](state, { period })

      nextState.should.be.not.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(2013, 3, 20),
      })

      // Clean up
      clock.uninstall()

    })


    it(
      'sets the selected date in the PREVIOUS period with scope as YEARS',
    () => {

      // Freeze time
      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      const state = stateUtil.getInitial({
        scope: SCOPE.YEARS
      })
      const period = PERIOD.ID.PREVIOUS

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT_IN_PERIOD](state, { period })

      nextState.should.be.not.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(2004, 3, 20),
      })

      // Clean up
      clock.uninstall()

    })


    it('sets the selected date in the NEXT period with scope as DAYS', () => {

      // Freeze time
      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      const state  = stateUtil.getInitial()
      const period = PERIOD.ID.NEXT

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT_IN_PERIOD](state, { period })

      nextState.should.be.not.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(2014, 4, 20),
      })

      // Clean up
      clock.uninstall()

    })


    it(
      'sets the selected date in the NEXT period with scope as MONTHS',
    () => {

      // Freeze time
      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      const state = stateUtil.getInitial({
        scope: SCOPE.MONTHS
      })
      const period = PERIOD.ID.NEXT

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT_IN_PERIOD](state, { period })

      nextState.should.be.not.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(2015, 3, 20),
      })

      // Clean up
      clock.uninstall()

    })


    it(
      'sets the selected date in the NEXT period with scope as YEARS',
    () => {

      // Freeze time
      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      const state = stateUtil.getInitial({
        scope: SCOPE.YEARS
      })
      const period = PERIOD.ID.NEXT

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT_IN_PERIOD](state, { period })

      nextState.should.be.not.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(2024, 3, 20),
      })

      // Clean up
      clock.uninstall()

    })


    it('sets the selected date in the TODAY period with scope as DAYS', () => {

      // Freeze time
      const clock = lolex.install()

      const state  = stateUtil.getInitial()
      const period = PERIOD.ID.TODAY

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT_IN_PERIOD](state, { period })

      nextState.should.be.not.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(),
      })

      // Clean up
      clock.uninstall()

    })


    it(
      'sets the selected date in the TODAY period with scope as MONTHS',
    () => {

      // Freeze time
      const clock = lolex.install()

      const state = stateUtil.getInitial({
        scope: SCOPE.MONTHS
      })
      const period = PERIOD.ID.TODAY

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT_IN_PERIOD](state, { period })

      nextState.should.be.not.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(),
      })

      // Clean up
      clock.uninstall()

    })


    it(
      'sets the selected date in the TODAY period with scope as YEARS',
    () => {

      // Freeze time
      const clock = lolex.install()

      const state = stateUtil.getInitial({
        scope: SCOPE.YEARS
      })
      const period = PERIOD.ID.TODAY

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT_IN_PERIOD](state, { period })

      nextState.should.be.not.exactly(state)
      nextState.should.eql({
        ...state,
        selected: new Date(),
      })

      // Clean up
      clock.uninstall()

    })


    it('sets the closest date in the period if the specific date is disabled')


    it('sets the nothing in the period if the whole period is disabled')


    it('returns the original state for an unknown period', () => {

      // Freeze time
      const clock = lolex.install()

      const state  = stateUtil.getInitial()
      const period = null

      const nextState = domainReducer
        .selected[ACTION.TYPE.SELECT_IN_PERIOD](state, { period })

      nextState.should.be.exactly(state)
      nextState.should.eql(stateUtil.getInitial())

      // Clean up
      clock.uninstall()

    })

  })


})
