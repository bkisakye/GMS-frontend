$(document).on('click', '.add-new', function(){

    var tableBody = $(this).parent().find('tbody');
    var template = $('#' + tableBody.attr('id') + '-template').html();
    var lastIndex = parseInt(tableBody.find('tr').last().data('index'));
    if (isNaN(lastIndex)) {
        lastIndex = 0;
    }
    tableBody.append(template.replace(/_INDEX_/g, lastIndex + 1));
    return false;
});
$(document).on('click', '.remove', function () {
    var row = $(this).parentsUntil('tr').parent();
    row.remove();
    return false;
});


