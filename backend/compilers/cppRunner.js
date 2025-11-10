import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const runCPP = (code, callback) => {
  const tempDir = path.join(process.cwd(), "backend", "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const filePath = path.join(tempDir, "code.cpp");
  const exePath = path.join(tempDir, "code.exe");

  fs.writeFileSync(filePath, code);

  const command = `g++ "${filePath}" -o "${exePath}" && "${exePath}"`;

  exec(command, { shell: "cmd.exe" }, (err, stdout, stderr) => {
    if (err) return callback(stderr || err.message);
    callback(stdout || "✅ Code executed successfully.");
  });
};
