function initMap() {
    const imagem =
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
    let musiciansMap = new google.maps.Map(document.getElementById("musiciansMap"), {
        center: new google.maps.LatLng(20, 0),
        zoom: 2,
        mapTypeId: 'roadmap'
    });
    var info = new google.maps.InfoWindow()

    google.maps.event.addListener(musiciansMap, 'click', function () {
        info.close();
    });

    // var bounds = new google.maps.LatLngBounds();

    fetch("http://localhost:3000/musicians").then(function (response) {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(function (musicians) {

                for (const musician of musicians) {
                    let marker = new google.maps.Marker({
                        position: new google.maps.LatLng(musician.locationLat, musician.locationLng),
                        map: musiciansMap,
                        title: musician.name,
                        animation: google.maps.Animation.DROP,
                        icon: imagem,
                    });
                    // bounds.extend(marker.position);

                    marker.addListener("click", function () {
                        var musicianInfo = `<strong>${musician.name}</strong><br>${musician.location}`;
                        info.setContent(musicianInfo);
                        info.open(musiciansMap, marker);
                    });
                }

            });
        } else {
            console.log("Oops, we haven't got JSON!");
        }
    });
    // musiciansMap.fitBounds(bounds);

}