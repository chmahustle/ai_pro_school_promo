import Image from "next/image";
import { ImageIcon, Play, Receipt, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceholderBadge } from "./PlaceholderBadge";

type MediaKind = "image" | "video" | "receipt" | "chat" | "logo";

interface MediaPlaceholderProps {
  /** Реальный src — если есть, рисуем картинку; иначе — заглушку с иконкой */
  src?: string | null;
  alt: string;
  kind?: MediaKind;
  aspect?: "square" | "video" | "portrait" | "wide" | "auto";
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Подпись внутри заглушки (напр. «Скриншот оплаты») */
  caption?: string;
  rounded?: string;
}

const aspects = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[9/16]",
  wide: "aspect-[16/7]",
  auto: "",
};

const icons: Record<MediaKind, typeof ImageIcon> = {
  image: ImageIcon,
  video: Play,
  receipt: Receipt,
  chat: MessageSquare,
  logo: ImageIcon,
};

/**
 * Универсальная медиа-ячейка: либо next/image, либо приметная заглушка с бейджем PLACEHOLDER.
 * Используется для фото учеников, чеков, скриншотов, обложек видео, логотипов.
 */
export function MediaPlaceholder({
  src,
  alt,
  kind = "image",
  aspect = "video",
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority,
  caption,
  rounded = "rounded-xl",
}: MediaPlaceholderProps) {
  const Icon = icons[kind];

  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-ink-100", aspects[aspect], rounded, className)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative grid place-items-center overflow-hidden bg-[repeating-linear-gradient(135deg,#ece9ff_0_12px,#f3f1ff_12px_24px)] text-ink-500",
        aspects[aspect],
        rounded,
        className,
      )}
    >
      <PlaceholderBadge note={`Нужно: ${alt}`} />
      <div className="flex flex-col items-center gap-2 p-4 text-center">
        <span className="grid size-11 place-items-center rounded-full bg-white/70">
          <Icon className="size-5" />
        </span>
        {caption && <span className="text-xs font-medium leading-tight">{caption}</span>}
      </div>
    </div>
  );
}
