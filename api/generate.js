import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKE}`, // your token
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();
    console.log("Hugging Face response:", data); // logs raw response

    // Safely extract generated text
    const generatedText = Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : "No text generated.";

    res.status(200).json({ response: generatedText });

  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ response: "Error generating text" });
  }
}
