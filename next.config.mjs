/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination:
          "https://ai-agent-59cae.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
};

export default nextConfig;