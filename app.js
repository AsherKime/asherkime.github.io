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

// --------------------------------------------------------
// 3. ROCKSTAR JSON TO LEAFLET COORDINATE CONVERSION
// --------------------------------------------------------
// Use this linear formula for data pulled from RDOMap's JSON files
function gameToMap(x, y) {
    // 0.015625 (1/64) perfectly aligns Rockstar's engine grid with Leaflet's tile grid
    const lat = (0.015625 * y) - 64;
    const lng = (0.015625 * x) + 112;
    
    return [lat, lng];
}

// --------------------------------------------------------
// 4. TEST: PLOTTING A MARKER
// --------------------------------------------------------
// Valentine's exact coordinates from Jean Ropke's JSON
const valentineX = -177.5;
const valentineY = 1475.2;

const valentineCoords = gameToMap(valentineX, valentineY);

// Plot the marker!
L.marker(valentineCoords)
 .addTo(map)
 .bindPopup(`<b>Valentine</b><br>Lat: ${valentineCoords[0].toFixed(2)}<br>Lng: ${valentineCoords[1].toFixed(2)}`)
 .openPopup();

// Let's add Saint Denis just to prove the scale is correct across the map
const saintDenisX = 2517.5;
const saintDenisY = -1257.6;

L.marker(gameToMap(saintDenisX, saintDenisY))
 .addTo(map)
 .bindPopup("<b>Saint Denis</b>");
