
const items = [
  ["Runway", "Video", "AI video creation; free access may be limited.", "https://runwayml.com/"],
  ["Pika", "Video", "AI video generation with plan limits.", "https://pika.art/"],
  ["Canva", "Image", "Graphic design and selected AI features.", "https://www.canva.com/"],
  ["Adobe Firefly", "Image", "AI image tools with limited credits.", "https://firefly.adobe.com/"],
  ["ElevenLabs", "Audio", "AI voice tools with a limited free plan.", "https://elevenlabs.io/"],
  ["Suno", "Audio", "AI music with limited free credits.", "https://suno.com/"],
  ["Grammarly", "Writing", "Writing assistance with free and paid features.", "https://grammarly.com/"],
  ["QuillBot", "Writing", "Paraphrasing with free usage limits.", "https://quillbot.com/"],
  ["Notion", "Productivity", "Workspace with free and paid capabilities.", "https://notion.so/"],
  ["Perplexity", "Productivity", "AI answer and research engine.", "https://perplexity.ai/"],
  ["Windsurf", "Developer", "AI coding editor; check free plan details.", "https://windsurf.com/"],
  ["Replit", "Developer", "Online coding workspace.", "https://replit.com/"]
];

// =====================================
// DIRECTORY SEARCH & FILTER
// =====================================

const grid = document.querySelector("#toolGrid");
const filter = document.querySelector("#filter");
const search = document.querySelector("#search");

function renderTools() {
  if (!grid || !filter || !search) return;

  const query = search.value.trim().toLowerCase();

  const filteredItems = items.filter(item => {
    const categoryMatch =
      filter.value === "All" || item[1] === filter.value;

    const searchMatch =
      item.join(" ").toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  grid.innerHTML = filteredItems.map(item => `
    <article class="tool">
      <small>${item[1]} · Free tier / limits</small>
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

// =====================================
// SUPABASE CONNECTION
// =====================================

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
    console.error("Supabase initialization error:", error);
  }
}

// =====================================
// LOGIN & SIGNUP MODAL
// =====================================

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

  const text = document.createElement("span");
  text.textContent =
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

  switchText.append(text, switchButton);

  showMessage("");
  modal.classList.add("open");
}

// Open signup
["signup", "heroSignup", "bottomSignup"].forEach(id => {
  document.getElementById(id)?.addEventListener("click", () => {
    openAuth("signup");
  });
});

// Open login
document.querySelector("#login")?.addEventListener("click", () => {
  openAuth("login");
});

// Close modal
document.querySelector("#close")?.addEventListener("click", () => {
  modal?.classList.remove("open");
});

// =====================================
// SUPABASE AUTHENTICATION
// =====================================

form?.addEventListener("submit", async event => {
  event.preventDefault();

  if (!client) {
    showMessage(
      "Connection unavailable. Please check the Supabase configuration."
    );
    return;
  }

  const email = document.querySelector("#email")?.value.trim();
  const password = document.querySelector("#password")?.value;

  if (!email || !password) {
    showMessage("Please enter your email and password.");
    return;
  }

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

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
        "Account request successful! Check your email if confirmation is required.",
        "success"
      );
    } else {
      showMessage(
        "Login successful!",
        "success"
      );
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

// =====================================
// INITIALIZE WEBSITE
// =====================================

renderTools();
