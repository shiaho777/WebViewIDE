import React, { useState } from "react";
import { createRoot } from "react-dom/client";

// 一个真实的 React 组件：计数 + 列表。改这里即可扩展你的应用。
function App() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState(["学习 esbuild", "在手机上构建"]);
  const [draft, setDraft] = useState("");

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setItems([...items, text]);
    setDraft("");
  };

  return (
    <main className="app">
      <h1>React + esbuild</h1>
      <p className="muted">这个页面由 npm 依赖经 esbuild 打包产出。</p>
      <button className="btn" onClick={() => setCount(count + 1)}>
        点击 {count} 次
      </button>
      <div className="row">
        <input
          value={draft}
          placeholder="添加一条"
          onChange={(e) => setDraft(e.target.value)}
        />
        <button className="btn" onClick={add}>添加</button>
      </div>
      <ul>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);