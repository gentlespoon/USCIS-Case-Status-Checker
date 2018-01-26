'use strict';

var pageURL = window.location.protocol+"//"+window.location.hostname+"/echo.php";
var totalCases = 0;
var caseIdString = "";
var caseIdPrefix = "";
var caseIdDigits = 0;
var caseIdRangeStart = 0;
var caseIdRangeEnd = 0;
var step = 0;
var cases = [];
var index = -1;

var mutex = 1;

$(document).ready( function() {


  function runSingleQuery() {

    index++;

    if (index >= cases.length) {
      return;
    }

    var caseId = cases[index].caseId;
    $(`#td_status-${caseId}`).text("Dispatched");

    $.ajax({
      // async: false,
      url: pageURL,
      type: 'POST',
      dataType: 'html',
      data: {appReceiptNum: caseId}
      // data: {appReceiptNum: caseId},
    })
    .done(function(data) {
      $(`#td_status-${caseId}`).text("Success");
      // updateCaseStatus(caseId, data);
    })
    .fail(function(error) {
      $(`#td_status-${caseId}`).text("Failed");
    })
    .always(function() {
      console.log("AJAX for " + caseId + " completed.");
      runSingleQuery();
    });
  }


  /**
   * On condition change, update quuery preview
   */
  $(".conditions").change(function() {

    caseIdString = $("#tb_caseId").val();
    caseIdPrefix = caseIdString.match(/^[A-Z]{3}/gi);
    caseIdDigits = caseIdString.match(/[0-9]{10}$/);
    if (caseIdPrefix === null || caseIdDigits === null) {
      alert("Invalid Case ID");
      return false;
    }
    caseIdDigits = parseInt(caseIdDigits);

    step = $("#tb_step").val();
    if ($.isNumeric( step )) {
      step = parseInt(step);
    } else {
      alert("Invalid Step Width");
      return false;
    }

    var prevCases = $("#tb_prevCases").val();
    if ($.isNumeric( prevCases )) {
      prevCases = parseInt(prevCases);
      caseIdRangeStart = caseIdDigits - prevCases;
    } else {
      alert("Invalid Previous N Cases");
      return false;
    }

    var nextCases = $("#tb_nextCases").val();
    if ($.isNumeric( nextCases )) {
      nextCases = parseInt(nextCases);
      caseIdRangeEnd = caseIdDigits + nextCases;
    } else {
      alert("Invalid Next N Cases");
      return false;
    }

    totalCases = Math.ceil ( ( caseIdRangeEnd - caseIdRangeStart ) / step );
    if (totalCases > 1) {
      $(".lb_cases_plural").text('s');
    } else {
      $(".lb_cases_plural").text('');
    }

    if (caseIdRangeEnd < caseIdRangeStart) {
      alert("Incorrect Case Range");
      return false;
    }
    $("#lb_totalCases").text( totalCases );
    $("#lb_step").text( step );
    $("#lb_caseIdRangeStart").text( caseIdPrefix+caseIdRangeStart );
    $("#lb_caseIdRangeEnd").text( caseIdPrefix+caseIdRangeEnd );

  });







/**
 * On click event of the query button
 */
  $("#btn_runQuery").click(function() {
    
    // force refresh query condition
    $("#tb_step").change();

    // clear buffer
    cases = [];
    index = -1;

    // build table for holding case results
    var realCaseId = '';
    for (var caseId = caseIdRangeStart; caseId < caseIdRangeEnd; caseId+=step) {
      realCaseId = caseIdPrefix + caseId;
      cases.push({caseId: realCaseId, status: 0, form: '', title: '', date: ''});
      $("#dataTable").append(`
          <tr>
            <td id='td_caseId-${realCaseId}'>${realCaseId}</td>
            <td id='td_status-${realCaseId}'>In Queue</td>
            <td id='td_form-${realCaseId}'></td>
            <td id='td_title-${realCaseId}'></td>
            <td id='td_date-${realCaseId}'></td>
          </tr>
        `);
    }

    // console.log(cases);
    // start ajax
    runSingleQuery();
    
  });

    







  $("#tb_step").change();
});