const lolex       = require('lolex')

const ACTION      = require('constants/action')
const LANGUAGE    = require('constants/language')
const viewReducer = require('reducers/view')



describe('/viewReducer', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the view’s date, defaulting to today', () => {

      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      const state   = undefined
      const payload = {}

      viewReducer[ACTION.TYPE.INITIALIZE](state, payload).should.eql(new Date(2014, 3, 1))

      clock.uninstall()

    })


    it('initializes the view’s date with a specific value', () => {

      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      const state   = new Date(2016, 8, 8)
      const payload = {}

      const view = viewReducer[ACTION.TYPE.INITIALIZE](state, payload)
      view.should.eql(new Date(2016, 8, 1))

      clock.uninstall()

    })


    it('initializes the view’s date with a specific payload value and template', () => {

      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      const state   = undefined
      const payload = { template: 'YYYY-MM-DD', value: '2014-04-20' }

      const view = viewReducer[ACTION.TYPE.INITIALIZE](state, payload)
      view.should.eql(new Date(2014, 3, 1))

      clock.uninstall()

    })

  })



  describe('#[ACTION.TYPE.SELECT]', () => {

    it('updates the view when a value is selected', () => {

      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      const state   = new Date(2016, 8, 8)
      const payload = { value: new Date(2011, 6, 11) }

      const view = viewReducer[ACTION.TYPE.SELECT](state, payload)
      view.should.eql(new Date(2011, 6, 1))

      clock.uninstall()

    })


    it('updates the view when a value is selected by parsing the value', () => {

      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      const state   = new Date(2016, 8, 8)
      const payload = {
        language : LANGUAGE.ENGLISH,
        template : 'D MMMM, YYYY',
        value    : '11 July, 2011',
      }

      const view = viewReducer[ACTION.TYPE.SELECT](state, payload)
      view.should.eql(new Date(2011, 6, 1))

      clock.uninstall()

    })


    it('returns the original state if there is no selected value', () => {

      const state   = new Date(2016, 8, 8)
      const payload = { value: null }

      const view = viewReducer[ACTION.TYPE.SELECT](state, payload)
      view.should.be.exactly(state)

    })


    it('returns the original state if the selected value is in the same month', () => {

      const state   = new Date(2016, 8, 8)
      const payload = { value: new Date(2016, 8, 24) }

      const view = viewReducer[ACTION.TYPE.SELECT](state, payload)
      view.should.be.exactly(state)

    })

  })



  describe('#[ACTION.TYPE.SHOW]', () => {

    it('handles all the same scenarios as [ACTION.TYPE.SELECT]', () => {
      viewReducer[ACTION.TYPE.SHOW].should.be.exactly(viewReducer[ACTION.TYPE.SELECT])
    })

  })


})
