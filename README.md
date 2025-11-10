# ⚡ RunX — Online Developer Compiler Platform

> A modern, developer-themed code execution platform built with **HTML, CSS, JavaScript, and Node.js**  
> Designed and developed by **Upendra Singh**

---

## 🧠 Overview

**RunX** is a full-stack web-based coding environment that allows users to log in, write, compile, and run programs online.  
It features a clean dark UI inspired by modern dev tools like VS Code — with glassmorphism design, animations, and secure login functionality.

---

## 🚀 Features

✅ **Authentication System**
- Login & Signup with localStorage validation  
- Auto-login if already authenticated  
- Responsive & mobile-friendly  

✅ **Online Compiler**
- Supports multiple languages (C, C++, etc.)  
- Real-time execution using Node.js backend  
- Displays compiler output instantly  

✅ **Modern UI / UX**
- Dark & light theme support  
- Animated background orbs and gradient visuals  
- Smooth hover effects and transitions  
- 3D and blur effects for RunX vibe  

✅ **Frontend Pages**
- `login.html` — User authentication page  
- `index.html` — Main compiler interface  
- `about.html` / `settings.html` — Additional pages  
- Consistent design across all pages  

✅ **Backend (Node.js + Express)**
- Handles code execution  
- Serves frontend and static files  
- Uses `child_process` for running compiled code  
- Custom `temp` folder for code output management  

---

## 🧩 Tech Stack

| Layer | Technologies |
|-------|---------------|
| 🎨 **Frontend** | HTML, CSS, JavaScript |
| ⚙️ **Backend** | Node.js, Express.js |
| 💾 **Storage** | LocalStorage (for login demo) |
| 🧠 **Compiler** | GCC / Node child process |

---

## 🗂️ Folder Structure

├── backend/ # Express server & compiler logic
│ ├── server.js
│ ├── compilers/
│ └── temp/
├── pages/ # About, profile, and other pages
├── assets/ # Images, icons, and static media
├── index.html # Main compiler UI
├── login.html # Login & Signup
├── style.css # Global styles
├── login.css # Login-specific styles
├── auth.js # Authentication logic
├── script.js # Frontend compiler logic
├── package.json # Backend dependencies
└── README.md 



---

## ⚙️ Installation & Setup

### 🔧 Prerequisites
Make sure you have:
- **Node.js** installed  
- **GCC Compiler** (for C/C++ execution)

### 📥 Clone & Run
```bash
# 1️⃣ Clone repository
git clone https://github.com/Upendra2313845/RunX.git

# 2️⃣ Move to project directory
cd RunX

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start backend server
node backend/server.js

## 🖼️ Project Preview


### 🔐 Login Page
![Login Page](https://raw.githubusercontent.com/Upendra2313845/RunX/main/assets/runx-login.png)

### 💻 Compiler Page
![Compiler Page](https://raw.githubusercontent.com/Upendra2313845/RunX/main/assets/runx-compiler.png)

### ℹ️ About Page
![About Page](https://raw.githubusercontent.com/Upendra2313845/RunX/main/assets/runx-about.png)





