import { buildMetadata } from "@/lib/seo";
import { Placeholder, Section, SectionHead } from "@/components/ui";
import { company } from "@/data/company";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Политика конфиденциальности",
  description: "Политика обработки персональных данных AI Pro School.",
  path: "/privacy",
  noIndex: true,
});

/**
 * TODO(клиент/юрист): заменить на утверждённый текст политики в соответствии с
 * Законом РК «О персональных данных и их защите». Ниже — структурный шаблон.
 */
export default function PrivacyPage() {
  return (
    <Section>
      <SectionHead as="h1" eyebrow="Документы" title="Политика конфиденциальности" />
      <Placeholder note="TODO: юридически выверенный текст политики">
        <article className="prose-aps max-w-3xl space-y-6 rounded-2xl bg-surface p-6 text-[15px] leading-relaxed text-ink-700 shadow-soft sm:p-10">
          <p className="text-ink-500">
            Редакция от {new Date().toLocaleDateString("ru-RU")}.{SHOW_PLACEHOLDERS && !company.privacyApproved ? " Шаблон — требует утверждения." : ""}
          </p>
          <h2 className="font-display text-xl">1. Оператор данных</h2>
          <p>
            {site.legalName} (далее — «Школа»). Контакты: {site.phones.primary}{site.email ? `, ${site.email}` : ""}.
          </p>
          <h2 className="font-display text-xl">2. Какие данные мы собираем</h2>
          <p>Имя, номер телефона, выбранное направление обучения, комментарий, технические данные (UTM-метки, страница входа, cookie аналитических сервисов).</p>
          <h2 className="font-display text-xl">3. Цели обработки</h2>
          <p>Связь с вами по заявке, отправка материалов (ссылка на эфир, гайд), информирование о программах, аналитика эффективности рекламы.</p>
          <h2 className="font-display text-xl">4. Передача третьим лицам</h2>
          <p>CRM-система, мессенджеры (WhatsApp, Telegram), сервисы аналитики (Meta, TikTok, Google, Яндекс) — только в объёме, необходимом для указанных целей.</p>
          <h2 className="font-display text-xl">5. Срок хранения и отзыв согласия</h2>
          <p>Данные хранятся до достижения целей обработки или отзыва согласия. Отозвать согласие можно, написав в WhatsApp или на e-mail Школы.</p>
          <h2 className="font-display text-xl">6. Публичная оферта</h2>
          <p>
            Условия оказания услуг —{" "}
            <a href={site.legacyOfferUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 underline-offset-4 hover:underline">
              публичная оферта
            </a>
            .
          </p>
        </article>
      </Placeholder>
    </Section>
  );
}
