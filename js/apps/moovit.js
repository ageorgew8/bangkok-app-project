// js/apps/moovit.js

let mapInstance = null;
let currentTask = null;
let routeLayers = [];

export function initMoovit() {
    console.log('Moovit Initialized');
    
    // HTML側のIDに合わせて取得 (index.htmlの修正は不要なように配慮)
    const searchBtn = document.querySelector('#moovit .destination-text'); // タイトル部分をクリックで検索発動にするなど
    // もしくは検索ボタンがあればそれを取得
    const resultList = document.querySelector('#moovit-results'); 
    
    // 見出しクリックなどのトリガーで結果表示（簡易実装）
    const header = document.querySelector('#moovit .app-header');
    if (header) {
        header.addEventListener('click', () => {
            if (currentTask && resultList) {
                // 結果リストを表示
                resultList.style.display = 'block';
                // 地図にルートを描画
                drawRoute(currentTask);
            }
        });
    }
}

export function updateMoovit(task) {
    console.log('Moovit Updating for:', task.id);
    currentTask = task;

    // --- 画面リセット ---
    const resultList = document.querySelector('.route-list'); // index.htmlのクラス名に合わせる
    // Moovitはデフォルトで検索済みの体にするか、検索前画面を作るかによりますが
    // ここでは「既にルートが出ている」リストを書き換える方針にします
    
    // タイトル更新
    const destTitle = document.querySelector('#moovit .destination-text');
    if (destTitle) destTitle.innerText = task.dest.name;

    // --- リスト生成 ---
    if (resultList && task.moovit && task.moovit.routes) {
        resultList.innerHTML = ''; // クリア

        task.moovit.routes.forEach(route => {
            // カード要素作成
            const card = document.createElement('div');
            card.className = 'route-card'; // CSSでスタイル定義済み
            // 追加のスタイル
            card.style.cssText = "background:white; border-radius:8px; padding:15px; margin-bottom:10px; border-left:5px solid #F04E23; box-shadow:0 1px 3px rgba(0,0,0,0.1);";

            const tagHtml = route.tag ? `<span style="font-size:10px; background:#eee; padding:2px 5px; border-radius:3px; margin-left:5px;">${route.tag}</span>` : '';
            
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:5px;">
                    <span>Suggested ${tagHtml}</span>
                    <span style="font-size:18px; color:#F04E23;">${route.time}</span>
                </div>
                <div style="font-size:14px; margin-bottom:5px;">
                    ${route.summary}
                </div>
                <div style="font-size:12px; color:#777;">
                    ${route.details}
                </div>
            `;
            resultList.appendChild(card);
        });
    }

    // --- 地図 ---
    // Moovit画面の上部にもし地図があれば更新（無いレイアウトなら無視してOK）
    // 今回の構成だとMoovitはリストメインのようなので、地図処理はスキップまたは最小限に
}

function drawRoute(task) {
    // Moovit内に地図コンテナがあれば描画
    // なければ何もしない
}