const sinon       = require('sinon')

const reducerUtil = require('utils/reducer')



describe('/reducerUtil', () => {


  describe('#reduceAll', () => {

    it('reduces a state by all reducers for a particular action type', () => {

      const firstState  = { one: true }
      const secondState = { two: true }
      const thirdState  = { three: true }

      const action = {
        payload : {},
        type    : 'ACTION_TYPE_TEST',
      }

      const reducerSpy1 = sinon.spy((state, payload) => secondState)
      const reducerSpy2 = sinon.spy((state, payload) => thirdState)
      const reducerSpy3 = sinon.spy()
      const reducerSpy4 = sinon.spy()

      const reducers = [
        {
          [action.type]          : reducerSpy1,
          ['ACTION_TYPE_TEST_2'] : reducerSpy3,
        },
        {
          [action.type]          : reducerSpy2,
          ['ACTION_TYPE_TEST_3'] : reducerSpy4,
        },
      ]

      const reducedState = reducerUtil.reduceAll(firstState, action, reducers)

      reducerSpy1.callCount.should.eql(1)
      reducerSpy1.lastCall.args.should.eql([firstState, action.payload])
      reducerSpy1.lastCall.args[0].should.be.exactly(firstState)
      reducerSpy1.lastCall.args[1].should.be.exactly(action.payload)

      reducerSpy2.callCount.should.eql(1)
      reducerSpy2.lastCall.args.should.eql([secondState, action.payload])
      reducerSpy2.lastCall.args[0].should.be.exactly(secondState)
      reducerSpy2.lastCall.args[1].should.be.exactly(action.payload)

      reducerSpy3.callCount.should.eql(0)
      reducerSpy4.callCount.should.eql(0)

      reducedState.should.eql(thirdState)
      reducedState.should.be.exactly(thirdState)

    })

  })


})
