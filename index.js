const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	// Leaflet Map
	createMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 15,
		});
		// Tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '12.5',
		}).addTo(this.map)
		// Location Marker
		const marker = L.marker(this.coordinates)
		marker.addTo(this.map).bindPopup('<p1><b>You are here!</b><br></p1>').openPopup()},

	// Business Markers
	bizMarkers() {
		for (let i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		]).bindPopup(`<p1>${this.businesses[i].name}</p1>`).addTo(this.map)
		}
	},
};


async function getCoords(){
	const point = await new Promise((resolve) => {
		navigator.geolocation.getCurrentPosition(resolve)
	});
	return [point.coords.latitude, point.coords.longitude]
};

window.onload = async () => {
	const coords = await getCoords();
	myMap.coordinates = coords;
	myMap.createMap();
};


async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3bsXrFeZJFBRwLtfDvAYCZdYnAKHcgVDGX3gV49pNYoY='
		}
	}
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let limit = 5
	let response = await fetch(`https://api.foursquare.com/v3/places/search?query=${business}&ll=${lat}%2C${lon}&limit=${limit}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
};

function renderBusinesses(data) {
	let businesses = data.map((node) => {
		let location = {
			name: node.name,
			lat: node.geocodes.main.latitude,
			long: node.geocodes.main.longitude
		};
		return location
	})
	return businesses
};

// Event Listener
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault();
	let business = document.getElementById('business').value;
	let data = await getFoursquare(business);
	myMap.businesses = renderBusinesses(data);
	myMap.bizMarkers();
});

// EVENT LISTENER FOR SEARCH BAR
// KEYDOWN/ KEYPRESS (KEY CODE? === ENTER)
//e.target.value goes into url

//window.onLoad = async() => {
//   const coords = await
// }

// if (lat !== null && long !== )