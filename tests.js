require('should')

// Require all tests
requireAll(require.context('actions', true, /\.spec\.js$/))
requireAll(require.context('engines', true, /\.spec\.js$/))
requireAll(require.context('reducers', true, /\.spec\.js$/))
requireAll(require.context('utils', true, /\.spec\.js$/))



/**
 * Requires all files in a context.
 * @param {require.context} context
 */
function requireAll(context) {
  context.keys().forEach(context)
}