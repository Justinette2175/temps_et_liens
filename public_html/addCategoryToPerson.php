<?php 
include("./partials/redirectToLoginIfNoSession.php");
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
            $insert_stmt = $file_db->prepare("INSERT INTO persons_categories(category_id, person_id) VALUES(?, ?)");
            $insert_stmt->execute(array($category_id, $person_id));
            $person = array(
                'person_id'-> $person_id
            );
            echo(json_encode($person));
            $file_db = null;
        }   catch(PDOException $e) {
            echo $e->getMessage();
        }
    }
 }

?>