import fetch from "node-fetch";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Call Hugging Face GPT-2 model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        headers: {
  "Authorization": `Bearer ${process.env.HF_TOKEN}`,
  "Content-Type": "application/json",
                  }
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 150 } // Controls length of output
        }),
      }
    );

    const data = await response.json();

    // Return GPT-2 output to frontend
    res.status(200).json({ response: data[0].generated_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating text" });
  }
}
