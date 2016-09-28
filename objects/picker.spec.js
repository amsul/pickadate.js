let lolex           = require('lolex')
let sinon           = require('sinon')

const ACTION        = require('constants/action')
const STATE         = require('constants/state')

let actions         = require('actions')
let pickerObject    = require('objects/picker')
let disabledReducer = require('reducers/disabled')
let animationUtil   = require('utils/animation')



describe('/pickerObject', () => {


  describe('#create', () => {

    it('creates a picker', () => {

      // Create the picker
      let picker = pickerObject.create()

      // Ensure it returned the expected api
      picker.should.have.keys(
        'addStateListener',
        'dispatch',
        'getValue',
        'removeStateListener',
        'state',

        // Actions
        'clear',
        'confirm',
        'cycleScope',
        'disable',
        'enable',
        'select',
        'setLanguage',
        'show',
        'showNext',
        'showPrevious',
        'showToday',
      )

      // Ensure the methods are functions
      picker.addStateListener.should.be.an.instanceOf(Function)
      picker.dispatch.should.be.an.instanceOf(Function)
      picker.removeStateListener.should.be.an.instanceOf(Function)

      // Ensure the state is a getter
      let stateDescriptor = Object.getOwnPropertyDescriptor(picker, 'state')
      stateDescriptor.should.have.keys(
        'configurable',
        'enumerable',
        'get',
        'set',
      )
      stateDescriptor.configurable.should.eql(true)
      stateDescriptor.enumerable.should.eql(true)
      stateDescriptor.get.should.be.an.instanceOf(Function)
      true.should.eql(undefined === stateDescriptor.set)

    })


    it('creates a picker with an initial state', () => {

      // Create a clock to prevent time from ticking
      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      // Create the picker
      let picker = pickerObject.create()

      // Ensure it has the expected state
      picker.state.should.eql({
        ...STATE.INITIAL,
        disabled : disabledReducer[ACTION.TYPE.INITIALIZE](),
        today    : new Date(2014, 3, 20),
        view     : new Date(2014, 3, 1),
      })

      // Uninstall the clock
      clock.uninstall()

    })


    it('creates a picker with an initially changed state', () => {

      // Create a clock to prevent time from ticking
      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      // Create the initially changed state
      let initialChangedState = {
        view: new Date(2012, 5, 1)
      }

      // Create the picker
      let picker = pickerObject.create(initialChangedState)

      // Ensure it has the expected state
      picker.state.should.eql({
        ...STATE.INITIAL,
        ...initialChangedState,
        disabled : disabledReducer[ACTION.TYPE.INITIALIZE](),
        today: new Date(2014, 3, 20),
      })

      // Uninstall the clock
      clock.uninstall()

    })


    describe('#dispatch', () => {

      it('dispatches an action and notifies listeners on the next animation frame', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        let picker = pickerObject.create()

        // Create the listener spy
        let listenerSpy = sinon.spy()

        // Add a state listener
        picker.addStateListener(listenerSpy)

        // Dispatch an action
        picker.dispatch({ type: 'ACTION_TYPE_TEST' })

        // Ensure the spy hasn't been called yet
        listenerSpy.callCount.should.eql(0)

        // Ensure an animation frame was requested
        getFrameStub.callCount.should.eql(1)
        getFrameStub.lastCall.args.length.should.eql(2)
        true.should.eql(null === getFrameStub.lastCall.args[0])
        getFrameStub.lastCall.args[1].should.be.instanceOf(Function)

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the listener was called
        listenerSpy.callCount.should.eql(1)
        listenerSpy.lastCall.args.length.should.eql(1)
        listenerSpy.lastCall.args[0].should.be.exactly(picker.state)

        // Clean up the stub
        getFrameStub.restore()

      })


      it('dispatches an action that updates the state', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        let picker = pickerObject.create()

        // Grab the initial state
        let initialState = picker.state

        // Dispatch an action
        let value = new Date(2013, 3, 20)
        picker.dispatch(actions.select(picker.state, value))

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the state was updated as expected
        picker.state.should.eql({
          ...initialState,
          selected : new Date(2013, 3, 20),
          view     : new Date(2013, 3, 1),
        })

        // Clean up the stub
        getFrameStub.restore()

      })

    })


    describe('#addStateListener', () => {

      it('adds a state listener', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        let picker = pickerObject.create()

        // Create a few spies
        let listenerSpy1 = sinon.spy()
        let listenerSpy2 = sinon.spy()
        let listenerSpy3 = sinon.spy()

        // Add the state listeners
        picker.addStateListener(listenerSpy1)
        picker.addStateListener(listenerSpy2)
        picker.addStateListener(listenerSpy3)

        // Dispatch an action
        picker.dispatch({ type: 'ACTION_TYPE_TEST' })

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure all the callbacks were called with the state
        listenerSpy1.callCount.should.eql(1)
        listenerSpy1.lastCall.args.length.should.eql(1)
        listenerSpy1.lastCall.args[0].should.be.exactly(picker.state)
        listenerSpy2.callCount.should.eql(1)
        listenerSpy2.lastCall.args.length.should.eql(1)
        listenerSpy2.lastCall.args[0].should.be.exactly(picker.state)
        listenerSpy3.callCount.should.eql(1)
        listenerSpy3.lastCall.args.length.should.eql(1)
        listenerSpy3.lastCall.args[0].should.be.exactly(picker.state)

        // Clean up the stub
        getFrameStub.restore()

      })

    })


    describe('#removeStateListener', () => {

      it('removes a state listener', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        let picker = pickerObject.create()

        // Create a few spies
        let listenerSpy1 = sinon.spy()
        let listenerSpy2 = sinon.spy()
        let listenerSpy3 = sinon.spy()

        // Add the state listeners
        picker.addStateListener(listenerSpy1)
        picker.addStateListener(listenerSpy2)
        picker.addStateListener(listenerSpy3)

        // Dispatch an action
        picker.dispatch({ type: 'ACTION_TYPE_TEST' })

        // Remove the state listeners
        picker.removeStateListener(listenerSpy1)
        picker.removeStateListener(listenerSpy2)
        picker.removeStateListener(listenerSpy3)

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure none of the callbacks were called
        listenerSpy1.callCount.should.eql(0)
        listenerSpy2.callCount.should.eql(0)
        listenerSpy3.callCount.should.eql(0)

        // Clean up the stub
        getFrameStub.restore()

      })


      it('does nothing if the state listener is not bound', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        let picker = pickerObject.create()

        // Create a spy
        let listenerSpy = sinon.spy()

        // Dispatch an action
        picker.dispatch({ type: 'ACTION_TYPE_TEST' })

        // Remove the state listeners
        picker.removeStateListener(listenerSpy)

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the callbacks was not called
        listenerSpy.callCount.should.eql(0)

        // Clean up the stub
        getFrameStub.restore()

      })

    })

  })


})