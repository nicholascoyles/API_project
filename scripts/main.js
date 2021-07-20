$(document).ready(function(){
	
	var origin1="";
	var destinationA="";
	var map;
	var marker;
	//load map
	initMap();
	//load default weather	
	defaultWeather();
	//Load twitter feed
	uniTwitterFeed();

	//Init map function
function initMap() {
	//Default coordinates
	var myLatlng = new google.maps.LatLng(54.9780796123921085, -1.6072069198222139);
	//Map options
	var mapOptions = {
		center: myLatlng,
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		streetViewControl: true,
		overviewMapControl: false,
		rotateControl: false,
		scaleControl: false,
		panControl: false,
	};

	//Creates map
	map = new google.maps.Map(document.getElementById("map"), 
	mapOptions);	

	//Creates markers
	const uniMarkers = [
	  [{ lat: 54.97671901002635, lng: -1.6070107727016743 }, "@NU_CISdept"],
	  [{ lat: 54.978603500871294, lng: -1.6072069198222139 }, "@NorthumbriaSU"],
	  [{ lat: 54.97869939784175, lng: -1.608934832827241 }, "@NULibrary"],
	  [{ lat: 54.97829075857079, lng: -1.6063155307468027}, "@NorthumbriaUni"],
	];


  //var test = asyncCall();
  var CIStweet = CIS();
  var SUtweet = SU();
  var LIBtweet = LIB();
  var UNItweet = UNI();

  var promise = Promise.resolve(CIStweet);
  promise.then(function(val) {
	  var promise2 = Promise.resolve(SUtweet);
	  promise2.then(function(val2) {
		var promise3 = Promise.resolve(LIBtweet);
		promise3.then(function(val3) {
			var promise4 = Promise.resolve(UNItweet);
			promise4.then(function(val4) {
	
	//Array of tweet data
	var tweetArray = [];

	//Puts tweet data in array
	tweetArray[0] = val;
	tweetArray[1] = val2;
	tweetArray[2] = val3;
	tweetArray[3] = val4;

	// marker images
	const images = [
		"assets/CIS.jpg",
		"assets/NSU.jpg",
		"assets/LIB.jpg",
		"assets/UNN.jpg"
	  ];

	  //Sets content for each marker
	  uniMarkers.forEach(([position, title], i) => {

		//Data for the infowindow
		const infowindow = new google.maps.InfoWindow({
			content: tweetArray[i],
		  });
		  //Sets marker data
	  const marker = new google.maps.Marker({
		position,
		map,
		title: `${title}`,
		icon: images[i],
		optimized: false,
	  });

	  //Mouse over marker
	  marker.addListener('mouseover', function() {
		//Opens infowindow
		infowindow.open(marker.getMap(), marker);
		//Gets content for window
		infowindow.setContent(infowindow.getContent());
		//Get latitude
		var lat = marker.getPosition().lat();
		//Gets longitude
		var lng = marker.getPosition().lng()
		//Gets title
		var name = marker.getTitle();
		//Updates twitter feed with account hover
		updateFeed(name);
		//Updates weather for that location
		updateWeather(lat,lng,name);
	});

	//Click marker
	marker.addListener('click', function() {
		//Opens infowindow
		infowindow.open(marker.getMap(), marker);
		//Get infowindow content
		infowindow.setContent(infowindow.getContent());
		//Gets latitude
		var lat = marker.getPosition().lat();
		//Gets longitude
		var lng = marker.getPosition().lng()
		//Gets title
		var name = marker.getTitle();
		//Sets as destination
		destinationA = new google.maps.LatLng(lat,lng);
		//Updates weather for that location
		updateWeather(lat,lng,name);
	});
	
	//Closes window when mouse moves off
	marker.addListener('mouseout', function() {
		//close infowindow
		infowindow.close();
		//Set default weather
		defaultWeather();
		//Default twitter feed
		uniTwitterFeed();
	});
});

/**
 * Returns x raised to the n-th power.
 *
 * @param {string} location of the marker
 */
	function placeMarker(location) {
		//Sets marker position
		if ( marker ) {
		  marker.setPosition(location);
		} else {
		  marker = new google.maps.Marker({
			position: location,
			map: map
		  });
		}
	  }
	  
	  //on click creates a new marker and sets the origin point
	  google.maps.event.addListener(map, 'click', function(event) {
		//Sends coordinates to create marker
		placeMarker(event.latLng);
		//Gets lat
		var lat = marker.getPosition().lat();
		//Gets long
		var lng = marker.getPosition().lng();
		//Creates origin
		origin1 = new google.maps.LatLng(lat,lng);
	  });

	  //Updates direction when mode is changed
	  document.getElementById("mode").addEventListener("change", () => {
		updateDirection();
	  });

});
	})})}
)};

/**
 * Updates the distance matrix
 *
 * @param {number} response The coordinates of the points
 * @param {string} status The status of distance maktrix
 */
//get the response and status details from the call to the getDistanceMatrix
function callback(response, status) {
			//if the status is OK then procedd to get the journey details. Otherwise you might want to handle the status response and 
			// display a message to your user. More information on Status codes can be found in the Google Distance Matrix API reference
  			if (status == google.maps.DistanceMatrixStatus.OK) {
				
				//get the origin and destination information from the service. We've only passed one set of journey details 
				//but it's possible to get a response for multiple journeys
   				var origins = response.originAddresses;
    			var destinations = response.destinationAddresses;
				
				$.each(origins, function (originIndex){
					var results = response.rows[originIndex].elements;
					$.each(results, function (resultIndex){
						var element = results[resultIndex];
						var distance = element.distance.text;
        					var duration = element.duration.text;
        					var from = origins[originIndex];
        					var to = destinations[resultIndex];
							
						//for each journey create a div element using jQuery to display the journey information 
						$("#distance-info").empty();
						 $("#distance-info").prepend("<dl id='distance-dl'><dt>Distance: </dt><dd>" + distance + "</dd> <dt>Duration: </dt><dd>" + duration + "</dd> <dt>From: </dt><dd>" + from + "</dd> <dt>To: </dt><dd>" + to + "</dd> </dl>");
					});
				});
 		 }
		}

	
/**
 * Updates the direction matrix when the mode changes
 */
function updateDirection(){
		//Get the current mode
		const selectedMode = document.getElementById("mode").value;

			console.log("get directions");
			var request = {
				origin: origin1,
				destination: destinationA,
				travelMode: google.maps.TravelMode[selectedMode]
			};
			
			//add a variable to call the directions service
			var directionsService = new google.maps.DirectionsService();

			//add a variable to display the directions
			var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true,});
			
			//Sets line colour depending on mode
			if(selectedMode == "WALKING"){
				directionsDisplay.setOptions({
			
					polylineOptions: {
					  strokeColor: 'red'
					}
				  });
			}
			if(selectedMode == "DRIVING"){
				directionsDisplay.setOptions({
			
					polylineOptions: {
					  strokeColor: 'Blue'
					}
				  });
			}
			if(selectedMode == "BICYCLING"){
				directionsDisplay.setOptions({
			
					polylineOptions: {
					  strokeColor: 'green'
					}
				  });
			}
			if(selectedMode == "TRANSIT"){
				directionsDisplay.setOptions({
			
					polylineOptions: {
					  strokeColor: 'orange'
					}
				  });
			}

			//Distance matrix
			var service = new google.maps.DistanceMatrixService();

			//call the getDistanceMatrix method on the DistanceMatrixService
			service.getDistanceMatrix(
			{
				//pass in the origin and destination values and set the other values such as travelmode etc
					origins: [origin1],
					destinations: [destinationA],
					travelMode: google.maps.TravelMode[selectedMode],
					unitSystem: google.maps.UnitSystem.IMPERIAL,		
					avoidHighways: false,
					avoidTolls: false

				//when the service responds run the callback function
			}, callback);


			//send the request to the directionService to get the route
			directionsService.route(request, function(response, status, i) {

				if (status == google.maps.DirectionsStatus.OK) {
		

					var route = response.routes[0];

					//code to add route to map here.
					//add route(s) to the map.
					//set the directionsDisplay to the map object
					directionsDisplay.setMap(map);
					//now set the directionsDisplay Panel to be a div element you created in your document
					//directionsDisplay.setPanel($("#directionsPanel"));	
					//Resets the panel	
					$("#directionsPanel").empty();
					directionsDisplay.setPanel(document.getElementById("directionsPanel"));
					directionsDisplay.setDirections(response);							
				}
			});
		
		}
		
		//Updates direction when button is clicked
		$("#btnGetDirections").click(function(){
			const selectedMode = document.getElementById("mode").value;

			console.log("get directions");
			var request = {
				origin: origin1,
				destination: destinationA,
				travelMode: google.maps.TravelMode[selectedMode]
			};
			
			//add a variable to call the directions service
			var directionsService = new google.maps.DirectionsService();

			
			//add a variable to display the directions

			var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true,});
			
			if(selectedMode == "WALKING"){
				directionsDisplay.setOptions({
			
					polylineOptions: {
					  strokeColor: 'red'
					}
				  });
			}
			if(selectedMode == "DRIVING"){
				directionsDisplay.setOptions({
			
					polylineOptions: {
					  strokeColor: 'Blue'
					}
				  });
			}
			if(selectedMode == "BICYCLING"){
				directionsDisplay.setOptions({
			
					polylineOptions: {
					  strokeColor: 'green'
					}
				  });
			}
			if(selectedMode == "TRANSIT"){
				directionsDisplay.setOptions({
			
					polylineOptions: {
					  strokeColor: 'orange'
					}
				  });
			}

			var service = new google.maps.DistanceMatrixService();

			//call the getDistanceMatrix method on the DistanceMatrixService
			service.getDistanceMatrix(
			{
				//pass in the origin and destination values and set the other values such as travelmode etc
					origins: [origin1],
					destinations: [destinationA],
					travelMode: google.maps.TravelMode[selectedMode],
					unitSystem: google.maps.UnitSystem.IMPERIAL,		
					avoidHighways: false,
					avoidTolls: false

				//when the service responds run the callback function
			}, callback);


			//send the request to the directionService to get the route
			directionsService.route(request, function(response, status, i) {

				if (status == google.maps.DirectionsStatus.OK) {
		

					var route = response.routes[0];

    				var start =route.legs[0].start_location;
   					var end =route.legs[0].end_location;

					function addMarker(pos){
						var marker = new google.maps.Marker({
						  position: pos, 
						  map: map, 
						});
					}

					//code to add route to map here.
					//add route(s) to the map.
					//set the directionsDisplay to the map object
					directionsDisplay.setMap(map);
					//now set the directionsDisplay Panel to be a div element you created in your document
					//directionsDisplay.setPanel($("#directionsPanel"));
					//Resets the panel	
					$("#directionsPanel").empty();
					directionsDisplay.setPanel(document.getElementById("directionsPanel"));
					directionsDisplay.setDirections(response);							
				}
			});
		
		});

	

