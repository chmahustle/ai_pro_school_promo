"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function footerVisibleNow() {
  const footer = document.getElementById("site-footer");
  if (!footer) return false;
  const rect = footer.getBoundingClientRect();
  return rect.top < window.innerHeight - 24 && rect.bottom > 48;
}

/**
 * WhatsApp: на мобильных — пилюля с текстом;
 * на ≥lg после скролла — круглая иконка 56px без текста.
 * Скрывается, когда в зоне видимости футер (#site-footer).
 */
export function FloatingMessenger({ className }: { className?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useLayoutEffect(() => {
    setFooterInView(footerVisibleNow());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const sync = () => setFooterInView(footerVisibleNow());
    sync();

    const io = new IntersectionObserver(
      () => sync(),
      { rootMargin: "48px 0px 48px 0px", threshold: [0, 0.05, 0.15] },
    );
    io.observe(footer);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const hiddenByFooter = footerInView;

  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в WhatsApp"
      aria-hidden={hiddenByFooter || undefined}
      tabIndex={hiddenByFooter ? -1 : undefined}
      className={cn(
        "fixed bottom-4 right-4 z-40 flex items-center justify-center bg-[#25D366] font-semibold text-white shadow-float transition-[transform,opacity,width,padding] duration-300 hover:scale-105 sm:bottom-6 sm:right-6",
        "h-14 gap-2 rounded-pill pl-4 pr-5",
        "lg:size-14 lg:gap-0 lg:rounded-full lg:p-0",
        hiddenByFooter
          ? "pointer-events-none translate-y-4 opacity-0"
          : cn(
              "max-lg:translate-y-0 max-lg:opacity-100",
              scrolled
                ? "lg:translate-y-0 lg:opacity-100"
                : "lg:pointer-events-none lg:translate-y-8 lg:opacity-0",
            ),
        className,
      )}
    >
      <MessageCircle className="size-6 shrink-0" aria-hidden />
      <span className="text-[15px] lg:hidden">WhatsApp</span>
    </a>
  );
}
