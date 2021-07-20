<?php

require 'config.php';
require 'twitteroauth/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;

// Start the session
session_start();


$_SESSION['tweet'] = $_POST['tweet'];


// Create an instance of the TwitterOAuth class
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

// Request the Access authentication tokens and pass in the parameter the URL we will be redirected to:
$request_token = $connection->oauth('oauth/request_token',
array('oauth_callback' => OAUTH_CALLBACK));

// Save the Access token into the session variable oauth_token
$_SESSION['oauth_token'] = $request_token['oauth_token'];
// Save the Access secret into the session variable oauth_tokensecret
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

// If everything goes well..
if ($connection->getLastHttpCode()==200){
    // Let's generate the URL and redirect
    $url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
    header('Location: '. $url) ;
    /* Should be finished here.. */
    } else {
     // It's a bad idea to kill the script, but we've got to know when there's an error.
    die('Something wrong happened.' . " HTTP Error Code " . $connection->getLastHttpCode());
    }




?>