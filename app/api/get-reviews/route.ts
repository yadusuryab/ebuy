import { sanityClient } from "@/lib/sanity";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ success: false, message: "Missing productId" }, { status: 400 });
    }

    const reviews = await sanityClient.fetch(
      `*[_type == "review" && product._ref == $productId] | order(_createdAt desc){
        name,
        instaId,
        rating,
        review,
        _createdAt,
        images[]{
          asset->{
            _id,
            url
          },
          alt,
          caption
        }
      }`,
      { productId }
    );

    // Format the response to make image URLs more accessible
    const formattedReviews = reviews.map((review: any) => ({
      ...review,
      images: review.images?.map((image: any) => ({
        url: image.asset?.url,
        alt: image.alt || '',
        caption: image.caption || '',
        id: image.asset?._id
      })) || []
    }));

    return NextResponse.json({ success: true, reviews: formattedReviews });
  } catch (err) {
    console.error("Get Reviews Error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}