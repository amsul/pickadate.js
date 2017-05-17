const sinon         = require('sinon')

const animationUtil = require('utils/animation')



describe('/animationUtil', () => {


  describe('#getFrame', () => {

    it('gets a new animation frame request while cancelling a previous frame request', () => {

      const cancelAnimationFrameSpy  = sinon.spy(window, 'cancelAnimationFrame')
      const requestAnimationFrameSpy = sinon.spy(window, 'requestAnimationFrame')

      const animationFrame = 1
      const callback       = () => {}

      const newAnimationFrame = animationUtil.getFrame(animationFrame, callback)

      cancelAnimationFrameSpy.callCount.should.eql(1)
      cancelAnimationFrameSpy.lastCall.args.should.eql([animationFrame])

      requestAnimationFrameSpy.callCount.should.eql(1)
      requestAnimationFrameSpy.lastCall.args.length.should.eql(1)
      requestAnimationFrameSpy.lastCall.args[0].should.be.exactly(callback)

      newAnimationFrame.should.be.instanceOf(Number)

    })

  })


})
