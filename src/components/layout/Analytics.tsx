"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import type { ProductId } from "@/data/product-ids";
import { productIdForPath } from "@/data/product-ids";
import { analyticsIds, track, trackContact } from "@/lib/analytics";
import { captureUtm } from "@/lib/utm";

/** Домены WhatsApp: клик по ссылке на них = событие Contact */
const WHATSAPP_HOSTS = new Set(["wa.me", "api.whatsapp.com", "web.whatsapp.com"]);

/**
 * Подключение систем аналитики. Каждая — только если задан её ID в env; все скрипты — только в production
 * (в dev не грузятся), через next/script, strategy="afterInteractive".
 *   Meta Pixel · TikTok Pixel · GA4 · Яндекс.Метрика (с вебвизором; поля ввода скрыты классом ym-disable-keys).
 * Стартовый просмотр страницы отправляют сами скрипты инициализации; при смене маршрута — track("page_view").
 * Также захват UTM и событие Contact по клику на любую ссылку WhatsApp.
 */
export function Analytics() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    captureUtm();
  }, []);

  // Первый просмотр уже отправил скрипт инициализации; дальше — только смена маршрута
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    track({ name: "page_view", params: { path: pathname } });
  }, [pathname]);

  // Contact: клик по любой ссылке/кнопке WhatsApp. product — из data-product ссылки или из страницы.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      let host = "";
      try {
        host = new URL(a.href, window.location.href).hostname;
      } catch {
        return;
      }
      if (!WHATSAPP_HOSTS.has(host)) return;
      const product = (a.dataset.product as ProductId | undefined) ?? productIdForPath(window.location.pathname);
      trackContact({ product, page: window.location.pathname, channel: "whatsapp" });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // В dev скрипты аналитики не грузим
  if (process.env.NODE_ENV !== "production") return null;

  const { metaPixel, tiktokPixel, ga4, yandexMetrika } = analyticsIds;

  return (
    <>
      {metaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixel}');fbq('track','PageView');`}
        </Script>
      )}
      {tiktokPixel && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${tiktokPixel}');ttq.page();}(window,document,'ttq');`}
        </Script>
      )}
      {ga4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4}',{send_page_view:false});gtag('event','page_view',{page_path:location.pathname});`}
          </Script>
        </>
      )}
      {yandexMetrika && (
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${yandexMetrika},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true,defer:true});ym(${yandexMetrika},"hit",location.pathname+location.search);`}
        </Script>
      )}
    </>
  );
}
