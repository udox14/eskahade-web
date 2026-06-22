import { getTestimonials } from "@/modules/testimonials/repo";
import TestimonialsClient from "./TestimonialsClient";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const items = await getTestimonials().catch(() => []);
  return <TestimonialsClient initialItems={items} />;
}
