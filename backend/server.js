// ✅ Imports
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Import all language runners
import { runC } from "./compilers/cRunner.js";
import { runCPP } from "./compilers/cppRunner.js";
import { runPython } from "./compilers/pythonRunner.js";
import { runJava } from "./compilers/javaRunner.js";
import { runJS } from "./compilers/jsRunner.js";
import { runPHP } from "./compilers/phpRunner.js";
import { runRuby } from "./compilers/rubyRunner.js";

// ✅ Fix __dirname for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve frontend files
const frontendPath = path.join(__dirname, "../");
app.use(express.static(frontendPath));

// ✅ Safe page serving
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

app.get("/pages/about.html", (req, res) => {
  res.sendFile(path.join(frontendPath, "pages/about.html"));
});

// ✅ Run compiler routes
app.post("/run/:lang", async (req, res) => {
  try {
    const { lang } = req.params;
    const { code } = req.body;
    if (!code) return res.json({ output: "⚠️ No code provided" });

    const callback = (output) => res.json({ output });

    switch (lang.toLowerCase()) {
      case "c":
        runC(code, callback);
        break;
      case "cpp":
        runCPP(code, callback);
        break;
      case "python":
        runPython(code, callback);
        break;
      case "java":
        runJava(code, callback);
        break;
      case "js":
        runJS(code, callback);
        break;
      case "php":
        runPHP(code, callback);
        break;
      case "ruby":
        runRuby(code, callback);
        break;
      default:
        res.json({ output: "❌ Unsupported language" });
    }
  } catch (err) {
    console.error("❌ Runtime error:", err);
    res.status(500).json({ output: "⚠️ Server error while running code" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ RunX backend running on port ${PORT}`);
});





// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ RunX backend running on port ${PORT}`);
});

// 🔁 Keep backend awake (ping every 14 minutes)
import fetch from "node-fetch";
setInterval(() => {
  fetch("https://runx-backend.onrender.com").catch(() => {});
}, 14 * 60 * 1000);


