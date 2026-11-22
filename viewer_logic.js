// =========================================================
// 健康管理くん - PC ビューワー＆臨床カルテ コントローラー (viewer_logic.js)
// 既往歴・人間ドックストック、Gemini AIスマートトリアージ、A4レポート
// =========================================================

const MASTER_KEY_RECORDS = 'health_kun_data_master_records';
const MASTER_KEY_SETTINGS = 'health_kun_data_master_settings';
const MASTER_KEY_MENUS = 'health_kun_data_master_menus';
const MASTER_KEY_MEDS = 'health_kun_data_master_meds';
const MASTER_KEY_PROFILE = 'health_kun_data_master_profile';
const MASTER_KEY_GEMINI_KEY = 'health_kun_gemini_api_key';
const MASTER_KEY_HISTORY = 'health_kun_data_master_history';

// 💊 表示名と 正式薬剤名・規格の2層マスタ初期値（フォールバック用）
const DEFAULT_MEDS = [
  { id: "med_1", name: "降圧剤", formalName: "ジルムロ配合錠「武田テバ」", status: "active", m: true, l: false, d: false, n: false, prevNames: ["降圧剤"] },
  { id: "med_2", name: "血液サラサラ", formalName: "キャブピリン配合錠", status: "active", m: true, l: false, d: false, n: false, prevNames: ["血液サラサラ", "配合錠", "抗血栓薬"] },
  { id: "med_3", name: "脂質薬", formalName: "アトルバスタチン錠OD10mg「トーワ」", status: "active", m: true, l: false, d: false, n: false, prevNames: ["脂質薬", "高脂血症治療剤", "脂質異常症薬"] },
  { id: "med_4", name: "心臓・降圧薬", formalName: "カルベジロール錠2.5mg「サワイ」", status: "active", m: true, l: false, d: true, n: false, prevNames: ["心臓・降圧薬"] },
  { id: "med_5", name: "フィッシュオイル", formalName: "スーパーフィッシュオイルEPA・DHA 1.1g", status: "active", m: true, l: false, d: true, n: false, prevNames: ["フィッシュオイル", "EPA・DHA (1000mg)"] },
  { id: "med_6", name: "ビタミンD", formalName: "Super D 1000IU 0.245g", status: "active", m: true, l: false, d: false, n: false, prevNames: ["ビタミンD"] },
  { id: "med_7", name: "マルチビタミン", formalName: "スーパーマルチビタミン＆ミネラル 1.515g", status: "active", m: true, l: false, d: false, n: false, prevNames: ["マルチビタミン", "マルチビタミン (1日分)"] },
  
  // 休薬アーカイブ
  { id: "med_old_1", name: "降圧剤", formalName: "アジルサルタンOD錠20mg「日新」", status: "inactive", m: false, l: false, d: false, n: false, prevNames: ["降圧剤", "アジルサルタン"] },
  { id: "med_old_2", name: "抗血栓薬", formalName: "バイアスピリン錠100mg", status: "inactive", m: false, l: false, d: false, n: false, prevNames: ["抗血栓薬", "バイアスピリン"] },
  { id: "med_old_3", name: "胃潰瘍治療剤", formalName: "タケキャブOD錠10mg", status: "inactive", m: false, l: false, d: false, n: false, prevNames: ["胃潰瘍治療剤", "胃薬", "タケキャブ"] }
];

let globalRecords = {};
let globalProfile = {};
let globalMeds = [];
let globalSettings = {};
let globalMenus = [];
let globalClinicalHistory = {};

let chartInstances = {};

// 💊 お薬データの完全自動救済ロジック（0件消失完全防止）
function normalizeMedsArray(medsArray) {
  if (!Array.isArray(medsArray) || medsArray.length === 0) {
    return JSON.parse(JSON.stringify(DEFAULT_MEDS));
  }

  medsArray.forEach((m, idx) => {
    if (!m.id) m.id = `med_${idx + 1}_${Date.now()}`;
    if (!m.prevNames) m.prevNames = [m.name];
    if (m.name && m.name.includes('(旧)')) {
      const cleanName = m.name.replace(/\(旧\)/g, '').trim();
      if (!m.prevNames.includes(m.name)) m.prevNames.push(m.name);
      m.name = cleanName;
    }

    if (m.status !== 'active' && m.status !== 'inactive') {
      const hasTiming = !!(m.m || m.l || m.d || m.n);
      m.status = hasTiming ? 'active' : 'inactive';
    }
  });

  return medsArray;
}

window.addEventListener('DOMContentLoaded', () => {
  loadDataFromLocalStorage();
  loadSavedGeminiApiKey();
  loadClinicalHistory();
  renderMasterMedsTable();
  renderDictTable();
  refreshAnalysis();
  generateDoctorReport();
});

// Gemini APIキー安全管理
function loadSavedGeminiApiKey() {
  const k = localStorage.getItem(MASTER_KEY_GEMINI_KEY);
  const el = document.getElementById('geminiApiKeyInput');
  const statusEl = document.getElementById('apiKeyStatusLabel');
  if (k) {
    if (el) el.value = k;
    if (statusEl) {
      statusEl.textContent = "● 有効 (Gemini AI連携中)";
      statusEl.style.color = "var(--accent-blue)";
    }
  } else {
    if (statusEl) {
      statusEl.textContent = "● 未設定 (ルールベース稼働中)";
      statusEl.style.color = "var(--accent-green)";
    }
  }
}

function saveGeminiApiKey() {
  const el = document.getElementById('geminiApiKeyInput');
  const statusEl = document.getElementById('apiKeyStatusLabel');
  if (el) {
    const key = el.value.trim();
    if (key) {
      localStorage.setItem(MASTER_KEY_GEMINI_KEY, key);
      if (statusEl) {
        statusEl.textContent = "● 有効 (Gemini AI連携中)";
        statusEl.style.color = "var(--accent-blue)";
      }
      alert("✅ Gemini APIキーを安全に保存しました！");
    } else {
      localStorage.removeItem(MASTER_KEY_GEMINI_KEY);
      if (statusEl) {
        statusEl.textContent = "● 未設定 (ルールベース稼働中)";
        statusEl.style.color = "var(--accent-green)";
      }
      alert("APIキーをクリアしました。ルールベース判定に切り替わります。");
    }
  }
}

// 🏥 既往歴・人間ドック 検査値ストック管理（新機能）
function loadClinicalHistory() {
  const raw = localStorage.getItem(MASTER_KEY_HISTORY);
  if (raw) {
    try { globalClinicalHistory = JSON.parse(raw); } catch (e) { globalClinicalHistory = {}; }
  } else if (globalProfile && globalProfile.clinicalHistory) {
    globalClinicalHistory = globalProfile.clinicalHistory;
  } else {
    globalClinicalHistory = {};
  }

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined && val !== null ? val : '';
  };

  setVal('hist_conditions', globalClinicalHistory.conditions);
  setVal('hist_notes', globalClinicalHistory.notes);
  setVal('lab_checkDate', globalClinicalHistory.checkDate);
  setVal('lab_ldl', globalClinicalHistory.ldl);
  setVal('lab_hdl', globalClinicalHistory.hdl);
  setVal('lab_tg', globalClinicalHistory.tg);
  setVal('lab_fpg', globalClinicalHistory.fpg);
  setVal('lab_hba1c', globalClinicalHistory.hba1c);
  setVal('lab_egfr', globalClinicalHistory.egfr);
  setVal('lab_cre', globalClinicalHistory.cre);
  setVal('lab_ua', globalClinicalHistory.ua);
  setVal('lab_ast', globalClinicalHistory.ast);
  setVal('lab_alt', globalClinicalHistory.alt);
  setVal('lab_ggtp', globalClinicalHistory.ggtp);
  setVal('lab_urine', globalClinicalHistory.urine);
  setVal('lab_doctorComment', globalClinicalHistory.doctorComment);
}

function autoSaveClinicalHistory() {
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  globalClinicalHistory = {
    conditions: getVal('hist_conditions'),
    notes: getVal('hist_notes'),
    checkDate: getVal('lab_checkDate'),
    ldl: getVal('lab_ldl') ? parseFloat(getVal('lab_ldl')) : null,
    hdl: getVal('lab_hdl') ? parseFloat(getVal('lab_hdl')) : null,
    tg: getVal('lab_tg') ? parseFloat(getVal('lab_tg')) : null,
    fpg: getVal('lab_fpg') ? parseFloat(getVal('lab_fpg')) : null,
    hba1c: getVal('lab_hba1c') ? parseFloat(getVal('lab_hba1c')) : null,
    egfr: getVal('lab_egfr') ? parseFloat(getVal('lab_egfr')) : null,
    cre: getVal('lab_cre') ? parseFloat(getVal('lab_cre')) : null,
    ua: getVal('lab_ua') ? parseFloat(getVal('lab_ua')) : null,
    ast: getVal('lab_ast') ? parseInt(getVal('lab_ast'), 10) : null,
    alt: getVal('lab_alt') ? parseInt(getVal('lab_alt'), 10) : null,
    ggtp: getVal('lab_ggtp') ? parseInt(getVal('lab_ggtp'), 10) : null,
    urine: getVal('lab_urine'),
    doctorComment: getVal('lab_doctorComment')
  };

  localStorage.setItem(MASTER_KEY_HISTORY, JSON.stringify(globalClinicalHistory));
  if (globalProfile) {
    globalProfile.clinicalHistory = globalClinicalHistory;
    localStorage.setItem(MASTER_KEY_PROFILE, JSON.stringify(globalProfile));
  }

  const hNotice = document.getElementById('historyAutoSaveNotice');
  const lNotice = document.getElementById('labAutoSaveNotice');
  if (hNotice) { hNotice.textContent = "✅ 自動保存完了"; hNotice.style.color = "var(--accent-green)"; }
  if (lNotice) { lNotice.textContent = "✅ 自動保存完了"; lNotice.style.color = "var(--accent-green)"; }

  generateDoctorReport();
}

