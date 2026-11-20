import { FEATURES } from "@/config/features";

/**
 * Built and ready, hidden until the owner supplies real attributed reviews.
 */
export function Reviews() {
  if (!FEATURES.reviews) return null;

  return (
    <section className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-[clamp(1.2rem,2.5vw,1.6rem)] text-silver-100">
          Reviews
        </h2>
        <p className="mt-3 text-silver-500">
          Real customer reviews will appear here once the owner supplies them.
        </p>
      </div>
    </section>
  );
}
