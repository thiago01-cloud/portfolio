/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pas de configuration ESLint dans ce projet : ne pas bloquer le build
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // Envoi des captures d'écran et du CV depuis l'admin
    serverActions: { bodySizeLimit: '10mb' },
  },
};

export default nextConfig;
