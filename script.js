let map;
let service;
let infowindow;

function initialize() {
    let search = $('#query').val();
    placesLoad(search);
    recipesLoad(search);
}

function placesLoad(search) {
    let location = new google.maps.LatLng($.get('https://ipapi.co/latitude/'), $.get('https://ipapi.co/longitude/'));

    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15
    });

    let request = {
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
        for (let i = 0; i < results.length, i < 10; i++) {
            let place = results[i];
            $('#restaurants').append(`<li class="placeList">${place.name}<br>${place.formatted_address}<br></li><hr>`)
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
    for (let i = 0; i < results.hits.length, i < 10; i++) {
        let recipe = results.hits[i].recipe;
        let identify = 'option' + i;
        $('#recipes').append(`<li class="recipeList"><h3>${recipe.label}</h3><label><input type="radio" name="display">
        </input><img src="downward-arrow.png" alt="arrow" class="arrow"></label><ul class="moreInfo" id="${identify}">`);
        let ingredients = recipe.ingredientLines;
        for (let j = 0; j < ingredients.length; j++) {
            $(`#${identify}`).append(`<li>${ingredients[j]}</li>`);
        }
        $(`#${identify}`).append(`<li><a href="${recipe.url}">Link!</a></li>`);


        $('#recipes').append(`</ul><hr>`);
        // $('#recipes').append(`<br><iframe src="${recipe.url}" ">Recipe Link!</iframe><hr>`);

    }
}

function submit() {
    $('form').submit(e => {
        e.preventDefault();
        initialize();
        $('.output-box').css('visibility', 'visible');
        $('.output-box').animate({
            left: '0%'
        }, 500);
    });
}

$(submit)