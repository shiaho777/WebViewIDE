// 1) 作品数据：改这个数组就能换成你自己的作品。
const works = [
  { title: "夜航日记", desc: "一个记录深夜灵感的极简笔记页。", tags: ["HTML", "CSS"], c1: "#aebfd0", c2: "#c3cdd8" },
  { title: "番茄小钟", desc: "25 分钟专注计时，带结束提示音。", tags: ["JavaScript"], c1: "#d0c0ac", c2: "#ddcfc0" },
  { title: "像素花园", desc: "点一下种一朵花，纯 CSS 动画。", tags: ["CSS 动画"], c1: "#b3c4b6", c2: "#c6d2c8" },
  { title: "地铁速查", desc: "常用线路与首末班时间离线查询。", tags: ["localStorage"], c1: "#bcc3cf", c2: "#cfd5de" },
];

// 2) 渲染卡片：用模板字符串拼 HTML，再一次性插入。
const grid = document.getElementById("workGrid");
grid.innerHTML = works
  .map(
    (w) => `
  <article class="work" style="--c1:${w.c1};--c2:${w.c2}">
    <div class="thumb"></div>
    <h3>${w.title}</h3>
    <p>${w.desc}</p>
    <div class="tags">${w.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
  </article>`
  )
  .join("");

// 3) 滚动进场：IntersectionObserver 在卡片进入视口时加 .in 类。
const cards = document.querySelectorAll(".work");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  cards.forEach((c) => io.observe(c));
} else {
  cards.forEach((c) => c.classList.add("in"));
}

// 4) 数字滚动：requestAnimationFrame 做 0 → 目标值的缓动。
document.querySelectorAll(".count").forEach((el) => {
  const to = Number(el.dataset.to || 0);
  const start = performance.now();
  const dur = 900;
  const tick = (now) => {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = Math.round(to * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

// 5) 页脚年份自动更新。
document.getElementById("year").textContent = new Date().getFullYear();