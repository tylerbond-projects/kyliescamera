import { useSession } from "@tanstack/react-start/server";

// This file is a `.server.ts` module -- never bundled for the client -- so
// the top-level `@tanstack/react-start/server` import here is safe. Import
// it dynamically (`await import("@/lib/admin-session.server")`) from any
// `.functions.ts` file, which does ship to the client bundle.

// The admin gate doesn't use Supabase Auth (its email provider is disabled
// on this project with no dashboard access to turn it on) -- it's a single
// shared password, checked here, backing an encrypted/signed session cookie.
// The session-sealing key is derived from ADMIN_PASSWORD so only one secret
// needs to be configured. Uses the Web Crypto API rather than node:crypto so
// it doesn't depend on Cloudflare's Node compatibility shim.
async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export async function adminSession() {
  const adminPassword = process.env["ADMIN_PASSWORD"];
  if (!adminPassword) throw new Error("Admin login isn't configured yet (missing ADMIN_PASSWORD).");
  // Not a React hook -- it's @tanstack/react-start/server's server-side session
  // helper, which just happens to be named useSession.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSession<{ admin?: boolean }>({
    password: await sha256Hex(adminPassword),
    name: "kylie-admin",
    maxAge: 60 * 60 * 24, // 1 day -- admin has to sign back in daily
    cookie: { httpOnly: true, secure: true, sameSite: "lax" },
  });
}

export async function requireAdmin() {
  const session = await adminSession();
  if (session.data.admin !== true) throw new Error("Unauthorized");
}
