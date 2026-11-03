import { getLegalInfo } from "@/data/public";
import { cn } from "@/lib/utils";

/**
 * Юридическая строка футера: «© {год} ТОО «…» · БИН …» одним элементом и ссылки на политику и оферту (внешние документы, новая вкладка).
 * Всё одним размером, весом и цветом, в одну строку по центру; на 375 px реквизиты сверху, ссылки под ними в столбик (тап-зона 44 px).
 * Общая для Footer и LandingFooter - значит, есть на каждом маршруте.
 */
export function LegalLine({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const l = getLegalInfo();
  const dark = tone === "dark";
  return (
    <div className={cn("flex flex-col text-[13px] font-normal leading-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6", dark ? "text-white/50" : "text-ink-500", className)}>
      <p>
        © {l.copyrightYear} {l.legalName} · <span className="whitespace-nowrap">БИН {l.bin}</span>
      </p>
      <ul className="flex flex-col sm:flex-row sm:items-center sm:gap-x-6">
        {l.docs.map((d) => (
          <li key={d.href}>
            <a
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("inline-flex min-h-11 items-center underline-offset-4 transition-colors hover:underline", dark ? "hover:text-white" : "hover:text-ink")}
            >
              {d.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
