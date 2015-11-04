// Catalan

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {

Picker.defineDateLocale('ca_ES', {
    monthsFull: [ 'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre' ],
    monthsShort: [ 'Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des' ],
    weekdaysFull: [ 'diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte' ],
    weekdaysShort: [ 'diu', 'dil', 'dim', 'dmc', 'dij', 'div', 'dis' ],
    today: 'avui',
    clear: 'esborrar',
    close: 'tancar',
    firstDay: 1,
    format: 'dddd d !de mmmm !de yyyy',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('ca_ES', {
    clear: 'esborrar'
});
}));