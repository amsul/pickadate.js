let fs               = require('fs')

const SCOPE          = require('constants/scope')

let classes          = require('classes')
let calendarUtil     = require('utils/calendar')
let dateUtil         = require('utils/date')
let stateUtil        = require('utils/state')

let checkmarkIcon    = fs.readFileSync('icons/checkmark.svg')
let chevronDownIcon  = fs.readFileSync('icons/chevronDown.svg')
let chevronLeftIcon  = fs.readFileSync('icons/chevronLeft.svg')
let chevronRightIcon = fs.readFileSync('icons/chevronRight.svg')
let crossIcon        = fs.readFileSync('icons/cross.svg')
let bullsEyeIcon     = fs.readFileSync('icons/bullsEye.svg')



////////////
// RENDER //
////////////



/**
 * Renders a picker into a node with a starting state.
 * @param  {HTMLElement} parentNode
 * @param  {Picker} picker
 */
function render(parentNode, picker) {

  // Create the root element using the current state.
  let rootElement = createRootElement(picker)

  // Append the root element to the parent node.
  parentNode.appendChild(rootElement)

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
        createButtonScopeElement(picker),
        createButtonNavigationElement(picker),
      ]),
      createSectionNode(
        classes.section_body,
        createGridElement(picker)
      ),
      createSectionNode(classes.section_footer, [
        createButtonClearElement(picker),
        createButtonConfirmElement(picker),
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

  let onClick = () => picker.cycleScope()

  let node = createButtonNode(
    [classes.button, classes.button_scope],
    createButtonScopeItemElements(picker.state),
    onClick
  )

  picker.addStateListener(nextState => {
    if (
      stateUtil.isChangingAny(
        picker.state, nextState,
        'language', 'scope', 'selected', 'view'
      )
    ) {
      node.innerHTML = ''
      appendChildren(node, createButtonScopeItemElements(nextState))
    }
  })

  return node

}



function createButtonScopeItemElements(state) {

  if (!state.selected) {
    return [
      createButtonScopeChevronElement(state),
      createButtonScopeEmptyElement(state),
    ]
  }

  return [
    createButtonScopeChevronElement(state),
    createButtonScopeDateElement(state),
    createNode(
      [classes.scopeItem, classes.scopeItem_compound],
      [
        createButtonScopeMonthAndYearElement(state),
        createButtonScopeWeekdayElement(state),
      ]
    )
  ]

}



function createButtonScopeChevronElement(state) {

  let node = createNode([
    classes.scopeItem,
    classes.scopeItem_chevron,
  ])

  node.innerHTML = chevronDownIcon

  return node

}



function createButtonScopeEmptyElement(state) {

  let node = createNode(
    [
      classes.scopeItem,
      classes.scopeItem_empty,
    ],
    dateUtil.format(state.view, 'MMM YYYY', state.language)
  )

  return node

}



function createButtonScopeDateElement(state) {

  let node = createNode(
    [
      classes.scopeItem,
      classes.scopeItem_date,
    ],
    createNode(
      [classes.scopeItemLabel, classes.scopeItemLabel_date],
      dateUtil.format(state.selected, 'D', state.language)
    )
  )

  return node

}



function createButtonScopeMonthAndYearElement(state) {

  let node = createNode(
    [
      classes.scopeItemLabel,
      classes.scopeItemLabel_monthAndYear,
    ],
    dateUtil.format(state.selected, 'MMM YYYY', state.language)
  )

  return node

}



function createButtonScopeWeekdayElement(state) {

  let node = createNode(
    [
      classes.scopeItemLabel,
      classes.scopeItemLabel_weekday,
    ],
    dateUtil.format(state.selected, 'DDDD', state.language)
  )

  return node

}



function createButtonNavigationElement(picker) {

  let node = createNode(
    classes.navigation,
    [
      createButtonNavigationPreviousElement(picker),
      createButtonNavigationTodayElement(picker),
      createButtonNavigationNextElement(picker),
    ]
  )

  return node

}



function createButtonNavigationPreviousElement(picker) {

  let onClick = () => picker.showPrevious()

  let node = createButtonNode(
    [classes.button, classes.button_navigation, classes.button_previous],
    '',
    onClick
  )

  node.innerHTML = chevronLeftIcon

  return node

}



function createButtonNavigationTodayElement(picker) {

  let onClick = () => picker.showToday()

  let node = createButtonNode(
    [classes.button, classes.button_navigation, classes.button_today],
    '',
    onClick
  )

  node.innerHTML = bullsEyeIcon

  return node

}



function createButtonNavigationNextElement(picker) {

  let onClick = () => picker.showNext()

  let node = createButtonNode(
    [classes.button, classes.button_navigation, classes.button_next],
    '',
    onClick
  )

  node.innerHTML = chevronRightIcon

  return node

}



function createButtonClearElement(picker) {

  let onClick = () => picker.clear()

  let node = createButtonNode(
    [classes.button, classes.button_clear],
    '',
    onClick
  )

  node.innerHTML = crossIcon

  return node

}



function createButtonConfirmElement(picker) {

  let onClick = () => picker.confirm()

  let node = createButtonNode(
    [classes.button, classes.button_confirm],
    '',
    onClick
  )

  node.innerHTML = checkmarkIcon

  return node

}





///////////////////
// GRID ELEMENTS //
///////////////////



function createGridElement(picker) {

  let onClick = (event) => {
    let value = getValueFromMouseEvent(event)
    if (!value) {
      return
    }
    picker.select(value)
  }

  let node = createButtonNode(
    [classes.grid],
    createGridCellElements(picker.state),
    onClick
  )

  picker.addStateListener(nextState => {
    if (
      stateUtil.isChangingAny(
        picker.state, nextState,
        'disabled', 'language', 'scope', 'selected', 'view'
      )
    ) {
      node.innerHTML = ''
      appendChildren(node, createGridCellElements(nextState))
    }
  })

  return node

}



function createGridCellElements(state) {

  let datesForRows = calendarUtil.getDatesForRows(state.view, state.scope)

  let nodes = datesForRows.map(datesForRow => (
    createNode(
      [classes.gridRow, classes.gridRow_body],
      datesForRow.map(dateForCell => (
        createGridCellElement(state, dateForCell)
      ))
    )
  ))

  if (state.scope === SCOPE.DAYS) {
    let weekdays = calendarUtil.getWeekdays(state.language)
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

  let { language, scope, view } = state

  let isDisabled = stateUtil.isDisabled(state, dateObject)

  let className = {
    [classes.gridCell]           : true,
    [classes.gridCell_disabled]  : isDisabled,
    [classes.gridCell_selected]  : stateUtil.isSelected(state, dateObject),
    [classes.gridCell_today]     : stateUtil.isToday(state, dateObject),
    [classes.gridCell_outOfView] : (
      scope === SCOPE.DAYS &&
      !dateUtil.isSameMonth(view, dateObject)
    ),
  }

  let attributes = isDisabled ? undefined : {
    dataset: { value: dateObject.getTime() }
  }

  let node = createNode(
    className,
    createNode(
      {
        [classes.gridCellLabel]        : true,
        [classes.gridCellLabel_days]   : scope === SCOPE.DAYS,
        [classes.gridCellLabel_months] : scope === SCOPE.MONTHS,
        [classes.gridCellLabel_years]  : scope === SCOPE.YEARS,
      },
      calendarUtil.getLabel(dateObject, scope, language)
    ),
    attributes
  )

  return node

}





///////////
// NODES //
///////////



function createNodeWithOptions(tagName, options) {

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
      let fullDatasetName = `data-${caseDash(datasetName)}`
      element.setAttribute(fullDatasetName, attributeValue[datasetName])
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



function getEventPath(event) {

  /* istanbul ignore if: used as a progressive enhancement */
  if (event.path) {
    return event.path
  }

  let path   = []
  let target = event.target

  while (target.parentNode) {
    path.push(target)
    target = target.parentNode
  }

  path.push(document, window)

  return path

}



function getValueFromMouseEvent(event) {

  let eventPath = getEventPath(event)
  let value     = getValueFromMouseEventPath(eventPath, event.currentTarget)

  if (value == null) {
    return
  }

  value = parseInt(value, 10)

  if (!Number.isFinite(value)) {
    console.error('Unable to get value from mouse event %o', event)
    return
  }

  return value

}



function getValueFromMouseEventPath(path, rootNode) {

  for (let i = 0; i < path.length; i += 1) {

    let node = path[i]

    if (node === rootNode) {
      return
    }

    let { value } = node.dataset

    if (value != null) {
      return value
    }

  }

}





////////////////////
// STRING HELPERS //
////////////////////



function caseDash(string) {
  return (
    string.split(/(?=[A-Z])/g)
      .map(chunk => chunk.toLowerCase())
      .join('-')
  )
}





/////////////
// EXPORTS //
/////////////



module.exports = {
  render,
}