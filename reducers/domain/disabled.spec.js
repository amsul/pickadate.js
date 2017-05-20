const ACTION        = require('constants/action')
const domainReducer = require('reducers/domain')



describe('/domainReducer.disabled', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the disabled dates, days, and exceptions', () => {

      const state = {}

      const nextState = domainReducer
        .disabled[ACTION.TYPE.INITIALIZE](state)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({
        disabled: {
          dates      : [],
          days       : [],
          exceptions : [],
        },
      })

    })


    it(
      'initializes the disabled dates, days, and exceptions with a payload',
    () => {

      const state   = {}
      const payload = {
        disabled: {
          dates      : [new Date(2014, 3, 20)],
          days       : [2, 4],
          exceptions : [2014, 4, 4],
        }
      }

      const nextState = domainReducer
        .disabled[ACTION.TYPE.INITIALIZE](state, payload)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({
        disabled: {
          dates      : [new Date(2014, 3, 20)],
          days       : [2, 4],
          exceptions : [2014, 4, 4],
        },
      })

    })

  })



  describe('#[ACTION.TYPE.DISABLE]', () => {

    it(
      'adds values to the disabled dates and days while avoiding duplicates ' +
      'and removing any from exceptions',
    () => {

      const state = {
        disabled: {
          dates      : [new Date(2019, 4, 15), new Date(2011, 7, 1)],
          days       : [1, 3],
          exceptions : [new Date(2010, 1, 4), new Date(2011, 1, 4)],
        },
      }

      const values = [
        new Date(2014, 3, 20),
        new Date(2011, 7, 1),
        new Date(2016, 7, 8),
        new Date(2010, 1, 4),
        3,
        5,
        6,
      ]

      const nextState = domainReducer
        .disabled[ACTION.TYPE.DISABLE](state, { values })

      nextState.should.not.be.exactly(state)
      nextState.should.eql({
        disabled: {
          dates: [
            ...state.disabled.dates,
            values[0],
            values[2],
            values[3],
          ],
          days: [
            ...state.disabled.days,
            values[5],
            values[6],
          ],
          exceptions: [state.disabled.exceptions[1]],
        },
      })

    })


    it('returns the original state if there are no changes', () => {

      const state = {
        disabled: {
          dates      : [new Date(2019, 4, 15), new Date(2011, 7, 1)],
          days       : [1, 3],
          exceptions : [new Date(2010, 1, 4), new Date(2011, 1, 4)],
        },
      }

      const values = [
        new Date(2011, 7, 1),
        3,
      ]

      const nextState = domainReducer
        .disabled[ACTION.TYPE.DISABLE](state, { values })

      nextState.should.be.exactly(state)
      nextState.should.eql({
        disabled: {
          dates      : [new Date(2019, 4, 15), new Date(2011, 7, 1)],
          days       : [1, 3],
          exceptions : [new Date(2010, 1, 4), new Date(2011, 1, 4)],
        },
      })

    })

  })



  describe('#[ACTION.TYPE.ENABLE]', () => {

    it(
      'removes values from the disabled dates and days ' +
      'while removing any from exceptions',
    () => {

      const state = {
        disabled: {
          dates      : [new Date(2019, 4, 15), new Date(2011, 7, 1)],
          days       : [1, 3],
          exceptions : [new Date(2011, 1, 4)],
        },
      }

      const values = [
        new Date(2014, 3, 20),
        new Date(2011, 7, 1),
        new Date(2016, 7, 8),
        3,
        5,
      ]

      const nextState = domainReducer
        .disabled[ACTION.TYPE.ENABLE](state, { values })

      nextState.should.not.be.exactly(state)
      nextState.should.eql({
        disabled: {
          dates      : [state.disabled.dates[0]],
          days       : [state.disabled.days[0]],
          exceptions : [
            state.disabled.exceptions[0],
            values[0],
            values[1],
            values[2],
          ],
        },
      })

    })


    it('returns the original state if there are no changes', () => {

      const state = {
        disabled: {
          dates      : [new Date(2019, 4, 15), new Date(2011, 7, 1)],
          days       : [1, 3],
          exceptions : [new Date(2010, 1, 4), new Date(2011, 1, 4)],
        },
      }

      const values = [
        new Date(2011, 1, 4),
        4,
      ]

      const nextState = domainReducer
        .disabled[ACTION.TYPE.ENABLE](state, { values })

      nextState.should.be.exactly(state)
      nextState.should.eql({
        disabled: {
          dates      : [new Date(2019, 4, 15), new Date(2011, 7, 1)],
          days       : [1, 3],
          exceptions : [new Date(2010, 1, 4), new Date(2011, 1, 4)],
        },
      })

    })

  })


})
