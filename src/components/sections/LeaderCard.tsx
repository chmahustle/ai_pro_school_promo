import { Avatar, Section } from "@/components/ui";

/**
 * «Ведёт …»: фото и имя ведущего из данных (products.ts → лестница направления), роль одной строкой (team.ts, только подтверждённая).
 * Биографию, факты и достижения не выводим: в данных нет согласия (consent) на публикацию.
 */
export function LeaderCard({ id, leader }: { id: string; leader: { name: string; photo: string | null; role?: string | null } }) {
  return (
    <Section aria-labelledby={id}>
      <div className="flex items-center gap-4 rounded-[28px] bg-surface p-5 shadow-soft sm:p-6">
        <Avatar name={leader.name} src={leader.photo} size="lg" />
        <div>
          <h2 id={id} className="font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-bold leading-tight">
            Ведёт {leader.name}
          </h2>
          {leader.role && <p className="mt-1 text-[14px] text-ink-500">{leader.role}</p>}
        </div>
      </div>
    </Section>
  );
}