function getClinicalHistorySummaryText() {
  const h = globalClinicalHistory || {};
  const parts = [];
  if (h.conditions) parts.push(`【主要既往歴・イベント】: ${h.conditions}`);
  if (h.notes) parts.push(`【特記事項・手術アレルギー】: ${h.notes}`);

  const labs = [];
  if (h.checkDate) labs.push(`受診日: ${h.checkDate}`);
  if (h.ldl !== null && h.ldl !== undefined && h.ldl !== '') labs.push(`LDL: ${h.ldl}mg/dL`);
  if (h.hdl !== null && h.hdl !== undefined && h.hdl !== '') labs.push(`HDL: ${h.hdl}mg/dL`);
  if (h.tg !== null && h.tg !== undefined && h.tg !== '') labs.push(`TG: ${h.tg}mg/dL`);
  if (h.fpg !== null && h.fpg !== undefined && h.fpg !== '') labs.push(`空腹時血糖: ${h.fpg}mg/dL`);
  if (h.hba1c !== null && h.hba1c !== undefined && h.hba1c !== '') labs.push(`HbA1c: ${h.hba1c}%`);
  if (h.egfr !== null && h.egfr !== undefined && h.egfr !== '') labs.push(`eGFR: ${h.egfr}`);
  if (h.cre !== null && h.cre !== undefined && h.cre !== '') labs.push(`Cre: ${h.cre}`);
  if (h.ua !== null && h.ua !== undefined && h.ua !== '') labs.push(`UA: ${h.ua}`);
  if (h.ggtp !== null && h.ggtp !== undefined && h.ggtp !== '') labs.push(`γ-GTP: ${h.ggtp}`);
  if (h.doctorComment) labs.push(`健診所見: ${h.doctorComment}`);

  if (labs.length > 0) parts.push(`【直近人間ドック/血液検査数値】: ${labs.join(', ')}`);
  return parts.length > 0 ? parts.join('\n') : '特記事項なし（未入力）';
}

function loadDataFromLocalStorage() {
  const recStr = localStorage.getItem(MASTER_KEY_RECORDS);
  const profStr = localStorage.getItem(MASTER_KEY_PROFILE);
  const medStr = localStorage.getItem(MASTER_KEY_MEDS);
  const setStr = localStorage.getItem(MASTER_KEY_SETTINGS);
  const menuStr = localStorage.getItem(MASTER_KEY_MENUS);

  if (recStr) {
    try { globalRecords = JSON.parse(recStr); } catch (e) { globalRecords = {}; }
  }
  if (profStr) {
    try { globalProfile = JSON.parse(profStr); } catch (e) { globalProfile = {}; }
  }
  if (medStr) {
    try { globalMeds = normalizeMedsArray(JSON.parse(medStr)); } catch (e) { globalMeds = JSON.parse(JSON.stringify(DEFAULT_MEDS)); }
  } else {
    globalMeds = JSON.parse(JSON.stringify(DEFAULT_MEDS));
    localStorage.setItem(MASTER_KEY_MEDS, JSON.stringify(globalMeds));
  }
  if (setStr) {
    try { globalSettings = JSON.parse(setStr); } catch (e) { globalSettings = {}; }
  }
  if (menuStr) {
    try { globalMenus = JSON.parse(menuStr); } catch (e) { globalMenus = []; }
  }

  const badge = document.getElementById('syncStatusBadge');
  const text = document.getElementById('syncStatusText');
  const recCount = Object.keys(globalRecords).length;

  if (recCount > 0) {
    text.textContent = `ローカル同期完了 (${recCount}日分の記録)`;
    badge.style.color = "var(--accent-green)";
  } else {
    text.textContent = `記録未検出 (JSON読込可能)`;
    badge.style.color = "var(--accent-amber)";
  }
}

