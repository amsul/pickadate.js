const lolex         = require('lolex')
const sinon         = require('sinon')

const ACTION        = require('constants/action')
const domainReducer = require('reducers/domain')
const calendarUtil  = require('utils/calendar')



describe('/domainReducer.view', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the view’s date as today', () => {

      // Freeze time
      const clock = lolex.install()

      const state = {}

      // Create the mock expectation and return value
      const returnValue = new Date(2014, 3, 20)
      const calendarUtilMock = sinon.mock(calendarUtil)
      calendarUtilMock
        .expects('getStartDateOfMonth')
        .once()
        .withExactArgs(new Date())
        .returns(returnValue)

      const nextState = domainReducer
        .view[ACTION.TYPE.INITIALIZE](state)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ ...state, view: returnValue })

      calendarUtilMock.verify()

      // Clean up
      clock.uninstall()

    })


    it('initializes the view’s date as the selected date', () => {

      const state = {
        selected: new Date(1988, 7, 14)
      }

      // Create the mock expectation and return value
      const returnValue = new Date(2014, 3, 20)
      const calendarUtilMock = sinon.mock(calendarUtil)
      calendarUtilMock
        .expects('getStartDateOfMonth')
        .once()
        .withExactArgs(state.selected)
        .returns(returnValue)

      const nextState = domainReducer
        .view[ACTION.TYPE.INITIALIZE](state)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ ...state, view: returnValue })

      calendarUtilMock.verify()

    })

  })



  describe('#[ACTION.TYPE.SELECT]', () => {

    it('updates the view’s date when the selected date changes', () => {

      const state = {
        selected : new Date(1988, 7, 14),
        view     : new Date(1988, 9, 14),
      }

      // Create the mock expectation and return value
      const returnValue = new Date(2014, 3, 20)
      const calendarUtilMock = sinon.mock(calendarUtil)
      calendarUtilMock
        .expects('getStartDateOfMonth')
        .once()
        .withExactArgs(state.selected)
        .returns(returnValue)

      const nextState = domainReducer
        .view[ACTION.TYPE.SELECT](state)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ ...state, view: returnValue })

      calendarUtilMock.verify()

    })


    it('returns the original state if there is no selected date', () => {

      const state = {
        view: new Date(1988, 9, 14),
      }

      // Create the mock expectation and return value
      const calendarUtilMock = sinon.mock(calendarUtil)
      calendarUtilMock
        .expects('getStartDateOfMonth')
        .never()

      const nextState = domainReducer
        .view[ACTION.TYPE.SELECT](state)

      nextState.should.be.exactly(state)
      nextState.should.eql({ view: new Date(1988, 9, 14) })

      calendarUtilMock.verify()

    })


    it(
      'returns the original state if the selected date is in the same month',
    () => {

      const state = {
        selected : new Date(1988, 9, 20),
        view     : new Date(1988, 9, 14),
      }

      // Create the mock expectation and return value
      const calendarUtilMock = sinon.mock(calendarUtil)
      calendarUtilMock
        .expects('getStartDateOfMonth')
        .never()

      const nextState = domainReducer
        .view[ACTION.TYPE.SELECT](state)

      nextState.should.be.exactly(state)
      nextState.should.eql({
        selected : new Date(1988, 9, 20),
        view     : new Date(1988, 9, 14),
      })

      calendarUtilMock.verify()

    })

  })



  describe('#[ACTION.TYPE.SELECT_IN_PERIOD]', () => {

    it('uses the sample implementation as #[ACTION.TYPE.SELECT]', () => {
      domainReducer.view[ACTION.TYPE.SELECT_IN_PERIOD]
        .should.be.exactly(domainReducer.view[ACTION.TYPE.SELECT])
    })

  })


})
