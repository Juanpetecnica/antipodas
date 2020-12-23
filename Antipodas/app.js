
window.onload = iniciar;

let buscarBtn, localizacion;
function iniciar() {
    buscarBtn = document.getElementById("buscarBtn");
    localizacion = document.getElementById("localizacion");

    buscarBtn.addEventListener("click", obtenerLocalizacion);
}

function obtenerLocalizacion() {
    let location =localizacion.value;
    let url = "https://nominatim.openstreetmap.org/search?q="+ location +"&limit=5&format=json&addressdetails=1";
    fetch(url)
    .then(response => response.json())
    .then(
        data => { 
            console.log(data);
            let lat = data[0].lat;   //Latitud
            let long = data[0].lon;  //Longitud
            let antipodas = antipodesLatLng(lat, long);
            let antiLat = antipodas.lat;
            let antiLong = antipodas.lng;

            var mymap = L.map('mapid').setView([lat, long], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoianVhbnBldGVjbmljYSIsImEiOiJja2k3YjBlZ2YwYXQ0MnlwMnBzZDVueDRvIn0.45G2YYQPF6_pEo9N__wP4w'
            }).addTo(mymap);

            var mymap2 = L.map('mapid2').setView([antiLat, antiLong], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoianVhbnBldGVjbmljYSIsImEiOiJja2k3YjBlZ2YwYXQ0MnlwMnBzZDVueDRvIn0.45G2YYQPF6_pEo9N__wP4w'
            }).addTo(mymap2);
        });
}

// Funcion Antipodas
function antipodesLatLng(lat, long, tipoReturn) {
    if (tipoReturn === undefined) {
        tipoReturn = false;
    }
    var antiLat = 0;
    var antiLong = 0;
    if (lat >= 0) {
        antiLat = -Math.abs(lat)
    } else {
        antiLat = Math.abs(lat)
    }
    antiLong = 180 - Math.abs(long);
    if (long >= 0) {
        antiLong = -Math.abs(antiLong)
    } else {
        antiLong = Math.abs(antiLong)
    }
    if (tipoReturn === false) {
        return {
            lat: parseFloat(antiLat).toFixed(6),
            lng: parseFloat(antiLong).toFixed(6)
        }
    } else {
        if (tipoReturn === true) {
            return [parseFloat(antiLat).toFixed(6), parseFloat(antiLong).toFixed(6)]
        }
    }
}