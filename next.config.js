import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tpncxlxsggpsiswoownv.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Transpile framer-motion and allow ESM externals loosely to avoid export * errors
  transpilePackages: ['framer-motion'],
  experimental: {
    esmExternals: 'loose',
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
}); 