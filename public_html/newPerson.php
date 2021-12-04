<?php 
header('Access-Control-Allow-Origin: *');
require("helpers.php");
require('dbscripts/openDB.php');

 if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $person_name = $_POST['name'];
    $category_id = $_POST['category'];
    if (empty($person_name)) {
        die("Cannot create person without a name");
    } else {
        try {
            $file_db->exec("PRAGMA foreign_keys = on");
            $insertpersonQuery = "INSERT INTO persons(name) VALUES('$person_name')";
            $file_db->exec($insertpersonQuery);
            $new_person = array();
            $new_person_id = $file_db->lastInsertId();
            $new_person['id'] = $new_person_id;
            $new_person['name'] = $person_name;
            if (isset($category_id)) {
                $new_person_id_to_insert = $new_person_id;
                $insertPersonCategoryQuery = "INSERT INTO persons_categories(category_id, person_id) VALUES('$category_id', '$new_person_id_to_insert')";
                $file_db->exec($insertPersonCategoryQuery);
                $new_person['categories'] = array($category_id);
            }
            
            echo(json_encode($new_person));
            $file_db = null;
        }   catch(PDOException $e) {
            http_response_code(400);
            echo json_encode(array('message' => $e->getMessage()));
        }
    }
 }

?>