//This code is a simple adaptation from the index.js file in CrytoJS node module
(function (root, factory, undef) {
  if (typeof exports === "object") {
    // CommonJS
    module.exports = exports = factory(require('./lib/picker'), require('./lib/picker.date'), require('./lib/picker.time'));
  }
  else if (typeof define === "function" && define.amd) {
    // AMD
    define(['./lib/picker','./lib/picker.date', './lib/picker.time'], factory);
  }
  else {
    // Global (browser)
    factory(root.Picker);
  }
}(this, function (Picker) {

  return Picker;

}));