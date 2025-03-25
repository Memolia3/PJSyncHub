import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google認証のアバター画像
      "avatars.githubusercontent.com", // GitHub認証のアバター画像
    ],
  },
};

export default withNextIntl(nextConfig);
