// script.js — unified front-end (auth + theme + run + saved codes + profile + history + settings fix)

document.addEventListener("DOMContentLoaded", () => {
  // ========== AUTH CHECK ==========
  const path = location.pathname.split("/").pop();
  const currentUser = localStorage.getItem("loggedInUser");

  if ((path === "index.html" || path === "") && !currentUser) {
    location.href = "login.html";
    return;
  }

  if (path === "login.html" && currentUser) {
    location.href = "index.html";
    return;
  }

  // ========== THEME ==========
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;
  let savedTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.remove("light", "dark");
  document.body.classList.add(savedTheme);
  if (themeIcon)
    themeIcon.className = savedTheme === "light" ? "fas fa-moon" : "fas fa-sun";

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.add("fade-transition");
      document.body.classList.toggle("light");
      document.body.classList.toggle("dark");
      const active = document.body.classList.contains("light") ? "light" : "dark";
      localStorage.setItem("theme", active);
      if (themeIcon)
        themeIcon.className = active === "light" ? "fas fa-moon" : "fas fa-sun";
      setTimeout(() => document.body.classList.remove("fade-transition"), 400);
    });
  }

  // ========== PROFILE ==========
  const profileIcon = document.getElementById("profileIcon");
  const profileDropdown = document.getElementById("profileDropdown");

  function renderProfileDropdown() {
    if (!profileDropdown) return;
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      profileDropdown.innerHTML = '<div style="padding:12px">Not logged in</div>';
      return;
    }
    profileDropdown.innerHTML = `
      <div style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.03);">
        <div style="font-size:13px; color:#79c0ff">Signed in as</div>
        <div style="font-weight:700; margin-top:6px">${user}</div>
      </div>
      <ul style="list-style:none;margin:0;padding:0">
        <li id="openSavedCodes" style="padding:10px 14px;cursor:pointer;display:flex;gap:8px;align-items:center;">
          <i class="fas fa-save" style="width:18px;color:#58a6ff"></i> Saved Codes
        </li>
        <li id="openSettings" style="padding:10px 14px;cursor:pointer;display:flex;gap:8px;align-items:center;">
          <i class="fas fa-cog" style="width:18px;color:#58a6ff"></i> Settings
        </li>
        <li id="doLogout" style="padding:10px 14px;cursor:pointer;display:flex;gap:8px;align-items:center;">
          <i class="fas fa-right-from-bracket" style="width:18px;color:#58a6ff"></i> Logout
        </li>
      </ul>
    `;

    const openSavedCodes = document.getElementById("openSavedCodes");
    const openSettings = document.getElementById("openSettings");
    const doLogout = document.getElementById("doLogout");

    if (openSavedCodes) openSavedCodes.addEventListener("click", showSavedCodesModal);
    if (openSettings)
      openSettings.addEventListener("click", () =>
        settingsModal.classList.remove("hidden")
      );
    if (doLogout)
      doLogout.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        location.href = "login.html";
      });
  }

  if (profileIcon && profileDropdown) {
    profileIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".profile-container")) {
        profileDropdown.classList.add("hidden");
      }
    });
    renderProfileDropdown();
  }

  // ========== SAVED CODES ==========
  function getSavedKey() {
    const u = localStorage.getItem("loggedInUser");
    return u ? `rz_saved_${u}` : "rz_saved_guest";
  }

  function saveCurrentCode() {
    const codeArea = document.getElementById("codeArea");
    const langTitle = document.getElementById("lang-title");
    if (!codeArea) {
      alert("Editor not found");
      return;
    }
    const code = codeArea.value.trim();
    const lang = langTitle
      ? langTitle.textContent.replace("Language: ", "")
      : "unknown";
    if (!code) {
      alert("Please write code before saving");
      return;
    }
    let arr = JSON.parse(localStorage.getItem(getSavedKey()) || "[]");
    arr.unshift({ code, lang, date: new Date().toLocaleString() });
    if (arr.length > 50) arr.length = 50;
    localStorage.setItem(getSavedKey(), JSON.stringify(arr));
    alert("✅ Code saved successfully!");
  }

  function showSavedCodesModal() {
    const arr = JSON.parse(localStorage.getItem(getSavedKey()) || "[]");
    if (!arr.length) {
      alert("No saved codes found.");
      return;
    }
    const html = arr
      .map(
        (s, i) => `
      <div class="scard" data-index="${i}" style="border-radius:8px;padding:10px;margin-bottom:8px;background:rgba(255,255,255,0.02);">
        <div style="font-size:13px;color:#79c0ff">[${s.lang}] ${s.date}</div>
        <pre style="white-space:pre-wrap;margin:8px 0;font-size:13px;">${escapeHtml(
          s.code.slice(0, 400)
        )}${s.code.length > 400 ? "..." : ""}</pre>
        <div style="display:flex;gap:8px">
          <button class="loadBtn" data-i="${i}" style="padding:6px 8px;border-radius:6px;border:none;background:#238636;color:#fff">Load</button>
          <button class="deleteBtn" data-i="${i}" style="padding:6px 8px;border-radius:6px;border:none;background:#da3633;color:#fff">Delete</button>
        </div>
      </div>`
      )
      .join("");
    savedModalContent.innerHTML = `<h3>Saved Codes</h3>${html}`;
    savedModal.classList.remove("hidden");

    Array.from(savedModalContent.querySelectorAll(".loadBtn")).forEach((b) => {
      b.addEventListener("click", () => {
        const idx = +b.dataset.i;
        const arr2 = JSON.parse(localStorage.getItem(getSavedKey()) || "[]");
        const item = arr2[idx];
        if (item) {
          document.getElementById("codeArea").value = item.code;
          document.getElementById(
            "lang-title"
          ).textContent = `Language: ${item.lang}`;
          savedModal.classList.add("hidden");
          alert("✅ Loaded saved code into editor.");
        }
      });
    });

    Array.from(savedModalContent.querySelectorAll(".deleteBtn")).forEach((b) => {
      b.addEventListener("click", () => {
        const idx = +b.dataset.i;
        let arr2 = JSON.parse(localStorage.getItem(getSavedKey()) || "[]");
        arr2.splice(idx, 1);
        localStorage.setItem(getSavedKey(), JSON.stringify(arr2));
        showSavedCodesModal();
      });
    });
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ========== SETTINGS MODAL ==========
  const settingsModal = document.createElement("div");
  settingsModal.id = "settingsModal";
  settingsModal.className = "modal hidden";
  settingsModal.innerHTML = `
    <div class="modal-content">
      <h3>Settings</h3>
      <div style="text-align:left;margin-top:8px">
        <label>Editor font size:
          <input id="settingFontSize" type="number" min="12" max="24" value="15" style="width:70px;margin-left:8px">
        </label>
        <div style="height:12px"></div>
        <label><input id="autoSaveToggle" type="checkbox"> Enable Auto-save on run</label>
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end">
        <button id="closeSettingsBtn" class="btn">Close</button>
      </div>
    </div>`;
  document.body.appendChild(settingsModal);

  const savedModal = document.createElement("div");
  savedModal.id = "savedModal";
  savedModal.className = "modal hidden";
  savedModal.innerHTML = `<div class="modal-content"><div id="savedModalContent"></div><div style="text-align:right;margin-top:10px"><button id="closeSavedBtn" class="btn">Close</button></div></div>`;
  document.body.appendChild(savedModal);
  const savedModalContent = document.getElementById("savedModalContent");

  // 🎛️ Settings handlers (font size + checkbox)
  document.body.addEventListener("input", (e) => {
    if (e.target.id === "settingFontSize") {
      const size = e.target.value;
      const codeArea = document.getElementById("codeArea");
      if (codeArea) {
        codeArea.style.fontSize = size + "px";
        localStorage.setItem("rz_font_size", size);
      }
    }
    if (e.target.id === "autoSaveToggle") {
      localStorage.setItem("rz_auto_save", e.target.checked ? "1" : "0");
    }
  });

  const savedFontSize = localStorage.getItem("rz_font_size");
  if (savedFontSize && document.getElementById("codeArea")) {
    document.getElementById("codeArea").style.fontSize = savedFontSize + "px";
  }

  // 🩵 Modal styling fix
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 2000; display: none; }
.modal:not(.hidden) { display: flex; align-items: center; justify-content: center; }
.modal .modal-content { background: #161b22; padding: 20px 25px; border-radius: 12px; color: #e6edf3; min-width: 320px; max-width: 400px; box-shadow: 0 8px 30px rgba(0,0,0,0.6); animation: modalPop 0.25s ease; }
body.light .modal .modal-content { background: #eaf4ff; color: #07203a; }
.btn { background: #238636; border: none; color: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer; transition: 0.2s ease; }
.btn:hover { background: #2ea043; }
@keyframes modalPop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`;
  document.head.appendChild(styleTag);

  document.body.addEventListener("click", (e) => {
    if (e.target.id === "closeSettingsBtn") settingsModal.classList.add("hidden");
    if (e.target.id === "closeSavedBtn") savedModal.classList.add("hidden");
  });

  // ========== RUN HISTORY ==========
  const historyBtn = document.getElementById("historyBtn");
  const historyDropdown = document.getElementById("historyDropdown");
  const historyList = document.getElementById("historyList");
  let runHistory = JSON.parse(localStorage.getItem("run_history") || "[]");

  function updateHistoryUI() {
    if (!historyList) return;
    if (runHistory.length === 0) {
      historyList.innerHTML = "<li>No runs yet.</li>";
      return;
    }
    historyList.innerHTML = runHistory
      .map(
        (item) =>
          `<li><b>[${item.lang.toUpperCase()}]</b> ${escapeHtml(
            item.preview
          )} <br><small style="color:gray">${item.time}</small></li>`
      )
      .join("");
  }

  if (historyBtn) {
    historyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      historyDropdown.classList.toggle("hidden");
      updateHistoryUI();
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".history-container"))
        historyDropdown.classList.add("hidden");
    });
  }

  // ========== LANGUAGE + RUN ==========
  const sidebarIcons = document.querySelectorAll(".sidebar li");
  const langSelect = document.getElementById("languageSelect");
  const runBtn = document.getElementById("runBtn");
  const refreshBtn = document.getElementById("refreshBtn");

  const samples = {
    c: `#include <stdio.h>
int main() {
    printf("Hello Upendra Singh\\n");
    return 0;
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    cout << "Hello Upendra Singh" << endl;
    return 0;
}`,
    python: `print("Hello Upendra Singh")`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Upendra Singh");
    }
}`,
    js: `console.log("Hello Upendra Singh");`,

      php: `<?php
echo "Hello Upendra Singh from PHP!\\n";
?>`,

  ruby: `puts "Hello Upendra Singh from Ruby!"`

  };

  function normalize(l) {
    if (!l) return "c";
    l = String(l).toLowerCase();
    if (l === "c++") return "cpp";
    if (l === "javascript") return "js";
    return l;
  }

  let currentLang = normalize((location.hash && location.hash.slice(1)) || "c");

  function loadLanguage(l) {
    l = normalize(l);
    currentLang = l;
    const title = document.getElementById("lang-title");
    if (title) title.textContent = "Language: " + l.toUpperCase();
    const codeArea = document.getElementById("codeArea");
    if (codeArea) codeArea.value = samples[l] || "";
    if (langSelect) langSelect.value = l;
    sidebarIcons.forEach((i) =>
      i.classList.toggle("active", normalize(i.dataset.lang) === l)
    );
    location.hash = l;
  }

  sidebarIcons.forEach((icon) => {
    icon.addEventListener("click", () => loadLanguage(icon.dataset.lang));
  });

  if (langSelect) {
    langSelect.addEventListener("change", () => loadLanguage(langSelect.value));
  }

  loadLanguage(currentLang);

  // 🏃 RUN BUTTON
  if (runBtn)
    runBtn.addEventListener("click", async () => {
      const codeArea = document.getElementById("codeArea");
      const code = codeArea.value.trim();
      const outputBox = document.getElementById("outputBox");
      if (!code) {
        outputBox.textContent = "Write code first";
        return;
      }

      const preview = code.split("\n")[0].slice(0, 40) || "(no title)";
      runHistory.unshift({
        lang: currentLang,
        preview,
        time: new Date().toLocaleTimeString(),
      });
      if (runHistory.length > 5) runHistory.length = 5;
      localStorage.setItem("run_history", JSON.stringify(runHistory));
      updateHistoryUI();

      if (currentLang === "js") {
        try {
          const logs = [];
          const orig = console.log;
          console.log = (...args) => {
            logs.push(args.map((a) => String(a)).join(" "));
            orig.apply(console, args);
          };
          new Function(code)();
          console.log = orig;
          outputBox.textContent =
            logs.join("\n") || "Finished (no console output).";
        } catch (e) {
          outputBox.textContent = "Error: " + e.message;
        }
      } else {
        outputBox.textContent = "Running on server...";
        try {
          const res = await fetch("http://localhost:5000/run/" + currentLang, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
          const ct = res.headers.get("content-type") || "";
          let data;
          if (ct.includes("application/json")) data = await res.json();
          else data = { output: await res.text() };
          outputBox.textContent = data.output ?? JSON.stringify(data);
        } catch (err) {
          outputBox.textContent = "Server error: " + err.message;
        }
      }
    });

  // 🧹 REFRESH BUTTON
  if (refreshBtn)
    refreshBtn.addEventListener("click", () => {
      document.getElementById("codeArea").value = "";
      document.getElementById("outputBox").textContent =
        "Your output will appear here...";
    });

  // 💾 SAVE BUTTON
  if (!document.getElementById("saveCodeBtn")) {
    const saveBtn = document.createElement("button");
    saveBtn.id = "saveCodeBtn";
    saveBtn.className = "btn";
    saveBtn.textContent = "Save Code";
    saveBtn.style.marginLeft = "8px";
    const group = document.querySelector(".button-group");
    if (group) group.appendChild(saveBtn);
    saveBtn.addEventListener("click", saveCurrentCode);
  }

  renderProfileDropdown();
});

// 🔧 Hide "Settings" and "Logout" on About page only
// --- Page-specific UI tweaks for about.html ---
if (window.location.pathname.includes("about.html")) {
  // hide only settings (not logout) so user can still logout from About page
  const hideElements = ["settingsBtn"]; // keep logout visible
  hideElements.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

// --- Universal logout click handler (works if logout is named logoutBtn or doLogout) ---
document.addEventListener("click", (e) => {
  // handle <li id="logoutBtn"> or <li id="doLogout"> or a button with id="logoutBtn"
  const tgt = e.target;
  if (!tgt) return;

  // if inner element (icon/span) clicked inside LI, climb up to check id
  const candidate = tgt.id ? tgt : tgt.closest && tgt.closest("#logoutBtn, #doLogout");

  if (candidate && (candidate.id === "logoutBtn" || candidate.id === "doLogout")) {
    e.preventDefault();
    // call the logout function (from auth.js)
    if (typeof logoutUser === "function") {
      logoutUser();
    } else {
      // fallback: remove and redirect smartly
      localStorage.removeItem("loggedInUser");
      const cur = window.location.pathname;
      const inside = cur.includes("/pages/");
      window.location.href = inside ? "../login.html" : "login.html";
    }
  }
});

