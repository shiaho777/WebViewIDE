// ---------- 通用：切换标签 ----------
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === tab.dataset.tab));
  });
});

// ---------- 专注计时 ----------
const RING_LEN = 2 * Math.PI * 52; // 与 SVG 圆半径一致
const bar = document.getElementById("bar");
const clock = document.getElementById("clock");
const stateEl = document.getElementById("state");
const toggleBtn = document.getElementById("toggle");
const doneEl = document.getElementById("doneCount");

let totalSec = 25 * 60;
let leftSec = totalSec;
let ticking = null;

const today = new Date().toISOString().slice(0, 10);
let done = Number(localStorage.getItem("focus_" + today) || 0);
doneEl.textContent = done;

function paint() {
  const m = String(Math.floor(leftSec / 60)).padStart(2, "0");
  const s = String(leftSec % 60).padStart(2, "0");
  clock.textContent = `${m}:${s}`;
  // 进度：dashoffset 越大，画的弧越短。
  bar.style.strokeDashoffset = String(RING_LEN * (1 - leftSec / totalSec));
}

function stop() {
  clearInterval(ticking);
  ticking = null;
  toggleBtn.textContent = "开始";
  stateEl.textContent = "已暂停";
}

function start() {
  if (ticking) return stop();
  toggleBtn.textContent = "暂停";
  stateEl.textContent = "专注中…";
  ticking = setInterval(() => {
    leftSec -= 1;
    paint();
    if (leftSec <= 0) {
      stop();
      done += 1;
      localStorage.setItem("focus_" + today, String(done)); // 按天计数
      doneEl.textContent = done;
      stateEl.textContent = "完成一段！";
      leftSec = totalSec;
      paint();
      if (navigator.vibrate) navigator.vibrate(200);
    }
  }, 1000);
}

toggleBtn.addEventListener("click", start);
document.getElementById("reset").addEventListener("click", () => {
  stop();
  leftSec = totalSec;
  stateEl.textContent = "准备开始";
  paint();
});

document.querySelectorAll(".pill").forEach((p) => {
  p.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach((x) => x.classList.toggle("active", x === p));
    stop();
    totalSec = Number(p.dataset.min) * 60;
    leftSec = totalSec;
    stateEl.textContent = "准备开始";
    paint();
  });
});

paint();

// ---------- 记账 ----------
const KEY = "ledger_v1";
const listEl = document.getElementById("list");
const totalEl = document.getElementById("total");

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return []; // 数据损坏时退回空列表，而不是整页崩掉
  }
}

function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

function monthOf(ts) {
  return new Date(ts).toISOString().slice(0, 7);
}

function renderLedger() {
  const items = load();
  const thisMonth = new Date().toISOString().slice(0, 7);
  const mine = items.filter((i) => monthOf(i.ts) === thisMonth);
  const total = mine.reduce((s, i) => s + i.amount, 0);
  totalEl.textContent = "¥" + total.toFixed(2);
  if (!mine.length) {
    listEl.innerHTML = '<li class="empty">本月还没有记录</li>';
    return;
  }
  listEl.innerHTML = mine
    .slice()
    .reverse()
    .map(
      (i) => `<li>
        <span class="note">${escapeHtml(i.note)}</span>
        <span class="amt">¥${i.amount.toFixed(2)}</span>
        <button class="del" data-id="${i.id}" aria-label="删除">×</button>
      </li>`
    )
    .join("");
}

// 用户输入必须先转义再插入 HTML，避免脚本注入。
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

document.getElementById("entryForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const note = document.getElementById("note").value.trim();
  const amount = Number(document.getElementById("amount").value);
  if (!note || !(amount > 0)) return;
  const items = load();
  items.push({ id: Date.now(), note, amount, ts: Date.now() });
  save(items);
  e.target.reset();
  renderLedger();
});

listEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".del");
  if (!btn) return;
  save(load().filter((i) => String(i.id) !== btn.dataset.id));
  renderLedger();
});

document.getElementById("clear").addEventListener("click", () => {
  const thisMonth = new Date().toISOString().slice(0, 7);
  save(load().filter((i) => monthOf(i.ts) !== thisMonth));
  renderLedger();
});

renderLedger();