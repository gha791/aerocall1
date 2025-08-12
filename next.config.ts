import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
   webpack: (config, { isServer }) => {
    if (isServer) {
        // These packages are not used in the server-side build,
        // so we can ignore them to prevent build errors.
        config.externals.push('@opentelemetry/exporter-jaeger');
        config.externals.push('@genkit-ai/firebase');
    }

    return config;
  },
};

export default nextConfig;
