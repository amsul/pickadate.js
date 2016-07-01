const ACTION        = require('constants/action')

let selectedReducer = require('reducers/selected')



describe('/selectedReducer', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the selected date, defaulting to null', () => {
      true.should.eql(null == selectedReducer[ACTION.TYPE.INITIALIZE]())
    })


    it('initializes the selected date with a specific value', () => {
      let selected = new Date(2013, 3, 20)
      selectedReducer[ACTION.TYPE.INITIALIZE](selected).should.be.exactly(selected)
    })


    it('initializes the selected date with a specific epoch timestamp', () => {
      let selected = new Date(2013, 3, 20).getTime()
      selectedReducer[ACTION.TYPE.INITIALIZE](selected).getTime().should.be.eql(selected)
    })

  })



  describe('#[ACTION.TYPE.SELECT]', () => {

    it('sets the selected date', () => {
      let selected = new Date(2013, 3, 20).getTime()
      let payload  = { value: selected }
      selectedReducer[ACTION.TYPE.SELECT](null, payload).getTime().should.be.eql(selected)
    })


    it('uses the original state if the value is the same as the selected date', () => {
      let selected = new Date(2013, 3, 20)
      let payload  = { value: new Date(2013, 3, 20, 4, 20) }
      selectedReducer[ACTION.TYPE.SELECT](selected, payload).should.be.exactly(selected)
    })


    it('unsets the selected date', () => {
      let selected = new Date(2013, 3, 20)
      let payload  = { value: null }
      true.should.eql(null == selectedReducer[ACTION.TYPE.SELECT](selected, payload))
    })

  })


})