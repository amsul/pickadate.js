//This code is a simple adaptation from the index.js file in CrytoJS node module
(function (root, factory) {
  if (typeof exports === "object") {
    // CommonJS
    module.exports = exports = factory(require('./picker'), require('./picker.date'), require('./picker.time'));
  }
  else if (typeof define === "function" && define.amd) {
    // AMD
    define(['./picker','./picker.date', './picker.time'], factory);
  }
  else {
    // Global (browser)
    factory(root.Picker);
  }
}(this, function (Picker) {

  return Picker;

}));