// Hungarian

(function($)
{
    $.extend( $.fn.pickadate.defaults, {
        monthsFull: [ 'január', 'február', 'március', 'aprilis', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december' ],
        monthsShort: [ 'jan', 'febr', 'márc', 'apr', 'máj', 'jún', 'júl', 'aug', 'szept', 'okt', 'nov', 'dec' ],
        weekdaysFull: [ 'vasámap', 'hétfö', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat' ],
        weekdaysShort: [ 'V', 'H', 'K', 'SZ', 'CS', 'P', 'SZ' ],
        today: 'ma',
        clear: 'töröl',
        firstDay: 1,
        format: 'yyyy. mmmm dd.',
        formatSubmit: 'yyyy/mm/dd'
    });
})(jQuery);