import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IntakeForm from "./IntakeForm";
import { FAQ, NEXT, SECTION } from "./config";

function Eyebrow({ children }) {
  return (
    <p className="eyebrow">{children}</p>
  );
}

// Two-tone headline, echoing the hero's white-and-grey type.
function AccentTitle({ title, className = "" }) {
  return (
    <h2
      className={`text-[clamp(2rem,6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white ${className}`}
    >
      {title.before}
      <span className="text-white/40">{title.accent}</span>
      {title.after}
    </h2>
  );
}

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const buttonId = `sp-faq-q-${index}`;
  const panelId = `sp-faq-a-${index}`;
  return (
    <div className="border-b border-white/10">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          data-cursor-target
          className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold text-white transition-colors hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {item.q}
          {/* A plus that turns 45° into a cross when open. */}
          <span
            aria-hidden="true"
            className={`relative size-4 shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          >
            <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded bg-current" />
            <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 rounded bg-current" />
          </span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
        <p className="pb-6 pr-10 text-[15px] leading-relaxed text-white/55">{item.a}</p>
      </div>
    </div>
  );
}

export default function StarterProjectSection() {
  const rootRef = useRef(null);

  // This section changes height as steps and FAQ answers open and close, which
  // would leave the ScrollTriggers in the Contact section below aiming at stale
  // offsets. Re-measure them whenever this section resizes.
  useEffect(() => {
    if (!rootRef.current || typeof ResizeObserver === "undefined") return undefined;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(rootRef.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <header className="max-w-4xl">
        <Eyebrow>{SECTION.eyebrow}</Eyebrow>
        <AccentTitle title={SECTION.title} />
        <p className="mt-6 max-w-2xl text-[clamp(1rem,1.6vw,1.125rem)] leading-relaxed text-white/55">{SECTION.intro}</p>
      </header>

      <div className="mt-[clamp(36px,6vh,64px)] max-w-[880px]">
        <IntakeForm />
      </div>

      <div className="mt-[clamp(72px,12vh,128px)]">
        <AccentTitle title={NEXT.title} />
        <ol className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {NEXT.items.map((item) => (
            <li key={item.n}>
              <p className="eyebrow !mb-0">{item.n}</p>
              <hr className="mt-4 border-0 border-t border-white/10" />
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/55">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-[clamp(72px,12vh,128px)] grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <Eyebrow>{FAQ.eyebrow}</Eyebrow>
          <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] font-semibold leading-[1.05] tracking-tight text-white">
            {FAQ.title}
          </h2>
        </div>
        <div className="border-t border-white/10">
          {FAQ.items.map((item, i) => (
            <FaqItem key={item.q} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
