import { useRef, useState } from "react";
import { motion } from "framer-motion";
import InlineShowcase from "./InlineShowcase";

/** Short tab names; the full category title stays as each panel's aria-label. */
const SHORT_LABELS = {
  passion: "Passion + Partners",
  b2b: "B2B Builds",
  collabo: 'Colla"BO"ration',
};

/**
 * All Work subsections in one panel: a tab row picks the group, and the panel
 * below shows that group's projects in place. Switching tabs starts the group
 * at its first project.
 */
export default function WorkShowcase({ categories, lead = null }) {
  const [activeId, setActiveId] = useState(categories[0].id);
  const tabRefs = useRef([]);
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  // Standard tablist keys: left/right move between tabs and select them.
  const onTabKey = (event, i) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    event.stopPropagation(); // don't also flip projects in the panel
    const next = (i + step + categories.length) % categories.length;
    setActiveId(categories[next].id);
    tabRefs.current[next]?.focus();
  };

  const tabs = (
    <div
      role="tablist"
      aria-label="Work"
      className="mx-auto inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/15 bg-black/35 p-1 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((category, i) => {
        const selected = category.id === activeId;
        return (
          <button
            key={category.id}
            ref={(el) => (tabRefs.current[i] = el)}
            type="button"
            role="tab"
            id={`work-tab-${category.id}`}
            aria-selected={selected}
            aria-controls="work-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => setActiveId(category.id)}
            onKeyDown={(event) => onTabKey(event, i)}
            className={`relative shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium transition-colors sm:px-5 sm:text-sm ${
              selected ? "text-black" : "text-white/70 hover:text-white"
            }`}
          >
            {selected && (
              <motion.span
                layoutId="work-tab-pill"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
              />
            )}
            <span className="relative">{SHORT_LABELS[category.id] ?? category.title}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div id="work-panel" role="tabpanel" aria-labelledby={`work-tab-${active.id}`}>
      {/* Not keyed by group: the panel stays mounted so the tab pill can slide
          and keyboard focus stays on the tab; it resets its own project index. */}
      <InlineShowcase category={active} tabs={tabs} lead={lead} />
    </div>
  );
}
