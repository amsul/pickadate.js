export default function(initialState = {}) {
  let state = initialState
  return {
    getState: () => state,
  }
}