// 💾 PC Viewerからの完全共通JSONエクスポート（既往歴・ドック情報も完全保存）
function exportViewerJSON() {
  readMasterMedsFromUI();
  autoSaveClinicalHistory();

  const todayStr = new Date().toISOString().slice(0, 10);
  const fullBackup = {
    version: "v1.5.3",
    exportedAt: new Date().toISOString(),
    profile: globalProfile,
    clinicalHistory: globalClinicalHistory,
    meds: globalMeds,
    settings: globalSettings,
    menus: globalMenus,
    records: globalRecords
  };

  const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `健康管理くん_丸ごとバックアップ_${todayStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// 📂 PC Viewerへの完全共通JSONインポート（新臨床データも完全復元）
function importViewerJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      const importedRecords = data.records || (typeof data === 'object' && !data.meds ? data : {});
      const recDates = Object.keys(importedRecords).sort();
      const recCount = recDates.length;
      const dateRangeStr = recCount > 0 ? `${recDates[0]} 〜 ${recDates[recCount - 1]}` : 'なし';

      let parsedMeds = [];
      if (data.meds && Array.isArray(data.meds) && data.meds.length > 0) {
        parsedMeds = normalizeMedsArray(data.meds);
      } else if (globalMeds && globalMeds.length > 0) {
        parsedMeds = normalizeMedsArray(globalMeds);
      } else {
        parsedMeds = JSON.parse(JSON.stringify(DEFAULT_MEDS));
      }

      const medsCount = parsedMeds.length;

      const confirmMsg = `【JSON復元の確認】\n\n` +
                         `選択されたファイルの内容：\n` +
                         `・日次記録：${recCount} 日分 (${dateRangeStr})\n` +
                         `・お薬マスタ：${medsCount} 件\n\n` +
                         `この内容を取り込み、PC Viewerおよび端末の保管庫を更新しますか？\n` +
                         `（※現在の記録はファイルの内容で更新されます）`;

      if (!confirm(confirmMsg)) return;

      if (data.records) globalRecords = data.records;
      if (data.profile) globalProfile = data.profile;
      globalMeds = parsedMeds;
      if (data.settings) globalSettings = data.settings;
      if (data.menus) globalMenus = data.menus;

      if (data.clinicalHistory) {
        globalClinicalHistory = data.clinicalHistory;
      } else if (data.profile && data.profile.clinicalHistory) {
        globalClinicalHistory = data.profile.clinicalHistory;
      }

      localStorage.setItem(MASTER_KEY_RECORDS, JSON.stringify(globalRecords));
      if (data.profile) localStorage.setItem(MASTER_KEY_PROFILE, JSON.stringify(globalProfile));
      localStorage.setItem(MASTER_KEY_MEDS, JSON.stringify(globalMeds));
      if (data.settings) localStorage.setItem(MASTER_KEY_SETTINGS, JSON.stringify(globalSettings));
      if (data.menus) localStorage.setItem(MASTER_KEY_MENUS, JSON.stringify(globalMenus));
      localStorage.setItem(MASTER_KEY_HISTORY, JSON.stringify(globalClinicalHistory));

      const badge = document.getElementById('syncStatusBadge');
      const text = document.getElementById('syncStatusText');
      text.textContent = `JSON読込完了 (${recCount}日分)`;
      badge.style.color = "var(--accent-blue)";

      loadClinicalHistory();
      renderMasterMedsTable();
      refreshAnalysis();
      generateDoctorReport();
      alert(`✅ ${recCount} 日分の記録とお薬（${medsCount}件）、臨床カルテを正常に読み込み・保管しました！`);
    } catch (err) {
      alert(`JSONファイルの解析に失敗しました。\nエラー詳細: ${err.message}`);
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function switchViewerTab(tabId) {
  document.querySelectorAll('.nav-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(c => {
    c.classList.toggle('active', c.id === tabId);
  });

  if (tabId === 'analysisTab') {
    setTimeout(refreshAnalysis, 50);
  } else if (tabId === 'reportTab') {
    setTimeout(generateDoctorReport, 50);
  }
}

// =========================================================
// TAB 1: お薬マスタ管理（自動保存・2段分離・並び替え）
// =========================================================
function renderMasterMedsTable() {
  const activeTbody = document.getElementById('medActiveTableBody');
  const inactiveTbody = document.getElementById('medInactiveTableBody');
  if (!activeTbody || !inactiveTbody) return;

  activeTbody.innerHTML = '';
  inactiveTbody.innerHTML = '';

  globalMeds = normalizeMedsArray(globalMeds);

  const activeMeds = globalMeds.filter(m => m.status === 'active');
  const inactiveMeds = globalMeds.filter(m => m.status === 'inactive');

  document.getElementById('activeMedsCount').textContent = activeMeds.length;
  document.getElementById('inactiveMedsCount').textContent = inactiveMeds.length;

  activeMeds.forEach((med, idx) => {
    const isFirst = (idx === 0);
    const isLast = (idx === activeMeds.length - 1);
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', med.id);
    tr.innerHTML = `
      <td class="center" style="white-space:nowrap;">
        <button class="btn-move" ${isFirst ? 'disabled' : ''} onclick="moveActiveMed(${idx}, -1)">▲</button>
        <button class="btn-move" ${isLast ? 'disabled' : ''} onclick="moveActiveMed(${idx}, 1)">▼</button>
      </td>
      <td><input type="text" class="form-input in-med-name" style="width:100%; font-size:0.75rem;" value="${escapeHtml(med.name)}" oninput="autoSaveMedChanges()"></td>
      <td><input type="text" class="form-input in-med-formal" style="width:100%; font-size:0.75rem;" value="${escapeHtml(med.formalName || med.name)}" oninput="autoSaveMedChanges()"></td>
      <td class="center"><input type="checkbox" class="in-med-m" ${med.m ? 'checked' : ''} onchange="autoSaveMedChanges()"></td>
      <td class="center"><input type="checkbox" class="in-med-l" ${med.l ? 'checked' : ''} onchange="autoSaveMedChanges()"></td>
      <td class="center"><input type="checkbox" class="in-med-d" ${med.d ? 'checked' : ''} onchange="autoSaveMedChanges()"></td>
      <td class="center"><input type="checkbox" class="in-med-n" ${med.n ? 'checked' : ''} onchange="autoSaveMedChanges()"></td>
      <td class="center">
        <button class="btn btn-outline" style="font-size:0.68rem; padding:2px 6px; color:var(--accent-amber); border-color:var(--accent-amber);" onclick="setMedStatus('${med.id}', 'inactive')">⏸️ 休薬</button>
      </td>
    `;
    activeTbody.appendChild(tr);
  });

  inactiveMeds.forEach(med => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', med.id);
    tr.innerHTML = `
      <td><input type="text" class="form-input in-med-name" style="width:100%; font-size:0.75rem;" value="${escapeHtml(med.name)}" oninput="autoSaveMedChanges()"></td>
      <td><input type="text" class="form-input in-med-formal" style="width:100%; font-size:0.75rem;" value="${escapeHtml(med.formalName || med.name)}" oninput="autoSaveMedChanges()"></td>
      <td class="center">
        <button class="btn btn-outline" style="font-size:0.68rem; padding:2px 6px; color:var(--accent-green); border-color:var(--accent-green);" onclick="setMedStatus('${med.id}', 'active')">🟢 再開</button>
      </td>
      <td class="center">
        <button style="background:transparent; border:none; color:var(--accent-rose); cursor:pointer; font-size:0.85rem;" onclick="deleteMedRow('${med.id}')">✕</button>
      </td>
    `;
    inactiveTbody.appendChild(tr);
  });
}

function readMasterMedsFromUI() {
  const activeRows = document.querySelectorAll('#medActiveTableBody tr');
  activeRows.forEach(tr => {
    const id = tr.getAttribute('data-id');
    const item = globalMeds.find(m => m.id === id);
    if (item) {
      const newName = tr.querySelector('.in-med-name').value.trim();
      const newFormal = tr.querySelector('.in-med-formal').value.trim();
      if (newName && item.name !== newName) {
        if (!item.prevNames) item.prevNames = [item.name];
        if (!item.prevNames.includes(newName)) item.prevNames.push(newName);
        item.name = newName;
      }
      item.formalName = newFormal || item.name;
      item.m = tr.querySelector('.in-med-m').checked;
      item.l = tr.querySelector('.in-med-l').checked;
      item.d = tr.querySelector('.in-med-d').checked;
      item.n = tr.querySelector('.in-med-n').checked;
      item.status = 'active';
    }
  });

  const inactiveRows = document.querySelectorAll('#medInactiveTableBody tr');
  inactiveRows.forEach(tr => {
    const id = tr.getAttribute('data-id');
    const item = globalMeds.find(m => m.id === id);
    if (item) {
      const newName = tr.querySelector('.in-med-name').value.trim();
      const newFormal = tr.querySelector('.in-med-formal').value.trim();
      if (newName && item.name !== newName) {
        if (!item.prevNames) item.prevNames = [item.name];
        if (!item.prevNames.includes(newName)) item.prevNames.push(newName);
        item.name = newName;
      }
      item.formalName = newFormal || item.name;
      item.status = 'inactive';
    }
  });
}

function autoSaveMedChanges() {
  readMasterMedsFromUI();
  localStorage.setItem(MASTER_KEY_MEDS, JSON.stringify(globalMeds));
  const notice = document.getElementById('medAutoSaveNotice');
  if (notice) {
    notice.textContent = "✅ 自動保存完了";
    notice.style.color = "var(--accent-green)";
  }
}

function moveActiveMed(activeIdx, dir) {
  readMasterMedsFromUI();
  const activeList = globalMeds.filter(m => m.status === 'active');
  const inactiveList = globalMeds.filter(m => m.status === 'inactive');

  const targetIdx = activeIdx + dir;
  if (targetIdx < 0 || targetIdx >= activeList.length) return;

  const temp = activeList[activeIdx];
  activeList[activeIdx] = activeList[targetIdx];
  activeList[targetIdx] = temp;

  globalMeds = [...activeList, ...inactiveList];
  localStorage.setItem(MASTER_KEY_MEDS, JSON.stringify(globalMeds));
  renderMasterMedsTable();
}

function setMedStatus(medId, newStatus) {
  readMasterMedsFromUI();
  const target = globalMeds.find(m => m.id === medId);
  if (!target) return;

  target.status = newStatus;
  if (newStatus === 'active') {
    target.m = true;
  } else {
    target.m = false; target.l = false; target.d = false; target.n = false;
  }

  localStorage.setItem(MASTER_KEY_MEDS, JSON.stringify(globalMeds));
  renderMasterMedsTable();
}

function deleteMedRow(medId) {
  const target = globalMeds.find(m => m.id === medId);
  const name = target ? target.name : 'このお薬';
  if (!confirm(`【確認】「${name}」を完全に削除しますか？\n（過去の記録との紐付けを維持したい場合は「休薬」にしておくことを推奨します）`)) return;

  globalMeds = globalMeds.filter(m => m.id !== medId);
  localStorage.setItem(MASTER_KEY_MEDS, JSON.stringify(globalMeds));
  renderMasterMedsTable();
}

function addMedRowMaster() {
  readMasterMedsFromUI();
  const newId = `med_${Date.now()}`;
  globalMeds.unshift({
    id: newId,
    name: "新処方薬",
    formalName: "",
    status: "active",
    m: true, l: false, d: false, n: false,
    prevNames: ["新処方薬"]
  });
  localStorage.setItem(MASTER_KEY_MEDS, JSON.stringify(globalMeds));
  renderMasterMedsTable();
}

function syncMedNamesWithHistory() {
  readMasterMedsFromUI();
  const allDates = Object.keys(globalRecords);
  let updatedCount = 0;

  if (!confirm("過去の日次記録データを走査し、旧名称（高脂血症治療剤等）を最新の表示名（脂質薬等）へ安全に紐付けます。\n※血圧や体重、食事記録は一切変更されません。実行しますか？")) return;

  allDates.forEach(d => {
    const rec = globalRecords[d];
    ['morning', 'lunch', 'dinner', 'night'].forEach(slot => {
      if (rec[slot] && Array.isArray(rec[slot].meds)) {
        rec[slot].meds = rec[slot].meds.map(savedName => {
          const match = globalMeds.find(m => m.name === savedName || (m.prevNames && m.prevNames.includes(savedName)));
          if (match && match.name !== savedName) {
            updatedCount++;
            return match.name;
          }
          return savedName;
        });
      }
    });
  });

  if (updatedCount > 0) {
    localStorage.setItem(MASTER_KEY_RECORDS, JSON.stringify(globalRecords));
    refreshAnalysis();
    generateDoctorReport();
    alert(`✅ 過去の記録データ内の服薬履歴（${updatedCount} 箇所）を最新のお薬名へ安全に同期・統合しました！`);
  } else {
    alert("過去の記録データはすべて最新のお薬マスタと完全に一致しています（ズレはありませんでした◎）。");
  }
}

// 食品辞書 レンダリング（food_dict.js の COMPREHENSIVE_FOOD_DICT を参照）
function renderDictTable() {
  const catFilter = document.getElementById('dictCatFilter').value;
  const search = document.getElementById('dictSearchInput').value.trim().toLowerCase();
  const tbody = document.getElementById('dictTableBody');
  tbody.innerHTML = '';

  const sourceDict = (typeof COMPREHENSIVE_FOOD_DICT !== 'undefined') ? COMPREHENSIVE_FOOD_DICT : [];

  const filtered = sourceDict.filter(item => {
    if (catFilter !== 'ALL' && item.cat !== catFilter) return false;
    if (search && !item.name.toLowerCase().includes(search) && !item.memo.toLowerCase().includes(search)) return false;
    return true;
  });

  document.getElementById('dictItemCount').textContent = `${filtered.length}品目 表示中`;

  filtered.forEach(it => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="cat-badge cat-${it.cat}">${it.cat}</span></td>
      <td style="font-weight:bold; color:#ffffff;">${escapeHtml(it.name)}</td>
      <td><span class="portion-tag">${escapeHtml(it.portion)}</span></td>
      <td style="color:var(--text-muted); font-size:0.72rem;">${escapeHtml(it.levels)}</td>
      <td style="text-align:right; font-weight:bold; color:var(--accent-amber);">${it.cal}</td>
      <td style="text-align:right; font-weight:bold; color:#ffffff;">${it.salt.toFixed(1)}g</td>
      <td style="text-align:right; font-weight:bold; color:#60a5fa;">${it.p.toFixed(1)}g</td>
      <td style="text-align:right; font-weight:bold; color:#fb7185;">${it.f.toFixed(1)}g</td>
      <td style="text-align:right; font-weight:bold; color:#fbbf24;">${it.c.toFixed(1)}g</td>
      <td>
        <div style="font-size:0.7rem; color:var(--text-muted); line-height:1.35;">${escapeHtml(it.memo)}</div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

function getFormalMedicationSummary() {
  if (!globalMeds || globalMeds.length === 0) return 'なし';
  const activeMeds = globalMeds.filter(m => m.status === 'active' || (m.status === undefined && (m.m || m.l || m.d || m.n)));
  if (activeMeds.length === 0) return 'なし (現在服用薬なし)';
  return activeMeds.map(m => {
    const timing = [];
    if (m.m) timing.push('朝');
    if (m.l) timing.push('昼');
    if (m.d) timing.push('晩');
    if (m.n) timing.push('就');
    const fName = m.formalName ? m.formalName : m.name;
    return `${fName} [${m.name}] (${timing.join('・')})`;
  }).join('、 ');
}

// =========================================================
// TAB 2: AI総合相談 ＆ スマートトリアージ判定室
// =========================================================
async function runAiConsultation() {
  const inputEl = document.getElementById('aiConsultationInput');
  const outputEl = document.getElementById('consultationOutputArea');
  const btn = document.getElementById('btnConsultAi');
  const query = (inputEl.value || '').trim();

  if (!query) {
    alert("相談内容や質問、食べた食事を入力してください。（例: お昼に定食屋で生姜焼きを食べたがどれを選べばいい？ / 冠動脈疾患の既往があるが、LDLと朝の血圧の目標は？）");
    return;
  }

  const apiKey = (localStorage.getItem(MASTER_KEY_GEMINI_KEY) || '').trim();

  btn.disabled = true;
  btn.textContent = "⏳ 解析中...";
  outputEl.innerHTML = "専任医療チームが質問内容を自動トリアージし、あなたのバイタル・既往歴・血液検査値・お薬・体調メモを踏まえて最適な専門家回答を生成中です...";

  const recentRecords = getFilteredRecords('14d');
  let avgSys = 0, avgDia = 0, countSys = 0, avgSalt = 0;
  const recentMemos = [];

  if (recentRecords.length > 0) {
    let sumS = 0, sumD = 0, sumSalt = 0;
    recentRecords.forEach(r => {
      const s = r.morning?.bpSys || r.night?.bpSys;
      const d = r.morning?.bpDia || r.night?.bpDia;
      if (s && d) { sumS += s; sumD += d; countSys++; }
      const pfc = calculatePFCForDay(r);
      sumSalt += pfc.salt;
      if (r.memo && r.memo.trim()) recentMemos.push(`・${r.date}: ${r.memo.trim()}`);
    });
    if (countSys > 0) {
      avgSys = Math.round(sumS / countSys);
      avgDia = Math.round(sumD / countSys);
    }
    avgSalt = Number((sumSalt / recentRecords.length).toFixed(1));
  }

  const memoContext = recentMemos.length > 0 ? recentMemos.slice(-5).join('\n') : '特記なし（体調安定）';
  const medsSummary = getFormalMedicationSummary();
  const clinicalHistSummary = getClinicalHistorySummaryText();

  const anonymizedProfile = `
【匿名患者臨床プロファイル】
年代/性別: ${globalProfile.age || '50代'} ${globalProfile.gender || '男性'} (身長: ${globalProfile.height || 172}cm)
重点ケア疾患: ${(globalProfile.cares || ['高血圧', '脂質異常症']).join(', ')}
患者の既往歴・人間ドック検査情報:
${clinicalHistSummary}
現在服用中のお薬・サプリ(正式規格): ${medsSummary}
直近14日間の平均血圧: ${avgSys ? `${avgSys}/${avgDia} mmHg` : '未測定'}
直近14日間の推定食塩: ${avgSalt ? `${avgSalt} g/日` : '未測定'}
直近の患者体調特記メモ:
${memoContext}
  `.trim();

  const sourceDict = (typeof COMPREHENSIVE_FOOD_DICT !== 'undefined') ? COMPREHENSIVE_FOOD_DICT : [];
  const menuListSummary = sourceDict.map(x => x.name).join('、');

  const prompt = `
あなたは循環器内科専門医「Dr.ケン」と臨床病態管理栄養士「アヤ」です。
ユーザーから健康相談または食事メニューの登録相談が寄せられました。
以下の【匿名患者臨床プロファイル】（特に既往歴や直近の検査数値）および【登録可能メニュー一覧】を熟読した上で、相談内容の性質に応じてスマートに回答者を振り分け（トリアージ）、専門的かつ親切に回答してください。

【厳格なプライバシー保護要件】
※個人を特定できる情報（氏名・住所等）は一切出力せず、医学的・栄養学的知見のみを出力してください。

【スマート・トリアージ（回答者自律選定ルール）】
ユーザーの相談内容を判定し、最適な専門家のみが回答すること。無理に両名で回答してはならない。
1. 🩺 【医療・血圧・病気・症状・お薬・副作用・検査値・既往歴・頭痛等の相談】:
   ➔ 🩺 【Dr.ケン (循環器内科) の臨床回答】のみを出力すること。
   - 患者の既往歴や血液検査数値（LDL等）、服用薬（${medsSummary}）、直近血圧、体調メモとの関連を具体的に解説。
2. 🥗 【食事・食品選び・メニュー逆引き・減塩・レシピ・PFC・間食・お酒等の相談】:
   ➔ 🥗 【管理栄養士 アヤ の栄養・メニュー処方】のみを出力すること。
   - 食べた食事の相談の場合、下記の【登録可能メニュー一覧】から正式名称を名指しして「少 / 普 / 多」で指定すること。
   - 例: 「豚生姜焼・炒め (普)」＋「ご飯・白米 (普)」＋「味噌汁 (普通・標準)」＋「明太子 (少)」
3. 🩺🥗 【健診結果の総合対策・生活習慣全般・総合相談】:
   ➔ 🩺 【Dr.ケン】と 🥗 【管理栄養士 アヤ】の両名がそれぞれの専門領域から役割分担して回答すること。

【文字途切れ防止の厳守】
※文章末尾の途切れを絶対に防ぐため、各項目は要点を簡潔・明快にまとめ、必ず文章の結び（句点）まで過不足なく完結させて出力してください。

【登録可能メニュー一覧】
${menuListSummary}

${anonymizedProfile}

【ユーザーからの相談・質問】:
${query}
  `.trim();

  if (apiKey) {
    try {
      const response = await callGeminiApiWithFallback(apiKey, prompt);
      outputEl.innerHTML = formatAiResponse(response);
    } catch (err) {
      console.warn("Consultation API error:", err);
      outputEl.innerHTML = generateRuleBasedConsultation(query) +
        `<div style="font-size:0.7rem; color:var(--accent-amber); margin-top:8px;">※Gemini APIエラーのためルールベース判定を表示しました (${err.message})</div>`;
    }
  } else {
    outputEl.innerHTML = generateRuleBasedConsultation(query);
  }

  btn.disabled = false;
  btn.textContent = "✨ AIに質問・相談する";
}

function generateRuleBasedConsultation(query) {
  const q = query.toLowerCase();
  const isMedOrBp = /血圧|薬|降圧|アスピリン|タケキャブ|ジルムロ|スタチン|カルベジロール|頭痛|めまい|熱|脈|心臓|胸|ステント|ldl|コレステロール|中性脂肪|検査/.test(q);
  const isFood = /食べ|飯|食|朝食|昼食|夕食|ラーメン|味噌汁|定食|生姜焼|肉|魚|寿司|カレー|間食|酒|ビール|カロリー|塩分|明太子|チーズ/.test(q);

  let suggestions = [];
  if (q.includes('生姜焼き') || q.includes('野菜炒め')) suggestions.push('「豚生姜焼・炒め」➔ [普]');
  if (q.includes('ハンバーグ')) suggestions.push('「ハンバーグ」➔ [普]');
  if (q.includes('ステーキ')) suggestions.push('「牛ステーキ」➔ [普]');
  if (q.includes('から揚げ') || q.includes('唐揚げ') || q.includes('チキン')) suggestions.push('「鶏唐揚げ・チキン」➔ [普]');
  if (q.includes('焼き鳥') || q.includes('串')) suggestions.push('「焼き鳥・串焼き」➔ [普]（ささみやレバーなら健康的）');
  if (q.includes('チーズ')) suggestions.push('「チーズ」➔ [普]（20g・スライス1枚目安）');
  if (q.includes('明太子') || q.includes('たらこ')) suggestions.push('「明太子」➔ [少]（塩分・プリン体が高いため一口〜半腹推奨）');
  if (q.includes('サラダチキン')) suggestions.push('「サラダチキン」➔ [普]');
  if (q.includes('卵') || q.includes('目玉焼き')) suggestions.push('「卵・たまご料理」➔ [普]');
  if (q.includes('ご飯') || q.includes('米') || q.includes('ライス')) suggestions.push('「ご飯・白米」➔ [普]');
  if (q.includes('ラーメン') || q.includes('麺')) suggestions.push('「ラーメン」➔ [普]（つゆは残しましょう）');
  if (q.includes('味噌汁') || q.includes('みそ汁')) {
    if (q.includes('奥さん') || q.includes('妻') || q.includes('外食') || q.includes('定食')) {
      suggestions.push('「味噌汁」➔ サブタイプで【普通 (標準)】を選択（塩分約1.2g）');
    } else {
      suggestions.push('「味噌汁」➔ サブタイプで【汁半分 (減塩)】を選択（塩分約0.6g）');
    }
  }

  let html = '';

  if (isMedOrBp && !isFood) {
    html += `<div class="conf-doc"><b style="color:var(--accent-blue); font-size:0.88rem;">🩺 Dr.ケン (循環器内科) の臨床回答:</b><br>`;
    html += `お薬や血圧、臨床検査に関するご相談ですね。冠動脈や血管保護の観点からは、家庭血圧の安定（125/75未満）とLDL目標値の達成が極めて重要です。<br>`;
    html += `処方薬の継続服用と、急激な血圧変動や脱水の防止を意識してください。気になる数値変化が続く際は主治医へご相談ください。<br><br>`;
    html += `<small style="color:var(--text-muted);">※マスタ管理室でAPIキーを登録すると、Gemini AIが現在の処方名（${getFormalMedicationSummary()}）および既往歴・ドック検査値を踏まえ、さらにパーソナライズされた助言を行います。</small></div>`;
  } else if (isFood && !isMedOrBp) {
    html += `<div class="conf-nut"><b style="color:var(--accent-green); font-size:0.88rem;">🥗 管理栄養士 アヤ のメニュー処方:</b><br>`;
    if (suggestions.length > 0) {
      html += `ご入力いただいた食事内容から、アプリ内の以下のメニューを選択するのが最も近いです！<br><br>`;
      suggestions.forEach(s => { html += `・<b>${s}</b><br>`; });
      html += `<br><small style="color:var(--text-muted);">※マスタ管理室でAPIキーを登録すると、Gemini AIがPFCバランスや相殺食材まで含めて完全回答します。</small></div>`;
    } else {
      html += `ご入力のメニュー候補を解析しました。辞書一覧から該当する主食・おかずをお選びいただき、ぴったりな品がない場合は「残り物惣菜」でポーション（少/普/多）を調整してご登録ください。</div>`;
    }
  } else {
    html += `<div class="conf-doc"><b style="color:var(--accent-blue); font-size:0.88rem;">🩺 Dr.ケン (循環器内科) の臨床助言:</b><br>`;
    html += `日々の血圧管理と食事習慣は表裏一体です。起床直後の血圧測定と服薬の継続が血管事故予防の基盤となります。</div>`;
    html += `<div class="conf-nut"><b style="color:var(--accent-green); font-size:0.88rem;">🥗 管理栄養士 アヤ の栄養アドバイス:</b><br>`;
    if (suggestions.length > 0) {
      suggestions.forEach(s => { html += `・<b>${s}</b><br>`; });
    } else {
      html += `減塩と野菜・カリウムの積極摂取を心がけましょう！辞書一覧からメニューをお選びください。`;
    }
    html += `</div>`;
  }

  return html;
}

// =========================================================
// TAB 3: 多角臨床ダッシュボード ロジック
// =========================================================
function getFilteredRecords(period) {
  const allDates = Object.keys(globalRecords).sort();
  if (allDates.length === 0) return [];

  let days = 14;
  if (period === '30d') days = 30;
  else if (period === '60d') days = 60;
  else if (period === '90d') days = 90;
  else if (period === 'ALL') days = allDates.length;

  const targetDates = allDates.slice(-days);
  return targetDates.map(d => ({ date: d, ...globalRecords[d] }));
}

function calculatePFCForDay(rec) {
  let totalCal = 0;
  let totalSalt = 0;
  let totalP = 0;
  let totalF = 0;
  let totalC = 0;

  const allItems = [
    ...(rec.morning?.items || []),
    ...(rec.lunch?.items || []),
    ...(rec.dinner?.items || []),
    ...(rec.snack?.items || []),
    ...(rec.latenight?.items || [])
  ];

  const sourceDict = (typeof COMPREHENSIVE_FOOD_DICT !== 'undefined') ? COMPREHENSIVE_FOOD_DICT : [];

  allItems.forEach(item => {
    let dict = sourceDict.find(x => x.name === item.name);
    
    if (item.subtype && typeof SUBTYPES_DEF !== 'undefined' && SUBTYPES_DEF[item.name]) {
      const sub = SUBTYPES_DEF[item.name].find(s => s.name === item.subtype);
      if (sub) {
        dict = Object.assign({}, dict || {}, { cal: sub.cal, salt: sub.salt });
      }
    }

    if (!dict) {
      dict = { cal: item.cal || 150, salt: item.salt || 0.8, p: 5.0, f: 5.0, c: 20.0 };
    }

    let mult = 1.0;
    const isEgg = item.name.includes('卵');
    const isYakitori = item.name.includes('焼き鳥');
    const isCheese = item.name.includes('チーズ');
    const isMentaiko = item.name.includes('明太子');
    const isSteak = item.name.includes('牛ステーキ');
    const isHamburg = item.name.includes('ハンバーグ');
    const isTonkatsu = item.name.includes('とんかつ');
    const isSushi = item.name.includes('寿司');

    if (isEgg || isCheese || isMentaiko) {
      mult = item.amount === '少ない' ? 0.5 : (item.amount === '多い' ? 2.0 : 1.0);
    } else if (isYakitori) {
      mult = item.amount === '少ない' ? 0.5 : (item.amount === '多い' ? 1.75 : 1.0);
    } else if (isSteak) {
      mult = item.amount === '少ない' ? 0.6 : (item.amount === '多い' ? 1.75 : 1.0);
    } else if (isHamburg) {
      mult = item.amount === '少ない' ? 0.6 : (item.amount === '多い' ? 1.5 : 1.0);
    } else if (isTonkatsu) {
      mult = item.amount === '少ない' ? 0.5 : (item.amount === '多い' ? 1.5 : 1.0);
    } else if (isSushi) {
      mult = item.amount === '少ない' ? 0.6 : (item.amount === '多い' ? 1.5 : 1.0);
    } else if (item.amount === '少ない') {
      mult = 0.6;
    } else if (item.amount === '多い') {
      mult = 1.6;
    }

    const effCal = (item.cal !== undefined ? item.cal : dict.cal) * mult;
    let effSalt = (item.salt !== undefined ? item.salt : dict.salt) * mult;

    if (item.name.includes('納豆')) {
      effSalt *= 0.5;
    }

    totalCal += effCal;
    totalSalt += effSalt;
    totalP += ((dict.p || 0) * mult);
    totalF += ((dict.f || 0) * mult);
    totalC += ((dict.c || 0) * mult);
  });

  return {
    cal: Math.round(totalCal),
    salt: Number(totalSalt.toFixed(1)),
    p: Number(totalP.toFixed(1)),
    f: Number(totalF.toFixed(1)),
    c: Number(totalC.toFixed(1))
  };
}

function refreshAnalysis() {
  const period = document.getElementById('analysisPeriodSelect').value;
  const list = getFilteredRecords(period);

  const rangeEl = document.getElementById('analysisDataRangeText');
  if (list.length === 0) {
    rangeEl.textContent = "対象データがありません（メインアプリで記録を入力してください）";
    return;
  }
  rangeEl.textContent = `集計期間: ${list[0].date} 〜 ${list[list.length - 1].date} (${list.length}日分)`;

  let sumSysM = 0, sumDiaM = 0, countM = 0;
  let sumSysN = 0, sumDiaN = 0, countN = 0;
  let sumPP = 0, countPP = 0;
  let sumSalt = 0, countSalt = 0;
  let sumP = 0, sumF = 0, sumC = 0;

  const dates = [];
  const mSysArr = [], mDiaArr = [];
  const nSysArr = [], nDiaArr = [];
  const weights = [];
  const steps = [];
  const sleepHours = [];
  const pList = [], fList = [], cList = [];

  list.forEach(rec => {
    dates.push(rec.date.slice(5));

    const mSys = rec.morning?.bpSys || null;
    const mDia = rec.morning?.bpDia || null;
    mSysArr.push(mSys);
    mDiaArr.push(mDia);
    if (mSys && mDia) {
      sumSysM += mSys; sumDiaM += mDia; countM++;
      const pp = mSys - mDia;
      sumPP += pp; countPP++;
    }

    const nSys = rec.night?.bpSys || null;
    const nDia = rec.night?.bpDia || null;
    nSysArr.push(nSys);
    nDiaArr.push(nDia);
    if (nSys && nDia) {
      sumSysN += nSys; sumDiaN += nDia; countN++;
    }

    // 朝の体重を最優先採用（上書き防止）
    const effectiveWeight = rec.morning?.weight || rec.weight || null;
    weights.push(effectiveWeight);
    steps.push(rec.steps || 0);
    sleepHours.push(rec.morning?.sleepHours ? parseFloat(rec.morning.sleepHours) : null);

    const pfc = calculatePFCForDay(rec);
    sumSalt += pfc.salt; countSalt++;
    sumP += pfc.p; sumF += pfc.f; sumC += pfc.c;
    pList.push(pfc.p); fList.push(pfc.f); cList.push(pfc.c);
  });

  const avgMSys = countM > 0 ? Math.round(sumSysM / countM) : '--';
  const avgMDia = countM > 0 ? Math.round(sumDiaM / countM) : '--';
  document.getElementById('stat_m_bp').innerHTML = `${avgMSys} / ${avgMDia} <span class="stat-unit">mmHg</span>`;
  document.getElementById('stat_m_bp_sub').textContent = avgMSys < 125 ? "至適域クリア◎ (目標達成)" : "やや高値 (減塩・保温を推奨)";

  const avgNSys = countN > 0 ? Math.round(sumSysN / countN) : '--';
  const avgNDia = countN > 0 ? Math.round(sumDiaN / countN) : '--';
  document.getElementById('stat_n_bp').innerHTML = `${avgNSys} / ${avgNDia} <span class="stat-unit">mmHg</span>`;
  document.getElementById('stat_n_bp_sub').textContent = countN === 0 ? "※夜血圧の入力を開始すると表示" : (avgNSys < 125 ? "夜間血圧良好◎" : "夜間高血圧に注意");

  const avgPP = countPP > 0 ? Math.round(sumPP / countPP) : '--';
  document.getElementById('stat_pp').innerHTML = `${avgPP} <span class="stat-unit">mmHg</span>`;
  document.getElementById('stat_pp_sub').textContent = avgPP < 65 ? "血管しなやかさ良好◎" : "動脈硬化警戒域 (有酸素運動推奨)";

  const avgSalt = countSalt > 0 ? (sumSalt / countSalt).toFixed(1) : '--';
  document.getElementById('stat_salt').innerHTML = `${avgSalt} <span class="stat-unit">g/日</span>`;
  document.getElementById('stat_salt_sub').textContent = avgSalt <= 6.0 ? "学会目標(6.0g)クリア◎" : "果物・野菜・豆乳でカリウム排泄を";

  renderViewerBpChart(dates, mSysArr, mDiaArr, nSysArr, nDiaArr);
  renderViewerPfcCharts(dates, sumP, sumF, sumC, pList, fList, cList);
  renderViewerWeightStepsChart(dates, weights, steps);
  renderViewerSleepBpChart(dates, sleepHours, mSysArr);
}

function renderViewerBpChart(labels, mSys, mDia, nSys, nDia) {
  const ctx = document.getElementById('viewerBpChart').getContext('2d');
  if (chartInstances.bp) chartInstances.bp.destroy();

  chartInstances.bp = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: '朝 最高血圧', data: mSys, borderColor: '#fb7185', borderWidth: 2.5, tension: 0.2, pointRadius: 3, pointBackgroundColor: '#fb7185' },
        { label: '朝 最低血圧', data: mDia, borderColor: 'rgba(251, 113, 133, 0.5)', borderWidth: 1.5, borderDash: [2, 2], pointRadius: 2 },
        { label: '夜 最高血圧', data: nSys, borderColor: '#c084fc', borderWidth: 2.5, tension: 0.2, pointRadius: 3, pointBackgroundColor: '#c084fc' },
        { label: '夜 最低血圧', data: nDia, borderColor: 'rgba(192, 132, 252, 0.5)', borderWidth: 1.5, borderDash: [2, 2], pointRadius: 2 },
        { label: '家庭至適基準(125)', data: Array(labels.length).fill(125), borderColor: '#34d399', borderWidth: 1.5, borderDash: [4, 4], pointRadius: 0 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#8b9bb4', font: { size: 10 } } } },
      scales: {
        x: { ticks: { color: '#64748b', maxTicksLimit: 10 }, grid: { color: '#1a243a' } },
        y: { min: 60, max: 170, ticks: { color: '#64748b' }, grid: { color: '#1a243a' } }
      }
    }
  });
}

function renderViewerPfcCharts(labels, totalP, totalF, totalC, pArr, fArr, cArr) {
  const pCal = totalP * 4;
  const fCal = totalF * 9;
  const cCal = totalC * 4;
  const sumCal = (pCal + fCal + cCal) || 1;

  const pRate = Math.round((pCal / sumCal) * 100);
  const fRate = Math.round((fCal / sumCal) * 100);
  const cRate = 100 - (pRate + fRate);

  const detailEl = document.getElementById('pfcTextDetail');
  detailEl.innerHTML = `
    <div style="margin-bottom:4px; font-weight:bold; color:#ffffff;">【期間平均 PFCエネルギー比率】</div>
    <div style="color:#60a5fa;">● タンパク質 (P): <b>${pRate}%</b> (平均 ${(totalP/labels.length).toFixed(1)}g /日) <small style="color:var(--text-muted);">理想13-20%</small></div>
    <div style="color:#fb7185;">● 脂質 (F): <b>${fRate}%</b> (平均 ${(totalF/labels.length).toFixed(1)}g /日) <small style="color:var(--text-muted);">理想20-30%</small></div>
    <div style="color:#fbbf24;">● 炭水化物 (C): <b>${cRate}%</b> (平均 ${(totalC/labels.length).toFixed(1)}g /日) <small style="color:var(--text-muted);">理想50-65%</small></div>
    <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">
      ${fRate > 30 ? '⚠️ 脂質比率がやや高めです。お肉の脂身を減らし、焼き魚や焼き鳥（ささみ・レバー）、チーズや卵、サラダチキン、豆腐に置換すると理想域に近づきます。' : '✅ 脂質・タンパク質バランスは適正域をキープできています！'}
    </div>
  `;

  const ctxPie = document.getElementById('viewerPfcPieChart').getContext('2d');
  if (chartInstances.pfcPie) chartInstances.pfcPie.destroy();

  chartInstances.pfcPie = new Chart(ctxPie, {
    type: 'doughnut',
    data: {
      labels: ['P (蛋白)', 'F (脂質)', 'C (糖質)'],
      datasets: [{
        data: [pCal, fCal, cCal],
        backgroundColor: ['#60a5fa', '#fb7185', '#fbbf24'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      cutout: '65%'
    }
  });

  const ctxStack = document.getElementById('viewerPfcStackChart').getContext('2d');
  if (chartInstances.pfcStack) chartInstances.pfcStack.destroy();

  chartInstances.pfcStack = new Chart(ctxStack, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'P(g)', data: pArr, backgroundColor: '#60a5fa' },
        { label: 'F(g)', data: fArr, backgroundColor: '#fb7185' },
        { label: 'C(g)', data: cArr, backgroundColor: '#fbbf24' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#8b9bb4', font: { size: 9 } } } },
      scales: {
        x: { stacked: true, ticks: { color: '#64748b', maxTicksLimit: 10 }, grid: { display: false } },
        y: { stacked: true, ticks: { color: '#64748b' }, grid: { color: '#1a243a' } }
      }
    }
  });
}

function renderViewerWeightStepsChart(labels, weights, steps) {
  const ctx = document.getElementById('viewerWeightStepsChart').getContext('2d');
  if (chartInstances.weight) chartInstances.weight.destroy();

  chartInstances.weight = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: '体重 (kg)', type: 'line', data: weights, borderColor: '#38bdf8', borderWidth: 2.5, tension: 0.3, pointRadius: 3, yAxisID: 'yW' },
        { label: '歩数 (歩)', type: 'bar', data: steps, backgroundColor: 'rgba(52, 211, 153, 0.25)', borderColor: '#34d399', borderWidth: 1, yAxisID: 'yS' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#8b9bb4', font: { size: 10 } } } },
      scales: {
        x: { ticks: { color: '#64748b', maxTicksLimit: 10 }, grid: { color: '#1a243a' } },
        yW: { type: 'linear', position: 'left', ticks: { color: '#38bdf8' }, grid: { color: '#1a243a' } },
        yS: { type: 'linear', position: 'right', ticks: { color: '#34d399' }, grid: { drawOnChartArea: false } }
      }
    }
  });
}

function renderViewerSleepBpChart(labels, sleepH, mSys) {
  const ctx = document.getElementById('viewerSleepBpChart').getContext('2d');
  if (chartInstances.sleep) chartInstances.sleep.destroy();

  chartInstances.sleep = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: '翌朝最高血圧 (mmHg)', data: mSys, borderColor: '#fb7185', borderWidth: 2, tension: 0.2, pointRadius: 3, yAxisID: 'yBp' },
        { label: '睡眠時間 (h)', type: 'bar', data: sleepH, backgroundColor: 'rgba(192, 132, 252, 0.3)', borderColor: '#c084fc', borderWidth: 1, yAxisID: 'ySlp' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#8b9bb4', font: { size: 10 } } } },
      scales: {
        x: { ticks: { color: '#64748b', maxTicksLimit: 10 }, grid: { color: '#1a243a' } },
        yBp: { type: 'linear', position: 'left', min: 90, max: 170, ticks: { color: '#fb7185' }, grid: { color: '#1a243a' } },
        ySlp: { type: 'linear', position: 'right', min: 0, max: 12, ticks: { color: '#c084fc' }, grid: { drawOnChartArea: false } }
      }
    }
  });
}

// TAB 3: AI カンファレンス実行（既往歴・血液検査値完全連動）
async function runAiConference() {
  const outputEl = document.getElementById('conferenceOutputArea');
  const btn = document.getElementById('btnRunAi');
  const apiKey = (localStorage.getItem(MASTER_KEY_GEMINI_KEY) || '').trim();

  btn.disabled = true;
  btn.textContent = "⏳ 臨床データ解析中...";
  outputEl.innerHTML = "循環器内科専門医および管理栄養士が最新のバイタル・既往歴・血液検査値・PFC栄養・睡眠相関・処方薬・特記メモをカンファレンス中です...";

  const period = document.getElementById('analysisPeriodSelect').value;
  const list = getFilteredRecords(period);

  if (list.length === 0) {
    outputEl.textContent = "分析対象の記録データがありません。";
    btn.disabled = false;
    btn.textContent = "✨ カンファレンスを実行・最新分析";
    return;
  }

  let sumSysM = 0, sumDiaM = 0, countM = 0;
  let sumSysN = 0, sumDiaN = 0, countN = 0;
  let sumSalt = 0, sumSteps = 0, sumSleep = 0;
  let sumP = 0, sumF = 0, sumC = 0;
  const memoList = [];

  list.forEach(r => {
    if (r.morning?.bpSys) { sumSysM += r.morning.bpSys; sumDiaM += r.morning.bpDia; countM++; }
    if (r.night?.bpSys) { sumSysN += r.night.bpSys; sumDiaN += r.night.bpDia; countN++; }
    if (r.steps) sumSteps += r.steps;
    if (r.morning?.sleepHours) sumSleep += parseFloat(r.morning.sleepHours);
    const pfc = calculatePFCForDay(r);
    sumSalt += pfc.salt; sumP += pfc.p; sumF += pfc.f; sumC += pfc.c;

    if (r.memo && r.memo.trim()) {
      memoList.push(`・${r.date}: ${r.memo.trim()}`);
    }
  });

  const avgSysM = countM > 0 ? Math.round(sumSysM / countM) : 0;
  const avgDiaM = countM > 0 ? Math.round(sumDiaM / countM) : 0;
  const avgSysN = countN > 0 ? Math.round(sumSysN / countN) : 0;
  const avgDiaN = countN > 0 ? Math.round(sumDiaN / countN) : 0;
  const avgSalt = Number((sumSalt / list.length).toFixed(1));
  const avgSteps = Math.round(sumSteps / list.length);
  const avgSleep = Number((sumSleep / list.length).toFixed(1));

  const pCal = sumP * 4, fCal = sumF * 9, cCal = sumC * 4;
  const totalCal = (pCal + fCal + cCal) || 1;
  const pRate = Math.round((pCal / totalCal) * 100);
  const fRate = Math.round((fCal / totalCal) * 100);
  const cRate = 100 - (pRate + fRate);

  const memoSectionText = memoList.length > 0 
    ? `\n【期間中の患者特記・体調＆食事メモ】\n${memoList.join('\n')}`
    : `\n【期間中の患者特記・体調＆食事メモ】\n特記なし（体調安定）`;

  const medsSummary = getFormalMedicationSummary();
  const clinicalHistSummary = getClinicalHistorySummaryText();

  const clinicalSummaryText = `
【匿名患者基本情報・臨床背景】
年齢/性別: ${globalProfile.age || '50代'} ${globalProfile.gender || '男性'}, 身長: ${globalProfile.height || 172}cm
重点疾患: ${(globalProfile.cares || ['高血圧', '脂質異常症']).join(', ')}
患者の既往歴・血液検査情報:
${clinicalHistSummary}
現在服用中のお薬・サプリ(正式規格): ${medsSummary}

【直近臨床バイタル統計 (${list.length}日間)】
・朝血圧平均: ${avgSysM}/${avgDiaM} mmHg (測定 ${countM}回)
・就寝前血圧平均: ${avgSysN}/${avgDiaN} mmHg (測定 ${countN}回)
・脈圧 (朝): ${avgSysM - avgDiaM} mmHg
・推定平均食塩摂取量: ${avgSalt} g/日 (日本高血圧学会基準: 6.0g未満)
・PFCエネルギー比率: タンパク質 ${pRate}% / 脂質 ${fRate}% / 炭水化物 ${cRate}%
・平均睡眠時間: ${avgSleep} 時間
・平均歩数: ${avgSteps} 歩/日
${memoSectionText}
  `.trim();

  if (apiKey) {
    try {
      const response = await callGeminiApiWithFallback(apiKey, clinicalSummaryText);
      outputEl.innerHTML = formatAiResponse(response);
    } catch (err) {
      console.warn("Gemini API error, falling back to rule-based:", err);
      outputEl.innerHTML = generateRuleBasedClinicalAdvice(avgSysM, avgDiaM, avgSysN, avgDiaN, avgSalt, pRate, fRate, cRate, avgSleep, avgSteps, memoList) +
        `<div style="font-size:0.7rem; color:var(--accent-amber); margin-top:8px;">※APIエラーのため高精度ルールベース診断に切り替えました (${err.message})</div>`;
    }
  } else {
    outputEl.innerHTML = generateRuleBasedClinicalAdvice(avgSysM, avgDiaM, avgSysN, avgDiaN, avgSalt, pRate, fRate, cRate, avgSleep, avgSteps, memoList);
  }

  btn.disabled = false;
  btn.textContent = "✨ カンファレンスを実行・最新分析";
}

// 厳格指定2モデル（gemini-3.5-flash-lite ➔ gemini-flash-lite-latest）によるAPIコール
async function callGeminiApiWithFallback(apiKey, summaryData) {
  const prompt = `
あなたは循環器内科専門医「Dr.ケン」と臨床病態管理栄養士「アヤ」です。
以下の患者バイタル、既往歴・血液検査情報、生活習慣データ、正式処方薬、および特記メモを分析し、専門医と栄養士の2つの視点から具体的で実用的な臨床カルテと栄養指導を日本語で記述してください。

【厳格なプライバシー保護要件】
※個人を特定できる情報（氏名・居住地等）は一切出力せず、臨床医学的・栄養学的知見のみを出力してください。

${summaryData}

【出力要件（途切れ防止・メモ反映の厳守）】
※文字数オーバーによる文章末尾の途切れを絶対に防ぐため、各項目は要点を簡潔・具体的にまとめ、必ず文章の結び（句点）まで過不足なく完結させて出力してください。
※患者の既往歴（ステント治療歴等）や検査数値（LDL等）、特記メモ（頭痛・発熱・食事等）がある場合は、その臨床的背景を的確に拾い上げて言及してください。

1. 🩺 【Dr.ケン (循環器内科) の臨床所見】:
   - 朝と就寝前の血圧差（モーニングサージ有無）
   - 脈圧による動脈硬化リスク
   - 既往歴・血液検査値（LDL目標値等）と処方薬との適合性、睡眠時間・体調メモとの臨床的関連
   - 専門医としての総合コメント
2. 🥗 【管理栄養士 アヤ の栄養・食事処方】:
   - PFCバランス（特に脂質比率とタンパク質充足度）の評価
   - 推定食塩摂取量（目標6.0g）に対する減塩・カリウム相殺アドバイス（果物・バナナや野菜ジュース等の活用）
   - 具体的な食材提案（卵料理、焼き鳥ささみ・レバー、チーズ、明太子の適量、味噌汁の汁残し等の活用）
   - 栄養士としてのアドバイスの結び
  `.trim();

  const models = ['gemini-3.5-flash-lite', 'gemini-flash-lite-latest'];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Model ${model} returned HTTP ${res.status}`);
      }

      const resData = await res.json();
      const text = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError || new Error("All Gemini models failed");
}

