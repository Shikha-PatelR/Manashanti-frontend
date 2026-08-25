import { useState } from 'react';

function App() {
  const [text, setText] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getGitaWisdom = async () => {
    if(!text) return;
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("https://manashanti-backend.vercel.app/get-gita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
      });
      const result = await res.json();
      setData(result);
    } catch (e) {
      alert("Backend error");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "650px", margin: "30px auto", fontFamily: "Arial", padding: "20px" }}>
      <h1>Manashanti - Gita for Peace</h1>
      <p>Apna man ka haal likho...</p>
      
      <div style={{display: "flex", gap: "10px"}}>
        <input 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="eg: I am feeling sad today"
          style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button onClick={getGitaWisdom} style={{ padding: "12px 20px", borderRadius: "8px", background: "#4CAF50", color: "white", border: "none" }}>
          {loading ? "..." : "Ask Gita"}
        </button>
      </div>

      {data && (
        <div style={{ marginTop: "25px", border: "1px solid #ddd", padding: "20px", borderRadius: "12px", background: "#fafafa" }}>
          <h3 style={{ color: "#2e7d32" }}>Emotion: {data.emotion}</h3>
          <p><b>Manashanti says:</b> {data.support}</p>
          <div style={{ background: "#e3f2fd", padding: "12px", borderRadius: "8px", margin: "12px 0" }}>
            <b>💡 Real Life:</b> {data.example}
          </div>
          <hr />
          <p><b>Sanskrit:</b> {data.shloka.sanskrit}</p>
          <p><b>Hindi:</b> {data.shloka.hindi}</p>
          <p><b>English:</b> {data.shloka.english}</p>
          <p><b>Ref:</b> {data.shloka.reference}</p>
          <div style={{ background: "#fff8e1", padding: "12px", borderRadius: "8px", marginTop: "12px" }}>
            <b>📖 Story:</b> {data.shloka.story}
          </div>
          <div style={{ background: "#f3e5f5", padding: "12px", borderRadius: "8px", marginTop: "12px" }}>
            <b>🧘 Explanation:</b> {data.shloka.explanation}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
