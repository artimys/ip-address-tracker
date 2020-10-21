/*******************************************
 * COMMON PAGE ELEMENTS
 * *****************************************/

const searchForm = document.querySelector("form");
const searchButton = document.querySelector("button");
const searchInput = document.querySelector("#search");



/*******************************************
 * SETUP LEAFLET MAP
 * *****************************************/

// Store marker object when adding/removing from map
let customMarker;

// Create custom icon for marker
let blackLocationMarker = L.icon({
    iconUrl: 'images/icon-location.svg',
    iconSize:     [46, 56],
    iconAnchor:   [22, 94],
});

// Create the map
let mymap = L.map('mapid', { zoomControl: false }).setView([43.732249, 7.413752], 80);

// Set the map tiles from Mapbox
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        // '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        // 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    // id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);



/*******************************************
 * SETUP FORM/BUTTON EVENT LISTENERS
 * *****************************************/

function searchTracker(event) {
    event.preventDefault();
    let searchValue = searchInput.value.trim();

    if (validIPAddress(searchValue)) {
        callIPifyAPI(searchValue);
        return
    }
    if (validDomain(searchValue)) {
        callIPifyAPI(searchValue, "domain");
        return
    }

    alert("Please enter a valid Domain or IP Address");
}

searchForm.addEventListener("submit", searchTracker);
searchButton.addEventListener("click", searchTracker);


/*******************************************
 * VALIDATION FUNCTIONS DOMAIN AND IP ADDRESS
 * *****************************************/

function validIPAddress(value) {
    // Regex found at https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(value);
}

function validDomain(value) {
    return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(value);
}



/*******************************************
 * TRIGGER IPIFY API AND DISPLAY RESULTS TO PAGE
 * *****************************************/

function callIPifyAPI(value, searchType = "ip") {
    searchQuery = "ipAddress=" + value;
    if (searchType == "domain") {
        searchQuery = searchQuery.replace("ipAddress", "domain");
    }

    fetch("https://geo.ipify.org/api/v1?apiKey=at_C92aBZ9a4WqwVYqDlf48yJIFglSNe&" + searchQuery)
        .then(response => {
            if (!response.ok) {
                throw response.statusText;
            }
            return response.json();
        })
        .then(data => {
            let lng = data.location.lng;
            let lat = data.location.lat;

            // Render data to the appropriate label
            document.querySelector("#ipAddress").innerHTML = data.ip;
            document.querySelector("#location").innerHTML = data.location.city + ", " + data.location.region + " " + data.location.postalCode;
            document.querySelector("#timezone").innerHTML = data.location.timezone;
            document.querySelector("#isp").innerHTML = data.isp;

            // Move map to new location using lat, long coordinates
            mymap.setView([lat, lng], 80);
            // CustomMarker will be undefined at first page load
            if (customMarker != null) {
                // Remove marker from map
                customMarker.remove();
            }
            // Create custom marker and store it for later use.
            // Note: if more than one marker on map, consider a LayerGroup to manage all (mymap.addLayer(customMarker);)
            customMarker = new L.Marker([lat, lng], {icon: blackLocationMarker});
            // Add marker to map
            customMarker.addTo(mymap);
        });
}



/*******************************************
 * GRABBING IP ADDRESS WITH USER'S PERMISSION
 * USING GEOLOCATION API
 * *****************************************/

function userLocationGranted(position) {
    // let lat = position.coords.latitude;
    // let lng = position.coords.longitude;

   fetch("https://api.ipify.org?format=json")
        .then(response => {
            if (!response.ok) {
                throw response.statusText;
            }
            return response.json();
        })
        .then(data => {
            searchInput.value = data.ip;
            callIPifyAPI(data.ip);
        });
}
navigator.geolocation.getCurrentPosition(userLocationGranted);