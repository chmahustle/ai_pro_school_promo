/**
 * Строки интерфейса (навигация, кнопки, подписи). Контент страниц лежит в src/data.
 * Для KZ: скопировать в kz.ts и перевести; отсутствующие ключи подхватятся из RU.
 */
export const ru = {
  nav: {
    directions: "Направления",
    forWhom: "Для кого",
    courses: "Курсы",
    results: "Результаты",
    about: "О нас",
    blog: "Блог",
    contacts: "Контакты",
    login: "Вход",
    apply: "Оставить заявку",
    pickProgram: "Подобрать программу",
    menu: "Меню",
    close: "Закрыть",
    allCourses: "Все курсы",
    language: "Язык",
  },
  common: {
    learnMore: "Подробнее",
    getStarted: "Начать",
    apply: "Оставить заявку",
    register: "Зарегистрироваться",
    freeRegister: "Зарегистрироваться бесплатно",
    watchAll: "Смотреть все",
    back: "Назад",
    viewProgram: "Программа",
    more: "Ещё",
    free: "Бесплатно",
    perMonth: "в месяц",
    installment: "в рассрочку",
    full: "полностью",
    whatsapp: "Написать в WhatsApp",
    telegram: "Написать в Telegram",
    writeUs: "Написать нам",
  },
  form: {
    name: "Имя",
    namePlaceholder: "Как к вам обращаться",
    phone: "Телефон",
    phonePlaceholder: "+7 (7__) ___-__-__",
    interest: "Что интересует",
    comment: "Комментарий",
    commentPlaceholder: "Необязательно",
    consent: "Соглашаюсь на обработку персональных данных",
    consentLink: "политикой конфиденциальности",
    submit: "Отправить заявку",
    submitting: "Отправляем…",
    success: "Заявка отправлена",
    error: "Не получилось отправить. Попробуйте ещё раз или напишите в WhatsApp.",
    whatsappHint: "Ссылка и материалы придут в WhatsApp",
  },
  footer: {
    rights: "Все права защищены",
    offer: "Публичная оферта",
    privacy: "Политика конфиденциальности",
    resident: "Резидент Astana Hub",
  },
  badges: {
    placeholder: "PLACEHOLDER",
    unverified: "UNVERIFIED",
    todo: "TODO",
  },
};

/** Рекурсивно превращает литералы в string, чтобы другие локали могли подставлять свои значения */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Dictionary = Widen<typeof ru>;
