/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  transpilePackages: ['next-image-export-optimizer'],
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    loader: 'custom',
    loaderFile: './loader.js',
    imageSizes: [96, 256], // Only sizes actually used (96 for avatars/badges, 256 for logo)
    deviceSizes: [640, 1080, 1920], // Essential breakpoints only
  },
  trailingSlash: true,
  // Explicitly ensure minification is enabled for production builds
  webpack: (config, { dev, isServer }) => {
    // Ensure minification is enabled in production for all builds
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: config.optimization.minimizer || [],
      };
    }
    return config;
  },
  env: {
    nextImageExportOptimizer_imageFolderPath: 'public',
    nextImageExportOptimizer_exportFolderPath: 'out',
    nextImageExportOptimizer_quality: '65',
    nextImageExportOptimizer_storePicturesInWEBP: 'true',
    nextImageExportOptimizer_exportFolderName: 'nextImageExportOptimizer',
    nextImageExportOptimizer_generateAndUseBlurImages: 'true',
    nextImageExportOptimizer_remoteImageCacheTTL: '0',
    nextImageExportOptimizer_imageSizes: '[96, 256]',
    nextImageExportOptimizer_deviceSizes: '[640, 1080, 1920]',
  },
};

module.exports = nextConfig;
