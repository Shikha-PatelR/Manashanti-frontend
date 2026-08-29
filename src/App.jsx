import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const askGita = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://manashanti-backend.vercel.app/get-gita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setHistory([{ q: text, ...data }, ...history]);
      setText("");
    } catch(e){}
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw", // FULL WINDOW FIX
      maxWidth: "100%",
      background: "#0f172a",
      color: "white",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0",
      margin: "0",
      boxSizing: "border-box",
      overflowX: "hidden"
    }}>
      <div style={{ width: "100%", maxWidth: "800px", padding: "20px", boxSizing: "border-box" }}>
        
        <h1 style={{ textAlign: "center", fontSize: "32px", fontWeight: "bold" }}>🧘 ManaShanti</h1>
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "5px" }}>Emotion → Gita Wisdom</p>
        <p style={{ textAlign: "center", letterSpacing: "2px", fontSize: "12px", marginTop: "10px", color: "#cbd5e1" }}>CLEAR MIND • REAL PEACE</p>
        
        <h2 style={{ textAlign: "center", fontSize: "24px", marginTop: "15px", lineHeight: "1.3" }}>Every emotion deserves<br/>a clear path forward.</h2>
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "14px", marginTop: "10px" }}>
          Share what you feel. Get Gita-based support, real-life example, and a story that heals.
        </p>

        {/* INPUT - Now responsive */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "25px", width: "100%" }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e)=> e.key==="Enter" && askGita()}
            placeholder="I am feeling anxious, sad, angry..."
            style={{ 
              flex: "1", minWidth: "200px", maxWidth: "100%",
              padding: "12px 15px", borderRadius: "10px", border: "none", 
              fontSize: "16px" // 16px prevents auto-zoom on phone
            }}
          />
          <button 
            onClick={askGita} 
            style={{ padding: "12px 20px", borderRadius: "10px", background: "#f8fafc", color: "#0f172a", border: "none", fontWeight: "bold" }}>
            {loading ? "..." : "Ask Gita →"}
          </button>
        </div>

        {/* RESULTS */}
        <div style={{ marginTop: "30px", width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
          {history.map((d, i) => (
            <div key={i} style={{ background: "#1e293b", borderRadius: "16px", padding: "20px", textAlign: "left", wordWrap: "break-word" }}>
              <p style={{ fontSize: "12px", letterSpacing: "1px", color: "#94a3b8" }}>YOUR JOURNEY • {d.shloka?.reference}</p>
              <p style={{ fontWeight: "bold", marginTop: "8px" }}>" {d.q.toUpperCase()} "</p>
              
              <p style={{ marginTop: "15px" }}>🐾 <b>Support:</b></p>
              <p style={{ color: "#cbd5e1", fontSize: "14px", marginTop: "5px" }}>{d.support}</p>

              <p style={{ marginTop: "15px" }}>💡 <b>Real Example:</b></p>
              <p style={{ color: "#cbd5e1", fontSize: "14px", marginTop: "5px" }}>{d.example}</p>

              <p style={{ marginTop: "15px", fontStyle: "italic", fontSize: "14px" }}>"{d.shloka?.hindi}"</p>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "5px" }}>{d.shloka?.english}</p>
              <p style={{ fontSize: "13px", marginTop: "10px" }}>{d.shloka?.story}</p>

              <p style={{ marginTop: "15px" }}><b>Deep Meaning:</b></p>
              <p style={{ color: "#cbd5e1", fontSize: "14px", marginTop: "5px" }}>{d.shloka?.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
