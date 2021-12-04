<?php 
header('Access-Control-Allow-Origin: *');
require('./dbScripts/openDB.php');

if($_SERVER['REQUEST_METHOD'] == 'GET') {
    $outArr = array();
    try {

        $selectedQuery='SELECT * FROM categories';
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