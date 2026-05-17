/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    outputFileTracingIncludes: {
      '/dashboard': ['./prisma/dev.db'],
      '/goals': ['./prisma/dev.db'],
      '/goals/create': ['./prisma/dev.db'],
      '/goals/track': ['./prisma/dev.db'],
      '/team': ['./prisma/dev.db'],
      '/analytics': ['./prisma/dev.db'],
      '/settings': ['./prisma/dev.db'],
      '/api/achievements': ['./prisma/dev.db'],
      '/api/approve': ['./prisma/dev.db'],
      '/api/goals': ['./prisma/dev.db'],
      '/api/shared-goals': ['./prisma/dev.db'],
      '/api/team': ['./prisma/dev.db'],
    },
  },
};

export default nextConfig;
