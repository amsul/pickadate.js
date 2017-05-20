const lolex         = require('lolex')

const ACTION        = require('constants/action')
const domainReducer = require('reducers/domain')



describe('/domainReducer.today', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the date today', () => {

      // Freeze time
      const clock = lolex.install()

      const state = {}

      const nextState = domainReducer
        .today[ACTION.TYPE.INITIALIZE](state)

      nextState.should.not.be.exactly(state)
      nextState.should.eql({ today: new Date() })

      // Clean up
      clock.uninstall()

    })

  })


})
