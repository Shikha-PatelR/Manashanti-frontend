import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const suggestions = ["I am anxious", "I am sad", "I feel angry", "I am confused"];

  const askGita = async (customText) => {
    const query = customText || text;
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://manashanti-backend.vercel.app/get-gita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });
      const data = await res.json();
      setHistory([{ q: query, ...data }, ...history]);
      setText("");
    } catch (e) { alert("Backend error"); }
    setLoading(false);
  };

  return (
    <div style={{
      width: "100vw", minHeight: "100vh", 
      background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fdba74 100%)",
      display: "flex", flexDirection: "column",
      fontFamily: "Inter, sans-serif"
    }}>
      {/* CENTER CONTENT - ChatGPT style */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: history.length===0 ? "center" : "flex-start", padding: "40px 20px 120px 20px", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        
        {history.length === 0 ? (
          // EMPTY STATE - Centered like ChatGPT
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={{ fontSize: "48px", color: "#f97316", fontWeight: "bold" }}>🧘 ManaShanti</h1>
            <p style={{ fontSize: "22px", color: "#1f2937", marginTop: "15px", fontWeight: "500" }}>Ready when you are.</p>
            <p style={{ color: "#6b7280", marginTop: "8px" }}>"Arjun jaisa confusion, Krishna jaisa solution" ✨</p>
          </div>
        ) : (
          // RESULTS
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            {history.map((d,i)=>(
              <div key={i} style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>YOUR JOURNEY • {d.shloka?.reference}</p>
                <p style={{ fontWeight: "bold", marginTop: "5px" }}>"{d.q}"</p>
                <p style={{ marginTop: "12px", fontSize: "14px" }}>🐾 <b>Support:</b> {d.support}</p>
                <p style={{ marginTop: "8px", fontSize: "14px" }}>💡 <b>Example:</b> {d.example}</p>
                <div style={{ marginTop: "12px", background: "#fffbeb", padding: "12px", borderRadius: "10px", borderLeft: "4px solid #f97316" }}>
                  <p style={{ fontStyle: "italic" }}>"{d.shloka?.hindi}"</p>
                  <p style={{ fontSize: "12px", color: "#6b7280" }}>{d.shloka?.english}</p>
                  <p style={{ fontSize: "13px", marginTop: "8px" }}>{d.shloka?.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FIXED BOTTOM INPUT - ChatGPT style */}
      <div style={{ position: "fixed", bottom: "0", left: "0", width: "100%", padding: "20px", background: "linear-gradient(to top, #fff7ed 60%, transparent)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* Suggestion chips */}
        {history.length===0 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "15px", flexWrap: "wrap", justifyContent: "center" }}>
            {suggestions.map(s=>(
              <button key={s} onClick={()=>askGita(s)} style={{ padding: "8px 14px", borderRadius: "20px", border: "1px solid #fed7aa", background: "white", fontSize: "13px", cursor: "pointer" }}>{s}</button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "700px", background: "#1f2937", borderRadius: "28px", padding: "8px 8px 8px 20px", alignItems: "center" }}>
          <input
            value={text}
            onChange={(e)=>setText(e.target.value)}
            onKeyDown={(e)=> e.key==="Enter" && askGita()}
            placeholder="Share your feeling... anxious, sad, angry"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: "16px" }}
          />
          <button onClick={()=>askGita()} style={{ background: "#f97316", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", fontWeight: "bold" }}>↑</button>
        </div>
        
        {history.length>0 && <button onClick={()=>setHistory([])} style={{ marginTop: "10px", background: "#fecaca", border: "none", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer" }}>Clear History 🗑️</button>}
      </div>
    </div>
  );
}
