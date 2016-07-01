let sinon         = require('sinon')

const SCOPE       = require('constants/scope')

let actions       = require('actions')
let classes       = require('classes')
let vanillaEngine = require('engines/vanilla')
let animationUtil = require('utils/animation')



describe('/vanillaEngine', () => {


  ////////////
  // RENDER //
  ////////////



  describe('#render', () => {

    it('renders a picker into a parent node', () => {

      let parentNode = document.createElement('div')
      vanillaEngine.render(parentNode)

      parentNode.children.length.should.eql(1)
      parentNode.children[0].className.should.eql(classes.root)

    })


    it('returns the picker api', () => {

      let parentNode = document.createElement('div')
      let picker     = vanillaEngine.render(parentNode)

      picker.should.have.keys(
        'addStateListener',
        'dispatch',
        'removeStateListener',
        'state',
      )

    })





    //////////////////
    // ROOT ELEMENT //
    //////////////////



    describe('(#createRootElement)', () => {

      it('binds a touch move handler on the "root" element to prevent scrolling', () => {

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        vanillaEngine.render(parentNode)

        // Grab the root element
        let rootElement = parentNode.children[0]

        // Create the touch move event and spy on preventDefault
        let event = new Event('touchmove')
        let preventDefaultSpy = sinon.spy(event, 'preventDefault')

        // Dispatch the touch move event on the root element
        rootElement.dispatchEvent(event)

        // Ensure the spy was called
        preventDefaultSpy.callCount.should.eql(1)

      })

    })





    /////////////////////
    // BUTTON ELEMENTS //
    /////////////////////



    describe('(#createButtonScopeElement)', () => {

      it('binds a click handler on the "scope" button that dispatches an action to cycle the scope', () => {

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click')

        // Grab the scope button
        let elements = parentNode.getElementsByClassName(classes.button_scope)
        elements.length.should.eql(1)
        let scopeButton = elements[0]

        // Stub out the dispatch method on the picker
        let dispatchStub = sinon.stub(picker, 'dispatch')

        // Dispatch the click event on the scope button
        scopeButton.dispatchEvent(event)

        // Ensure the dispatch stub was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([actions.cycleScope()])

      })


      it('binds a state listener that rerenders the "scope" button if the view changes', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the scope button and it's children
        let scopeButton     = parentNode.getElementsByClassName(classes.button_scope)[0]
        let scopeButtonHTML = scopeButton.innerHTML

        // Trigger a state change
        picker.dispatch(actions.showView(new Date(2014, 3, 20)))

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the children have rerendered
        scopeButtonHTML.should.not.eql(scopeButton.innerHTML)

        // Clean up the stub
        getFrameStub.restore()

      })


      it('binds a state listener that rerenders the "scope" button if the scope changes', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the scope button and it's children
        let scopeButton     = parentNode.getElementsByClassName(classes.button_scope)[0]
        let scopeButtonHTML = scopeButton.innerHTML

        // Trigger a state change
        picker.dispatch(actions.cycleScope())

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the children have rerendered
        scopeButtonHTML.should.not.eql(scopeButton.innerHTML)

        // Clean up the stub
        getFrameStub.restore()

      })


      it('binds a state listener that does nothing to the "scope" button if the view and scope don’t change', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the scope button and it's children
        let scopeButton     = parentNode.getElementsByClassName(classes.button_scope)[0]
        let scopeButtonHTML = scopeButton.innerHTML

        // Trigger a state change
        picker.dispatch({ type: 'ACTION_TYPE_TEST' })

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the children have not rerendered
        scopeButtonHTML.should.eql(scopeButton.innerHTML)

        // Clean up the stub
        getFrameStub.restore()

      })

    })



    describe('(#createButtonPreviousElement)', () => {

      it('binds a click handler on the "previous" button that dispatches an action to show the previous view', () => {

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click')

        // Grab the previous button
        let elements = parentNode.getElementsByClassName(classes.button_previous)
        elements.length.should.eql(1)
        let previousButton = elements[0]

        // Stub out the dispatch method on the picker
        let dispatchStub = sinon.stub(picker, 'dispatch')

        // Dispatch the click event on the previous button
        previousButton.dispatchEvent(event)

        // Ensure the dispatch stub was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([actions.showPreviousView(SCOPE.DAYS)])

      })

    })



    describe('(#createButtonNextElement)', () => {

      it('binds a click handler on the "next" button that dispatches an action to show the next view', () => {

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click')

        // Grab the next button
        let elements = parentNode.getElementsByClassName(classes.button_next)
        elements.length.should.eql(1)
        let nextButton = elements[0]

        // Stub out the dispatch method on the picker
        let dispatchStub = sinon.stub(picker, 'dispatch')

        // Dispatch the click event on the next button
        nextButton.dispatchEvent(event)

        // Ensure the dispatch stub was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([actions.showNextView(SCOPE.DAYS)])

      })

    })



    describe('(#createButtonTodayElement)', () => {

      it('binds a click handler on the "today" button that dispatches an action to show the view today', () => {

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click')

        // Grab the today button
        let elements = parentNode.getElementsByClassName(classes.button_today)
        elements.length.should.eql(1)
        let todayButton = elements[0]

        // Stub out the dispatch method on the picker
        let dispatchStub = sinon.stub(picker, 'dispatch')

        // Dispatch the click event on the today button
        todayButton.dispatchEvent(event)

        // Ensure the dispatch stub was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([actions.showView(picker.state.today)])

      })

    })



    describe('(#createButtonClearElement)', () => {

      it('binds a click handler on the "clear" button that dispatches an action to clear the selected value', () => {

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click')

        // Grab the clear button
        let elements = parentNode.getElementsByClassName(classes.button_clear)
        elements.length.should.eql(1)
        let clearButton = elements[0]

        // Stub out the dispatch method on the picker
        let dispatchStub = sinon.stub(picker, 'dispatch')

        // Dispatch the click event on the clear button
        clearButton.dispatchEvent(event)

        // Ensure the dispatch stub was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([actions.select(null)])

      })

    })





    ///////////////////
    // GRID ELEMENTS //
    ///////////////////



    describe('(#createGridElement)', () => {

      it('binds a click handler on the "grid" that dispatches an action to select a value', () => {

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click', { bubbles: true })

        // Grab the grid element
        let elements = parentNode.getElementsByClassName(classes.grid)
        elements.length.should.eql(1)
        let gridElement = elements[0]

        // Stub out the dispatch method on the picker
        let dispatchStub = sinon.stub(picker, 'dispatch')

        // Dispatch the click event on a child cell element of the grid element
        let gridCellElement = gridElement.querySelector('[data-value]')
        gridCellElement.dispatchEvent(event)

        // Ensure the dispatch stub was called as expected
        dispatchStub.callCount.should.eql(1)
        dispatchStub.lastCall.args.should.eql([
          actions.select(+gridCellElement.dataset.value)
        ])

      })


      it('binds a click handler on the "grid" that does nothing if a value is not found on the click target', () => {

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click', { bubbles: true })

        // Grab the grid element
        let gridElement = parentNode.getElementsByClassName(classes.grid)[0]

        // Stub out the dispatch method on the picker
        let dispatchStub = sinon.stub(picker, 'dispatch')

        // Grab the grid row heading element
        let elements = gridElement.getElementsByClassName(classes.gridRow_heading)
        elements.length.should.eql(1)
        let gridRowHeadingElement = elements[0]

        // Dispatch the click event on the grid row heading element
        gridRowHeadingElement.dispatchEvent(event)

        // Ensure the dispatch stub was not called
        dispatchStub.callCount.should.eql(0)

      })


      it('binds a state listener that rerenders the "grid" element if the view changes', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the grid element and it's children
        let gridElement     = parentNode.getElementsByClassName(classes.button_scope)[0]
        let gridElementHTML = gridElement.innerHTML

        // Trigger a state change
        picker.dispatch(actions.showView(new Date(2014, 3, 20)))

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the children have rerendered
        gridElementHTML.should.not.eql(gridElement.innerHTML)

        // Clean up the stub
        getFrameStub.restore()

      })


      it('binds a state listener that rerenders the "grid" element if the selected value changes', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the grid element and it's children
        let gridElement     = parentNode.getElementsByClassName(classes.button_scope)[0]
        let gridElementHTML = gridElement.innerHTML

        // Trigger a state change
        picker.dispatch(actions.select(new Date(2013, 3, 20)))

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the children have rerendered
        gridElementHTML.should.not.eql(gridElement.innerHTML)

        // Clean up the stub
        getFrameStub.restore()

      })


      it('binds a state listener that rerenders the "grid" element if the scope changes', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the grid element and it's children
        let gridElement     = parentNode.getElementsByClassName(classes.button_scope)[0]
        let gridElementHTML = gridElement.innerHTML

        // Trigger a state change
        picker.dispatch(actions.cycleScope())

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the children have rerendered
        gridElementHTML.should.not.eql(gridElement.innerHTML)

        // Clean up the stub
        getFrameStub.restore()

      })


      it('binds a state listener that does nothing to the "grid" element if the view and selected value don’t change', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent node and render the picker into it
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the grid element and it's children
        let gridElement     = parentNode.getElementsByClassName(classes.button_scope)[0]
        let gridElementHTML = gridElement.innerHTML

        // Trigger a state change
        picker.dispatch({ type: 'ACTION_TYPE_TEST' })

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the children have not rerendered
        gridElementHTML.should.eql(gridElement.innerHTML)

        // Clean up the stub
        getFrameStub.restore()

      })

    })


  })


})