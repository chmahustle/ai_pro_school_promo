import { Fragment } from "react";

/** Составные слова с «ИИ-» и «вайб-» (ИИ-ролики, вайб-кодинг, ИИ-агент…): дефис не переносит строку */
const COMPOUND = /((?:ИИ|Вайб|вайб)-[А-Яа-яЁёA-Za-z]+)/g;

/** Общая функция: оборачивает такие слова в nowrap-span. Применять к названиям и подписям в шапке и меню. */
export function NoBreakTerms({ text }: { text: string }) {
  return (
    <>
      {text.split(COMPOUND).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
