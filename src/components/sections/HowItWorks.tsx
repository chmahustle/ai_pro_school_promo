import { getPublicPaths } from "@/data/public";
import { HowItWorksClient } from "./HowItWorksClient";

interface HowItWorksProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: "bg" | "white" | "lavender" | "dark";
}

/** «Как это работает» (серверная часть): два пути из products.ts собираются здесь, в браузер уходят публичные шаги */
export function HowItWorks(props: HowItWorksProps) {
  return <HowItWorksClient data={getPublicPaths()} {...props} />;
}
