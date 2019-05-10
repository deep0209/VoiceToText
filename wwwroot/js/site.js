// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(document).ready(function () {

    var map, infoWindow;
    var markers = [];
    var startpos = "";
    var currpos = "";
    var directionsService;
    var directionsDisplay;
    var form = {
        id: 0,
        latitude: "",
        longitude: "",
        radius: 1000,
        type: ""
    };
    var geocoder;
    

    // Showing directions on clicking the searched results
    $("#locations").on('click', '.loc', function () {
        $(document).find("#right-panel").show();
        calculateAndDisplayRoute(directionsService, directionsDisplay, $(this).parents("li").data('lat'), $(this).parents("li").data('lng'));
    })

    // Saving the searched results
    $(document).on('click', '.favLocation', function () {

        $(this).children(".nfav").toggle();
        $(this).children(".fav").toggle();

        var data = {
            Latitude: $(this).parent("li").attr("data-lat"),
            Longitude: $(this).parent("li").attr("data-lng"),
            PlaceName: $(this).parent("li").children("a").html()
        }
        $.ajax({
            type: 'POST',
            url: '/api/favlocations',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            dataType: 'json',
        }).done(function (responseJSON, status, xhr) {
            $(document).find('.alert-success').text("saved in favourites");
            $(document).find('.alert-success').show();
            $(document).find('.alert-danger').hide();
        }).fail(function (xhr, status, error) {
            $(document).find('.alert-danger').text("Cannot save in favourites");
            $(document).find('.alert-success').hide();
            $(document).find('.alert-danger').show();
        })
    })

    initMap();
    function initMap() {
        
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15
        });
        geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function () {
            geocodeAddress(geocoder, map);
        });

        document.getElementById('currloc').addEventListener('click', function () {
            initMap();
            $("#address").val("");
            geocodeAddress(geocoder, map);
        });
        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(map);
        var control = document.getElementById('floating-panel');
        //control.style.display = 'block';
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

        infoWindow = new google.maps.InfoWindow;
        google.maps.event.addListener(map, 'click', function () {
            if (infowindow) {
                infowindow.close();
            }
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.open(map);
                map.setCenter(pos);
                addMarker(pos);
                startpos = pos;
                if (currpos == "") {
                    currpos = pos;
                    console.log(pos);
                }


            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }
    // handle init ends
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
    // handle location error ends
    function geocodeAddress(geocoder, resultsMap) {
        $(document).find("#right-panel").hide();
        var address = document.getElementById('address').value;
        var param;
        if (address == "") {
            param = { 'location': startpos };
        }
        else {
            param = { 'address': address };
        }
        
        geocoder.geocode(param, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);

                addMarker(results[0].geometry.location);
                currpos.lat = results[0].geometry.location.lat();
                currpos.lng = results[0].geometry.location.lng();
                form.latitude = results[0].geometry.location.lat();
                form.longitude = results[0].geometry.location.lng();
                form.radius = parseInt(document.getElementById('radius').value)*1600;
                form.type = document.getElementById('type').value;
                

                if (!form.radius) {
                    form.radius = 1000;
                }
                
                $.ajax({
                    type: 'POST',
                    url: '/api/values/getnearby',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(form),
                    dataType: 'json',
                }).done(function (responseJSON, status, xhr) {
                    if (responseJSON.length != 0) {
                        showNearby(responseJSON);
                    }
                    else {
                        $("#locations").empty();
                        $("#locations").append('<ul>' + "No Places found" + '</ul>');
                    }


                    }).fail(function (xhr, status, error) {
                        $(document).find('.alert-danger').text("There was an error retrieving the nearby data");
                        $(document).find('.alert-success').hide();
                        $(document).find('.alert-danger').show();
                })
            } else {
                $(document).find('.alert-danger').text('Geocode was not successful for the following reason: ' + status);
                $(document).find('.alert-success').hide();
                $(document).find('.alert-danger').show();
            }
        });
    }

    //Show Nearby stuff
    function showNearby(jsondata) {
        var bounds = new google.maps.LatLngBounds();

        setMapOnAll(null);

        for (var i = 0; i < jsondata.length; i++) {
            var pos = {
                lat: parseFloat(jsondata[i].latitude),
                lng: parseFloat(jsondata[i].longitude)
            };
            addMarker(pos, jsondata[i].placeName);
            bounds.extend(pos);
        }
        map.fitBounds(bounds);
        fillList(jsondata);
        addMarker(currpos);
    }

    // fil list of near by locations
    function fillList(data) {
        $("#locations").empty();
        $.each(data, function (index, item) {
            $("#locations").append('<li class="list-group-item" data-lat="' + item.latitude + '" data-lng="' + item.longitude + '"><a href="#" class="loc">' + item.placeName + '</a><span class="favLocation"><img class="nfav" src="../images/stare.png"/><img class="fav" src="../images/starf.png"/></span></li>');
            $(".fav").hide();
        })
        
    }
    // Adds a marker to the map and push to the array.
    function addMarker(location, name) {
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            animation: google.maps.Animation.DROP,
            title: name
        });
        var infowindow = new google.maps.InfoWindow({
            content: name
        });

        markers.push(marker);
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(map);


        marker.addListener('click', function () {
            if (infowindow) {
                infowindow.close();
            }
            infowindow.open(map, marker);
            //calculateAndDisplayRoute(directionsService, directionsDisplay, location.lat, location.lng);
        });

    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    //function to draw the route from the current location to the clicked location on the map
    function calculateAndDisplayRoute(directionsService, directionsDisplay, x, y) {

        // Origin is user current location
        var latlngSource = { lat: parseFloat(currpos.lat), lng: parseFloat(currpos.lng) };

        //destination is clicked marker on the map
        var latlangDestination = { lat: parseFloat(x), lng: parseFloat(y) };

        directionsService.route({
            origin: latlngSource,
            destination: latlangDestination,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                $("#right-panel").empty();

                
                directionsDisplay.setMap(null);
                directionsDisplay.setPanel(null);
                directionsDisplay.setMap(map);
                directionsDisplay.setPanel(document.getElementById("right-panel"));
                directionsDisplay.setDirections(response);

            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    URL = window.URL;

    var gumStream; 						//stream from getUserMedia()
    var rec; 							//Recorder.js object
    var input; 							//MediaStreamAudioSourceNode we'll be recording

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext //audio context to help us record

    $("#StopRecord").hide();

    $(document).on('click', '#StartRecord', function () {
        console.log("recordButton clicked");

        var constraints = { audio: true, video: false }

        $("#StartRecord").hide();
        $("#StopRecord").show();

        /*
            We're using the standard promise based getUserMedia() 
            https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        */

        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

            var audioContext = new AudioContext();

            //update the format 
            audioContext.resume().then(() => {
                gumStream = stream;
                input = audioContext.createMediaStreamSource(stream);
                rec = new Recorder(input, { numChannels: 1 })

                //start the recording process
                rec.record()

                console.log("Recording started");
            });
        }).catch(function (err) {
            //enable the record button if getUserMedia() fails
            $("#StartRecord").show();
            $("#StopRecord").hide();
        });
    });

    $(document).on('click', '#StopRecord', function stopRecording() {
        console.log("stopButton clicked");

        //disable the stop button, enable the record too allow for new recordings
        $("#StartRecord").show();
        $("#StopRecord").hide();

        //tell the recorder to stop the recording
        rec.stop();

        //stop microphone access
        gumStream.getAudioTracks()[0].stop();

        //create the wav blob and pass it on to createDownloadLink
        rec.exportWAV(createDownloadLink);
    });

    function createDownloadLink(blob) {

        var url = URL.createObjectURL(blob);
        var au = document.createElement('audio');
        var li = document.createElement('li');
        var link = document.createElement('a');

        //name of .wav file to use during upload and download (without extendion)
        var date = new Date();
        var filename = "" + date.getMonth() + date.getDate() + date.getFullYear() + date.getHours() + date.getMinutes() + date.getSeconds();

        //add controls to the <audio> element
        au.controls = true;
        au.src = url;

        //save to disk link
        link.href = url;
        link.download = filename + ".wav"; //download forces the browser to donwload the file using the  filename
        link.click();
        $('#audioFilename').val(filename + ".wav")
        setTimeout(() => {
            $.ajax({
                type: 'POST',
                url: 'api/values/translate',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(filename+".wav"),
                dataType: 'json',
            }).done(function (responseJSON, status, xhr) {
                if (responseJSON.results[0] != undefined) {
                    var text = responseJSON.results[0].alternatives[0].transcript;
                    var newtext = text.split(' ');
                    console.log(newtext);
                    if (newtext[1] != undefined) {
                        $('#type').find('option[value="' + newtext[1].toLowerCase() + '"]').attr('selected', 'selected');
                    }
                    if (newtext[3] != undefined) {
                        $('#radius').val(newtext[3]);
                    }
                    var address = '';
                    for (i = 6; i < newtext.length; i++) {
                        address = address + newtext[i] + ' ';
                    }
                    $('#address').val(address);
                    geocodeAddress(geocoder, map);
                    var data = {
                        Filename: filename + '.wav',
                        ConvertedText: text
                    }
                         $.ajax({
                            type: 'POST',
                            url: 'api/SearchedSpeechHistorys',
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify(data),
                            dataType: 'json',
                         }).done(function (responseJSON, status, xhr) {

                             }).fail(function (xhr, status, error) {
                                 
                        })
                    $(document).find('.alert-success').text(text);
                    $(document).find('.alert-success').show();
                    $(document).find('.alert-danger').hide();
                } else {
                    $(document).find('.alert-danger').text('Cannot convert to text. Try again');
                    $(document).find('.alert-success').hide();
                    $(document).find('.alert-danger').show();
                }
            }).fail(function (xhr, status, error) {
                $(document).find('.alert-danger').text('Cannot convert to text. Try again');
                $(document).find('.alert-success').hide();
                $(document).find('.alert-danger').show();
            })
        }, 2000);
    }
});
