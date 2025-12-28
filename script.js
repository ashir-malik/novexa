const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector("#chat-messages");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userInput = document.querySelector("#user-input").value;
  if (!userInput) return;

  // Show user message
  const userMsg = document.createElement("div");
  userMsg.className = "message user-message";
  userMsg.textContent = userInput;
  chatMessages.appendChild(userMsg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Clear input
  document.querySelector("#user-input").value = "";

  // Show AI loading
  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai-message";
  aiMsg.textContent = "Generating response...";
  chatMessages.appendChild(aiMsg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Call backend AI endpoint
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userInput })
  });

  const data = await response.json();
  aiMsg.textContent = data.response || "No response.";
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Sidebar buttons
document.querySelector("#new-chat").addEventListener("click", () => {
  chatMessages.innerHTML = "";
});

document.querySelector("#services-btn").addEventListener("click", () => {
  alert("Select a service from the right sidebar!");
});

document.querySelector("#login-btn").addEventListener("click", () => {
  alert("Login feature coming soon!");
});
