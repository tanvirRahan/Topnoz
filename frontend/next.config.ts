import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "https://topnoz-1.onrender.com/api",
    NEXT_PUBLIC_BACKEND_URL: "https://topnoz-1.onrender.com",
  },
  images: {
    domains: ["topnoz-1.onrender.com", "127.0.0.1", "localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "topnoz-1.onrender.com",
      },
    ],
  },
};

export default nextConfig;
