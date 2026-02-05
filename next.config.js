/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next-intl/config': require.resolve('./i18n.ts'),
    };
    return config;
  },
};

module.exports = nextConfig;
