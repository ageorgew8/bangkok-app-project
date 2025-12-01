// js/apps/bolt.js

let mapInstance = null;
let currentTask = null;
let routeLayers = [];

export function initBolt() {
    console.log('Bolt Initialized');

    const homeScreen = document.getElementById('bolt-home');
    const bookingScreen = document.getElementById('bolt-booking');
    const searchInput = document.getElementById('bolt-search-input'); // 入力欄
    const backBtn = document.getElementById('bolt-back-btn');

    // 検索入力欄をタップした時
    if (searchInput) {
        searchInput.addEventListener('click', () => {
            if (currentTask) {
                if (homeScreen) homeScreen.style.display = 'none';
                if (bookingScreen) bookingScreen.style.display = 'flex';
                drawBoltRoute(currentTask);
            }
        });
    }

    // 戻るボタン
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (bookingScreen) bookingScreen.style.display = 'none';
            if (homeScreen) homeScreen.style.display = 'block';
        });
    }
}

export function updateBolt(task) {
    console.log('Bolt Updating');
    currentTask = task;

    // リセット
    const homeScreen = document.getElementById('bolt-home');
    const bookingScreen = document.getElementById('bolt-booking');
    if (homeScreen) homeScreen.style.display = 'block';
    if (bookingScreen) bookingScreen.style.display = 'none';

    // 料金更新
    const ecoPrice = document.querySelector('.bolt-eco-price');
    const stdPrice = document.querySelector('.bolt-std-price');

    if (ecoPrice && task.bolt) ecoPrice.innerText = task.bolt.eco;
    if (stdPrice && task.bolt) stdPrice.innerText = task.bolt.standard;

    // 地図準備
    if (!mapInstance) {
        mapInstance = L.map('map-bolt', { zoomControl: false }).setView([task.origin.lat, task.origin.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
    }
}

function drawBoltRoute(task) {
    if (!mapInstance) return;
    setTimeout(() => mapInstance.invalidateSize(), 100);

    if (routeLayers.length > 0) {
        routeLayers.forEach(l => mapInstance.removeLayer(l));
        routeLayers = [];
    }

    const originMarker = L.marker([task.origin.lat, task.origin.lng]).addTo(mapInstance);
    const destMarker = L.marker([task.dest.lat, task.dest.lng]).addTo(mapInstance);

    const routeLine = L.polyline([
        [task.origin.lat, task.origin.lng],
        [task.dest.lat, task.dest.lng]
    ], { color: '#34D186', weight: 6 }).addTo(mapInstance); // Bolt Green

    routeLayers.push(originMarker, destMarker, routeLine);
    mapInstance.fitBounds(routeLine.getBounds(), { padding: [50, 100] });
}