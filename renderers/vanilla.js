const fs               = require('fs')

const classes          = require('classes')
const SCOPE            = require('constants/scope')
const calendarUtil     = require('utils/calendar')
const dateUtil         = require('utils/date')
const jsUtil           = require('utils/js')

// const checkmarkIcon = fs.readFileSync('icons/checkmark.svg', 'utf-8')
const chevronDownIcon  = fs.readFileSync('icons/chevronDown.svg', 'utf-8')
const chevronLeftIcon  = fs.readFileSync('icons/chevronLeft.svg', 'utf-8')
const chevronRightIcon = fs.readFileSync('icons/chevronRight.svg', 'utf-8')
const crossIcon        = fs.readFileSync('icons/cross.svg', 'utf-8')
const bullsEyeIcon     = fs.readFileSync('icons/bullsEye.svg', 'utf-8')



////////////
// RENDER //
////////////



/**
 * The default layout to use to render pickers.
 * @private
 * @type {Function}
 */
const DEFAULT_LAYOUT = createRootContainer(
  createHeaderContainer(
    createScopeButton(),
    createNavigationContainer(
      createPreviousButton(),
      createTodayButton(),
      createNextButton(),
    ),
  ),
  createBodyContainer(
    createGridButton()
  ),
  createFooterContainer(
    createClearButton(),
  )
)



/**
 * Renders a picker into a node with a starting state.
 * @param  {HTMLElement} parentNode
 * @param  {Picker} picker
 * @param  {Function} [layout=DEFAULT_LAYOUT]
 */
function render(parentNode, picker, layout = DEFAULT_LAYOUT) {

  // Create the root element using the current state.
  const rootElement = layout(picker)

  // Append the root element to the parent node.
  parentNode.appendChild(rootElement)

}





/////////////
// LAYOUTS //
/////////////



function createLayout(...layouts) {
  return (picker) => {
    const element = document.createElement('div')
    appendChildren(element, layouts.map(layout => layout(picker)))
    return element
  }
}





///////////////////////
// CONTAINER LAYOUTS //
///////////////////////



function createRootContainer(...layouts) {
  return (picker) => {

    const onTouchMove = (event) => {
      event.preventDefault()
    }

    const layout  = createLayout(...layouts)
    const element = layout(picker)

    element.className = classes.root

    addAttributes(element, { onTouchMove })

    return element

  }
}



function createHeaderContainer(...layouts) {
  return (picker) => {

    const layout  = createLayout(...layouts)
    const element = layout(picker)

    addClassName(element, [classes.section, classes.section_header])

    return element

  }
}



function createBodyContainer(...layouts) {
  return (picker) => {

    const layout  = createLayout(...layouts)
    const element = layout(picker)

    addClassName(element, [classes.section, classes.section_body])

    return element

  }
}



function createFooterContainer(...layouts) {
  return (picker) => {

    const layout  = createLayout(...layouts)
    const element = layout(picker)

    addClassName(element, [classes.section, classes.section_footer])

    return element

  }
}



function createNavigationContainer(...layouts) {
  return (picker) => {

    const layout  = createLayout(...layouts)
    const element = layout(picker)

    element.className = classes.navigation

    return element

  }
}





///////////////////////
// COMPONENT LAYOUTS //
///////////////////////



function createScopeButton() {
  return (picker) => {

    const onClick = () => picker.cycleScope()

    const button = createButtonNode(
      [classes.button, classes.button_scope],
      createScopeNodes(picker.getState()),
      onClick
    )

    picker.addStateListener(previousState => {
      if (
        jsUtil.hasChanged(
          previousState, picker.getState(),
          'language', 'scope', 'selected', 'view'
        )
      ) {
        button.innerHTML = ''
        appendChildren(button, createScopeNodes(picker.getState()))
      }
    })

    return button

  }
}



