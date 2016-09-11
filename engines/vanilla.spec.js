let sinon         = require('sinon')

let actions       = require('actions')
let classes       = require('classes')
let vanillaEngine = require('engines/vanilla')
let animationUtil = require('utils/animation')
let dateUtil      = require('utils/date')



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

        // Actions
        'clear',
        'confirm',
        'cycleScope',
        'select',
        'show',
        'showNext',
        'showPrevious',
        'showToday',
      )

    })



    describe('(#addValueStateListenerToInput)', () => {

      it('binds a state listener that updates the value of the input node if the selected value changes', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent and input node and render the picker
        let parentNode = document.createElement('div')
        let inputNode  = document.createElement('input')
        let picker     = vanillaEngine.render(parentNode, inputNode)

        let selectedDate = new Date(2013, 3, 20)

        // Trigger a value change
        picker.select(selectedDate)

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the input node now has the correct value
        inputNode.value.should.eql(dateUtil.format(selectedDate, picker.state.template))

        // Clean up the stub
        getFrameStub.restore()

      })


      it('binds a state listener that does nothing to the value of the input node if the selected value does not change', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent and input node and render the picker
        let parentNode = document.createElement('div')
        let inputNode  = document.createElement('input')
        let picker     = vanillaEngine.render(parentNode, inputNode)

        // Trigger a state change
        picker.dispatch({ type: 'ACTION_TYPE_TEST' })

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the input node still has no value
        inputNode.value.should.eql('')

        // Clean up the stub
        getFrameStub.restore()

      })

    })





    //////////////////
    // ROOT ELEMENT //
    //////////////////



    describe('(#createRootElement)', () => {

      it('binds a touch move handler on the "root" element to prevent scrolling', () => {

        // Create the parent node and render the picker
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

      it('binds a click handler on the "scope" button that cycles the scope', () => {

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click')

        // Grab the scope button
        let elements = parentNode.getElementsByClassName(classes.button_scope)
        elements.length.should.eql(1)
        let scopeButton = elements[0]

        // Stub out the cycleScope method on the picker
        let cycleScopeStub = sinon.stub(picker, 'cycleScope')

        // Dispatch the click event on the scope button
        scopeButton.dispatchEvent(event)

        // Ensure the cycleScope stub was called as expected
        cycleScopeStub.callCount.should.eql(1)
        cycleScopeStub.lastCall.args.should.eql([])

      })


      it('binds a state listener that rerenders the "scope" button if the selected value changes', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the scope button and it's children
        let scopeButton     = parentNode.getElementsByClassName(classes.button_scope)[0]
        let scopeButtonHTML = scopeButton.innerHTML

        // Trigger a state change
        picker.select(new Date(2014, 3, 20))

        // Grab the frame callback and trigger it
        let frameCallback = getFrameStub.lastCall.args[1]
        frameCallback()

        // Ensure the children have rerendered
        scopeButtonHTML.should.not.eql(scopeButton.innerHTML)

        // Clean up the stub
        getFrameStub.restore()

      })


      it('binds a state listener that does nothing to the "scope" button if the selected value doesn’t change', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent node and render the picker
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



    describe('(#createButtonScopeItemElements)', () => {

      it('renders the "compound" scope element when there is a selected value', () => {

        // Create the parent node and render the picker
        // with a selected value
        let parentNode = document.createElement('div')
        vanillaEngine.render(parentNode, {
          selected: new Date(2014, 3, 20)
        })

        // Grab the "compound" scope item
        let scopeItemCompoundNodes = parentNode.getElementsByClassName(classes.scopeItem_compound)

        // Ensure one was found
        scopeItemCompoundNodes.length.should.eql(1)

        // Grab the "empty" scope item
        let scopeItemEmptyNodes = parentNode.getElementsByClassName(classes.scopeItem_empty)

        // Ensure none was found
        scopeItemEmptyNodes.length.should.eql(0)

      })


      it('renders the "empty" scope element when there is no selected value', () => {

        // Create the parent node and render the picker
        // without a selected value
        let parentNode = document.createElement('div')
        vanillaEngine.render(parentNode)

        // Grab the "compound" scope item
        let scopeItemCompoundNodes = parentNode.getElementsByClassName(classes.scopeItem_compound)

        // Ensure none was found
        scopeItemCompoundNodes.length.should.eql(0)

        // Grab the "empty" scope item
        let scopeItemEmptyNodes = parentNode.getElementsByClassName(classes.scopeItem_empty)

        // Ensure one was found
        scopeItemEmptyNodes.length.should.eql(1)

      })

    })



    describe('(#createButtonNavigationPreviousElement)', () => {

      it('binds a click handler on the "previous" button that shows the previous view', () => {

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click')

        // Grab the previous button
        let elements = parentNode.getElementsByClassName(classes.button_previous)
        elements.length.should.eql(1)
        let previousButton = elements[0]

        // Stub out the showPrevious method on the picker
        let showPreviousStub = sinon.stub(picker, 'showPrevious')

        // Dispatch the click event on the previous button
        previousButton.dispatchEvent(event)

        // Ensure the showPrevious stub was called as expected
        showPreviousStub.callCount.should.eql(1)
        showPreviousStub.lastCall.args.should.eql([])

      })

    })



    describe('(#createButtonNavigationNextElement)', () => {

      it('binds a click handler on the "next" button that shows the next view', () => {

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click')

        // Grab the next button
        let elements = parentNode.getElementsByClassName(classes.button_next)
        elements.length.should.eql(1)
        let nextButton = elements[0]

        // Stub out the showNext method on the picker
        let showNextStub = sinon.stub(picker, 'showNext')

        // Dispatch the click event on the next button
        nextButton.dispatchEvent(event)

        // Ensure the showNext stub was called as expected
        showNextStub.callCount.should.eql(1)
        showNextStub.lastCall.args.should.eql([])

      })

    })



    describe('(#createButtonNavigationTodayElement)', () => {

      it('binds a click handler on the "today" button that shows the view today', () => {

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click')

        // Grab the today button
        let elements = parentNode.getElementsByClassName(classes.button_today)
        elements.length.should.eql(1)
        let todayButton = elements[0]

        // Stub out the showToday method on the picker
        let showTodayStub = sinon.stub(picker, 'showToday')

        // Dispatch the click event on the today button
        todayButton.dispatchEvent(event)

        // Ensure the showToday stub was called as expected
        showTodayStub.callCount.should.eql(1)
        showTodayStub.lastCall.args.should.eql([])

      })

    })



    describe('(#createButtonClearElement)', () => {

      it('binds a click handler on the "clear" button that clears the selected value', () => {

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click')

        // Grab the clear button
        let elements = parentNode.getElementsByClassName(classes.button_clear)
        elements.length.should.eql(1)
        let clearButton = elements[0]

        // Stub out the clear method on the picker
        let clearStub = sinon.stub(picker, 'clear')

        // Dispatch the click event on the clear button
        clearButton.dispatchEvent(event)

        // Ensure the clear stub was called as expected
        clearStub.callCount.should.eql(1)
        clearStub.lastCall.args.should.eql([])

      })

    })



    describe('(#createButtonConfirmElement)', () => {

      it('binds a click handler on the "confirm" button that confirms the selected value', () => {

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click')

        // Grab the clear button
        let elements = parentNode.getElementsByClassName(classes.button_confirm)
        elements.length.should.eql(1)
        let clearButton = elements[0]

        // Stub out the confirm method on the picker
        let confirmStub = sinon.stub(picker, 'confirm')

        // Dispatch the click event on the clear button
        clearButton.dispatchEvent(event)

        // Ensure the confirm stub was called as expected
        confirmStub.callCount.should.eql(1)
        confirmStub.lastCall.args.should.eql([])

      })

    })





    ///////////////////
    // GRID ELEMENTS //
    ///////////////////



    describe('(#createGridElement)', () => {

      it('binds a click handler on the "grid" that selects a value', () => {

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click', { bubbles: true })

        // Grab the grid element
        let elements = parentNode.getElementsByClassName(classes.grid)
        elements.length.should.eql(1)
        let gridElement = elements[0]

        // Stub out the select method on the picker
        let selectStub = sinon.stub(picker, 'select')

        // Dispatch the click event on a child cell element of the grid element
        let gridCellElement = gridElement.querySelector('[data-value]')
        gridCellElement.dispatchEvent(event)

        // Ensure the select stub was called as expected
        selectStub.callCount.should.eql(1)
        selectStub.lastCall.args.should.eql([+gridCellElement.dataset.value])

      })


      it('binds a click handler on the "grid" that does nothing if a value is not found on the click target', () => {

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Create the click event
        let event = new Event('click', { bubbles: true })

        // Grab the grid element
        let gridElement = parentNode.getElementsByClassName(classes.grid)[0]

        // Stub out the select method on the picker
        let selectStub = sinon.stub(picker, 'select')

        // Grab the grid row heading element
        let elements = gridElement.getElementsByClassName(classes.gridRow_heading)
        elements.length.should.eql(1)
        let gridRowHeadingElement = elements[0]

        // Dispatch the click event on the grid row heading element
        gridRowHeadingElement.dispatchEvent(event)

        // Ensure the select stub was not called
        selectStub.callCount.should.eql(0)

      })


      it('binds a state listener that rerenders the "grid" element if the view changes', () => {

        // Stub out getFrame
        let getFrameStub = sinon.stub(animationUtil, 'getFrame')

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the grid element and it's children
        let gridElement     = parentNode.getElementsByClassName(classes.grid)[0]
        let gridElementHTML = gridElement.innerHTML

        // Trigger a state change
        picker.show(new Date(2014, 3, 20))

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

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the grid element and it's children
        let gridElement     = parentNode.getElementsByClassName(classes.grid)[0]
        let gridElementHTML = gridElement.innerHTML

        // Trigger a state change
        picker.select(new Date(2013, 3, 20))

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

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the grid element and it's children
        let gridElement     = parentNode.getElementsByClassName(classes.grid)[0]
        let gridElementHTML = gridElement.innerHTML

        // Trigger a state change
        picker.cycleScope()

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

        // Create the parent node and render the picker
        let parentNode = document.createElement('div')
        let picker     = vanillaEngine.render(parentNode)

        // Grab the grid element and it's children
        let gridElement     = parentNode.getElementsByClassName(classes.grid)[0]
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