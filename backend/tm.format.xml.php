<?php 
$xmlBody = '<?xml version="1.0" encoding="UTF-8" ?>';
$xmlBody .= '<test></test>';

$title = $_POST['title'];

header("Content-type: text/xml");
header("Content-disposition: attachment; filename=" . $title . ".xml");
header("Pragma: no-cache");
header("Expires: 0");
//header("Content-Length: " . size($xmlBody));

echo $xmlBody;
?>