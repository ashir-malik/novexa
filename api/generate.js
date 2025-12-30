import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await fetch("https://router.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKE}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 150 } // generate longer text
      }),
    });

    const text = await response.text();
    console.log("Raw Hugging Face response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return res.status(500).json({ response: "Invalid JSON from AI" });
    }

    // Check for error from Hugging Face
    if (data.error) {
      console.error("Hugging Face API returned error:", data.error);
      return res.status(500).json({ response: data.error });
    }

    // Safely extract generated_text
    let generatedText = "";
    if (Array.isArray(data) && data[0]?.generated_text) {
      generatedText = data[0].generated_text;
    } else if (data.generated_text) {
      generatedText = data.generated_text;
    } else {
      generatedText = "AI model returned no text. It might still be loading.";
    }

    res.status(200).json({ response: generatedText });

  } catch (err) {
    console.error("Backend fetch error:", err);
    res.status(500).json({ response: "Error generating text" });
  }
}
