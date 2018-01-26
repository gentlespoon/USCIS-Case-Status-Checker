<?php

/**
 * Angda Song (GentleSpoon)
 * https://github.com/gentlespoon/EAD-AutoQuery
 *
 * Basically a giant recursion
 */

$result = [
  'success' => 0,
  'data' => '',
];

function error($msg) {
  $result['data'] = $msg;
  exit( json_encode( $result ) );
}

$location = $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['SERVER_NAME'];

function printv( $_array ) {
  if (is_array($_array)) {
    echo "<pre>";
    print_r($_array);
    echo "</pre>";
  }
}


// if the search is not initialized
if ( empty($_REQUEST) ) {
  // show initialization form
  header('Location: '.$location);
  exit();
}

// which URL to use
if (array_key_exists('REAL', $_REQUEST) && $_REQUEST['REAL'] == "TRUE") {
  $url = 'https://egov.uscis.gov/casestatus/mycasestatus.do';
} else {
  $url = $location.'/echo.php';
  // $url = $location.'/casestatus/mycasestatus.do.html';
}



if (array_key_exists('caseID', $_REQUEST)) {
  preg_match('/([A-z]{3})([0-9]{10})/', $_REQUEST['caseID'], $matches);
  if (empty($matches)) {
    error("Invalid caseID: ".$_REQUEST['caseID']);
  }
  printv($matches);
}
