// Italian

(function($)
{
    $.extend( $.fn.pickadate.defaults, {
        monthsFull: [ 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre' ],
        monthsShort: [ 'gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic' ],
        weekdaysFull: [ 'domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato' ],
        weekdaysShort: [ 'dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab' ],
        today: 'oggi',
        clear: 'cancellare',
        firstDay: 1,
        format: 'dddd d mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd'
    });
})(jQuery);