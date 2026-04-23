"use client";

import { useEffect, useState, useCallback } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Star, Camera, Send, X, ChevronLeft, ChevronRight, ImageIcon, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface ReviewImage {
  url?: string;
  base64?: string;
  alt?: string;
  caption?: string;
  file?: File;
}

interface Review {
  name: string;
  phone: string;
  instaid?: string;
  review: string;
  rating: number;
  images?: { url: string; alt?: string; caption?: string; id?: string }[];
}

interface FormReview {
  name: string;
  phone: string;
  instaid?: string;
  review: string;
  rating: number;
  images: ReviewImage[];
}

type TouchedFields = Partial<Record<keyof FormReview, boolean>>;

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid 10-digit phone number"),
  instaid: z.string().optional(),
  review: z.string().min(10, "Review must be at least 10 characters"),
  rating: z.number().min(1, "Please select a star rating"),
});

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const RatingDisplay = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star key={star} className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} ${star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
    ))}
  </div>
);

const InteractiveRating = ({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: string }) => {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(star)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
            >
              <Star
                className={`w-8 h-8 transition-all duration-150 ${star <= (hovered || value) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-300"}`}
                style={{ transform: star <= (hovered || value) ? "scale(1.15)" : "scale(1)" }}
              />
            </button>
          ))}
        </div>
        {(hovered || value) > 0 && (
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#f59e0b" }}>
            {labels[hovered || value]}
          </span>
        )}
      </div>
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
          <AlertCircle size={13} style={{ color: "#dc2626", flexShrink: 0 }} />
          <span style={{ fontSize: "12px", color: "#dc2626" }}>{error}</span>
        </div>
      )}
    </div>
  );
};

