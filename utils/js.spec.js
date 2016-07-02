let jsUtil = require('utils/js')



describe('/jsUtil', () => {


  describe('#createRange', () => {

    it('creates a range from one index to another (inclusive)', () => {

      jsUtil.createRange(0, 3).should.eql([0, 1, 2, 3])
      jsUtil.createRange(2, 4).should.eql([2, 3, 4])

    })

  })



  describe('#padZero', () => {

    it('pads a number with leading zeros to get a certain digits count', () => {

      jsUtil.padZero(5, 2).should.eql('05')
      jsUtil.padZero(5, 4).should.eql('0005')
      jsUtil.padZero(237, 4).should.eql('0237')
      jsUtil.padZero(1237, 4).should.eql('1237')
      jsUtil.padZero(51237, 4).should.eql('51237')

      jsUtil.padZero('5', 2).should.eql('05')
      jsUtil.padZero('5', 4).should.eql('0005')
      jsUtil.padZero('237', 4).should.eql('0237')
      jsUtil.padZero('1237', 4).should.eql('1237')
      jsUtil.padZero('51237', 4).should.eql('51237')

    })

  })


})