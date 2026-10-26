import { Avatar, Section } from "@/components/ui";

/** «Ведёт …»: фото и имя ведущего из данных (products.ts → лестница направления), без биографии — пока её нет у школы */
export function LeaderCard({ id, leader }: { id: string; leader: { name: string; photo: string | null } }) {
  return (
    <Section aria-labelledby={id}>
      <div className="flex items-center gap-4 rounded-[28px] bg-surface p-5 shadow-soft sm:p-6">
        <Avatar name={leader.name} src={leader.photo} size="lg" />
        <h2 id={id} className="font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-bold leading-tight">
          Ведёт {leader.name}
        </h2>
      </div>
    </Section>
  );
}
