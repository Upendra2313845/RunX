import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const runPython = (code, callback) => {
  const filePath = path.join(process.cwd(), "backend/temp", "code.py");
  if (!fs.existsSync("backend/temp")) fs.mkdirSync("backend/temp");
  fs.writeFileSync(filePath, code);

  exec(`python "${filePath}"`, (err, stdout, stderr) => {
    if (err) return callback(stderr || err.message);
    callback(stdout);
  });
};
