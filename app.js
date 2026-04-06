// 1. MAP CONFIGURATION & BOUNDS
const mapBoundary = L.latLngBounds(L.latLng(-144, 0), L.latLng(0, 176));

const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 2,
    maxZoom: 7,
    maxBounds: mapBoundary,
    maxBoundsViscosity: 1.0,
    
    // THE FIX: Faster Scroll Zooming. Default is 60. Lower = faster.
    wheelPxPerZoomLevel: 30, 
    // zoomDelta: 2 // Uncomment this if you want it to jump 2 zoom levels per click
});

map.setView([-72, 88], 3);

// 2. LOAD TILES
const tileUrl = 'https://map-tiles.b-cdn.net/assets/rdr3/webp/detailed/{z}/{x}_{y}.webp';

L.tileLayer(tileUrl, {
    noWrap: true,
    bounds: mapBoundary,
    minZoom: 2,
    maxZoom: 7,
    attribution: 'Tiles &copy; RDR2Map | Engine &copy; RDOMap'
}).addTo(map);


// 3. LAYER GROUPS & DATA
// We put markers in a LayerGroup so we can clear them instantly when filtering
let activeMarkersLayer = L.layerGroup().addTo(map);

// Combined Dummy Data based on Jean Ropke's coordinates
const gameData = [
    { id: 1, text: "Valentine General Store", x: -51.1262, y: 106.2615, category: "general_store" },
    { id: 2, text: "Saint Denis General Store", x: -84.0779, y: 155.13, category: "general_store" },
    { id: 3, text: "Wild Carrots", x: -55.50, y: 110.20, category: "plant" },
    { id: 4, text: "Indian Tobacco", x: -80.10, y: 120.50, category: "plant" },
    { id: 5, text: "Jack Hall Gang Map 1", x: -50.00, y: 90.00, category: "treasure" }
];


// 4. FILTERING LOGIC
function renderMarkers() {
    // Clear all existing markers off the map
    activeMarkersLayer.clearLayers();

    // Find out which checkboxes are currently checked
    const checkedBoxes = document.querySelectorAll('.filter-check:checked');
    const activeCategories = Array.from(checkedBoxes).map(cb => cb.value);

    // Filter the data and draw the markers
    gameData.forEach(item => {
        // If the item's category is in our list of active categories, draw it
        if (activeCategories.includes(item.category)) {
            const coords = [item.x, item.y]; // Using pre-processed JSON coords
            
            L.marker(coords)
             .bindPopup(`<b>${item.text}</b><br><i>${item.category}</i>`)
             .addTo(activeMarkersLayer);
        }
    });
}

// 5. EVENT LISTENERS
// Listen for clicks on any checkbox and re-render the map
document.querySelectorAll('.filter-check').forEach(checkbox => {
    checkbox.addEventListener('change', renderMarkers);
});

// Run once on load to draw the initial markers
renderMarkers();
