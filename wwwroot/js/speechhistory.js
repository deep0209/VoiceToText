$(function () {
    loadData();
})
    function loadData() {
        $.ajax({
            url: "/api/SearchedSpeechHistorys",
            dataType: 'json',
            contentType: 'application/json',
            method: 'GET'
        }).done(function (responseJSON, status, xhr) {
            // process the response when status code is 200-299
            buildSpeechHistoryList(responseJSON);
        }).fail(function (xhr, status, error) {
            // deal with error from server (status code 400-599)
            alert("There was an error retrieving the data");
        });
}

function buildSpeechHistoryList(searchHistory) {
    $("#speechhistorylist").empty();
    $.each(searchHistory, function (index, item) {
        var li = $('<li speechhistorylist-id="' + item.id + '"></li>');
        $(li).text('Searched Text: ' + item.convertedText + ' |   Date: ' + item.recordedDate);
        $("#speechhistorylist").append(li);
    });
}