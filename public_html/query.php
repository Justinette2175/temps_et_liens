<?php 
require('./dbScripts/openDB.php');

if($_SERVER['REQUEST_METHOD'] == 'GET') {
    $outArr = array();

    try {

        $selectedQuery='SELECT persons.name AS person_name, categories.name AS category_name, categories.id as category_id, persons.id AS person_id
            FROM categories 
            INNER JOIN persons_categories ON categories.id = persons_categories.category_id
            LEFT OUTER JOIN persons ON persons.id = persons_categories.person_id
            ';

        // $selectedQuery = 'SELECT * from persons';
        // $selectedQuery = 'SELECT * from categories';
        // $selectedQuery = 'SELECT * from persons_categories';
        $result = $file_db->query($selectedQuery);
        if (!$result) die("Cannot execute query.");
    
        //go through every row (as an associative array and append to the array)
        while($row = $result->fetch(PDO::FETCH_ASSOC))
        {
            $outArr[] = $row;
        }
    
        echo(json_encode($outArr));

    } catch(PDOException $e) {
        echo $e->getMessage();
    }
}

?>