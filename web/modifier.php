<?php
// Fetching Values From URL
$id = $_POST['id'];
$username = $_POST['username'];
$email = $_POST['email'];
$age = $_POST['age'];
$prenom = $_POST['prenom'];
$nom = $_POST['nom'];
$location = $_POST['location'];
$facebook = $_POST['facebook'];
$twitter = $_POST['twitter'];
$description = $_POST['description'];
$connection = mysqli_connect("127.0.0.1", "root", ""); // Establishing Connection with Server..
$db = mysqli_select_db("e-rando", $connection); // Selecting Database
    $query = mysqli_query("UPDATE 'member' SET 'email'=$email,'username'=$username,'age'=$age,'prenom'=$prenom,'nom'=$nom,'description'=$description,'location'=$location,'facebook'=$facebook,'twitter'=$twitter WHERE 'id'=$id"); //Insert Query
    var_dump("UPDATE 'member' SET 'email'=$email,'username'=$username,'age'=$age,'prenom'=$prenom,'nom'=$nom,'description'=$description,'location'=$location,'facebook'=$facebook,'twitter'=$twitter WHERE 'id'=$id");
    echo "Form Submitted succesfully";
mysqli_close($connection); // Connection Closed
?>