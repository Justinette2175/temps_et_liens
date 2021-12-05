<?php 
include("./partials/redirectToLoginIfNoSession.php");
header('Access-Control-Allow-Origin: *');
require("helpers.php");
require('dbscripts/openDB.php');

 if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = $_SESSION["user_id"];
    $category_name = $_POST['name'];
    if (empty($category_name)) {
        die("Cannot create category without a name");
    } else {
        try {
            $file_db->exec("PRAGMA foreign_keys = on");
            $insertCategoryQuery = "INSERT INTO categories(name, user_id) VALUES('$category_name', '$user_id')";
            $file_db->exec($insertCategoryQuery);
            $new_category = array();
            $new_category['id'] = $file_db->lastInsertId();
            $new_category['name'] = $category_name;
            echo(json_encode($new_category));
            $file_db = null;
        }   catch(PDOException $e) {
            echo  $user_id;
            echo $e->getMessage();
        }
    }
 }

?>