/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "**.vercel-storage.com" },
    ],
  },
  experimental: {
    // Habilita Server Actions com tamanho de body maior (uploads)
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
