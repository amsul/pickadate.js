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
// NUMBERS //
/////////////

export const padZero = (number: number | string, digitsCount: number) => {
  number = `${number}`

  const numberDigitsCount = number.length
  const differenceInDigitsCount = digitsCount - numberDigitsCount

  return differenceInDigitsCount > 0
    ? '0'.repeat(differenceInDigitsCount) + number
    : number
}

/////////////
// OBJECTS //
/////////////

export const mergeUpdates = <Defaults: Object>(
  defaults: Defaults,
  updates: Object
): Defaults => {
  const mergedObject = { ...defaults }

  Object.keys(defaults).forEach(key => {
    const defaultValue = defaults[key]
    const updateValue = updates[key]

    // If there is no default, remove the key
    if (defaultValue === undefined) {
      delete mergedObject[key]
      return
    }

    // If the default is the same as the update, do nothing
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
      mergedObject[key] = mergeUpdates<$ElementType<Defaults, typeof key>>(
        defaultValue,
        updateValue
      )
      return
    }

    mergedObject[key] = updates.hasOwnProperty(key) ? updateValue : defaultValue
  })

  return mergedObject
}

export const copyDefinedValues = (object: Object) =>
  Object.keys(object).reduce((accumulator, key) => {
    const value = object[key]
    if (value !== undefined) {
      accumulator[key] = value
    }
    return accumulator
  }, {})

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
