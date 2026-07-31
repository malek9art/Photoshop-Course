/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Repo root holds docs/ and content/; app/ is the platform (ADR-010).
  outputFileTracingRoot: process.cwd().replace(/\/app$/, ''),
  experimental: {
    // node:sqlite is a Node builtin; keep it external in the server bundle.
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
