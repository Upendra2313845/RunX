import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export const runJava = (code, callback) => {
  try {
    const tempDir = path.join(process.cwd(), "backend", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const filePath = path.join(tempDir, "Main.java");
    fs.writeFileSync(filePath, code);

    const command = `javac "${filePath}" && java -cp "${tempDir}" Main`;

    exec(command, { shell: os.platform() === "win32" ? "cmd.exe" : "/bin/bash" }, (err, stdout, stderr) => {
      if (err) return callback(stderr || err.message);
      callback(stdout || "✅ Java code executed successfully.");
    });
  } catch (err) {
    callback(`❌ Error: ${err.message}`);
  }
};
