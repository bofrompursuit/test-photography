import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Apple Wallet-style stack. At rest the passes overlap so only each header
 * shows and the last pass is fully visible. Tapping a pass brings it to the
 * top, fully open, and tucks the others beneath it, headers showing; tapping
 * its header again puts it back. No scroll pinning: the stack sits in the page.
 */

const PEEK = 60; // px of header each stacked pass shows
const TUCK_GAP = 16; // px between the open pass and the tucked stack

// Wallet pass proportions: one phone-width column, taller than wide.
export const PASS_MAX_WIDTH = 400; // px
const PASS_RATIO = 1.5; // height / width
const PASS_MIN_HEIGHT = 500; // px; enough for the contact form without scrolling inside the card

const pad = (n) => String(n + 1).padStart(2, "0");

function usePassHeight(ref) {
  const [height, setHeight] = useState(PASS_MIN_HEIGHT);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () =>
      setHeight(Math.max(PASS_MIN_HEIGHT, Math.round(el.clientWidth * PASS_RATIO)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return height;
}

function Backdrop({ panel, lit }) {
  const { statue, theme } = panel;
  // Branded passes bring their own solid colour instead of the marble photo.
  if (theme) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-[filter] duration-300"
        style={{ background: theme.background, filter: lit ? "none" : "brightness(0.8)" }}
      />
    );
  }
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
function CardHeader({ index, panel }) {
  const { label, blurb, theme } = panel;
  return (
    <header
      className={`relative flex shrink-0 items-center justify-between gap-3 border-b px-5 ${
        theme ? "border-black/15" : "border-white/10 bg-black/35 backdrop-blur-sm"
      }`}
      style={{ height: PEEK, color: theme?.foreground, borderColor: theme?.divider }}
    >
      <h3
        className={`flex items-baseline gap-3 text-sm font-semibold uppercase tracking-[0.28em] ${theme ? "" : "text-white"}`}
        style={theme ? { fontFamily: theme.font } : undefined}
      >
        <span className={`tabular-nums ${theme ? "opacity-55" : "text-white/50"}`}>{pad(index)}</span>
        {label}
      </h3>
      {/* Pass-style header: the blurb sits on the right like a wallet card's field. */}
      <p className={`truncate text-xs ${theme ? "opacity-70" : "text-white/60"}`}>{blurb}</p>
    </header>
  );
}

function CardBody({ panel }) {
  const { id, Card, theme } = panel;
  if (theme) {
    return (
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
        <Card idPrefix={`connect-${id}`} />
      </div>
    );
  }
  return (
    <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-black/50 px-4 py-5 backdrop-blur-[2px]">
      <div className="w-full rounded-2xl border border-white/15 bg-black/55 p-5 shadow-2xl backdrop-blur-md">
        <Card idPrefix={`connect-${id}`} />
      </div>
    </div>
  );
}

export default function StackedCards({ panels }) {
  const count = panels.length;
  const wrapperRef = useRef(null);
  const cardHeight = usePassHeight(wrapperRef);
  const [open, setOpen] = useState(null); // index of the opened pass, or null for the stack
  const reduce = useReducedMotion();

  // Where each pass sits, and which one can be used.
  const front = open ?? count - 1;
  const layout = panels.map((_, i) => {
    if (open === null) return i * PEEK;
    if (i === open) return 0;
    const order = i < open ? i : i - 1; // position among the tucked passes
    return cardHeight + TUCK_GAP + order * PEEK; // full header shows, so it can be tapped
  });
  const height =
    open === null
      ? (count - 1) * PEEK + cardHeight
      : cardHeight + TUCK_GAP + (count - 1) * PEEK;

  const choose = (i) => {
    setOpen((current) => (current === i ? null : i));
    // Bring the top of the stack into view if it has scrolled off.
    const top = wrapperRef.current?.getBoundingClientRect().top ?? 0;
    const headerH = document.querySelector("[data-header]")?.offsetHeight ?? 72;
    if (top < headerH) {
      window.scrollBy({ top: top - headerH - 16, behavior: reduce ? "auto" : "smooth" });
    }
  };

  // Each lower pass sits over the one above, leaving that one's header visible.
  const zFor = (i) => (i === open ? count + 1 : i);

  return (
    <motion.div
      ref={wrapperRef}
      // Clip to the stack: tucked passes are full height and must not spill
      // into the section below.
      className="relative mx-auto w-full overflow-hidden rounded-[22px]"
      style={{ maxWidth: PASS_MAX_WIDTH }}
      initial={false}
      animate={{ height }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 34 }}
    >
      {panels.map((panel, index) => {
        const isFront = index === front;
        return (
          <motion.section
            key={panel.id}
            aria-label={panel.label}
            initial={false}
            animate={{ y: layout[index] }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 34 }}
            style={{ zIndex: zFor(index), height: cardHeight }}
            className="absolute inset-x-0 top-0 flex flex-col overflow-hidden rounded-[22px] bg-[var(--surface)] shadow-[0_-8px_28px_rgba(0,0,0,0.5)] ring-1 ring-white/10 ring-inset"
          >
            <Backdrop panel={panel} lit />
            <div className="relative">
              <CardHeader index={index} panel={panel} />
              {/* Header tap: open this pass, or put the open one back. */}
              <button
                type="button"
                data-cursor-target
                onClick={() => choose(index)}
                aria-expanded={open === index}
                className="absolute inset-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
              >
                <span className="sr-only">
                  {open === index ? `Close ${panel.label}` : `Open ${panel.label}`}
                </span>
              </button>
            </div>

            {/* Only the front pass is usable; the rest are layers to tap. */}
            <div
              inert={!isFront}
              aria-hidden={isFront ? undefined : "true"}
              className="flex min-h-0 flex-1 flex-col"
            >
              <CardBody panel={panel} />
            </div>

            {!isFront && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => choose(index)}
                className="absolute inset-0 top-[60px] cursor-pointer"
              >
                <span className="sr-only">Open {panel.label}</span>
              </button>
            )}
          </motion.section>
        );
      })}
    </motion.div>
  );
}
