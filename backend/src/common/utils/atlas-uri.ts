import { execFileSync } from "node:child_process";

type AtlasUriResult = {
  uri: string;
  mode: "srv" | "standard";
  host: string;
};

type ParsedSrvUri = {
  username: string;
  password: string;
  hostname: string;
  dbName: string;
  query: string;
};

function encodeCredential(value: string) {
  try {
    return encodeURIComponent(decodeURIComponent(value));
  } catch {
    return encodeURIComponent(value);
  }
}

function parseSrvUri(inputUri: string): ParsedSrvUri {
  const withoutProtocol = inputUri.slice("mongodb+srv://".length);
  const atIndex = withoutProtocol.indexOf("@");

  if (atIndex === -1) {
    const parsed = new URL(inputUri);

    return {
      username: encodeCredential(parsed.username),
      password: encodeCredential(parsed.password),
      hostname: parsed.hostname,
      dbName: parsed.pathname && parsed.pathname !== "/" ? parsed.pathname.slice(1) : "unity_consult",
      query: parsed.search ? parsed.search.slice(1) : "",
    };
  }

  const credentials = withoutProtocol.slice(0, atIndex);
  const hostAndPath = withoutProtocol.slice(atIndex + 1);
  const credentialSeparator = credentials.indexOf(":");
  const username = credentialSeparator === -1 ? credentials : credentials.slice(0, credentialSeparator);
  const password = credentialSeparator === -1 ? "" : credentials.slice(credentialSeparator + 1);
  const hostEndCandidates = [hostAndPath.indexOf("/"), hostAndPath.indexOf("?")].filter((index) => index >= 0);
  const hostEnd = hostEndCandidates.length > 0 ? Math.min(...hostEndCandidates) : hostAndPath.length;
  const hostname = hostAndPath.slice(0, hostEnd);
  const suffix = hostAndPath.slice(hostEnd);
  const queryIndex = suffix.indexOf("?");
  const path = queryIndex === -1 ? suffix : suffix.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : suffix.slice(queryIndex + 1);

  if (!hostname) {
    throw new Error("MONGODB_URI is missing the Atlas cluster host.");
  }

  return {
    username: encodeCredential(username),
    password: encodeCredential(password),
    hostname,
    dbName: path && path !== "/" ? path.slice(1) : "unity_consult",
    query,
  };
}

function readTxtOptions(host: string) {
  try {
    const output = execFileSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-Command",
        `(Resolve-DnsName -Type TXT '${host}' -ErrorAction Stop | Select-Object -First 1).Strings -join ''`,
      ],
      { encoding: "utf8" },
    ).trim();

    return output || "authSource=admin";
  } catch {
    return "authSource=admin";
  }
}

function readSrvTargets(host: string) {
  const output = execFileSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      `Resolve-DnsName -Type SRV '_mongodb._tcp.${host}' -ErrorAction Stop | Sort-Object NameTarget | ForEach-Object { "$($_.NameTarget):$($_.Port)" }`,
    ],
    { encoding: "utf8" },
  )
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[a-zA-Z0-9.-]+:\d+$/.test(line));

  if (output.length === 0) {
    throw new Error(`No MongoDB Atlas SRV records found for ${host}.`);
  }

  return output;
}

export function resolveAtlasUri(inputUri: string | undefined): AtlasUriResult {
  if (!inputUri) {
    return { uri: "", mode: "srv", host: "" };
  }

  if (!inputUri.startsWith("mongodb+srv://") || process.platform !== "win32") {
    return { uri: inputUri, mode: inputUri.startsWith("mongodb://") ? "standard" : "srv", host: "" };
  }

  const parsed = parseSrvUri(inputUri);
  const srvTargets = readSrvTargets(parsed.hostname);
  const txtOptions = readTxtOptions(parsed.hostname);
  const existingQuery = parsed.query;
  const query = [existingQuery, txtOptions, "tls=true", "retryWrites=true", "w=majority"]
    .filter(Boolean)
    .join("&");

  return {
    uri: `mongodb://${parsed.username}:${parsed.password}@${srvTargets.join(",")}/${parsed.dbName}?${query}`,
    mode: "standard",
    host: parsed.hostname,
  };
}
