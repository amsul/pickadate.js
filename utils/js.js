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



module.exports = {
  createRange,
}