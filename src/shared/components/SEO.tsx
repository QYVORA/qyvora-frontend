import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../core/contexts/ThemeContext';
import { SITE_CONFIG } from '../../features/marketing/content/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  canonical?: string;
  type?: 'website' | 'article' | 'software';
  schemaData?: object;
  /** Optional breadcrumbs for the BreadcrumbList schema */
  breadcrumbs?: Array<{ name: string; item: string }>;
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
  schemaData,
  breadcrumbs,
}) => {
  const { theme } = useTheme();
  const location = useLocation();
  const siteUrl = SITE_CONFIG.brand.siteUrl; 
  const defaultTitle = SITE_CONFIG.brand.name;
  const seoTitle = title ? `${title} | ${defaultTitle}` : `${defaultTitle} | Africa's Offensive Security Platform`;
  const seoDescription = description || SITE_CONFIG.brand.description;
  
  // Ensure image is an absolute URL
  const imagePath = image || '/qyvora-full-logo.png';
  const seoImage = imagePath.startsWith('http') ? imagePath : `${siteUrl}${imagePath}`;
  
  const seoCanonical = canonical || `${siteUrl}${location.pathname}${location.search}`;

  const defaultOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': defaultTitle,
    'url': siteUrl,
    'logo': `${siteUrl}/favicon.png`,
    'description': SITE_CONFIG.brand.description,
    'sameAs': SITE_CONFIG.social.map(s => s.href)
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': seoTitle,
    'description': seoDescription,
    'url': seoCanonical,
    'isPartOf': {
      '@type': 'WebSite',
      'name': defaultTitle,
      'url': siteUrl
    }
  };

  const breadcrumbSchema = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': crumb.item.startsWith('http') ? crumb.item : `${siteUrl}${crumb.item}`
    }))
  } : null;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoCanonical} />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      <html lang="en" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
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

      {/* AI & Search Engine discovery enhancements */}
      <meta name="author" content="QYVORA" />
      <meta name="application-name" content="QYVORA" />
      <meta name="apple-mobile-web-app-title" content="QYVORA" />
      <meta name="theme-color" content={theme === 'light' ? '#66B870' : '#050706'} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(schemaData || defaultOrganizationSchema)}
      </script>

      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
