/**
 * A mapping of directory name to the webpack context.
 * @private
 * @type {Object}
 */
let contextMap = {
  icons: require.context('icons')
}



/**
 * Reads a file synchronously (mimicking the behavior of node-fs)
 * from the mapping of available contexts.
 * @param  {String} path
 * @return {String}
 */
function readFileSync(path) {

  let contextDir = path.split('/')[0]
  let context    = contextMap[contextDir]
  let filePath   = `./${path.substring(path.indexOf('/') + 1)}`

  return context(filePath)

}



module.exports = {
  readFileSync,
}