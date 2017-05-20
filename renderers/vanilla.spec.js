const fs               = require('fs')
const sinon            = require('sinon')

const classes          = require('classes')
const LANGUAGE         = require('constants/language')
const pickerObject     = require('objects/picker')
const vanillaRenderer  = require('renderers/vanilla')
const animationUtil    = require('utils/animation')

// const checkmarkIcon = fs.readFileSync('icons/checkmark.svg', 'utf-8')
const chevronLeftIcon  = fs.readFileSync('icons/chevronLeft.svg', 'utf-8')
const chevronRightIcon = fs.readFileSync('icons/chevronRight.svg', 'utf-8')
const crossIcon        = fs.readFileSync('icons/cross.svg', 'utf-8')
const bullsEyeIcon     = fs.readFileSync('icons/bullsEye.svg', 'utf-8')



describe('/vanillaRenderer', () => {


  ////////////
  // RENDER //
  ////////////



  describe('#render', () => {

    it('renders a picker into a parent node', () => {

      const picker     = pickerObject.create()
      const parentNode = document.createElement('div')
      vanillaRenderer.render(parentNode, picker)

      parentNode.children.length.should.eql(1)
      parentNode.children[0].className.should.eql(classes.root)

    })


    it('renders a picker into a parent node with a custom layout', () => {

      const picker     = pickerObject.create()
      const parentNode = document.createElement('div')

      const layout = sinon.spy(() => document.createElement('div'))

      vanillaRenderer.render(parentNode, picker, layout)

      layout.callCount.should.eql(1)
      layout.lastCall.args.length.should.eql(1)
      layout.lastCall.args[0].should.be.exactly(picker)

    })

  })





  /////////////
  // LAYOUTS //
  /////////////



  describe('#createLayout', () => {

    it('creates a layout', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createLayout()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.should.be.an.instanceOf(HTMLDivElement)

    })


    it('creates a layout with children layouts', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createLayout(
        vanillaRenderer.createLayout(),
        vanillaRenderer.createLayout(
          vanillaRenderer.createLayout(),
          vanillaRenderer.createLayout()
        ),
        vanillaRenderer.createLayout()
      )

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element tree is what was expected
      element.children.length.should.eql(3)
      Array.from(element.children)
        .forEach(child => child.should.be.an.instanceOf(HTMLDivElement))
      element.children[0].children.length.should.eql(0)
      element.children[1].children.length.should.eql(2)
      Array.from(element.children[1].children)
        .forEach(child => child.should.be.an.instanceOf(HTMLDivElement))
      element.children[2].children.length.should.eql(0)

    })

  })





  ///////////////////////
  // CONTAINER LAYOUTS //
  ///////////////////////



  describe('#createRootContainer', () => {

    it('creates a layout for the root container', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createRootContainer()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.className.should.eql(classes.root)
      element.children.length.should.eql(0)

    })


    it('creates a layout for the root container with a touch move handler to prevent scrolling', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createRootContainer()

      // Render the element with the picker
      const element = layout(picker)

      // Create the touch move event and spy on preventDefault
      const event             = new Event('touchmove')
      const preventDefaultSpy = sinon.spy(event, 'preventDefault')

      // Dispatch the touch move event on the element
      element.dispatchEvent(event)

      // Ensure the spy was called
      preventDefaultSpy.callCount.should.eql(1)

    })


    it('creates a layout with children layouts')

  })



  describe('#createHeaderContainer', () => {

    it('creates a layout for the header container', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createHeaderContainer()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.className.should.eql([classes.section, classes.section_header].join(' '))
      element.children.length.should.eql(0)

    })


    it('creates a layout with children layouts')

  })



  describe('#createBodyContainer', () => {

    it('creates a layout for the body container', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createBodyContainer()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.className.should.eql([classes.section, classes.section_body].join(' '))
      element.children.length.should.eql(0)

    })


    it('creates a layout with children layouts')

  })



  describe('#createFooterContainer', () => {

    it('creates a layout for the footer container', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createFooterContainer()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.className.should.eql([classes.section, classes.section_footer].join(' '))
      element.children.length.should.eql(0)

    })


    it('creates a layout with children layouts')

  })



  describe('#createNavigationContainer', () => {

    it('creates a layout for the navigation container', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createNavigationContainer()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.className.should.eql(classes.navigation)
      element.children.length.should.eql(0)

    })


    it('creates a layout with children layouts')

  })





  ///////////////////////
  // COMPONENT LAYOUTS //
  ///////////////////////



  describe('#createScopeButton', () => {

    it('creates a layout for the "scope" button component', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createScopeButton()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.className.should.eql([classes.button, classes.button_scope].join(' '))
      element.children.length.should.not.eql(0)

    })


    it('creates a layout for the "scope" button component with a click handler that cycles the scope', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createScopeButton()

      // Render the element with the picker
      const element = layout(picker)

      // Stub out cycleScope
      const cycleScopeStub = sinon.stub(picker, 'cycleScope')

      // Dispatch the click event on the element
      element.dispatchEvent(new Event('click'))

      // Ensure the stub was called
      cycleScopeStub.callCount.should.eql(1)
      cycleScopeStub.lastCall.args.should.eql([])

    })


    it('creates a layout for the "scope" button component that renders new children if the "language" state changes', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createScopeButton()

      // Render the element with the picker
      const element = layout(picker)

      // Grab the first child
      const firstChildElement = element.children[0]

      // Stub out getFrame
      const getFrameStub = sinon.stub(animationUtil, 'getFrame')

      // Trigger a state change
      picker.setLanguage(LANGUAGE.FRENCH)

      // Grab the frame callback and trigger it
      const frameCallback = getFrameStub.lastCall.args[1]
      frameCallback()

      // Ensure the children have rerendered
      element.children[0].should.not.be.exactly(firstChildElement)

      // Clean up the stub
      getFrameStub.restore()

    })


    it('creates a layout for the "scope" button component that renders new children if the "scope" state changes', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createScopeButton()

      // Render the element with the picker
      const element = layout(picker)

      // Grab the first child
      const firstChildElement = element.children[0]

      // Stub out getFrame
      const getFrameStub = sinon.stub(animationUtil, 'getFrame')

      // Trigger a state change
      picker.cycleScope()

      // Grab the frame callback and trigger it
      const frameCallback = getFrameStub.lastCall.args[1]
      frameCallback()

      // Ensure the children have rerendered
      element.children[0].should.not.be.exactly(firstChildElement)

      // Clean up the stub
      getFrameStub.restore()

    })


    it('creates a layout for the "scope" button component that renders new children if the "selected" state changes', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createScopeButton()

      // Render the element with the picker
      const element = layout(picker)

      // Grab the first child
      const firstChildElement = element.children[0]

      // Stub out getFrame
      const getFrameStub = sinon.stub(animationUtil, 'getFrame')

      // Trigger a state change
      picker.select(new Date(2014, 3, 20))

      // Grab the frame callback and trigger it
      const frameCallback = getFrameStub.lastCall.args[1]
      frameCallback()

      // Ensure the children have rerendered
      element.children[0].should.not.be.exactly(firstChildElement)

      // Clean up the stub
      getFrameStub.restore()

    })


    it('creates a layout for the "scope" button component that renders new children if the "view" state changes', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createScopeButton()

      // Render the element with the picker
      const element = layout(picker)

      // Grab the first child
      const firstChildElement = element.children[0]

      // Stub out getFrame
      const getFrameStub = sinon.stub(animationUtil, 'getFrame')

      // Trigger a state change
      picker.select(new Date(2014, 3, 20))

      // Grab the frame callback and trigger it
      const frameCallback = getFrameStub.lastCall.args[1]
      frameCallback()

      // Ensure the children have rerendered
      element.children[0].should.not.be.exactly(firstChildElement)

      // Clean up the stub
      getFrameStub.restore()

    })


    it('creates a layout for the "scope" button component that does not render new children if an unrelated state changes', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createScopeButton()

      // Render the element with the picker
      const element = layout(picker)

      // Grab the first child
      const firstChildElement = element.children[0]

      // Stub out getFrame
      const getFrameStub = sinon.stub(animationUtil, 'getFrame')

      // Trigger an unrelated change
      picker.dispatch({ type: 'ACTION_TYPE_TEST' })

      // Grab the frame callback and trigger it
      const frameCallback = getFrameStub.lastCall.args[1]
      frameCallback()

      // Ensure the children have rerendered
      element.children[0].should.be.exactly(firstChildElement)

      // Clean up the stub
      getFrameStub.restore()

    })


    it('creates a layout for the "scope" button that renders the "compound" scope element when there is a "selected" state', () => {

      // Create the picker and layout
      const picker = pickerObject.create({
        payload: { selected: new Date(2014, 3, 20) }
      })
      const layout = vanillaRenderer.createScopeButton()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the "compound" scope item was found
      const compoundScopeItemElement = element.getElementsByClassName(classes.scopeItem_compound)
      compoundScopeItemElement.length.should.eql(1)

      // Ensure an "empty" scope item was not found
      const emptyScopeItemElement = element.getElementsByClassName(classes.scopeItem_empty)
      emptyScopeItemElement.length.should.eql(0)

    })


    it('creates a layout for the "scope" button that renders the "empty" scope element when there is no "selected" state', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createScopeButton()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure a "compound" scope item was not found
      const compoundScopeItemElement = element.getElementsByClassName(classes.scopeItem_compound)
      compoundScopeItemElement.length.should.eql(0)

      // Ensure the "empty" scope item was found
      const emptyScopeItemElement = element.getElementsByClassName(classes.scopeItem_empty)
      emptyScopeItemElement.length.should.eql(1)

    })

  })



  describe('#createPreviousButton', () => {

    it('creates a layout for the "previous" button component', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createPreviousButton()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.tagName.should.eql('BUTTON')
      element.className.should.eql([
        classes.button,
        classes.button_navigation,
        classes.button_previous
      ].join(' '))
      element.innerHTML.should.eql(chevronLeftIcon)

    })


    it(
      'creates a layout for the "previous" button component ' +
      'with a click handler that selects in the previous period',
    () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createPreviousButton()

      // Render the element with the picker
      const element = layout(picker)

      // Stub out selectInPreviousPeriod
      const selectInPreviousPeriodStub = sinon.stub(
        picker,
        'selectInPreviousPeriod'
      )

      // Dispatch the click event on the element
      element.dispatchEvent(new Event('click'))

      // Ensure the stub was called
      selectInPreviousPeriodStub.callCount.should.eql(1)
      selectInPreviousPeriodStub.lastCall.args.should.eql([])

    })

  })



  describe('#createTodayButton', () => {

    it('creates a layout for the "today" button component', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createTodayButton()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.tagName.should.eql('BUTTON')
      element.className.should.eql([
        classes.button,
        classes.button_navigation,
        classes.button_today
      ].join(' '))
      element.innerHTML.should.eql(bullsEyeIcon)

    })


    it(
      'creates a layout for the "today" button component ' +
      'with a click handler that selects in the "today" period',
    () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createTodayButton()

      // Render the element with the picker
      const element = layout(picker)

      // Stub out showToday
      const selectInTodayPeriodStub = sinon.stub(picker, 'selectInTodayPeriod')

      // Dispatch the click event on the element
      element.dispatchEvent(new Event('click'))

      // Ensure the stub was called
      selectInTodayPeriodStub.callCount.should.eql(1)
      selectInTodayPeriodStub.lastCall.args.should.eql([])

    })

  })



  describe('#createNextButton', () => {

    it('creates a layout for the "next" button component', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createNextButton()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.tagName.should.eql('BUTTON')
      element.className.should.eql([
        classes.button,
        classes.button_navigation,
        classes.button_next
      ].join(' '))
      element.innerHTML.should.eql(chevronRightIcon)

    })


    it(
      'creates a layout for the "next" button component ' +
      'with a click handler that selects in the the next period',
    () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createNextButton()

      // Render the element with the picker
      const element = layout(picker)

      // Stub out selectInNextPeriod
      const selectInNextPeriodStub = sinon.stub(picker, 'selectInNextPeriod')

      // Dispatch the click event on the element
      element.dispatchEvent(new Event('click'))

      // Ensure the stub was called
      selectInNextPeriodStub.callCount.should.eql(1)
      selectInNextPeriodStub.lastCall.args.should.eql([])

    })

  })



  describe('#createClearButton', () => {

    it('creates a layout for the "clear" button component', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createClearButton()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.tagName.should.eql('BUTTON')
      element.className.should.eql([classes.button, classes.button_clear].join(' '))
      element.innerHTML.should.eql(crossIcon)

    })


    it('creates a layout for the "clear" button component with a click handler that clears the "selected" state', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createClearButton()

      // Render the element with the picker
      const element = layout(picker)

      // Stub out clear
      const clearStub = sinon.stub(picker, 'clear')

      // Dispatch the click event on the element
      element.dispatchEvent(new Event('click'))

      // Ensure the stub was called
      clearStub.callCount.should.eql(1)
      clearStub.lastCall.args.should.eql([])

    })

  })



  describe('#createGridButton', () => {

    it('creates a layout for the "grid" button component', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createGridButton()

      // Render the element with the picker
      const element = layout(picker)

      // Ensure the element is what was expected
      element.tagName.should.eql('BUTTON')
      element.className.should.eql(classes.grid)
      element.children.length.should.not.eql(0)

    })


    it('creates a layout for the "grid" button component with a click handler that sets the "selected" state', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createGridButton()

      // Render the element with the picker
      const element = layout(picker)

      // Stub out select
      const selectStub = sinon.stub(picker, 'select')

      // Dispatch the click event on the child element
      const childElement = element.querySelector('[data-value]')
      childElement.dispatchEvent(new Event('click', { bubbles: true }))

      // Ensure the stub was called
      selectStub.callCount.should.eql(1)
      selectStub.lastCall.args.should.eql([parseInt(childElement.dataset.value, 10)])

    })


    it(
      'creates a layout for the "grid" button component ' +
      'with a click handler that does nothing for disabled clicks',
    () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createGridButton()

      // Disable a date and select that month
      picker.disable(new Date(2015, 3, 20))
      picker.select(new Date(2015, 3, 1))

      // Render the element with the picker
      const element = layout(picker)

      // Find the disabled child elements and ensure there's only one
      const disabledChildElements = element.getElementsByClassName(
        classes.gridCell_disabled
      )
      disabledChildElements.length.should.eql(1)

      // Ensure the disabled child element is the correct one
      const disabledChildElement = disabledChildElements[0]
      disabledChildElement.textContent.should.eql('20')

      // Stub out select
      const selectStub = sinon.stub(picker, 'select')

      // Dispatch the click event on the disabled child element
      disabledChildElement.dispatchEvent(new Event('click', { bubbles: true }))

      // Ensure the stub was not called
      selectStub.callCount.should.eql(0)

    })


    it('creates a layout for the "grid" button component with a click handler that does nothing for missed clicks', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createGridButton()

      // Render the element with the picker
      const element = layout(picker)

      // Stub out select
      const selectStub = sinon.stub(picker, 'select')

      // Dispatch the click event on the child element
      const childElement = element.querySelector('div')
      childElement.dispatchEvent(new Event('click', { bubbles: true }))

      // Ensure the stub was called
      selectStub.callCount.should.eql(0)

    })


    it('creates a layout for the "grid" button component that renders new children if the "disabled" state changes', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createGridButton()

      // Render the element with the picker
      const element = layout(picker)

      // Grab the first child
      const firstChildElement = element.children[0]

      // Stub out getFrame
      const getFrameStub = sinon.stub(animationUtil, 'getFrame')

      // Trigger a state change
      picker.disable(new Date(2014, 3, 20))

      // Grab the frame callback and trigger it
      const frameCallback = getFrameStub.lastCall.args[1]
      frameCallback()

      // Ensure the children have rerendered
      element.children[0].should.not.be.exactly(firstChildElement)

      // Clean up the stub
      getFrameStub.restore()

    })


    it('creates a layout for the "grid" button component that renders new children if the "language" state changes', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createGridButton()

      // Render the element with the picker
      const element = layout(picker)

      // Grab the first child
      const firstChildElement = element.children[0]

      // Stub out getFrame
      const getFrameStub = sinon.stub(animationUtil, 'getFrame')

      // Trigger a state change
      picker.setLanguage(LANGUAGE.FRENCH)

      // Grab the frame callback and trigger it
      const frameCallback = getFrameStub.lastCall.args[1]
      frameCallback()

      // Ensure the children have rerendered
      element.children[0].should.not.be.exactly(firstChildElement)

      // Clean up the stub
      getFrameStub.restore()

    })


    it('creates a layout for the "grid" button component that renders new children if the "scope" state changes', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createGridButton()

      // Render the element with the picker
      const element = layout(picker)

      // Grab the first child
      const firstChildElement = element.children[0]

      // Stub out getFrame
      const getFrameStub = sinon.stub(animationUtil, 'getFrame')

      // Trigger a state change
      picker.cycleScope()

      // Grab the frame callback and trigger it
      const frameCallback = getFrameStub.lastCall.args[1]
      frameCallback()

      // Ensure the children have rerendered
      element.children[0].should.not.be.exactly(firstChildElement)

      // Clean up the stub
      getFrameStub.restore()

    })


    it('creates a layout for the "grid" button component that renders new children if the "selected" state changes', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createGridButton()

      // Render the element with the picker
      const element = layout(picker)

      // Grab the first child
      const firstChildElement = element.children[0]

      // Stub out getFrame
      const getFrameStub = sinon.stub(animationUtil, 'getFrame')

      // Trigger a state change
      picker.select(new Date(2014, 3, 20))

      // Grab the frame callback and trigger it
      const frameCallback = getFrameStub.lastCall.args[1]
      frameCallback()

      // Ensure the children have rerendered
      element.children[0].should.not.be.exactly(firstChildElement)

      // Clean up the stub
      getFrameStub.restore()

    })


    it(
      'creates a layout for the "grid" button component ' +
      'that renders new children if the "view" state changes',
    () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createGridButton()

      // Render the element with the picker
      const element = layout(picker)

      // Grab the first child
      const firstChildElement = element.children[0]

      // Stub out getFrame
      const getFrameStub = sinon.stub(animationUtil, 'getFrame')

      // Trigger a state change
      picker.select(new Date(2014, 3, 20))

      // Grab the frame callback and trigger it
      const frameCallback = getFrameStub.lastCall.args[1]
      frameCallback()

      // Ensure the children have rerendered
      element.children[0].should.not.be.exactly(firstChildElement)

      // Clean up the stub
      getFrameStub.restore()

    })


    it('creates a layout for the "grid" button component that does not render new children if an unrelated state changes', () => {

      // Create the picker and layout
      const picker = pickerObject.create()
      const layout = vanillaRenderer.createGridButton()

      // Render the element with the picker
      const element = layout(picker)

      // Grab the first child
      const firstChildElement = element.children[0]

      // Stub out getFrame
      const getFrameStub = sinon.stub(animationUtil, 'getFrame')

      // Trigger an unrelated change
      picker.dispatch({ type: 'ACTION_TYPE_TEST' })

      // Grab the frame callback and trigger it
      const frameCallback = getFrameStub.lastCall.args[1]
      frameCallback()

      // Ensure the children have rerendered
      element.children[0].should.be.exactly(firstChildElement)

      // Clean up the stub
      getFrameStub.restore()

    })

  })





  //////////////////
  // NODE HELPERS //
  //////////////////



  describe('#addAttributes', () => {

    it('adds attributes to an element', () => {

      // Create an element
      const element = document.createElement('div')

      // Create the attributes to add
      const attributes = {

        // Simple attributes
        innerHTML : 'hello',
        tabIndex  : 3,

        // Dataset attributes
        dataset: {
          something : 'epic',
          nice      : true,
        },

        // Method attributes
        onClick      : sinon.stub(),
        onTouchStart : sinon.stub(),

      }

      // Add the attributes
      vanillaRenderer.addAttributes(element, attributes)

      // Ensure the simple attributes were added as expected
      element.innerHTML.should.eql(attributes.innerHTML)
      element.tabIndex.should.eql(attributes.tabIndex)

      // Ensure the dataset attributes were added as expected
      element.dataset.something.should.eql(attributes.dataset.something)
      element.dataset.nice.should.eql(`${attributes.dataset.nice}`)

      // Ensure the methods attributes were bound as expected
      element.dispatchEvent(new Event('click'))
      attributes.onClick.callCount.should.eql(1)
      element.dispatchEvent(new Event('touchstart'))
      attributes.onTouchStart.callCount.should.eql(1)

    })


    it('does nothing to the element if no attributes are passed', () => {

      // Create an element
      const element = document.createElement('div')

      // Grab a reference to the original outer HTML
      const elementOuterHTML = element.outerHTML

      // Add no attributes
      vanillaRenderer.addAttributes(element, null)

      // Ensure the element was not updated
      element.outerHTML.should.eql(elementOuterHTML)

    })

  })



  describe('#addClassName', () => {

    it('adds a class name to an element', () => {

      // Create an element
      const element = document.createElement('div')

      // Create the class name to set
      const className = 'my-class-name'

      // Add the class name
      vanillaRenderer.addClassName(element, className)

      // Ensure the class name was updated
      element.className.should.eql(className)

    })


    it('adds multiple class names to an element', () => {

      // Create an element
      const element = document.createElement('div')

      // Create the class names to set
      const className = ['my-class-1', 'my-class-2', 'my-class-3']

      // Add the class names
      vanillaRenderer.addClassName(element, className)

      // Ensure the class name was updated
      element.className.should.eql(className.join(' '))

    })


    it('adds multiple class names (as keys of an object with truth-y values) to an element', () => {

      // Create an element
      const element = document.createElement('div')

      // Create the class names to set
      const className = {
        'my-class-1': true,
        'my-class-2': false,
        'my-class-3': 'something-truth-y',
      }

      // Add the class names
      vanillaRenderer.addClassName(element, className)

      // Ensure the class name was updated
      element.className.should.eql('my-class-1 my-class-3')

    })


    it('does nothing to the element if no class name data is passed', () => {

      // Create an element
      const element = document.createElement('div')

      // Add no class name
      vanillaRenderer.addClassName(element, undefined)

      // Ensure the class name was not updated
      element.className.should.eql('')

    })

  })



  describe('#appendChildren', () => {

    it('appends children to an element', () => {

      // Create the element
      const element = document.createElement('div')

      // Create the children to append
      const children = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
      ]

      // Append the children to the element
      vanillaRenderer.appendChildren(element, children)

      // Ensure the children were added correctly
      element.children.length.should.eql(3)
      element.children[0].should.be.exactly(children[0])
      element.children[1].should.be.exactly(children[1])
      element.children[2].should.be.exactly(children[2])

    })


    it('appends a single child to an element', () => {

      // Create the element
      const element = document.createElement('div')

      // Create the child to append
      const child = document.createElement('div')

      // Append the child to the element
      vanillaRenderer.appendChildren(element, child)

      // Ensure the child was added correctly
      element.children.length.should.eql(1)
      element.children[0].should.be.exactly(child)

    })


    it('appends a non-node child to an element as a text node', () => {

      // Create the element
      const element = document.createElement('div')

      // Create the children to append
      const children = [
        document.createElement('div'),
        'a string',
        true,
        3,
      ]

      // Append the children to the element
      vanillaRenderer.appendChildren(element, children)

      // Ensure the children were added correctly
      element.children.length.should.eql(1)
      element.children[0].should.be.exactly(children[0])
      element.childNodes.length.should.eql(4)
      element.childNodes[0].should.be.exactly(children[0])
      element.childNodes[1].textContent.should.be.exactly(children[1])
      element.childNodes[2].textContent.should.be.exactly(`${children[2]}`)
      element.childNodes[3].textContent.should.be.exactly(`${children[3]}`)

    })


    it('does nothing to the element if no children are passed', () => {

      // Create the element
      const element = document.createElement('div')

      // Append the child to the element
      vanillaRenderer.appendChildren(element, undefined)

      // Ensure nothing was added to the element
      element.children.length.should.eql(0)

    })

  })


})
