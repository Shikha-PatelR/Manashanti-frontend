import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const suggestions = ["I am anxious", "I am sad", "I feel angry", "I feel lonely"];

  // VOICE INPUT
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice not supported in this browser, Chrome use karo"); return; }
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

  // FRIENDLY FALLBACK - agar backend khali bhejta hai to ye dikhega
  const getFriendlyData = (query, data) => {
    const q = query.toLowerCase();
    if (q.includes("anxious")) {
      return {
        support: data.support || "Anxiety ka matlab hai tum future ke baare me zyada soch rahe ho. Chalo saans lete hain aur present me wapas aate hain. Tum akeli nahi ho.",
        example: data.example || data.real_example || "Jaise kal exam hai aur raat ko neend nahi aa rahi - 'kya hoga?' Yahi anxiety hai.",
        meaning: data.shloka?.explanation || data.explanation || "Gita kehti hai - anxiety isliye hoti hai kyunki hum result ko control karna chahte hain. Krishna kehte hain, apna best karo, result mujh par chhod do. Jab tum sirf karma par focus karoge, man shant ho jayega.",
        story: data.shloka?.story || data.story || "Arjun bhi Kurukshetra me yahi soch ke anxious tha - 'Main jeetunga ya haarunga?' Tab Krishna ne kaha, tum yudh karo, parinaam mera kaam hai."
      }
    }
    return {
      support: data.support || "Main samajh rahi hu tum kaisa feel kar rahe ho. Chalo isko Gita ke nazariye se dekhte hain.",
      example: data.example || data.real_example || "Zindagi me aisa sabke saath hota hai, ye normal hai.",
      meaning: data.shloka?.explanation || data.explanation || "Is shloka ka simple matlab hai - apne man ko shant rakho aur apna karm karte raho.",
      story: data.shloka?.story || data.story || "Arjun ke jeevan ki kahani se ye seekh milti hai."
    }
  };

  const askGita = async (customText) => {
    const query = customText || text;
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://manashanti-backend.vercel.app/get-gita", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });
      const data = await res.json();
      const friendly = getFriendlyData(query, data);
      setHistory([{ q: query, original: data, friendly },...history]);
      setText("");
    } catch (e) { alert("Backend error"); }
    setLoading(false);
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fdba74 100%)", display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: history.length === 0? "center" : "flex-start", padding: "30px 20px 160px 20px", width: "100%", maxWidth: "850px", margin: "0 auto" }}>

        {history.length === 0? (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "50px", color: "#f97316", fontWeight: "800" }}>🧘 ManaShanti</h1>
            <p style={{ fontSize: "22px", color: "#1f2937", marginTop: "10px", fontWeight: "600" }}>Ready when you are.</p>
            <p style={{ color: "#6b7280", marginTop: "6px" }}>Ask Gita, Find Shanti ✨</p>
          </div>
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "22px", alignItems: "center" }}>
            {history.map((item, i) => {
              const d = item.original; const f = item.friendly;
              return (
                <div key={i} style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", width: "100%", maxWidth: "720px", textAlign: "left" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "11px", letterSpacing: "1px", color: "#f97316", fontWeight: "bold" }}>YOUR JOURNEY • {d.shloka?.reference || d.reference || "Bhagavad Gita 2.47"}</p>
                    <button onClick={() => speak(f.meaning)} style={{ border: "none", background: "#fff7ed", padding: "6px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "12px" }}>🔊 Listen</button>
                  </div>
                  <h3 style={{ fontWeight: "bold", marginTop: "8px", fontSize: "18px" }}>"{item.q}"</h3>

                  <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ background: "#f0fdf4", padding: "14px", borderRadius: "12px" }}>
                      <b>🐾 Support:</b><p style={{ fontSize: "14px", marginTop: "4px", lineHeight: "1.5" }}>{f.support}</p>
                    </div>
                    <div style={{ background: "#eff6ff", padding: "14px", borderRadius: "12px" }}>
                      <b>💡 Real Example:</b><p style={{ fontSize: "14px", marginTop: "4px", lineHeight: "1.5" }}>{f.example}</p>
                    </div>
                    <div style={{ background: "#fffbeb", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #f97316" }}>
                      <p style={{ fontStyle: "italic", fontWeight: "700", fontSize: "16px" }}>"{d.shloka?.hindi || d.hindi_shloka || "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।"}"</p>
                      <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>{d.shloka?.english || d.english || "You have the right to work, but not to the fruits of your work."}</p>
                      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #fde68a" }}>
                        <p style={{ fontSize: "13.5px", lineHeight: "1.6" }}><b>📖 Story:</b> {f.story}</p>
                        <p style={{ fontSize: "13.5px", lineHeight: "1.6", marginTop: "10px" }}><b>🌿 Friendly Meaning:</b> {f.meaning}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* BOTTOM INPUT WITH VOICE */}
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
