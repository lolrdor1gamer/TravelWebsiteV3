// Leaflet.js integration for the 'What to Do' section (OpenStreetMap, no API key required)
window.renderWhatToDoMap = function(city, lat, lng) {
    const mapContainer = document.getElementById('what-to-do-map');
    if (!mapContainer) return;
    mapContainer.innerHTML = '';

    // Load Leaflet JS and CSS if not already loaded
    if (typeof L === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => renderWhatToDoMap(city, lat, lng);
        document.head.appendChild(script);
        const link = document.createElement('link');
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return;
    }

    // Set default to Paris if not provided
    const centerLat = lat ? parseFloat(lat) : 48.8566;
    const centerLng = lng ? parseFloat(lng) : 2.3522;

    // Create map
    const map = L.map('what-to-do-map').setView([centerLat, centerLng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker for the city center
    L.marker([centerLat, centerLng]).addTo(map)
        .bindPopup(city ? `<b>${city}</b>` : 'Destination')
        .openPopup();

    // Optionally, fetch and display POIs/activities here
    // Example: fetch POIs from backend and add markers
    fetch(`/api/pois?lat=${centerLat}&lng=${centerLng}`)
        .then(response => response.json())
        .then(pois => {
            if (Array.isArray(pois)) {
                pois.forEach(poi => {
                    if (poi.latitude && poi.longitude) {
                        L.marker([poi.latitude, poi.longitude]).addTo(map)
                            .bindPopup(`<b>${poi.name}</b><br>${poi.category || ''}`);
                    }
                });
            }
        })
        .catch(() => {/* ignore errors for now */});
};
