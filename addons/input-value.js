let stateUtil = require('utils/state')



function getValue(picker, template, nextState = picker.state) {
  template = template || nextState.template
  return picker.getValue({
    ...nextState,
    template,
  })
}



module.exports = (inputNode, template) => {
  return (picker) => {

    inputNode.value = getValue(picker, template)

    picker.addStateListener(nextState => {
      if (
        stateUtil.isChangingAny(
          picker.state, nextState,
          'language', 'selected'
        )
      ) {
        inputNode.value = getValue(picker, template, nextState)
      }
    })

  }
}