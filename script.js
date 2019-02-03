'use strict';

const { ipcRenderer } = require('electron');
const { getCurrentWindow } = require('electron').remote;
var dialog = require('electron').remote.dialog; // Load remote compnent that contains the dialog dependency


var titleSuffix = ' - Gs-USCIS-Case-BatchQuery';

window.addEventListener('keyup', (e) => {
  if (('Rr'.indexOf(e.key)>-1) && (e.ctrlKey)) {
    console.log('Reloading...');
    getCurrentWindow().reload();
  } else if (('Dd'.indexOf(e.key)>-1) && (e.ctrlKey)) {
    getCurrentWindow().openDevTools();
  }
});


var UA = `User Agreement

Sending a large amount of requests to USCIS server may be considered as a Denial of Service Attack to USCIS system. If you do not fully understand what that means, you are strongly advised not to use this software.

You have been warned.

In no event shall the developer be liable for any consequences relating to the use of this software. This software is provided AS-IS, and by continuing, you agree that you assume the entire risk of using the software.`;

if (!confirm(UA)) {
  window.close();
}


var threads = 0;
var totalCases = 0;
var caseIdString = "";
var caseIdPrefix = "";
var caseIdDigits = 0;
var caseIdRangeStart = 0;
var caseIdRangeEnd = 0;
var step = 0;
var index = -1;
var runBatchJob = 0;













$('#btn_stop').click(() => {
  $('#btn_stop').prop('disabled', true);
  $('#btn_run').prop('disabled', false);
  runBatchJob = 0;
});


/**
* On click event of the query button
*/
$('#btn_run').click(() => {

  // show UA again
  // if (!confirm(UA)) {
  //   return false;
  // }

  // disable button
  $('#btn_run').prop('disabled', true);
  $('#btn_stop').prop('disabled', false);


  // check fields
  threads = $("#tb_threads").val();
  if (!$.isNumeric(threads) || parseInt(threads) < 1) {
    alert('You have entered an invalid thread count. There must be at least 1 thread.');
    return false;
  }
  threads = parseInt(threads);

  caseIdString = $("#tb_caseId").val();
  caseIdPrefix = caseIdString.match(/^[A-Z]{3}/gi);
  caseIdDigits = caseIdString.match(/[0-9]{10}$/);
  if (caseIdPrefix === null || caseIdDigits === null) {
    alert("Invalid Case ID");
    return false;
  }
  caseIdDigits = parseInt(caseIdDigits);


  step = $("#tb_step").val();
  if (!$.isNumeric(step) || parseInt(step) < 1) {
    alert("Invalid step width.");
    return false;
  }
  step = parseInt(step);

  var prevCases = $("#tb_prevCases").val();
  if (!$.isNumeric(prevCases) || parseInt(prevCases) < 1) {
    alert("Invalid Previous Cases");
    return false;
  }
  prevCases = parseInt(prevCases);
  caseIdRangeStart = caseIdDigits - prevCases;


  console.log(caseIdRangeStart);

  var nextCases = $("#tb_nextCases").val();
  if (!$.isNumeric(nextCases) || parseInt(nextCases) < 1) {
    alert("Invalid Next Cases");
    return false;
  }
  nextCases = parseInt(nextCases);
  caseIdRangeEnd = caseIdDigits + nextCases;

  if (caseIdRangeEnd < caseIdRangeStart) {
    alert("Incorrect Case Range");
    return false;
  }


  // clear previous run
  $('#dataGridBody').html('');
  index = -1;

  // build table for holding case results
  var realCaseId = '';
  for (var caseId = caseIdRangeStart; caseId < caseIdRangeEnd; caseId+=step) {
    realCaseId = caseIdPrefix + caseId;
    $("#dataGridBody").append(`
        <tr data-caseid="${realCaseId}">
          <td class="td_caseId">${realCaseId}</td>
          <td class="td_form">-</td>
          <td class="td_status">In Queue</td>
          <td class="td_title col">-</td>
          <td class="td_date">-</td>
          <td class="td_raw">-</td>
          <td class="td_pre">
            <pre style="display: none;"></pre>
          </td>
        </tr>
      `);
  }

  runBatchJob = 1;
  threads_semaphore = threads;
  spawnThreads();

});


var threads_semaphore = 0;
var spawnThreads = () => {
  if (!runBatchJob) {
    return false;
  }
  if (threads_semaphore) {
    runSingleQuery();
    threads_semaphore--;
    // some delay to prevent burst traffic
  }
  // if not eof
  if (index < $('#dataGridBody').children().length)
    setTimeout(spawnThreads, 250);
  else
    $('#btn_stop').click();
}





// send interProcessCommunication
var runSingleQuery = () => {
  // interrupted
  if (!runBatchJob) return;
  index++;
  // end of list
  if (index >= $('#dataGridBody').children().length) return;
  // get caseId
  var caseId = $($('#dataGridBody').children()[index]).data('caseid');
  console.log(`Thread started for ` + caseId);
  $(`tr[data-caseid='`+caseId+`'] > td.td_status`).text("Waiting for USCIS");
  ipcRenderer.send('getCaseStatus', caseId);
}




// receive interProcessCommunication
ipcRenderer.on('gotCaseStatus', (evt, data) => {
  $(`tr[data-caseid='`+data.caseId+`'] > td.td_status`).text(data.parsed[0]).prop('title', data.parsed[0]);
  $(`tr[data-caseid='`+data.caseId+`'] > td.td_title`).text(data.parsed[1]).prop('title', data.parsed[1]);
  $(`tr[data-caseid='`+data.caseId+`'] > td.td_form`).text(data.parsed[2]).prop('title', data.parsed[2]);
  $(`tr[data-caseid='`+data.caseId+`'] > td.td_date`).text(data.parsed[3]).prop('title', data.parsed[3]);
  $(`tr[data-caseid='`+data.caseId+`'] > td.td_raw`).html('<button class="viewRaw">View Page</button>');
  $(`tr[data-caseid='`+data.caseId+`'] > td.td_pre > pre`).text(btoa(data.raw));

  $('.viewRaw').click(function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    var caseId = $(this).parent().parent().data('caseid')
    var code = $(`tr[data-caseid='`+data.caseId+`'] > td.td_pre > pre`).text();
    // code = atob(code);
    var w = window.open('', 'w', 'width=1280,height=800');
    var scr = `document.write(atob('` + code + `'))`;
    console.log(scr);
    w.eval(scr);
  });

  // allow next thread to spawn
  threads_semaphore++;
});
