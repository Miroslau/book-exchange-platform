import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://res.cloudinary.com/dwr8vzbe6/image/upload/v1747674644/user-mc_miron/**",
      ),
    ],
  },
  /* config options here */
};

export default nextConfig;
