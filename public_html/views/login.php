<?php
    header('Access-Control-Allow-Origin: *');
?>
<html>
<body>
    <form method="POST" action="../login.php">
        <input type="text" size="24" name = "username" required>
        <button type="submit" name="submit">Login</button>
    </form>
    </body>
</html>