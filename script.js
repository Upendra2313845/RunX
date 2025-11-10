// ======================= SCRIPT.JS =======================

document.addEventListener("DOMContentLoaded", () => {
  // ========== AUTH CHECK ==========
  const path = location.pathname.split("/").pop();
  const currentUser = sessionStorage.getItem("loggedInUser");

  // ========== FORCE DARK THEME FOR LOGIN PAGE ==========
  if (path === "login.html") {
    document.body.classList.remove("light");
    document.body.classList.add("dark");

    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) themeToggle.style.display = "none";
    localStorage.setItem("theme", "dark");
    return;
  }

  // ========== AUTH REDIRECT ==========
  if ((path === "index.html" || path === "") && !currentUser) {
    location.href = "login.html";
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

  // ========== PROFILE DROPDOWN ==========
  const profileIcon = document.getElementById("profileIcon");
  const profileDropdown = document.getElementById("profileDropdown");

  function renderProfileDropdown() {
    if (!profileDropdown) return;
    const user = sessionStorage.getItem("loggedInUser");
    if (!user) {
      profileDropdown.innerHTML = '<div style="padding:12px">Not logged in</div>';
      return;
    }

    profileDropdown.innerHTML = `
      <div style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.1);">
        <div style="font-size:13px; color:#79c0ff">Signed in as</div>
        <div style="font-weight:700; margin-top:6px">${user}</div>
      </div>
      <ul style="list-style:none;margin:0;padding:0">
        <li id="openSavedCodes" style="padding:10px 14px;cursor:pointer;">
          <i class="fas fa-save" style="width:18px;color:#58a6ff"></i> Saved Codes
        </li>
        <li id="openSettings" style="padding:10px 14px;cursor:pointer;">
          <i class="fas fa-cog" style="width:18px;color:#58a6ff"></i> Settings
        </li>
        <li id="doLogout" style="padding:10px 14px;cursor:pointer;">
          <i class="fas fa-right-from-bracket" style="width:18px;color:#58a6ff"></i> Logout
        </li>
      </ul>
    `;

    document.getElementById("openSavedCodes").addEventListener("click", showSavedCodesModal);
    document.getElementById("openSettings").addEventListener("click", () =>
      settingsModal.classList.remove("hidden")
    );
    document.getElementById("doLogout").addEventListener("click", () => {
      sessionStorage.removeItem("loggedInUser");
      location.href = "login.html";
    });
  }

  if (profileIcon && profileDropdown) {
    profileIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".profile-container"))
        profileDropdown.classList.add("hidden");
    });
    renderProfileDropdown();
  }

  // ========== SAVED CODES ==========
  function getSavedKey() {
    const u = sessionStorage.getItem("loggedInUser") || "guest";
    return `rz_saved_${u}`;
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
        <div class="scard" style="border-radius:8px;padding:10px;margin-bottom:8px;background:rgba(255,255,255,0.03);">
          <div style="font-size:13px;color:#79c0ff">[${s.lang}] ${s.date}</div>
          <pre style="white-space:pre-wrap;margin:8px 0;font-size:13px;">${escapeHtml(
            s.code.slice(0, 300)
          )}${s.code.length > 300 ? "..." : ""}</pre>
          <button class="loadBtn" data-i="${i}" style="padding:5px 10px;margin-right:5px;background:#238636;color:#fff;border:none;border-radius:6px;">Load</button>
          <button class="deleteBtn" data-i="${i}" style="padding:5px 10px;background:#da3633;color:#fff;border:none;border-radius:6px;">Delete</button>
        </div>`
      )
      .join("");
    savedModalContent.innerHTML = `<h3>Saved Codes</h3>${html}`;
    savedModal.classList.remove("hidden");

    document.querySelectorAll(".loadBtn").forEach((b) =>
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
          alert("✅ Code loaded into editor.");
        }
      })
    );

    document.querySelectorAll(".deleteBtn").forEach((b) =>
      b.addEventListener("click", () => {
        const idx = +b.dataset.i;
        let arr2 = JSON.parse(localStorage.getItem(getSavedKey()) || "[]");
        arr2.splice(idx, 1);
        localStorage.setItem(getSavedKey(), JSON.stringify(arr2));
        showSavedCodesModal();
      })
    );
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
      <div style="margin-top:10px;text-align:left">
        <label>Font size: 
          <input id="settingFontSize" type="number" min="12" max="24" value="15" style="width:60px;margin-left:6px">
        </label>
        <div style="margin-top:10px;">
          <label><input id="autoSaveToggle" type="checkbox"> Enable Auto-save on Run</label>
        </div>
      </div>
      <div style="text-align:right;margin-top:15px;">
        <button id="closeSettingsBtn" class="btn">Close</button>
      </div>
    </div>`;
  document.body.appendChild(settingsModal);

  const savedModal = document.createElement("div");
  savedModal.id = "savedModal";
  savedModal.className = "modal hidden";
  savedModal.innerHTML = `
    <div class="modal-content">
      <div id="savedModalContent"></div>
      <div style="text-align:right;margin-top:10px">
        <button id="closeSavedBtn" class="btn">Close</button>
      </div>
    </div>`;
  document.body.appendChild(savedModal);
  const savedModalContent = document.getElementById("savedModalContent");

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

  document.body.addEventListener("click", (e) => {
    if (e.target.id === "closeSettingsBtn") settingsModal.classList.add("hidden");
    if (e.target.id === "closeSavedBtn") savedModal.classList.add("hidden");
  });

  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 2000; display: none; }
