// js/flow.js
import { tasks } from './data/tasks.js';
import { sendLog, getParticipantId } from './logger.js'; // ★インポート追加


// 状態管理
let currentStageIndex = 0; // 0:Landing, 1:Consent, 2:Briefing, 3:Tutorial
const overlayIds = ['page-landing', 'page-consent', 'page-briefing', 'page-tutorial'];

let currentTaskIndex = 0;
const totalTasks = tasks.length;

// ... (変数はそのまま) ...
// GoogleフォームのURL (★ID事前入力用URLに書き換えること推奨)
// 例: .../viewform?entry.123456=
const googleFormBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc3mRrkDWH9X6wmCZBTRi-Jn_ltC-CD07omWht40d7CV_29Ig/viewform?usp=pp_url&entry.1025575642=1";

window.Flow = {
    // ... (nextStep, checkConsent はそのまま) ...

    nextStep: () => {
        // 現在のページを隠す
        document.getElementById(overlayIds[currentStageIndex]).classList.remove('active');
        currentStageIndex++;
        
        // 次のページがあれば表示
        if (currentStageIndex < overlayIds.length) {
            document.getElementById(overlayIds[currentStageIndex]).classList.add('active');
        }
    },

    // 同意チェック
    checkConsent: () => {
        const checkbox = document.getElementById('consent-check');
        if (checkbox.checked) {
            window.Flow.nextStep();
        } else {
            alert("You must agree to participate.");
        }
    },

    startTaskPhase: () => {
        document.getElementById('experiment-overlays').style.display = 'none';
        
        // ★実験開始ログ
        sendLog('experiment_start');
        
        currentTaskIndex = 0;
        updateTaskDisplay();
        dispatchTaskChangeEvent(0);
        dispatchOpenTaskScreenEvent();
    },

    submitAnswer: () => {
        const selection = document.getElementById('answer-selection').value;
        if (!selection) {
            alert("Please select a route.");
            return;
        }

        // ★回答ログ送信 (ここが一番大事！)
        sendLog('task_answer', {
            taskId: currentTaskIndex,
            taskTitle: tasks[currentTaskIndex].title,
            choice: selection
        });

        currentTaskIndex++;

        if (currentTaskIndex < totalTasks) {
            alert("Answer saved. Proceeding to next task.");
            updateTaskDisplay();
            dispatchTaskChangeEvent(currentTaskIndex);
            dispatchGoHomeEvent();
            setTimeout(() => { dispatchOpenTaskScreenEvent(); }, 500);
        } else {
            // ★全タスク終了ログ
            sendLog('experiment_finish');

            if(confirm("All tasks completed. Proceed to questionnaire?")) {
                // ID付きでフォームに飛ばす
                // フォームの事前入力URLの末尾にIDを足す
                // (フォーム側でID入力欄の entry.ID を調べておく必要があります)
                // とりあえず今はIDをalertで出すか、URLパラメータとして渡す
                const finalUrl = `${googleFormBaseUrl}?entry.xxxxxxx=${getParticipantId()}`;
                window.location.href = finalUrl;
            }
        }
    }
};

// --- Helper: Update Task UI & Generate Options ---
function updateTaskDisplay() {
    const task = tasks[currentTaskIndex];
    document.getElementById('task-title-display').innerText = task.title;
    document.getElementById('task-desc-display').innerText = task.description;

    // Generate Dropdown Options
    const select = document.getElementById('answer-selection');
    select.innerHTML = '<option value="" disabled selected>Select an option...</option>'; // Reset

    // 1. Add Ride Hailing Options (Grab/Bolt)
    if (task.grab) {
        addOption(select, `Grab - ${task.grab.price}`);
        addOption(select, `GrabBike - ${task.grab.bike}`);
    }
    if (task.bolt) {
        addOption(select, `Bolt - ${task.bolt.standard}`);
        addOption(select, `Bolt Economy - ${task.bolt.eco}`);
    }

    // 2. Add Public Transport Options (from Google Routes)
    if (task.google && task.google.routes) {
        task.google.routes.forEach(route => {
            // "MRT + Bus (50 THB)" format
            const label = `${route.summary} (${route.cost})`;
            addOption(select, label);
        });
    }

    // 3. Add Other Options (from Moovit if different)
    // For simplicity, we can rely on Google routes as the main public transit choices,
    // or add unique ones from Moovit if needed.
    // Here we just ensure we don't have duplicates if strings are identical.
}

function addOption(selectElement, text) {
    // Prevent duplicates (simple check)
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].text === text) return;
    }
    
    const option = document.createElement('option');
    option.value = text;
    option.innerText = text;
    selectElement.appendChild(option);
}

// --- Event Dispatchers ---
function dispatchTaskChangeEvent(index) {
    const event = new CustomEvent('taskChanged', { detail: { index: index } });
    document.dispatchEvent(event);
}

function dispatchOpenTaskScreenEvent() {
    document.dispatchEvent(new Event('openTaskScreen'));
}

function dispatchGoHomeEvent() {
    document.dispatchEvent(new Event('goHome'));
}