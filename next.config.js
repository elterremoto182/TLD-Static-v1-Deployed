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
    imageSizes: [16, 32, 64, 96, 128, 256], // Reduced from 8 to 6 sizes (removed 48, 384)
    deviceSizes: [640, 828, 1080, 1200, 1920], // Reduced from 8 to 5 sizes (removed 750, 2048, 3840)
  },
  trailingSlash: true,
  env: {
    nextImageExportOptimizer_imageFolderPath: 'public',
    nextImageExportOptimizer_exportFolderPath: 'out',
    nextImageExportOptimizer_quality: '75',
    nextImageExportOptimizer_storePicturesInWEBP: 'true',
    nextImageExportOptimizer_exportFolderName: 'nextImageExportOptimizer',
    nextImageExportOptimizer_generateAndUseBlurImages: 'true',
    nextImageExportOptimizer_remoteImageCacheTTL: '0',
  },
};

module.exports = nextConfig;
