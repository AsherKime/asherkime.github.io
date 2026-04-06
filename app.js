// --------------------------------------------------------
// 1. MAP CONFIGURATION & BOUNDS
// --------------------------------------------------------
// The exact bounds used by RDOMap to frame the game world
const mapBoundary = L.latLngBounds(L.latLng(-144, 0), L.latLng(0, 176));

const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 2,
    maxZoom: 7,
    maxBounds: mapBoundary,
    maxBoundsViscosity: 1.0 // Adds a "bounce back" effect if the user drags too far
});

// Center the map initially
map.setView([-72, 88], 3);

// --------------------------------------------------------
// 2. LOAD RDOMAP TILES VIA CDN
// --------------------------------------------------------
// We are pointing directly to the webp tiles hosted on their CDN.
const tileUrl = 'https://map-tiles.b-cdn.net/assets/rdr3/webp/detailed/{z}/{x}_{y}.webp';

L.tileLayer(tileUrl, {
    noWrap: true,
    bounds: mapBoundary,
    minZoom: 2,
    maxZoom: 7,
    attribution: 'Tiles &copy; <a href="https://rdr2map.com/" target="_blank">RDR2Map</a> | Engine &copy; RDOMap'
}).addTo(map);

const storeData = {
    "color": "black",
    "key": "general_store",
    "locations": [
      {"text": "Armadillo", "x": -104.315, "y": 54.0631},
      {"text": "Blackwater", "x": -84.1215, "y": 99.1149},
      {"text": "Rhodes", "x": -83.6887, "y": 131.9255},
      {"text": "Saint Denis", "x": -84.0779, "y": 155.13},
      {"text": "Strawberry", "x": -69.6263, "y": 83.5089},
      {"text": "Tumbleweed", "x": -109.1998, "y": 26.1486},
      {"text": "Valentine", "x": -51.1262, "y": 106.2615},
      {"text": "Wallace Station", "x": -57.4932, "y": 91.0859}
    ]
};

// 4. PLOT THE MARKERS (No conversion needed!)
storeData.locations.forEach(store => {
    // Leaflet expects [Latitude, Longitude]. 
    // In this JSON, x = Lat, y = Lng.
    const coords = [store.x, store.y];

    L.marker(coords)
     .addTo(map)
     .bindPopup(`<b>${store.text}</b>`);
});
