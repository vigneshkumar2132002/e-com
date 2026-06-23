/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '192.168.88.12',
    '192.168.88.10',
    '192.168.88.8',
    '192.168.88.9',
    '192.168.0.3',
    '192.168.0.2',
    '192.168.1.102',
    'localhost',
    'solid-ideas-push.loca.lt',
    '*.loca.lt'
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
