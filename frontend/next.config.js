  
  // next.config.js
  /** @type {import('next').NextConfig} */
  const nextConfig = {
   
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000/api',
      NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:1000',
    },
  }
  
  module.exports = nextConfig