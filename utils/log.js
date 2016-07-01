let deepDiff = require('deep-diff')



//////////////////
// DICTIONARIES //
//////////////////



const STATE_DICTIONARY = {
  N: {
    color : '#4CAF50',
    label : 'NEXT',
  },
  P: {
    color : '#9E9E9E',
    label : 'PREVIOUS',
  },
}



const DIFF_DICTIONARY = {
  A: {
    color  : '#2196F3',
    label  : 'ARRAY',
    render : ({ path, index, item }) => (
      renderDiffUpdates({ ...item, path: [...path, index]})
    )
  },
  D: {
    color  : '#F44336',
    label  : 'DELETED',
    render : ({ path }) => `${renderUpdatePath(path)}`,
  },
  E: {
    color  : '#2196F3',
    label  : 'CHANGED',
    render : ({ path, lhs, rhs }) => `${
      renderUpdatePath(path)
    } ${
      renderUpdateValue(lhs)
    } → ${
      renderUpdateValue(rhs)
    }`
  },
  N: {
    color  : '#4CAF50',
    label  : 'ADDED',
    render : ({ path, rhs }) => `${
      renderUpdatePath(path)
    } ${
      renderUpdateValue(rhs)
    }`,
  },
}





/////////////////////
// STATE RENDERERS //
/////////////////////



function renderStateLabel(kind) {
  return `${STATE_DICTIONARY[kind].label}:`
}





///////////////////
// STATE STYLERS //
///////////////////



function styleState(kind) {
  return `color: ${STATE_DICTIONARY[kind].color}; font-weight: bold`
}





//////////////////////
// UPDATE RENDERERS //
//////////////////////



function renderUpdatePath(path) {
  return path.join('.')
}



function renderUpdateValue(value) {
  return Array.isArray(value) ? `[${value}]` : value
}





////////////////////
// DIFF RENDERERS //
////////////////////



function renderDiffUpdates(diff) {
  let render = DIFF_DICTIONARY[diff.kind].render
  return render ? render(diff) : diff
}



function renderDiffLabel(diff) {
  return `${DIFF_DICTIONARY[diff.kind].label}: `
}



function renderDiffItemLabel(diff) {
  return diff.item ? renderDiffLabel(diff.item) : ''
}





//////////////////
// DIFF STYLERS //
//////////////////



function styleDiffLabel(diff) {
  return `color: ${DIFF_DICTIONARY[diff.kind].color}; font-weight: bold`
}



function styleDiffItemLabel(diff) {
  return diff.item ? styleDiffLabel(diff.item) : ''
}





//////////
// DIFF //
//////////



function diff(state, nextState) {

  let diffs = deepDiff(state, nextState)

  console.log(`%c${renderStateLabel('P')}`, styleState('P'), state)
  console.log(`%c${renderStateLabel('N')}`, styleState('N'), nextState)
  if (diffs) {
    diffs.forEach(diff => console.log(
      [
        `%c${renderDiffLabel(diff)}`,
        `%c${renderDiffItemLabel(diff)}`,
        `%c${renderDiffUpdates(diff)}`,
      ].join(''),
      styleDiffLabel(diff),
      styleDiffItemLabel(diff),
      ''
    ))
  }
  else {
    console.log('—— No diff ——')
  }

  return nextState

}





////////////////////////////
// PAYLOAD RENDER & STYLE //
////////////////////////////



function renderPayloadLabel() {
  return 'PAYLOAD:'
}



function stylePayloadLabel() {
  return `color: ${'#EAAA0C'}; font-weight: bold`
}





/////////////
// PAYLOAD //
/////////////



function payload(payload) {
  console.log(
    `%c${renderPayloadLabel()}`,
    stylePayloadLabel(),
    payload,
  )
}





/////////////
// EXPORTS //
/////////////



module.exports = {
  diff,
  payload,
}