.modal:not(.hidden) { display: flex; align-items: center; justify-content: center; }
.modal .modal-content { background: #161b22; padding: 20px; border-radius: 12px; color: #e6edf3; min-width: 320px; max-width: 400px; box-shadow: 0 8px 30px rgba(0,0,0,0.6); }
body.light .modal .modal-content { background: #eaf4ff; color: #07203a; }
.btn { background: #238636; border: none; color: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer; transition: 0.2s ease; }
.btn:hover { background: #2ea043; }`;
  document.head.appendChild(styleTag);

  // ========== LANGUAGE + RUN ==========
  const sidebarIcons = document.querySelectorAll(".sidebar li");
  const langSelect = document.getElementById("languageSelect");
  const codeArea = document.getElementById("codeArea");
  const outputBox = document.getElementById("outputBox");
  const runBtn = document.getElementById("runBtn");
  const refreshBtn = document.getElementById("refreshBtn");
  let runHistory = JSON.parse(localStorage.getItem("run_history") || "[]");

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
    l = l.toLowerCase();
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
    if (codeArea) codeArea.value = samples[l] || "";
    if (langSelect) langSelect.value = l;
    sidebarIcons.forEach((i) =>
      i.classList.toggle("active", normalize(i.dataset.lang) === l)
    );
    location.hash = l;
  }

  sidebarIcons.forEach((icon) =>
    icon.addEventListener("click", () => loadLanguage(icon.dataset.lang))
  );
  if (langSelect) {
    langSelect.addEventListener("change", () => loadLanguage(langSelect.value));
  }
  loadLanguage(currentLang);

  // ========== RUN HISTORY ==========
  const historyBtn = document.getElementById("historyBtn");
  const historyDropdown = document.getElementById("historyDropdown");
  const historyList = document.getElementById("historyList");

  function updateHistoryUI() {
    if (!historyList) return;
    if (runHistory.length === 0) {
      historyList.innerHTML = "<li>No runs yet.</li>";
      return;
    }
    historyList.innerHTML = runHistory
      .map(
        (item) =>
          `<li><b>[${item.lang.toUpperCase()}]</b> ${item.preview}<br><small style="color:gray">${item.time}</small></li>`
      )
      .join("");
  }

  if (historyBtn && historyDropdown && historyList) {
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

  if (runBtn)
    runBtn.addEventListener("click", async () => {
      const code = codeArea.value.trim();
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

      if (localStorage.getItem("rz_auto_save") === "1") saveCurrentCode();

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

  if (refreshBtn)
    refreshBtn.addEventListener("click", () => {
      codeArea.value = "";
      outputBox.textContent = "Your output will appear here...";
    });

  updateHistoryUI();
});

// --- Universal Logout ---
document.addEventListener("click", (e) => {
  const tgt = e.target;
  const candidate = tgt.closest && tgt.closest("#logoutBtn, #doLogout");
  if (candidate) {
    e.preventDefault();
    if (typeof logoutUser === "function") logoutUser();
    else {
      sessionStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    }
  }
});
