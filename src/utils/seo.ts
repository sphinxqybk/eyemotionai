interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export function updateSEO({
  title = 'EyeMotion - Professional AI Film Ecosystem',
  description = 'Revolutionary Intent-Aware AI film ecosystem for professional filmmakers. Transform your workflow with Auto-Cut Engine and CineTone AI.',
  image = '/og-image.jpg',
  url = 'https://eyemotion.ai',
  type = 'website'
}: SEOConfig) {
  // Update document title
  document.title = title;

  // Helper function to set meta tag
  const setMetaTag = (name: string, content: string, property = false) => {
    const attr = property ? 'property' : 'name';
    let tag = document.querySelector(`meta[${attr}="${name}"]`);
    
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    }
    
    tag.setAttribute('content', content);
  };

  // Standard meta tags
  setMetaTag('description', description);
  setMetaTag('keywords', 'AI film editing, professional video editing, Intent-Aware AI, Auto-Cut, CineTone, film ecosystem');

  // Open Graph tags
  setMetaTag('og:title', title, true);
  setMetaTag('og:description', description, true);
  setMetaTag('og:image', image, true);
  setMetaTag('og:url', url, true);
  setMetaTag('og:type', type, true);
  setMetaTag('og:site_name', 'EyeMotion', true);

  // Twitter Card tags
  setMetaTag('twitter:card', 'summary_large_image', true);
  setMetaTag('twitter:title', title, true);
  setMetaTag('twitter:description', description, true);
  setMetaTag('twitter:image', image, true);

  // Additional professional tags
  setMetaTag('application-name', 'EyeMotion Professional Suite');
  setMetaTag('theme-color', '#0a0a0a');
  setMetaTag('msapplication-TileColor', '#0a0a0a');
}

// Schema.org structured data for video software
export function addStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "EyeMotion Professional Suite",
    "description": "Professional AI film ecosystem with Intent-Aware AI, Auto-Cut Engine, and CineTone color grading",
    "applicationCategory": "VideoEditingApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "7-day free trial"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "180000",
      "bestRating": "5"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EyeMotion",
      "url": "https://eyemotion.ai"
    }
  };

  let scriptTag = document.querySelector('script[type="application/ld+json"]');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptTag);
  }
  
  scriptTag.textContent = JSON.stringify(structuredData);
}