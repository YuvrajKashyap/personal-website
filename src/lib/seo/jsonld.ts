import { seoConfig } from "@/config/seo";

export function getPersonStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: seoConfig.creator,
    url: seoConfig.siteUrl,
    sameAs: seoConfig.sameAs,
  };
}

export function getWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    inLanguage: "en-US",
  };
}

export function getSiteStructuredData() {
  return [getPersonStructuredData(), getWebsiteStructuredData()];
}
