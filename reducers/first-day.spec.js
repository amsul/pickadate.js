const ACTION          = require('constants/action')
const firstDayReducer = require('reducers/first-day')



describe('/firstDayReducer', () => {


  describe('#[ACTION.TYPE.SET_FIRST_DAY]', () => {

    it('sets the language', () => {

      const state   = 1
      const payload = { value: 4 }

      firstDayReducer[ACTION.TYPE.SET_FIRST_DAY](state, payload)
        .should.eql(4)

    })


    it('defaults to the original language', () => {

      const state   = 1
      const payload = { value: null }

      firstDayReducer[ACTION.TYPE.SET_FIRST_DAY](state, payload)
        .should.eql(1)

    })

  })


})
