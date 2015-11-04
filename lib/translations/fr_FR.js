// French

(function (global, factory) {
   return typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../picker')) :
   typeof define === 'function' && define.amd ? define(['picker'], factory) : factory(global.Picker)
}(this, function (Picker) {
Picker.defineDateLocale('fr_FR', {
    monthsFull: [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ],
    monthsShort: [ 'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec' ],
    weekdaysFull: [ 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi' ],
    weekdaysShort: [ 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam' ],
    today: 'Aujourd\'hui',
    clear: 'Effacer',
    close: 'Fermer',
    firstDay: 1,
    format: 'dd mmmm yyyy',
    formatSubmit: 'yyyy/mm/dd',
    labelMonthNext:"Mois suivant",
    labelMonthPrev:"Mois précédent",
    labelMonthSelect:"Sélectionner un mois",
    labelYearSelect:"Sélectionner une année"
});

    Picker.defineTimeLocale('fr_FR', {
    clear: 'Effacer'
});
}));