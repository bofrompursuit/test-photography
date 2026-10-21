import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PEEK = 60; // px of header each waiting card shows below the active one
const LAND_STEP = 14; // px each landed card sits below the previous, so its edge shows
const MAX_STAGE = 760; // px; the deck never grows taller than this
const MIN_STAGE = 440; // px; below this (landscape phones) the deck becomes a plain list
const SCROLL_PER_CARD = 0.85; // scroll distance per card, as a fraction of the stage height
const GAP_BELOW_HEADER = 16; // px between the fixed site header and the pinned deck

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const pad = (n) => String(n + 1).padStart(2, "0");

/**
 * Stage geometry. `null` means "render the plain list".
 *
 * Re-measured only when the width changes: on phones the soft keyboard and the
 * collapsing address bar change the height constantly, and rebuilding the deck
 * for those threw the visitor out of the form they were typing in.
 */
function useStage(count) {
  const reduce = useReducedMotion();
  const measure = () => {
    const headerH = document.querySelector("[data-header]")?.offsetHeight ?? 72;
    const top = headerH + GAP_BELOW_HEADER;
    const height = Math.min(window.innerHeight - top - 24, MAX_STAGE);
    if (reduce || height < MIN_STAGE) return null;
    return { top, height, cardHeight: height - (count - 1) * PEEK };
  };
  const [stage, setStage] = useState(measure);

  useEffect(() => {
    let width = window.innerWidth;
    const update = () => setStage(measure());
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      update();
    };
    update();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [reduce, count]); // eslint-disable-line react-hooks/exhaustive-deps

  return stage;
}

function Backdrop({ statue, lit }) {
  return (
    <div
      aria-hidden="true"
      // Anchored to the top: classical sculpture is shot full-figure, and a
      // centred crop lands on the middle of the body rather than the face.
      className="absolute inset-0 bg-cover bg-top transition-[filter] duration-300"
      style={{
        backgroundImage: `${statue.photoLayer}${statue.marble}`,
        // Black-and-white by design: the front card lifts rather than colourises.
        filter: lit
          ? "grayscale(100%) brightness(1.08) contrast(1.08)"
          : "grayscale(100%) brightness(0.75)",
      }}
    />
  );
}

/** Numbered header strip; the only part of a waiting card that shows. */
function CardHeader({ index, label, blurb }) {
  return (
    <header
      className="relative flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-black/35 px-5 backdrop-blur-sm sm:px-7"
      style={{ height: PEEK }}
    >
      <h3 className="flex items-baseline gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-white sm:text-base">
        <span className="tabular-nums text-white/50">{pad(index)}</span>
        {label}
      </h3>
      <p className="hidden text-sm text-white/60 sm:block">{blurb}</p>
    </header>
  );
}

function CardBody({ panel }) {
  const { id, Card } = panel;
  return (
    <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-black/50 px-5 py-6 backdrop-blur-[2px] sm:px-8 sm:py-8">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-black/55 p-6 shadow-2xl backdrop-blur-md sm:p-8">
        <Card idPrefix={`connect-${id}`} />
      </div>
    </div>
  );
}

function DeckCard({ panel, index, count, progress, stage, isActive, onJump }) {
  const { cardHeight } = stage;

  // Waiting: header strips stacked under the active card, sliding up one PEEK
  // per card as the deck advances. Arriving: slides from the top of that stack
  // to its landing spot. Landed: stays put while later cards cover it.
  const y = useTransform(progress, (p) => {
    const land = index * LAND_STEP;
    if (index === 0) return 0;
    if (p <= index - 1) return cardHeight + (index - 1 - p) * PEEK;
    if (p < index) return land + (cardHeight - land) * (index - p);
    return land;
  });
  // Covered cards recede: shrink from the top edge and darken.
  const depth = useTransform(progress, (p) => clamp(p - index, 0, 2));
  const scale = useTransform(depth, (d) => 1 - d * 0.05);
  const shade = useTransform(depth, (d) => Math.min(d, 1) * 0.6);

  return (
    <motion.section
      aria-label={panel.label}
      style={{ y, scale, zIndex: index, height: cardHeight, transformOrigin: "50% 0%" }}
      className="absolute inset-x-0 top-0 flex flex-col overflow-hidden rounded-2xl bg-[var(--surface)] shadow-[0_-12px_40px_rgba(0,0,0,0.55)] ring-1 ring-white/10 ring-inset will-change-transform"
    >
      <Backdrop statue={panel.statue} lit={isActive} />
      <CardHeader index={index} label={panel.label} blurb={panel.blurb} />

      {/* Only the front card is reachable; the rest are layers to look at. */}
      <div inert={!isActive} aria-hidden={isActive ? undefined : "true"} className="flex min-h-0 flex-1 flex-col">
        <CardBody panel={panel} />
      </div>

      <motion.div aria-hidden="true" style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-black" />

      {!isActive && (
        <button
          type="button"
          data-cursor-target
          onClick={() => onJump(index)}
          className="absolute inset-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        >
          <span className="sr-only">Show {panel.label}</span>
        </button>
      )}
    </motion.section>
  );
}

