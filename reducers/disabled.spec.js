const ACTION        = require('constants/action')

let disabledReducer = require('reducers/disabled')



describe('/disabledReducer', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the disabled dates, days, and exceptions', () => {
      disabledReducer[ACTION.TYPE.INITIALIZE]().should.eql({
        dates      : [],
        days       : [],
        exceptions : [],
      })
    })

  })



  describe('#[ACTION.TYPE.DISABLE]', () => {

    it('adds values to the disabled dates and days while also removing it from the exceptions', () => {

      let state = {
        dates      : [],
        days       : [],
        exceptions : [new Date(2014, 5, 10), new Date(2014, 5, 11)],
      }

      let payload = {
        values: [1, 2, new Date(2014, 3, 20), new Date(2014, 5, 10)]
      }

      disabledReducer[ACTION.TYPE.DISABLE](state, payload).should.eql({
        dates      : [new Date(2014, 3, 20), new Date(2014, 5, 10)],
        days       : [1, 2],
        exceptions : [new Date(2014, 5, 11)],
      })

    })


    it('returns the original state if none of the values change', () => {

      let state = {
        dates      : [new Date(2014, 3, 20), new Date(2014, 5, 10)],
        days       : [1, 2],
        exceptions : [new Date(2014, 5, 11)],
      }

      let payload = {
        values: [1, 2, new Date(2014, 3, 20), new Date(2014, 5, 10)]
      }

      let nextState = disabledReducer[ACTION.TYPE.DISABLE](state, payload)

      nextState.should.be.exactly(state)
      nextState.should.eql({
        dates      : [new Date(2014, 3, 20), new Date(2014, 5, 10)],
        days       : [1, 2],
        exceptions : [new Date(2014, 5, 11)],
      })

    })

  })



  describe('#[ACTION.TYPE.ENABLE]', () => {

    it('removes values from the disabled dates and days while also adding it to the exceptions', () => {

      let state = {
        dates      : [new Date(2014, 5, 10), new Date(2014, 5, 11)],
        days       : [1, 2, 3],
        exceptions : [],
      }

      let payload = {
        values: [1, 2, new Date(2014, 3, 20), new Date(2014, 5, 10)]
      }

      disabledReducer[ACTION.TYPE.ENABLE](state, payload).should.eql({
        dates      : [new Date(2014, 5, 11)],
        days       : [3],
        exceptions : [new Date(2014, 3, 20), new Date(2014, 5, 10)],
      })

    })


    it('returns the original state if none of the values change', () => {

      let state = {
        dates      : [new Date(2014, 5, 11)],
        days       : [3],
        exceptions : [new Date(2014, 3, 20), new Date(2014, 5, 10)],
      }

      let payload = {
        values: [1, 2, new Date(2014, 3, 20), new Date(2014, 5, 10)]
      }

      let nextState = disabledReducer[ACTION.TYPE.ENABLE](state, payload)

      nextState.should.be.exactly(state)
      nextState.should.eql({
        dates      : [new Date(2014, 5, 11)],
        days       : [3],
        exceptions : [new Date(2014, 3, 20), new Date(2014, 5, 10)],
      })

    })

  })


})