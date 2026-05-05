import { sanityClient } from '@/lib/sanity'
import { NextResponse } from 'next/server'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(sanityClient)

function urlFor(source: any) {
  return builder.image(source)
}

export async function GET() {
  try {
    const query = `*[_type == "category"]{ 
      _id, 
      name, 
      "slug": slug.current, 
      image,
      productCount
    }`

    const categories = await sanityClient.fetch(query)
    
    // Add optimized image URLs
    const optimizedCategories = categories.map((category: any) => {
      if (category.image?.asset) {
        // Different sizes for different contexts
        return {
          ...category,
          imageUrl: urlFor(category.image)
            .width(800)
            .height(600)
            .quality(85)
            .fit('crop')
            .auto('format')
            .url(),
          imageUrlWebp: urlFor(category.image)
            .width(800)
            .height(600)
            .quality(85)
            .format('webp')
            .fit('crop')
            .url(),
          imageUrlMobile: urlFor(category.image)
            .width(400)
            .height(300)
            .quality(80)
            .fit('crop')
            .auto('format')
            .url(),
          lqip: urlFor(category.image)
            .width(20)
            .height(20)
            .quality(20)
            .blur(10)
            .url(),
        }
      }
      return category
    })
    
    console.log(`✅ Optimized ${optimizedCategories.length} categories`)
    
    return NextResponse.json(optimizedCategories, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}