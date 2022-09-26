/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    legacyBrowsers: false,
    appDir: true,
    runtime: 'experimental-edge', // 'node.js' (default) | experimental-edge
  },
}

module.exports = nextConfig
