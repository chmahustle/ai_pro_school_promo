"use client";

import { Button } from "@/components/ui";
import { track } from "@/lib/analytics";

/** Кнопка под программой: «Занять место» + цена эфира в розовой пилюле (как в hero), заливка при наведении - как у кнопок со стрелкой */
export function TimelineCta({ label, price, href }: { label: string; price: string; href: string }) {
  return (
    <Button
      variant="dark"
      size="md"
      href={href}
      icon={
        price ? (
          <span className="whitespace-nowrap rounded-pill bg-brand px-3 py-1 text-[13px] font-bold text-white transition-colors duration-300 group-hover:bg-white group-hover:text-brand">{price}</span>
        ) : undefined
      }
      className={price ? "gap-4 pl-6 pr-3" : undefined}
      onClick={() => track({ name: "cta_click", params: { label, location: "landing-program" } })}
    >
      {label}
    </Button>
  );
}
