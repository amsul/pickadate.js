let lolex           = require('lolex')
let sinon           = require('sinon')

const ACTION        = require('constants/action')
const LANGUAGE      = require('constants/language')
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
        'getState',
        'getValue',
        'removeStateListener',

        // Actions
        'clear',
        'cycleScope',
        'disable',
        'enable',
        'select',
        'setFirstDay',
        'setLanguage',
        'show',
        'showNext',
        'showPrevious',
        'showToday',
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
      let clock = lolex.install(new Date(2014, 3, 20).getTime())

      // Create the picker
      let picker = pickerObject.create()

      // Ensure it has the expected state
      picker.getState().should.eql({
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
      let stateChanges = {
        view: new Date(2012, 5, 1)
      }

      // Create the picker
      let picker = pickerObject.create(stateChanges)

      // Ensure it has the expected state
      picker.getState().should.eql({
        ...STATE.INITIAL,
        ...stateChanges,
        disabled : disabledReducer[ACTION.TYPE.INITIALIZE](),
        today: new Date(2014, 3, 20),
      })

      // Uninstall the clock
      clock.uninstall()

    })


    it('creates a picker with addons', () => {

      let addon1 = sinon.stub()
      let addon2 = sinon.stub()
      let addons = [addon1, addon2]

      // Create the picker
      let picker = pickerObject.create(undefined, { addons })

      // Ensure the addons were called as expected
      addon1.callCount.should.eql(1)
      addon1.lastCall.args.length.should.eql(1)
      addon1.lastCall.args[0].should.be.exactly(picker)
      addon2.callCount.should.eql(1)
      addon2.lastCall.args.length.should.eql(1)
      addon2.lastCall.args[0].should.be.exactly(picker)

    })


    it('creates a picker with a custom reducer', () => {

      let reducer = sinon.spy((state, action) => {
        if (action.type === 'ACTION_TYPE_TEST') {
          return {
            ...state,
            test: true
          }
        }
        return state
      })

      // Create the picker
      let picker = pickerObject.create(undefined, { reducer })
      let state  = picker.getState()

      // Ensure the reducer was called as expected
      reducer.callCount.should.eql(1)
      reducer.lastCall.args.should.eql([
        state,
        {
          payload: {
            language : state.language,
            template : state.template,
            value    : state.selected,
          },
          type: ACTION.TYPE.INITIALIZE,
        }
      ])

      // Dispatch an action to trigger the reducer
      let action = { type: 'ACTION_TYPE_TEST' }
      picker.dispatch(action)

      // Ensure the reducer was called as expected
      reducer.callCount.should.eql(2)
      reducer.lastCall.args.should.eql([state, action])

      // Ensure the state was updated as expected
      picker.getState().should.eql({
        ...state,
        test: true
      })

    })



    describe('#getValue', () => {

      it('gets the value', () => {

        pickerObject
          .create()
          .getValue()
          .should.eql('')

        pickerObject
          .create({ selected: new Date(2014, 3, 20) })
          .getValue()
          .should.eql('20 April, 2014')

      })


      it('gets the value using a custom template', () => {

        let picker = pickerObject.create({
          selected: new Date(2015, 7, 14)
        })

        picker.getValue('YYYY-MM-DD').should.eql('2015-08-14')

      })


      it('gets the value using a custom language', () => {

        let picker = pickerObject.create({
          selected: new Date(2015, 7, 14)
        })

        picker.getValue(undefined, LANGUAGE.FRENCH).should.eql('14 Août, 2015')

      })

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
        listenerSpy.lastCall.args[0].should.be.exactly(picker.getState())

        // Clean up the stub
        getFrameStub.restore()

      })


      it('dispatches an action that updates the state', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the picker
        let picker = pickerObject.create()

        // Grab the initial state
        let initialState = picker.getState()

        // Dispatch an action
        let value = new Date(2013, 3, 20)
        picker.dispatch(actions.select(picker.getState(), value))

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
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



    /////////////
    // ACTIONS //
    /////////////



    describe('#clear', () => {
      it('is an overloaded method to clear the value', () => {

        // Create the picker
        let picker = pickerObject.create({ selected: new Date(2015, 3, 20) })

        // Stub out dispatch and spy on the clear action
        let dispatchStub = sinon.stub(picker, 'dispatch')
        let clearSpy     = sinon.spy(actions, 'clear')

        // Trigger the overloaded action
        picker.clear()

        // Ensure the action was called as expected
        clearSpy.callCount.should.eql(1)
        clearSpy.lastCall.args.should.eql([picker.getState()])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([clearSpy.lastCall.returnValue])

      })
    })



    describe('#cycleScope', () => {
      it('is an overloaded method to cycle the scope', () => {

        // Create the picker
        let picker = pickerObject.create()

        // Stub out dispatch and spy on the cycleScope action
        let dispatchStub  = sinon.stub(picker, 'dispatch')
        let cycleScopeSpy = sinon.spy(actions, 'cycleScope')

        // Trigger the overloaded action
        picker.cycleScope()

        // Ensure the action was called as expected
        cycleScopeSpy.callCount.should.eql(1)
        cycleScopeSpy.lastCall.args.should.eql([picker.getState()])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([cycleScopeSpy.lastCall.returnValue])

      })
    })



    describe('#disable', () => {
      it('is an overloaded method to disable dates', () => {

        // Create the picker
        let picker = pickerObject.create()

        // Stub out dispatch and spy on the disable action
        let dispatchStub = sinon.stub(picker, 'dispatch')
        let disableSpy   = sinon.spy(actions, 'disable')

        // Trigger the overloaded action
        picker.disable(new Date(2015, 3, 20), 2, 5, new Date(1988, 7, 14))

        // Ensure the action was called as expected
        disableSpy.callCount.should.eql(1)
        disableSpy.lastCall.args.should.eql([picker.getState(), new Date(2015, 3, 20), 2, 5, new Date(1988, 7, 14)])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([disableSpy.lastCall.returnValue])

      })
    })



    describe('#enable', () => {
      it('is an overloaded method to enable dates', () => {

        // Create the picker
        let picker = pickerObject.create()

        // Stub out dispatch and spy on the enable action
        let dispatchStub = sinon.stub(picker, 'dispatch')
        let enableSpy   = sinon.spy(actions, 'enable')

        // Trigger the overloaded action
        picker.enable(new Date(2015, 3, 20), 2, 5, new Date(1988, 7, 14))

        // Ensure the action was called as expected
        enableSpy.callCount.should.eql(1)
        enableSpy.lastCall.args.should.eql([picker.getState(), new Date(2015, 3, 20), 2, 5, new Date(1988, 7, 14)])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([enableSpy.lastCall.returnValue])

      })
    })



    describe('#select', () => {
      it('is an overloaded method to select a date', () => {

        // Create the picker
        let picker = pickerObject.create()

        // Stub out dispatch and spy on the select action
        let dispatchStub = sinon.stub(picker, 'dispatch')
        let selectSpy    = sinon.spy(actions, 'select')

        // Trigger the overloaded action
        picker.select(new Date(2015, 3, 20))

        // Ensure the action was called as expected
        selectSpy.callCount.should.eql(1)
        selectSpy.lastCall.args.should.eql([picker.getState(), new Date(2015, 3, 20)])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([selectSpy.lastCall.returnValue])

      })
    })



    describe('#setFirstDay', () => {
      it('is an overloaded method to set the first day', () => {

        // Create the picker
        let picker = pickerObject.create()

        // Stub out dispatch and spy on the setFirstDay action
        let dispatchStub   = sinon.stub(picker, 'dispatch')
        let setFirstDaySpy = sinon.spy(actions, 'setFirstDay')

        // Trigger the overloaded action
        picker.setFirstDay(3)

        // Ensure the action was called as expected
        setFirstDaySpy.callCount.should.eql(1)
        setFirstDaySpy.lastCall.args.should.eql([picker.getState(), 3])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([setFirstDaySpy.lastCall.returnValue])

      })
    })



    describe('#setLanguage', () => {
      it('is an overloaded method to set the language', () => {

        // Create the picker
        let picker = pickerObject.create()

        // Stub out dispatch and spy on the setLanguage action
        let dispatchStub   = sinon.stub(picker, 'dispatch')
        let setLanguageSpy = sinon.spy(actions, 'setLanguage')

        // Trigger the overloaded action
        picker.setLanguage(LANGUAGE.FRENCH)

        // Ensure the action was called as expected
        setLanguageSpy.callCount.should.eql(1)
        setLanguageSpy.lastCall.args.should.eql([picker.getState(), LANGUAGE.FRENCH])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([setLanguageSpy.lastCall.returnValue])

      })
    })



    describe('#show', () => {
      it('is an overloaded method to show a date', () => {

        // Create the picker
        let picker = pickerObject.create()

        // Stub out dispatch and spy on the show action
        let dispatchStub = sinon.stub(picker, 'dispatch')
        let showSpy      = sinon.spy(actions, 'show')

        // Trigger the overloaded action
        picker.show(new Date(2015, 3, 20))

        // Ensure the action was called as expected
        showSpy.callCount.should.eql(1)
        showSpy.lastCall.args.should.eql([picker.getState(), new Date(2015, 3, 20)])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([showSpy.lastCall.returnValue])

      })
    })



    describe('#showNext', () => {
      it('is an overloaded method to show the next view', () => {

        // Create the picker
        let picker = pickerObject.create()

        // Stub out dispatch and spy on the showNext action
        let dispatchStub = sinon.stub(picker, 'dispatch')
        let showNextSpy  = sinon.spy(actions, 'showNext')

        // Trigger the overloaded action
        picker.showNext()

        // Ensure the action was called as expected
        showNextSpy.callCount.should.eql(1)
        showNextSpy.lastCall.args.should.eql([picker.getState()])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([showNextSpy.lastCall.returnValue])

      })
    })



    describe('#showPrevious', () => {
      it('is an overloaded method to show the previous view', () => {

        // Create the picker
        let picker = pickerObject.create()

        // Stub out dispatch and spy on the showPrevious action
        let dispatchStub    = sinon.stub(picker, 'dispatch')
        let showPreviousSpy = sinon.spy(actions, 'showPrevious')

        // Trigger the overloaded action
        picker.showPrevious()

        // Ensure the action was called as expected
        showPreviousSpy.callCount.should.eql(1)
        showPreviousSpy.lastCall.args.should.eql([picker.getState()])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([showPreviousSpy.lastCall.returnValue])

      })
    })



    describe('#showToday', () => {
      it('is an overloaded method to show today', () => {

        // Create the picker
        let picker = pickerObject.create()

        // Stub out dispatch and spy on the showToday action
        let dispatchStub = sinon.stub(picker, 'dispatch')
        let showTodaySpy = sinon.spy(actions, 'showToday')

        // Trigger the overloaded action
        picker.showToday()

        // Ensure the action was called as expected
        showTodaySpy.callCount.should.eql(1)
        showTodaySpy.lastCall.args.should.eql([picker.getState()])

        // Ensure the dispatch was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([showTodaySpy.lastCall.returnValue])

      })
    })


  })


})
