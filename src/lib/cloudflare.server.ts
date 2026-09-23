import { getRequest } from "@tanstack/react-start/server";

// Set by the cloudflare-module Nitro preset on every request (see
// _module-handler.mjs in the `nitro` package). Bindings are the same static
// configuration on every invocation, so a shared global is safe here even
// under concurrent requests.
export type CloudflareEnv = {
  DB: {
    prepare: (sql: string) => {
      bind: (...args: unknown[]) => {
        run: () => Promise<unknown>;
        all: <T = unknown>() => Promise<{ results: T[] }>;
        first: <T = unknown>() => Promise<T | null>;
      };
    };
  };
  GALLERY_BUCKET: {
    put: (
      key: string,
      value: ArrayBuffer,
      options?: { httpMetadata?: { contentType?: string; contentDisposition?: string } },
    ) => Promise<unknown>;
    delete: (key: string) => Promise<void>;
  };
};

// This file is a `.server.ts` module -- never bundled for the client -- so
// the top-level `@tanstack/react-start/server` import here is safe. Import
// it dynamically (`await import("@/lib/cloudflare.server")`) from any
// `.functions.ts` file, which does ship to the client bundle.
export function getCloudflareEnv(): CloudflareEnv {
  const globalEnv = (globalThis as { __env__?: CloudflareEnv }).__env__;
  const requestEnv = (
    getRequest() as unknown as { runtime?: { cloudflare?: { env?: CloudflareEnv } } }
  ).runtime?.cloudflare?.env;
  const env = requestEnv ?? globalEnv;
  if (!env?.DB || !env?.GALLERY_BUCKET) {
    throw new Error(
      "Cloudflare bindings (DB, GALLERY_BUCKET) aren't available in this environment.",
    );
  }
  return env;
}
