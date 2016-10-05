const ACTION        = require('constants/action')

let firstDayReducer = require('reducers/first-day')



describe('/firstDayReducer', () => {


  describe('#[ACTION.TYPE.SET_FIRST_DAY]', () => {

    it('sets the language', () => {

      let state   = 1
      let payload = { value: 4 }

      firstDayReducer[ACTION.TYPE.SET_FIRST_DAY](state, payload)
        .should.eql(4)

    })


    it('defaults to the original language', () => {

      let state   = 1
      let payload = { value: null }

      firstDayReducer[ACTION.TYPE.SET_FIRST_DAY](state, payload)
        .should.eql(1)

    })

  })


})