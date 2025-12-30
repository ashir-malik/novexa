import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/models/gpt2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.8,
            top_p: 0.95,
          },
        }),
      }
    );

    const rawText = await response.text();
    console.log("HF RAW RESPONSE:", rawText);

    // 🔐 SAFETY CHECK
    if (!rawText.trim().startsWith("{") && !rawText.trim().startsWith("[")) {
      return res.status(500).json({
        response: "AI is warming up or rate-limited. Please try again in a moment.",
      });
    }

    const data = JSON.parse(rawText);

    if (data.error) {
      return res.status(500).json({ response: data.error });
    }

    const generated =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : "No text generated.";

    res.status(200).json({ response: generated });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ response: "Server error" });
  }
}
