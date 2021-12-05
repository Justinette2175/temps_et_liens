<?php
    session_start();
    if (empty($_SESSION["user_id"])) {
        header("Location: /code/public_html/views/login.php");
    }
?>