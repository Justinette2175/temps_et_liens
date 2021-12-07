<?php
  include("../partials/redirectToLoginIfNoSession.php");
  session_start();
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>En temps et liens</title>
    <script defer src="../frontend/dist/index.js"></script>
</head>
<body class="flex flex-col">
    <header class="flex justify-between items-center px-4 py-4">
      <h1 class="text-2xl italic">En Temps et Liens</h1>
      <div id="app-buttons"><button id="logout-btn" class="app-button">Logout</button></div>
    </header>
    <main class="flex flex-grow">
      <div id="visualization" class="relative flex-grow">
        <div id="svg"></div>
        <div id="info"></div>
        <div id="hovers"></div>
      </div>
      <div id="sidebar" class="flex-none w-3/12 relative">
        <div id="tags" class="flex flex-wrap justify-end pr-4"></div>
      </div>
    </main>
    <div id="prompts"></div>
    <script src="https://kit.fontawesome.com/07e841bff8.js" crossorigin="anonymous"></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.1/svg.min.js"
      integrity="sha512-Aj0P6wguH3GVlCfbvTyMM90Zq886ePyMEYlZooRfx+3wcSYyUa6Uv4iAjoJ7yiWdKamqQzKp7yr/TkMQ8EEWbQ=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
</body>
</html>
