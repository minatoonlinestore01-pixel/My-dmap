// ----------------------------
// CREATE MAP
// ----------------------------

const map = L.map("map").setView(
    [35.6812, 139.7671],
    12
);


// ----------------------------
// MAP TILES
// ----------------------------

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// Store markers
let markers = [];

const restaurants = [
    {
        name: "Sushi Dai",
        lat: 35.7094,
        lon: 139.7612,
        type: "Japanese Sushi"
    },
    {
        name: "Tokyo Ramen House",
        lat: 35.7048,
        lon: 139.7691,
        type: "Ramen"
    },
    {
        name: "Shibuya Curry Club",
        lat: 35.6595,
        lon: 139.7006,
        type: "Curry"
    },
    {
        name: "Harajuku Grill",
        lat: 35.6705,
        lon: 139.7023,
        type: "Grill"
    }
];


// ----------------------------
// ADD MARKER
// ----------------------------

function addMarker(lat, lon, name) {

    const marker = L.marker([lat, lon])
        .addTo(map);

    marker
        .bindPopup(`<b>${name}</b>`)
        .openPopup();

    markers.push(marker);

    document.getElementById("locationName").textContent = name;

    document.getElementById("coordinates").innerHTML =
        `Latitude: ${lat.toFixed(5)} <br>
         Longitude: ${lon.toFixed(5)}`;
}

function clearMarkers() {

    markers.forEach(
        marker =>
            map.removeLayer(marker)
    );

    markers = [];

    document
        .getElementById("locationName")
        .textContent =
        "No location selected";

    document
        .getElementById("coordinates")
        .innerHTML =
        "Latitude: -- <br> Longitude: --";
}

function showRestaurants() {

    clearMarkers();

    restaurants.forEach(
        (restaurant) => {
            const marker = L.marker([restaurant.lat, restaurant.lon])
                .addTo(map);

            marker.bindPopup(
                `<b>${restaurant.name}</b><br>${restaurant.type}`
            );

            markers.push(marker);
        }
    );

    const center = restaurants[0];

    map.setView(
        [center.lat, center.lon],
        13
    );

    document.getElementById("locationName").textContent =
        `${center.name} (Restaurant)`;

    document.getElementById("coordinates").innerHTML =
        `Latitude: ${center.lat.toFixed(5)} <br>
         Longitude: ${center.lon.toFixed(5)}`;
}


// ----------------------------
// TOKYO BUTTON
// ----------------------------

document
    .getElementById("tokyoBtn")
    .addEventListener("click", function () {

        const lat = 35.6812;
        const lon = 139.7671;

        map.setView([lat, lon], 14);

        addMarker(
            lat,
            lon,
            "Tokyo Station"
        );
    });


// ----------------------------
// HOME BUTTON
// ----------------------------

document
    .getElementById("homeBtn")
    .addEventListener("click", function () {

        map.setView(
            [35.6812, 139.7671],
            12
        );
    });


// ----------------------------
// MY LOCATION
// ----------------------------

document
    .getElementById("locationBtn")
    .addEventListener("click", function () {

        if (!navigator.geolocation) {

            alert(
                "Geolocation is not supported by your browser."
            );

            return;
        }

        navigator.geolocation.getCurrentPosition(

            function (position) {

                const lat =
                    position.coords.latitude;

                const lon =
                    position.coords.longitude;

                map.setView(
                    [lat, lon],
                    15
                );

                addMarker(
                    lat,
                    lon,
                    "My Location"
                );
            },

            function () {

                alert(
                    "Unable to get your location. Please allow location access."
                );
            }

        );

    });


// ----------------------------
// SEARCH LOCATION
// ----------------------------

async function searchLocation() {

    const searchText =
        document
            .getElementById("searchInput")
            .value
            .trim();

    if (!searchText) {

        alert(
            "Please enter a location."
        );

        return;
    }

    try {

        const url =
            "https://nominatim.openstreetmap.org/search" +
            "?format=json" +
            "&limit=1" +
            "&q=" +
            encodeURIComponent(searchText);

        const response =
            await fetch(url);

        const data =
            await response.json();


        if (data.length === 0) {

            alert(
                "Location not found."
            );

            return;
        }


        const result =
            data[0];

        const lat =
            parseFloat(result.lat);

        const lon =
            parseFloat(result.lon);


        map.setView(
            [lat, lon],
            15
        );


        addMarker(
            lat,
            lon,
            result.display_name
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Something went wrong while searching."
        );
    }
}


// Search button

document
    .getElementById("searchBtn")
    .addEventListener(
        "click",
        searchLocation
    );


// Press Enter to search

document
    .getElementById("searchInput")
    .addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                searchLocation();

            }

        }
    );


// ----------------------------
// CLICK MAP TO ADD MARKER
// ----------------------------

map.on(
    "click",
    function (event) {

        const lat =
            event.latlng.lat;

        const lon =
            event.latlng.lng;

        addMarker(
            lat,
            lon,
            "Selected Location"
        );
    }
);


// ----------------------------
// RESTAURANTS BUTTON
// ----------------------------

document
    .getElementById("restaurantsBtn")
    .addEventListener(
        "click",
        showRestaurants
    );


// ----------------------------
// CLEAR MARKERS
// ----------------------------

document
    .getElementById("clearBtn")
    .addEventListener(
        "click",
        clearMarkers
    );

showRestaurants();


// ----------------------------
// DARK MODE
// ----------------------------

document
    .getElementById("darkModeBtn")
    .addEventListener(
        "click",
        function () {

            document
                .body
                .classList
                .toggle("dark");

            if (
                document
                    .body
                    .classList
                    .contains("dark")
            ) {

                this.textContent = "☀️";

            } else {

                this.textContent = "🌙";

            }

        }
    );