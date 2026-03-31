/**
 * app.js - マリエル 動物占い UIロジック
 * バージョン: v1.0
 */

const LIFF_ID = "2009660796-i7S6OmjO";

document.addEventListener("DOMContentLoaded", async () => {
  initBirthdaySelects();
  initGenderButtons();
  try {
    await liff.init({ liffId: LIFF_ID });
  } catch (e) {
    console.warn("LIFF init skipped:", e);
  }
  showScreen("top");
});

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById("screen-" + id);
  if (target) target.classList.add("active");
}

function initGenderButtons() {
  document.querySelectorAll(".gender-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".gender-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
}

function getSelectedGender() {
  const selected = document.querySelector(".gender-btn.selected");
  return selected ? selected.dataset.gender : null;
}

function initBirthdaySelects() {
  const yearSel = document.getElementById("sel-year");
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1940; y--) {
    const opt = document.createElement("option");
    opt.value = y; opt.textContent = y;
    yearSel.appendChild(opt);
  }
  const monthSel = document.getElementById("sel-month");
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement("option");
    opt.value = m; opt.textContent = m;
    monthSel.appendChild(opt);
  }
  updateDayOptions();
  yearSel.addEventListener("change", updateDayOptions);
  monthSel.addEventListener("change", updateDayOptions);
}

function updateDayOptions() {
  const year  = parseInt(document.getElementById("sel-year").value)  || new Date().getFullYear();
  const month = parseInt(document.getElementById("sel-month").value) || 1;
  const daySel = document.getElementById("sel-day");
  const current = daySel.value;
  const daysInMonth = new Date(year, month, 0).getDate();
  daySel.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = ""; placeholder.textContent = "日";
  placeholder.disabled = true; placeholder.selected = true;
  daySel.appendChild(placeholder);
  for (let d = 1; d <= daysInMonth; d++) {
    const opt = document.createElement("option");
    opt.value = d; opt.textContent = d;
    daySel.appendChild(opt);
  }
  if (current && parseInt(current) <= daysInMonth) daySel.value = current;
}

function onFortune() {
  const gender = getSelectedGender();
  const year   = parseInt(document.getElementById("sel-year").value);
  const month  = parseInt(document.getElementById("sel-month").value);
  const day    = parseInt(document.getElementById("sel-day").value);
  if (!gender) { showToast("性別を選んでください 🙏"); return; }
  if (!year)   { showToast("生まれ年を選んでください 🙏"); return; }
  if (!month)  { showToast("生まれ月を選んでください 🙏"); return; }
  if (!day)    { showToast("生まれ日を選んでください 🙏"); return; }
  const result = getAnimalFortune(year, month, day);
  renderResult(result, gender);
  showScreen("result");
  window.scrollTo(0, 0);
}

function renderResult(animal, gender) {
  const mainCard = document.getElementById("animal-main-card");
  mainCard.style.background = buildGradient(animal.color);
  document.getElementById("animal-emoji").textContent = animal.emoji;
  document.getElementById("animal-name").textContent  = animal.name;
  document.getElementById("text-personality").textContent = animal.personality;
  document.getElementById("text-love").textContent = animal.love;
  const list = document.getElementById("compatible-list");
  list.innerHTML = "";
  animal.compatibleAnimals.forEach(a => {
    const item = document.createElement("div");
    item.className = "compatible-item";
    item.innerHTML = `<span class="compatible-emoji">${a.emoji}</span><span class="compatible-name">${a.name}</span>`;
    list.appendChild(item);
  });
  window.__currentAnimal = animal;
}

function buildGradient(baseColor) {
  const colorMap = {
    "#7B8FA1": "linear-gradient(135deg, #7B8FA1 0%, #5A7089 100%)",
    "#C8956C": "linear-gradient(135deg, #C8956C 0%, #A97048 100%)",
    "#E8A838": "linear-gradient(135deg, #E8A838 0%, #D08A10 100%)",
    "#3D3D3D": "linear-gradient(135deg, #4A4A4A 0%, #2A2A2A 100%)",
    "#E8B84B": "linear-gradient(135deg, #E8B84B 0%, #D49820 100%)",
    "#B8A9E0": "linear-gradient(135deg, #B8A9E0 0%, #9B88CC 100%)",
    "#C0874B": "linear-gradient(135deg, #C0874B 0%, #A06A2A 100%)",
    "#8B7355": "linear-gradient(135deg, #8B7355 0%, #6B5338 100%)",
    "#8EA9A8": "linear-gradient(135deg, #8EA9A8 0%, #6A8F8D 100%)",
    "#9B8EA0": "linear-gradient(135deg, #9B8EA0 0%, #7B6E80 100%)",
    "#D4C9B0": "linear-gradient(135deg, #C8B89A 0%, #A89878 100%)",
    "#D4821A": "linear-gradient(135deg, #D4821A 0%, #B06000 100%)"
  };
  return colorMap[baseColor] || `linear-gradient(135deg, ${baseColor} 0%, ${baseColor}CC 100%)`;
}

async function onSendToLine() {
  const animal = window.__currentAnimal;
  if (!animal) return;
  if (!liff.isInClient()) {
    showToast("LINEアプリ内で開いてください 📱");
    return;
  }
  const btn = document.getElementById("btn-send-line");
  btn.disabled = true;
  btn.textContent = "送信中...";
  try {
    const flexMsg = buildFlexMessage(animal);
    await liff.sendMessages([flexMsg]);
    btn.textContent = "送信しました ✓";
    btn.style.background = "#05B54D";
  } catch (e) {
    console.error("sendMessages error:", e);
    btn.disabled = false;
    btn.innerHTML = `<span class="line-icon">💬</span> 再送信する`;
    showToast("送信に失敗しました。もう一度お試しください。");
  }
}

function onRetry() {
  document.querySelectorAll(".gender-btn").forEach(b => b.classList.remove("selected"));
  document.getElementById("sel-year").selectedIndex  = 0;
  document.getElementById("sel-month").selectedIndex = 0;
  updateDayOptions();
  const btn = document.getElementById("btn-send-line");
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `<span class="line-icon">💬</span> 結果をLINEに送る`;
    btn.style.background = "";
  }
  showScreen("input");
  window.scrollTo(0, 0);
}

function showToast(message) {
  const existing = document.querySelector(".error-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "error-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}
