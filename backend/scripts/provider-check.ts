import "dotenv/config";
import dns from "node:dns/promises";
import { resolveAtlasUri } from "../src/common/utils/atlas-uri";

function hasPlaceholder(value: string | undefined) {
  return Boolean(value && (value.includes("<") || value.includes(">") || value.includes("...") || value.includes("USERNAME") || value.includes("PASSWORD") || value.includes("CLUSTER")));
}

function configured(value: string | undefined) {
  return Boolean(value && !hasPlaceholder(value));
}

const providers = [
  {
    name: "MongoDB Atlas",
    configured: configured(process.env.MONGODB_URI) && Boolean(process.env.MONGODB_URI?.startsWith("mongodb+srv://")),
    required: true,
    keys: ["MONGODB_URI"],
  },
  {
    name: "Redis",
    configured: configured(process.env.REDIS_URL),
    required: false,
    keys: ["REDIS_URL"],
  },
  {
    name: "Razorpay",
    configured:
      configured(process.env.RAZORPAY_KEY_ID) &&
      configured(process.env.RAZORPAY_KEY_SECRET) &&
      configured(process.env.RAZORPAY_WEBHOOK_SECRET),
    required: false,
    keys: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"],
  },
  {
    name: "Resend",
    configured: configured(process.env.RESEND_API_KEY),
    required: false,
    keys: ["RESEND_API_KEY"],
  },
  {
    name: "Twilio WhatsApp",
    configured:
      configured(process.env.TWILIO_ACCOUNT_SID) &&
      configured(process.env.TWILIO_AUTH_TOKEN) &&
      configured(process.env.TWILIO_WHATSAPP_FROM),
    required: false,
    keys: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_WHATSAPP_FROM"],
  },
];

function extractAtlasSrvHost(uri: string | undefined) {
  if (!uri) {
    return null;
  }

  if (!uri.startsWith("mongodb+srv://")) {
    return null;
  }

  const withoutProtocol = uri.slice("mongodb+srv://".length);
  const hostAndPath = withoutProtocol.includes("@") ? withoutProtocol.slice(withoutProtocol.indexOf("@") + 1) : withoutProtocol;
  const hostEndCandidates = [hostAndPath.indexOf("/"), hostAndPath.indexOf("?")].filter((index) => index >= 0);
  const hostEnd = hostEndCandidates.length > 0 ? Math.min(...hostEndCandidates) : hostAndPath.length;
  const hostname = hostAndPath.slice(0, hostEnd);

  return hostname ? `_mongodb._tcp.${hostname}` : null;
}

async function resolveWithTimeout(host: string, timeoutMs = 10_000) {
  return Promise.race([
    dns.resolveSrv(host),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timed out resolving ${host}`)), timeoutMs);
    }),
  ]);
}

async function main() {
  let hasRequiredProviderError = false;

  for (const provider of providers) {
    const values = provider.keys.map((key) => process.env[key]);
    const hasPlaceholderValue = values.some((value) => hasPlaceholder(value));
    const status = provider.configured ? "configured" : hasPlaceholderValue ? "placeholder value present" : "missing";

    if (provider.required && !provider.configured) {
      hasRequiredProviderError = true;
    }

    console.log(`${provider.name}: ${status} (${provider.keys.join(", ")})`);
  }

  if (providers[0]?.configured) {
    const srvHost = extractAtlasSrvHost(process.env.MONGODB_URI);

    if (!srvHost) {
      console.error("MongoDB Atlas: invalid URI format.");
      hasRequiredProviderError = true;
    } else {
      try {
        await resolveWithTimeout(srvHost);
        console.log("MongoDB Atlas DNS: reachable (SRV records resolved)");
      } catch {
        if (process.platform === "win32") {
          try {
            const resolved = resolveAtlasUri(process.env.MONGODB_URI);
            console.log(`MongoDB Atlas DNS: Node SRV lookup failed, Windows DNS fallback generated a ${resolved.mode} URI.`);
          } catch {
            console.error("MongoDB Atlas DNS: unreachable (SRV lookup timed out or failed)");
            console.error("Check Atlas cluster hostname, internet/DNS access, VPN/firewall rules, and Atlas Network Access IP allowlist.");
            hasRequiredProviderError = true;
          }
        } else {
          console.error("MongoDB Atlas DNS: unreachable (SRV lookup timed out or failed)");
          console.error("Check Atlas cluster hostname, internet/DNS access, VPN/firewall rules, and Atlas Network Access IP allowlist.");
          hasRequiredProviderError = true;
        }
      }
    }
  }

  if (hasRequiredProviderError) {
    console.error("Required provider configuration is not ready. Add a real MongoDB Atlas mongodb+srv:// URI before starting the backend.");
    process.exitCode = 1;
  }
}

void main();
