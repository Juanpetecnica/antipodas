var searchString;
var map;
var mapAntipodes;
var NewYorkLon = -73.9514422416687;
var NewYorkLat = 40.69847032728747;
var NewYork;
var tempAntipodes;
var NewYorkAntipodes;
var NewYorkName = [{
    name: "New York City, New York, USA"
}];
var NewYorkAntipodesName = [{
    name: funny_msg[Math.floor(Math.random() * funny_msg.length)]
}];
var currentLocation;
var currentAntipodesLocation;
var locationZoom = 6;
var markers = [];
var geocoder;
var browserSupportFlag = new Boolean();
function initialize() {
    map = L.map("map-canvas");
    mapAntipodes = L.map("map-canvas-2");
    geocoder = L.Control.Geocoder.nominatim();
    var b = L.latLng(-89, -180);
    var a = L.latLng(89, 180);
    map.setMaxBounds(L.latLngBounds(b, a));
    mapAntipodes.setMaxBounds(L.latLngBounds(b, a));
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token=J0tbDPoF8i3IoZMFGkRBh9rqSSsCUc8wNZYZH4mQ", {
        maxZoom: 11,
        minZoom: 2,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        id: "mapbox-1"
    }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token=J0tbDPoF8i3IoZMFGkRBh9rqSSsCUc8wNZYZH4mQ", {
        maxZoom: 11,
        minZoom: 2,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        id: "mapbox-2"
    }).addTo(mapAntipodes);
    NewYork = L.latLng(NewYorkLat, NewYorkLon);
    tempAntipodes = antipodesLatLng(NewYorkLat, NewYorkLon);
    NewYorkAntipodes = L.latLng(tempAntipodes.lat, tempAntipodes.lng);
    map.setView([NewYorkLat, NewYorkLon], locationZoom);
    mapAntipodes.setView([tempAntipodes.lat, tempAntipodes.lng], locationZoom);
    init_markers(NewYork, NewYorkAntipodes, map, mapAntipodes, NewYorkName, NewYorkAntipodesName)
}
function initLocation() {
    var b;
    var a;
    if (navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(c) {
            b = L.latLng(c.coords.latitude, c.coords.longitude);
            var d = antipodesLatLng(b.lat, b.lng);
            a = L.latLng(d.lat, d.lng);
            init_markers(b, a, map, mapAntipodes)
        }, function() {
            error_alert("Geolocation service failed.");
            init_markers(NewYork, NewYorkAntipodes, map, mapAntipodes, NewYorkName, NewYorkAntipodesName)
        })
    } else {
        error_alert("Your browser doesn't support geolocation. We've placed you in New York.");
        init_markers(NewYork, NewYorkAntipodes, map, mapAntipodes, NewYorkName, NewYorkAntipodesName)
    }
}
function init_markers(g, j, a, f, d, h) {
    var b = false;
    var c = false;
    currentLocation = g;
    currentAntipodesLocation = j;
    for (var e = 0; e < markers.length; e++) {
        if (g.lat === markers[e].getLatLng().lat && g.lng === markers[e].getLatLng().lng && markers[e]["options"]["alt"] === "Normal") {
            b = true
        }
        if (j.lat === markers[e].getLatLng().lat && j.lng === markers[e].getLatLng().lng && markers[e]["options"]["alt"] === "Antipodes") {
            c = true
        }
    }
    if (b === false && c === false) {
        deleteMarkers();
        placeMarker(g, a, "normal");
        placeMarker(j, f, "antipodes");
        codeByLatLng(g, d, "normal");
        codeByLatLng(j, h, "antipodes")
    } else {
        a.setView(g, locationZoom);
        f.setView(j, locationZoom)
    }
}
function placeMarker(b, f, e) {
    var d = "";
    var g = "";
    if (e === "normal") {
        d = "/resources/design/icon-map.png";
        g = "Normal"
    } else {
        if (e === "antipodes") {
            d = "/resources/design/icon-antipodes.png";
            g = "Antipodes"
        }
    }
    var c = L.icon({
        iconUrl: d,
        iconAnchor: [50, 50]
    });
    var a = L.marker(b, {
        icon: c,
        alt: g
    }).addTo(f);
    markers.push(a);
    f.setView(b, locationZoom)
}
function deleteMarkers() {
    for (var a = 0; a < markers.length; a++) {
        map.removeLayer(markers[a]);
        mapAntipodes.removeLayer(markers[a])
    }
    markers = []
}
function locationPositionUpdate(a, f, h, e) {
    var b = funny_msg[Math.floor(Math.random() * funny_msg.length)];
    var g = convertDDtoDMS(h.lat, h.lng);
    var d = getDMSFormatted(g.latDegrees, g.latMinutes, g.latSeconds, g.latOrientation, g.lngDegrees, g.lngMinutes, g.lngSeconds, g.lngOrientation);
    if (e && e[0]) {
        b = e[0].name
    }
    $("#" + a).html(b);
    $("#" + f).html(h.lat.toFixed(6) + ", " + h.lng.toFixed(6));
    $("#" + f + "DMS").html("(" + d.lat + ", " + d.lng + ")");
    if (f === "positionMap") {
        $("#latlngDD").val(g.lat + ", " + g.lng).trigger("change")
    }
}
function codeByLatLng(b, f, d) {
    var c = "";
    var e = "";
    var a = "";
    if (d === "normal") {
        c = "addressMap";
        e = "positionMap";
        a = map
    } else {
        if (d === "antipodes") {
            c = "addressAntipode";
            e = "positionAntipode";
            a = mapAntipodes
        }
    }
    if (typeof f !== "undefined" && f) {
        locationPositionUpdate(c, e, b, f)
    } else {
        // grecaptcha.ready(function() {
        //     grecaptcha.execute("6LcDU30UAAAAAMTf4PWdlLa80yvpBvVi80KH5ycD", {
        //         action: "reverse"
        //     }).then(function(g) {
        //         $.ajax({
        //             type: "POST",
        //             dataType: "json",
        //             url: "recaptcha",
        //             data: {
        //                 address: b.toString(),
        //                 recaptcha: g,
        //                 action: "reverse"
        //             }
        //         }).done(function(h) {
        //             if (h.status === 1) {
        //                 geocoder.reverse(b, a.options.crs.scale(a.getZoom()), function(i) {
        //                     console.log("reverse");
        //                     locationPositionUpdate(c, e, b, i)
        //                 })
        //             } else {
        //                 if (h.status === 0) {
        //                     error_alert(h.message)
        //                 }
        //             }
        //         }).fail(function(h) {
        //             console.log("js-error")
        //         }).always(function(h) {
        //             $("#loading:visible").hide()
        //         })
        //     })
        // })
        geocoder.reverse(b, a.options.crs.scale(a.getZoom()), function(i) {
            console.log("reverse");
            locationPositionUpdate(c, e, b, i);
            $("#loading:visible").hide();
        });
    }
    $("#loading:visible").hide()
}
function codeByAddress() {
    $("#loading:hidden").show();
    var a = document.getElementById("searchInput").value;
    if (a) {
        if (a !== searchString) {
            searchString = a;
            if (a === "Chuck Norris") {
                error_alert("We won`t search for Chuck Norris because you don`t find Chuck Norris, he finds you.")
            } else {
                var d = regexDD(a);
                //if (d === false) {
                  //  d = regexDMS(a);
                 //   if (d === false) {
                    //     grecaptcha.ready(function() {
                    //         grecaptcha.execute("6LcDU30UAAAAAMTf4PWdlLa80yvpBvVi80KH5ycD", {
                    //             action: "geocode"
                    //         }).then(function(g) {
                    //             $.ajax({
                    //                 type: "POST",
                    //                 dataType: "json",
                    //                 url: "recaptcha",
                    //                 data: {
                    //                     address: a,
                    //                     recaptcha: g,
                    //                     action: "geocode"
                    //                 }
                    //             }).done(function(h) {
                    //                 if (h.status === 1) {
                    //                     geocoder.geocode(a, function(i) {
                    //                         console.log("geocode");
                    //                         if (i && i[0]) {
                    //                             var k = antipodesLatLng(i[0].center.lat, i[0].center.lng);
                    //                             var j = L.latLng(k.lat, k.lng);
                    //                             init_markers(i[0].center, j, map, mapAntipodes, i)
                    //                         } else {
                    //                             error_alert("We couldn't locate the place you typed in.")
                    //                         }
                    //                     })
                    //                 } else {
                    //                     if (h.status === 0) {
                    //                         error_alert(h.message)
                    //                     }
                    //                 }
                    //             }).fail(function(h) {
                    //                 console.log("js-error")
                    //             }).always(function(h) {
                    //                 $("#loading:visible").hide()
                    //             })
                    //         })
                    //     });
                    //     return
                    // } else {
                    //     var c = getFromDMS(d)
                    // }

                    geocoder.geocode(a, function(i) {
                        console.log("geocode");
                        if (i && i[0]) {
                            var k = antipodesLatLng(i[0].center.lat, i[0].center.lng);
                            var j = L.latLng(k.lat, k.lng);
                            init_markers(i[0].center, j, map, mapAntipodes, i)
                        } else {
                            error_alert("We couldn't locate the place you typed in.");
                        }
                    });

               // } else {
               //     c = getFromDD(d)
               // }

                var f = L.latLng(c.lat, c.lng);
                if (!isNaN(f.lat) && !isNaN(f.lng)) {
                    var e = antipodesLatLng(parseFloat(f.lat), f.lng);
                    var b = L.latLng(e.lat, e.lng);
                    if (!isNaN(b.lat) && !isNaN(b.lng)) {
                        init_markers(f, b, map, mapAntipodes)
                    } else {
                        error_alert("We couldn't locate the place you typed in.")
                    }
                } else {
                    error_alert("We couldn't locate the place you typed in.")
                }
            }
        } else {
            map.setView(currentLocation, locationZoom);
            mapAntipodes.setView(currentAntipodesLocation, locationZoom)
        }
    } else {
        error_alert("Please enter a country, city, address or zip code.")
    }
    $("#loading:visible").hide()
}
function updateSearchInput(a) {
    document.getElementById("searchInput").value = a;
    codeByAddress();
    goToTop();
}
;