//Twitter

/**
 * Returns the time stamps of tweets
 *
 * @param {number} time_value The time value on the tweet
 * @return {number} The time stamp on tweet in a readable format
 */
function relTime(time_value) {
	time_value = time_value.replace(/(\+[0-9]{4}\s)/ig,"");
	var parsed_date = Date.parse(time_value);
	var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
	var timeago = parseInt((relative_to.getTime() - parsed_date) / 1000);
	if (timeago < 60) return 'less than a minute ago';
	else if(timeago < 120) return 'about a minute ago';
	else if(timeago < (45*60)) return (parseInt(timeago / 60)).toString() + ' minutes ago';
	else if(timeago < (90*60)) return 'about an hour ago';
	else if(timeago < (24*60*60)) return 'about ' + (parseInt(timeago / 3600)).toString() + ' hours ago';
	else if(timeago < (48*60*60)) return '1 day ago';
	else return (parseInt(timeago / 86400)).toString() + ' days ago';
}
	
/**
 * The default uni twitter feed, gets tweets for all twitter accounts
 *
 */
function uniTwitterFeed(){
	//Add tweet content
	$.getJSON("call_twitter_API.php?name=none", function(tweetdata) {	
		console.log("here");
		console.log(tweetdata);
		$("#tweet-heading").empty();
		$("#tweet-heading").append("<h3>Uni Twitter feed</h3>");
		$("#tweet-list").empty();
		$.each( tweetdata, function( key, objTweet ) {
			if(objTweet.place){
				$("#tweet-list").append("<li>" + objTweet.text + "– " + relTime(objTweet.created_at) + " tweeted from " + objTweet.place.name + "</li>");
			}else{			
				$("#tweet-list").append("<li>" + objTweet.text + "– " + relTime(objTweet.created_at) + "</li>");
			}
		});
		
	}); 


}

