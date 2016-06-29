let jsUtil = require('utils/js')



describe('/jsUtil', () => {


  describe('#createRange', () => {

    it('creates a range from one index to another (inclusive)', () => {

      jsUtil.createRange(0, 3).should.eql([0, 1, 2, 3])
      jsUtil.createRange(2, 4).should.eql([2, 3, 4])

    })

  })


})