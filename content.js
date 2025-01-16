const codingDesContainerClass = "coding_desc_container__gdB9M";
let currentProblemUrl = "";
console.log("Marked library loaded:", typeof marked !== "undefined");

function cleanup() {
  const existingButton = document.getElementById("ai-help-button");
  const existingChatbox = document.getElementById("ai-chatbox");

  if (existingButton) {
    existingButton.remove();
  }

  if (existingChatbox) {
    existingChatbox.remove();
  }
}

function addAIHelpButton() {
  if (!window.location.href.startsWith("https://maang.in/problems/")) {
    return;
  }

  if (currentProblemUrl !== window.location.href) {
    cleanup();
    currentProblemUrl = window.location.href;
  }

  const codingDesContainer = document.getElementsByClassName(
    codingDesContainerClass
  )[0];
  if (!codingDesContainer) {
    return;
  }

  if (document.getElementById("ai-help-button")) {
    return;
  }

  const aiHelpButton = document.createElement("button");
  aiHelpButton.id = "ai-help-button";
  aiHelpButton.textContent = "AI Help";
  aiHelpButton.style.padding = "10px 20px";
  aiHelpButton.style.backgroundColor = "#007bff";
  aiHelpButton.style.color = "#fff";
  aiHelpButton.style.border = "none";
  aiHelpButton.style.borderRadius = "5px";
  aiHelpButton.style.cursor = "pointer";
  aiHelpButton.style.fontSize = "14px";
  aiHelpButton.addEventListener("click", () => toggleChatbox(aiHelpButton));
  codingDesContainer.insertAdjacentElement("beforeend", aiHelpButton);
}

