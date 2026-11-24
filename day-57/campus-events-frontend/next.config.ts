import type { NextConfig } from "next";

// Where the NestJS API lives (server side).
const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";

const nextConfig: NextConfig = {
  // The NestJS API does not enable CORS, so the BROWSER cannot call it
  // directly from http://localhost:3001. Instead the browser calls
  // /backend/... on this Next.js server, which forwards the request to
  // the NestJS API. No change to the backend is needed.
  async rewrites() {
    return [{ source: "/backend/:path*", destination: `${API_URL}/:path*` }];
  },
};

export default nextConfig;
