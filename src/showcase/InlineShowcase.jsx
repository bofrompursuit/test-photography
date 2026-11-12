import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ShowcaseImage from "./ShowcaseImage";

const EASE = [0.65, 0, 0.35, 1];
const TRANSITION = { duration: 1.2, ease: EASE };

/**
 * Thumbnail height drives every proportion of the nav strip, so it is derived
 * from the width the strip may use: padding (0.15h each side) + gaps (0.15h)
 * + the active thumb (1.3h) + the square ones. On narrow phones it bottoms out
 * at a tappable size and the strip scrolls sideways instead of shrinking further.
 */
const MIN_THUMB = 44;
const MAX_THUMB = 104;
const thumbHeightFor = (width, count) => {
  const factor = 0.15 * 2 + 0.15 * (count - 1) + 1.3 + (count - 1);
  return Math.max(MIN_THUMB, Math.floor(Math.min(MAX_THUMB, (width * 0.9) / factor)));
};

/** Thumb height from the section's own width, so it fits whatever column it sits in. */
function useThumbHeight(ref, count) {
  const [height, setHeight] = useState(MAX_THUMB);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(thumbHeightFor(el.clientWidth, count));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, count]);

  return height;
}

/**
 * One Work subsection, shown in place: the active project fills the panel's
 * background, with its details, a thumbnail strip, a visit link and arrows.
 * Replaces the old card marquee + fullscreen overlay, so nothing opens on top.
 */
export default function InlineShowcase({ category, tabs = null, lead = null }) {
  const items = category.items;
  const [index, setIndex] = useState(0);
  const sectionRef = useRef(null);
  const stripRef = useRef(null);
  const thumbHeight = useThumbHeight(sectionRef, items.length);

  const gap = thumbHeight * 0.15;
  const containerRadius = thumbHeight * 0.18;
  const thumbRadius = thumbHeight * 0.1;

  // A new group (tab switch) starts at its first project.
  useEffect(() => setIndex(0), [category.id]);

  const go = useCallback(
    (delta) => setIndex((i) => (i + delta + items.length) % items.length),
    [items.length]
  );

  // Keep the active thumbnail in view when the strip scrolls sideways on phones.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[index];
    if (!strip || !thumb || strip.scrollWidth <= strip.clientWidth) return;
    const target = thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2;
    strip.scrollTo({ left: target, behavior: "smooth" });
  }, [index, thumbHeight]);

  // Arrow keys only while focus is inside this panel, so three panels never fight.
  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };

  // Guard the one render between a tab switch and the index reset.
  const active = items[index] ?? items[0];

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label={category.title}
      onKeyDown={onKeyDown}
      className="relative isolate flex min-h-[640px] w-full flex-col items-center justify-center overflow-hidden bg-black px-5 py-14 text-center sm:min-h-[760px] sm:px-8 sm:py-20"
    >
      {/* Background: the active project, cross-faded in step with the strip */}
      <AnimatePresence initial={false}>
        <motion.div
          key={active.url}
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={TRANSITION}
        >
          <ShowcaseImage src={active.image} gradient={active.gradient} alt="" />
        </motion.div>
      </AnimatePresence>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/75"
      />

      {/* Category header + active project details */}
      <div className="w-full">
        {/* Optional link shown top-centre, above the tab row. */}
        {lead && <div className="mb-5 flex justify-center sm:mb-6">{lead}</div>}
        {/* With tabs, the tab row names the group; without, a plain heading does. */}
        {tabs ?? (
          <h3 className="text-[0.7rem] uppercase tracking-[0.2em] text-white/60">
            {category.title}
          </h3>
        )}
        <p className="mx-auto mt-2 text-sm text-white/55">{category.subtitle}</p>

        <div className="mt-6 min-h-[7.5rem] sm:mt-8 sm:min-h-[9rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.url}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <p className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                {active.title}
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm text-white/75 sm:text-base">
                {active.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Glass thumbnail strip; scrolls sideways when it can't fit */}
      <div className="mt-6 flex w-full justify-center sm:mt-8">
        <div
          ref={stripRef}
          className="flex max-w-full items-center overflow-x-auto border border-white/10 bg-white/10 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ gap: `${gap}px`, padding: `${gap}px`, borderRadius: `${containerRadius}px` }}
        >
          {items.map((item, i) => {
            const isActive = i === index;
            return (
              <motion.button
                key={item.url}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${item.title}`}
                aria-current={isActive}
                className="relative shrink-0 overflow-hidden"
                style={{ height: `${thumbHeight}px`, borderRadius: `${thumbRadius}px` }}
                initial={false}
                animate={{
                  width: isActive ? thumbHeight * 1.3 : thumbHeight,
                  opacity: isActive ? 1 : 0.55,
                }}
                transition={TRANSITION}
                whileHover={{ opacity: 1 }}
              >
                <ShowcaseImage src={item.image} gradient={item.gradient} alt="" />
                {isActive && (
                  <motion.span
                    layoutId={`thumb-ring-${category.id}`}
                    className="absolute inset-0 border-2 border-white/80"
                    style={{ borderRadius: `${thumbRadius}px` }}
                    transition={TRANSITION}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Visit link + arrows */}
      <div className="mt-8 flex flex-col items-center gap-5 sm:mt-10">
        <a
          href={active.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/85"
        >
          Visit {active.title}
        </a>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={`Previous project in ${category.title}`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            ←
          </button>
          <span className="text-xs tabular-nums text-white/60" aria-live="polite">
            {index + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={`Next project in ${category.title}`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
