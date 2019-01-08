// @flow

export const flatten = (
  classNames: mixed | Array<mixed | Array<mixed>>
): { [string]: boolean } => {
  const classList = Array.isArray(classNames) ? classNames : [classNames]
  return classList.reduce((accumulator, className) => {
    if (!className) {
      return accumulator
    }
    if (Array.isArray(className)) {
      className.forEach(className => {
        if (typeof className === 'string') {
          accumulator[className] = true
        }
      })
    } else if (typeof className === 'string') {
      accumulator[className] = true
    } else if (className.constructor === Object) {
      accumulator = { ...accumulator, ...className }
    }
    return accumulator
  }, {})
}

export const join = (
  classNames: mixed | Array<mixed | Array<mixed>>
): string => {
  const classData = flatten(classNames)
  return Object.keys(classData)
    .reduce((accumulator, className) => {
      if (classData[className]) {
        accumulator.push(className)
      }
      return accumulator
    }, [])
    .join(' ')
}