function createPreviousButton() {
  return (picker) => {

    const onClick = () => picker.showPrevious()

    const button = createButtonNode(
      [classes.button, classes.button_navigation, classes.button_previous],
      '',
      onClick
    )

    button.innerHTML = chevronLeftIcon

    return button

  }
}



function createTodayButton() {
  return (picker) => {

    const onClick = () => picker.showToday()

    const button = createButtonNode(
      [classes.button, classes.button_navigation, classes.button_today],
      '',
      onClick
    )

    button.innerHTML = bullsEyeIcon

    return button

  }
}



function createNextButton() {
  return (picker) => {

    const onClick = () => picker.showNext()

    const button = createButtonNode(
      [classes.button, classes.button_navigation, classes.button_next],
      '',
      onClick
    )

    button.innerHTML = chevronRightIcon

    return button

  }
}



function createClearButton() {
  return (picker) => {

    const onClick = () => picker.clear()

    const button = createButtonNode(
      [classes.button, classes.button_clear],
      '',
      onClick
    )

    button.innerHTML = crossIcon

    return button

  }
}



function createGridButton() {
  return (picker) => {

    const onClick = (event) => {
      const value = getValueFromMouseEvent(event)
      if (!value) {
        return
      }
      picker.select(value)
    }

    const button = createButtonNode(
      [classes.grid],
      createGridCellElements(picker.getState()),
      onClick
    )

    picker.addStateListener(previousState => {
      if (
        jsUtil.hasChanged(
          previousState, picker.getState(),
          'disabled', 'firstDay', 'language', 'scope', 'selected', 'view'
        )
      ) {
        button.innerHTML = ''
        appendChildren(button, createGridCellElements(picker.getState()))
      }
    })

    return button

  }
}





/////////////////
// SCOPE NODES //
/////////////////



function createScopeNodes(state) {

  if (!state.selected) {
    return [
      createScopeChevronNode(state),
      createScopeEmptyNode(state),
    ]
  }

  return [
    createScopeChevronNode(state),
    createScopeDateNode(state),
    createNode(
      [classes.scopeItem, classes.scopeItem_compound],
      [
        createScopeMonthAndYearNode(state),
        createScopeWeekdayNode(state),
      ]
    ),
  ]

}



function createScopeChevronNode(state) {

  const node = createNode([
    classes.scopeItem,
    classes.scopeItem_chevron,
  ])

  node.innerHTML = chevronDownIcon

  return node

}



function createScopeEmptyNode(state) {

  const node = createNode(
    [
      classes.scopeItem,
      classes.scopeItem_empty,
    ],
    dateUtil.format(state.view, 'MMM YYYY', state.language)
  )

  return node

}



