<?php

echo file_get_contents("https://egov.uscis.gov/casestatus/mycasestatus.do?appReceiptNum=".$_REQUEST['appReceiptNum']);