// js/logger.js

// ★ここにさっきコピーしたGASのURLを貼る
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxpRNU-WvlIFFJX9G1BylyhvTfguPSse_0CjT1t9hULg31AfqvKPVPW62DjhC8jgYQ3iQ/exec'; 

// 参加者IDの生成 (UUID v4)
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ページを開いたときにIDを確認・生成
let participantId = localStorage.getItem('participant_id');
if (!participantId) {
    participantId = generateUUID();
    localStorage.setItem('participant_id', participantId);
}
console.log("Current Participant ID:", participantId);

// ログ送信関数 (これを他から呼び出す)
export function sendLog(type, details = {}) {
    // コンソールで確認用
    console.log(`[LOG SENDING] ${type}`, details);

    // GASに送信 (非同期)
    // CORSエラー回避のため 'text/plain' で送り、mode: 'no-cors' は使わない(GAS側でJSON.parseするため)
    fetch(GAS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain' 
        },
        body: JSON.stringify({
            participantId: participantId,
            eventType: type,
            details: details
        })
    })
    .then(response => console.log("[LOG SENT] Success"))
    .catch(error => console.error("[LOG ERROR]", error));
}

// フォーム連携用にIDを取得する関数
export function getParticipantId() {
    return participantId;
}