/**
 * Sticky card deck: the stage pins under the site header while its wrapper
 * scrolls past, and scroll progress deals the cards one onto the next. Waiting
 * cards peek out below as numbered strips; covered cards shrink and darken.
 */
export default function StackedCards({ panels }) {
  const count = panels.length;
  const stage = useStage(count);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const raw = useMotionValue(0);
  // A light spring between scroll and cards, so they settle rather than track.
  const progress = useSpring(raw, { stiffness: 260, damping: 34, mass: 0.6 });
  const [active, setActive] = useState(0);
  // True while a field in the front card has focus. The deck holds still until
  // the visitor leaves the form: no dealing, no snapping, whatever the page
  // does as the keyboard opens or the browser scrolls the field into view.
  const locked = useRef(false);

  useMotionValueEvent(raw, "change", (p) => setActive(clamp(Math.round(p), 0, count - 1)));

  useEffect(() => {
    if (!stage || !wrapperRef.current) return undefined;
    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: `top top+=${stage.top}`,
      end: `bottom top+=${stage.top + stage.height}`,
      onUpdate: (self) => {
        if (!locked.current) raw.set(self.progress * (count - 1));
      },
      // Come to rest on a card, never halfway through a deal.
      snap: {
        snapTo: (value) =>
          locked.current ? value : Math.round(value * (count - 1)) / (count - 1),
        duration: { min: 0.2, max: 0.5 },
        delay: 0.12,
        ease: "power2.out",
      },
    });
    triggerRef.current = trigger;
    raw.set(trigger.progress * (count - 1));
    return () => {
      trigger.kill();
      triggerRef.current = null;
    };
  }, [stage, count, raw]);

  const isField = (el) => el?.matches?.("input, textarea, select, [contenteditable='true']");

  const onFocusIn = (event) => {
    if (isField(event.target)) locked.current = true;
  };

  const onFocusOut = (event) => {
    if (isField(event.relatedTarget) && wrapperRef.current?.contains(event.relatedTarget)) return;
    locked.current = false;
    // Catch up with wherever the page scrolled to while the form had focus,
    // then settle on the nearest whole card as the snap would have.
    const trigger = triggerRef.current;
    if (!trigger) return;
    raw.set(trigger.progress * (count - 1));
    if (trigger.isActive) jumpTo(Math.round(trigger.progress * (count - 1)));
  };

  const jumpTo = (index) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * (index / (count - 1)),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  // Short viewports and reduced motion: the same cards, simply stacked in flow.
  if (!stage) {
    return (
      <div className="flex flex-col gap-4">
        {panels.map((panel, index) => (
          <section
            key={panel.id}
            aria-label={panel.label}
            className="relative flex flex-col overflow-hidden rounded-2xl ring-1 ring-white/10 ring-inset"
          >
            <Backdrop statue={panel.statue} lit />
            <CardHeader index={index} label={panel.label} blurb={panel.blurb} />
            <CardBody panel={panel} />
          </section>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
      style={{ height: stage.height + (count - 1) * stage.height * SCROLL_PER_CARD }}
    >
      <div className="sticky" style={{ top: stage.top, height: stage.height }}>
        <div className="relative h-full">
          {panels.map((panel, index) => (
            <DeckCard
              key={panel.id}
              panel={panel}
              index={index}
              count={count}
              progress={progress}
              stage={stage}
              isActive={index === active}
              onJump={jumpTo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
