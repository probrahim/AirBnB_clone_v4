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


	$.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
		if (data.status == 'OK'){
			$('#api_status').addClass('available');
		} else {
			$('#api_status').removeClass('available');
		}
	});
});
