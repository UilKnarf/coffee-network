let map;
let service;
let markers = [];

function initMap() {
  const defaultLocation = { lat: 40.7128, lng: -74.0060 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: defaultLocation,
  });
  
  service = new google.maps.places.PlacesService(map);
}

function searchCoffeeShops() {
  const query = document.getElementById("search-input").value;

  if (!query) {
    alert("Please enter a search term.");
    return;
  }

  const request = {
    query: query,  
    fields: ["name", "geometry", "formatted_address", "rating"],
  };

  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearMarkers();
      document.getElementById('coffee-list').innerHTML = '';

      results.forEach((place) => {
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h4>${place.name}</h4>
              <p>${place.formatted_address}</p>
              <p>Rating: ${place.rating || "No rating"}</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        markers.push(marker);

        const listItem = document.createElement("div");
        listItem.classList.add("coffee-item");
        listItem.innerHTML = `
          <h2>${place.name}</h2>
          <p><strong>Address:</strong> ${place.formatted_address}</p>
          <p><strong>Rating:</strong> ${place.rating || 'No rating'} stars</p>
          <a href="https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank">View on Google Maps</a>
        `;
        document.getElementById('coffee-list').appendChild(listItem);
      });

      const bounds = new google.maps.LatLngBounds();
      results.forEach((place) => {
        bounds.extend(place.geometry.location);
      });
      map.fitBounds(bounds);
    } else {
      alert("No places found.");
    }
  });
}

function clearMarkers() {

  markers.forEach((marker) => {
    marker.setMap(null);
  });
  markers = []; 
}