import { useState, useRef, useEffect } from "react";
import { sendMessage as sendMessageAPI } from "../services/api";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Défilement automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Ajouter le message
    setMessages((prev) => [...prev, { from: "user", text: trimmedInput }]);
    setInput("");

    // Thinking
    const loadingMessage = { from: "ai", text: "Thinking..." };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const { reply } = await sendMessageAPI(trimmedInput);

      // Remplacer le message de thinking
      setMessages((prev) =>
        prev.map((m) =>
          m === loadingMessage ? { from: "ai", text: reply } : m
        )
      );
    } catch (err) {
      console.error("Erreur:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m === loadingMessage ? { from: "ai", text: "Erreur" } : m
        )
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "300px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        overflow: "hidden",
        fontFamily: "sans-serif",
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#0056b3",
          color: "#ffffff",
          padding: "8px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Chat</span>
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
          }}
          aria-label={isOpen ? "Fermer chat" : "Ouvrir chat"}
        >
          {isOpen ? "−" : "+"}
        </button>
      </div>

      {/* Body */}
      {isOpen && (
        <div
          style={{
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            height: "400px",
          }}
        >
          <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.from === "user" ? "right" : "left",
                  margin: "6px 0",
                }}
              >
                <span
                  style={{
                    background: m.from === "user" ? "#d1f5d3" : "#eee",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    display: "inline-block",
                    maxWidth: "80%",
                    wordBreak: "break-word",
                    fontStyle: m.text === "Chargement..." ? "italic" : "normal",
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                border: "none",
                resize: "none",
              }}
              placeholder="Saisir un message..."
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "0 12px",
                border: "none",
                background: "#007bff",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
