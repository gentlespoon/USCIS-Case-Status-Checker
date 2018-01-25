// var pageURL = 'http://localhost/casestatus/mycasestatus.do';
var pageURL = 'http://localhost/echo.php';
var HTMLbuffer = {};


function query(caseId) {
    // $.post(pageURL, {appReceiptNum: caseId}, function(data, textStatus, xhr) {
    // });
    $.ajax({
        // async: false,
        url: pageURL,
        type: 'POST',
        dataType: 'html',
        data: {appReceiptNum: caseId},
    })
    .done(function(data) {
        console.log("AJAX for " + caseId + " completed.");
        alert(1);
        HTMLresponse = data;
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function(data) {
        console.log("complete");
    });
    return HTMLresponse;
}






$(document).ready( function() {
    alert(query("YSC1890044628"));
    // $("#canvas").text(query("wow"));
});