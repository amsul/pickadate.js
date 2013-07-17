// Slovak

(function($)
{
    $.extend( $.fn.pickadate.defaults, {
        monthsFull: [ 'január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december' ],
        monthsShort: [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII' ],
        weekdaysFull: [ 'nedeļľa', 'pondelok', 'utorok', 'streda', 'š̌švrtok', 'piatok', 'sobota' ],
        weekdaysShort: [ 'Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So' ],
        today: 'dnes',
        clear: 'vymazať',
        firstDay: 1,
        format: 'd. mmmm yyyy',
        formatSubmit: 'yyyy/mm/dd'
    });
})(jQuery);