// js/apps/maps.js

// --- 1. 変数定義 ---
let mapInstance = null;
let routeLayers = [];
let currentTask = null;

// --- 2. 初期化関数 ---
export function initGoogleMap() {
    console.log('Google Map Initialized');

    const gSearchInput = document.querySelector('#gmap-search-bar input');
    const gSuggestions = document.querySelector('#gmap-suggestions');
    const gBottomSheet = document.querySelector('#gmap-bottom-sheet');

    // (A) 検索バークリック -> 候補リスト表示
    if (gSearchInput) {
        gSearchInput.addEventListener('click', () => {
            if (gSuggestions) gSuggestions.style.display = 'block';
        });
    }

    // (B) 候補クリック -> 検索実行
    if (gSuggestions) {
        gSuggestions.addEventListener('click', () => {
            if (currentTask) {
                // UI更新
                gSearchInput.value = currentTask.dest.name;
                gSuggestions.style.display = 'none';
                
                // 地図描画
                drawRoute(currentTask);
                
                // ボトムシートを表示
                if (gBottomSheet) gBottomSheet.classList.add('show');
            }
        });
    }
}

// --- 3. 更新関数 ---
export function updateGoogleMap(task) {
    console.log('Google Map Updating for:', task.id);
    currentTask = task;

    // --- UIリセット ---
    const gSearchInput = document.querySelector('#gmap-search-bar input');
    const gSuggestions = document.querySelector('#gmap-suggestions');
    const gBottomSheet = document.querySelector('#gmap-bottom-sheet');

    if (gSearchInput) gSearchInput.value = "";
    if (gSuggestions) gSuggestions.style.display = 'none';
    if (gBottomSheet) gBottomSheet.classList.remove('show');

    // --- 目的地名更新 ---
    const destElements = document.querySelectorAll('#google-map .task-destination');
    destElements.forEach(el => el.innerText = task.dest.name);

    // --- ルートリストの生成 ---
    // もしコンテナが無ければ作成
    if (gBottomSheet && !document.getElementById('gmap-route-list')) {
        const listDiv = document.createElement('div');
        listDiv.id = 'gmap-route-list';
        gBottomSheet.appendChild(listDiv);
    }
    
    const targetList = document.querySelector('#gmap-route-list');
    
    // データがあればリスト生成
    if (targetList && task.google && task.google.routes) {
        targetList.innerHTML = ''; // クリア

        task.google.routes.forEach(route => {
            const row = document.createElement('div');
            // スタイル設定
            row.style.cssText = "display:flex; justify-content:space-between; padding:15px 0; border-bottom:1px solid #eee; align-items:center;";

            // アイコン決定
            let icon = '🚆';
            if (route.type === 'car') icon = '🚗';
            
            // --- ★ここが修正ポイント★ ---
            // tag が無い場合(undefined)に備えて、空文字を入れておく
            const tagText = route.tag || ""; 
            
            const tagHtml = tagText ? `<span style="background:#e8f0fe; color:#1967d2; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px;">${tagText}</span>` : '';
            
            // 安全に includes をチェック
            const isWarning = tagText === 'Slow' || tagText.includes('Delay') || tagText === 'Delayed';
            const colorStyle = isWarning ? 'color:#d93025;' : 'color:#1a73e8;';
            // ---------------------------

            row.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <span style="font-size:24px; margin-right:15px;">${icon}</span>
                    <div>
                        <div style="font-weight:bold; font-size:16px;">${route.time} ${tagHtml}</div>
                        <div style="font-size:12px; color:#555;">${route.summary}</div>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:bold; ${colorStyle}">${route.cost}</div>
                    <div style="font-size:11px; color:#999;">${route.details}</div>
                </div>
            `;
            targetList.appendChild(row);
        });
    }

    // --- 地図初期化 ---
    if (!mapInstance) {
        mapInstance = L.map('map-google', { zoomControl: false }).setView([task.origin.lat, task.origin.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
    } else {
        clearRoute();
        mapInstance.setView([task.origin.lat, task.origin.lng], 13);
        // 表示崩れ防止
        setTimeout(() => mapInstance.invalidateSize(), 100);
    }
}

// --- ヘルパー関数 ---
function drawRoute(task) {
    if (!mapInstance) return;
    clearRoute();

    const originMarker = L.marker([task.origin.lat, task.origin.lng]).addTo(mapInstance);
    const destMarker = L.marker([task.dest.lat, task.dest.lng]).addTo(mapInstance);

    const routeLine = L.polyline([
        [task.origin.lat, task.origin.lng],
        [task.dest.lat, task.dest.lng]
    ], { color: '#4285F4', weight: 5, opacity: 0.8 }).addTo(mapInstance);

    routeLayers.push(originMarker, destMarker, routeLine);
    mapInstance.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
}

function clearRoute() {
    if (mapInstance && routeLayers.length > 0) {
        routeLayers.forEach(l => mapInstance.removeLayer(l));
        routeLayers = [];
    }
}