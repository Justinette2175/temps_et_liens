<?php

try {
    $file_db = new PDO('sqlite:../db/tempsetliens.db');
    $file_db->setAttribute(PDO::ATTR_ERRMODE,
                            PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e) {
  echo $e->getMessage();
}

?>
