import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const suggestions = ["I am anxious", "I am sad", "I feel angry", "I feel lonely"];

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice not supported, Chrome use karo"); return; }
    const recog = new SpeechRecognition();
    recog.lang = "en-IN";
    recog.onstart = () => setIsListening(true);
    recog.onend = () => setIsListening(false);
    recog.onresult = (e) => setText(e.results[0][0].transcript);
    recog.start();
  };

  const speak = (txt) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = "hi-IN"; u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const askGita = async (customText) => {
    const query = customText || text;
    if (!query.trim()) return;
    setLoading(true);
    try {
      // FIX 1: /ask endpoint (backend ka sahi endpoint)
      const res = await fetch("https://manashanti-backend.vercel.app/ask", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });
      const data = await res.json();
      setHistory([{ q: query, d: data },...history]);
      setText("");
    } catch (e) { alert("Backend error: " + e.message); }
    setLoading(false);
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fdba74 100%)", display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: history.length === 0? "center" : "flex-start", padding: "30px 20px 160px 20px", width: "100%", maxWidth: "850px", margin: "0 auto" }}>
        {history.length === 0? (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "50px", color: "#f97316", fontWeight: "800" }}>🧘 ManaShanti</h1>
            <p style={{ fontSize: "22px", color: "#1f2937", marginTop: "10px", fontWeight: "600" }}>Ready when you are.</p>
            <p style={{ color: "#6b7280", marginTop: "6px" }}>Arjun Jaisi Confusion, Krishna Jaisa Solution ✨</p>
          </div>
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "22px", alignItems: "center" }}>
            {history.map((item, i) => {
              const d = item.d;
              return (
                <div key={i} style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", width: "100%", maxWidth: "720px", textAlign: "left" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#f97316", fontWeight: "bold" }}>
                      {d.detected_emotion?.toUpperCase()} • GITA {d.chapter}.{d.verse} • {d.source}
                    </p>
                    <button onClick={() => speak(d.explanation)} style={{ border: "none", background: "#fff7ed", padding: "6px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "12px" }}>🔊 Listen</button>
                  </div>
                  <h3 style={{ fontWeight: "bold", marginTop: "8px", fontSize: "18px" }}>"{item.q}"</h3>

                  {/* IMAGE FROM BACKEND */}
                  {d.image && <img src={d.image} alt="gita" style={{ width: "100%", borderRadius: "15px", marginTop: "15px", height: "220px", objectFit: "cover" }} />}

                  <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ background: "#fffbeb", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #f97316" }}>
                      <p style={{ fontStyle: "italic", fontWeight: "700", fontSize: "16px" }}>"{d.sanskrit}"</p>
                      <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>{d.english}</p>
                      <p style={{ fontSize: "15px", fontWeight: "600", marginTop: "8px" }}>{d.hindi}</p>
                      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #fde68a" }}>
                        <p style={{ fontSize: "13.5px", lineHeight: "1.6" }}><b>🌿 {d.detected_emotion} ke liye:</b> {d.explanation}</p>
                      </div>
                    </div>

                    {/* VIDEO FROM BACKEND */}
                    {d.video && <iframe src={d.video} width="100%" height="220" style={{ borderRadius: "15px", border: "none", marginTop: "5px" }} allowFullScreen></iframe>}

                    <p style={{ fontSize: "11px", color: "#9ca3af" }}>📄 Proof: {d.source}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: "0", left: "0", width: "100%", padding: "18px", background: "linear-gradient(to top, #fff7ed 85%, transparent)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {history.length === 0 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap", justifyContent: "center" }}>
            {suggestions.map(s => (<button key={s} onClick={() => askGita(s)} style={{ padding: "8px 14px", borderRadius: "20px", border: "1px solid #fed7aa", background: "white", fontSize: "13px", cursor: "pointer" }}>{s}</button>))}
          </div>
        )}
        <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "720px", background: "#1f2937", borderRadius: "28px", padding: "8px 8px 8px 18px", alignItems: "center" }}>
          <button onClick={startVoice} style={{ background: isListening? "#ef4444" : "#374151", border: "none", borderRadius: "50%", width: "38px", height: "38px", cursor: "pointer" }}>{isListening? "●" : "🎤"}</button>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askGita()} placeholder={isListening? "Sun raha hu..." : "Share your feeling..."} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: "16px" }} />
          <button onClick={() => askGita()} style={{ background: "#f97316", color: "white", border: "none", borderRadius: "50%", width: "42px", height: "42px", cursor: "pointer", fontWeight: "bold" }}>{loading? "..." : "↑"}</button>
        </div>
        {history.length > 0 && <button onClick={() => setHistory([])} style={{ marginTop: "10px", background: "#fecaca", border: "none", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer" }}>Clear History 🗑️</button>}
      </div>
    </div>
  );
}
