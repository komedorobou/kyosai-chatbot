/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/kyosai-chatbot',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
