<?php

$imgData = $_REQUEST['imgData'];
$base64 = explode(',', $imgData)[1];
$img = base64_decode($base64);

$a = file_put_contents('./test.jpg', $img);//返回的是字节数
print_r($a);