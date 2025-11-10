import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const runJS = (code, callback) => {
  const filePath = path.join(process.cwd(), "backend/temp", "code.js");
  if (!fs.existsSync("backend/temp")) fs.mkdirSync("backend/temp");
  fs.writeFileSync(filePath, code);

  exec(`node "${filePath}"`, (err, stdout, stderr) => {
    if (err) return callback(stderr || err.message);
    callback(stdout);
  });
};
