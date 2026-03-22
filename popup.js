document.addEventListener('DOMContentLoaded', () => {
  const settingsBtn = document.getElementById('settingsBtn');
  const draftInput = document.getElementById('draftInput');
  const outputArea = document.getElementById('outputArea');
  const refineBtn = document.getElementById('refineBtn');
  const copyBtn = document.getElementById('copyBtn');

  const setupContainer = document.getElementById('setupContainer');
  const appContainer = document.getElementById('appContainer');
  const openSetupBtn = document.getElementById('openSetupBtn');

  // Initialization: Check for API key and determine view
  function checkSetupStatus() {
    chrome.storage.local.get(['geminiApiKey'], (result) => {
      if (!result.geminiApiKey) {
        // Show setup screen
        setupContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
      } else {
        // Show main app
        setupContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        draftInput.focus();
      }
    });
  }

  // Run on load
  checkSetupStatus();

  // Listen for storage changes so the popup updates reactively if they add the key
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.geminiApiKey) {
      checkSetupStatus();
    }
  });

  // Open Options manually via gear icon or setup button
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  openSetupBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Copy to Clipboard Logic
  copyBtn.addEventListener('click', async () => {
    if (!outputArea.value) return;
    try {
      await navigator.clipboard.writeText(outputArea.value);

      // Visual feedback
      copyBtn.classList.add('copied');
      const originalSVG = copyBtn.innerHTML;
      copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = originalSVG;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  });

  // Main Refine Button Logic & API Call
  refineBtn.addEventListener('click', async () => {
    const draftText = draftInput.value.trim();

    if (!draftText) {
      draftInput.focus();
      // Add a brief error animation class (if we had one) or just an alert for simplicity
      draftInput.style.borderColor = 'var(--error)';
      setTimeout(() => draftInput.style.borderColor = '', 1000);
      return;
    }

    const selectedFormat = document.querySelector('input[name="format"]:checked').value;

    chrome.storage.local.get(['geminiApiKey'], async (result) => {
      const apiKey = result.geminiApiKey;

      if (!apiKey) {
        checkSetupStatus();
        return;
      }

      // UI state transition
      const originalBtnContent = refineBtn.innerHTML;
      refineBtn.disabled = true;
      refineBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Refining...';
      outputArea.value = "";
      outputArea.placeholder = "Generating optimal syntax...";

      // Prompt Engineering Logic
      let formatInstruction = "Ensure the output is highly readable and well-structured markdown.";
      if (selectedFormat === 'json') formatInstruction = "Instruct the target LLM to output its response strictly in valid JSON format without markdown wrapping.";
      else if (selectedFormat === 'xml') formatInstruction = "Instruct the target LLM to output its response strictly in valid XML format.";
      else if (selectedFormat === 'table') formatInstruction = "Instruct the target LLM to present its output strictly as a Markdown table.";
      else if (selectedFormat === 'bullets') formatInstruction = "Instruct the target LLM to present its output strictly as a concise bulleted list.";

      const engineeredPrompt = `You are an expert prompt engineer. Your ONLY job is to take the user's messy draft and transform it into a highly optimized, professional prompt for an LLM.

CRITICAL INSTRUCTIONS:
1. NEVER output conversational filler (e.g., do not say "Here is your prompt", "Okay", or "Sure"). 
2. Output ONLY the finalized prompt itself.
3. Ensure the prompt is highly actionable, clear, and unambiguous.
4. If the user's draft is too vague or missing crucial context, insert placeholder brackets (e.g., [Insert Context Here]) so the user knows what they need to fill in.
5. Structure the prompt clearly using the following headers (omit headers if irrelevant to the specific request):
   - ROLE: [Who the AI should act as]
   - CONTEXT: [Background information]
   - TASK: [The specific action the AI needs to take]
   - CONSTRAINTS: [Rules the AI must follow]
   - FORMATTING: ${formatInstruction}

USER'S MESSY DRAFT:
"""
${draftText}
"""`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: engineeredPrompt }] }],
            generationConfig: {
              temperature: 0.2
            }
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "API request failed");
        }

        const refinedText = data.candidates[0].content.parts[0].text;
        outputArea.value = refinedText.trim();

      } catch (error) {
        outputArea.value = `Error generating prompt:\n${error.message}\n\nPlease verify your API key and connection.`;
      } finally {
        refineBtn.disabled = false;
        refineBtn.innerHTML = originalBtnContent;
      }
    });
  });

  // Inject a small spin keyframe dynamically if not in css
  const style = document.createElement('style');
  style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
});