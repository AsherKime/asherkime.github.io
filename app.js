// Wrap everything in an object to keep the global scope clean
const MapEngine = {
    // Core properties
    map: null,
    activeMarkersLayer: null,
    gameData: [],

    // 1. Master Initialization
    init: function() {
        console.log("Initializing Map Engine...");
        try {
            this.initMap();
            this.loadData();
            this.bindEvents();
            this.renderMarkers();
            console.log("Map Engine loaded successfully.");
        } catch (error) {
            console.error("CRITICAL ERROR: Map failed to load.", error);
        }
    },

    // 2. Setup Leaflet Map & Tiles
    initMap: function() {
        const mapBoundary = L.latLngBounds(L.latLng(-144, 0), L.latLng(0, 176));

        this.map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: 2,
            maxZoom: 7,
            maxBounds: mapBoundary,
            maxBoundsViscosity: 1.0,
            wheelPxPerZoomLevel: 30
            attributionControl: false
        });

        this.map.setView([-72, 88], 3);

        const tileUrl = 'https://map-tiles.b-cdn.net/assets/rdr3/webp/detailed/{z}/{x}_{y}.webp';

        L.tileLayer(tileUrl, {
            noWrap: true,
            bounds: mapBoundary,
            minZoom: 2,
            maxZoom: 7,
            attribution: 'Tiles &copy; RDR2Map | Engine &copy; RDOMap'
        }).addTo(this.map);

        // Initialize the layer group for our markers
        this.activeMarkersLayer = L.layerGroup().addTo(this.map);
    },

    // 3. Load Data (Can be swapped with a fetch() later)
    loadData: function() {
        // Storing it in the object's state
        this.gameData = [
            { id: 1, text: "Valentine General Store", x: -51.1262, y: 106.2615, category: "general_store" },
            { id: 2, text: "Saint Denis General Store", x: -84.0779, y: 155.13, category: "general_store" },
            { id: 3, text: "Wild Carrots", x: -55.50, y: 110.20, category: "plant" }
        ];
    },

    // 4. Handle Rendering & Filtering
    renderMarkers: function() {
        // Clear the board
        this.activeMarkersLayer.clearLayers();

        // Get active filters safely
        const checkedBoxes = document.querySelectorAll('.filter-check:checked');
        if (!checkedBoxes.length) return; // Exit if nothing is checked

        const activeCategories = Array.from(checkedBoxes).map(cb => cb.value);

        // Draw markers
        this.gameData.forEach(item => {
            if (activeCategories.includes(item.category)) {
                L.marker([item.x, item.y])
                 .bindPopup(`<b>${item.text}</b><br><i>${item.category}</i>`)
                 .addTo(this.activeMarkersLayer);
            }
        });
    },

    // 5. Attach UI Listeners
    bindEvents: function() {
        const checkboxes = document.querySelectorAll('.filter-check');
        checkboxes.forEach(checkbox => {
            // We have to bind 'this' so renderMarkers knows what 'this' refers to
            checkbox.addEventListener('change', this.renderMarkers.bind(this));
        });
    }
};

// --------------------------------------------------------
// BOOTSTRAP THE APP
// --------------------------------------------------------
// Wait for the HTML to fully load before trying to attach the map
document.addEventListener('DOMContentLoaded', () => {
    MapEngine.init();
});
