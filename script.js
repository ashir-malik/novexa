document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("prompt-form");
  const input = document.getElementById("prompt-input");
  const output = document.getElementById("output");
  const submitBtn = document.getElementById("submit-btn");

  // SAFETY CHECK
  if (!form || !input || !output || !submitBtn) {
    console.error("One or more HTML elements not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prompt = input.value.trim();
    if (!prompt) return;

    output.textContent = "Generating...";
    submitBtn.disabled = true;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      output.textContent = data.response || "No text generated.";
    } catch (err) {
      console.error(err);
      output.textContent = "Error contacting AI.";
    } finally {
      submitBtn.disabled = false;
    }
  });
});
