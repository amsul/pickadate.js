// French
if ( typeof jQuery.fn.pickadate !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        today: 'Aujourd"hui',
        clear: 'Effacer',
        close: 'Fermer',
        firstDay: 1,
        format: 'dd mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd',
        labelMonthNext: 'Mois suivant',
        labelMonthPrev: 'Mois précédent',
        labelMonthSelect: 'Sélectionner un mois',
        labelYearSelect: 'Sélectionner une année',
        monthsFull: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
        monthsShort: ['Jan','Fev','Mar','Avr','Mai','Juin','Juil','Aou','Sep','Oct','Nov','Dec'],
        weekdaysFull: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
        weekdaysShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
    });
}
if ( typeof jQuery.fn.pickatime !== 'undefined' ) {
    jQuery.extend( jQuery.fn.pickatime.defaults, {
        clear: 'Effacer'
    });
}
