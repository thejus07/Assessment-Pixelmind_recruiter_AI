// Diagnostic script to test Clerk keys
const fs = require('fs');
const path = require('path');

// Load .env.local manually
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error("Failed to load .env.local", e);
}

const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secKey = process.env.CLERK_SECRET_KEY;

console.log("Loaded Keys:");
console.log("Publishable Key:", pubKey);
console.log("Secret Key:", secKey ? `${secKey.substring(0, 12)}... (Length: ${secKey.length})` : "undefined");

// Simple verification for Clerk Publishable Key format
// The raw key starts with pk_(test|live)_ and base64-decodes to a string ending with $
let isValidFormat = false;
if (pubKey && /^pk_(test|live)_[a-zA-Z0-9]+$/.test(pubKey)) {
  const keyWithoutPrefix = pubKey.replace(/^pk_(test|live)_/, '');
  try {
    const decoded = Buffer.from(keyWithoutPrefix, 'base64').toString('utf8');
    isValidFormat = decoded.endsWith('$');
  } catch (e) {
    isValidFormat = false;
  }
}
console.log("Publishable Key Format Valid (starts with pk_test/live and decodes with $):", isValidFormat);

if (!pubKey || !secKey) {
  console.error("Error: Missing Clerk keys in environment variables!");
  process.exit(1);
}

if (!isValidFormat) {
  console.error("Error: The publishable key is not correctly formatted (base64 payload must decode to a domain ending in $).");
}
