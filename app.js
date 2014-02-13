//setup a web view to be used to display the CartoDB page URL we've obtained
var webView = Titanium.UI.createWebView({
	//the url is either the default Cary location OR it's centered on the user's location
	url:'http://rcampbellnc.cartodb.com/viz/21106d10-611f-11e3-b07f-7bfd57a29808/embed_map?title=true&description=true&search=false&shareable=false&cartodb_logo=true&layer_selector=true&legends=true&scrollwheel=true&sublayer_options=1|1&sql=&sw_lat=35.812384285941505&sw_lon=-78.88097763061523&ne_lat=35.85190912405583&ne_lon=-78.74536514282227',
	//provide the capabilities for navigating webpage history, important to provide the ability to look at the plans and go back to the map.
	canGoBack: true,
	canGoForward: true,
	top: '10%',
	height: '90%'
});

function userPopup(userMsg) {
	alert(userMsg);
}

function userLocate () {
	//if location servcies are enabled
	if (Ti.Geolocation.locationServicesEnabled) {
		//Let's fetch the location
    	Titanium.Geolocation.purpose = 'Get Current Location';
    	Titanium.Geolocation.getCurrentPosition(function(e) {
			//if we get an error on location
        	if (e.error) {
        		//log it
            	Ti.API.error('Error: ' + JSON.stringify(e.error));
           		//tell the user
           		userPopup('Encountered ERROR on location. Using existing location.');
           		userPopup(JSON.stringify(e.error));
           		//this reload is called and will use what was previously set for hte URL
           		webView.reload();
        	} else {
        		//we got a location! Log that!
            	//Ti.API.info('coords: ' + JSON.stringify(e.coords));
            	//capture the lat and long
            	var longitude = e.coords.longitude;
            	var latitude = e.coords.latitude;
            	//reconstruct the URL centered on the user's current location
            	webView.url = 'http://rcampbellnc.cartodb.com/viz/21106d10-611f-11e3-b07f-7bfd57a29808/embed_map?title=true&description=true&search=false&shareable=false&cartodb_logo=true&layer_selector=true&legends=true&scrollwheel=true&sublayer_options=1|1&sql=' + '&center_lat=' + latitude + '&center_lon=' + longitude + '&zoom=14';
				//reload the page with the updated URL
            	webView.reload();
           }
		});
	};
}

//Let's get our URL using our location
userLocate();

//The application window
var window = Titanium.UI.createWindow({
	background:'#fff'
});

//a simple button for back
var btnBack = Titanium.UI.createButton({
    title : '< ',
    top : 0,
    left : 0,
    height : '10%',
});

//a simple button for forward
var btnFwd = Titanium.UI.createButton({
    title : ' >',
    top : 0,
    right : 0,
    height : '10%',
});

//a simple button to update location
var btnLoc = Titanium.UI.createButton({
	title : ' *',
	top : 0,
	right : 80,
	height : '10%'
});

//Here is the listener - the logic for what happens when we click the back button
btnBack.addEventListener('click', function() {
	//go back one web page
    webView.goBack();
});

//Here is the listener for the forward button
btnFwd.addEventListener('click', function() {
	//go forward on web page in history
    webView.goForward();
});

//Here is the listener for pressing the * button - update the location
btnLoc.addEventListener('click', function(e) {
	userLocate();
	userPopup('Location Updated.');
});
	
//add our buttons and view to the application window
window.add(btnBack);
window.add(btnFwd);
window.add(btnLoc);
window.add(webView);

//show it
window.open({modal:true});