function toggleChatbox(button) {
  const existingChatbox = document.getElementById("ai-chatbox");

  if (existingChatbox) {
    existingChatbox.style.display =
      existingChatbox.style.display === "none" ? "block" : "none";
    if (existingChatbox.style.display === "block") {
      existingChatbox.scrollIntoView({behavior: "smooth", block: "start"});
    }
    return;
  }

  const chatbox = document.createElement("div");
  chatbox.id = "ai-chatbox";
  chatbox.style.width = "100%";
  chatbox.style.backgroundColor = "#fff";
  chatbox.style.border = "1px solid #ccc";
  chatbox.style.borderRadius = "10px";
  chatbox.style.padding = "10px";
  chatbox.style.marginTop = "10px";
  chatbox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  chatbox.style.position = "relative";

  const chatContent = document.createElement("div");
  chatContent.id = "chat-content";
  chatbox.appendChild(chatContent);

  // Fetch and display old chat history if available
  const problemId = getCurrentProblemId();
  const chatHistory = getChatHistory(problemId);
  chatHistory.forEach((message) => {
    const messageBubble = document.createElement("div");
    messageBubble.textContent = message.parts[0].text;
    messageBubble.style.padding = "8px 15px";
    messageBubble.style.marginBottom = "10px";
    messageBubble.style.backgroundColor =
      message.role === "user" ? "#f1f1f1" : "#DDF6FF";
    messageBubble.style.borderRadius = "20px";
    messageBubble.style.maxWidth = "80%";
    messageBubble.style.marginLeft = message.role === "user" ? "auto" : "0";
    messageBubble.style.marginRight = message.role === "model" ? "auto" : "0";
    messageBubble.style.textAlign = message.role === "user" ? "right" : "left";
    chatContent.appendChild(messageBubble);
  });

  const chatInput = document.createElement("textarea");
  chatInput.id = "chat-input";
  chatInput.placeholder = "Type your message...";
  chatInput.style.width = "100%";
  chatInput.style.height = "50px";
  chatInput.style.marginTop = "10px";
  chatInput.style.border = "1px solid #ccc";
  chatInput.style.borderRadius = "5px";
  chatInput.style.padding = "5px";
  chatInput.style.fontSize = "14px";
  chatInput.style.boxSizing = "border-box";

  const sendButton = document.createElement("button");
  sendButton.textContent = "Send";
  sendButton.style.padding = "8px 15px";
  sendButton.style.backgroundColor = "#28a745";
  sendButton.style.color = "#fff";
  sendButton.style.border = "none";
  sendButton.style.borderRadius = "5px";
  sendButton.style.cursor = "pointer";
  sendButton.style.fontSize = "14px";
  sendButton.style.marginTop = "10px";

  sendButton.addEventListener("click", () => sendMessage(chatInput.value));

  chatbox.appendChild(chatInput);
  chatbox.appendChild(sendButton);
  button.insertAdjacentElement("afterend", chatbox);
  chatbox.scrollIntoView({behavior: "smooth", block: "start"});

  async function sendMessage(userMessage) {
    if (!userMessage.trim()) return;

    const problemId = getCurrentProblemId();
    console.log("Current Problem ID:", problemId);

    const chatHistory = getChatHistory(problemId);
    console.log("Current Chat History:", chatHistory);

    // Create user message bubble
    const userMessageBubble = document.createElement("div");
    userMessageBubble.textContent = userMessage;
    userMessageBubble.style.padding = "8px 15px";
    userMessageBubble.style.marginBottom = "10px";
    userMessageBubble.style.backgroundColor = "#f1f1f1";
    userMessageBubble.style.borderRadius = "20px";
    userMessageBubble.style.maxWidth = "80%";
    userMessageBubble.style.marginLeft = "auto";
    userMessageBubble.style.textAlign = "right";
    chatContent.appendChild(userMessageBubble);

    chatInput.value = "";

    // If this is the first message, include the system prompt
    let messageToSend;
    if (chatHistory.length === 0) {
      console.log("First message - constructing system prompt");
      const systemPrompt = constructSystemPrompt(problemId);
      console.log("Constructed System Prompt:", systemPrompt);

      if (systemPrompt) {
        messageToSend = systemPrompt + userMessage;
        console.log("Combined message with system prompt:", messageToSend);
      } else {
        console.warn(
          "Failed to construct system prompt, sending original message"
        );
        messageToSend = userMessage;
      }
    } else {
      console.log("Subsequent message - sending without system prompt");
      messageToSend = userMessage;
    }

    // API call

    const getApiKey = async () => {
      return new Promise((resolve) => {
        chrome.storage.local.get(["apiKey"], (result) => {
          console.log("Retrieved API key:", result.apiKey);
          resolve(result.apiKey || null);
        });
      });
    };

    // Then in your sendMessage function:
    const apiKey = await getApiKey();
    if (!apiKey) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent =
        "Please set your API key in the extension settings (click extension icon)";
      errorMessage.style.color = "#721c24";
      errorMessage.style.backgroundColor = "#f8d7da";
      errorMessage.style.padding = "10px";
      errorMessage.style.borderRadius = "5px";
      errorMessage.style.marginBottom = "10px";
      chatContent.appendChild(errorMessage);
      return;
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Update chat history with user message
    chatHistory.push({role: "user", parts: [{text: messageToSend}]});

    const data = {contents: chatHistory};
    console.log("Sending to API:", data);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (
        !result.candidates ||
        !result.candidates[0]?.content?.parts[0]?.text
      ) {
        throw new Error("Invalid API response structure");
      }

      const aiMessage = result.candidates[0].content.parts[0].text;

      // Update chat history with AI response
      chatHistory.push({role: "model", parts: [{text: aiMessage}]});
      saveChatHistory(problemId, chatHistory);

      // Create AI message bubble
      // const aiMessageBubble = document.createElement("div");
      // aiMessageBubble.textContent = aiMessage;
      // aiMessageBubble.style.padding = "8px 15px";
      // aiMessageBubble.style.marginBottom = "10px";
      // aiMessageBubble.style.backgroundColor = "#DDF6FF";
      // aiMessageBubble.style.borderRadius = "20px";
      // aiMessageBubble.style.maxWidth = "80%";
      // aiMessageBubble.style.marginRight = "auto";
      const aiMessageBubble = document.createElement("div");
      aiMessageBubble.innerHTML = marked.parse(aiMessage); // This line changed
      aiMessageBubble.style.padding = "8px 15px";
      aiMessageBubble.style.marginBottom = "10px";
      aiMessageBubble.style.backgroundColor = "#DDF6FF";
      aiMessageBubble.style.borderRadius = "20px";
      aiMessageBubble.style.maxWidth = "80%";
      aiMessageBubble.style.marginRight = "auto";

      const style = document.createElement("style");
      style.textContent = `
pre {
    background-color: #f6f8fa;
    border-radius: 6px;
    padding: 15px;
    overflow-x: auto;
    margin: 10px 0;
}

code {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.4;
}
`;
      document.head.appendChild(style);

      chatContent.appendChild(aiMessageBubble);

      // Scroll to bottom
      chatContent.scrollTop = chatContent.scrollHeight;
    } catch (error) {
      console.error("Error in API call:", error);

      // Create error message bubble
      const errorMessageBubble = document.createElement("div");
      errorMessageBubble.textContent =
        "Sorry, I couldn't process your request. Please try again.";
      errorMessageBubble.style.padding = "8px 15px";
      errorMessageBubble.style.marginBottom = "10px";
      errorMessageBubble.style.backgroundColor = "#f8d7da";
      errorMessageBubble.style.color = "#721c24";
      errorMessageBubble.style.borderRadius = "20px";
      errorMessageBubble.style.maxWidth = "80%";
      errorMessageBubble.style.marginRight = "auto";

      chatContent.appendChild(errorMessageBubble);
    }
  }

  function constructSystemPrompt(problemId) {
    const problemData = apiResponseMap.get(Number(problemId))?.data;
    if (!problemData) return null;

    const currentCode = getCodeFromLocalStorage(problemId);

    const systemPrompt = `
You are an AI coding mentor for this specific programming problem: "${
      problemData.title
    }". 

STRICT GUIDELINES:
1. CODE SHARING RULES:
   - Never share complete template code
   - Always write original, problem-specific code
   - Modify standard algorithms to fit this specific problem
   - Break down code explanations into steps
   - Use markdown: \`\`\`cpp\n// code here\n\`\`\`

2. WHEN ASKED FOR CODE:
   - First explain the approach
   - Show only relevant parts of code
   - Explain each section's purpose
   - Focus on problem-specific implementation

3. PROBLEM CONTEXT:
Problem: ${problemData.body.replace(/<[^>]*>/g, "")}
Constraints: ${problemData.constraints.replace(/<[^>]*>/g, "")}
Input Format: ${problemData.input_format.replace(/<[^>]*>/g, "")}
Output Format: ${problemData.output_format.replace(/<[^>]*>/g, "")}
Sample Test Cases: ${JSON.stringify(problemData.samples)}

4. USER'S CODE:
${currentCode || "No code written yet"}

RESPONSE FORMAT:
- Keep explanations under 150 words
- Provide specific, targeted feedback
- No generic templates or copied code
- Focus only on this problem's requirements

Remember: Write original code specific to this problem only.

User's First Message: `;

    return systemPrompt;
  }
  async function fetchAIResponse(userMessage, problemId) {
    const getApiKey = async () => {
      return new Promise((resolve) => {
        chrome.storage.local.get(["apiKey"], (result) => {
          console.log("Retrieved API key:", result.apiKey);
          resolve(result.apiKey || null);
        });
      });
    };

    // Then in your sendMessage function:
    const apiKey = await getApiKey();
    if (!apiKey) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent =
        "Please set your API key in the extension settings (click extension icon)";
      errorMessage.style.color = "#721c24";
      errorMessage.style.backgroundColor = "#f8d7da";
      errorMessage.style.padding = "10px";
      errorMessage.style.borderRadius = "5px";
      errorMessage.style.marginBottom = "10px";
      chatContent.appendChild(errorMessage);
      return;
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const chatHistory = getChatHistory(problemId);
    chatHistory.push({role: "user", parts: [{text: userMessage}]});

    const data = {contents: chatHistory};

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      });

      const result = await response.json();
      const aiMessage = result.candidates[0].content.parts[0].text;

      chatHistory.push({role: "model", parts: [{text: aiMessage}]});
      saveChatHistory(problemId, chatHistory);

      const aiMessageBubble = document.createElement("div");
      aiMessageBubble.innerHTML = marked.parse(aiMessage); // This line changed
      // aiMessageBubble.textContent = aiMessage;
      aiMessageBubble.style.padding = "8px 15px";
      aiMessageBubble.style.marginBottom = "10px";
      aiMessageBubble.style.backgroundColor = "#DDF6FF";
      aiMessageBubble.style.borderRadius = "20px";
      aiMessageBubble.style.maxWidth = "80%";
      aiMessageBubble.style.marginRight = "auto";

      const style = document.createElement("style");
      style.textContent = `
    pre {
        background-color: #f6f8fa;
        border-radius: 6px;
        padding: 15px;
        overflow-x: auto;
        margin: 10px 0;
    }
    
    code {
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.4;
    }
`;
      document.head.appendChild(style);

      chatContent.appendChild(aiMessageBubble);

      console.log("API Response:", result); // Logging API response for debugging
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessageBubble = document.createElement("div");
      errorMessageBubble.textContent =
        "Sorry, I couldn't process your request.";
      errorMessageBubble.style.padding = "8px 15px";
      errorMessageBubble.style.marginBottom = "10px";
      errorMessageBubble.style.backgroundColor = "#f8d7da";
      errorMessageBubble.style.color = "#721c24";
      errorMessageBubble.style.borderRadius = "20px";
      errorMessageBubble.style.maxWidth = "80%";
      errorMessageBubble.style.marginRight = "auto";

      chatContent.appendChild(errorMessageBubble);
    }
  }

  function getChatHistory(problemId) {
    const history = localStorage.getItem(`chatHistory_${problemId}`);
    return history ? JSON.parse(history) : [];
  }

  function saveChatHistory(problemId, chatHistory) {
    localStorage.setItem(
      `chatHistory_${problemId}`,
      JSON.stringify(chatHistory)
    );
  }
}

