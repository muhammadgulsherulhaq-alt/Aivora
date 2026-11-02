
// ============================================
// AIVORA — COMPLETE WEBSITE JAVASCRIPT
// ============================================

// 50 AI TOOLS DIRECTORY
const items = [
  // VIDEO
  ["Runway", "Video", "AI video creation; free access may be limited.", "https://runwayml.com/"],
  ["Pika", "Video", "AI video generation with plan limits.", "https://pika.art/"],
  ["Kling AI", "Video", "AI video generation; check available credits.", "https://klingai.com/"],
  ["Luma AI", "Video", "AI video and creative generation.", "https://lumalabs.ai/"],
  ["InVideo", "Video", "Online AI video creation.", "https://invideo.io/"],
  ["VEED", "Video", "Online video editing with AI features.", "https://www.veed.io/"],
  ["HeyGen", "Video", "AI avatar and video creation.", "https://www.heygen.com/"],
  ["Synthesia", "Video", "AI avatar video creation.", "https://www.synthesia.io/"],
  ["CapCut", "Video", "Video editing with AI features.", "https://www.capcut.com/"],

  // IMAGE
  ["Canva", "Image", "Graphic design and AI features.", "https://www.canva.com/"],
  ["Adobe Firefly", "Image", "AI image generation and editing.", "https://firefly.adobe.com/"],
  ["Leonardo AI", "Image", "AI image generation.", "https://leonardo.ai/"],
  ["Ideogram", "Image", "AI image generation and text rendering.", "https://ideogram.ai/"],
  ["Microsoft Designer", "Image", "AI-powered design and image creation.", "https://designer.microsoft.com/"],
  ["Krea AI", "Image", "AI image generation and creative tools.", "https://www.krea.ai/"],
  ["NightCafe", "Image", "AI art generation.", "https://nightcafe.studio/"],
  ["Playground", "Image", "AI image creation and editing.", "https://playground.com/"],
  ["remove.bg", "Image", "AI background removal.", "https://www.remove.bg/"],

  // AUDIO
  ["ElevenLabs", "Audio", "AI voice generation with limited free usage.", "https://elevenlabs.io/"],
  ["Suno", "Audio", "AI music generation with limited credits.", "https://suno.com/"],
  ["Udio", "Audio", "AI music creation.", "https://www.udio.com/"],
  ["Adobe Podcast", "Audio", "AI audio enhancement tools.", "https://podcast.adobe.com/"],
  ["Murf AI", "Audio", "AI voiceovers and text-to-speech.", "https://murf.ai/"],
  ["TTSMaker", "Audio", "Text-to-speech generation.", "https://ttsmaker.com/"],
  ["Auphonic", "Audio", "Automated audio post-production.", "https://auphonic.com/"],
  ["Descript", "Audio", "Audio and video editing with AI.", "https://www.descript.com/"],

  // WRITING
  ["Grammarly", "Writing", "Writing assistance with free and paid features.", "https://grammarly.com/"],
  ["QuillBot", "Writing", "Paraphrasing and writing assistance.", "https://quillbot.com/"],
  ["DeepL Write", "Writing", "AI writing improvement.", "https://www.deepl.com/write"],
  ["Wordtune", "Writing", "Writing and rewriting assistance.", "https://www.wordtune.com/"],
  ["Rytr", "Writing", "AI writing assistant.", "https://rytr.me/"],
  ["Copy.ai", "Writing", "AI writing and content workflows.", "https://www.copy.ai/"],
  ["Writesonic", "Writing", "AI writing and content creation.", "https://writesonic.com/"],
  ["LanguageTool", "Writing", "Grammar and spelling checker.", "https://languagetool.org/"],

  // PRODUCTIVITY
  ["ChatGPT", "Productivity", "AI assistant for everyday tasks.", "https://chatgpt.com/"],
  ["Google Gemini", "Productivity", "Google's AI assistant.", "https://gemini.google.com/"],
  ["Claude", "Productivity", "AI assistant for writing and analysis.", "https://claude.ai/"],
  ["Perplexity", "Productivity", "AI-powered research and answers.", "https://perplexity.ai/"],
  ["Notion", "Productivity", "Workspace with AI features.", "https://notion.so/"],
  ["NotebookLM", "Productivity", "AI research assistant for your sources.", "https://notebooklm.google.com/"],
  ["Gamma", "Productivity", "AI presentations and documents.", "https://gamma.app/"],
  ["Otter.ai", "Productivity", "AI meeting transcription and notes.", "https://otter.ai/"],

  // DEVELOPER
  ["Windsurf", "Developer", "AI coding editor.", "https://windsurf.com/"],
  ["Replit", "Developer", "Online coding workspace with AI features.", "https://replit.com/"],
  ["Cursor", "Developer", "AI-powered code editor.", "https://cursor.com/"],
  ["GitHub Copilot", "Developer", "AI coding assistant.", "https://github.com/features/copilot"],
  ["Bolt", "Developer", "AI-powered app and website builder.", "https://bolt.new/"],
  ["Lovable", "Developer", "AI-powered website and app builder.", "https://lovable.dev/"],
  ["v0", "Developer", "AI interface and web app generation.", "https://v0.app/"]
];

