/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd().replace(/\/app$/, ''),
  serverExternalPackages: [],
};

export default nextConfig;
