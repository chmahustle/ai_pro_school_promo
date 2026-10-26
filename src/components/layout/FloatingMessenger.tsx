"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function footerVisibleNow() {
  // Мешающие блоки: футер и всё, что помечено data-hide-floating (форма заявки, финальный CTA)
  const blockers = document.querySelectorAll("#site-footer, [data-hide-floating]");
  for (const el of blockers) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 24 && rect.bottom > 48) return true;
  }
  return false;
}

/**
 * WhatsApp: круглая иконка без текста — 52px на мобильных (<lg, с учётом safe-area), 56px на ≥lg;
 * появляется после прокрутки ниже первого экрана (мобильные: > 80% высоты окна, ≥lg: > 400px).
 * Скрывается, когда в зоне видимости футер (#site-footer) или блок с data-hide-floating, и на /thanks/*.
 * Кнопка «наверх» (ScrollControls) стоит над ней с зазором 12px — размеры и отступы держать согласованными.
 */
export function FloatingMessenger({ className }: { className?: string }) {
  const pathname = usePathname();
  const onThanks = pathname.startsWith("/thanks");
  const [scrolled, setScrolled] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useLayoutEffect(() => {
    setFooterInView(footerVisibleNow());
  }, []);

  useEffect(() => {
    // Мобильные (<lg): после первого экрана (80% высоты окна); ≥lg: после 400px
    const onScroll = () => {
      const mobile = !window.matchMedia("(min-width: 1024px)").matches;
      setScrolled(window.scrollY > (mobile ? window.innerHeight * 0.8 : 400));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const blockers = document.querySelectorAll("#site-footer, [data-hide-floating]");
    if (blockers.length === 0) return;

    const sync = () => setFooterInView(footerVisibleNow());
    sync();

    const io = new IntersectionObserver(
      () => sync(),
      { rootMargin: "48px 0px 48px 0px", threshold: [0, 0.05, 0.15] },
    );
    blockers.forEach((el) => io.observe(el));
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const hiddenByFooter = footerInView;
  const hidden = hiddenByFooter || !scrolled;

  // На «Спасибо» своя кнопка WhatsApp — плавающая не нужна
  if (onThanks) return null;

  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в WhatsApp"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 flex size-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-float transition-[transform,opacity] duration-300 hover:scale-105 motion-reduce:transition-none",
        "sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:right-[max(1.5rem,env(safe-area-inset-right))] lg:size-14",
        hidden ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100",
        className,
      )}
    >
      <MessageCircle className="size-6 shrink-0" aria-hidden />
    </a>
  );
}
