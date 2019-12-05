var map;
var service;
var infowindow;

function initialize() {
    let search = $('#query').val();
    placesLoad(search);
    recipesLoad(search);
}

function placesLoad(search) {
    console.log("initializing");
    var pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });

    var request = {
        location: pyrmont,
        radius: '500',
        query: search
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
}

function callback(results, status) {
    $('#restaurants').empty();
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length, i < 10; i++) {
            var place = results[i];
            $('#restaurants').append(`<li>${place.name}<br>${place.formatted_address}<br></li>`)
            console.log(place);
        }
        console.log("done");
    }
}

function recipesLoad(search) {
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://api.edamam.com/search?q=" + search + "&app_id=24c87adf&app_key=69ca0b9b101ea652dd98fdcc6f0c3205&callback=?&from=0&to=10",
        "method": "GET",
        "SameSite": "none",
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function (results) {
            console.log(results.hits);
            recipePrinter(results);
        },
        error: function (e) {
            console.log(e.message);

        }
    });
}

function recipePrinter(results) {
    for (var i = 0; i < results.hits.length, i < 10; i++) {
        var recipe = results.hits[i].recipe;
        console.log(results.hits[i].recipe.label);
        $('#recipes').append(`<li>${recipe.label}<br><a href="${recipe.url}" target="_blank">Recipe Link!<a/></li>`)
    }
}

function submit() {
    $('form').submit(e => {
        e.preventDefault();
        initialize();
    });
}

$(submit)