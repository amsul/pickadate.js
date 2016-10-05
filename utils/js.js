///////////
// RANGE //
///////////



/**
 * Creates a range from one index to another (inclusive).
 * @param  {Number} fromIndex
 * @param  {Number} toIndex
 * @return {Number[]}
 */
function createRange(fromIndex, toIndex) {

  let range = []

  for (let index = fromIndex; index <= toIndex; index++) {
    range.push(index)
  }

  return range

}





////////////
// NUMBER //
////////////



/**
 * Pads a number with leading zeros depending on a digits count.
 * @param  {Number|String} number
 * @param  {Number} digitsCount
 * @return {String}
 */
function padZero(number, digitsCount) {

  number = `${number}`

  let numberDigitsCount       = number.length
  let differenceInDigitsCount = digitsCount - numberDigitsCount

  return (
    differenceInDigitsCount > 0
      ? '0'.repeat(differenceInDigitsCount) + number
      : number
  )

}





////////////
// STRING //
////////////



/**
 * Changes the letter case of a string to be "dashed".
 * @param  {String} string
 * @return {String}
 */
function caseDash(string) {
  return (
    string.split(/(?=[A-Z])/g)
      .map(chunk => chunk.toLowerCase())
      .join('-')
  )
}





///////////
// ARRAY //
///////////



function getIdentity(identity) {
  return identity || ((item, value) => item === value)
}



/**
 * Checks if a value is included in an array.
 * Optionally, an identity matching method can be passed.
 * @param  {Array}  array
 * @param  {Any}  value
 * @param  {Function}  [identity]
 * @return {Boolean}
 */
function isIncluded(array, value, identity) {
  identity = getIdentity(identity)
  return array.some(item => identity(item, value))
}



/**
 * Adds a value to an array and returns a new array if it is not included.
 * Optionally, an identity matching method can be passed.
 * @param  {Array}  array
 * @param  {Any}  value
 * @param  {Function}  [identity]
 * @return {Array}
 */
function addToArray(array, value, identity) {
  if (isIncluded(array, value, identity)) {
    return array
  }
  return [...array, value]
}



/**
 * Removes a value from an array and returns a new array if it is included.
 * Optionally, an identity matching method can be passed.
 * @param  {Array}  array
 * @param  {Any}  value
 * @param  {Function}  [identity]
 * @return {Array}
 */
function removeFromArray(array, value, identity) {

  identity = getIdentity(identity)

  let nextArray = array.filter(item => !identity(item, value))

  return (
    array.length === nextArray.length
      ? array
      : nextArray
  )

}





/////////////
// EXPORTS //
/////////////



module.exports = {

  // Range
  createRange,

  // Number
  padZero,

  // String
  caseDash,

  // Array
  addToArray,
  isIncluded,
  removeFromArray,

}