/**
 * Gets tweets by account name
 *
 * @param {string} accountName The name of teh account to get tweets from
 */
function updateFeed(accountName){
		//Add tweet content
		var account = accountName;

		//call tweets
		$.getJSON("call_twitter_API.php?name="+ account, function (tweetdata) {		
			$("#account-name").empty();
			//Adds account name
			$("#account-name").append("<h3>"+account+" Feed</h3>");
			$("#account-tweets").empty();
			//Displays each tweet
			$.each( tweetdata, function( key, objTweet ) {
				if(objTweet.place){
					$("#account-tweets").append("<li>" + objTweet.text + "– " + relTime(objTweet.created_at) + " tweeted from " + objTweet.place.name + "</li>");
				}else{			
					$("#account-tweets").append("<li>" + objTweet.text + "– " + relTime(objTweet.created_at) + "</li>");
				}
			});

		});
	
	}


	
/**
 * Gets twitter details for CIS aacount
 *
 * @return {promise} The returned twitter details
 */
	function CIS() {
		return new Promise(resolve => {
		  setTimeout(() => {
			  	//account name
				var account = ["@NU_CISdept"];
				//Result content
				var res = [];

				var i;
				for (i = 0; i < account.length; i++) {

		//Add tweet content
		$.getJSON("get_twitter_user.php?name="+ account[i], function (twitterer) {	
			   res[i] = '<div id="content">' +
			  				'<div id="siteNotice">' +
			  				"</div>" +
			  				'<h1 id="firstHeading" class="firstHeading">' + twitterer.name + '</h1>' +
			  				'<div id="bodyContent">' +
			  				"<li>Screen Name: @" +  twitterer.screen_name  + "</li>" +
			  				"<li>Located: " + twitterer.location  + "</li>" +
			  				"<li>Description: " + twitterer.description  + "</li> " +
			  				"<li>Followers: " + twitterer.followers_count  + "</li> " +
			  				"</div>" +
			  				"</div>";
			resolve(res[i]);
			//half a second time delay
		})}}, 500);
		});
	}
	/**
 * Gets twitter details for SU aacount
 *
 * @return {promise} The returned twitter details
 */
	function SU() {
		return new Promise(resolve => {
		  setTimeout(() => {
				var account = ["@NorthumbriaSU"];

				var res = [];

				var i;
				for (i = 0; i < account.length; i++) {
					

		//Add tweet content
		$.getJSON("get_twitter_user.php?name="+ account[i], function (twitterer) {	
			   res[i] = '<div id="content">' +
			  				'<div id="siteNotice">' +
			  				"</div>" +
			  				'<h1 id="firstHeading" class="firstHeading">' + twitterer.name + '</h1>' +
			  				'<div id="bodyContent">' +
			  				"<li>Screen Name: @" +  twitterer.screen_name  + "</li>" +
			  				"<li>Located: " + twitterer.location  + "</li>" +
			  				"<li>Description: " + twitterer.description  + "</li> " +
			  				"<li>Followers: " + twitterer.followers_count  + "</li> " +
			  				"</div>" +
			  				"</div>";
			resolve(res[i]);
		})}}, 500);
		});
	}
	/**
 * Gets twitter details for Library aacount
 *
 * @return {promise} The returned twitter details
 */
	function LIB() {
		return new Promise(resolve => {
		  setTimeout(() => {
				var account = ["@NULibrary"];

				var res = [];

				var i;
				for (i = 0; i < account.length; i++) {
					

		//Add tweet content
		$.getJSON("get_twitter_user.php?name="+ account[i], function (twitterer) {	
			   res[i] = '<div id="content">' +
			  				'<div id="siteNotice">' +
			  				"</div>" +
			  				'<h1 id="firstHeading" class="firstHeading">' + twitterer.name + '</h1>' +
			  				'<div id="bodyContent">' +
			  				"<li>Screen Name: @" +  twitterer.screen_name  + "</li>" +
			  				"<li>Located: " + twitterer.location  + "</li>" +
			  				"<li>Description: " + twitterer.description  + "</li> " +
			  				"<li>Followers: " + twitterer.followers_count  + "</li> " +
			  				"</div>" +
			  				"</div>";
			resolve(res[i]);
		})}}, 500);
		});
	}
	/**
 * Gets twitter details for UNI aacount
 *
 * @return {promise} The returned twitter details
 */
	function UNI() {
		return new Promise(resolve => {
		  setTimeout(() => {
				var account = ["@NorthumbriaUni"];

				var res = [];

				var i;
				for (i = 0; i < account.length; i++) {
					

		//Add tweet content
		$.getJSON("get_twitter_user.php?name="+ account[i], function (twitterer) {	
			   res[i] = '<div id="content">' +
			  				'<div id="siteNotice">' +
			  				"</div>" +
			  				'<h1 id="firstHeading" class="firstHeading">' + twitterer.name + '</h1>' +
			  				'<div id="bodyContent">' +
			  				"<li>Screen Name: @" +  twitterer.screen_name  + "</li>" +
			  				"<li>Located: " + twitterer.location  + "</li>" +
			  				"<li>Description: " + twitterer.description  + "</li> " +
			  				"<li>Followers: " + twitterer.followers_count  + "</li> " +
			  				"</div>" +
			  				"</div>";
			resolve(res[i]);
		})}}, 500);
		});
	}

	//WHEATER SECTION

