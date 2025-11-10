// backend/compilers/rubyRunner.js
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export function runRuby(code, callback) {
  const tempPath = path.join("backend", "compilers", "temp.rb");
  fs.writeFileSync(tempPath, code);

  exec(`ruby ${tempPath}`, (error, stdout, stderr) => {
    if (error) return callback(stderr || error.message);
    callback(stdout || "✅ Ruby code executed successfully.");
  });
}
