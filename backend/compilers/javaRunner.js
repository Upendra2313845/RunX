import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const runJava = (code, callback) => {
  const dir = path.join(process.cwd(), "backend/temp");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const filePath = path.join(dir, "Main.java");
  fs.writeFileSync(filePath, code);

  exec(`javac "${filePath}" && java -cp "${dir}" Main`, (err, stdout, stderr) => {
    if (err) return callback(stderr || err.message);
    callback(stdout);
  });
};
