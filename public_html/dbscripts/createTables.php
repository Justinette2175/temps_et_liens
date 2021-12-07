<?php
// Set default timezone
require('openDB.php');
try {
  /**************************************
  * Create tables            *
  /**************************************/

  $file_db->exec("PRAGMA foreign_keys = on");

  $createUsersTableQuery = 'CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY NOT NULL, 
    username TEXT UNIQUE NOT NULL,
    onboarding_stage TEXT
  )';

  $file_db ->exec($createUsersTableQuery);

  $createPersonsTableQuery = 'CREATE TABLE IF NOT EXISTS persons(
    id INTEGER PRIMARY KEY NOT NULL, 
    name TEXT UNIQUE,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )';

  $file_db ->exec($createPersonsTableQuery);

  $createCategoriesTableQuery = 'CREATE TABLE IF NOT EXISTS categories(
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )';
  $file_db ->exec($createCategoriesTableQuery);

  $createPersonsCategoriesTableQuery = 'CREATE TABLE IF NOT EXISTS persons_categories(
      id INTEGER PRIMARY KEY NOT NULL,
      category_id INTEGER NOT NULL,
      person_id INTEGER NOT NULL,
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
