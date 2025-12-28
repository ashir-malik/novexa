const form = document.getElementById("prompt-form");
const input = document.getElementById("prompt-input");
const output = document.getElementById("output");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const prompt = input.value.trim();
  if (!prompt) return;

  // Show loading state
  output.textContent = "Generating... ⏳";
  submitBtn.disabled = true;

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    // Try parsing JSON safely
    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("Failed to parse JSON from backend:", err);
      output.textContent = "Error: Invalid response from server.";
      return;
    }

    if (!res.ok) {
      output.textContent = data.response || "Error generating text.";
      return;
    }

    // Show the AI generated text
    output.textContent = data.response || "AI returned no text.";

  } catch (err) {
    console.error("Error calling backend:", err);
    output.textContent = "Error: Could not contact AI.";
  } finally {
    submitBtn.disabled = false;
  }
});
