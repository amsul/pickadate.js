const jsUtil = require('utils/js')



module.exports = (inputNode, template) => {
  return (picker) => {

    inputNode.value = picker.getValue(template)

    picker.addStateListener(previousState => {
      if (
        jsUtil.hasChanged(
          previousState, picker.getState(),
          'language', 'selected'
        )
      ) {
        inputNode.value = picker.getValue(template)
      }
    })

  }
}
