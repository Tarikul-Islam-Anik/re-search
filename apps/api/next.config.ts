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
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
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
