import "dotenv/config";

import mongoose from "mongoose";

import { resolveAtlasUri } from "../src/common/utils/atlas-uri";

const uri = resolveAtlasUri(process.env.MONGODB_URI).uri;

if (!uri) {
  throw new Error("MONGODB_URI is required before running the lead contact migration.");
}

const leadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    company: String,
    service: String,
    stage: String,
    source: String,
    budget: String,
    budgetRange: String,
    inquiryType: String,
    serviceInterest: String,
    message: String,
  },
  { timestamps: true, versionKey: false },
);

function looksLikeMessage(value?: string | null) {
  if (!value) {
    return false;
  }

  const budgetSignals = ["rs", "budget", "retainer", "lakh", "monthly", "under", "above"];
  const normalized = value.toLowerCase();
  const hasSentenceShape = value.length > 60 || /[.!?]/.test(value);
  const hasBudgetSignal = budgetSignals.some((signal) => normalized.includes(signal));

  return hasSentenceShape && !hasBudgetSignal;
}

async function main() {
  await mongoose.connect(uri);
  const Lead = mongoose.model("Lead", leadSchema);
  const leads = await Lead.find({}).exec();
  let migrated = 0;

  for (const lead of leads) {
    if (looksLikeMessage(lead.get("budget")) && !lead.get("message")) {
      lead.set("message", lead.get("budget"));
      lead.set("budget", null);
      lead.set("budgetRange", lead.get("budgetRange") ?? "To be discussed");
      lead.set("inquiryType", lead.get("inquiryType") ?? "general");
      lead.set("serviceInterest", lead.get("serviceInterest") ?? lead.get("service") ?? null);
      await lead.save();
      migrated += 1;
    }
  }

  await mongoose.disconnect();
  console.log(`Lead contact migration complete. Migrated ${migrated} record(s).`);
}

void main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
