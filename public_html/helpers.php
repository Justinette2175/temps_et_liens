<?php
require('dbscripts/openDB.php');

function insertCategory(string $name) {
    try {
        $file_db->exec("PRAGMA foreign_keys = on");
        $insertCategoryQuery = "INSERT INTO categories(name) VALUES($name)";
        $file_db->exec($insertCategoryQuery);
        $new_category = array();
        $new_category['id'] = $file_db->lastInsertId();
        $new_category['name'] = $name;
        return $new_category;
    }   catch(PDOException $e) {
        echo $e->getMessage();
    }
}

function insertPerson(string $name) {
    try {
        $file_db->exec("PRAGMA foreign_keys = on");
        $insertCategoryQuery = "INSERT INTO persons(name) VALUES($name)";
        $file_db->exec($insertCategoryQuery);
        $new_person_id = $file_db->lastInsertId();
        // echo ("Insertinto categories table successful. New item id: ".$new_person_id);
        return $new_person_id;
    }   catch(PDOException $e) {
        echo $e->getMessage();
    }
}

?>