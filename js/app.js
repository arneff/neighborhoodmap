$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
});

//create variable for map
let map;

//foursquare variables
const clientID = 'I4QMXPAD13TPSNX3PKGKMOESVQ1QABUEG03KCUAESATUNDLS';
const clientS = 'NU5J4LLXZSXCIXHBGU01TGFRQYAZDRTITANLZ0PIKLGYHQ02&v=20183031';
let venueID;
let vQuery;
const responseContainer = document.querySelector('#thumb');

//create array to hold all markers
let markers = [];

let locations = [
  {name: 'Iron Works BBQ', location: {lat: 30.2624539, lng: -97.7393236}},
  {name: 'Franklin Barbecue', location: {lat: 30.2701257, lng: -97.7314623}},
  {name: 'Rollin Smoke BBQ', location: {lat: 30.2629957, lng: -97.7275769}},
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

  //loop through locations array and create markers
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
      $('li').each(function(index) {
        if ($(this).hasClass('active')){
          $(this).removeClass('active');
        }
        if(marker.name === $(this).text()) {
          $(this).toggleClass('active');
        }
      })
      callVenue(this.name);
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

$('ul li').click(function() {
  callVenue($('.active').text());
});

//call foursquare API for business information
function callVenue(query) {
  fetch("https://api.foursquare.com/v2/venues/search?ll=30.2,-97.7&query="+query+"&client_id="+ clientID + "&client_secret=" + clientS + "&v=20183031")
.then(function(response) {
  if (response.status !== 200) {
    console.log('Looks like there was a problem. Status Code: ' + response.status);
    return;
  }
    return response.json();
}).then(addVenueInfo)
.then(callPhoto)
.catch(e => requestError(e, 'venue'));
}

//add venue data from api call to DOM
function addVenueInfo(data) {
  let firstVenue = data.response.venues[0];
  venueID = firstVenue.id;
  let fphone = firstVenue.contact.formattedPhone;
  let fstreet = firstVenue.location.formattedAddress[0];
  let fcity = firstVenue.location.formattedAddress[1];

  if (firstVenue) {
      vInfo.innerHTML = "Phone:</br>" + fphone + "</br></br>Address:</br>" + fstreet + "</br>" + fcity;
  } else {
      vInfo.innerHTML = 'Unfortunately, no venue information was returned for your search.'
  }
}


//call foursquare api for photo
function callPhoto() {
  fetch("https://api.foursquare.com/v2/venues/"+ venueID +"/photos?&client_id=" + clientID + "&client_secret=" + clientS)
.then(function(response) {
  if (response.status !== 200) {
    console.log('Looks like there was a problem. Status Code: ' + response.status);
    return;
  }
  return response.json();
}).then(addPhoto)
.catch(e => requestError(e, 'image'));

}

//get photo from api call and construct url string and add img elemt to DOM
function addPhoto(data) {
  const firstImage = data.response.photos.items[0];

  if (firstImage) {
      vPhoto.innerHTML = "<img src="+ firstImage.prefix + '150x150' + firstImage.suffix + ">";
  } else {
      vPhoto.innerHTML = 'Unfortunately, no image was returned for your search.';
  }

}

//display message if error occurs
function requestError(e, part) {
  console.log(e);
  responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
}
