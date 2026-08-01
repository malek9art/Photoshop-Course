import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The application reads versioned content from the repository parent.
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  outputFileTracingIncludes: {
    "/*": ["../content/**/*"],
  },
  // Keep node-postgres in the Node.js server bundle on Vercel.
  serverExternalPackages: ["pg"],
};

export default nextConfig;
