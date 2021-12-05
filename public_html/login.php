<?php 
    header('Access-Control-Allow-Origin: *');
    require('dbscripts/openDB.php');
    session_start();

    if($_SERVER['REQUEST_METHOD'] == 'POST') {
        $username = $_POST['username'];
        if (empty($username)) {
            die("Needs username to login");
        } else {
            try {
                $file_db->exec("PRAGMA foreign_keys = on");
                $get_user_stmt = $file_db->prepare('SELECT * FROM users WHERE users.username = ?');
                $get_user_stmt->execute(array($username));
                $user = $get_user_stmt->fetch();
                $get_user_stmt->closeCursor();
                if (!empty($user)) {
                    $_SESSION["username"] = $user['username'];
                    $_SESSION["user_id"] = $user['id'];
                    header("Location: views/index.php");
                  } else {
                    $create_user_stmt = $file_db->prepare('INSERT INTO users(username) VALUES(?)');
                    $create_user_stmt->execute(array($username));
                    $_SESSION["username"] = $username;
                    $_SESSION["user_id"] = $file_db->lastInsertId();
                    header("Location: views/index.php");
                  }
                $file_db = null;
            }   catch(PDOException $e) {
                echo $e->getMessage();
            }
        }
    }
?>