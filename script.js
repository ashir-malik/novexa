document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("prompt-input");
  const output = document.getElementById("chat-messages");
  const submitBtn = document.getElementById("submit-btn");

  if (!form || !input || !output || !submitBtn) {
    console.error("One or more HTML elements not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prompt = input.value.trim();
    if (!prompt) return;

    // User message
    const userMsg = document.createElement("div");
    userMsg.className = "message user-message";
    userMsg.textContent = prompt;
    output.appendChild(userMsg);

    // AI loading message
    const aiMsg = document.createElement("div");
    aiMsg.className = "message ai-message";
    aiMsg.textContent = "Generating...";
    output.appendChild(aiMsg);

    input.value = "";
    submitBtn.disabled = true;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      aiMsg.textContent = data.response || "No text generated.";
    } catch (err) {
      console.error(err);
      aiMsg.textContent = "Error contacting AI.";
    } finally {
      submitBtn.disabled = false;
      output.scrollTop = output.scrollHeight;
    }
  });
});
