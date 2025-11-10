// backend/compilers/phpRunner.js
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export function runPHP(code, callback) {
  const tempPath = path.join("backend", "compilers", "temp.php");
  fs.writeFileSync(tempPath, code);

  exec(`php ${tempPath}`, (error, stdout, stderr) => {
    if (error) return callback(stderr || error.message);
    callback(stdout || "✅ PHP code executed successfully.");
  });
}
