function getFrame(animationFrame, callback) {
  window.cancelAnimationFrame(animationFrame)
  return window.requestAnimationFrame(callback)
}



module.exports = {
  getFrame,
}