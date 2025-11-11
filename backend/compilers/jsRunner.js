import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const runJS = (code, callback) => {
  try {
    const tempDir = path.join(process.cwd(), "backend", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const filePath = path.join(tempDir, "code.js");
    fs.writeFileSync(filePath, code);

    exec(`node "${filePath}"`, (err, stdout, stderr) => {
      if (err) return callback(stderr || err.message);
      callback(stdout || "✅ JS code executed successfully.");
    });
  } catch (err) {
    callback(`❌ Error: ${err.message}`);
  }
};
