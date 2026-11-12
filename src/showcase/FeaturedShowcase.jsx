import { categories } from "./projects";
import WorkShowcase from "./WorkShowcase";

const BASEQ_FILE_ID = "1ebXqxCnAy3TL2BxvpFlVpVemqY1XsO9t";
const BASEQ_VIEW_URL = `https://drive.google.com/file/d/${BASEQ_FILE_ID}/view?usp=sharing`;

// Pursuit's monogram, taken from pursuit.org; inherits the link's text color.
function PursuitMark({ className }) {
  return (
    <svg viewBox="0 0 36 51" fill="none" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M24.0499 16.1033C20.9578 15.7893 14.9453 16.3276 9.35855 23.4597C8.20087 24.94 7.14028 26.5996 6.17679 28.4462C5.15355 25.538 5.08633 22.5476 6.01248 19.6694C7.40916 15.3034 11.054 11.4233 15.8266 9.15811L14.6092 13.8904L18.5752 14.9072L21.6225 3.04274L9.79175 0L8.7685 3.96976L13.5486 5.2033C7.74526 8.04419 3.45064 12.7615 1.68051 18.2863C0.0224067 23.4747 0.731954 28.8574 3.73446 33.8514L3.78674 33.9336C2.05395 38.7183 0.784236 44.3701 0 50.8593H4.57097C5.2133 45.8055 6.13945 41.4919 7.26725 37.8361C11.3901 41.0882 17.2831 42.3965 23.0715 41.0732C29.8607 39.5182 34.4317 34.7111 34.9919 28.5359C35.552 22.3533 30.645 16.7762 24.0499 16.1033ZM30.4657 28.1248C30.0848 32.3337 26.9404 35.5185 22.0557 36.6399C16.327 37.9557 11.5918 35.982 8.94029 33.2159C13.0482 23.5195 18.8142 20.1404 23.5868 20.6263C27.7171 21.045 30.8018 24.4092 30.4657 28.1248Z"
      />
    </svg>
  );
}
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
  return (
    <>
      <div className="px-[clamp(20px,5vw,56px)] pt-[clamp(40px,6vh,76px)]">
        <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] font-semibold tracking-tight text-white">
          Tech Lookbook + Services
        </h2>
        <p className="mt-3 max-w-2xl text-white/50">
          Building automated workflows and smart AI tools that optimize finance
          workflows, eliminate operational bottlenecks, and help teams grow together.
        </p>
        <a
          href="https://lookbook.pursuit.org/people/bo-moldenhauer"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full py-1.5 pl-3 pr-3.5 text-sm font-medium text-white/80 ring-1 ring-white/20 ring-inset transition-colors hover:bg-white/10 hover:text-white"
        >
          <PursuitMark className="h-4 w-auto" />
          Pursuit Lookbook
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="pb-[clamp(24px,4vh,48px)]">
        {/* All three subsections in one panel, switched by tabs; nothing opens on top. */}
        <div className="mt-[clamp(24px,4vh,48px)]">
          <WorkShowcase categories={categories} />
        </div>

        {/* BASE Q: embedded Google Drive file, placed after Bo in Colla"BO"ration. */}
        <div className="py-6 sm:py-8">
          <div className="px-[clamp(20px,5vw,56px)]">
            <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              PROJECT BASE Q
            </h3>
            <p className="mt-2 max-w-3xl text-base font-medium text-white/85">
              This is made to scale. ASK and we can make you solutions.
            </p>
            <a
              href={BASEQ_VIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-white/50 transition-colors hover:text-white"
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
              {/* Native player: plays inline on phones, with the browser's own
                  fullscreen button. faststart MP4 so it streams before fully loading. */}
              <video
                src="/assets/video/baseq-walkthrough.mp4"
                poster="/assets/poster/baseq-walkthrough.jpg"
                controls
                playsInline
                preload="metadata"
                aria-label="BaseQ walkthrough video"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