window.addEventListener("load", () => {
  currentProblemUrl = window.location.href;
  addAIHelpButton();
});

const observer = new MutationObserver(() => {
  if (currentProblemUrl !== window.location.href) {
    addAIHelpButton();
  }
});

observer.observe(document.body, {childList: true, subtree: true});

function getCurrentProblemId() {
  const url = window.location.href;
  const match = url.match(/-(\d+)(?:\?|$)/);
  return match ? match[1] : null;
}

const problemId = getCurrentProblemId();

function getCodeFromLocalStorage(problemId) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const parts = key.split("_");

    if (problemId && parts.length > 2 && parts[2] === problemId.toString()) {
      const value = localStorage.getItem(key);
      return value;
    }
  }

  return null;
}

// Inject the script into the page
const injectScript = (filePath) => {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(filePath);
  script.type = "text/javascript";
  script.onload = () => {
    script.remove();
  };
  document.documentElement.appendChild(script);
};

// Call the inject script function
injectScript("inject.js");

// Global map to store API response data
const apiResponseMap = new Map();

// Listen for the custom API response event
window.addEventListener("apiResponseCaptured", (event) => {
  const {url, data} = event.detail;
  console.log("Captured API Response:", {url, data});

  // Extract the `id` from the data object
  if (data && data.data && data.data.id) {
    const problemId = data.data.id;

    // Store the response in the global map using `id` as the key
    apiResponseMap.set(problemId, data);

    console.log(
      `Stored data for problem ID: ${problemId}`,
      apiResponseMap.get(problemId)
    );
  }

  // Optionally send a message to the background script if needed
  chrome.runtime.sendMessage({type: "API_RESPONSE", url, data});
});
