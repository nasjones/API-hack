let map;
let service;
let infowindow;
let run = false;
let lat;
let lon;
let coordinates;
let placeLoaded;
let restaurantLoaded;

function initialize() {
    let search = $("#query").val();
    placesLoad(search);
    recipesLoad(search);
    outDisplay();
}

function placesLoad(search) {
    placeLoaded = false;
    map = new google.maps.Map(document.getElementById("map"), {
        center: coordinates,
        zoom: 15
    });

    let request = {
        location: coordinates,
        radius: "800",
        query: search
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
}

function callback(results, status) {
    let restaurants = $("#restaurants");
    restaurants.empty();
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        for (let i = 0; i < results.length, i < 10; i++) {
            let place = results[i];

            restaurants.append(`<li class="placeList" id="${place.name}">
            <h3>${place.name}</h3>
            <p class="place-info" id="restaurant-info-${i}">
            Rating: ${place.rating}  currently </p>`);
            $(`#restaurant-info-${i}`);

            if (place.business_status == 'OPERATIONAL') {
                if (place.opening_hours.open_now == true)
                    $(`#restaurant-info-${i}`).append("Open");
                else
                    $(`#restaurant-info-${i}`).append("Closed");
            }
            else
                $(`#restaurant-info-${i}`).append("not operational");
            restaurants.append(`<p class="address">${place.formatted_address}</p></li><hr>`);
        }

    }
    else {
        alert("Sorry there was a problem finding restaurants near you. Try a different search or try again later!");
    }
    placeLoaded = true;
}

function recipesLoad(search) {
    restaurantLoaded = false;
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://api.edamam.com/search?q=" + search + "&app_id=24c87adf&app_key=69ca0b9b101ea652dd98fdcc6f0c3205&callback=?",
        "method": "GET",
        "SameSite": "none",
        jsonpCallback: "jsonCallback",
        contentType: "application/json",
        dataType: "jsonp",
        success: function (results) {
            recipePrinter(results);
        },
        error: function (e) {
            alert("Sorry there was an error finding recipes for you. Try a different search or try again later.");
            console.log(e.message);
        }
    });
}

function recipePrinter(results) {
    restaurantLoaded = true;
    let recipes = $("#recipes");
    recipes.empty();
    for (let i = 0; i < results.hits.length, i < 10; i++) {
        let option = results.hits[i].recipe;
        let identify = "option" + i;
        recipes.append(`<li class="recipeList"><h3>${option.label}</h3>
        <button class="moreButton" onClick="recipeDisplay(this.id)" id="recipe-${i}"><img src="downward-arrow.png" alt="arrow" class="arrow" 
        role="button" ></button><ul class="moreInfo" id="${identify}">`);
        let ingredients = option.ingredientLines;
        for (let j = 0; j < ingredients.length; j++) {
            $(`#${identify}`).append(`<li>${ingredients[j]}</li>`);
        }
        $(`#${identify}`).append(`<li><a href="${option.url}" target="_blank">Link!</a></li>`);

        recipes.append(`</ul><hr>`);
    }
}

function recipeDisplay(finder) {
    let display = $(`#${finder}`);
    display.toggleClass("flip");
    display.siblings(".moreInfo").toggle(500);
}

function isNullOrWhiteSpace(input) {
    return input === null || input.trim().length > 0;
}

function outDisplay() {
    let load = $("#loading");
    let output = $(".output-box");
    if (!run) {
        $("#info-panel").toggle(200);

        setTimeout(function () {
            load.toggle();
        }, 500);

        setTimeout(function () {
            load.toggle();
        }, 2000);

        setTimeout(function () {
            output.toggle(500);
        }, 2300);

        run = true;
    }
    else {
        output.toggle(500);
        load.delay(500).toggle();
        setTimeout(function () {
            load.toggle(500);
        }, 2000);
        setTimeout(function () {
            output.toggle(500);
        }, 2500);
    }
}

function getCoordinates() {

    $.get("https://ipapi.co/latitude/",
        function (data) {
            lat = data;
        });

    $.get("https://ipapi.co/longitude/",
        function (data) {
            lon = data;
        });

}

function submit() {
    if ($(window).width() > 600) {
        $("#query").focus();
        $("#recipe-box").toggle();
    }

    getCoordinates();
    setTimeout(function () {
        coordinates = new google.maps.LatLng(lat, lon)
    }, 2000);

    $("form").submit(e => {
        e.preventDefault();
        if (!isNullOrWhiteSpace($("#query").val())) {
            alert("Please input some text!");
        }
        else {
            initialize();
        }
    });
}

$(submit)
