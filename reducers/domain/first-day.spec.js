const ACTION        = require('constants/action')
const domainReducer = require('reducers/domain')



describe('/domainReducer.firstDay', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('sets the first day of the week', () => {

      const state   = { firstDay: 1 }
      const payload = { firstDay: 4 }

      const nextState = domainReducer
        .firstDay[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ firstDay: 4 })

    })


    it('sets the first day of the week within the range', () => {

      const state = { firstDay: 1 }

      domainReducer
        .firstDay[ACTION.TYPE.INITIALIZE](state, { firstDay: 7 })
        .should.eql({ firstDay: 0 })

      domainReducer
        .firstDay[ACTION.TYPE.INITIALIZE](state, { firstDay: 11 })
        .should.eql({ firstDay: 4 })

    })


    it('defaults to the original state if no value is passed', () => {

      const state   = { firstDay: 1 }
      const payload = { firstDay: null }

      const nextState = domainReducer
        .firstDay[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.be.exactly(state)
      nextState.should.eql({ firstDay: 1 })

    })


    it('defaults to the original state if unchanged', () => {

      const state   = { firstDay: 1 }
      const payload = { firstDay: 1 }

      const nextState = domainReducer
        .firstDay[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.be.exactly(state)
      nextState.should.eql({ firstDay: 1 })

    })


    it('defaults to the original state if unchanged within the range', () => {

      const state   = { firstDay: 1 }
      const payload = { firstDay: 8 }

      const nextState = domainReducer
        .firstDay[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.be.exactly(state)
      nextState.should.eql({ firstDay: 1 })

    })
  })



  describe('#[ACTION.TYPE.SET_FIRST_DAY]', () => {

    it('uses the sample implementation as #[ACTION.TYPE.INITIALIZE]', () => {
      domainReducer.firstDay[ACTION.TYPE.SET_FIRST_DAY]
        .should.be.exactly(domainReducer.firstDay[ACTION.TYPE.INITIALIZE])
    })

  })


})
