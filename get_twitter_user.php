<?php

header('Content-type: application/json');

require 'config.php';
require 'twitteroauth/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;


//Now we make a TwitterOAuth instance with the users access_token
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET);

//Name of twitter account
$twitterName = $_GET['name'];

//Gets tweets
$user = $connection->get("users/show", array('screen_name' => $twitterName));
echo(json_encode($user));
    

?>
