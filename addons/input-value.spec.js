let sinon           = require('sinon')

let inputValueAddon = require('addons/input-value')
let pickerObject    = require('objects/picker')
let animationUtil   = require('utils/animation')



describe('/inputValueAddon', () => {

  it('creates an addon for an input with a starting value', () => {

    // Create the picker
    let picker = pickerObject.create({
      selected: new Date(2015, 3, 20)
    })

    // Create the input
    let inputNode = document.createElement('input')

    // Create the input addon with the input and pass the picker
    inputValueAddon(inputNode)(picker)

    // Ensure the value was updated
    inputNode.value.should.eql('20 April, 2015')

  })


  it('creates an addon for an input that listens for state changes and updates', () => {

    // Create the picker
    let picker = pickerObject.create()

    // Create the input
    let inputNode = document.createElement('input')

    // Create the input addon with the input and pass the picker
    inputValueAddon(inputNode)(picker)

    // Ensure the value was not updated
    inputNode.value.should.eql('')

    // Capture the animation frame
    let getFrameStub = sinon.stub(animationUtil, 'getFrame')

    // Update the selected value
    // and ensure the value was updated
    picker.select(new Date(2015, 3, 20))
    getFrameStub.lastCall.args[1]()
    inputNode.value.should.eql('20 April, 2015')

    // Update something irrelevant
    // and ensure the value was not updated
    picker.cycleScope()
    getFrameStub.lastCall.args[1]()
    inputNode.value.should.eql('20 April, 2015')

    // Clean up
    getFrameStub.restore()

  })


  it('creates an addon for an input with a custom template', () => {

    // Create the picker
    let picker = pickerObject.create({
      selected: new Date(2015, 3, 20)
    })

    // Create the input and template
    let inputNode = document.createElement('input')
    let template  = 'YYYY-MMMM-DD'

    // Create the input addon with the input and pass the picker
    inputValueAddon(inputNode, template)(picker)

    // Ensure the value was updated
    inputNode.value.should.eql('2015-April-20')

  })


  it('creates an addon for an input with a custom template that updates with the template', () => {

    // Create the picker
    let picker = pickerObject.create()

    // Create the input and template
    let inputNode = document.createElement('input')
    let template  = 'YYYY-MMMM-DD'

    // Create the input addon with the input and pass the picker
    inputValueAddon(inputNode, template)(picker)

    // Ensure the value was not updated
    inputNode.value.should.eql('')

    // Capture the animation frame
    let getFrameStub = sinon.stub(animationUtil, 'getFrame')

    // Update the selected value
    picker.select(new Date(2015, 3, 20))

    // Trigger the animation frame callback
    getFrameStub.lastCall.args[1]()

    // Ensure the value was updated
    inputNode.value.should.eql('2015-April-20')

    // Clean up
    getFrameStub.restore()

  })

})