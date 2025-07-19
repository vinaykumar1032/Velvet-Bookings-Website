mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates,
    zoom: 14
});

console.log(coordinates);

// Create popup (don't bind to marker directly)
const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: false,
    closeOnClick: false
}).setHTML(`
    <div class="popup-message">
        <h4>Your Hotel is Here!</h4>
    </div>
`);

// Add navigation control
const nav = new mapboxgl.NavigationControl({
    visualizePitch: true
});
map.addControl(nav, 'bottom-right');

// Create marker
const marker = new mapboxgl.Marker({ color: "#fe424d" })
    .setLngLat(coordinates)
    .addTo(map);

// Show popup on hover
marker.getElement().addEventListener("mouseenter", () => {
    popup.setLngLat(coordinates).addTo(map);
});

// Hide popup on mouse out
marker.getElement().addEventListener("mouseleave", () => {
    popup.remove();
});
