import { Star } from "lucide-react";

type HotelRating = 3 | 4 | 5;

type HotelStarRatingProps = {
  rating?: number | null;
  variant?: "light" | "dark";
  className?: string;
};

function normalizeRating(value?: number | null): HotelRating | null {
  if (value === 3 || value === 4 || value === 5) return value;
  return null;
}

export function HotelStarRating({ rating, variant = "light", className = "" }: HotelStarRatingProps) {
  const value = normalizeRating(rating);
  if (!value) return null;

  const activeColor = variant === "dark" ? "text-[#F5D97A]" : "text-[#D5A12B]";
  const emptyColor = variant === "dark" ? "text-slate-600" : "text-slate-500";
  const containerTone = variant === "dark"
    ? "border-[#F5D97A]/35 bg-[#061A2F]/55"
    : "border-[#D5A12B]/25 bg-[#F8EFD2]";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center gap-0.5 rounded-full border px-2 py-1 ${containerTone} ${className}`}
      aria-label={`hotel bintang ${value} dari 5`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < value;
        return (
          <Star
            key={index}
            aria-hidden="true"
            className={`size-3.5 ${active ? activeColor : emptyColor}`}
            fill="currentColor"
            strokeWidth={1.8}
          />
        );
      })}
    </span>
  );
}
