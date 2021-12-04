<?php 
    require('openDB.php');
    $file_db->query("delete from persons_categories");
    $file_db->query("delete from persons");
    $file_db->query("delete from categories");

?>