function formatAiResponse(rawText) {
  const formatted = rawText
    .replace(/###?\s*(.+)/g, '<b style="color:var(--accent-blue); font-size:0.9rem;">$1</b>')
    .replace(/\*\*(.+?)\*\*/g, '<b style="color:#ffffff;">$1</b>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  return `<div style="line-height:1.6;">${formatted}</div>`;
}

function generateRuleBasedClinicalAdvice(sysM, diaM, sysN, diaN, salt, pRate, fRate, cRate, sleep, steps, memoList = []) {
  const meDiff = (sysM && sysN) ? (sysM - sysN) : null;
  const pp = (sysM && diaM) ? (sysM - diaM) : null;

  const memoTextAll = memoList.join(' ');
  const hasFeverOrHeadache = /熱|頭痛|風邪|体調不良|だる|痛|悪寒/.test(memoTextAll);
  const hist = globalClinicalHistory || {};

  let docHtml = `<div class="conf-doc"><b style="color:var(--accent-blue); font-size:0.88rem;">🩺 Dr.ケン (循環器内科) の臨床所見:</b><br>`;
  
  if (hist.conditions) {
    docHtml += `<b>臨床背景（${escapeHtml(hist.conditions)}）を踏まえた評価:</b><br>`;
  }

  if (sysM < 125 && diaM < 75) {
    docHtml += `期間中の朝血圧平均は <b>${sysM}/${diaM} mmHg</b> と、日本高血圧学会の家庭血圧至適基準（125/75未満）を完全にクリアしています。冠動脈および脳心血管病の再発リスクは極めて低くコントロールされています。`;
  } else if (sysM <= 135) {
    docHtml += `朝血圧平均は <b>${sysM}/${diaM} mmHg</b>（正常高値域）。ステント留置後や心血管リスク保有時において、家庭血圧125未満の厳格な維持が血管内皮保護に直結します。起床時の冷え込み防止を継続しましょう。`;
  } else {
    docHtml += `朝血圧平均は <b>${sysM}/${diaM} mmHg</b> とやや高値です。夜間高血圧や起床時の交感神経緊張（モーニングサージ）への警戒が必要です。`;
  }

  if (hist.ldl) {
    docHtml += `<br>・<b>脂質評価 (直近LDL: ${hist.ldl}mg/dL):</b> ${hist.ldl < 70 ? '冠動脈二次予防目標（70未満）を達成しており極めて良好です◎' : (hist.ldl < 100 ? '一次予防目標内ですが、心血管イベント既往がある場合は70未満への更なる厳格管理が推奨されます。' : 'LDLがやや高めです。アトルバスタチン等の服薬遵守と脂質制限が肝要です。')}`;
  }

  if (hasFeverOrHeadache) {
    docHtml += `<br>⚠️ <b>体調メモの臨床所見:</b> 期間中のメモに頭痛・発熱等の体調不良の記録が確認されます。一時的な血圧上昇は生体防御や交感神経興奮に伴う反応の可能性が高いため、無理をせず十分な睡眠と休養を最優先してください。`;
  }

  if (meDiff !== null) {
    if (meDiff >= 20) {
      docHtml += `<br>⚠️ <b>モーニングサージ兆候:</b> 朝の血圧が夜より ${meDiff}mmHg 高く乖離しています。起床時の温かい水分補給と、急な立ち上がりを避ける動作を意識してください。`;
    } else {
      docHtml += `<br>✅ <b>朝夜差 (ME差):</b> 朝夜の血圧差は ${meDiff}mmHg と安定しており、夜間血圧の急上昇リスクは低く保たれています。`;
    }
  }

  if (pp !== null) {
    docHtml += `<br>・<b>脈圧:</b> ${pp} mmHg (基準65未満)。${pp < 65 ? '大動脈の進展性・弾性はしなやかに保たれています。' : 'やや脈圧が開いています。ウォーキングによる血管内皮刺激が有効です。'}</div>`;
  } else {
    docHtml += `</div>`;
  }

  let nutHtml = `<div class="conf-nut"><b style="color:var(--accent-green); font-size:0.88rem;">🥗 管理栄養士 アヤ の栄養・食事処方:</b><br>`;
  nutHtml += `推定平均塩分は <b>${salt} g/日</b> です（目標6.0g未満）。`;
  if (salt <= 6.5) {
    nutHtml += `「つゆ残し」や味噌汁の「汁半分」の習慣が定着しており、非常に素晴らしい食塩コントロールです！<br>`;
  } else {
    nutHtml += `目標をやや超過しています。外食や奥様が作られた味噌汁の際は「普通(1.2g)」と割り切りつつ、翌朝に「果物・バナナ」や「野菜ジュース」「豆乳」を足してカリウムでナトリウム排泄を促しましょう。<br>`;
  }

  nutHtml += `・<b>PFCバランス評価:</b> 蛋白 ${pRate}% / 脂質 ${fRate}% / 炭水化物 ${cRate}%。<br>`;
  if (fRate > 30) {
    nutHtml += `脂質比率がやや高めです。お肉の脂身を抑え、焼き魚や焼き鳥（ささみ・レバー）、チーズや卵料理、サラダチキン、豆腐料理に置き換えることで、脂質異常症を力強く予防できます。日々のバランスを保ちながら健康習慣を続けていきましょう！</div>`;
  } else {
    nutHtml += `理想的なマクロ栄養素比率を達成しています！この調子で良質なタンパク質（卵・魚・焼き鳥・チーズ・豆）と野菜小鉢・果物を維持していきましょう。</div>`;
  }

  return docHtml + nutHtml;
}

// =========================================================
// TAB 4: 医師提出用 A4クリニック・レポート 生成ロジック
// =========================================================
function generateDoctorReport() {
  const period = document.getElementById('reportPeriodSelect').value;
  const list = getFilteredRecords(period);

  const today = new Date();
  document.getElementById('repIssueDate').textContent = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  const hist = globalClinicalHistory || {};
  const condEl = document.getElementById('repHpmConditions');
  const labEl = document.getElementById('repHpmLab');
  if (condEl) condEl.textContent = hist.conditions ? `${hist.conditions} ${hist.notes ? `(${hist.notes})` : ''}` : '特記なし（健康維持）';
  if (labEl) {
    const labTexts = [];
    if (hist.checkDate) labTexts.push(`受診:${hist.checkDate}`);
    if (hist.ldl) labTexts.push(`LDL:${hist.ldl}`);
    if (hist.hba1c) labTexts.push(`HbA1c:${hist.hba1c}%`);
    if (hist.egfr) labTexts.push(`eGFR:${hist.egfr}`);
    if (hist.ua) labTexts.push(`UA:${hist.ua}`);
    labEl.textContent = labTexts.length > 0 ? labTexts.join(' / ') : '未登録';
  }

  if (list.length === 0) {
    document.getElementById('repPeriodRange').textContent = "データなし";
    document.getElementById('repDailyTableBody').innerHTML = '<tr><td colspan="10" style="text-align:center; padding:20px;">記録データがありません。</td></tr>';
    return;
  }

  document.getElementById('repPeriodRange').textContent = `${list[0].date} 〜 ${list[list.length - 1].date} (${list.length}日間)`;

  document.getElementById('repAgeGender').textContent = `${globalProfile.age || '50代'} ${globalProfile.gender || '男性'}`;
  const h = globalProfile.height || 172;
  const lastWeight = list[list.length - 1].morning?.weight || list[list.length - 1].weight || 68.0;
  document.getElementById('repHeightWeight').textContent = `${h} cm / ${lastWeight} kg`;

  const hM = h / 100;
  const bmi = (lastWeight / (hM * hM)).toFixed(1);
  const stdW = (hM * hM * 22).toFixed(1);
  document.getElementById('repBmiStd').textContent = `${bmi} (適正 ${stdW}kg)`;
  document.getElementById('repCares').textContent = (globalProfile.cares || ['高血圧', '脂質異常症']).join(', ');

  let sumSysM = 0, sumDiaM = 0, countM = 0, maxSysM = -1, minSysM = 999;
  let sumSysN = 0, sumDiaN = 0, countN = 0, maxSysN = -1, minSysN = 999;
  let sumPP = 0, countPP = 0, maxPP = -1, minPP = 999;
  let sumSalt = 0, countSalt = 0, maxSalt = -1, minSalt = 999;
  let sumSteps = 0, maxSteps = 0, countSteps = 0;
  let sumSleep = 0, countSleep = 0;
  let totalMedOpportunities = 0, takenMeds = 0;

  const dates = [];
  const repMSys = [], repNSys = [];

  const tbody = document.getElementById('repDailyTableBody');
  tbody.innerHTML = '';

  list.forEach(r => {
    dates.push(r.date.slice(5));

    const mSys = r.morning?.bpSys || null;
    const mDia = r.morning?.bpDia || null;
    const mPulse = r.morning?.pulse || '-';
    repMSys.push(mSys);

    if (mSys && mDia) {
      sumSysM += mSys; sumDiaM += mDia; countM++;
      if (mSys > maxSysM) maxSysM = mSys;
      if (mSys < minSysM) minSysM = mSys;

      const pp = mSys - mDia;
      sumPP += pp; countPP++;
      if (pp > maxPP) maxPP = pp;
      if (pp < minPP) minPP = pp;
    }

    const nSys = r.night?.bpSys || null;
    const nDia = r.night?.bpDia || null;
    const nPulse = r.night?.pulse || '-';
    repNSys.push(nSys);

    if (nSys && nDia) {
      sumSysN += nSys; sumDiaN += nDia; countN++;
      if (nSys > maxSysN) maxSysN = nSys;
      if (nSys < minSysN) minSysN = nSys;
    }

    if (r.steps) {
      sumSteps += r.steps; countSteps++;
      if (r.steps > maxSteps) maxSteps = r.steps;
    }

    if (r.morning?.sleepHours) {
      sumSleep += parseFloat(r.morning.sleepHours);
      countSleep++;
    }

    const allMeds = [...(r.morning?.meds || []), ...(r.lunch?.meds || []), ...(r.dinner?.meds || []), ...(r.night?.meds || [])];
    if (globalMeds.length > 0) {
      totalMedOpportunities += 1;
      if (allMeds.length > 0) takenMeds += 1;
    }

    const pfc = calculatePFCForDay(r);
    sumSalt += pfc.salt; countSalt++;
    if (pfc.salt > maxSalt) maxSalt = pfc.salt;
    if (pfc.salt < minSalt) minSalt = pfc.salt;

    // 食事内訳の生成（抜きの場合は「欠食」と明記）
    const mealTexts = [];
    ['morning', 'lunch', 'dinner'].forEach(sKey => {
      const slotObj = r[sKey] || {};
      if (slotObj.mealType === '抜き') {
        const sName = sKey === 'morning' ? '朝' : (sKey === 'lunch' ? '昼' : '晩');
        mealTexts.push(`${sName}:欠食`);
      } else if (slotObj.items && slotObj.items.length > 0) {
        mealTexts.push(...slotObj.items.map(x => x.subtype ? `${x.name}(${x.subtype})` : x.name));
      }
    });

    let memoStr = mealTexts.slice(0, 4).join('・') || '-';
    if (r.dinner?.alcAmount && r.dinner.alcAmount !== 'なし') {
      memoStr += ` (酒:${r.dinner.alcAmount})`;
    } else {
      memoStr += ` (休肝日◎)`;
    }

    if (r.memo && r.memo.trim()) {
      memoStr += ` 【特記】${r.memo.trim()}`;
    }

    let medDisplay = '未';
    if (allMeds.length > 0) {
      medDisplay = '済◎';
    }

    const dayEffectiveWeight = r.morning?.weight || r.weight || '--';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.date}</td>
      <td>${mSys ? `${mSys}/${mDia}` : '--'} <small style="color:#64748b;">(${mPulse})</small></td>
      <td>${nSys ? `${nSys}/${nDia}` : '--'} <small style="color:#64748b;">(${nPulse})</small></td>
      <td>${(mSys && mDia) ? (mSys - mDia) : '--'}</td>
      <td>${medDisplay}</td>
      <td>${dayEffectiveWeight}</td>
      <td>${r.steps ? r.steps.toLocaleString() : '--'}</td>
      <td>${pfc.salt.toFixed(1)}g</td>
      <td>${r.morning?.sleepHours || '--'}h</td>
      <td style="text-align:left; font-size:8pt;">${escapeHtml(memoStr)}</td>
    `;
    tbody.appendChild(tr);
  });

  const avgMSys = countM > 0 ? Math.round(sumSysM / countM) : '--';
  const avgMDia = countM > 0 ? Math.round(sumDiaM / countM) : '--';
  document.getElementById('rep_avg_m_bp').textContent = `${avgMSys} / ${avgMDia}`;
  document.getElementById('rep_minmax_m_bp').textContent = countM > 0 ? `${maxSysM} / ${minSysM}` : '--';
  document.getElementById('rep_judge_m_bp').textContent = avgMSys < 125 ? "至適 (良好)" : (avgMSys <= 135 ? "境界域" : "高血圧域");

  const avgNSys = countN > 0 ? Math.round(sumSysN / countN) : '--';
  const avgNDia = countN > 0 ? Math.round(sumDiaN / countN) : '--';
  document.getElementById('rep_avg_n_bp').textContent = `${avgNSys} / ${avgNDia}`;
  document.getElementById('rep_minmax_n_bp').textContent = countN > 0 ? `${maxSysN} / ${minSysN}` : '--';
  document.getElementById('rep_judge_n_bp').textContent = countN === 0 ? "未測定" : (avgNSys < 125 ? "良好" : "高血圧警戒");

  const avgPP = countPP > 0 ? Math.round(sumPP / countPP) : '--';
  document.getElementById('rep_avg_pp').textContent = `${avgPP}`;
  document.getElementById('rep_minmax_pp').textContent = countPP > 0 ? `${maxPP} / ${minPP}` : '--';
  document.getElementById('rep_judge_pp').textContent = avgPP < 65 ? "適正 (血管弾性良好)" : "やや開大";

  const medAdherence = totalMedOpportunities > 0 ? Math.round((takenMeds / totalMedOpportunities) * 100) : 100;
  document.getElementById('rep_med_adherence').textContent = `${medAdherence}`;
  document.getElementById('rep_judge_med').textContent = medAdherence >= 90 ? "優良◎" : "要改善";

  const avgSalt = countSalt > 0 ? (sumSalt / countSalt).toFixed(1) : '--';
  document.getElementById('rep_avg_salt').textContent = `${avgSalt}`;
  document.getElementById('rep_minmax_salt').textContent = countSalt > 0 ? `${maxSalt.toFixed(1)} / ${minSalt.toFixed(1)}` : '--';
  document.getElementById('rep_judge_salt').textContent = avgSalt <= 6.5 ? "良好 (達成)" : "微増";

  const avgSteps = countSteps > 0 ? Math.round(sumSteps / countSteps).toLocaleString() : '--';
  const avgSleep = countSleep > 0 ? (sumSleep / countSleep).toFixed(1) : '--';
  document.getElementById('rep_avg_steps').textContent = `${avgSteps}`;
  document.getElementById('rep_avg_sleep').textContent = `${avgSleep}`;

  let evalMsg = `<b>【JSH2019ガイドライン基準 臨床所見】:</b> `;
  if (avgMSys < 125 && avgMDia < 75) {
    evalMsg += `家庭血圧基準（125/75未満）を期間全体で安定して維持できています。服薬遵守率は${medAdherence}%と良好で、推定食塩摂取量も平均${avgSalt}g/日と抑制傾向です。${hist.conditions ? `既往歴（${hist.conditions}）に対する内科的コントロールは良好です。` : ''}現在の治療方針・生活習慣療法の継続を推奨します。`;
  } else {
    evalMsg += `朝血圧平均が ${avgMSys}/${avgMDia} mmHg であり、至適基準(125/75)に対してやや高値推移を認めています。就寝前の保温や減塩徹底、ならびに処方内容の確認が推奨されます。`;
  }
  document.getElementById('repClinicalEvaluationText').innerHTML = evalMsg;

  renderReportPrintChart(dates, repMSys, repNSys);
}

function renderReportPrintChart(labels, mSys, nSys) {
  const ctx = document.getElementById('reportPrintChart').getContext('2d');
  if (chartInstances.repChart) chartInstances.repChart.destroy();

  chartInstances.repChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: '朝 最高血圧', data: mSys, borderColor: '#dc2626', borderWidth: 2, tension: 0.2, pointRadius: 2.5, pointBackgroundColor: '#dc2626' },
        { label: '就寝前 最高血圧', data: nSys, borderColor: '#7c3aed', borderWidth: 2, tension: 0.2, pointRadius: 2.5, pointBackgroundColor: '#7c3aed' },
        { label: '家庭至適基準(125)', data: Array(labels.length).fill(125), borderColor: '#16a34a', borderWidth: 1.5, borderDash: [4, 4], pointRadius: 0 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { labels: { color: '#334155', font: { size: 9 } } } },
      scales: {
        x: { ticks: { color: '#475569', maxTicksLimit: 14, font: { size: 8 } }, grid: { color: '#e2e8f0' } },
        y: { min: 90, max: 170, ticks: { color: '#475569', font: { size: 8 } }, grid: { color: '#e2e8f0' } }
      }
    }
  });
}