function createScopeDateNode(state) {

  const node = createNode(
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



function createScopeMonthAndYearNode(state) {

  const node = createNode(
    [
      classes.scopeItemLabel,
      classes.scopeItemLabel_monthAndYear,
    ],
    dateUtil.format(state.selected, 'MMM YYYY', state.language)
  )

  return node

}



function createScopeWeekdayNode(state) {

  const node = createNode(
    [
      classes.scopeItemLabel,
      classes.scopeItemLabel_weekday,
    ],
    dateUtil.format(state.selected, 'DDDD', state.language)
  )

  return node

}





////////////////
// GRID NODES //
////////////////



function createGridCellElements(state) {

  const datesForRows = calendarUtil.getDatesForRows(
    state.view, state.scope, state.firstDay
  )

  const nodes = datesForRows.map(datesForRow => (
    createNode(
      [classes.gridRow, classes.gridRow_body],
      datesForRow.map(dateForCell => (
        createGridCellNode(state, dateForCell)
      ))
    )
  ))

  if (state.scope === SCOPE.DAYS) {
    const weekdays = calendarUtil.getWeekdays(state.language, state.firstDay)
    nodes.unshift(createNode(
      [classes.gridRow, classes.gridRow_heading],
      weekdays.map(weekday => (
        createNode(classes.gridCell, weekday)
      ))
    ))
  }

  return nodes

}



function createGridCellNode(state, dateObject) {

  const isDisabled = calendarUtil.isDisabled(dateObject, {
    disabled : state.disabled,
    maximum  : state.maximum,
    minimum  : state.minimum,
    scope    : state.scope,
  })

  const isOutOfView = calendarUtil.isOutOfView(dateObject, {
    scope : state.scope,
    view  : state.view,
  })

  const isSelected = calendarUtil.isSelected(dateObject, {
    scope    : state.scope,
    selected : state.selected,
  })

  const isToday = calendarUtil.isToday(dateObject, {
    scope : state.scope,
    today : state.today,
  })

  const className = {
    [classes.gridCell]           : true,
    [classes.gridCell_disabled]  : isDisabled,
    [classes.gridCell_outOfView] : isOutOfView,
    [classes.gridCell_selected]  : isSelected,
    [classes.gridCell_today]     : isToday,
  }

  const attributes = isDisabled ? undefined : {
    dataset: { value: dateObject.getTime() },
  }

  const node = createNode(
    className,
    createNode(
      {
        [classes.gridCellLabel]        : true,
        [classes.gridCellLabel_days]   : state.scope === SCOPE.DAYS,
        [classes.gridCellLabel_months] : state.scope === SCOPE.MONTHS,
        [classes.gridCellLabel_years]  : state.scope === SCOPE.YEARS,
      },
      calendarUtil.getLabel(dateObject, state.scope, state.language)
    ),
    attributes
  )

  return node

}





///////////
// NODES //
///////////



function createNodeWithOptions(tagName, options) {

  const { attributes, children, className } = options

  const element = document.createElement(tagName)

  addAttributes(element, attributes)
  addClassName(element, className)
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





//////////////////
// NODE HELPERS //
//////////////////



/**
 * Adds attributes to an element.
 * @param {HTMLElement} element
 * @param {Object} attributes
 */
function addAttributes(element, attributes) {

  if (!attributes) {
    return
  }

  Object.keys(attributes).forEach(attributeName => {

    const attributeValue = attributes[attributeName]

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
      const fullDatasetName = `data-${jsUtil.caseDash(datasetName)}`
      element.setAttribute(fullDatasetName, attributeValue[datasetName])
    })

  })

}



/**
 * Adds class names to an element.
 * @param {HTMLElement} element
 * @param {String|Array<String>|Object<Boolean>} [classNameData]
 */
function addClassName(element, classNameData) {

  if (!classNameData) {
    return
  }

  if (!Array.isArray(classNameData)) {
    classNameData = [classNameData]
  }

  classNameData.forEach(classNameData => {

    if (typeof classNameData === 'string') {
      classNameData = {
        [classNameData]: true,
      }
    }

    Object.keys(classNameData).forEach(className => {
      if (classNameData[className]) {
        element.classList.add(className)
      }
    })

  })

}



/**
 * Appends children to an element.
 * @param  {HTMLElement} element
 * @param  {Node|String|Number|Boolean|Array<Node|String|Number|Boolean>} children
 */
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

  const path   = []
  let target = event.target

  while (target.parentNode) {
    path.push(target)
    target = target.parentNode
  }

  path.push(document, window)

  return path

}



function getValueFromMouseEvent(event) {

  const eventPath = getEventPath(event)
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

    const node = path[i]

    if (node === rootNode) {
      return
    }

    const { value } = node.dataset

    if (value != null) {
      return value
    }

  }

}





/////////////
// EXPORTS //
/////////////



module.exports = {

  // Render
  render,

  // Layouts
  createLayout,

  // Container layouts
  createBodyContainer,
  createFooterContainer,
  createHeaderContainer,
  createNavigationContainer,
  createRootContainer,

  // Component layouts
  createClearButton,
  createGridButton,
  createNextButton,
  createPreviousButton,
  createScopeButton,
  createTodayButton,

  // Node helpers
  addAttributes,
  addClassName,
  appendChildren,

}
