$(function () {
    loadData();
    $(document).on('click', '.favplaces-remove', function () {
        var id = $(this).parents("li").attr('favplace-id');
        deleteFavPlaceById(id);
    });
})
    function loadData() {
        $.ajax({
            url: "/api/favlocations",
            dataType: 'json',
            contentType: 'application/json',
            method: 'GET'
        }).done(function (responseJSON, status, xhr) {
            // process the response when status code is 200-299
            buildFavPlacesList(responseJSON);
        }).fail(function (xhr, status, error) {
            // deal with error from server (status code 400-599)
            alert("There was an error retrieving the data");
        });
}

function buildFavPlacesList(favplaces) {
    $("#favouritePlaceslist").empty();
    $.each(favplaces, function (index, item) {
        var li = $('<li favplace-id="' + item.id + '"></li>');
        $(li).text('Name: ' + item.placeName + ' |   Latitude: ' + item.latitude + ' |   Longitude: ' + item.longitude);
        var buttondiv = $('<div class="pull-right"></div>');
        $(buttondiv).append('<a href="#" class="favplaces-remove">X</a>');
        $(li).append(buttondiv);
        $("#favouritePlaceslist").append(li);
    });
}

function deleteFavPlaceById(id) {
    $.ajax({
        url: 'api/favlocations/' + id,
        dataType: 'json',
        contentType: 'application/json',
        method: 'DELETE',
    }).done(function (responseData, status, xhr) {
        loadData();
        alert("deleted");
        }).fail(function (xhr, status, error) {
            alert("error");
        });
}