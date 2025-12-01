// js/apps/grab.js

let mapInstance = null;
let currentTask = null;
let routeLayers = [];

export function initGrab() {
    console.log('Grab Initialized');

    const homeScreen = document.getElementById('grab-home');
    const bookingScreen = document.getElementById('grab-booking');
    const whereToBtn = document.getElementById('grab-where-to'); // 検索入力欄風のボタン
    const backArrow = document.getElementById('grab-back-arrow'); // アプリ内の戻る

    // 「Where to?」を押した時
    if (whereToBtn) {
        whereToBtn.addEventListener('click', () => {
            if (currentTask) {
                // 画面切り替え
                if (homeScreen) homeScreen.style.display = 'none';
                if (bookingScreen) bookingScreen.style.display = 'flex'; // flexレイアウト想定

                // 地図描画
                drawGrabRoute(currentTask);
            }
        });
    }

    // アプリ内の戻るボタン
    if (backArrow) {
        backArrow.addEventListener('click', () => {
            if (bookingScreen) bookingScreen.style.display = 'none';
            if (homeScreen) homeScreen.style.display = 'block';
        });
    }
}

export function updateGrab(task) {
    console.log('Grab Updating');
    currentTask = task;

    // 1. 画面リセット（ホームに戻す）
    const homeScreen = document.getElementById('grab-home');
    const bookingScreen = document.getElementById('grab-booking');
    if (homeScreen) homeScreen.style.display = 'block';
    if (bookingScreen) bookingScreen.style.display = 'none';

    // 2. 料金テキスト更新
    const priceText = document.querySelector('.grab-price');
    const bikePriceText = document.querySelector('.grab-bike-price');
    
    if (priceText && task.grab) priceText.innerText = task.grab.price;
    if (bikePriceText && task.grab) bikePriceText.innerText = task.grab.bike;
    
    // 3. 目的地表示の更新
    const destTexts = document.querySelectorAll('#grab .task-destination');
    destTexts.forEach(el => el.innerText = task.dest.name);

    // 4. 地図初期化（まだなければ）
    if (!mapInstance) {
        mapInstance = L.map('map-grab', { zoomControl: false }).setView([task.origin.lat, task.origin.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
    }
}

function drawGrabRoute(task) {
    if (!mapInstance) return;
    
    // 表示崩れ防止
    setTimeout(() => mapInstance.invalidateSize(), 100);

    // 既存ルート削除
    if (routeLayers.length > 0) {
        routeLayers.forEach(l => mapInstance.removeLayer(l));
        routeLayers = [];
    }

    // 緑色のマーカーとルート
    const originMarker = L.marker([task.origin.lat, task.origin.lng]).addTo(mapInstance);
    const destMarker = L.marker([task.dest.lat, task.dest.lng]).addTo(mapInstance);

    const routeLine = L.polyline([
        [task.origin.lat, task.origin.lng],
        [task.dest.lat, task.dest.lng]
    ], { color: '#00B14F', weight: 6 }).addTo(mapInstance); // Grab Green

    routeLayers.push(originMarker, destMarker, routeLine);
    mapInstance.fitBounds(routeLine.getBounds(), { padding: [50, 100] }); // 下半分がパネルなのでパディング調整
}