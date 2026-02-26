/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "**.vercel-storage.com" },
      { hostname: "**.public.blob.vercel-storage.com" },
      { hostname: "chart.googleapis.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
