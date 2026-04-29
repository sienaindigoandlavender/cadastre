import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cadastre.dancingwithlions.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/_dev/', '/api/'] }
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE
  };
}
