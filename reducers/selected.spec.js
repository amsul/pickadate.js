const ACTION        = require('constants/action')

let selectedReducer = require('reducers/selected')



describe('/selectedReducer', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the selected date, defaulting to null', () => {
      let state   = undefined
      let payload = {}
      true.should.eql(null == selectedReducer[ACTION.TYPE.INITIALIZE](state, payload))
    })


    it('initializes the selected date with a specific value', () => {
      let state   = new Date(2013, 3, 20)
      let payload = {}
      selectedReducer[ACTION.TYPE.INITIALIZE](state, payload).should.be.exactly(state)
    })


    it('initializes the selected date with a specific epoch timestamp', () => {
      let state   = new Date(2013, 3, 20).getTime()
      let payload = {}
      selectedReducer[ACTION.TYPE.INITIALIZE](state, payload).getTime().should.eql(state)
    })


    it('initializes the selected date with a specific payload value and template', () => {
      let state   = undefined
      let payload = { template: 'yyyy-mm-dd', value: '2014-04-20' }
      selectedReducer[ACTION.TYPE.INITIALIZE](state, payload).should.eql(new Date(2014, 3, 20))
    })

  })



  describe('#[ACTION.TYPE.SELECT]', () => {

    it('sets the selected date', () => {
      let state   = new Date(2013, 3, 20).getTime()
      let payload = { value: state }
      selectedReducer[ACTION.TYPE.SELECT](null, payload).getTime().should.be.eql(state)
    })


    it('uses the original state if the value is the same as the selected date', () => {
      let state   = new Date(2013, 3, 20)
      let payload = { value: new Date(2013, 3, 20, 4, 20) }
      selectedReducer[ACTION.TYPE.SELECT](state, payload).should.be.exactly(state)
    })


    it('unsets the selected date', () => {
      let state   = new Date(2013, 3, 20)
      let payload = { value: null }
      true.should.eql(null == selectedReducer[ACTION.TYPE.SELECT](state, payload))
    })

  })


})