const stateUtil = require('utils/state')



module.exports = (inputNode, template) => {
  return (picker) => {

    inputNode.value = picker.getValue(template)

    picker.addStateListener(previousState => {
      if (
        stateUtil.hasAnyChanged(
          previousState, picker.getState(),
          'language', 'selected'
        )
      ) {
        inputNode.value = picker.getValue(template)
      }
    })

  }
}