const FormField = ({
  label, placeholder, value, onChange, onBlur, error, touched, multiline, rows, type = "text",
}: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
  onBlur: () => void; error?: string; touched?: boolean; multiline?: boolean; rows?: number; type?: string;
}) => {
  const isValid = touched && !error && value.length > 0;
  const isError = touched && !!error;
  const borderColor = isError ? "#dc2626" : isValid ? "#16a34a" : "#d0d0d0";
  const focusShadow = isError ? "0 0 0 3px rgba(220,38,38,0.1)" : isValid ? "0 0 0 3px rgba(22,163,74,0.1)" : "0 0 0 3px rgba(40,116,240,0.1)";

  return (
    <div>
      <label style={{ fontSize: "11px", fontWeight: 600, color: "#555", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            rows={rows || 4}
            style={{
              width: "100%", border: `1.5px solid ${borderColor}`, borderRadius: "6px",
              padding: "10px 36px 10px 12px", fontSize: "14px", fontFamily: "Inter, sans-serif",
              outline: "none", resize: "vertical", boxSizing: "border-box", background: "#fff",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => { e.target.style.boxShadow = focusShadow; e.target.style.borderColor = isError ? "#dc2626" : isValid ? "#16a34a" : "#2874f0"; }}
            onBlurCapture={(e) => { e.target.style.boxShadow = "none"; e.target.style.borderColor = borderColor; }}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            style={{
              width: "100%", border: `1.5px solid ${borderColor}`, borderRadius: "6px",
              padding: "10px 36px 10px 12px", fontSize: "14px", fontFamily: "Inter, sans-serif",
              outline: "none", boxSizing: "border-box", background: "#fff",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => { e.target.style.boxShadow = focusShadow; e.target.style.borderColor = isError ? "#dc2626" : isValid ? "#16a34a" : "#2874f0"; }}
            onBlurCapture={(e) => { e.target.style.boxShadow = "none"; e.target.style.borderColor = borderColor; }}
          />
        )}
        {isValid && (
          <CheckCircle2 size={15} style={{ position: "absolute", right: "10px", top: multiline ? "12px" : "50%", transform: multiline ? "none" : "translateY(-50%)", color: "#16a34a", pointerEvents: "none" }} />
        )}
        {isError && (
          <AlertCircle size={15} style={{ position: "absolute", right: "10px", top: multiline ? "12px" : "50%", transform: multiline ? "none" : "translateY(-50%)", color: "#dc2626", pointerEvents: "none" }} />
        )}
      </div>
      {isError && (
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px" }}>
          <AlertCircle size={12} style={{ color: "#dc2626", flexShrink: 0 }} />
          <span style={{ fontSize: "12px", color: "#dc2626" }}>{error}</span>
        </div>
      )}
    </div>
  );
};

interface FlatImage {
  url: string; alt?: string; reviewIndex: number; imageIndex: number;
  reviewerName: string; reviewText: string; rating: number;
}

const ProductReviewSection = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormReview>({ name: "", phone: "", instaid: "", review: "", rating: 0, images: [] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [selectedFlatIndex, setSelectedFlatIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [highlightedReviewIndex, setHighlightedReviewIndex] = useState<number | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/get-reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) { console.error("Failed to fetch reviews:", err); }
  }, [productId]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const validate = (data: FormReview) => {
    const result: any = reviewSchema.safeParse(data);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.errors?.forEach((e: any) => { fe[e.path[0]] = e.message; });
      return fe;
    }
    return {};
  };

  const handleFieldChange = (field: keyof FormReview, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field] || submitAttempted) setErrors(validate(updated));
  };

  const handleBlur = (field: keyof FormReview) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  };

  const flatImages: FlatImage[] = reviews.flatMap((rev, ri) =>
    (rev.images || []).map((img, ii) => ({ url: img.url || "", alt: img.alt, reviewIndex: ri, imageIndex: ii, reviewerName: rev.name, reviewText: rev.review, rating: rev.rating }))
  );

  const handleImageClick = (flatIdx: number) => {
    setSelectedFlatIndex(flatIdx);
    setLightboxOpen(true);
    setHighlightedReviewIndex(flatImages[flatIdx].reviewIndex);
    setTimeout(() => { document.getElementById("reviews-list")?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.images.length + files.length > MAX_IMAGES) { alert(`Maximum ${MAX_IMAGES} images allowed`); return; }
    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) { alert(`${file.name} exceeds 5MB`); return; }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData((prev) => ({ ...prev, images: [...prev.images, { base64: base64.split(",")[1], file, alt: file.name.replace(/\.[^/.]+$/, "") }] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  const getImageSrc = (img: ReviewImage) => {
    if (img.base64) return img.base64.startsWith("data:") ? img.base64 : `data:image/jpeg;base64,${img.base64}`;
    return img.url || "";
  };

  const handleSubmit = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setSubmitAttempted(true);
    setTouched({ name: true, phone: true, review: true, rating: true });
    const currentErrors = validate(formData);
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    setSubmitting(true);
    try {
      const imagesData = formData.images.filter((img) => img.base64).map((img) => ({
        base64: img.base64?.startsWith("data:") ? img.base64 : `data:image/jpeg;base64,${img.base64}`,
        alt: img.alt || "Review image", caption: img.caption || "", filename: img.file?.name || `review-${Date.now()}.jpg`,
      }));
      const res = await fetch("/api/create-review", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name: formData.name, phone: formData.phone, instaId: formData.instaid, rating: formData.rating, review: formData.review, images: imagesData }),
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ name: "", phone: "", instaid: "", review: "", rating: 0, images: [] });
        setErrors({}); setTouched({}); setSubmitAttempted(false);
        setDialogOpen(false); loadReviews();
      } else { alert("Error: " + data.message); }
    } catch { alert("Failed to submit. Please try again."); }
    finally { setSubmitting(false); }
  };

  const avgRating = reviews.length ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10) / 10 : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }));
  const displayedReviews = highlightedReviewIndex !== null
    ? [{ review: reviews[highlightedReviewIndex], originalIndex: highlightedReviewIndex }]
    : reviews.map((review, i) => ({ review, originalIndex: i }));
  const incompleteCount = Object.keys(validate(formData)).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        .rs-root { font-family: 'Inter', sans-serif; color: #111; }
        .rs-img-thumb { cursor: pointer; transition: box-shadow 0.15s; border: 2px solid transparent; border-radius: 6px; overflow: hidden; }
        .rs-img-thumb:hover { box-shadow: 0 0 0 2px #2874f0; border-color: #2874f0; }
        .rs-img-thumb.active { box-shadow: 0 0 0 2px #2874f0; border-color: #2874f0; }
        .rs-rating-bar { height: 8px; border-radius: 4px; background: #e0e0e0; overflow: hidden; flex: 1; }
        .rs-rating-bar-fill { height: 100%; border-radius: 4px; background: #388e3c; transition: width 0.4s ease; }
        .rs-review-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; background: #fff; }
        .rs-review-card.highlighted { border-color: #2874f0; background: #f0f5ff; }
        .rs-write-btn { background: #ff6161; color: #fff; border: none; border-radius: 4px; padding: 10px 22px; font-size: 13px; font-weight: 600; cursor: pointer; letter-spacing: 0.02em; transition: background 0.18s; }
        .rs-write-btn:hover { background: #e53935; }
        .rs-submit-btn { background: #ff9f00; color: #fff; border: none; border-radius: 6px; padding: 13px 0; font-size: 14px; font-weight: 700; cursor: pointer; width: 100%; transition: background 0.18s, transform 0.1s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .rs-submit-btn:hover:not(:disabled) { background: #e65100; transform: translateY(-1px); }
        .rs-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .rs-upload-box { border: 1.5px dashed #b0b0b0; border-radius: 6px; width: 72px; height: 72px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; background: #fafafa; transition: border-color 0.2s, background 0.2s; }
        .rs-upload-box:hover { border-color: #2874f0; background: #f0f5ff; }
        .rs-gallery-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin; }
        .rs-gallery-scroll::-webkit-scrollbar { height: 4px; }
        .rs-gallery-scroll::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 2px; }
        .rs-gallery-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
        .rs-lb-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.15); border: none; color: #fff; padding: 12px 10px; cursor: pointer; backdrop-filter: blur(4px); border-radius: 4px; transition: background 0.18s; }
        .rs-lb-nav:hover { background: rgba(255,255,255,0.28); }
        .rs-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: #fff; flex-shrink: 0; }
        .rs-clear-filter { background: none; border: 1px solid #2874f0; color: #2874f0; border-radius: 4px; padding: 4px 12px; font-size: 12px; cursor: pointer; margin-left: 10px; }
        .rs-clear-filter:hover { background: #2874f0; color: #fff; }
      `}</style>

      <div className="rs-root" style={{ maxWidth: "900px", margin: "0 auto", padding: "16px 0" }}>

        {/* TOP SUMMARY ROW */}
        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "28px" }}>
          <div style={{ minWidth: "180px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Customer Reviews</div>
            <div style={{ fontSize: "48px", fontWeight: 700, color: "#111", lineHeight: 1 }}>{avgRating || "—"}</div>
            {reviews.length > 0 && (
              <>
                <RatingDisplay rating={Math.round(avgRating)} size="md" />
                <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>{reviews.length} {reviews.length === 1 ? "rating" : "ratings"}</div>
              </>
            )}
            {reviews.length > 0 && (
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "5px" }}>
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#555", width: "10px", textAlign: "right" }}>{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <div className="rs-rating-bar"><div className="rs-rating-bar-fill" style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }} /></div>
                    <span style={{ fontSize: "11px", color: "#555", width: "18px" }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: "16px" }}>
              <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setTouched({}); setErrors({}); setSubmitAttempted(false); } }}>
                <DialogTrigger asChild>
                  <button className="rs-write-btn" onClick={(e) => e.stopPropagation()}>Write a Review</button>
                </DialogTrigger>

                <DialogContent className="max-h-[90vh] overflow-y-auto p-0" style={{ background: "#fff", maxWidth: "480px", borderRadius: "10px" }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ padding: "28px 28px 24px" }}>
                    <p style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Rate & Review</p>
                    <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #eee" }}>
                      Fields marked <span style={{ color: "#dc2626" }}>*</span> are required
                    </p>

                    {/* Error summary banner — only shown after submit attempt */}
                    {submitAttempted && incompleteCount > 0 && (
                      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "18px" }}>
                        <AlertCircle size={16} style={{ color: "#dc2626", flexShrink: 0, marginTop: "1px" }} />
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "#dc2626", marginBottom: "2px" }}>
                            Please fix {incompleteCount} issue{incompleteCount > 1 ? "s" : ""} before submitting
                          </p>
                          <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                            {Object.values(errors).map((msg, i) => (
                              <li key={i} style={{ fontSize: "12px", color: "#b91c1c" }}>{msg}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {/* Rating */}
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 600, color: "#555", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Your Rating <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <InteractiveRating
                          value={formData.rating}
                          onChange={(val) => { handleFieldChange("rating", val); setTouched((p) => ({ ...p, rating: true })); }}
                          error={(touched.rating || submitAttempted) ? errors.rating : undefined}
                        />
                      </div>

                      <FormField
                        label="Your Name *"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(v) => handleFieldChange("name", v)}
                        onBlur={() => handleBlur("name")}
                        error={errors.name}
                        touched={touched.name || submitAttempted}
                      />

                      <FormField
                        label="Phone Number *"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        type="tel"
                        onChange={(v) => handleFieldChange("phone", v.replace(/\D/g, "").slice(0, 10))}
                        onBlur={() => handleBlur("phone")}
                        error={errors.phone}
                        touched={touched.phone || submitAttempted}
                      />

                      <FormField
                        label="Instagram ID (optional)"
                        placeholder="@yourusername"
                        value={formData.instaid || ""}
                        onChange={(v) => handleFieldChange("instaid", v)}
                        onBlur={() => handleBlur("instaid")}
                        error={undefined}
                        touched={false}
                      />

                      <div>
                        <FormField
                          label="Your Review *"
                          placeholder="Share details about your experience — quality, fit, delivery, etc."
                          value={formData.review}
                          onChange={(v) => handleFieldChange("review", v)}
                          onBlur={() => handleBlur("review")}
                          error={errors.review}
                          touched={touched.review || submitAttempted}
                          multiline
                          rows={4}
                        />
                        <div style={{ fontSize: "11px", color: formData.review.length > 0 && formData.review.length < 10 ? "#f59e0b" : "#aaa", textAlign: "right", marginTop: "3px" }}>
                          {formData.review.length} chars{formData.review.length > 0 && formData.review.length < 10 ? ` (${10 - formData.review.length} more needed)` : formData.review.length >= 10 ? " ✓" : ""}
                        </div>
                      </div>

                      {/* Image upload */}
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 600, color: "#555", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Add Photos (optional)
                        </label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {formData.images.map((img, i) => (
                            <div key={i} style={{ position: "relative", width: "72px", height: "72px" }}>
                              <Image src={getImageSrc(img)} alt={img.alt || "Preview"} fill className="object-cover" style={{ borderRadius: "6px" }} unoptimized={!!img.base64} />
                              <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: "-6px", right: "-6px", background: "#333", color: "white", border: "none", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                          {formData.images.length < MAX_IMAGES && (
                            <label className="rs-upload-box">
                              <Camera size={20} style={{ color: "#aaa" }} />
                              <span style={{ fontSize: "10px", color: "#aaa", marginTop: "4px" }}>{formData.images.length}/{MAX_IMAGES}</span>
                              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                            </label>
                          )}
                        </div>
                        <p style={{ fontSize: "11px", color: "#aaa", marginTop: "6px" }}>Up to {MAX_IMAGES} photos · 5MB each</p>
                      </div>

                      <button className="rs-submit-btn" onClick={handleSubmit} disabled={submitting} style={{ marginTop: "4px" }}>
                        <Send size={14} />
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div style={{ width: "1px", background: "#e0e0e0", alignSelf: "stretch", minHeight: "120px" }} />

          {flatImages.length > 0 && (
            <div style={{ flex: 1, minWidth: "200px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <ImageIcon size={15} style={{ color: "#2874f0" }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>Customer Photos ({flatImages.length})</span>
              </div>
              <div className="rs-gallery-scroll">
                {flatImages.map((img, flatIdx) => (
                  <div key={flatIdx} className={`rs-img-thumb ${selectedFlatIndex === flatIdx && lightboxOpen ? "active" : ""}`} style={{ width: "90px", height: "90px", position: "relative", flexShrink: 0 }} onClick={() => handleImageClick(flatIdx)}>
                    <Image src={img.url} alt={img.alt || "Review photo"} fill className="object-cover" style={{ borderRadius: "4px" }} />
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "11px", color: "#888", marginTop: "6px" }}>Click a photo to see the review</p>
            </div>
          )}
        </div>

        {/* REVIEWS LIST */}
        <div id="reviews-list">
          <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", borderTop: "1px solid #e0e0e0", paddingTop: "20px" }}>
            <MessageSquare size={15} style={{ color: "#333", marginRight: "6px" }} />
            <span style={{ fontSize: "14px", fontWeight: 700 }}>
              {highlightedReviewIndex !== null ? "Review for selected photo" : `All Reviews (${reviews.length})`}
            </span>
            {highlightedReviewIndex !== null && (
              <button className="rs-clear-filter" onClick={() => { setHighlightedReviewIndex(null); setSelectedFlatIndex(null); }}>Show all</button>
            )}
          </div>

          {reviews.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>
              <Star className="w-10 h-10 mx-auto mb-3 fill-gray-100 text-gray-200" />
              <p style={{ fontSize: "14px" }}>No reviews yet. Be the first to review!</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {displayedReviews.map(({ review: rev, originalIndex }) => {
              const avatarColors = ["#f57c00", "#0288d1", "#388e3c", "#7b1fa2", "#c62828", "#00796b"];
              const isHighlighted = highlightedReviewIndex === originalIndex;
              return (
                <div key={originalIndex} className={`rs-review-card ${isHighlighted ? "highlighted" : ""}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div className="rs-avatar" style={{ background: avatarColors[originalIndex % avatarColors.length] }}>
                      {rev.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>{rev.name}</div>
                      {rev.instaid && <div style={{ fontSize: "12px", color: "#2874f0" }}>@{rev.instaid}</div>}
                    </div>
                    <div style={{ marginLeft: "auto" }}><RatingDisplay rating={rev.rating} /></div>
                  </div>
                  <p style={{ fontSize: "14px", color: "#333", lineHeight: 1.65, marginBottom: "12px" }}>{rev.review}</p>
                  {rev.images && rev.images.length > 0 && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {rev.images.map((img, imgIdx) => {
                        const flatIdx = flatImages.findIndex((fi) => fi.reviewIndex === originalIndex && fi.imageIndex === imgIdx);
                        return (
                          <div key={imgIdx} className={`rs-img-thumb ${selectedFlatIndex === flatIdx ? "active" : ""}`} style={{ width: "76px", height: "76px", position: "relative", flexShrink: 0 }} onClick={() => { setSelectedFlatIndex(flatIdx); setLightboxOpen(true); }}>
                            <Image src={img.url} alt={img.alt || "Review image"} fill className="object-cover" style={{ borderRadius: "4px" }} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* LIGHTBOX */}
        {lightboxOpen && selectedFlatIndex !== null && flatImages[selectedFlatIndex] && (
          <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
            <DialogContent className="p-0" style={{ background: "#111", border: "none", maxWidth: "800px", borderRadius: "8px" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", height: "80vh" }}>
                <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image src={flatImages[selectedFlatIndex].url} alt={flatImages[selectedFlatIndex].alt || "Review photo"} fill className="object-contain" style={{ padding: "16px" }} />
                  <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.5)", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "12px" }}>
                    {selectedFlatIndex + 1} / {flatImages.length}
                  </div>
                  {flatImages.length > 1 && (
                    <>
                      <button className="rs-lb-nav" style={{ left: "12px" }} onClick={(e) => { e.stopPropagation(); const ni = selectedFlatIndex > 0 ? selectedFlatIndex - 1 : flatImages.length - 1; setSelectedFlatIndex(ni); setHighlightedReviewIndex(flatImages[ni].reviewIndex); }}>
                        <ChevronLeft size={22} />
                      </button>
                      <button className="rs-lb-nav" style={{ right: "12px" }} onClick={(e) => { e.stopPropagation(); const ni = selectedFlatIndex < flatImages.length - 1 ? selectedFlatIndex + 1 : 0; setSelectedFlatIndex(ni); setHighlightedReviewIndex(flatImages[ni].reviewIndex); }}>
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}
                </div>
                <div style={{ width: "240px", background: "#fff", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>Reviewer</div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700 }}>{flatImages[selectedFlatIndex].reviewerName}</div>
                    <RatingDisplay rating={flatImages[selectedFlatIndex].rating} size="sm" />
                  </div>
                  <div style={{ fontSize: "13px", color: "#444", lineHeight: 1.6, borderTop: "1px solid #eee", paddingTop: "12px" }}>{flatImages[selectedFlatIndex].reviewText}</div>
                  {flatImages.length > 1 && (
                    <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
                      <div style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>All photos</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {flatImages.map((fi, idx) => (
                          <div key={idx} className={`rs-img-thumb ${idx === selectedFlatIndex ? "active" : ""}`} style={{ width: "48px", height: "48px", position: "relative", cursor: "pointer" }} onClick={() => { setSelectedFlatIndex(idx); setHighlightedReviewIndex(fi.reviewIndex); }}>
                            <Image src={fi.url} alt={fi.alt || ""} fill className="object-cover" style={{ borderRadius: "3px" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default ProductReviewSection;