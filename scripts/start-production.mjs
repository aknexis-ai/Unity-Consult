import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const commands = [
  { name: "backend", args: ["run", "backend:start"] },
  { name: "frontend", args: ["run", "frontend:start"] },
];

const children = commands.map(({ name, args }) => {
  const isWindows = process.platform === "win32";
  const child = spawn(isWindows ? `${npmCommand} ${args.join(" ")}` : npmCommand, isWindows ? [] : args, {
    stdio: "inherit",
    shell: isWindows,
  });

  child.on("exit", (code, signal) => {
    if (code === 0 || signal) {
      return;
    }

    console.error(`[${name}] exited with code ${code}. Stopping production runner.`);
    for (const running of children) {
      if (running !== child && !running.killed) {
        running.kill();
      }
    }
    process.exitCode = code ?? 1;
  });

  return child;
});

function shutdown() {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
