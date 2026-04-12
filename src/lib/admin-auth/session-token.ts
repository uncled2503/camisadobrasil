import { ADMIN_SESSION_MAX_AGE_SEC } from "@/lib/admin-auth/constants";

const TOKEN_VERSION = 1;

function utf8ToBase64Url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUint8Array(b64url: string): Uint8Array {
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = (4 - (b64.length % 4)) % 4;
  b64 += "=".repeat(pad);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bufferToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createAdminSessionToken(secret: string): Promise<string> {
  const exp = Date.now() + ADMIN_SESSION_MAX_AGE_SEC * 1000;
  const body = JSON.stringify({ exp, v: TOKEN_VERSION });
  const bodyB64 = utf8ToBase64Url(body);
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(bodyB64));
  return `${bodyB64}.${bufferToBase64Url(sigBuf)}`;
}

export async function verifyAdminSessionToken(token: string, secret: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [bodyB64, sigB64] = parts;
  if (!bodyB64 || !sigB64) return false;

  const enc = new TextEncoder();
  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
  } catch {
    return false;
  }

  let sigBytes: Uint8Array;
  try {
    sigBytes = base64UrlToUint8Array(sigB64);
  } catch {
    return false;
  }

  let ok: boolean;
  try {
    const sig = new Uint8Array(sigBytes.byteLength);
    sig.set(sigBytes);
    ok = await crypto.subtle.verify("HMAC", key, sig, enc.encode(bodyB64));
  } catch {
    return false;
  }
  if (!ok) return false;

  let parsed: { exp?: number; v?: number };
  try {
    const json = new TextDecoder().decode(base64UrlToUint8Array(bodyB64));
    parsed = JSON.parse(json) as { exp?: number; v?: number };
  } catch {
    return false;
  }

  if (parsed.v !== TOKEN_VERSION || typeof parsed.exp !== "number") return false;
  if (Date.now() > parsed.exp) return false;
  return true;
}
