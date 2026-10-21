import type { AccentTheme, AudienceSlug } from "@/data/types";
import type { MeshVariant } from "@/components/ui";

/** ЦА → вариант mesh-градиента */
export function meshForAudience(slug: AudienceSlug | string): MeshVariant {
  switch (slug) {
    case "business":
      return "business";
    case "freelancers":
      return "freelance";
    case "career":
      return "career";
    default:
      return "home";
  }
}

/** AccentTheme → mesh (для курсов / карточек) */
export function meshForAccent(accent: AccentTheme): MeshVariant {
  switch (accent) {
    case "ink":
      return "business";
    case "peach":
      return "freelance";
    case "lavender":
      return "career";
    case "indigo":
    default:
      return "home";
  }
}
