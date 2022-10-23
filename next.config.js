const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
      if (dev && isServer) {
        config.plugins.push(
          new ForkTsCheckerWebpackPlugin()
        );
      }
    // Important: return the modified config
    return config
  },
}

module.exports = nextConfig
