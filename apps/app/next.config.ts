import { withToolbar } from '@repo/feature-flags/lib/toolbar';
import { config, withAnalyzer } from '@repo/next-config';
import { withLogging, withSentry } from '@repo/observability/next-config';
import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import { env } from './env';

let nextConfig: NextConfig = withToolbar(withLogging(config));

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default {
  ...nextConfig,
  experiments: { asyncWebAssembly: true },
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    // Canvas causes issues with webpack, so we need to ignore it
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...(config.resolve?.fallback || {}),
          canvas: false,
        },
      };
    }
    return config;
  },
};
