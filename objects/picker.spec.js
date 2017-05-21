const lolex         = require('lolex')
const sinon         = require('sinon')

const actions       = require('actions')
const ACTION        = require('constants/action')
const LANGUAGE      = require('constants/language')
const pickerObject  = require('objects/picker')
const animationUtil = require('utils/animation')
const stateUtil     = require('utils/state')



describe('/pickerObject', () => {


  describe('#create', () => {

    it('creates a picker', () => {

      // Create the picker
      const picker = pickerObject.create()

      // Ensure it returned the expected api
      picker.should.have.keys(
        'addStateListener',
        'dispatch',
        'getState',
        'getValue',
        'removeStateListener',

        // Actions
        'clear',
        'cycleScope',
        'disable',
        'enable',
        'select',
        'selectInNextPeriod',
        'selectInPreviousPeriod',
        'selectInTodayPeriod',
        'setFirstDay',
        'setLanguage',
      )

      // Ensure the methods are functions
      picker.addStateListener.should.be.an.instanceOf(Function)
      picker.dispatch.should.be.an.instanceOf(Function)
      picker.getState.should.be.an.instanceOf(Function)
      picker.getValue.should.be.an.instanceOf(Function)
      picker.removeStateListener.should.be.an.instanceOf(Function)

    })


    it('creates a picker with an initial state', () => {

      // Create a clock to prevent time from ticking
      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      // Create the picker
      const picker = pickerObject.create()

      // Ensure it has the expected state
      picker.getState().should.eql({
        ...stateUtil.getInitial(),
        today    : new Date(2014, 3, 20),
        view     : new Date(2014, 3, 1),
      })

      // Uninstall the clock
      clock.uninstall()

    })


    it('creates a picker with an initial payload', () => {

      // Create a clock to prevent time from ticking
      const clock = lolex.install(new Date(2014, 3, 20).getTime())

      // Create the payload
      const payload = {
        template : 'YYYY-MM-DD',
        selected : new Date(2012, 5, 4),
      }

      // Create the picker
      const picker = pickerObject.create({ payload })

      // Ensure it has the expected state
      picker.getState().should.eql({
        ...stateUtil.getInitial(),
        ...payload,
        today    : new Date(2014, 3, 20),
        view     : new Date(2012, 5, 1),
      })

      // Uninstall the clock
      clock.uninstall()

    })


    it('creates a picker with addons', () => {

      const addon1 = sinon.stub()
      const addon2 = sinon.stub()
      const addons = [addon1, addon2]

      // Create the picker
      const picker = pickerObject.create({ addons })

      // Ensure the addons were called as expected
      addon1.callCount.should.eql(1)
      addon1.lastCall.args.length.should.eql(1)
      addon1.lastCall.args[0].should.be.exactly(picker)
      addon2.callCount.should.eql(1)
      addon2.lastCall.args.length.should.eql(1)
      addon2.lastCall.args[0].should.be.exactly(picker)

    })


    it('creates a picker with a custom reducer', () => {

      const reducer = sinon.spy((state, action) => {
        if (action.type === 'ACTION_TYPE_TEST') {
          return {
            ...state,
            test: true,
          }
        }
        return state
      })

      // Create the picker
      const picker = pickerObject.create({ reducer })
      const state  = picker.getState()

      // Ensure the reducer was called as expected
      reducer.callCount.should.eql(1)
      reducer.lastCall.args.should.eql([
        state,
        {
          payload : {},
          type    : ACTION.TYPE.INITIALIZE,
        },
      ])

      // Dispatch an action to trigger the reducer
      const action = { type: 'ACTION_TYPE_TEST' }
      picker.dispatch(action)

      // Ensure the reducer was called as expected
      reducer.callCount.should.eql(2)
      reducer.lastCall.args.should.eql([state, action])

      // Ensure the state was updated as expected
      picker.getState().should.eql({
        ...state,
        test: true,
      })

    })



    describe('#getValue', () => {

      it('gets the value', () => {

        pickerObject
          .create()
          .getValue()
          .should.eql('')

        pickerObject
          .create({ payload: { selected: new Date(2014, 3, 20) } })
          .getValue()
          .should.eql('20 April, 2014')

      })


      it('gets the value using a custom template', () => {

        const picker = pickerObject.create({
          payload: { selected: new Date(2015, 7, 14) },
        })

        picker.getValue('YYYY-MM-DD').should.eql('2015-08-14')

      })


      it('gets the value using a custom language', () => {

        const picker = pickerObject.create({
          payload: { selected: new Date(2015, 7, 14) },
        })

        picker.getValue(undefined, LANGUAGE.FRENCH).should.eql('14 Août, 2015')

      })

    })



    describe('#dispatch', () => {

      it(
        'dispatches an action and notifies listeners ' +
        'on the next animation frame'
      , () => {

        // Stub out getFrame
        const getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        const picker = pickerObject.create()

        // Create the listener spy
        const listenerSpy = sinon.spy()

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
        const frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the listener was called
        listenerSpy.callCount.should.eql(1)
        listenerSpy.lastCall.args.length.should.eql(1)
        listenerSpy.lastCall.args[0].should.be.exactly(picker.getState())

        // Clean up the stub
        getFrameStub.restore()

      })


      it('dispatches an action that updates the state', () => {

        // Stub out getFrame
        const getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        const picker = pickerObject.create()

        // Grab the initial state
        const initialState = picker.getState()

        // Dispatch an action
        const value = new Date(2013, 3, 20)
        picker.dispatch(actions.select(value))

        // Grab the frame callback and trigger it
        const frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the state was updated as expected
        picker.getState().should.eql({
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
        const getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        const picker = pickerObject.create()

        // Create a few spies
        const listenerSpy1 = sinon.spy()
        const listenerSpy2 = sinon.spy()
        const listenerSpy3 = sinon.spy()

        // Add the state listeners
        picker.addStateListener(listenerSpy1)
        picker.addStateListener(listenerSpy2)
        picker.addStateListener(listenerSpy3)

        // Dispatch an action
        picker.dispatch({ type: 'ACTION_TYPE_TEST' })

        // Grab the frame callback and trigger it
        const frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure all the listeners were called with the state
        listenerSpy1.callCount.should.eql(1)
        listenerSpy1.lastCall.args.length.should.eql(1)
        listenerSpy1.lastCall.args[0].should.be.exactly(picker.getState())
        listenerSpy2.callCount.should.eql(1)
        listenerSpy2.lastCall.args.length.should.eql(1)
        listenerSpy2.lastCall.args[0].should.be.exactly(picker.getState())
        listenerSpy3.callCount.should.eql(1)
        listenerSpy3.lastCall.args.length.should.eql(1)
        listenerSpy3.lastCall.args[0].should.be.exactly(picker.getState())

        // Clean up the stub
        getFrameStub.restore()

      })


      it('is passed the previous state since the last notify', () => {

        // Stub out getFrame
        const getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        const picker = pickerObject.create()

        // Grab the initial state
        const initialState = picker.getState()

        // Create a spy
        const listenerSpy = sinon.spy()

        // Add the state listener
        picker.addStateListener(listenerSpy)

        // Dispatch several actions in sync
        Array.from(Array(10)).forEach(
          (_, index) => picker.select(new Date(2014, 3, 20 + index))
        )

        // Grab the frame callback and trigger it
        getFrameStub.lastCall.args[1]()

        // Ensure the listener was called with the initial state
        listenerSpy.callCount.should.eql(1)
        listenerSpy.lastCall.args.length.should.eql(1)
        listenerSpy.lastCall.args[0].should.be.exactly(initialState)

        // Grab the updated state
        const updatedState = picker.getState()

        // Dispatch several more actions in sync
        Array.from(Array(10)).forEach(
          (_, index) => picker.select(new Date(2014, 4, 20 + index))
        )

        // Grab the frame callback and trigger it
        getFrameStub.lastCall.args[1]()

        // Ensure the listener was called with the initial state
        listenerSpy.callCount.should.eql(2)
        listenerSpy.lastCall.args.length.should.eql(1)
        listenerSpy.lastCall.args[0].should.be.exactly(updatedState)

        // Clean up the stub
        getFrameStub.restore()

      })

    })



    describe('#removeStateListener', () => {

      it('removes a state listener', () => {

        // Stub out getFrame
        const getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        const picker = pickerObject.create()

        // Create a few spies
        const listenerSpy1 = sinon.spy()
        const listenerSpy2 = sinon.spy()
        const listenerSpy3 = sinon.spy()

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
        const frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure none of the listeners were called
        listenerSpy1.callCount.should.eql(0)
        listenerSpy2.callCount.should.eql(0)
        listenerSpy3.callCount.should.eql(0)

        // Clean up the stub
        getFrameStub.restore()

      })


      it('does nothing if the state listener is not bound', () => {

        // Stub out getFrame
        const getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        const picker = pickerObject.create()

        // Create a spy
        const listenerSpy = sinon.spy()

        // Dispatch an action
        picker.dispatch({ type: 'ACTION_TYPE_TEST' })

        // Remove the state listeners
        picker.removeStateListener(listenerSpy)

        // Grab the frame callback and trigger it
        const frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the listeners was not called
        listenerSpy.callCount.should.eql(0)

        // Clean up the stub
        getFrameStub.restore()

      })

    })



    /////////////
    // ACTIONS //
    /////////////



    describe('#clear', () => {
      it('is an overloaded method to clear the value', () => {

        // Create the picker
        const picker = pickerObject.create({
          payload: { selected: new Date(2015, 3, 20) },
        })

        // Stub out dispatch and spy on the clear action
        const dispatchStub = sinon.stub(picker, 'dispatch')
        const clearSpy     = sinon.spy(actions, 'clear')

        // Trigger the overloaded action
        picker.clear()

        // Ensure the action was called as expected
        clearSpy.callCount.should.eql(1)
        clearSpy.lastCall.args.should.eql([])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([clearSpy.lastCall.returnValue])

      })
    })



    describe('#cycleScope', () => {
      it('is an overloaded method to cycle the scope', () => {

        // Create the picker
        const picker = pickerObject.create()

        // Stub out dispatch and spy on the cycleScope action
        const dispatchStub  = sinon.stub(picker, 'dispatch')
        const cycleScopeSpy = sinon.spy(actions, 'cycleScope')

        // Trigger the overloaded action
        picker.cycleScope()

        // Ensure the action was called as expected
        cycleScopeSpy.callCount.should.eql(1)
        cycleScopeSpy.lastCall.args.should.eql([])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([
          cycleScopeSpy.lastCall.returnValue
        ])

      })
    })



    describe('#disable', () => {
      it('is an overloaded method to disable dates', () => {

        // Create the picker
        const picker = pickerObject.create()

        // Stub out dispatch and spy on the disable action
        const dispatchStub = sinon.stub(picker, 'dispatch')
        const disableSpy   = sinon.spy(actions, 'disable')

        // Trigger the overloaded action
        picker.disable(new Date(2015, 3, 20), 2, 5, new Date(1988, 7, 14))

        // Ensure the action was called as expected
        disableSpy.callCount.should.eql(1)
        disableSpy.lastCall.args.should.eql([new Date(2015, 3, 20), 2, 5, new Date(1988, 7, 14)])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([disableSpy.lastCall.returnValue])

      })
    })



    describe('#enable', () => {
      it('is an overloaded method to enable dates', () => {

        // Create the picker
        const picker = pickerObject.create()

        // Stub out dispatch and spy on the enable action
        const dispatchStub = sinon.stub(picker, 'dispatch')
        const enableSpy   = sinon.spy(actions, 'enable')

        // Trigger the overloaded action
        picker.enable(new Date(2015, 3, 20), 2, 5, new Date(1988, 7, 14))

        // Ensure the action was called as expected
        enableSpy.callCount.should.eql(1)
        enableSpy.lastCall.args.should.eql([new Date(2015, 3, 20), 2, 5, new Date(1988, 7, 14)])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([enableSpy.lastCall.returnValue])

      })
    })



    describe('#select', () => {
      it('is an overloaded method to select a date', () => {

        // Create the picker
        const picker = pickerObject.create()

        // Stub out dispatch and spy on the select action
        const dispatchStub = sinon.stub(picker, 'dispatch')
        const selectSpy    = sinon.spy(actions, 'select')

        // Trigger the overloaded action
        picker.select(new Date(2015, 3, 20))

        // Ensure the action was called as expected
        selectSpy.callCount.should.eql(1)
        selectSpy.lastCall.args.should.eql([new Date(2015, 3, 20)])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([selectSpy.lastCall.returnValue])

      })
    })



    describe('#selectInNextPeriod', () => {
      it('is an overloaded method to show the next view', () => {

        // Create the picker
        const picker = pickerObject.create()

        // Stub out dispatch and spy on the selectInNextPeriod action
        const dispatchStub = sinon.stub(picker, 'dispatch')
        const selectInNextPeriodSpy  = sinon.spy(actions, 'selectInNextPeriod')

        // Trigger the overloaded action
        picker.selectInNextPeriod()

        // Ensure the action was called as expected
        selectInNextPeriodSpy.callCount.should.eql(1)
        selectInNextPeriodSpy.lastCall.args.should.eql([])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([
          selectInNextPeriodSpy.lastCall.returnValue
        ])

      })
    })



    describe('#selectInPreviousPeriod', () => {
      it('is an overloaded method to show the previous view', () => {

        // Create the picker
        const picker = pickerObject.create()

        // Stub out dispatch and spy on the selectInPreviousPeriod action
        const dispatchStub = sinon.stub(picker, 'dispatch')
        const selectInPreviousPeriodSpy = sinon.spy(
          actions,
          'selectInPreviousPeriod'
        )

        // Trigger the overloaded action
        picker.selectInPreviousPeriod()

        // Ensure the action was called as expected
        selectInPreviousPeriodSpy.callCount.should.eql(1)
        selectInPreviousPeriodSpy.lastCall.args.should.eql([])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([
          selectInPreviousPeriodSpy.lastCall.returnValue
        ])

      })
    })



    describe('#selectInTodayPeriod', () => {
      it('is an overloaded method to show today', () => {

        // Create the picker
        const picker = pickerObject.create()

        // Stub out dispatch and spy on the selectInTodayPeriod action
        const dispatchStub = sinon.stub(picker, 'dispatch')
        const selectInTodayPeriodSpy = sinon.spy(actions, 'selectInTodayPeriod')

        // Trigger the overloaded action
        picker.selectInTodayPeriod()

        // Ensure the action was called as expected
        selectInTodayPeriodSpy.callCount.should.eql(1)
        selectInTodayPeriodSpy.lastCall.args.should.eql([])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([
          selectInTodayPeriodSpy.lastCall.returnValue
        ])

      })
    })



    describe('#setFirstDay', () => {
      it('is an overloaded method to set the first day', () => {

        // Create the picker
        const picker = pickerObject.create()

        // Stub out dispatch and spy on the setFirstDay action
        const dispatchStub   = sinon.stub(picker, 'dispatch')
        const setFirstDaySpy = sinon.spy(actions, 'setFirstDay')

        // Trigger the overloaded action
        picker.setFirstDay(3)

        // Ensure the action was called as expected
        setFirstDaySpy.callCount.should.eql(1)
        setFirstDaySpy.lastCall.args.should.eql([3])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([setFirstDaySpy.lastCall.returnValue])

      })
    })



    describe('#setLanguage', () => {
      it('is an overloaded method to set the language', () => {

        // Create the picker
        const picker = pickerObject.create()

        // Stub out dispatch and spy on the setLanguage action
        const dispatchStub   = sinon.stub(picker, 'dispatch')
        const setLanguageSpy = sinon.spy(actions, 'setLanguage')

        // Trigger the overloaded action
        picker.setLanguage(LANGUAGE.FRENCH)

        // Ensure the action was called as expected
        setLanguageSpy.callCount.should.eql(1)
        setLanguageSpy.lastCall.args.should.eql([LANGUAGE.FRENCH])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([setLanguageSpy.lastCall.returnValue])

      })
    })


  })


})
