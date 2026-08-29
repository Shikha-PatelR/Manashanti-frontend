import { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const getGitaWisdom = async () => {
    if(!text) return;
    setLoading(true);
    try {
      const res = await fetch("https://manashanti-backend.vercel.app/get-gita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
      });
      const result = await res.json();
      setHistory([{ input: text, ...result }, ...history]);
      setText("");
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  return (
    <div className="app-container" style={{background: "linear-gradient(to right, #fff5e6, #ffb88c)", minHeight: "100vh", padding: "20px", textAlign: "center"}}>
      <h1 style={{color: "#ff6b35"}}>🧘 ManaShanti - Ask Gita</h1>
      <p style={{background: "#fff3cd", display: "inline-block", padding: "8px 15px", borderRadius: "10px"}}>
        "Arjun jaisa confusion, <span style={{color: "#ff6b35"}}>Krishna jaisa solution</span>" ✨
      </p>
      
              <div style={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // ye center me layega
          justifyContent: "flex-start",
          padding: "40px 20px",
          background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fdba74 100%)"
        }}>
        <button onClick={getGitaWisdom} style={{marginLeft: "10px", padding: "12px 20px", borderRadius: "10px", background: "#4a2c2a", color: "white", border: "none", cursor: "pointer"}}>
          {loading ? "..." : "Ask"}
        </button>
      </div>

      <button onClick={()=> setHistory([])} style={{marginTop: "15px", padding: "8px 15px", borderRadius: "8px", background: "#ff7f7f", border: "none", color: "white"}}>Clear History 🗑️</button>

      <div style={{marginTop: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px"}}>
        {history.map((data, idx) => (
          <div key={idx} style={{background: "white", width: "550px", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)"}}>
            <p><b>🐿️ You:</b> {data.input}</p>
            <hr/>
            <p style={{textAlign: "left"}}><b>💚 Manashanti says:</b> {data.support}</p>
            <p style={{textAlign: "left", background: "#e3f2fd", padding: "10px", borderRadius: "8px"}}><b>💡 Example:</b> {data.example}</p>
            
            <p>📖 <b>Sanskrit:</b> {data.shloka.sanskrit}</p>
            <p>IN <b>Hindi:</b> {data.shloka.hindi}</p>
            <p>GB <b>English:</b> {data.shloka.english}</p>
            <p>📚 <b>Reference:</b> {data.shloka.reference}</p>
            
            <div style={{background: "#fff8e1", padding: "10px", borderRadius: "8px", marginTop: "10px", textAlign: "left"}}>
              <b>Story:</b> {data.shloka.story}
            </div>
            <div style={{background: "#f3e5f5", padding: "10px", borderRadius: "8px", marginTop: "10px", textAlign: "left"}}>
              <b>Deep Meaning:</b> {data.shloka.explanation}
            </div>
            
            <p style={{fontSize: "12px", color: "gray", marginTop: "10px"}}>Source: Gita DB | Emotion: {data.emotion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
