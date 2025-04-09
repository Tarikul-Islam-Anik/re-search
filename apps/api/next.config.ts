// import { env } from '@/env';
import { config } from '@repo/next-config';
// import { withLogging, } from '@repo/observability/next-config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  ...config,
  // biome-ignore lint/suspicious/useAwait: <explanation>
  async headers() {
    return [
      {
        source: '/:path*', // Or any other route you want to enable CORS for
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Or specify a specific origin
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

// if (env.VERCEL) {
//   nextConfig = withSentry(nextConfig);
// }

// if (env.ANALYZE === 'true') {
//   nextConfig = withAnalyzer(nextConfig);
// }

export default nextConfig;
