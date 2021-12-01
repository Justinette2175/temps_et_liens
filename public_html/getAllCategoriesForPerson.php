<?php 
require('./dbScripts/openDB.php');

if($_SERVER['REQUEST_METHOD'] == 'GET') {
    $outArr = array();
    $person_id = $_GET["personId"];
    if (empty($person_id)) {
        die('Cannot get categories for person without personId');
    }
    
    try {
        $sth = $file_db->prepare('SELECT categories.name AS category_name, categories.id as category_id
        FROM persons_categories 
        INNER JOIN categories ON categories.id = persons_categories.category_id
        WHERE persons_categories.person_id = ?
        ');
        $sth->execute(array($person_id));
        $result = $sth->fetchAll();
    
        echo(json_encode($result));

    } catch(PDOException $e) {
        echo $e->getMessage();
    }
}

?>