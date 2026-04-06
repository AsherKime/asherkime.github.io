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
// 3. ROCKSTAR TO LEAFLET COORDINATE CONVERSION
// --------------------------------------------------------
// Rockstar game coordinates don't map 1:1 with Leaflet. 
// This function applies RDOMap's exact math to normalize the grid.

function gameToMap(x, y) {
    const imageBounds = [48841, 38666];
    const topLeft = [-7168, 4096];
    const bottomRight = [5120, -5632];

    // Helper to calculate absolute distance
    const calcDist = (t, i) => t > i ? t - i : i - t;
    
    // Normalize bounds
    const eX = calcDist(topLeft[0], bottomRight[0]);
    const eY = calcDist(topLeft[1], bottomRight[1]);
    const sX = calcDist(topLeft[0], x);
    const sY = calcDist(topLeft[1], y);

    // Map to Leaflet's unprojected grid
    const mappedX = imageBounds[0] * (sX / eX);
    const mappedY = imageBounds[1] * (sY / eY);

    // Unproject at zoom level 8 (as required by RDOMap's logic)
    const result = map.unproject([mappedX, mappedY], 8);
    
    return [result.lat, result.lng];
}

// --------------------------------------------------------
// 4. TEST: PLOTTING A MARKER
// --------------------------------------------------------
// Example: Let's plot Valentine using exact Rockstar Engine Coordinates
const valentineGameX = -177.5;
const valentineGameY = 1475.2;

// Convert to Leaflet coordinates
const valentineCoords = gameToMap(valentineGameX, valentineGameY);

// Add the marker
L.marker(valentineCoords)
 .addTo(map)
 .bindPopup("<b>Valentine</b><br>X: -177.5, Y: 1475.2")
 .openPopup();
