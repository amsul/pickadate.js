let lolex        = require('lolex')

const ACTION     = require('constants/action')

let todayReducer = require('reducers/today')



describe('/todayReducer', () => {


  describe('#[ACTION.TYPE.INITIALIZE]', () => {

    it('initializes the date today', () => {
      let clock = lolex.install()
      todayReducer[ACTION.TYPE.INITIALIZE]().should.eql(new Date())
      clock.uninstall()
    })

  })


})