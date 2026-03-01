import type { NextConfig } from "next";

const apiUrl = process.env.API_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  rewrites: async () => {
    const trimmed = apiUrl.replace(/\/$/, "");
    return [{ source: "/api/:path*", destination: `${trimmed}/:path*` }];
  },
};

export default nextConfig;
