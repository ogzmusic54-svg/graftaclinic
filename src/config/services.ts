/**
 * Hizmet kataloğu — kategori, slug ve görsel yolu burada tanımlanır.
 * Çeviriler messages/{tr,en,de}.json dosyalarındaki "services.{slug}" anahtarlarına bağlıdır.
 */

export type ServiceCategory =
  | "hair-restoration"
  | "treatments"
  | "medical-aesthetics"
  | "plastic-surgery";

export interface Service {
  slug: string;
  category: ServiceCategory;
  /** public/images/services/ altında. Yoksa placeholder kullanılır. */
  image: string;
  /** Hero için daha geniş varyant. */
  heroImage?: string;
  /** Kart üzerindeki opsiyonel rozet. */
  badge?: string;
}

export const services: readonly Service[] = [
  // Hair Restoration
  {
    slug: "hair-transplant",
    category: "hair-restoration",
    image: "/images/services/hair-transplant.jpg",
    heroImage: "/images/services/hair-transplant-hero.jpg",
  },
  {
    slug: "beard-transplant",
    category: "hair-restoration",
    image: "/images/services/beard-transplant.jpg",
  },
  {
    slug: "eyebrow-transplant",
    category: "hair-restoration",
    image: "/images/services/eyebrow-transplant.jpg",
  },
  // Treatments
  {
    slug: "alopecia-treatment",
    category: "treatments",
    image: "/images/services/alopecia.jpg",
  },
  {
    slug: "prp-therapy",
    category: "treatments",
    image: "/images/services/prp.jpg",
  },
  {
    slug: "mesotherapy",
    category: "treatments",
    image: "/images/services/mesotherapy.jpg",
  },
  // Medical Aesthetics
  {
    slug: "fillers-botox",
    category: "medical-aesthetics",
    image: "/images/services/fillers-botox.jpg",
  },
  {
    slug: "youth-vaccine",
    category: "medical-aesthetics",
    image: "/images/services/youth-vaccine.jpg",
  },
  // Plastic Surgery
  {
    slug: "rhinoplasty",
    category: "plastic-surgery",
    image: "/images/services/rhinoplasty.jpg",
  },
  {
    slug: "breast-aesthetics",
    category: "plastic-surgery",
    image: "/images/services/breast-aesthetics.jpg",
  },
] as const;

export const categoryOrder: readonly ServiceCategory[] = [
  "hair-restoration",
  "treatments",
  "medical-aesthetics",
  "plastic-surgery",
] as const;

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return services.filter((s) => s.category === category);
}
