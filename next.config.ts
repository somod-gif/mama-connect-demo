import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 768, 1024, 1280],
    imageSizes: [48, 64, 96, 128],
  },
  async headers() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://mamaconnect.onrender.com";
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Link",
            value: `<${apiUrl.replace(/\/v1$/, "")}>; rel=preconnect`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
