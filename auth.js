// ======================= AUTH.JS =======================

// 🔐 Save new user (Signup)
function registerUser(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.some((u) => u.username === username);

  if (exists) {
    alert("⚠️ Username already exists!");
    return false;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("✅ Account created successfully!");
  return true;
}

// 🔑 Login user (✅ Session-based login)
function loginUser(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    alert("❌ Invalid username or password!");
    return false;
  }

  // ✅ Store active login in sessionStorage (not localStorage)
  sessionStorage.setItem("loggedInUser", username);
  alert(`👋 Welcome, ${username}!`);
  window.location.href = "index.html";
  return true;
}

// 🚪 Logout user
function logoutUser() {
  // Remove from sessionStorage
  sessionStorage.removeItem("loggedInUser");

  // ✅ Smart redirect (works for /pages/about.html or /index.html)
  const currentPath = window.location.pathname;
  const isInsidePages = currentPath.includes("/pages/");
  const target = isInsidePages ? "../login.html" : "login.html";
  window.location.href = target;
}

// ✅ Check login state and redirect as needed
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.split("/").pop();
  const currentUser = sessionStorage.getItem("loggedInUser");

  // Logged in but at login page → go to index
  if (path === "login.html" && currentUser) {
    location.href = "index.html";
  }

  // Not logged in but trying to access index/about → go to login
  if ((path === "index.html" || path === "about.html" || path === "") && !currentUser) {
    location.href = "login.html";
  }
});
