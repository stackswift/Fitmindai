/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['openai.com', 'replicate.com', 'replicate.delivery', 'via.placeholder.com'],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig