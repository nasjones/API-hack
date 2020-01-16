let map;
let service;
let infowindow;
let run = false;

function initialize() {
    let search = $('#query').val();
    placesLoad(search);
    recipesLoad(search);
    outDisplay();
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
    let restaurants = $('#restaurants');
    restaurants.empty();
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length, i < 10; i++) {
            let place = results[i];
            restaurants.append(`<li class="placeList"><h3>${place.name}</h3><p class="address">${place.formatted_address}</p></li><hr>`);
        }
    }
    else {
        alert("Sorry there was a problem with your search try a different search or try again later!");
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
            alert
            console.log(e.message);
        }
    });

}

function recipePrinter(results) {
    let recipes = $('#recipes');
    recipes.empty();
    for (let i = 0; i < results.hits.length, i < 10; i++) {
        let option = results.hits[i].recipe;
        let identify = 'option' + i;
        recipes.append(`<li class="recipeList"><h3>${option.label}</h3>
        <img src="downward-arrow.png" alt="arrow" class="arrow" role="button" onClick="recipeDisplay(this.id)" id="recipe-${i}"><ul class="moreInfo" id="${identify}">`);
        let ingredients = option.ingredientLines;
        for (let j = 0; j < ingredients.length; j++) {
            $(`#${identify}`).append(`<li>${ingredients[j]}</li>`);
        }
        $(`#${identify}`).append(`<li><a href="${option.url}">Link!</a></li>`);

        recipes.append(`</ul><hr>`);
        // $('#recipes').append(`<br><iframe src="${recipe.url}" ">Recipe Link!</iframe><hr>`);

    }
}

function recipeDisplay(finder) {
    console.log("clicked");
    console.log(finder);
    let display = $(`#${finder}`);
    // document.querySelector("#recipes > li:nth-child(3) > img")
    // let display = $("#recipes > li:nth-child(1) > img");
    display.toggleClass('flip');

    display.siblings('.moreInfo').toggle(500);

}
// $(this)

function isNullOrWhiteSpace(input) {
    return input === null || input.trim().length > 0;
}

function outDisplay() {
    if (!run) {
        $('#loading').toggle()
        setTimeout(function () { $('#loading').toggle() }, 2000);
        setTimeout(function () { $('.output-box').toggle(500) }, 2300);
        run = true;
    }
    else {
        $('.output-box').toggle(500);
        $('#loading').toggle()
        setTimeout(function () { $('#loading').toggle() }, 2000);
        setTimeout(function () { $('.output-box').toggle(500) }, 2300);
    }
}

function submit() {
    if ($(window).width() > 600) {
        $('#recipe-box').toggle();
    }

    // document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?dinner')";

    $('form').submit(e => {
        e.preventDefault();
        if (!isNullOrWhiteSpace($('#query').val())) {
            alert("Please input some text!");
        }
        else {

            initialize();
            // $('#query').animate({
            //     top: '=10%'
            // }, 400);
            // // wait(function showBox() {
            // if (!run) {
            //     outDisplay();
            //     run = true;
            // }
            // else {
            //     outDisplay();
            //     outDisplay();
            // }
            // }, 3000);
            // $('.output-box').css('visibility', 'visible');
            // $('.output-box').animate({
            //     left: '0%'
            // }, 500);
        }
    });
}



$(submit)
