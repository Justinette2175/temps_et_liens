<?php 

require("helpers.php");
require('dbscripts/openDB.php');

 if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $person_name = $_POST['name'];
    $categories = $_POST['categories'];
    if (empty($person_name)) {
        die("Cannot create person without a name");
    } else {
        try {
            $output = array();
            $file_db->exec("PRAGMA foreign_keys = on");
            $insertpersonQuery = "INSERT INTO persons(name) VALUES('$person_name')";
            $file_db->exec($insertpersonQuery);
            $new_person = array();
            $new_person_id = $file_db->lastInsertId();
            $new_person['id'] = $new_person_id;
            $new_person['name'] = $person_name;
            if (isset($categories) && is_array($categories)) {
                for($i = 0; $i < count($categories); $i++){
                    $category_id = $categories[$i];
                    array_push($output, $category_id);
                    $new_person_id_to_insert = $new_person_id;
                    $insertPersonCategoryQuery = "INSERT INTO persons_categories(category_id, person_id) VALUES($category_id, $new_person_id_to_insert)";
                    $file_db->exec($insertPersonCategoryQuery);
                }
            }
            
            echo(json_encode($output));
            $file_db = null;
        }   catch(PDOException $e) {
            echo $e->getMessage();
        }
    }
 }

?>