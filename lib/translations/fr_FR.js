// French

(function($)
{
    $.extend( $.fn.pickadate.defaults, {
        monthsFull: [ 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre' ],
        monthsShort: [ 'jan', 'fev', 'mar', 'avr', 'mai', 'juin', 'juil', 'aou', 'sep', 'oct', 'nov', 'dec' ],
        weekdaysFull: [ 'dimanche', 'lundi', 'mardy', 'mercredi', 'jeudi', 'vendredi', 'samedi' ],
        weekdaysShort: [ 'dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam' ],
        today: 'aujourd\'hui',
        clear: 'effacer',
        firstDay: 1,
        format: 'dd mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd'
    });
})(jQuery);