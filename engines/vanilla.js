const SCOPE      = require('constants/scope')

let actions      = require('actions')
let classes      = require('classes')
let calendarUtil = require('utils/calendar')
let pickerUtil   = require('utils/picker')
let stateUtil    = require('utils/state')



////////////
// RENDER //
////////////



/**
 * Renders a picker into a node with a starting state.
 * @param  {HTMLElement} parentNode
 * @param  {Object} startingState
 * @return {picker}
 */
function render(parentNode, startingState) {

  // Create the picker object using the starting state.
  let picker = pickerUtil.create(startingState)

  // Create the root element using the current state.
  let rootElement = createRootElement(picker)

  // Append the root element to the parent node.
  parentNode.appendChild(rootElement)

  // Return the picker object.
  return picker

}





//////////////////
// ROOT ELEMENT //
//////////////////



function createRootElement(picker) {

  let onTouchMove = (event) => {
    event.preventDefault()
  }

  let node = createNode(
    classes.root,
    [
      createSectionNode(classes.section_header, [
        createButtonPreviousElement(picker),
        createButtonScopeElement(picker),
        createButtonNextElement(picker),
      ]),
      createSectionNode(
        classes.section_body,
        createGridElement(picker)
      ),
      createSectionNode(classes.section_footer, [
        createButtonTodayElement(picker),
        createButtonClearElement(picker),
      ]),
    ],
    { onTouchMove }
  )

  return node

}





/////////////////////
// BUTTON ELEMENTS //
/////////////////////



function createButtonScopeElement(picker) {

  let onClick = () => picker.dispatch(actions.cycleScope())

  let node = createButtonNode(
    [classes.button, classes.button_scope],
    createButtonScopeLabelElement(picker.state),
    onClick
  )

  picker.addStateListener(nextState => {
    if (stateUtil.isChangingAny(picker.state, nextState, 'view', 'scope')) {
      node.innerHTML = ''
      appendChildren(node, createButtonScopeLabelElement(nextState))
    }
  })

  return node

}



function createButtonScopeLabelElement(state) {
  let { scope, view } = state
  return calendarUtil.getRangeLabel(view, scope)
}



function createButtonPreviousElement(picker) {

  let onClick = () => picker.dispatch(
    actions.showPreviousView(picker.state.scope)
  )

  let node = createButtonNode(
    [classes.button, classes.button_previous],
    '',
    onClick
  )

  return node

}



function createButtonNextElement(picker) {

  let onClick = () => picker.dispatch(
    actions.showNextView(picker.state.scope)
  )

  let node = createButtonNode(
    [classes.button, classes.button_next],
    '',
    onClick
  )

  return node

}



function createButtonTodayElement(picker) {

  let onClick = () => picker.dispatch(
    actions.showView(picker.state.today)
  )

  let node = createButtonNode(
    [classes.button, classes.button_today],
    'today',
    onClick
  )

  return node

}



function createButtonClearElement(picker) {

  let onClick = () => picker.dispatch(actions.select(null))

  let node = createButtonNode(
    [classes.button, classes.button_clear],
    'clear',
    onClick
  )

  return node

}





///////////////////
// GRID ELEMENTS //
///////////////////



function createGridElement(picker) {

  let onClick = (event) => {
    let value = getValueFromMouseEvent(event)
    if (value) {
      picker.dispatch(actions.select(value))
    }
  }

  let node = createButtonNode(
    [classes.grid],
    createGridCellElements(picker.state),
    onClick
  )

  picker.addStateListener(nextState => {
    if (stateUtil.isChangingAny(picker.state, nextState, 'view', 'selected')) {
      node.innerHTML = ''
      appendChildren(node, createGridCellElements(nextState))
    }
  })

  return node

}



function createGridCellElements(state) {

  let datesForRows = calendarUtil.getDatesForRows(state)

  let nodes = datesForRows.map(datesForRow => (
    createNode(
      [classes.gridRow, classes.gridRow_body],
      datesForRow.map(dateForCell => (
        createGridCellElement(state, dateForCell)
      ))
    )
  ))

  if (state.scope === SCOPE.DAYS) {
    let weekdays = calendarUtil.getWeekdays(state)
    nodes.unshift(createNode(
      [classes.gridRow, classes.gridRow_heading],
      weekdays.map(weekday => (
        createNode(classes.gridCell, weekday)
      ))
    ))
  }

  return nodes

}



function createGridCellElement(state, dateObject) {

  let { scope } = state

  let className = {
    [classes.gridCell]          : true,
    [classes.gridCell_selected] : stateUtil.isSelected(state, dateObject),
    [classes.gridCell_today]    : stateUtil.isToday(state, dateObject),
  }

  let attributes = {
    dataset: { value: dateObject.getTime() }
  }

  let node = createNode(
    className,
    calendarUtil.getLabel(dateObject, scope),
    attributes
  )

  return node

}





///////////
// NODES //
///////////



function createNodeWithOptions(tagName, options = {}) {

  let { attributes, children, className } = options

  let element = document.createElement(tagName)

  addAttributes(element, attributes)
  addClassList(element, className)
  appendChildren(element, children)

  return element

}



function createNode(className, children, attributes) {
  return createNodeWithOptions('div', {
    attributes,
    children,
    className,
  })
}



function createButtonNode(className, children, attributes) {

  if (typeof attributes === 'function') {
    attributes = { onClick: attributes }
  }

  return createNodeWithOptions('button', {
    attributes,
    children,
    className,
  })

}



function createSectionNode(className, children) {
  return createNode(
    [classes.section, className],
    children
  )
}





//////////////////
// NODE HELPERS //
//////////////////



function addAttributes(element, attributes) {

  if (!attributes) {
    return
  }

  Object.keys(attributes).forEach(attributeName => {

    let attributeValue = attributes[attributeName]

    if (typeof attributeValue === 'function') {
      element.addEventListener(
        attributeName.replace(/^on/, '').toLowerCase(),
        attributeValue
      )
      return
    }

    if (attributeName !== 'dataset') {
      element[attributeName] = attributeValue
      return
    }

    Object.keys(attributeValue).forEach(datasetName => {
      element.dataset[datasetName] = attributeValue[datasetName]
    })

  })

}



function addClassList(element, classList) {

  if (!classList) {
    return
  }

  if (!Array.isArray(classList)) {
    classList = [classList]
  }

  classList.forEach(classList => {

    if (typeof classList === 'string') {
      classList = {
        [classList]: true
      }
    }

    Object.keys(classList).forEach(className => {
      if (classList[className]) {
        element.classList.add(className)
      }
    })

  })

}



function appendChildren(element, children) {

  if (!children) {
    return
  }

  children = Array.isArray(children) ? children : [children]
  children.forEach(child => {

    if (!(child instanceof Node)) {
      child = document.createTextNode(child)
    }

    element.appendChild(child)

  })

}





///////////////////
// EVENT HELPERS //
///////////////////



function getValueFromMouseEvent(event) {

  let { value } = event.target.dataset

  if (value == null) {
    return
  }

  value = (+value)

  if (!Number.isFinite(value)) {
    console.error('Unable to get value from mouse event %o', event)
    return
  }

  return value

}





/////////////
// EXPORTS //
/////////////



module.exports = {
  render,
}