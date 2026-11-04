
// ============================================
// AIVORA — WEBSITE JAVASCRIPT
// ============================================

// AI TOOLS DIRECTORY
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
  ["Zapier", "Productivity", "Workflow automation with AI features.", "https://zapier.com/"],

  // DEVELOPER
  ["Windsurf", "Developer", "AI coding editor.", "https://windsurf.com/"],
  ["Replit", "Developer", "Online coding workspace with AI.", "https://replit.com/"],
  ["Cursor", "Developer", "AI-powered code editor.", "https://cursor.com/"],
  ["GitHub Copilot", "Developer", "AI coding assistant.", "https://github.com/features/copilot"],
  ["Bolt", "Developer", "AI-powered app and website builder.", "https://bolt.new/"],
  ["Lovable", "Developer", "AI-powered website and app builder.", "https://lovable.dev/"],
  ["v0", "Developer", "AI interface and web app generation.", "https://v0.app/"]
];

// ============================================
// SEARCH AND FILTER
// ============================================

const grid = document.querySelector("#toolGrid");
const filter = document.querySelector("#filter");
const search = document.querySelector("#search");

function renderTools() {
  if (!grid) return;

  const query = (search?.value || "").trim().toLowerCase();
  const category = filter?.value || "All";

  const filtered = items.filter(item =>
    (category === "All" || item[1] === category) &&
    item.join(" ").toLowerCase().includes(query)
  );

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
let currentUser = null;
let mode = "signup";
let studioAuthIntent = false;

const config = window.AIVORA_CONFIG || {};
const supabaseUrl = (config.url || "").trim().replace(/\/+$/, "");
const supabaseKey = (config.anonKey || "").trim();

if (window.supabase && supabaseUrl && supabaseKey) {
  try {
    client = window.supabase.createClient(
      supabaseUrl,
      supabaseKey
    );
  } catch (error) {
    console.error("Supabase error:", error);
  }
}

// ============================================
// AUTH ELEMENTS
// ============================================

const modal = document.querySelector("#modal");
const message = document.querySelector("#message");
const form = document.querySelector("#form");

function showMessage(text, type = "error") {
  if (!message) return;

  message.textContent = text;
  message.style.color =
    type === "success" ? "#22c55e" : "#ff6464";
}

function closeAuth() {
  modal?.classList.remove("open");
}

function openAuth(selectedMode, fromStudio = false) {
  mode = selectedMode;

  if (fromStudio) {
    studioAuthIntent = true;
  }

  const title = document.querySelector("#modalTitle");
  const switchText = document.querySelector("#switchText");

  if (!modal || !title || !switchText) return;

  title.textContent =
    mode === "signup"
      ? "Create your free AIVORA account"
      : "Log in to AIVORA";

  switchText.replaceChildren();

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

  form?.reset();
  showMessage("");
  modal.classList.add("open");
}

// ============================================
// HEADER ACCOUNT STATUS
// ============================================

const nav = document.querySelector("header nav");
const loginButton = document.querySelector("#login");
const signupButton = document.querySelector("#signup");

const accountLabel = document.createElement("span");
accountLabel.id = "accountLabel";
accountLabel.style.cssText =
  "color:#a78bfa;font-size:13px;max-width:150px;overflow:hidden;text-overflow:ellipsis;";

const logoutButton = document.createElement("button");
logoutButton.id = "logout";
logoutButton.type = "button";
logoutButton.textContent = "Log out";
logoutButton.style.display = "none";

nav?.append(accountLabel, logoutButton);

function updateAccount(user) {
  currentUser = user || null;

  const prompt = document.querySelector("#videoPrompt");
  const generateButton = document.querySelector("#generateConcept");

  if (prompt) {
    prompt.readOnly = !currentUser;
    prompt.placeholder = currentUser
      ? "Describe your video idea or paste your script here..."
      : "Sign up or log in to start typing your video idea...";
  }

  if (generateButton) {
    generateButton.textContent = currentUser
      ? "✦ Prepare Video Brief"
      : "✦ Sign Up to Continue";
  }

  if (currentUser) {
    accountLabel.textContent = currentUser.email || "My account";
    accountLabel.style.display = "inline";
    logoutButton.style.display = "inline-block";
    loginButton && (loginButton.style.display = "none");
    signupButton && (signupButton.style.display = "none");
  } else {
    accountLabel.textContent = "";
    accountLabel.style.display = "none";
    logoutButton.style.display = "none";
    loginButton && (loginButton.style.display = "");
    signupButton && (signupButton.style.display = "");
  }
}

// ============================================
// AIVORA AI VIDEO STUDIO
// ============================================

const videoPrompt = document.querySelector("#videoPrompt");
const generateConcept = document.querySelector("#generateConcept");
const studioMessage = document.querySelector("#studioMessage");
const promptCount = document.querySelector("#promptCount");

function showStudioMessage(text) {
  if (!studioMessage) return;
  studioMessage.textContent = text;
  studioMessage.classList.add("show");
}

function hideStudioMessage() {
  studioMessage?.classList.remove("show");
}

function updatePromptCount() {
  if (!videoPrompt || !promptCount) return;
  promptCount.textContent =
    `${videoPrompt.value.length} / 5000`;
}

// Visitors cannot type before authentication.
videoPrompt?.addEventListener("click", () => {
  if (!currentUser) {
    openAuth("signup", true);
  }
});

videoPrompt?.addEventListener("focus", () => {
  if (!currentUser) {
    videoPrompt.blur();
    openAuth("signup", true);
  }
});

videoPrompt?.addEventListener("input", () => {
  updatePromptCount();
  hideStudioMessage();
});

generateConcept?.addEventListener("click", () => {
  if (!currentUser) {
    openAuth("signup", true);
    return;
  }

  const prompt = videoPrompt?.value.trim();

  if (!prompt) {
    showStudioMessage("Please enter your video topic or script first.");
    videoPrompt?.focus();
    return;
  }

  const duration =
    document.querySelector("#videoDuration")?.value;

  const ratio =
    document.querySelector("#videoRatio")?.value;

  const style =
    document.querySelector("#videoStyle")?.value;

  const resolution =
    document.querySelector("#videoResolution")?.value;

  showStudioMessage(
    `Your video brief is ready!\n\n` +
    `Topic: ${prompt}\n` +
    `Duration: ${duration}\n` +
    `Aspect ratio: ${ratio}\n` +
    `Style: ${style}\n` +
    `Resolution: ${resolution}\n\n` +
    `This is a saved-on-screen preview only. Actual AI video generation is not connected yet.`
  );
});

// ============================================
// LOGOUT
// ============================================

logoutButton.addEventListener("click", async () => {
  if (!client) return;

  logoutButton.disabled = true;
  logoutButton.textContent = "Logging out...";

  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;

    updateAccount(null);
    closeAuth();
    studioAuthIntent = false;
    hideStudioMessage();

  } catch (error) {
    console.error(error);
    alert(error.message || "Logout failed. Please try again.");
  } finally {
    logoutButton.disabled = false;
    logoutButton.textContent = "Log out";
  }
});

