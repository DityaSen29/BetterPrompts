# BetterPrompts 🚀

**BetterPrompts** is a lightweight, privacy-focused Chrome Extension that effortlessly transforms your messy brain-dumps into highly structured, professional prompts for Large Language Models (LLMs). It runs entirely in your browser using your own personal Google Gemini API Key.

Instead of struggling to format your thoughts or writing out repetitive prompt instructions (like "Act as an expert..." or "Format as JSON..."), you can simply paste your raw ideas, and BetterPrompts will do the heavy lifting for you!

## ✨ Features
- **Local & Secure:** Your API key and drafts never touch a 3rd-party backend. It's stored securely in your browser's local storage and routes directly to Google's Gemini API.
- **5 Custom Output Formats:** Force the final prompt to instruct the target LLM to output exactly what you need: `Standard`, `JSON`, `XML`, `Table`, or `Bullets`.
- **Keyboard Shortcut Ready:** Press `Alt+P` (or `Command+Shift+U` on Mac) to instantly pop open the extension anywhere on the web.
- **One-Click Copy:** Easily copy your freshly engineered prompt directly to your clipboard.

## 🚀 Installation (from GitHub)
Since this extension is not yet published on the Chrome Web Store, you can run it directly from this repository by loading it as an "Unpacked Extension."

1. **Download the Repository**
   - Click the green `<> Code` button at the top of this GitHub repository and select **Download ZIP**.
   - Extract the `.zip` file into a folder on your computer. 
   - *(Alternatively, you can clone the repository via Git: `git clone https://github.com/DityaSen29/BetterPrompts.git`)*

2. **Load into Chrome**
   - Open Google Chrome and type `chrome://extensions` into your URL bar.
   - Look at the top right corner and turn on the **Developer mode** toggle.
   - Click the **Load unpacked** button that appears in the top-left menu.
   - Select the folder that contains the extracted files (make sure you pick the folder that directly contains the `manifest.json` file).

3. **Pin the Extension**
   - Click the puzzle piece icon (🧩) in the top-right of your Chrome toolbar.
   - Click the Pin icon (📌) next to "BetterPrompts" so it's always accessible.

## ⚙️ Configuration
BetterPrompts works by directly utilizing the Google Gemini API (specifically the lightning-fast `gemini-2.5-flash` model). For this, you need a free API key.

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Create API key** and copy it to your clipboard.
4. Click the **BetterPrompts** icon in your Chrome toolbar.
5. You'll be prompted to enter your API key. Paste it in securely and hit **Save**.

## 💡 How to Use
1. **Brain-Dump:** Open the extension and paste your unformatted thoughts, context, or raw instructions into the textbox.
2. **Select Format:** Choose how you want the target LLM to eventually structure its answer (e.g., if you are building an API integration, select `JSON`).
3. **Refine:** Click **Refine Prompt**. BetterPrompts will intelligently generate a structured prompt using best-practice prompt-engineering headers (Role, Context, Task, Constraints).
4. **Copy & Paste:** Click the Copy icon in the corner and paste your optimized prompt into ChatGPT, Claude, Gemini, or any other LLM interface!

## 🔒 Privacy & Architecture
**Zero Server Backend:** This extension operates entirely over Client-Side JavaScript. When you send a draft to be refined, the HTTP request is dispatched natively from your browser directly to Google's servers. 
**Chrome Storage:** Your API key is utilizing Chromium's `chrome.storage.local` API.

---

*Happy Prompting!*
