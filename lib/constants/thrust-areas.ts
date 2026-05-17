export const THRUST_AREAS = [
  "Business Impact",
  "Customer Experience",
  "Engineering Quality",
  "Operational Excellence",
  "People Development",
  "Product Delivery"
] as const;

export type ThrustArea = (typeof THRUST_AREAS)[number];
