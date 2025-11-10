import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { runC } from "./compilers/cRunner.js";
import { runCPP } from "./compilers/cppRunner.js";
import { runPython } from "./compilers/pythonRunner.js";
import { runJava } from "./compilers/javaRunner.js";
import { runJS } from "./compilers/jsRunner.js";
import { runPHP } from "./compilers/phpRunner.js";
import { runRuby } from "./compilers/rubyRunner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve all frontend files from compiler folder (root)
const frontendPath = path.join(__dirname, "../");
app.use(express.static(frontendPath));

// ✅ Serve specific HTML pages safely
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
app.post("/run/:lang", (req, res) => {
  const { lang } = req.params;
  const { code } = req.body;
  if (!code) return res.json({ output: "⚠️ No code provided" });

  const callback = (output) => res.json({ output });

  switch (lang.toLowerCase()) {
    case "c": runC(code, callback); break;
    case "cpp": runCPP(code, callback); break;
    case "python": runPython(code, callback); break;
    case "java": runJava(code, callback); break;
    case "js": runJS(code, callback); break;
    case "php": runPHP(code, callback); break;
    case "ruby": runRuby(code, callback); break;
    default: res.json({ output: "❌ Unsupported language" });
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ RunX backend running on http://localhost:${PORT}`);
});
