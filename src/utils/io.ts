import { mkdirSync, writeFileSync } from "fs";
import path from "path";

export function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

export function writeOut(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, content, "utf8");
}
