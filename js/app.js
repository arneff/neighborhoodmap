$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
});

//create variable for map
let map;
const responseContainer = document.querySelector('#thumb');

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

//call foursquare API for business information
fetch(`https://api.foursquare.com/v2/venues/search?ll=30.2,-97.7&query=stubbsbbq&client_id=I4QMXPAD13TPSNX3PKGKMOESVQ1QABUEG03KCUAESATUNDLS&client_secret=NU5J4LLXZSXCIXHBGU01TGFRQYAZDRTITANLZ0PIKLGYHQ02&v=20183031`)
.then(function(response) {
  if (response.status !== 200) {
    console.log('Looks like there was a problem. Status Code: ' + response.status);
    return;
  }
    return response.json();
}).then(addVenueInfo)
.catch(e => requestError(e, 'venue'));

function addVenueInfo(data) {
  console.log(data);
  let htmlContent = '';
  let firstVenue = data.response.venues[0];
  let fphone = firstVenue.contact.formattedPhone;
  let fstreet = firstVenue.location.formattedAddress[0];
  let fcity = firstVenue.location.formattedAddress[1];

  if (firstVenue) {
      htmlContent = "<p>Phone:</br>" + fphone + "</br></br>Address:</br>" + fstreet + "</br>" + fcity;
  } else {
      htmlContent = 'Unfortunately, no image was returned for your search.'
  }
  responseContainer.insertAdjacentHTML('beforeend', htmlContent);
}



//call foursquare api for photo
fetch(`https://api.foursquare.com/v2/venues/40fb0f00f964a520fc0a1fe3/photos?&client_id=I4QMXPAD13TPSNX3PKGKMOESVQ1QABUEG03KCUAESATUNDLS&client_secret=NU5J4LLXZSXCIXHBGU01TGFRQYAZDRTITANLZ0PIKLGYHQ02&v=20183031`)
.then(function(response) {
  if (response.status !== 200) {
    console.log('Looks like there was a problem. Status Code: ' + response.status);
    return;
  }
  return response.json();
}).then(addPhoto)
.catch(e => requestError(e, 'image'));

//get photo from api call and construct string and add img elemt to DOM
function addPhoto(data) {
  let htmlContent = '';
  const firstImage = data.response.photos.items[0];

  if (firstImage) {
      htmlContent = "<img src="+ firstImage.prefix + '150x150' + firstImage.suffix + ">";
  } else {
      htmlContent = 'Unfortunately, no image was returned for your search.'
  }
  responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
}

//display message if error occurs
function requestError(e, part) {
  console.log(e);
  responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
}
