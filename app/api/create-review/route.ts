import { sanityClient } from '@/lib/sanity'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      productId,
      name,
      phone,
      instaId,
      rating,
      review,
      images,
    } = body

    console.log("Received review submission:", { 
      productId, 
      name, 
      rating, 
      imagesCount: images?.length || 0,
      imagesData: images ? images.map((img: any) => ({
        hasBase64: !!img.base64,
        base64Length: img.base64?.length || 0,
        alt: img.alt,
        filename: img.filename
      })) : []
    })

    if (!productId || !rating || !name || !phone || !review) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Process images if provided
    let imageAssets = []
    if (images && Array.isArray(images) && images.length > 0) {
      console.log(`Processing ${images.length} images...`)
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        try {
          console.log(`Processing image ${i + 1}:`, {
            hasBase64: !!image.base64,
            base64Preview: image.base64?.substring(0, 50) + '...',
            alt: image.alt,
            filename: image.filename
          });

          if (image.base64) {
            // Clean the base64 string - remove data URL prefix if present
            let base64Data = image.base64;
            let contentType = 'image/jpeg';
            
            // Check if it's a data URL
            if (base64Data.startsWith('data:')) {
              const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
              if (matches) {
                contentType = matches[1];
                base64Data = matches[2];
              }
            }
            
            console.log(`Uploading image ${i + 1} with content type: ${contentType}`);
            
            // Convert base64 to buffer
            const buffer = Buffer.from(base64Data, 'base64');
            console.log(`Buffer size: ${buffer.length} bytes`);
            
            // Upload to Sanity
            const asset = await sanityClient.assets.upload('image', buffer, {
              filename: image.filename || `review-${Date.now()}-${i}.jpg`,
              contentType: contentType,
            });
            
            console.log(`Image ${i + 1} uploaded successfully:`, asset._id);
            
            imageAssets.push({
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id,
              },
              alt: image.alt || 'Review image',
              caption: image.caption || '',
            });
          } else {
            console.log(`Image ${i + 1} has no base64 data`);
          }
        } catch (uploadError) {
          console.error(`Failed to upload image ${i + 1}:`, uploadError);
        }
      }
      
      console.log(`Successfully uploaded ${imageAssets.length} images`);
    }

    // Create the review document
    const reviewDoc: any = {
      _type: 'review',
      product: { _type: 'reference', _ref: productId },
      name,
      phone,
      instaId,
      rating: Number(rating),
      review,
      createdAt: new Date().toISOString(),
    }

    // Add images if we have any
    if (imageAssets.length > 0) {
      reviewDoc.images = imageAssets;
      console.log(`Adding ${imageAssets.length} images to review document`);
    }

    console.log("Creating review document...");
    const createdReview = await sanityClient.create(reviewDoc);
    console.log("Review document created successfully:", createdReview._id);

    // Fetch all ratings of this product
    const existingRatings = await sanityClient.fetch(
      `*[_type == "review" && product._ref == $productId]{rating}`,
      { productId }
    )

    const totalReviews = existingRatings.length
    const sumRatings = existingRatings.reduce((sum: number, r: any) => sum + r.rating, 0)
    const avgRating = parseFloat((sumRatings / totalReviews).toFixed(2))

    // Update product with new avgRating
    await sanityClient.patch(productId).set({ rating: avgRating }).commit()

    return NextResponse.json({ 
      success: true, 
      message: 'Review submitted successfully',
      imagesUploaded: imageAssets.length
    })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Something went wrong' 
    }, { status: 500 })
  }
}