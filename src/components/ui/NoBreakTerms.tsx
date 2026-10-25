import { Fragment } from "react";

/** «вайб-кодинг» (с любой формой слова) не переносится по дефису: оборачиваем в nowrap-span */
export function NoBreakTerms({ text }: { text: string }) {
  return (
    <>
      {text.split(/([Вв]айб-кодинг[а-яё]*)/g).map((part, i) =>
        /^[Вв]айб-кодинг/.test(part) ? (
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
