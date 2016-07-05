let lolex       = require('lolex')

const ACTION    = require('constants/action')
const SCOPE     = require('constants/scope')

let viewReducer = require('reducers/view')



describe('/viewReducer', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the view’s date, defaulting to today', () => {

      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      let state   = undefined
      let payload = {}

      viewReducer[ACTION.TYPE.INITIALIZE](state, payload).should.eql(new Date(2014, 3, 1))

      clock.uninstall()

    })


    it('initializes the view’s date with a specific value', () => {

      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      let state   = new Date(2016, 8, 8)
      let payload = {}

      let view = viewReducer[ACTION.TYPE.INITIALIZE](state, payload)
      view.should.eql(new Date(2016, 8, 1))

      clock.uninstall()

    })


    it('initializes the view’s date with a specific payload value and template', () => {

      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      let state   = undefined
      let payload = { template: 'yyyy-mm-dd', value: '2014-04-20' }

      let view = viewReducer[ACTION.TYPE.INITIALIZE](state, payload)
      view.should.eql(new Date(2014, 3, 1))

      clock.uninstall()

    })

  })



  describe('#[ACTION.TYPE.SHOW_NEXT_VIEW]', () => {

    it('shows the next view with the scope as DAYS', () => {

      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      let state   = new Date(2016, 8, 8)
      let payload = { scope: SCOPE.DAYS }

      let view = viewReducer[ACTION.TYPE.SHOW_NEXT_VIEW](state, payload)
      view.should.eql(new Date(2016, 9, 1))

      clock.uninstall()

    })


    it('shows the next view with the scope as MONTHS', () => {

      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      let state   = new Date(2016, 8, 8)
      let payload = { scope: SCOPE.MONTHS }

      let view = viewReducer[ACTION.TYPE.SHOW_NEXT_VIEW](state, payload)
      view.should.eql(new Date(2017, 8, 1))

      clock.uninstall()

    })


    it('shows the next view with the scope as YEARS', () => {

      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      let state   = new Date(2016, 8, 8)
      let payload = { scope: SCOPE.YEARS }

      let view = viewReducer[ACTION.TYPE.SHOW_NEXT_VIEW](state, payload)
      view.should.eql(new Date(2026, 8, 1))

      clock.uninstall()

    })

  })



  describe('#[ACTION.TYPE.SHOW_PREVIOUS_VIEW]', () => {

    it('shows the next view with the scope as DAYS', () => {

      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      let state   = new Date(2016, 8, 8)
      let payload = { scope: SCOPE.DAYS }

      let view = viewReducer[ACTION.TYPE.SHOW_PREVIOUS_VIEW](state, payload)
      view.should.eql(new Date(2016, 7, 1))

      clock.uninstall()

    })


    it('shows the next view with the scope as MONTHS', () => {

      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      let state   = new Date(2016, 8, 8)
      let payload = { scope: SCOPE.MONTHS }

      let view = viewReducer[ACTION.TYPE.SHOW_PREVIOUS_VIEW](state, payload)
      view.should.eql(new Date(2015, 8, 1))

      clock.uninstall()

    })


    it('shows the next view with the scope as YEARS', () => {

      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      let state   = new Date(2016, 8, 8)
      let payload = { scope: SCOPE.YEARS }

      let view = viewReducer[ACTION.TYPE.SHOW_PREVIOUS_VIEW](state, payload)
      view.should.eql(new Date(2006, 8, 1))

      clock.uninstall()

    })

  })



  describe('#[ACTION.TYPE.SHOW_VIEW]', () => {

    it('shows a specific view', () => {

      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      let state   = new Date(2016, 8, 8)
      let payload = { view: new Date(2011, 6, 11) }

      let view = viewReducer[ACTION.TYPE.SHOW_VIEW](state, payload)
      view.should.eql(new Date(2011, 6, 1))

      clock.uninstall()

    })

  })



  describe('#[ACTION.TYPE.SELECT]', () => {

    it('updates a view when a value is selected', () => {

      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      let state   = new Date(2016, 8, 8)
      let payload = { value: new Date(2011, 6, 11) }

      let view = viewReducer[ACTION.TYPE.SELECT](state, payload)
      view.should.eql(new Date(2011, 6, 1))

      clock.uninstall()

    })


    it('returns the original state if there is no selected value', () => {

      let state   = new Date(2016, 8, 8)
      let payload = { value: null }

      let view = viewReducer[ACTION.TYPE.SELECT](state, payload)
      view.should.be.exactly(state)

    })


    it('returns the original state if the selected value is in the same month', () => {

      let state   = new Date(2016, 8, 8)
      let payload = { value: new Date(2016, 8, 24) }

      let view = viewReducer[ACTION.TYPE.SELECT](state, payload)
      view.should.be.exactly(state)

    })

  })


})