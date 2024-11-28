/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['adminmediaplus1.websiteseguro.com', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'adminmediaplus1.websiteseguro.com',
        pathname: '/projetos/telinveste/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/seed/**',
      }
    ],
  },
  // Otimizações para produção
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
}

module.exports = nextConfig
