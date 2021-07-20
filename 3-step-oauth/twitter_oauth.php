<?php

require 'config.php';
require 'twitteroauth/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;
?>

<link rel="stylesheet" type="text/css" href="../scripts/styles.css"/>
<?php
// Start the session
session_start();

//twitter oauth
$request_token = [];
$request_token['oauth_token'] = $_SESSION['oauth_token'];
$request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];

if (isset($_REQUEST['oauth_token']) &&
 $request_token['oauth_token'] !== $_REQUEST['oauth_token']) {
 // Abort! Something is wrong.
 // Something's missing, go back to square 1
 header('Location: twitter_login.php');
}

//Now we make a TwitterOAuth instance with the temporary request token.
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET,
$request_token['oauth_token'], $request_token['oauth_token_secret']);

//At this point we will use the temporary request token to get the long lived access_token that authorized to act as the user.
$access_token = $connection->oauth("oauth/access_token",
array("oauth_verifier" => $_REQUEST['oauth_verifier']));

//Now we make a TwitterOAuth instance with the users access_token
$twitter = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET,
$access_token['oauth_token'], $access_token['oauth_token_secret']);


$input = $_SESSION['tweet'];
$post = "{$input} #KF6013_Assignment_Task";


$status = $twitter->post("statuses/update", ["status" => $post]);
	echo"
	<div class='heading'>
		<h1>Tweet posted to your account</h1>
	</div>";
	echo"
	<div class='text'>
		<p>".$post."<p>
	</div>
	
	<a href='../index.html'>
  		<button class='button'>Back</button>
	</a>"
	
	;










?>