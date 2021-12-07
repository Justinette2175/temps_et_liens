<?php 
header('Access-Control-Allow-Origin: *');
include("./partials/redirectToLoginIfNoSession.php");
require('./dbScripts/openDB.php');

if($_SERVER['REQUEST_METHOD'] == 'GET') {
    $outArr = array();
    $user_id = $_SESSION["user_id"];
    try {

        $selectedQuery='SELECT * FROM categories WHERE categories.user_id = ?';
        $statement = $file_db->prepare($selectedQuery);

        $statement->execute(array($user_id));
    
        //go through every row (as an associative array and append to the array)
        while($row = $statement->fetch(PDO::FETCH_ASSOC))
        {
            $outArr[] = $row;
        }
    
        echo(json_encode($outArr));

    } catch(PDOException $e) {
        echo $e->getMessage();
    }
}

?>