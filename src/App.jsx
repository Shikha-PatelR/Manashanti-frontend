import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://manashanti-backend.vercel.app";

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    const text = input.trim();

    if (!text || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setHistory((prev) => [
        {
          question: text,
          answer: data,
        },
        ...prev,
      ]);

      setInput("");
    } catch (err) {
      console.error("ManaShanti API error:", err);

      setError(
        "ManaShanti se connection nahi ho paaya. Please thodi der baad try karein."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="mana-app">
      {/* Header */}
      <header className="mana-header">
        <div className="mana-logo">🧘</div>

        <h1>ManaShanti</h1>

        <p className="mana-subtitle">
          A peaceful space to share what is on your mind.
        </p>

        <div className="gita-quote">
          "Arjun jaisa confusion, Krishna jaisa solution" ✨
        </div>
      </header>

      <main className="chat-container">
        {/* Ask box */}
        <section className="ask-card">
          <div className="ask-row">
            <input
              className="ask-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your feelings..."
              disabled={loading}
              aria-label="Share your feelings"
            />

            <button
              className="ask-button"
              onClick={handleAsk}
              disabled={loading || !input.trim()}
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </div>

          {error && (
            <p
              style={{
                marginTop: "12px",
                color: "#a34d42",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}
        </section>

        {/* Empty state */}
        {history.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🌿</div>

            <h2>Take a moment to breathe</h2>

            <p>
              Share what you're feeling, and ManaShanti will listen.
            </p>
          </div>
        )}

        {/* Conversation history */}
        <section className="conversation">
          {history.map((item, index) => {
            const answer = item.answer;

            return (
              <div key={index}>
                {/* User message */}
                <div className="user-message">
                  <div className="user-bubble">
                    <span className="user-label">🙋 You</span>
                    {item.question}
                  </div>
                </div>

                {/* Counselor response */}
                <article className="counselor-card">
                  <div className="counselor-header">
                    <div className="counselor-avatar">🧘</div>

                    <div className="counselor-name">
                      ManaShanti
                    </div>

                    {answer.detected_emotion && (
                      <div className="emotion-badge">
                        {answer.detected_emotion}
                      </div>
                    )}
                  </div>

                  <div className="counselor-body">
                    <div className="counselor-response">
                      {answer.counselor_response ||
                        "ManaShanti could not generate a response."}
                    </div>

                    {/* Gita Wisdom */}
                    {answer.sanskrit && (
                      <div className="gita-card">
                        <div className="gita-title">
                          📖 Bhagavad Gita Wisdom
                        </div>

                        <div className="gita-sanskrit">
                          {answer.sanskrit}
                        </div>

                        {answer.hindi && (
                          <p className="gita-meaning">
                            <strong>🇮🇳 Hindi:</strong>{" "}
                            {answer.hindi}
                          </p>
                        )}

                        {answer.english && (
                          <p className="gita-meaning">
                            <strong>🇬🇧 English:</strong>{" "}
                            {answer.english}
                          </p>
                        )}

                        {answer.chapter && answer.verse && (
                          <div className="gita-reference">
                            📚 Chapter {answer.chapter}, Verse{" "}
                            {answer.verse}
                            {answer.source && (
                              <>
                                {" • "}
                                {answer.source}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </section>

        {/* Clear history */}
        {history.length > 0 && (
          <div className="history-actions">
            <button
              className="clear-button"
              onClick={() => setHistory([])}
            >
              🗑️ Clear conversation
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;