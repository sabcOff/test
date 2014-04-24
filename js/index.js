window.addEventListener('load', function() {
	"use strict";
	//Initialize FastClick plugin
    FastClick.attach(document.body);
}, false);

//Declare variables
var myScroll, wrapper, $sectionTitle, $btnLocation, activeLi = 1;

//Set variables
body = document.getElementById("body"),
wrapper = document.getElementById("wrapper");
$sectionTitle = $('h1.sectionTitle');
$btnLocation = $('a#location');

var xhReq = new XMLHttpRequest();
var heightBody = window.innerHeight-50;
var storage = window.localStorage;
storage.setItem("accessCompletion", 2);
uuid = "da371832b49ca7e5"; storage.setItem("contrat", 2); 
var notifId = 0000000;
var uuid;
var widgets = new Array();
var app = {

	initialize: function() {

		//Creation of the css class
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '.cssClass { position:absolute; z-index:2; left:0; top:50px; width:100%; height: '+heightBody+'px; overflow:auto;}';
		document.getElementsByTagName('head')[0].appendChild(style);

		//Add the css class
		wrapper.className = 'cssClass';

		/*Load default option
		xhReq.open("GET", "options/option1.html", false);
		xhReq.send(null);
		document.getElementById("sectionContent").innerHTML=xhReq.responseText;*/
		//Creation of the scroll using iScroll plugin
		myScroll = new iScroll('wrapper', { hideScrollbar: true });
		var url = "";
		var flagStep2 = 0;
		if(storage.getItem("accessCompletion") == null){
			$("#showMenuButton").hide();
			url = "options/createAccess.html";
			myScroll.disable();
		}
		else if(storage.getItem("accessCompletion") == 1){
			$("#showMenuButton").hide();
			url = "options/createAccess.html";
			myScroll.disable();
			flagStep2 = 1;
		}
		else if(storage.getItem("accessCompletion") == 2){
			url = "options/option1.html";
			flagStep2 = 2;
		}
		else{
			url = "options/option1.html";
			flagStep2 = 2;
		}
		$.ajax({
			url: url,
		  	success: function(result){
		  		document.getElementById("sectionContent").innerHTML=result;
		  	},
		  	dataType: "html"
		});
		if(flagStep2 == 1){
			$("#apbPrompt").hide();
			$("#secretPrompt").show();
		}
		else if(flagStep2 == 2){
			$("marquee").marquee();
		}

		//Add default active class to the menu
		$( "ul.ulMenu li:nth-child(1)" ).addClass( "active" );
		

		//Add default header title
		$sectionTitle.text('Offiboard');
		this.bindEvents();
	},
	bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
    	alert("device ready");
    	//uuid = device.uuid;
    	alert(uuid);
    	pushNotification = window.plugins.pushNotification;
    	
    	
    	
    	//REGISTERING TO PUSH SERVICES
    	if ( device.platform == 'android' || device.platform == 'Android' ){
			pushNotification.register(
				successHandler,
				errorHandler, {
					"senderID":"62687688475",
					"ecb":"onNotificationGCM"
				});
		}
		else{
			pushNotification.register(
				tokenHandler,
				errorHandler, {
					"badge":"true",
					"sound":"true",
					"alert":"true",
					"ecb":"onNotificationAPN"
				});
		}  	
    	
    	
    	
    	
    	
    	//Only for iOS 7 in the Phonegap Project
        if (parseFloat(window.device.version) >= 7.0) 
		{
			$('div#header').css('padding-top','20px');
			$('div#header .btn').css('margin-top','20px');
			$('div#header .location').css('margin-top','20px');
			$('div#sectionContent').css('margin-top','30px');
			$('div#wrapper').css('top','70px');
		}
    }

};

function menu(option){

	//Remove previous active class
	$( "ul.ulMenu li:nth-child("+activeLi+")" ).removeClass( "active" );

	//Add active class to the current option
	$( "ul.ulMenu li:nth-child("+option+")" ).addClass( "active" );

	//Save active option
	activeLi = option;

	//Read by ajax the page
	xhReq.open("GET", "options/option"+option+".html", false);
	xhReq.send(null);
	document.getElementById("sectionContent").innerHTML=xhReq.responseText;

	if(option == 1){
		setTitle('Offiboard - Home');
		$btnLocation.hide();
		myScroll.enable();
		$('marquee').marquee();
	}
	else if(option == 2){
		$btnLocation.show();
		setTitle('Offiboard - Mon Board');
		myScroll.enable();
		setTimeout(charts(), 1000);
	}
	else if(option == 3){
		$btnLocation.hide();
		setTitle('Offiboard - Configuration');
		myScroll.disable();
	}
	else if(option == 4){
		setTitle('Offiboard - Aide');
		myScroll.enable();
	}
	else if(option == 5){
		setTitle('Offiboard - Contact');
		mapObject.init();
	}

	//Refresh of the iScroll plugin
	myScroll.refresh();
	myScroll.scrollTo(0,0);

}

function setTitle(title){
	$sectionTitle.text(title);
}

//Map

