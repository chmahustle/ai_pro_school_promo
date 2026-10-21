"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  as?: "div" | "section" | "ul" | "li" | "article";
};

/** Появление при скролле. Работает через whileInView, учитывает reduced-motion через MotionConfig. */
export function Reveal({ delay = 0, as = "div", children, ...rest }: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

type RevealGroupProps = HTMLMotionProps<"div"> & {
  staggerChildren?: number;
  delayChildren?: number;
  as?: "div" | "ul" | "ol" | "section";
};

/** Родитель, который по очереди показывает детей-<RevealItem/> */
export function RevealGroup({ staggerChildren = 0.08, delayChildren = 0, as = "div", children, ...rest }: RevealGroupProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      variants={stagger(staggerChildren, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </Comp>
  );
}

type RevealItemProps = HTMLMotionProps<"div"> & { as?: "div" | "li" | "article" };

export function RevealItem({ as = "div", children, ...rest }: RevealItemProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp variants={fadeUp} {...rest}>
      {children}
    </Comp>
  );
}
