var map;
var service;
var infowindow;

function initialize() {
    let search = $('#query').val();
    placesLoad(search);
    recipesLoad(search);
}

function placesLoad(search) {
    var location = new google.maps.LatLng($.get('https://ipapi.co/latitude/'), $.get('https://ipapi.co/longitude/'));

    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15
    });

    var request = {
        location: location,
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
            $('#restaurants').append(`<li>${place.name}<br>${place.formatted_address}<br></li><hr>`)
        }
    }
}

function recipesLoad(search) {
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://api.edamam.com/search?q=" + search + "&app_id=24c87adf&app_key=69ca0b9b101ea652dd98fdcc6f0c3205&callback=?",
        "method": "GET",
        "SameSite": "none",
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function (results) {
            recipePrinter(results);
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}

function recipePrinter(results) {
    $('#recipes').empty();
    for (var i = 0; i < results.hits.length, i < 10; i++) {
        var recipe = results.hits[i].recipe;
        $('#recipes').append(`<li>${recipe.label}<br><a href="${recipe.url}" target="_blank">Recipe Link!<a/></li><hr>`)
    }
}

function submit() {
    $('form').submit(e => {
        e.preventDefault();
        initialize();
        $('.output-box').css('display', 'inherit')
    });
}

$(submit)