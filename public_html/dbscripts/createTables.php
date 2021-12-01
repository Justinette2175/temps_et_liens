<?php
// Set default timezone
require('openDB.php');
try {
  /**************************************
  * Create tables            *
  /**************************************/

  $file_db->exec("PRAGMA foreign_keys = on");

  $createPersonsTableQuery = 'CREATE TABLE IF NOT EXISTS persons(
    id INTEGER PRIMARY KEY NOT NULL, 
    name TEXT UNIQUE
  )';
  $file_db ->exec($createPersonsTableQuery);

  $createCategoriesTableQuery = 'CREATE TABLE IF NOT EXISTS categories(
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT
  )';
  $file_db ->exec($createCategoriesTableQuery);

  $createPersonsCategoriesTableQuery = 'CREATE TABLE IF NOT EXISTS persons_categories(
      id INTEGER PRIMARY KEY NOT NULL,
      category_id INTEGER,
      person_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (person_id) REFERENCES persons(id)
    )';
  $file_db ->exec($createPersonsCategoriesTableQuery);

  $file_db = null;


  }
  catch(PDOException $e) {
    // Print PDOException message
    echo $e->getMessage();
  }
  ?>
