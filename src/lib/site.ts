// The site's canonical public origin, in one place.
//
// Every absolute URL the site emits to search engines and social crawlers
// (canonical, OG, sitemap, robots, JSON-LD publisher) has to agree with this,
// or Google is told the authoritative copy of each page lives somewhere else.
// It pointed at valuation.fi for a while, which is a different company's site.
// The apex 308-redirects to www, so www is the canonical host.
export const SITE_URL = 'https://www.arvonmaaritys.fi'
