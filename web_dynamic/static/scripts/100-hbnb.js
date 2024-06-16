$(document).ready(function() {
    var selectedAmenities = [];
    var selectedLocations = { states: [], cities: [] };

    $('input[type="checkbox"]').change(function() {
        var type = $(this).closest('li').closest('ul').closest('div').hasClass('locations') ? 'location' : 'amenity';
        var id = $(this).data('id');
        var name = $(this).data('name');

        if ($(this).is(':checked')) {
            if (type === 'amenity') {
                selectedAmenities.push({ id: id, name: name });
            } else {
                if ($(this).closest('ul').closest('li').children('h2').length) {
                    selectedLocations.states.push({ id: id, name: name });
                } else {
                    selectedLocations.cities.push({ id: id, name: name });
                }
            }
        } else {
            if (type === 'amenity') {
                selectedAmenities = selectedAmenities.filter(function(item) {
                    return item.id !== id;
                });
            } else {
                if ($(this).closest('ul').closest('li').children('h2').length) {
                    selectedLocations.states = selectedLocations.states.filter(function(item) {
                        return item.id !== id;
                    });
                } else {
                    selectedLocations.cities = selectedLocations.cities.filter(function(item) {
                        return item.id !== id;
                    });
                }
            }
        }

        updateDisplay(type);
    });

    function updateDisplay(type) {
        if (type === 'amenity') {
            var amenitiesList = selectedAmenities.map(function(amenity) {
                return amenity.name;
            }).join(', ');

            $('.amenities h4').text(amenitiesList);
        } else {
            var locationsList = selectedLocations.states.concat(selectedLocations.cities).map(function(location) {
                return location.name;
            }).join(', ');

            $('.locations h4').text(locationsList);
        }
    }

    function fetchPlaces() {
        var amenitiesIds = selectedAmenities.map(function(amenity) {
            return amenity.id;
        });

        var statesIds = selectedLocations.states.map(function(state) {
            return state.id;
        });

        var citiesIds = selectedLocations.cities.map(function(city) {
            return city.id;
        });

        $.ajax({
            type: "POST",
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            contentType: "application/json",
            data: JSON.stringify({
                amenities: amenitiesIds,
                states: statesIds,
                cities: citiesIds
            }),
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
            information.append(

