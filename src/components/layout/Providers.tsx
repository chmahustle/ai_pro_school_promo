"use client";

import { MotionConfig } from "framer-motion";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import type { FormConfig } from "@/data/public-types";
import { LeadModalProvider } from "@/components/sections/LeadModal";

export function Providers({ children, formConfig }: { children: React.ReactNode; formConfig: FormConfig }) {
  return (
    // reducedMotion="user" — framer-motion отключает transform/layout-анимации при prefers-reduced-motion
    <MotionConfig reducedMotion="user">
      <LocaleProvider>
        <LeadModalProvider config={formConfig}>{children}</LeadModalProvider>
      </LocaleProvider>
    </MotionConfig>
  );
}
