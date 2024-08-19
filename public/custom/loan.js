function fetchLoanNumber(loanTypeId) {

    if (loanTypeId) {

        jQuery.ajax({
            type: "POST",
            url: "get_loan_number",
            data: {loanTypeId:loanTypeId, _token: token },
            success: function(data) {
                document.getElementById('advances_loans').value = data.advances_loans;

            }
        });
    } else {
        document.getElementById('advances_loans').value = 0;
    }
}

function validateDates() {
    const startDate = new Date(document.getElementById('start_date').value);
    const endDate = new Date(document.getElementById('end_date').value);
    const outstandingDays = parseInt(document.getElementById('outstanding_days').value);

    if (startDate && endDate && !isNaN(outstandingDays)) {
        const dateDifference = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const totalDays = getBusinessDays(startDate, endDate);
        if (totalDays > outstandingDays) {

            Swal.fire({
                title: 'Insufficient Leave Balance ',
                text: 'The Number of days selected exceed your available balance.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
           // alert('The Number of days select exceeds your available balance.');
            document.getElementById('start_date').value = '';
            document.getElementById('end_date').value = '';
        }
    }
}

function getBusinessDays(startDate, endDate) {
    let days = 0;
    let current = new Date(startDate);
    while (current <= endDate) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            days++;
        }
        current.setDate(current.getDate() + 1);
    }
    return days;
}
