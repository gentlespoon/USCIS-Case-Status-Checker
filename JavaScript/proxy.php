<?php


// stream_context_set_default(['http'=>['proxy'=>'75.151.213.85:8080']]);
// $externalContent = file_get_contents('http://checkip.dyndns.com/');
// echo $externalContent;
// exit();

echo file_get_contents("https://egov.uscis.gov/casestatus/mycasestatus.do?appReceiptNum=".$_REQUEST['appReceiptNum']);