// ============================================
// SEARCH AND CATEGORY FILTER
// ============================================

const grid = document.querySelector("#toolGrid");
const filter = document.querySelector("#filter");
const search = document.querySelector("#search");

function renderTools() {
  if (!grid) return;

  const query = (search?.value || "").trim().toLowerCase();
  const category = filter?.value || "All";

  const filtered = items.filter(item => {
    const matchesCategory =
      category === "All" || item[1] === category;

    const matchesSearch =
      item.join(" ").toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = filtered.map(item => `
    <article class="tool">
      <small>${item[1]} · Check free-plan limits</small>
      <h3>${item[0]}</h3>
      <p>${item[2]}</p>
      <a href="${item[3]}" target="_blank" rel="noopener noreferrer">
        Official website ↗
      </a>
    </article>
  `).join("") || "<p>No matching tools found.</p>";
}

filter?.addEventListener("change", renderTools);
search?.addEventListener("input", renderTools);

// Category buttons
document.querySelectorAll("[data-cat]").forEach(button => {
  button.addEventListener("click", () => {
    if (!filter) return;

    filter.value = button.dataset.cat;
    renderTools();

    document.querySelector("#tools")?.scrollIntoView({
      behavior: "smooth"
    });
  });
});

// ============================================
// SUPABASE CONNECTION
// ============================================

let client = null;

const config = window.AIVORA_CONFIG || {};

const supabaseUrl = (config.url || "")
  .trim()
  .replace(/\/+$/, "");

const supabaseKey = (config.anonKey || "").trim();

if (
  window.supabase &&
  supabaseUrl &&
  supabaseKey
) {
  try {
    client = window.supabase.createClient(
      supabaseUrl,
      supabaseKey
    );
  } catch (error) {
    console.error("Supabase setup error:", error);
  }
}

// ============================================
// LOGIN AND SIGNUP
// ============================================

let mode = "signup";

const modal = document.querySelector("#modal");
const message = document.querySelector("#message");
const form = document.querySelector("#form");

function showMessage(text, type = "error") {
  if (!message) return;

  message.textContent = text;
  message.style.color =
    type === "success" ? "#22c55e" : "#ff6464";
}

function openAuth(selectedMode) {
  mode = selectedMode;

  const title = document.querySelector("#modalTitle");
  const switchText = document.querySelector("#switchText");

  if (!modal || !title || !switchText) return;

  title.textContent =
    mode === "signup"
      ? "Create your account"
      : "Log in to AIVORA";

  switchText.innerHTML = "";

  const label = document.createElement("span");
  label.textContent =
    mode === "signup"
      ? "Already have an account? "
      : "New to AIVORA? ";

  const switchButton = document.createElement("button");
  switchButton.type = "button";
  switchButton.textContent =
    mode === "signup" ? "Log in" : "Sign up";

  switchButton.addEventListener("click", () => {
    openAuth(mode === "signup" ? "login" : "signup");
  });

  switchText.append(label, switchButton);

  showMessage("");
  modal.classList.add("open");
}

// Signup buttons
["signup", "heroSignup", "bottomSignup"].forEach(id => {
  document.getElementById(id)?.addEventListener("click", () => {
    openAuth("signup");
  });
});

// Login button
document.querySelector("#login")?.addEventListener("click", () => {
  openAuth("login");
});

// Close button
document.querySelector("#close")?.addEventListener("click", () => {
  modal?.classList.remove("open");
});

// ============================================
// AUTHENTICATION FORM
// ============================================

form?.addEventListener("submit", async event => {
  event.preventDefault();

  if (!client) {
    showMessage(
      "Connection unavailable. Please check Supabase configuration."
    );
    return;
  }

  const email =
    document.querySelector("#email")?.value.trim();

  const password =
    document.querySelector("#password")?.value;

  if (!email || !password) {
    showMessage("Please enter your email and password.");
    return;
  }

  const submitButton =
    form.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Please wait...";
  }

  showMessage("Connecting...", "success");

  try {
    let result;

    if (mode === "signup") {
      result = await client.auth.signUp({
        email,
        password
      });
    } else {
      result = await client.auth.signInWithPassword({
        email,
        password
      });
    }

    if (result.error) {
      throw result.error;
    }

    if (mode === "signup") {
      showMessage(
        "Signup request successful! Check your email if confirmation is required.",
        "success"
      );
    } else {
      showMessage("Login successful!", "success");
    }

  } catch (error) {
    console.error("Authentication error:", error);

    showMessage(
      error.message || "Something went wrong. Please try again."
    );

  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Continue";
    }
  }
});

// ============================================
// START WEBSITE
// ============================================

renderTools();

console.log("AIVORA loaded successfully.");
console.log("Total AI tools:", items.length);
    
