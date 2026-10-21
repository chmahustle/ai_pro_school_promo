"use client";

import { MotionConfig } from "framer-motion";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { LeadModalProvider } from "@/components/sections/LeadModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // reducedMotion="user" — framer-motion отключает transform/layout-анимации при prefers-reduced-motion
    <MotionConfig reducedMotion="user">
      <LocaleProvider>
        <LeadModalProvider>{children}</LeadModalProvider>
      </LocaleProvider>
    </MotionConfig>
  );
}
