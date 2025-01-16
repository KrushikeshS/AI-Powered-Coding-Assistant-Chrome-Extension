# AI-Powered Problem-Solving Extension for Maang.in

Enhance your coding experience on [Maang.in](https://maang.in) with this Chrome extension! This project integrates AI assistance directly into problem pages, providing tailored help for each question and revolutionizing the way you approach competitive programming.

---

## 🚀 Features

1. **Seamless Integration**  
   - Adds an `AI Help` button directly to the problem description page on Maang.in.

2. **Dynamic Chatbox**  
   - On clicking the `AI Help` button, an interactive AI chatbox appears.  
   - Chatbox provides targeted assistance for the problem being viewed.

3. **Navigation-Aware**  
   - Automatically updates or removes the AI Help button and chatbox when navigating between problems.

4. **User-Centric Design**  
   - Input your own Google Gemini API key for personalized usage.  
   - Independent chat sessions for each problem page.  

5. **Persistent Prompts**  
   - Retains a prebuilt system prompt for the first chat of each session to ensure high-quality responses.

---

## 🛠️ How It Works

1. **Button Placement**  
   - The `AI Help` button is added to the container with the class `coding_desc_container__gdB9M`.  

2. **Dynamic Route Handling**  
   - Uses a `MutationObserver` to monitor route changes and ensures that the button and chatbox update accordingly.  

3. **Chat Management**  
   - Each chat is problem-specific, with session data cleared when navigating away from a problem page.  

4. **Local Storage**  
   - Stores code and problem-related data for efficient handling.

5. **Inject.js Script**  
   - Captures and manages API responses, facilitating seamless communication between the chatbox and the AI.

---

## 🔧 Setup Instructions

### Navigate to the project directory:
```bash
cd your-repo-name
```
1. Load the extension into Chrome:
   - Go to `chrome://extensions/`.
   - Enable Developer mode.
   - Click on Load unpacked.
   - Select the project directory.

2. Add your Google Gemini API key:
   - On first use, you will be prompted to enter your API key.

## 🤖 Usage
1. Open a problem page on Maang.in.
2. Click the AI Help button to toggle the chatbox.
3. Start interacting with the AI for problem-specific guidance.

## 📂 Project Structure
```
.
├── manifest.json         # Defines extension metadata
├── inject.js             # Handles communication and API integration
├── background.js         # Manages background processes
├── popup.html            # UI for API key input
├── popup.js              # Handles popup interactions
├── styles.css            # Styles for button and chatbox
├── README.md             # You are here!
└── assets/               # Contains icons and other assets
```

## 🌟 Key Highlights
- **User-Friendly Interface**: Clean, minimalistic, and intuitive.
- **Focused AI Assistance**: Tailored responses based on the specific problem you're viewing.
- **Highly Customizable**: Bring your own API key and make it truly yours.

## 🚀 Future Enhancements
- **Session Persistence**: Retain chat history across sessions.
- **Enhanced Error Handling**: Improve user feedback for API-related issues.
- **Multi-Language Support**: Expand to support non-English problem pages.

## 🤝 Contribution
Contributions are welcome! If you have ideas or find bugs, feel free to:

1. Fork this repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## 📜 License
This project is licensed under the MIT License.

## ✨ Acknowledgments
- Thanks to Google Gemini for the powerful AI API.
- Inspired by the amazing community of competitive programmers.

## 📧 Contact
For queries or suggestions, feel free to reach out:
- **Krushikesh Shelar**
- Email: krushikesh@example.com
- GitHub: [github.com/krushikesh-shelar](https://github.com/krushikesh-shelar)

🚩 **Start Solving Smarter, Not Harder!**
