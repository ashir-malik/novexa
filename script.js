const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector("#chat-messages");

// Send prompt to backend
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userInput = document.querySelector("#user-input").value;
  if (!userInput) return;

  addMessage(userInput, "user-message");
  document.querySelector("#user-input").value = "";

  // Show AI loading
  const aiMsg = addMessage("Generating...", "ai-message");

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userInput })
    });
    const data = await res.json();
    aiMsg.textContent = data.response || "No response from AI";
  } catch (err) {
    console.error(err);
    aiMsg.textContent = "Error: Could not get response from AI";
  }
});

// Add message to chat
function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = "message " + className;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div; // return for loading placeholder
}

// Sidebar buttons
document.querySelector("#new-chat").addEventListener("click", () => chatMessages.innerHTML = "");
document.querySelector("#services-btn").addEventListener("click", () => alert("Select a service from the right sidebar!"));
document.querySelector("#login-btn").addEventListener("click", () => alert("Login feature coming soon!"));
