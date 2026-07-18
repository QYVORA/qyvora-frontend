import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SITE_CONFIG } from '../../features/marketing/content/siteConfig';
const ogImageSrc = '/og-image.svg';

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

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
  noindex,
}) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { i18n } = useTranslation();
  const siteUrl = SITE_CONFIG.brand.siteUrl; 
  const defaultTitle = SITE_CONFIG.brand.name;
  const seoTitle = title ? `${title} | ${defaultTitle}` : `${defaultTitle} | Africa's Offensive Security Platform`;
  const seoDescription = description || SITE_CONFIG.brand.description;
  
  const imagePath = image || ogImageSrc;
  const seoImage = imagePath.startsWith('http') ? imagePath : `${siteUrl}${imagePath}`;
  
  const seoCanonical = canonical || `${siteUrl}${location.pathname}${location.search}`;

  const defaultOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': defaultTitle,
    'url': siteUrl,
    'logo': `${siteUrl}/favicon.png`,
    // favicon.png kept in public/ for stable OG URL
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
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoCanonical} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />
      <html lang={i18n.language} />

      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
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

      {isMobile && <meta name="theme-color" content="#06B66F" />}

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
