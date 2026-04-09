import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configura as qualidades permitidas para evitar avisos de versões futuras do Next.js
    qualities: [75, 90, 95],
  },
};

export default nextConfig;