<?php 
include("./partials/redirectToLoginIfNoSession.php");
require('./dbScripts/openDB.php');

if($_SERVER['REQUEST_METHOD'] == 'GET') {
    $outArr = array();
    $category_id = $_GET["categoryId"];
    if (empty($category_id)) {
        die("Please provide a categoryId");
    }
    try {
        $sth = $file_db->prepare('SELECT persons.name AS person_name, categories.name AS category_name, categories.id as category_id, persons.id AS person_id
        FROM persons 
        INNER JOIN persons_categories ON persons.id = persons_categories.person_id
        INNER JOIN categories ON categories.id = persons_categories.category_id
        WHERE categories.id = ?
        ');
        $sth->execute(array($category_id));
        $result = $sth->fetchAll();
    
        echo(json_encode($result));

    } catch(PDOException $e) {
        echo $e->getMessage();
    }
}

?>