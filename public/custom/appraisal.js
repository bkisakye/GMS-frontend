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

function save_output_measure(element_id, objective_id){
    var output_text = document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_output_measure",
        data: {objective_id:objective_id, output_measure:output_text, _token: token },
        success: function(data3) {
        }
    });
}

function save_activities(element_id, objective_id){
    var activities_text = document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_activities",
        data: {objective_id:objective_id, activities:activities_text, _token: token },
        success: function(data3) {
        }
    });
}

function save_location_evidence(element_id, objective_id){
    var location_evidence_text = document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_location_evidence",
        data: {objective_id:objective_id, location_evidence:location_evidence_text, _token: token },
        success: function(data3) {
        }
    });
}

function save_annual_achievements(element_id, objective_id){
    var achievement_text = document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_annual_achievements",
        data: {objective_id:objective_id, achievement:achievement_text, _token: token },
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

function save_annual_self_rating(element_id, objective_id){
    var self_rating= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_annual_self_rating",
        data: {objective_id:objective_id, self_rating:self_rating, _token: token },
        success: function(data3) {
        }
    });
}

function save_agreed_score(element_id, objective_id){
    var self_rating= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_agreed_score",
        data: {objective_id:objective_id, agreed_score:self_rating, _token: token },
        success: function(data3) {
        }
    });
}

function save_action_plan(element_id, objective_id){
    var action_plan= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_action_plan",
        data: {objective_id:objective_id, action_plan:action_plan, _token: token },
        success: function(data3) {
        }
    });
}

function save_greatest_progress(element_id, appraisal_id){
    var greatest_progress= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_greatest_progress",
        data: {appraisal_id:appraisal_id, greatest_progress:greatest_progress, _token: token },
        success: function(data3) {
        }
    });
}

function save_weakness_noticed(element_id, appraisal_id){
    var weakness_noticed= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_weakness_progress",
        data: {appraisal_id:appraisal_id, weakness_noticed:weakness_noticed, _token: token },
        success: function(data3) {
        }
    });
}

function save_competency_agreed_score(element_id, assessment_id){
    var agreed_score= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_competency_agreed_score",
        data: {assessment_id:assessment_id, agreed_score:agreed_score, _token: token },
        success: function(data3) {
        }
    });
}

function save_behavior_comments(element_id,behavior_id){
    var comments= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_behavior_comments",
        data: {behavior_id:behavior_id, comments:comments, _token: token },
        success: function(data3) {
        }
    });
}

function save_behavior_score(element_id,behavior_id){
    var self_score= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_behavior_score",
        data: {behavior_id:behavior_id, self_score:self_score, _token: token },
        success: function(data3) {
        }
    });
}

function save_sup_behavior_comments(element_id,behavior_id){
    var comments= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_sup_behavior_comments",
        data: {behavior_id:behavior_id, comments:comments, _token: token },
        success: function(data3) {
        }
    });
}

function save_pip_score(element_id,objective_id){
    var self_score= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_pip_score",
        data: {objective_id:objective_id, self_score:self_score, _token: token },
        success: function(data3) {
        }
    });
}

function save_pip_staff_comments(element_id,objective_id){
    var comments= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_pip_staff_comment",
        data: {objective_id:objective_id, comments: comments, _token: token },
        success: function(data3) {
        }
    });
}

///locum
function save_locum_score(element_id,objective_id){
    var self_score= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_locum_score",
        data: {objective_id:objective_id, self_score:self_score, _token: token },
        success: function(data3) {
        }
    });
}

function save_locum_staff_comments(element_id,objective_id){
    var comments= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_locum_staff_comment",
        data: {objective_id:objective_id, comments: comments, _token: token },
        success: function(data3) {
        }
    });
}

function save_sup_locum_score(element_id,objective_id){
    var agreed_score= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_sup_locum_score",
        data: {objective_id:objective_id, agreed_score:agreed_score, _token: token },
        success: function(data3) {
        }
    });
}

function save_locum_sup_comments(element_id,objective_id){
    var comments= document.getElementById(element_id).value;

    jQuery.ajax({
        type: "POST",
        url: "/staff/appraisal/save_locum_sup_comments",
        data: {objective_id:objective_id, comments: comments, _token: token },
        success: function(data3) {
        }
    });
}





