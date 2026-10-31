"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { formatTenge } from "@/lib/utils";

export interface PaybackCalcConfig {
  title: string;
  fields: { id: "spend" | "missed" | "check"; label: string; initial: number }[];
  /** Во сколько в месяц обходится свой бот (₸): вычитается из текущих расходов */
  ownBotCost: number;
  weeksPerMonth: number;
  disclaimer: string;
}

const MAX_DIGITS = 9;
const digits = (v: string) => v.replace(/\D/g, "").slice(0, MAX_DIGITS);
/** «60000» → «60 000» (неразрывные пробелы, чтобы разряды не рвались) */
const group = (v: string) => v.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/**
 * Калькулятор потерь: переплата подрядчикам и подпискам (расходы минус свой бот) + упущенные заявки
 * (заявок в неделю × недель в месяце × средний чек). Значения по умолчанию, цена своего бота и недели - из данных.
 * Результат - пример расчёта, а не гарантия (подпись внизу).
 */
export function PaybackCalcCard({ config, price }: { config: PaybackCalcConfig; price: string }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map((f) => [f.id, String(f.initial)])),
  );
  const n = (id: string) => Number(values[id] || 0);

  const overpay = Math.max(0, n("spend") - config.ownBotCost);
  const missedSum = n("missed") * config.weeksPerMonth * n("check");
  const total = overpay + missedSum;

  return (
    <div className="flex w-full flex-col rounded-[24px] bg-surface p-5 ring-1 ring-ink-100 sm:p-6">
      <h3 className="font-display text-[19px] font-bold leading-tight text-ink">{config.title}</h3>

      <div className="mt-3 flex flex-col gap-3">
        {config.fields.map((f) => (
          <Input
            key={f.id}
            label={f.label}
            inputMode="numeric"
            autoComplete="off"
            value={group(values[f.id] ?? "")}
            onChange={(e) => setValues((v) => ({ ...v, [f.id]: digits(e.target.value) }))}
            className="h-11 rounded-2xl border-transparent bg-bg font-semibold tabular-nums"
          />
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-success/10 p-4" aria-live="polite">
        <p className="text-[13px] text-ink-700">Вы теряете примерно</p>
        <p className="mt-1 font-display text-[clamp(1.5rem,1.2rem+1.4vw,2rem)] font-extrabold leading-none text-success">
          <span className="whitespace-nowrap">{formatTenge(total)}</span> в месяц
        </p>
        <p className="mt-2 text-[12.5px] leading-snug text-ink-700">
          Переплата подрядчикам <span className="whitespace-nowrap">{formatTenge(overpay)}</span> + упущенные заявки{" "}
          <span className="whitespace-nowrap">{formatTenge(missedSum)}</span>. За год <span className="whitespace-nowrap">{formatTenge(total * 12)}</span>
          {price ? (
            <>
              , эфир стоит <span className="whitespace-nowrap">{price}</span>
            </>
          ) : null}
          .
        </p>
      </div>
      <p className="mt-2 text-[11.5px] leading-snug text-ink-500">{config.disclaimer}</p>
    </div>
  );
}
