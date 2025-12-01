// js/apps/viabus.js

let mapInstance = null;
let busMarker = null; // 動くバスのマーカー

export function initViabus() {
    console.log('ViaBus Initialized');
    // ViaBusは操作ボタンが少ないので、特にイベントリスナーがない場合もあります
}

export function updateViabus(task) {
    console.log('ViaBus Updating');

    // テキスト更新
    const arrivalText = document.querySelector('#viabus-wait');
    const busStopText = document.querySelector('#viabus-line');
    
    // task.viabus.wait (例: "4 min") を表示
    if (arrivalText && task.viabus) arrivalText.innerText = task.viabus.wait;
    if (busStopText) busStopText.innerText = task.origin.name; // 出発地をバス停名とする

    // 地図描画
    if (!mapInstance) {
        mapInstance = L.map('map-viabus', { zoomControl: false }).setView([task.origin.lat, task.origin.lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
    } else {
        mapInstance.setView([task.origin.lat, task.origin.lng], 15);
        setTimeout(() => mapInstance.invalidateSize(), 100);
    }

    // バスを表示 (出発地の少しズレた場所に配置して「来る」感を出す)
    if (busMarker) mapInstance.removeLayer(busMarker);
    
    // 緯度を少しずらす (0.002くらい)
    const busLat = task.origin.lat + 0.002;
    
    // カスタムアイコン（黄色い丸）
    const busIcon = L.divIcon({
        className: 'bus-marker-icon',
        html: '<div style="background:#F8E71C; width:20px; height:20px; border-radius:50%; border:2px solid black;"></div>',
        iconSize: [24, 24]
    });

    busMarker = L.marker([busLat, task.origin.lng], { icon: busIcon }).addTo(mapInstance)
        .bindPopup("Bus 15: Approaching");
        
    // 自分の位置（バス停）にもピンを立てる
    L.marker([task.origin.lat, task.origin.lng]).addTo(mapInstance);
}