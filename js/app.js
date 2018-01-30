$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
});

//create variable for map
let map;

//create array to hold all markers
let markers = [];

let locations = [
  {name: 'Iron Works BBQ', location: {lat: 30.2624539, lng: -97.7393236}},
  {name: 'Franklin Barbecue', location: {lat: 30.2701257, lng: -97.7314623}},
  {name: 'La Barbecue', location: {lat:30.256143, lng: -97.722482}},
  {name: "Stubb's Bar-B-Q", location: {lat: 30.2686802, lng: -97.7360462}},
  {name: 'Kerlin BBQ', location: {lat: 30.2581486, lng: -97.7261113}}
];

function initMap() {
  //create the map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.2622, lng: -97.7390},
    mapTypeControl: false,
    zoom: 14
  });

  //create new infowindow
  let largeInfowindow = new google.maps.InfoWindow();

  //loop through locations array and add relevant info to markers array
  for (let i = 0; i < locations.length; i++) {
    let position = locations[i].location;
    let name = locations[i].name;

    let marker = new google.maps.Marker ({
      map: map,
      position: position,
      name: name,
      animation: google.maps.Animation.DROP,
      id: i
    });
    //push marker to array or markers
    markers.push(marker);
    //open marker info InfoWindow
    marker.addListener('click', function() {
      toggleBounce(this);
      populateInfoWindow(this, largeInfowindow);
    });

  }

  function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.name + '</div>');
      infowindow.open(map, marker);
      //clear marker if window is closed

    }
  }

  function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    }
    else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 1470);
    }
  }

}//end initMap



//viewport
