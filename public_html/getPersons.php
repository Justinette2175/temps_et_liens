<?php 
    include("./partials/redirectToLoginIfNoSession.php");
    header('Access-Control-Allow-Origin: *');
    require('./dbScripts/openDB.php');

if($_SERVER['REQUEST_METHOD'] == 'GET') {
    $person_id = $_GET["id"];
    $outArr = array();
    $user_id = $_SESSION["user_id"];
    try {
        if (!empty($person_id)) {
            $statement = $file_db->prepare("SELECT persons.name AS person_name, GROUP_CONCAT(categories.name) AS categories_names,  GROUP_CONCAT(categories.id) as categories_ids, persons.id AS person_id
            FROM persons 
            LEFT JOIN persons_categories ON persons.id = persons_categories.person_id
            LEFT JOIN categories ON categories.id = persons_categories.category_id
            WHERE persons.user_id = ? AND persons.id = ? GROUP BY persons.id"
            );
            $statement->execute(array($user_id, $person_id));
        } else {
            $statement = $file_db->prepare("SELECT persons.name AS person_name, GROUP_CONCAT(categories.name) AS categories_names,  GROUP_CONCAT(categories.id) as categories_ids, persons.id AS person_id
            FROM persons 
            LEFT JOIN persons_categories ON persons.id = persons_categories.person_id
            LEFT JOIN categories ON categories.id = persons_categories.category_id
            WHERE persons.user_id = ? GROUP BY persons.id"
            );

            $statement->execute(array($user_id));
        }
    
        while($row = $statement->fetch(PDO::FETCH_ASSOC))
        {
            $person = array(
                'name'=>$row["person_name"],
                'id'=>$row["person_id"]
            );
            $categories_ids_ar = explode(",", $row["categories_ids"]);
            $categories_names_ar = explode(",", $row["categories_names"]);
            $out_categories = array();
            for ($i = 0; $i < count($categories_ids_ar); $i++) {
                $cat = [
                    'name'=>$categories_names_ar[$i],
                    'id'=>$categories_ids_ar[$i],
                ];
                $out_categories[] = $cat;
            }
            $person['categories'] = $out_categories;
            $outArr[] = $person;
        }
        echo(json_encode($outArr));
    } catch(PDOException $e) {
        echo $e->getMessage();
    }
}

?>