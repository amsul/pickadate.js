/**
 * Gets a new animation frame request while cancelling a previous frame request.
 * @param  {Number}   animationFrame
 * @param  {Function} callback
 * @return {Number}
 */
function getFrame(animationFrame, callback) {
  window.cancelAnimationFrame(animationFrame)
  return window.requestAnimationFrame(callback)
}



module.exports = {
  getFrame,
}
