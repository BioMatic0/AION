/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ["@aion/ui"]
  }
};

export default nextConfig;
