let sinon         = require('sinon')

let animationUtil = require('utils/animation')



describe('/animationUtil', () => {


  describe('#getFrame', () => {

    it('gets a new animation frame request while cancelling a previous frame request', () => {

      let cancelAnimationFrameSpy  = sinon.spy(window, 'cancelAnimationFrame')
      let requestAnimationFrameSpy = sinon.spy(window, 'requestAnimationFrame')

      let animationFrame = 1
      let callback       = () => {}

      let newAnimationFrame = animationUtil.getFrame(animationFrame, callback)

      cancelAnimationFrameSpy.callCount.should.eql(1)
      cancelAnimationFrameSpy.lastCall.args.should.eql([animationFrame])

      requestAnimationFrameSpy.callCount.should.eql(1)
      requestAnimationFrameSpy.lastCall.args.length.should.eql(1)
      requestAnimationFrameSpy.lastCall.args[0].should.be.exactly(callback)

      newAnimationFrame.should.be.instanceOf(Number)

    })

  })


})