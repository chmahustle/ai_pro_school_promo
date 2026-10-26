import "server-only";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { formatPrice, products } from "./products";

/**
 * Единая модель FAQ: { id, q, a, pages, verified }. Все вопросы сайта — здесь; страницы берут свои через getFaq(page).
 * Прод: только verified:true и непустой ответ. Dev: остальное с пометкой «ответ не подтверждён».
 * needsSchoolReview — ответ нужно подтвердить школой письменно (TODO.md → «FAQ: подтвердить школой»), пока verified:false, в проде скрыт.
 * Ответы самим не писать: пустой a и verified:false — ждём школу.
 */
export type FaqPage =
  | "home"
  | "about"
  | "courses"
  | "creator"
  | "vibecoding"
  | "vibecoding-efir"
  | "practicum"
  | "for-business"
  | "for-freelancers"
  | "for-career"
  | "ai-creator"
  | "vibecoding-offline"
  | "vibecoding-course";

export interface FaqEntry {
  id: string;
  q: string;
  /** Ответ; функция — ответ строится из products.ts при рендере (цены и названия не хардкодим) */
  a: string | (() => string);
  pages: FaqPage[];
  verified: boolean;
  needsSchoolReview?: boolean;
}

/** Публичная модель вопроса (в браузер не уходит ничего лишнего) */
export interface PublicFaqItem {
  id: string;
  q: string;
  a: string;
  /** Только dev: «ответ не подтверждён» */
  devNote?: string;
}

/**
 * «Что после эфира?»: следующие ступени направления вайб-кодинга с названием и ценой из products.ts (порядок ступеней по конфигу).
 */
function afterEfirAnswer(): string {
  const order = ["try", "project", "profession"];
  const next = products
    .filter((p) => p.direction === "vibecoding" && p.step !== "try")
    .sort((a, b) => order.indexOf(a.step) - order.indexOf(b.step));
  if (next.length === 0) return "";
  const list = next.map((p) => {
    const price = formatPrice(p);
    return price ? `${p.name} — ${price}` : p.name;
  });
  return `После эфира можно перейти на следующую ступень: ${list.join("; ")}.`;
}

