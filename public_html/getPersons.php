<?php 
header('Access-Control-Allow-Origin: *');
require('./dbScripts/openDB.php');

if($_SERVER['REQUEST_METHOD'] == 'GET') {
    $outArr = array();
    try {

        $selectedQuery='SELECT persons.name AS person_name, GROUP_CONCAT(categories.name) AS categories_names,  GROUP_CONCAT(categories.id) as categories_ids, persons.id AS person_id
            FROM persons 
            LEFT JOIN persons_categories ON persons.id = persons_categories.person_id
            LEFT JOIN categories ON categories.id = persons_categories.category_id
            GROUP BY persons.id
        ';

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