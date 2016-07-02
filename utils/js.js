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



/**
 * Pads a number with leading zeros dependending on a digits count.
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



module.exports = {
  createRange,
  padZero,
}