export const faqEntries: FaqEntry[] = [
  { id: "general-no-tech", q: "Нужно ли техническое образование?", a: "Нет. Все программы рассчитаны на людей без IT-опыта. Мы сами не из IT-среды, поэтому даём только те инструменты, которые подходят обычным людям, и показываем всё пошагово.", pages: ["home", "about", "courses"], verified: true },
  { id: "general-tools", q: "На каких нейросетях проходит обучение?", a: "На понятных и доступных: ChatGPT, генераторы картинок и видео, конструкторы сайтов и ботов. На старте большую часть задач можно делать на бесплатных версиях.", pages: ["home", "about", "courses"], verified: true },
  { id: "general-time", q: "Сколько времени нужно в день?", a: "Минимум 2–3 часа в день, чтобы проходить уроки и делать практику. Формат совместим с основной работой и семьёй.", pages: ["home", "about", "courses"], verified: true },
  { id: "general-first-money", q: "Когда можно получить первые деньги?", a: "Первые заказы ученики берут ещё во время обучения — всё зависит от вашей активности. Мы не обещаем пассивный доход: это навык, который продаётся как услуга.", pages: ["home", "about", "courses"], verified: false, needsSchoolReview: true },
  { id: "general-orders", q: "Вы помогаете с заказами?", a: "Да. У школы есть собственная платформа ИИ-креаторов Strimmeo, список Telegram-сообществ с заказами и поддержка команды на старте.", pages: ["home", "about", "courses"], verified: false, needsSchoolReview: true },
  { id: "general-which", q: "С чего начать, если я совсем новичок?", a: "С 7-дневного практикума по вирусным роликам: это недорогой способ попробовать формат и понять, подходит ли вам такой заработок. Дальше — курс AI Content Creator или вайб-кодинг.", pages: ["home", "about", "courses"], verified: true },
  { id: "general-abroad", q: "Я не из Казахстана, подойдёт ли мне?", a: "Да. У нас много учеников из других стран. Нейросети работают с VPN, обучение проходит онлайн, оплата возможна из-за рубежа.", pages: ["home", "about", "courses"], verified: true },
  { id: "directions-diff", q: "Чем отличаются направления?", a: "", pages: ["home", "courses"], verified: false },
  { id: "kaspi", q: "Есть ли рассрочка Kaspi и какой платёж?", a: "", pages: ["home", "courses", "vibecoding-course"], verified: false },
  { id: "no-result", q: "Что если не получится / условия возврата?", a: "", pages: ["home", "courses", "vibecoding-offline", "vibecoding-course"], verified: false },
  { id: "laptop", q: "Нужен ли мощный ноутбук?", a: "", pages: ["vibecoding", "vibecoding-efir"], verified: false },
  { id: "offline-where", q: "Где проходит офлайн-урок?", a: "Офлайн-урок проходит в Astana Hub.", pages: ["vibecoding", "vibecoding-offline"], verified: true },
  { id: "practicum-vs-ai-creator", q: "Чем практикум отличается от курса AI Content Creator?", a: "", pages: ["creator"], verified: false },
  { id: "practicum-blog", q: "Нужно ли вести личный аккаунт?", a: "Нет. Можно делать ролики как услугу для клиентов, без ведения блога и съёмки себя. Мы расскажем, как находить клиентов без блога.", pages: ["practicum"], verified: true },
  { id: "practicum-paid", q: "Нужны ли платные нейросети?", a: "Нет. На старте работаем на бесплатных версиях — этого достаточно, чтобы делать 1 ролик в день.", pages: ["practicum"], verified: true },
  { id: "practicum-time", q: "Сколько времени занимает практикум?", a: "Поначалу 3–4 часа, потом 2–3 часа в день. Некоторые ученики делают ролик за 20 минут.", pages: ["practicum"], verified: true },
  { id: "practicum-record", q: "Будет ли запись? Я не смогу быть онлайн", a: "Да, записи всех эфиров доступны 30 дней.", pages: ["practicum"], verified: true },
  { id: "practicum-vpn", q: "Работают ли бесплатные нейросети в Казахстане и других странах?", a: "Да, с VPN. У нас много учеников из других стран.", pages: ["practicum"], verified: true },
  { id: "ai-creator-edu", q: "Нужно ли техническое образование?", a: "Нет. Курс рассчитан на людей без IT-опыта. Всё показываем пошагово.", pages: ["ai-creator"], verified: true },
  { id: "ai-creator-tools", q: "На каких нейросетях проходит обучение?", a: "На понятных и доступных инструментах. Большую часть задач можно делать без платных подписок.", pages: ["ai-creator"], verified: true },
  { id: "ai-creator-time", q: "Сколько времени нужно в день?", a: "Минимум 2–3 часа в день, чтобы проходить уроки и выполнять практику.", pages: ["ai-creator"], verified: true },
  { id: "ai-creator-newbie", q: "Подойдёт, если я раньше не зарабатывал(а) на ИИ?", a: "Да, курс построен от нуля: сначала выбор направления, потом практика и первые заказы.", pages: ["ai-creator"], verified: true },
  { id: "ai-creator-money", q: "Когда можно получить первые деньги?", a: "Первые заказы ученики берут уже во время обучения, всё зависит от вашей активности.", pages: ["ai-creator"], verified: false, needsSchoolReview: true },
  { id: "ai-creator-orders", q: "Вы помогаете с заказами?", a: "Да. В курсе есть поддержка школы и доступ к возможностям брать проекты.", pages: ["ai-creator"], verified: false, needsSchoolReview: true },
  { id: "ai-creator-passive", q: "Это пассивный доход?", a: "Нет. Это навык, который продаётся как услуга. Зато результат — реальный доход и понятный рост, а не случайные заказы.", pages: ["ai-creator"], verified: true },
  { id: "vibecoding-what", q: "Что такое вайб-кодинг?", a: "Способ создавать рабочие продукты — сайты, ботов, автоматизации — описывая задачу ИИ на обычном языке, без написания кода вручную.", pages: ["vibecoding", "vibecoding-efir"], verified: true },
  { id: "vibecoding-edu", q: "Нужно ли уметь программировать?", a: "Нет. Достаточно понимать свой бизнес или свою работу и уметь формулировать задачу. Остальное показываем.", pages: ["vibecoding", "vibecoding-efir"], verified: true },
  { id: "vibecoding-participation", q: "Что нужно для участия?", a: "Ноутбук и желание. Все инструменты — доступные, многие с бесплатным тарифом.", pages: ["vibecoding", "vibecoding-efir"], verified: true },
  { id: "vibecoding-after", q: "Что после эфира?", a: afterEfirAnswer, pages: ["vibecoding", "vibecoding-efir"], verified: true },
  { id: "business-code", q: "Нужно ли уметь программировать?", a: "Нет. Достаточно понимать свой бизнес и его задачи. На эфире покажем, как ставить задачу ИИ, чтобы получить работающий результат.", pages: ["for-business"], verified: true },
  { id: "business-real", q: "Это реально работает или маркетинг?", a: "Покажем вживую на экране: от задачи до рабочего бота или сайта. Вы сами увидите, где вайб-кодинг подходит, а где нужен разработчик.", pages: ["for-business"], verified: false, needsSchoolReview: true },
  { id: "business-who", q: "Кто проводит эфир?", a: "Надира Батырбаева — основатель школы, и Майдан Найманов — ML-инженер и AI-архитектор со 100+ коммерческими проектами.", pages: ["for-business"], verified: true },
  { id: "business-after", q: "Что я получу после эфира?", a: "Гайд «25 задач бизнеса с вайб-кодингом» и понимание, какие процессы автоматизировать первыми.", pages: ["for-business"], verified: true },
  { id: "freelancers-code", q: "Я не разработчик. Точно получится?", a: "Да. Вайб-кодинг — это постановка задачи ИИ на обычном языке. Ваши текущие навыки (понимание клиента, маркетинг, контент) здесь важнее кода.", pages: ["for-freelancers"], verified: true },
  { id: "freelancers-price", q: "Сколько стоят такие услуги на рынке?", a: "На эфире разберём реальные чеки за ботов, сайты и автоматизации — и как их обосновать клиенту.", pages: ["for-freelancers"], verified: false, needsSchoolReview: true },
  { id: "freelancers-clients", q: "Где искать первых заказчиков?", a: "Начать стоит с текущих клиентов — у них уже есть доверие к вам. Плюс расскажем про сообщества и платформу школы.", pages: ["for-freelancers"], verified: false, needsSchoolReview: true },
  { id: "freelancers-after", q: "Что после эфира?", a: afterEfirAnswer, pages: ["for-freelancers"], verified: true },
  { id: "career-code", q: "У меня нет IT-образования. Это для меня?", a: "Да. Эфир рассчитан на специалистов из любых сфер: бухгалтерия, HR, продажи, маркетинг, логистика. Код писать не нужно.", pages: ["for-career"], verified: true },
  { id: "career-job", q: "Не заменит ли AI меня самого?", a: "Заменит тех, кто им не пользуется. Специалист, который автоматизирует рутину и берёт на себя больше, становится ценнее.", pages: ["for-career"], verified: true },
  { id: "career-tools", q: "Какие инструменты понадобятся?", a: "Ноутбук и доступные AI-сервисы, многие с бесплатным тарифом. Всё покажем на эфире.", pages: ["for-career"], verified: true },
  { id: "career-after", q: "Что после эфира?", a: afterEfirAnswer, pages: ["for-career"], verified: true },
];

const resolve = (a: FaqEntry["a"]): string => (typeof a === "function" ? a() : a);

/**
 * Вопросы страницы. Прод: verified && !needsSchoolReview && непустой ответ. Dev: остальные тоже, с devNote.
 * limit — первые N показанных.
 */
export function getFaq(page: FaqPage, opts?: { limit?: number }): PublicFaqItem[] {
  const out: PublicFaqItem[] = [];
  for (const e of faqEntries) {
    if (!e.pages.includes(page)) continue;
    const a = resolve(e.a);
    const confirmed = e.verified && !e.needsSchoolReview && a.trim() !== "";
    if (confirmed) out.push({ id: e.id, q: e.q, a });
    else if (SHOW_PLACEHOLDERS) out.push({ id: e.id, q: e.q, a, devNote: "ответ не подтверждён" });
  }
  return opts?.limit ? out.slice(0, opts.limit) : out;
}
