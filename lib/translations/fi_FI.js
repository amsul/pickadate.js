// Finnish

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {

Picker.defineDateLocale('fi_FI', {
    monthsFull: [ 'tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu' ],
    monthsShort: [ 'tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu' ],
    weekdaysFull: [ 'sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai' ],
    weekdaysShort: [ 'su', 'ma', 'ti', 'ke', 'to', 'pe', 'la' ],
    today: 'tänään',
    clear: 'tyhjennä',
    firstDay: 1,
    format: 'd.m.yyyy',
    formatSubmit: 'yyyy/mm/dd'
});

Picker.defineTimeLocale('fi_FI', {
    clear: 'tyhjennä'
});
}));