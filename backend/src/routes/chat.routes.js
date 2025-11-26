import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Validation
const handleValidation = (req, res, next) => {
  const { message } = req.body;
  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Message invalide" });
  }
  next();
};

// Route POST /chat
router.post("/", handleValidation, async (req, res) => {
  const { message } = req.body;
  console.log("Message reçu:", message); // DEBUG

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-oss",
        prompt: message,
        stream: false, // JSON
        temperature: 0.1,
        top_k: 45,
        top_p: 0.92,
        max_tokens: 150,
        repetition_penalty: 1.1,
      }),
    });

    const data = await response.json();
    console.log("Raw response:", data);

    const reply = data.response || data.completion || "No response";

    res.json({ reply });
  } catch (err) {
    console.error("Errorr:", err);
    res.status(500).json({ error: "Error" });
  }
});

export default router;
