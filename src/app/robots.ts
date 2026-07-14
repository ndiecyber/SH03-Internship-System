import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/', // Karena ini dashboard internal, kita block dari search engine
    },
  };
}
