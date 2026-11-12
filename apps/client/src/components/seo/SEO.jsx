import React, { useLayoutEffect, useMemo } from 'react';
import {
    DEFAULT_DESCRIPTION,
    DEFAULT_SOCIAL_IMAGE,
    SITE_NAME,
    SITE_URL,
    toCanonicalUrl,
    withBrand,
} from '../../config/seo';

export default function SEO({
    title,
    description,
    image,
    name = SITE_NAME,
    type = 'website',
    keywords,
    canonical,
    schema,
    webPageSchema,
    additionalSchemas,
    noindex = false,
}) {
    const seoImage = image ? new URL(image, SITE_URL).toString() : DEFAULT_SOCIAL_IMAGE;
    const rawDescription = (description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim();
    const seoDescription = rawDescription.length > 160
        ? `${rawDescription.slice(0, 157).replace(/\s+\S*$/, '')}…`
        : rawDescription;
    const fullTitle = withBrand(title);
    const rawCanonical = canonical || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const canonicalUrl = toCanonicalUrl(rawCanonical);
    const robotsContent = noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    const pageSchema = useMemo(() => webPageSchema || {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: fullTitle,
        description: seoDescription,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${SITE_URL}/#website` },
    }, [canonicalUrl, fullTitle, seoDescription, webPageSchema]);

    const customSchemas = useMemo(() => [schema, ...(
        Array.isArray(additionalSchemas) ? additionalSchemas : []
    )].filter(Boolean), [additionalSchemas, schema]);

    // Pages are statically snapshotted after rendering. Updating the actual
    // head exposes route metadata in generated HTML and on SPA navigation.
    useLayoutEffect(() => {
        const setMeta = (attribute, key, content) => {
            let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
            if (!content) {
                element?.remove();
                return;
            }
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, key);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        document.title = fullTitle;
        setMeta('name', 'description', seoDescription);
        setMeta('name', 'keywords', keywords);
        setMeta('name', 'robots', robotsContent);
        setMeta('name', 'googlebot', robotsContent);
        setMeta('name', 'theme-color', '#10605F');

        setMeta('property', 'og:type', type);
        setMeta('property', 'og:title', fullTitle);
        setMeta('property', 'og:description', seoDescription);
        setMeta('property', 'og:site_name', name);
        setMeta('property', 'og:locale', 'en_IN');
        setMeta('property', 'og:image', seoImage);
        setMeta('property', 'og:image:secure_url', seoImage);
        setMeta('property', 'og:image:alt', `${fullTitle} — ${SITE_NAME}`);
        setMeta('property', 'og:url', canonicalUrl);

        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:title', fullTitle);
        setMeta('name', 'twitter:description', seoDescription);
        setMeta('name', 'twitter:image', seoImage);
        setMeta('name', 'twitter:image:alt', `${fullTitle} — ${SITE_NAME}`);
        setMeta('name', 'twitter:site', '@firstdoer');

        let canonicalElement = document.head.querySelector('link[rel="canonical"]');
        if (noindex) {
            canonicalElement?.remove();
        } else {
            if (!canonicalElement) {
                canonicalElement = document.createElement('link');
                canonicalElement.setAttribute('rel', 'canonical');
                document.head.appendChild(canonicalElement);
            }
            canonicalElement.setAttribute('href', canonicalUrl);
        }

        document.head.querySelectorAll('script[data-onit-page-schema]').forEach((element) => element.remove());
        [pageSchema, ...customSchemas].forEach((item) => {
            const element = document.createElement('script');
            element.type = 'application/ld+json';
            element.dataset.onitPageSchema = 'true';
            element.textContent = JSON.stringify(item);
            document.head.appendChild(element);
        });
    }, [
        canonicalUrl,
        customSchemas,
        fullTitle,
        keywords,
        name,
        noindex,
        pageSchema,
        robotsContent,
        seoDescription,
        seoImage,
        type,
    ]);

    return null;
}
