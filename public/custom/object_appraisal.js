function save_objective_title(element_id, objective_id){
    var objective_text = document.getElementById(element_id).value;

    console.log(objective_text);

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_objective_title",
        data: {objective_id:objective_id, objective_title:objective_text, _token: token },
        success: function(data3) {
        }
    });
}

function save_annual_evidence(element_id, objective_id){
    var evidence = document.getElementById(element_id).value;
    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_annual_evidence",
        data: {objective_id:objective_id, evidence:evidence, _token: token },
        success: function(data3) {
        }
    });
}





