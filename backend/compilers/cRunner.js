import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export const runC = (code, callback) => {
  try {
    const tempDir = path.join(process.cwd(), "backend", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const filePath = path.join(tempDir, "code.c");
    const exePath = path.join(tempDir, os.platform() === "win32" ? "code.exe" : "code.out");
    fs.writeFileSync(filePath, code);

    const command = `gcc "${filePath}" -o "${exePath}" && "${exePath}"`;

    exec(command, { shell: os.platform() === "win32" ? "cmd.exe" : "/bin/bash" }, (err, stdout, stderr) => {
      if (err) return callback(stderr || err.message);
      callback(stdout || "✅ C code executed successfully.");
    });
  } catch (err) {
    callback(`❌ Error: ${err.message}`);
  }
};
