/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    legacyBrowsers: false,
    appDir: true,
    runtime: 'experimental-edge', // 'node.js' (default) | experimental-edge
  },
  async headers() {
    return [
      {
        source: '/logo.png',
        headers: [
          {
            key: 'cache-control',
            value: 'public,max-age=31536000,immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
