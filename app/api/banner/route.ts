import { sanityClient } from "@/lib/sanity";
import { NextResponse } from "next/server";
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanityClient);

function urlFor(source: any) {
  return builder.image(source);
}

export async function GET() {
  try {
    const query = `*[_type == "banner" && active == true] | order(order asc) {
      _id,
      title,
      subtitle,
      image,
      ctaText,
      ctaLink,
      mediaType,
      "video": video.asset->{
        url,
        mimeType
      },
      "videoPoster": videoPoster.asset->url,
      textPosition,
      textColor,
      buttonText,
      buttonLink,
      order,
      active
    }`;

    const banners = await sanityClient.fetch(query);
    
    // Add optimized image URLs
    const optimizedBanners = banners.map((banner: any) => {
      if (banner.image?.asset) {
        return {
          ...banner,
          imageUrl: urlFor(banner.image)
            .width(1920)
            .height(1080)
            .quality(80)
            .fit('crop')
            .auto('format')
            .url(),
          imageUrlMobile: urlFor(banner.image)
            .width(768)
            .height(1024)
            .quality(75)
            .fit('crop')
            .auto('format')
            .url(),
          imageUrlWebp: urlFor(banner.image)
            .width(1920)
            .height(1080)
            .quality(80)
            .format('webp')
            .fit('crop')
            .url(),
          lqip: urlFor(banner.image)
            .width(20)
            .height(20)
            .quality(20)
            .blur(10)
            .url(),
        };
      }
      return banner;
    });
    
    console.log("Fetched and optimized banners:", optimizedBanners.length);
    
    return NextResponse.json(optimizedBanners, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}