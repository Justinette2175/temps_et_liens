<?php 
header('Access-Control-Allow-Origin: *');
require("helpers.php");
require('dbscripts/openDB.php');

 if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $category_id = $_POST['category_id'];
    $person_id = $_POST['person_id'];
    if (empty($category_id) || empty($person_id)) {
        die("Missing category_id or person_id");
    } else {
        try {
            $file_db->exec("PRAGMA foreign_keys = on");
            $insertQuery = "INSERT INTO persons_categories(category_id, person_id) VALUES('$category_id', '$person_id')";
            $file_db->exec($insertQuery);
            echo(json_encode($file_db->lastInsertId()));
            $file_db = null;
        }   catch(PDOException $e) {
            echo $e->getMessage();
        }
    }
 }

?>