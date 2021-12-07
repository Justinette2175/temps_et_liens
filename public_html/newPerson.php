<?php 
include("./partials/redirectToLoginIfNoSession.php");
header('Access-Control-Allow-Origin: *');
require("helpers.php");
require('dbscripts/openDB.php');

 if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $person_name = $_POST['name'];
    $category_ids = $_POST['categories'];
    $user_id = $_SESSION['user_id'];
    if (empty($person_name)) {
        die("Cannot create person without a name");
    } else {
        try {
            $file_db->exec("PRAGMA foreign_keys = on");

            // INSERT PERSON INTO DB
            $insert_person_statement = $file_db->prepare("INSERT INTO persons(name, user_id) VALUES(?, ?)");
            $insert_person_result = $insert_person_statement->execute(array($person_name, $user_id));
            $insert_person_statement->closeCursor();

            $new_person = array();
            $new_person_id = $file_db->lastInsertId();
            $new_person['id'] = $new_person_id;
            $new_person['name'] = $person_name;
            $new_person['categories'] = array();

            // IF CATEGORIES, MAKE LINK BETWEEN CATEGORIES AND PERSON GET THE FULL INFO OF EACH CATEGORY THAT WAS ADDED TO PERSON
            if (isset($category_ids)) {
                $category_ids_arr = explode(",", $category_ids);
                $new_person_id_to_insert = $new_person_id;
                $insert_person_category_stmt = $file_db->prepare("INSERT INTO persons_categories(category_id, person_id) VALUES(?, ?)");
                for ($i = 0; $i < count($category_ids_arr); $i++) {
                    $category_id = $category_ids_arr[$i];
                    $insert_result = $insert_person_category_stmt->execute(array($category_id, $new_person_id_to_insert));
                    $insert_person_category_stmt->closeCursor();
                }
                
                $place_holders = implode(',', array_fill(0, count($category_ids_arr), '?'));
                $select_category_statement = $file_db->prepare("SELECT name, id FROM categories WHERE categories.id IN ($place_holders)");
                $select_category_statement->execute($category_ids_arr);
                while($row = $select_category_statement->fetch(PDO::FETCH_ASSOC))
                {
                    $outArr[] = $row;
                }
                $select_category_statement->closeCursor();
                $new_person['categories'] = $outArr;
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