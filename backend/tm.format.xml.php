<?php
$data = json_decode($_POST["data"], true);

$title = $_POST["title"];

$tm = new SimpleXMLElement('<tilemap/>');

$tm->addAttribute("title", $data["name"]);
$tm->addAttribute("description", $data["description"]);
$tm->addAttribute("width", $data["width"]);
$tm->addAttribute("height", $data["height"]);
$tm->addAttribute("texture", $data["texture"]);

$sprites = $tm->addChild("sprites");
$sprites->addAttribute("width", $data["tile_width"]);
$sprites->addAttribute("height", $data["tile_height"]);

$spritesData = $data["sprites"];

foreach($spritesData as $spriteData) {
	$sprite = $sprites->addChild("sprite");
	$sprite->addAttribute("id", $spriteData["id"]);
	$sprite->addAttribute("startx", $spriteData["startx"]);
	$sprite->addAttribute("starty", $spriteData["starty"]);
}

$tiles = $tm->addChild("tiles");

$tilesData = $data["tiles"];

foreach($tilesData as $tileData) {
	$tile = $tiles->addChild("tile");
	$tile->addAttribute("id", $tileData["id"]);
}

header("Content-type: text/xml");
header("Content-disposition: attachment; filename=" . $title . ".xml");
header("Pragma: no-cache");
header("Expires: 0");

print $tm->asXML();
?>