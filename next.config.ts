import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker / Google Cloud Run deployment
  output: "standalone",
};

export default nextConfig;
