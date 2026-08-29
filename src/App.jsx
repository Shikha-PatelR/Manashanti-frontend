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
      setHistory([{ q: text,...data },...history]);
      setText("");
    } catch (e) {
      alert("Backend error, check API");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen bg-[#fdfbf7] text-[#1a2e2a] flex flex-col" style={{fontFamily: 'Inter, sans-serif'}}>
      {/* NAV - Full Width */}
      <nav className="w-full flex justify-between items-center px-6 md:px-12 py-4 bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-[#f0ebe3]">
        <h1 className="font-bold text-xl">🧘 ManaShanti</h1>
        <div className="flex gap-3 items-center">
          <span className="hidden md:block text-sm text-gray-500">Emotion → Gita Wisdom</span>
          <button onClick={()=>setHistory([])} className="bg-[#1a2e2a] text-white px-4 py-2 rounded-full text-sm">Clear</button>
        </div>
      </nav>

      {/* HERO - Full Window */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-block bg-white border border-[#eee] px-3 py-1 rounded-full text-[11px] tracking-widest mb-4">CLEAR MIND • REAL PEACE</div>
          <h2 className="text-4xl md:text-6xl font-bold leading-[1.05]">
            Every emotion deserves <br/> <span className="text-[#d86c4a]">a clear path forward.</span>
          </h2>
          <p className="text-gray-500 mt-4 text-base md:text-lg max-w-lg">Share what you feel. Get Gita-based support, real-life example, and a story that heals.</p>

          {/* INPUT - Auto resize on phone */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
            <input
              value={text}
              onChange={(e)=>setText(e.target.value)}
              onKeyDown={(e)=> e.key==='Enter' && askGita()}
              placeholder="I am feeling anxious, sad, angry..."
              className="flex-1 w-full px-5 py-4 rounded-2xl border border-[#ddd] bg-white outline-none focus:border-[#1a2e2a] text-[16px]"
            />
            <button onClick={askGita} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#1a2e2a] text-white font-medium whitespace-nowrap">
              {loading? "..." : "Ask Gita →"}
            </button>
          </div>
        </div>

        <div className="hidden md:flex justify-center">
          <div className="w-[320px] h-[320px] bg-gradient-to-br from-[#fff1e6] to-[#ffe4d1] rounded-[40px] flex items-center justify-center text-8xl">🕉️</div>
        </div>
      </div>

      {/* RESULTS - Full width responsive cards */}
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-20 flex flex-col gap-6">
        {history.map((d,i)=>(
          <div key={i} className="w-full bg-white rounded-[24px] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-[#f0ebe3]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] tracking-widest text-gray-400">YOUR JOURNEY • {d.emotion?.toUpperCase()}</span>
              <span className="bg-[#fdf0e6] text-[#d86c4a] text-xs px-3 py-1 rounded-full">{d.shloka?.reference}</span>
            </div>

            <p className="font-medium mb-5">❝ {d.q} ❞</p>

            <div className="grid gap-4">
              <div className="bg-[#f8faf8] p-4 rounded-xl"><b className="text-sm">🌿 Support:</b><p className="text-sm text-gray-600 mt-1">{d.support}</p></div>
              <div className="bg-[#f5f9ff] p-4 rounded-xl"><b className="text-sm">💡 Real Example:</b><p className="text-sm text-gray-600 mt-1">{d.example}</p></div>
              <div className="bg-[#fffaf0] p-4 rounded-xl border-l-4 border-[#d86c4a]">
                <p className="font-bold text-sm italic">"{d.shloka?.hindi}"</p>
                <p className="text-xs text-gray-500 mt-1">{d.shloka?.english}</p>
                <p className="text-xs mt-2">{d.shloka?.story}</p>
              </div>
              <div className="bg-[#1a2e2a] text-white p-4 rounded-xl text-sm">
                <b>Deep Meaning:</b> {d.shloka?.explanation}
              </div>
            </div>
          </div>
        ))}
        {history.length===0 && <p className="text-center text-gray-400 mt-10">Your reflections will appear here...</p>}
      </div>
    </div>
  );
}