// ============================================
// OPEN AND CLOSE AUTH
// ============================================

["signup", "heroSignup", "bottomSignup"].forEach(id => {
  document.getElementById(id)?.addEventListener("click", () => {
    if (currentUser) {
      alert("You are already logged in to AIVORA.");
    } else {
      openAuth("signup");
    }
  });
});

loginButton?.addEventListener("click", () => openAuth("login"));

document.querySelector("#close")?.addEventListener("click", closeAuth);

modal?.addEventListener("click", event => {
  if (event.target === modal) closeAuth();
});

// ============================================
// SIGNUP AND LOGIN
// ============================================

form?.addEventListener("submit", async event => {
  event.preventDefault();

  if (!client) {
    showMessage("Connection unavailable. Check Supabase configuration.");
    return;
  }

  const email = document.querySelector("#email")?.value.trim();
  const password = document.querySelector("#password")?.value;

  if (!email || !password) {
    showMessage("Please enter your email and password.");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must contain at least 6 characters.");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

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
        password,
        options: {
          emailRedirectTo:
            "https://muhammadgulsherulhaq-alt.github.io/Aivora/"
        }
      });
    } else {
      result = await client.auth.signInWithPassword({
        email,
        password
      });
    }

    if (result.error) throw result.error;

    if (mode === "signup") {
      if (result.data.session) {
        updateAccount(result.data.user);
        closeAuth();

        if (studioAuthIntent) {
          studioAuthIntent = false;
          showStudioMessage(
            "Welcome to AIVORA! Your Video Studio is now unlocked. Enter your video topic or script."
          );
          videoPrompt?.focus();
        } else {
          window.location.href = "dashboard.html";
        }

      } else {
        showMessage(
          "Signup successful! Please verify your email, then log in to unlock AI Studio.",
          "success"
        );
      }

    } else {
      updateAccount(result.data.user);
      closeAuth();

      if (studioAuthIntent) {
        studioAuthIntent = false;
        showStudioMessage(
          "Welcome back! Your Video Studio is now unlocked. Enter your video topic or script."
        );
        videoPrompt?.focus();
      } else {
        window.location.href = "dashboard.html";
      }
    }

  } catch (error) {
    console.error("Authentication error:", error);
    showMessage(error.message || "Something went wrong. Please try again.");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Continue";
    }
  }
});

// ============================================
// RESTORE EXISTING SESSION
// ============================================

async function initializeAuth() {
  if (!client) {
    console.error("Supabase client unavailable.");
    return;
  }

  try {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;

    updateAccount(data.session?.user || null);

    client.auth.onAuthStateChange((event, session) => {
      updateAccount(session?.user || null);
      console.log("AIVORA auth event:", event);
    });

  } catch (error) {
    console.error("Session error:", error);
  }
}

// ============================================
// START WEBSITE
// ============================================

renderTools();
updatePromptCount();
initializeAuth();

console.log("AIVORA loaded successfully.");
console.log("Total AI tools:", items.length);
  
