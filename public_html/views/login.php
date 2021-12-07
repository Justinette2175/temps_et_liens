<?php
    header('Access-Control-Allow-Origin: *');
    echo "My session is";
    echo $_SESSION["user_id"];
?>
<html>
<body>
    <form method="POST" action="../login.php">
        <input type="text" size="24" name = "username" required>
        <button type="submit" name="submit">Login</button>
    </form>
    </body>
</html>