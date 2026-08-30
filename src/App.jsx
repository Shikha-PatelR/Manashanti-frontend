import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      setHistory((prev) => [
        { question: input, answer: data },
        ...prev,
      ]);

      setInput("");
    } catch (error) {
      console.error("Backend Error:", error);

      setHistory((prev) => [
        {
          question: input,
          answer: {
            counselor_response:
              "Backend se connection nahi ho paaya. Please try again.",
          },
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #ffecd2, #fcb69f)",
        padding: "20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#e65100ef" }}>
        🧘 ManaShanti - Ask Gita
      </h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div
          style={{
            background: "linear-gradient(to right, #ffe0b2, #fff9c4)",
            padding: "10px",
            borderRadius: "12px",
            border: "1px solid #ffcc80",
            display: "inline-block",
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#4a2c00",
            }}
          >
            "Arjun jaisa confusion,{" "}
            <span style={{ color: "#e65100" }}>
              Krishna jaisa solution"
            </span>{" "}
            ✨
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Share your feeling... anxious, sad, angry"
          style={{
            padding: "12px",
            width: "60%",
            borderRadius: "12px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          style={{
            padding: "12px 20px",
            borderRadius: "12px",
            border: "none",
            background: "#4a2c2a",
            color: "white",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Ask"}
        </button>
      </div>

      {history.length > 0 && (
        <button
          onClick={() => setHistory([])}
          style={{
            display: "block",
            margin: "20px auto",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#ff6b6b",
            color: "white",
            cursor: "pointer",
          }}
        >
          Clear History 🗑️
        </button>
      )}

      <div
        style={{
          marginTop: "40px",
          maxWidth: "700px",
          margin: "40px auto",
        }}
      >
        {history.map((item, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              marginBottom: "20px",
              color: "#333",
            }}
          >
            <p>
              <b>🙋 You:</b> {item.question}
            </p>

            <hr style={{ margin: "10px 0" }} />

            <p>
              <b>🧠 ManaShanti:</b>{" "}
              {item.answer.counselor_response || "Loading..."}
            </p>

            <p>
              <b>📖 Sanskrit:</b>{" "}
              {item.answer.sanskrit || "Not available"}
            </p>

            <p>
              <b>🇮🇳 Hindi:</b>{" "}
              {item.answer.hindi || "Not available"}
            </p>

            <p>
              <b>🇬🇧 English:</b>{" "}
              {item.answer.english || "Not available"}
            </p>

            <p>
              <b>📚 Reference:</b>{" "}
              Chapter {item.answer.chapter || "-"}, Verse{" "}
              {item.answer.verse || "-"}
            </p>

            <p
              style={{
                fontSize: "12px",
                color: "#888",
                marginTop: "5px",
              }}
            >
              Source: {item.answer.source || "Gita DB"} | Emotion:{" "}
              {item.answer.detected_emotion || ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;