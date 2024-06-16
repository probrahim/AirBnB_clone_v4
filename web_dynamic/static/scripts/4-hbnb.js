$(document).ready(function() {
    var selectedAmenities = [];

    $('input[type="checkbox"]').change(function() {
        var amenityId = $(this).data('id');
        var amenityName = $(this).data('name');

        if ($(this).is(':checked')) {
            selectedAmenities.push({ id: amenityId, name: amenityName });
        } else {
            selectedAmenities = selectedAmenities.filter(function(amenity) {
                return amenity.id !== amenityId;
            });
        }

        updateAmenitiesDisplay();
    });

    function updateAmenitiesDisplay() {
        var amenitiesList = selectedAmenities.map(function(amenity) {
            return amenity.name;
        }).join(', ');

        $('.amenities h4').text(amenitiesList);
    }

    function fetchPlaces() {
        var amenitiesIds = selectedAmenities.map(function(amenity) {
            return amenity.id;
        });

        $.ajax({
            type: "POST",
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            contentType: "application/json",
            data: JSON.stringify({ amenities: amenitiesIds }),
            success: function(data) {
                renderPlaces(data);
            },
            error: function(error) {
                console.error('Error fetching places:', error);
            }
        });
    }

    function renderPlaces(places) {
        var placesSection = $('.places');
        placesSection.empty();

        places.forEach(function(place) {
            var article = $('<article>');

            var titleBox = $('<div>').addClass('title_box');
            titleBox.append($('<h2>').text(place.name));
            titleBox.append($('<div>').addClass('price_by_night').text('$' + place.price_by_night));

            var information = $('<div>').addClass('information');
            information.append($('<div>').addClass('max_guest').text(place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '')));
            information.append($('<div>').addClass('number_rooms').text(place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '')));
            information.append($('<div>').addClass('number_bathrooms').text(place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '')));

            var description = $('<div>').addClass('description').html(place.description);

            article.append(titleBox);
            article.append(information);
            article.append(description);

            placesSection.append(article);
        });
    }

    // Fetch places when the button is clicked
    $('button').click(function() {
        fetchPlaces();
    });

    // Initial fetch without amenities
    fetchPlaces();

    updateAmenitiesDisplay();
});