var mapObject = {

	init : function(){
		var map, markers = [], openInfoWindow, bounds = new google.maps.LatLngBounds();
		$('div#mapCanvas').css({'height': heightBody - (heightBody/2) + 10 + 'px'});
		var markers = [];
		var latlng = new google.maps.LatLng(49.647325, 5.964669);
		var myOptions = {
			zoom: 16,
			center: latlng,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);
		
		myScroll.enable();
		myScroll.refresh();
		myScroll.scrollTo(0,0);

		this.getMarkers(map);
	},

	getMarkers: function(map){
		//Set a hardcoded marker
		mapObject.addMarker(
			'49.647325',
			'5.964669',
			'Sabco SA',
			'<h3>Sabco SA</h3><br>2 Rue d\'Arlon<br /><p>8399 Windhof, Luxembourg.</p>',
			1,
			false, map);
		$btnLocation.show();
	},

	addMarker: function(lat,lng,title,description,id,position, map){
		var myLatlng = new google.maps.LatLng(lat, lng);

		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			icon : "http://ssl11.ovh.net/~sabco/offiboard/mapmarker.png",
			animation: google.maps.Animation.DROP,
			title: title
		});

		marker.infowindow = new google.maps.InfoWindow({
			content: description
		});

		marker.id = id;

		google.maps.event.addListener(marker, 'click', function() {

			if(marker.title != '')
			{
				marker.infowindow.open(map, marker);    	
			}		
		});

		markers.push(marker);
	}

};

//When user resize the window in the browser, or in mobile change the position, adjust the height of the content
$( window ).resize(function() {
  $('#wrapper').css('height',window.innerHeight-50);
});

function successHandler (result) {
    alert('result = ' + result);
}

function errorHandler (error) {
    alert('error = ' + error);
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    alert('device token = ' + result);
}

// iOS
function onNotificationAPN (event) {
    if ( event.alert )
    {
        navigator.notification.alert(event.alert);
    }

    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}

// Android
function onNotificationGCM(e) {
    switch( e.event ) {
		case 'registered':
			if ( e.regid.length > 0 )
			{
				//console.log("Regid " + e.regid);
				notifId = e.regid;
				alert('registration id = '+e.regid);
			}
		break;

		case 'message':
		  // this is the actual push notification. its format depends on the data model from the push server
		  alert('message = '+e.message+' msgcnt = '+e.msgcnt);
		break;

		case 'error':
		  alert('GCM error = '+e.msg);
		break;

		default:
		  alert('An unknown GCM event has occurred');
		  break;
	}
}

/*
 *
 */
function checkId(){
	$("#apbPrompt").fadeOut(function(){
		$(".spinner").fadeIn();
	}); 
	var contrat = $("#apb-input").val();
	var url = "https://ssl11.ovh.net/~sabco/offiboard/sf/rest2/web/app_dev.php/hello/";
	$.ajax( {
		url:url, 
		method:"POST", 
		data:{'contrat': contrat, 'uuid' : uuid, 'notifId' : notifId},
		statusCode: {
	      200: function(data) {
	        alert(data);
	        storage.setItem("accessCompletion", 1);
	      	storage.setItem("contrat", contrat);
	        $(".spinner").fadeOut(function(){
	        	$("#secretPrompt").fadeIn();
	        }); 
	      },
	      400: function(data) {
	        alert("Oups!");
	        $(".spinner").fadeOut(function(){
	        	$("#apbPrompt").fadeIn();
	        }); 
	       },
	      404: function(data) {
	        alert("Le numéro de contrat est invalide!");
	        $(".spinner").fadeOut(function(){
	        	$("#apbPrompt").fadeIn();
	        }); 
	       },
	      409: function(data) {
	        alert("Cet appareil est déjà associé à ce numéro de contrat.");
	        storage.setItem("accessCompletion", 1);
	      	storage.setItem("contrat", contrat);
	        $(".spinner").fadeOut(function(){
	        	$("#secretPrompt").fadeIn();
	        }); 
	       }
	     }
	});
}


/*
 *
 */
function checkSecret(){
	$("#secretPrompt").fadeOut(function(){
		$(".spinner").fadeIn();
	}); 
	var secret = $("#secret-input").val();
	var contrat = storage.getItem("contrat");
	var url = "https://ssl11.ovh.net/~sabco/offiboard/sf/rest2/web/app_dev.php/check/";
	$.ajax( {
		url:url, 
		method:"post", 
		data:{'contrat': contrat, 'uuid' : uuid, 'secret' : secret},
		statusCode: {
	      200: function(data) {
				alert("Configuration des acces terminée");
				storage.setItem("accessCompletion", 2);
				storage.setItem("pin", 1243);
				myScroll.enable();
				$("#showMenuButton").show();
				$("#content").html("");
				menu(1);
	    	},
	      400: function(data) {
				alert("acces deja cree");
				storage.setItem("accessCompletion", 2);
				storage.setItem("pin", 1243);
				myScroll.enable();
				$("#showMenuButton").show();
				$("#content").html("");
				menu(1);
	       },
	      404: function(data) {
				alert(data);
				$("#.spinner").fadeOut("slow", function(){
					$("#apbPrompt").fadeIn();
				});
	       }
	     }
	});
}

function charts() {
	initialisation();
	//buildCharts();
}