/**
 * Sets the default weather
 *
 */
function defaultWeather(){
//Default location Newcastle
var default_location = "Newcastle upon Tyne";
var lat = "";
var lon = "";

//Gets the weather details
$.getJSON("https://api.openweathermap.org/data/2.5/weather?q="+default_location+"&appid=c0d31d33c33fccf35bedfaf46efb49e6&units=metric", function(data) {

	//Assigns results to veriables
	var icon ="http://openweathermap.org/img/wn/" + data.weather[0].icon +".png";
	var temp = Math.floor(data.main.temp);
	var weather = data.weather[0].main;
	var location = data.name;
	var region = data.sys.country;
	var sunrise = new Date(1000*data.sys.sunrise);
	var sunset = new Date(1000*data.sys.sunset);

	lat = data.coord.lat;
	lon = data.coord.lon; 

	//Appends results to html page, emptying the current content
	$(".icon").attr("src", icon);

	$(".location").empty();
		$(".location").append(location+" ("+ region+")");

		$(".weather").empty();
		$(".weather").append(weather);

		$(".temp").empty();
		$(".temp").append(temp+ "°");
	
		$(".sunrise").empty();
		$(".sunrise").append("Sunrisre: "+sunrise);

		$(".sunset").empty();
		$(".sunset").append("Sunset: "+sunset);

		$(".feels-like").empty();
		$(".feels-like").append("Feels like: "+data.main.feels_like);


		$(".humidity").empty();
		$(".humidity").append("Humdity: "+data.main.humidity);

		$(".pressure").empty();
		$(".pressure").append("Pressure: "+data.main.pressure);
});
}


