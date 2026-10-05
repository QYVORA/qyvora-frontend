import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../../features/marketing/content/siteConfig';
import {
  buildOrganization,
  buildWebSite,
  buildBreadcrumbList,
  buildAutoBreadcrumbs,
} from '@/shared/seo/schema';
import { canonicalUrl, pageTitle } from '@/shared/seo/metadata';
import { TOOLS } from '@/features/marketing/data/tools/registry';
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
  const siteUrl = SITE_CONFIG.brand.siteUrl; 
  const defaultTitle = SITE_CONFIG.brand.name;
  const seoTitle = pageTitle(title);
  const seoDescription = description || SITE_CONFIG.brand.description;
  
  const imagePath = image || ogImageSrc;
  const seoImage = imagePath.startsWith('http') 
    ? imagePath 
    : `${siteUrl.replace(/\/$/, '')}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  
  const seoCanonical = canonical || canonicalUrl(location.pathname);

  const seoImageType = seoImage.endsWith('.webp')
    ? 'image/webp'
    : seoImage.endsWith('.png')
      ? 'image/png'
      : 'image/jpeg';

  const crumbs = breadcrumbs ?? buildAutoBreadcrumbs(location.pathname, breadcrumbName);
  const breadcrumbSchema = crumbs ? buildBreadcrumbList(crumbs) : null;

  // Enhanced WebPage schema with social media links and tool information
  const allSocialProfiles = SITE_CONFIG.social.map(s => s.href);
  
  // Check if this is a tool page and build enhanced schema
  const isToolPage = location.pathname.startsWith('/') && 
    TOOLS.some(tool => tool.path === location.pathname);
  
  const currentTool = isToolPage ? TOOLS.find(tool => tool.path === location.pathname) : undefined;
  
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
    },
    // Add all social media profiles
    'sameAs': allSocialProfiles,
    // Add author/publisher information
    'author': {
      '@type': 'Organization',
      'name': defaultTitle,
      'url': siteUrl,
      'sameAs': allSocialProfiles
    }
  };

  // If this is a tool page, add SoftwareApplication schema
  const toolSchema = currentTool ? {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': currentTool.displayName,
    'alternateName': currentTool.name,
    'description': currentTool.summary,
    'applicationCategory': 'SecurityApplication',
    'operatingSystem': 'Linux, macOS, Windows',
    'url': `${siteUrl}${currentTool.path}`,
    'codeRepository': currentTool.github,
    'programmingLanguage': 'Go',
    'license': currentTool.license ? `https://spdx.org/licenses/${currentTool.license}.html` : undefined,
    'author': {
      '@type': 'Organization',
      'name': defaultTitle,
      'url': siteUrl,
      'sameAs': allSocialProfiles
    },
    'publisher': {
      '@type': 'Organization',
      'name': defaultTitle,
      'url': siteUrl,
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/favicon.png`
      }
    },
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock'
    },
    'downloadUrl': `${currentTool.github}/releases`,
    'softwareVersion': 'latest',
    'releaseNotes': `${currentTool.github}/releases`,
    'keywords': `cybersecurity, penetration testing, security assessment, offensive security, ${currentTool.domain}, ${currentTool.name}`,
    'isAccessibleForFree': true
  } : null;

  const schemas: object[] = [webPageSchema];
  if (breadcrumbSchema) schemas.push(breadcrumbSchema);
  if (toolSchema) schemas.push(toolSchema);
  schemas.push(schemaData ?? buildOrganization());
  if (!noindex && location.pathname === '/') schemas.push(buildWebSite());

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoCanonical} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />
      <html lang="en" />

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

      {/* Additional social media meta tags for enhanced discovery */}
      {SITE_CONFIG.social.map((social) => (
        <link key={social.key} rel="me" href={social.href} />
      ))}

      {/* Tool-specific meta tags for GitHub and development platforms */}
      {currentTool && (
        <>
          <meta property="og:type" content="website" />
          <meta name="keywords" content={`${currentTool.name}, cybersecurity tool, penetration testing, security assessment, ${currentTool.domain}, offensive security, QYVORA`} />
          <link rel="alternate" type="application/json+oembed" href={`${siteUrl}/oembed?url=${encodeURIComponent(seoCanonical)}`} />
          <meta property="article:author" content={SITE_CONFIG.contact.opsEmail} />
          <meta name="github:repo" content={currentTool.repo} />
          <meta name="github:url" content={currentTool.github} />
        </>
      )}

      <meta name="theme-color" content="#06B66F" />

      <script type="application/ld+json">
        {JSON.stringify(schemas)}
      </script>
    </Helmet>
  );
};

export default SEO;
