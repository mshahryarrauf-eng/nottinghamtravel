import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false, 
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
