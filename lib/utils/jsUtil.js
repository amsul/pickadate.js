// @flow

/////////////
// STRINGS //
/////////////

export const caseDash = (string: string) =>
  string
    .split(/(?=[A-Z])/g)
    .map(chunk => chunk.toLowerCase())
    .join('-')

/////////////
// OBJECTS //
/////////////

export const mergeObjects = (defaults: Object, updates: Object) => {
  const mergedObject = {}

  Object.keys(defaults).forEach(key => {
    const defaultValue = defaults[key]
    const updateValue = updates[key]

    // If the values are the same, do nothing
    if (defaultValue === updateValue) {
      return
    }

    // If both values are objects, recursively merge them
    if (
      defaultValue &&
      updateValue &&
      defaultValue.constructor === Object &&
      updateValue.constructor === Object
    ) {
      mergedObject[key] = mergeObjects(defaultValue, updateValue)
      return
    }

    mergedObject[key] = updates.hasOwnProperty(key) ? updateValue : defaultValue
  })

  return mergedObject
}

////////////
// ARRAYS //
////////////

export const createRange = (fromIndex: number, toIndex: number) => {
  const range = []
  for (let index = fromIndex; index <= toIndex; index++) {
    range.push(index)
  }
  return range
}