/**
 * Updates the weather details
 * @param {number} lat The latitude of the location
 * @param {number} lng Thelongitude of the location
 * @param {string} name The name of the location
 */

function updateWeather(lat, lng, name) {

	//Gets the weather details
	$.getJSON("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&appid=c0d31d33c33fccf35bedfaf46efb49e6&units=metric", function(data) {
	
		//Assigns results to veriables
		var icon ="http://openweathermap.org/img/wn/" + data.weather[0].icon +".png";
		var temp = Math.floor(data.main.temp);
		var weather = data.weather[0].main;
		var location = name;
		var region = data.sys.country;
		var sunrise = new Date(1000*data.sys.sunset);
		var sunset = new Date(1000*data.sys.sunset);
		lat = data.coord.lat;
		lon = data.coord.lon; 
	
		//Appends results to html page, emptying the current content
		$(".icon").attr("src", icon);
		
		$(".location").empty();
		$(".location").append(location+" ("+ region+")");

		$(".weather").empty();
		$(".weather").append(weather);

		$(".temp").empty();
		$(".temp").append(temp+ "°");
	

		$(".sunrise").empty();
		$(".sunrise").append("Sunrisre: "+sunrise);
		
		$(".sunset").empty();
		$(".sunset").append("Sunset: "+sunset);

		$(".feels-like").empty();
		$(".feels-like").append("Feels like: "+data.main.feels_like);


		$(".humidity").empty();
		$(".humidity").append("Humdity: "+data.main.humidity);

		$(".pressure").empty();
		$(".pressure").append("Pressure: "+data.main.pressure);

	});
}

});

