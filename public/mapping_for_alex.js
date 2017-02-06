var map;

function setSelectValue(clickedStn) {
	var stnList = $("select[name=stn] option");
	for (var i = 0; i < stnList.length; i += 1) {
		if (stnList[i].value === clickedStn) {
			stnList[i].selected = true;
			$.jStorage.set("stn", stnList[i].value);
			break;
		}
	}
}

function statePlaceMarkers (cur_data, event_type, state) {
	var stateCenters = {
		'CT': {lat: 41.6220, lon: -72.7272, zoom: 8, name: 'Connecticut'},
		'DE': {lat: 38.9895, lon: -75.5051, zoom: 8, name: 'Delaware'},
		'DC': {lat: 38.9101, lon: -77.0147, zoom: 8, name: 'DC'},
		'IL': {lat: 40.0411, lon: -89.1965, zoom: 6, name: 'Illinois'},
		'IA': {lat: 42.0753, lon: -93.4959, zoom: 6, name: 'Iowa'},
		'ME': {lat: 45.3702, lon: -69.2438, zoom: 7, name: 'Maine'}, //no stations
		'MD': {lat: 39.0550, lon: -76.7909, zoom: 7, name: 'Maryland'},
		'MA': {lat: 42.2596, lon: -71.8083, zoom: 7, name: 'Massachusetts'},
		'MI': {lat: 44.3461, lon: -85.4114, zoom: 6, name: 'Michigan'}, //no stations
		'MN': {lat: 46.2810, lon: -94.3046, zoom: 6, name: 'Minnesota'},
		'MO': {lat: 38.3568, lon: -92.4571, zoom: 6, name: 'Missouri'},
		'NE': {lat: 41.5392, lon: -99.7968, zoom: 6, name: 'Nebraska'},
		'NH': {lat: 43.6805, lon: -71.5818, zoom: 7, name: 'New Hampshire'},
		'NJ': {lat: 40.1907, lon: -74.6733, zoom: 7, name: 'New Jersey'},
		'NY': {lat: 42.9543, lon: -75.5262, zoom: 6, name: 'New York'},
		'NC': {lat: 35.5579, lon: -79.3856, zoom: 6, name: 'North Carolina'},
		'PA': {lat: 40.8786, lon: -77.7985, zoom: 7, name: 'Pennsylvania'},
		'RI': {lat: 41.6762, lon: -71.5562, zoom: 9, name: 'Rhode Island'},
		'SC': {lat: 33.6290, lon: -80.9500, zoom: 6, name: 'South Carolina'},
		'SD': {lat: 43.9169, lon: -100.2282, zoom: 6, name: 'South Dakota'},
		'VT': {lat: 44.0688, lon: -72.6663, zoom: 7, name: 'Vermont'},
		'VA': {lat: 37.5229, lon: -78.8531, zoom: 7, name: 'Virginia'},
		'WV': {lat: 38.6409, lon: -80.6230, zoom: 7, name: 'West Virginia'},
		'WI': {lat: 44.6243, lon: -89.9941, zoom: 6, name: 'Wisconsin'},
		'AL': {lat: 32.6174, lon: -86.6795, zoom: 7, name: 'Alabama'},
		'ALL':{lat: 42.5000, lon: -75.7000, zoom: 6, name: 'All'},
	};
	var stateInfo = stateCenters.hasOwnProperty(state) ? stateCenters[state] : {lat: 42.5, lon: -75.7, zoom: 6, name: 'All'};
	var newaIcon = new google.maps.MarkerImage(
		'http://newa.nrcc.cornell.edu/gifs/newa_small.png',
		new google.maps.Size(16,16),
		new google.maps.Point(0,0),
		new google.maps.Point(8,8));
	var airportIcon = new google.maps.MarkerImage(
		'http://newa.nrcc.cornell.edu/gifs/airport.png',
		new google.maps.Size(15,15),
		new google.maps.Point(0,0),
		new google.maps.Point(8,8));
	var culogIcon = new google.maps.MarkerImage(
		'http://newa.nrcc.cornell.edu/gifs/culog.png',
		new google.maps.Size(14,14),
		new google.maps.Point(0,0),
		new google.maps.Point(7,7));
	var newaIconGray = new google.maps.MarkerImage(
		'http://newa.nrcc.cornell.edu/gifs/newa_smallGray.png',
		new google.maps.Size(16,16),
		new google.maps.Point(0,0),
		new google.maps.Point(8,8));
	var airportIconGray = new google.maps.MarkerImage(
		'http://newa.nrcc.cornell.edu/gifs/airportGray.png',
		new google.maps.Size(15,15),
		new google.maps.Point(0,0),
		new google.maps.Point(8,8));
	var culogIconGray = new google.maps.MarkerImage(
		'http://newa.nrcc.cornell.edu/gifs/culogGray.png',
		new google.maps.Size(14,14),
		new google.maps.Point(0,0),
		new google.maps.Point(7,7));
	var newaShadow = new google.maps.MarkerImage(
		'http://newa.nrcc.cornell.edu/gifs/newa_small_shdw.png',
		new google.maps.Size(24,16),
		new google.maps.Point(0,0),
		new google.maps.Point(8,8));
	var airportShadow = new google.maps.MarkerImage(
		'http://newa.nrcc.cornell.edu/gifs/airport_shdw.png',
		new google.maps.Size(23,15),
		new google.maps.Point(0,0),
		new google.maps.Point(8,8));
	var culogShadow = new google.maps.MarkerImage(
		'http://newa.nrcc.cornell.edu/gifs/culog_shdw.png',
		new google.maps.Size(21,14),
		new google.maps.Point(0,0),
		new google.maps.Point(7,7));
	var marker,
		markerOptions = {},
		mapOptions = {
			zoom: stateInfo.zoom,
			center: new google.maps.LatLng(stateInfo.lat, stateInfo.lon),
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
			},
			streetViewControl: false,
			scaleControl: true
		};
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	markerOptions.map = map;
	$.each(cur_data.stations, function (i,stn) {
		markerOptions.position = new google.maps.LatLng(stn.lat, stn.lon);
		markerOptions.title = stn.name;
		if (stn.network === "newa" || stn.network === "njwx" || (stn.network === "cu_log" && stn.state !== "NY")) {
			markerOptions.icon = stn.state === state || state === "ALL" ? newaIcon : newaIconGray;
			markerOptions.shadow = newaShadow;
		} else if (stn.network === "cu_log") {
			markerOptions.icon = stn.state === state || state === "ALL" ? culogIcon : culogIconGray;
			markerOptions.shadow = culogShadow;
		} else if (stn.network === "icao") {
			markerOptions.icon = stn.state === state || state === "ALL" ? airportIcon : airportIconGray;
			markerOptions.shadow = airportShadow;
		}
		marker = new google.maps.Marker(markerOptions);

		if (stn.state === state || state === 'ALL') {
			if (event_type === "station_page") {
				google.maps.event.addListener(marker, "click", function() {
					top.location.href="http://newa.cornell.edu/index.php?page=weather-station-page&WeatherStation="+stn.id;
					$.jStorage.set("stn", stn.id);
				});
			} else if (event_type === "select_station") {
				google.maps.event.addListener(marker, "click", function() {
					setSelectValue(stn.id);
				});
			}
		} else {
			google.maps.event.addListener(marker, "click", function() {
				alert("Select " + stateCenters[stn.state].name + " from the State menu to access this station.");
			});
		}

	});
}

function stateStationMap (options) {
	var list_type = options.reqvar || 'all',
		event_type = options.event_type || 'station_page',
		state = options.state || "ALL";
	if (options.state && state.toUpperCase() !== 'ALL') {
		$.jStorage.set("state", state);
	}
	$.getJSON("http://newa.nrcc.cornell.edu/newaUtil/stateStationList/"+list_type+"/"+"ALL")
		.success( function(results) { statePlaceMarkers(results,event_type,state); } )
		.error( function() {
			$('<div id="msg" style="border:1px solid black; padding:0.25em; position:absolute; left:168px; bottom:0px; width:225px; z-index:1; font-size:0.9em; text-align:center; background-color:red; color:white;"></div>').appendTo($("#map"));
			$("#msg").text('Error retrieving station list');
		}
	);
}



// =========================
// From where I call it:
// =========================
<div>
		<script type="text/javascript" src="http://maps.google.com/maps/api/js"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jStorage/0.4.12/jstorage.min.js"></script>
		<script>
			$(document).ready(function () {
				var options = {
					"reqvar": "all",
					"event_type": "station_page",
					"state": $("#reqsta").val().toUpperCase()
				};
				stateStationMap(options);
			});
		</script>
</div>
