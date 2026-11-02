
const items = [
  ["Runway","Video","AI video creation; free access may be limited.","https://runwayml.com/"],
  ["Pika","Video","AI video generation with plan limits.","https://pika.art/"],
  ["Canva","Image","Graphic design and selected AI features.","https://www.canva.com/"],
  ["Adobe Firefly","Image","AI image tools with limited credits.","https://firefly.adobe.com/"],
  ["ElevenLabs","Audio","AI voice tools with a limited free plan.","https://elevenlabs.io/"],
  ["Suno","Audio","AI music with limited free credits.","https://suno.com/"],
  ["Grammarly","Writing","Writing assistance with free and paid features.","https://grammarly.com/"],
  ["QuillBot","Writing","Paraphrasing with free usage limits.","https://quillbot.com/"],
  ["Notion","Productivity","Workspace with free and paid capabilities.","https://notion.so/"],
  ["Perplexity","Productivity","AI answer and research engine.","https://perplexity.ai/"],
  ["Windsurf","Developer","AI coding editor; check free plan details.","https://windsurf.com/"],
  ["Replit","Developer","Online coding workspace.","https://replit.com/"]
];

const grid = document.querySelector("#toolGrid");
const filter = document.querySelector("#filter");
const search = document.querySelector("#search");

function render() {
  const q = (search?.value || "").toLowerCase();

  grid.innerHTML = items
    .filter(x =>
      (filter.value === "All" || x[1] === filter.value) &&
      x.join(" ").toLowerCase().includes(q)
    )
    .map(x => `
      <article class="tool">
        <small>${x[1]} · Free tier / limits</small>
        <h3>${x[0]}</h3>
        <p>${x[2]}</p>
        <a href="${x[3]}" target="_blank" rel="noopener">
          Official website ↗
        </a>
      </article>
    `).join("") || "<p>No matching tools.</p>";
}

filter.addEventListener("change", render);
search.addEventListener("input", render);

document.querySelectorAll("[data-cat]").forEach(button => {
  button.onclick = () => {
    filter.value = button.dataset.cat;
    render();
    document.querySelector("#tools").scrollIntoView({
      behavior: "smooth"
    });
  };
});

let mode = "signup";

const modal = document.querySelector("#modal");
const msg = document.querySelector("#message");

function auth(m) {
  mode = m;

  document.querySelector("#modalTitle").textContent =
    m === "signup" ? "Create your account" : "Log in to AIVORA";

  const switchText = document.querySelector("#switchText");

  switchText.innerHTML =
    m === "signup" ? "Already have an account? " : "New to AIVORA? ";

  const button = document.createElement("button");
  button.id = "switch";
  button.type = "button";
  button.textContent = m === "signup" ? "Log in" : "Sign up";

  switchText.append(button);

  button.onclick = () =>
    auth(mode === "signup" ? "login" : "signup");

  msg.textContent = "";
  modal.classList.add("open");
}

["signup", "heroSignup", "bottomSignup"].forEach(id => {
  document.getElementById(id).onclick = () => auth("signup");
});

document.querySelector("#login").onclick = () => auth("login");
document.querySelector("#close").onclick = () =>
  modal.classList.remove("open");

let client = null;
const config = window.AIVORA_CONFIG || {};

if (window.supabase && config.url && config.anonKey) {
  client = window.supabase.createClient(
    config.url,
    config.anonKey
  );
}

document.querySelector("#form").onsubmit = async event => {
  event.preventDefault();

  if (!client) {
    msg.textContent =
      "Signup is not connected yet. Configure Supabase using README.md.";
    return;
  }

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const result = mode === "signup"
    ? await client.auth.signUp({ email, password })
    : await client.auth.signInWithPassword({ email, password });

  msg.textContent = result.error
    ? result.error.message
    : mode === "signup"
      ? "Signup request sent. Check your email."
      : "Login successful.";
};

render();
                                                    
