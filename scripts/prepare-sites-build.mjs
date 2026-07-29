import { access, cp, rm } from "node:fs/promises";

const workerOutput = new URL("../dist/valentine_vite_app/", import.meta.url);
const serverOutput = new URL("../dist/server/", import.meta.url);
const requiredFiles = [
  new URL("../dist/client/index.html", import.meta.url),
  new URL("../dist/.openai/hosting.json", import.meta.url),
  new URL("index.js", serverOutput),
];

await rm(serverOutput, { recursive: true, force: true });
await cp(workerOutput, serverOutput, { recursive: true });

for (const file of requiredFiles) {
  await access(file);
}

console.log("Prepared the React + Vite build for Sites.");
