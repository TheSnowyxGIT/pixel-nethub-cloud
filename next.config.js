/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { webpack }) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    config.externals.push({
      sharp: "commonjs sharp",
      canvas: "commonjs canvas",
    });
    config.ignoreWarnings = [/bufferutil/, /utf-8-validate/];
    return config;
  },
};

module.exports = nextConfig;
