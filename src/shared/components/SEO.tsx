import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '../../features/marketing/content/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  canonical?: string;
  type?: 'website' | 'article' | 'software';
  schemaData?: object;
}

/**
 * SEO Component
 * 
 * Handles all meta tags, Open Graph, and JSON-LD structured data.
 * Centralizes SEO logic to ensure consistency across all pages.
 */
const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  article,
  canonical,
  type = 'website',
  schemaData,
}) => {
  const siteUrl = window.location.origin; // Dynamically use the current domain (Netlify or Custom)
  const defaultTitle = SITE_CONFIG.brand.name;
  const seoTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const seoDescription = description || SITE_CONFIG.brand.description;
  const seoImage = `${siteUrl}${image || '/qyvora-full-logo.png'}`;
  const seoCanonical = canonical || window.location.href;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoCanonical} />
      <html lang="en" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoCanonical} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:image:alt" content={title || defaultTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={title || defaultTitle} />
      <meta name="twitter:site" content="@QYVORASEC" />
      <meta name="twitter:creator" content="@QYVORASEC" />

      {/* Schema.org JSON-LD */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}

      {/* Default Organization Schema if not provided */}
      {!schemaData && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': defaultTitle,
            'url': siteUrl,
            'logo': `${siteUrl}/favicon.png`,
            'description': SITE_CONFIG.brand.description,
            'sameAs': SITE_CONFIG.social.map(s => s.href)
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
