import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { categories } from "./projects";
import CategoryRow from "./CategoryRow";
import FullscreenShowcase from "./FullscreenShowcase";

const BASEQ_FILE_ID = "1ebXqxCnAy3TL2BxvpFlVpVemqY1XsO9t";
const BASEQ_VIEW_URL = `https://drive.google.com/file/d/${BASEQ_FILE_ID}/view?usp=sharing`;
const BASEQ_EMBED_URL = `https://drive.google.com/file/d/${BASEQ_FILE_ID}/preview`;
const BASEQ_FEATURES = [
  {
    title: "AI-Powered Mentor Matching",
    text: "Instantly generates ranked, explained shortlists of mentors for founders or sessions.",
  },
  {
    title: "Automated Mentor Updates",
    text: "Keeps the 750+ mentor database accurate through automated Google Sheet syncing without manual copy-pasting.",
  },
  {
    title: "Secure Startup Intro Requests",
    text: "Allows founders to browse the mentor directory and request introductions directly.",
  },
];

export default function FeaturedShowcase() {
  const [open, setOpen] = useState(null);
  const activeCategory = open && categories.find((c) => c.id === open.categoryId);

  return (
    <>
      <div className="px-[clamp(20px,5vw,56px)] pt-[clamp(40px,6vh,76px)]">
        <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] font-semibold tracking-tight text-white">
          Tech Lookbook + Services
        </h2>
        <a
          href="https://lookbook.pursuit.org/people/bo-moldenhauer"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-white/80 ring-1 ring-white/20 ring-inset transition-colors hover:bg-white/10 hover:text-white"
        >
          Pursuit Lookbook
          <span aria-hidden="true">↗</span>
        </a>
        <p className="mt-4 max-w-2xl text-white/50">
          Building automated workflows and smart AI tools that optimize finance
          workflows, eliminate operational bottlenecks, and help teams grow together.
        </p>
      </div>

      <div className="pb-[clamp(24px,4vh,48px)]">
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            onOpen={(index) => setOpen({ categoryId: category.id, index })}
          />
        ))}

        {/* BASE Q: embedded Google Drive file, placed after Bo in Colla"BO"ration. */}
        <div className="py-6 sm:py-8">
          <div className="px-[clamp(20px,5vw,56px)]">
            <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              BASE Q
            </h3>
            <a
              href={BASEQ_VIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-white/50 transition-colors hover:text-white"
            >
              Open in Google Drive ↗
            </a>
            <p className="mt-4 max-w-3xl text-white/70">
              BaseQ replaces manual spreadsheet shuffling and scattered tools with a
              single, secure platform. It powers:
            </p>
            <ul className="mt-3 max-w-3xl space-y-2 text-sm leading-relaxed text-white/60 sm:text-base">
              {BASEQ_FEATURES.map((f) => (
                <li key={f.title} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-white/50" />
                  <span>
                    <span className="font-medium text-white/90">{f.title}:</span> {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 px-[clamp(20px,5vw,56px)] sm:mt-5">
            <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 ring-inset">
              <iframe
                src={BASEQ_EMBED_URL}
                title="BASE Q"
                loading="lazy"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeCategory && (
          <FullscreenShowcase
            key={activeCategory.id}
            category={activeCategory}
            startIndex={open.index}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
