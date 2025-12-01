// 1. データと各アプリの機能を import する
import { tasks } from './data/tasks.js';
import { initGoogleMap, updateGoogleMap } from './apps/maps.js';
import { initMoovit, updateMoovit } from './apps/moovit.js';
import { initViabus, updateViabus } from './apps/viabus.js';
import { initGrab, updateGrab } from './apps/grab.js';
import { initBolt, updateBolt } from './apps/bolt.js';
import { sendLog } from './logger.js'; // ★インポート追加


document.addEventListener('DOMContentLoaded', () => {
    
    // --- 状態管理 ---
    let currentTaskIndex = 0;
    let currentAppId = 'home-screen';

    // --- 初期化処理 ---
    initGoogleMap();
    initGrab();
    initMoovit();
    initViabus();
    initBolt();
    
    // --- 共通関数: 全アプリの情報を現在のタスクで更新 ---
    function updateAllApps() {
        const currentTask = tasks[currentTaskIndex];
        
        // 各アプリの更新関数を呼ぶ
        updateGoogleMap(currentTask);
        updateGrab(currentTask);
        updateMoovit(currentTask);
        updateViabus(currentTask);
        updateBolt(currentTask);
        
        console.log(`All apps updated to Task ${currentTask.id}`);
    }

    // --- 画面遷移ロジック ---
    const views = document.querySelectorAll('.view');
    
    function showView(viewId) {
        // すべて隠す
        views.forEach(v => v.classList.remove('active'));
        
        // 指定されたものを表示
        const target = document.getElementById(viewId);
        if (target) {
            target.classList.add('active');
            currentAppId = viewId;
            
            // 地図の表示崩れを防ぐため、少し待って再描画トリガーなどを入れる場合がある
            // (各アプリの update関数内で invalidateSize() していればOK)
        }

        // ★画面遷移ログ
        // "home-screen" や "google-map" が開かれた記録
        sendLog('view_switch', { viewId: viewId, taskId: currentTaskIndex });

    }
    // タスク変更イベント
    document.addEventListener('taskChanged', (e) => {
        currentTaskIndex = e.detail.index;
        updateAllApps();
        console.log(`Main.js: Switched to Task ${currentTaskIndex}`);
    });

    // タスク/回答画面を開くイベント
    document.addEventListener('openTaskScreen', () => {
        showView('task-answer-screen');
    });

    // ホームに戻るイベント
    document.addEventListener('goHome', () => {
        showView('home-screen');
    });

    // --- イベントリスナー ---
    
    // アプリアイコンクリック
    document.querySelectorAll('.app-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const appId = icon.dataset.appId; // "google-map" とか
            if (appId) {
                // ★アプリ起動ログ
                sendLog('app_launch', { appId: appId, taskId: currentTaskIndex });
                
                updateAllApps();
                showView(appId);
            };
        });
    });

    // ホームボタン
    document.getElementById('home-btn').addEventListener('click', () => {
        showView('home-screen');
    });

    
    // 戻るボタンの挙動（簡易版）
    document.getElementById('back-btn').addEventListener('click', () => {
        // 今タスク画面ならホームへ、アプリならホームへ（単純化）
        showView('home-screen');
    });

    // ★重要: □ボタンで回答画面へ
    document.getElementById('task-btn').addEventListener('click', () => {
        showView('task-answer-screen');
    });


    // 初回実行
    updateAllApps();

});

