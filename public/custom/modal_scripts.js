$(document).on('click', '#pip_hr_link', function() {
    $('#pip_id').val($(this).data('pip_id'));
    $('#staff_name').val($(this).data('staff_name'));
    $('#pip_desc').val($(this).data('pip_desc'));
    $('#start_date').val($(this).data('start_date'));
    $('#end_date').val($(this).data('end_date'));

});

$(document).on('click', '#carry_over_link', function() {
    $('#carry_over_id').val($(this).data('carry_over_id'));
    $('#staff_name').val($(this).data('staff_name'));
    $('#carry_over_days').val($(this).data('amount'));
});


