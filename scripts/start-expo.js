const { execSync, spawn } = require("child_process");
const os = require("os");

const PORTS_TO_CLEAR = [8081, 8082, 8083];
const WIFI_NAME_HINTS = ["wi-fi", "wifi", "wlan", "wireless"];

function getPreferredIPv4Address() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [name, addresses] of Object.entries(interfaces)) {
    for (const address of addresses ?? []) {
      if (
        address.family !== "IPv4" ||
        address.internal ||
        !address.address ||
        address.address.startsWith("169.254.")
      ) {
        continue;
      }

      candidates.push({
        address: address.address,
        loweredName: name.toLowerCase(),
        name,
      });
    }
  }

  const preferred =
    candidates.find((candidate) =>
      WIFI_NAME_HINTS.some((hint) => candidate.loweredName.includes(hint)),
    ) ?? candidates[0];

  if (!preferred) {
    throw new Error("Nao foi possivel encontrar um IPv4 local valido.");
  }

  return preferred;
}

function getPidsUsingExpoPorts() {
  const output = execSync("netstat -ano -p tcp", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });

  const pids = new Set();

  for (const line of output.split(/\r?\n/)) {
    if (!line.includes("LISTENING")) {
      continue;
    }

    const columns = line.trim().split(/\s+/);
    if (columns.length < 5) {
      continue;
    }

    const localAddress = columns[1];
    const pid = columns[4];
    const port = Number(localAddress.split(":").pop());

    if (PORTS_TO_CLEAR.includes(port) && pid && !Number.isNaN(Number(pid))) {
      pids.add(pid);
    }
  }

  return [...pids];
}

function killExistingExpoPorts() {
  const pids = getPidsUsingExpoPorts();

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, {
        stdio: ["ignore", "ignore", "ignore"],
      });
    } catch {
      // Ignore processes that end between detection and kill.
    }
  }
}

function startExpo() {
  const preferredNetwork = getPreferredIPv4Address();

  killExistingExpoPorts();

  const env = {
    ...process.env,
    REACT_NATIVE_PACKAGER_HOSTNAME: preferredNetwork.address,
  };

  console.log("");
  console.log(`Expo LAN host: ${preferredNetwork.address} (${preferredNetwork.name})`);
  console.log("Expo port: 8081");
  console.log("If Expo Go still says offline, test this URL in iPhone Safari first:");
  console.log(`http://${preferredNetwork.address}:8081`);
  console.log("");

  const child =
    process.platform === "win32"
      ? spawn(
          "cmd.exe",
          ["/d", "/s", "/c", "npx expo start --lan --clear --port 8081"],
          {
            env,
            shell: false,
            stdio: "inherit",
          },
        )
      : spawn("npx", ["expo", "start", "--lan", "--clear", "--port", "8081"], {
          env,
          shell: false,
          stdio: "inherit",
        });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

startExpo();