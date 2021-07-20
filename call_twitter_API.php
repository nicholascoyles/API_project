<?php

header('Content-type: application/json');

require 'config.php';
require 'twitteroauth/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;


//Now we make a TwitterOAuth instance with the users access_token
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET);

//Twiiter account name
$twitterName = $_GET['name'];


$array = array();

    if($twitterName == "none"){
       // Gets all tweets by default
        $tweets = $connection->get('statuses/user_timeline', array('screen_name' => '@NorthumbriaUni', 'count' => 1, 'exclude_replies' => 'true', 'include_rts' => 'false'));
         //$twitter_users = array('@NULibrary','@NU_CISdept','@NorthumbriaSU','@NorthumbriaUni');

         $tweets2 = $connection->get('statuses/user_timeline', array('screen_name' => '@NULibrary', 'count' => 1, 'exclude_replies' => 'true', 'include_rts' => 'false'));
         //$twitter_users = array('@NULibrary','@NU_CISdept','@NorthumbriaSU','@NorthumbriaUni');

         $tweets3 = $connection->get('statuses/user_timeline', array('screen_name' => '@NU_CISdept', 'count' => 1, 'exclude_replies' => 'true', 'include_rts' => 'false'));
         //$twitter_users = array('@NULibrary','@NU_CISdept','@NorthumbriaSU','@NorthumbriaUni');

         $tweets4 = $connection->get('statuses/user_timeline', array('screen_name' => '@NorthumbriaSU', 'count' => 1, 'exclude_replies' => 'true', 'include_rts' => 'false'));
         //$twitter_users = array('@NULibrary','@NU_CISdept','@NorthumbriaSU','@NorthumbriaUni');

         //Search for mentions
         $search1 = $connection->get("search/tweets", array('q' => '@NorthumbriaUni', 'count' => 1));

         //Add results to array
         $statuses = $search1->statuses;
        if(!empty($search1)) {
	
	        foreach($statuses as $tweet) {	
                array_push($array, $tweet);
	        }
        }
         //Search for mentions
         $search2= $connection->get("search/tweets", array('q' => '@NULibrary', 'count' => 1));
         //Add results to array
         $statuses = $search2->statuses;
        if(!empty($search2)) {
	
	        foreach($statuses as $tweet2) {	
                array_push($array, $tweet2);
	        }
        }
         //Search for mentions
         $search3 = $connection->get("search/tweets", array('q' => '@NU_CISdept', 'count' => 1));
         //Add results to array
         $statuses = $search3->statuses;
         if(!empty($search3)) {
     
             foreach($statuses as $tweet3) {	
                 array_push($array, $tweet3);
             }
         }
         //Search for mentions
         $search4 = $connection->get("search/tweets", array('q' => '@NorthumbriaSU', 'count' => 1));
         //Add results to array
         $statuses = $search4->statuses;
         if(!empty($search4)) {
     
             foreach($statuses as $tweet4) {	
                 array_push($array, $tweet4);
             }
         }
         //Merge all arrays
         $result = array_merge($tweets, $tweets2,$tweets3,$tweets4,$array);

         //Turn results into json format
         echo(json_encode($result));
  





    }else{
        //Gets tweets by twittername
        $account_tweets = $connection->get('statuses/user_timeline', array('screen_name' => $twitterName, 'count' => 10, 'exclude_replies' => 'true', 'include_rts' => 'false'));
        echo(json_encode($account_tweets));
    }




//    $twitter_users = array('@NULibrary','@NU_CISdept','@NorthumbriaSU','@NorthumbriaUni');
//    //Recent tweets by
//    foreach ($twitter_users as $value) {
//       $tweets = $connection->get('statuses/user_timeline', array('screen_name' => $value, 'count' => 5, 'exclude_replies' => 'true', 'include_rts' => 'true'));
//       echo(json_encode($tweets));
//   }





?>