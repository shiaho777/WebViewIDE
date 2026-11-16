// 状态集中在一个对象里，便于调试与扩展。
const S = {
  running: false,
  score: 0,
  combo: 1,
  left: 30,
  best: Number(localStorage.getItem("tapbest") || 0),
  timer: null,
  dot: null,
};

const board = document.getElementById("board");
const overlay = document.getElementById("overlay");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");
const comboEl = document.getElementById("combo");

bestEl.textContent = S.best;

function render() {
  scoreEl.textContent = S.score;
  timeEl.textContent = S.left;
  timeEl.classList.toggle("low", S.left <= 5);
  comboEl.textContent = "连击 ×" + S.combo;
  bestEl.textContent = S.best;
}

// 随机放一个方块：用百分比坐标，任何屏幕都不会出界。
function spawn() {
  if (S.dot) S.dot.remove();
  const d = document.createElement("div");
  d.className = "dot";
  d.textContent = "●";
  const pad = 14; // 预留边距，避免贴边
  d.style.left = pad + Math.random() * (100 - pad * 2 - 18) + "%";
  d.style.top = pad + Math.random() * (100 - pad * 2 - 14) + "%";
  d.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    hit(d);
  });
  board.appendChild(d);
  S.dot = d;
}

function floatText(text, x, y, cls) {
  const f = document.createElement("div");
  f.className = cls;
  f.textContent = text;
  f.style.left = x + "px";
  f.style.top = y + "px";
  board.appendChild(f);
  setTimeout(() => f.remove(), 650);
}

function hit(dot) {
  if (!S.running) return;
  const gain = 10 * S.combo;
  S.score += gain;
  S.combo = Math.min(S.combo + 1, 8); // 连击上限 8 倍
  const r = dot.getBoundingClientRect();
  const b = board.getBoundingClientRect();
  floatText("+" + gain, r.left - b.left + 12, r.top - b.top, "float");
  dot.remove();
  S.dot = null;
  render();
  spawn();
}

// 点空白：断连击，给一点负反馈但不扣分。
board.addEventListener("pointerdown", (e) => {
  if (!S.running || e.target !== board) return;
  S.combo = 1;
  const b = board.getBoundingClientRect();
  floatText("断连击", e.clientX - b.left - 20, e.clientY - b.top - 10, "miss");
  render();
});

function start() {
  S.running = true;
  S.score = 0;
  S.combo = 1;
  S.left = 30;
  overlay.classList.add("hide");
  render();
  spawn();
  clearInterval(S.timer);
  S.timer = setInterval(() => {
    S.left -= 1;
    render();
    if (S.left <= 0) end();
  }, 1000);
}

function end() {
  S.running = false;
  clearInterval(S.timer);
  if (S.dot) S.dot.remove();
  S.dot = null;
  const record = S.score > S.best;
  if (record) {
    S.best = S.score;
    localStorage.setItem("tapbest", String(S.best)); // 最高分持久化
  }
  overlay.querySelector("h1").textContent = record ? "新纪录！" : "时间到";
  overlay.querySelector("p").innerHTML = `本局 <b>${S.score}</b> 分 · 最高 ${S.best} 分`;
  document.getElementById("startBtn").textContent = "再来一局";
  overlay.classList.remove("hide");
  render();
}

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("tapbest");
  S.best = 0;
  render();
});

render();