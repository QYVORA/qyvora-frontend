import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SITE_CONFIG } from '../../features/marketing/content/siteConfig';
import {
  buildOrganization,
  buildWebSite,
  buildBreadcrumbList,
  buildAutoBreadcrumbs,
} from '@/shared/seo/schema';
const ogImageSrc = '/og-image.png';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  canonical?: string;
  type?: 'website' | 'article' | 'software';
  schemaData?: object;
  /** Optional breadcrumbs for the BreadcrumbList schema (overrides auto-generated trail) */
  breadcrumbs?: Array<{ name: string; item: string }>;
  /** Label for the current page when auto-generating a breadcrumb trail */
  breadcrumbName?: string;
  /** Prevent search engines from indexing this page */
  noindex?: boolean;
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
  breadcrumbName,
  noindex,
}) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const siteUrl = SITE_CONFIG.brand.siteUrl; 
  const defaultTitle = SITE_CONFIG.brand.name;
  const seoTitle = title ? `${title} | ${defaultTitle}` : `${defaultTitle} | Africa's Offensive Security Platform`;
  const seoDescription = description || SITE_CONFIG.brand.description;
  
  const imagePath = image || ogImageSrc;
  const seoImage = imagePath.startsWith('http') ? imagePath : `${siteUrl}${imagePath}`;
  
  const seoCanonical = canonical || `${siteUrl}${location.pathname}`;

  const seoImageType = seoImage.endsWith('.webp')
    ? 'image/webp'
    : seoImage.endsWith('.png')
      ? 'image/png'
      : 'image/jpeg';

  const crumbs = breadcrumbs ?? buildAutoBreadcrumbs(location.pathname, breadcrumbName);
  const breadcrumbSchema = crumbs ? buildBreadcrumbList(crumbs) : null;

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

  const schemas: object[] = [webPageSchema];
  if (breadcrumbSchema) schemas.push(breadcrumbSchema);
  schemas.push(schemaData ?? buildOrganization());
  if (!noindex && location.pathname === '/') schemas.push(buildWebSite());

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoCanonical} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />
      <html lang={i18n.language} />

      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:type" content={seoImageType} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={seoCanonical} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:image:alt" content={title || defaultTitle} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={title || defaultTitle} />
      <meta name="twitter:site" content="@qyvorasec" />
      <meta name="twitter:creator" content="@qyvorasec" />

      <meta name="author" content="QYVORA" />
      <meta name="application-name" content="QYVORA" />
      <meta name="apple-mobile-web-app-title" content="QYVORA" />

      <meta name="theme-color" content="#06B66F" />

      <script type="application/ld+json">
        {JSON.stringify(schemas)}
      </script>
    </Helmet>
  );
};

export default SEO;
