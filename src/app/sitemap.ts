import { MetadataRoute } from 'next'
import { appConfig } from "@/lib/appConfig"
import { CATEGORIES, UNIQUE_POSTERS } from '@/data/posters'

const TODAY = '2026-06-17'

const mdxPages = [
  '/legal',
  '/legal/privacy',
  '/legal/terms',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = appConfig.baseUrl
  
  const sitemap: MetadataRoute.Sitemap = []
  
  // Static pages
  sitemap.push({
    url: baseUrl,
    lastModified: TODAY,
    changeFrequency: 'monthly',
    priority: 1.0,
  })
  
  // MDX pages
  mdxPages.forEach((path) => {
    sitemap.push({
      url: `${baseUrl}${path}`,
      lastModified: TODAY,
      changeFrequency: path === '/blog' ? 'weekly' : 'yearly',
      priority: path === '/blog' ? 0.7 : 0.5,
    })
  })
  
  // Category pages - based on CATEGORIES data
  CATEGORIES.forEach(category => {
    sitemap.push({
      url: `${baseUrl}/category/${category.id}`,
      lastModified: TODAY,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  })
  
  // Poster detail pages - based on POSTERS data
  UNIQUE_POSTERS.forEach(poster => {
    sitemap.push({
      url: `${baseUrl}/poster/${poster.id}`,
      lastModified: TODAY,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })
  
  return sitemap
}
