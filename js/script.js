const searchForm = document.querySelector("form");
const searchButton = document.querySelector("button");
const searchInput = document.querySelector("#search");
const divResults = document.querySelector(".results");



/*******************************************
 * SETUP MAP AND CUSTOM MARKER
 * *****************************************/

const defaultLat = 43.732249;
const defaultLong = 7.413752;

let mymap = L.map('mapid').setView([defaultLat, defaultLong], 80);
let blackLocationMarker= L.icon({
    iconUrl: '../images/icon-location.svg',
    iconSize:     [46, 56], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    // id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);
// L.marker([defaultLat, defaultLong], {icon: blackLocationMarker}).addTo(mymap);



/*******************************************
 * SETUP FORM/BUTTON EVENT LISTENERS
 * *****************************************/

function searchTracker(event) {
    event.preventDefault();
    callTrackerAPI(searchInput.value);
}
searchForm.addEventListener("submit", searchTracker);
searchButton.addEventListener("click", searchTracker);


function callTrackerAPI(value) {
    fetch("https://geo.ipify.org/api/v1?apiKey=at_C92aBZ9a4WqwVYqDlf48yJIFglSNe&ipAddress=" + value)
        .then(function(response) {
            if (!response.ok) {
                throw response.statusText;
            }
            return response.json();
        })
        .then(data => displayResults(JSON.stringify(data)));
}


let displayResults = function(jsonStringData) {
    let objResults = JSON.parse(jsonStringData);
    let lng = objResults["location"]["lng"];
    let lat = objResults["location"]["lat"];

    // Render data to the appropriate label
    document.querySelector("#ipAddress").innerHTML = objResults["ip"];
    document.querySelector("#location").innerHTML = objResults["location"]["city"] + ", " + objResults["location"]["region"] + " " + objResults["location"]["postalCode"];
    document.querySelector("#timezone").innerHTML = objResults["location"]["timezone"];
    document.querySelector("#isp").innerHTML = objResults["isp"];

    // Move map to new location using lat, long coordinates
    mymap.setView([lat, lng], 80);

    // Set custom marker
    L.marker([lat, lng], {icon: blackLocationMarker}).addTo(mymap);
}