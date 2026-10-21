import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContactCard, ContributeCard, ConnectCard } from "./cards";
import StackedCards from "./StackedCards";
import CustomCursor from "./CustomCursor";
import { STATUES } from "./marble";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/assets/video/orb.mp4";
// "Inspired" by Kevin MacLeod (incompetech.com), licensed under Creative
// Commons Attribution 4.0 — attribution is rendered in the footer overlay
// below, required by the license.
const AMBIENT_AUDIO_SRC = "/assets/audio/inspired-kevin-macleod.mp3";
const AMBIENT_AUDIO_CREDIT_URL = "https://incompetech.filmmusic.io/song/3918-inspired/";
const CC_BY_4_URL = "https://creativecommons.org/licenses/by/4.0/";

// Split so the blinking caret can sit right after "//" and before the
// closing bracket, rather than at the very end of the whole label.
const CTA_LABEL_PREFIX = "[ home//";
const CTA_LABEL_SUFFIX = " ]";

const PANELS = [
  {
    id: "contact",
    label: "Contact",
    blurb: "Start a conversation.",
    statue: STATUES.contact,
    Card: ContactCard,
  },
  {
    id: "contribute",
    label: "Contribute",
    blurb: "Back the work.",
    statue: STATUES.contribute,
    Card: ContributeCard,
  },
  {
    id: "connect",
    label: "Connect",
    blurb: "Find me elsewhere.",
    statue: STATUES.connect,
    Card: ConnectCard,
  },
];

function backToTop() {
  // Honours the same preference the rest of the page does; scroll-behavior on
  // <html> would otherwise smooth-scroll someone who asked for no motion.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

export default function ConnectSection() {
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const cardsRef = useRef(null);
  const audioRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
      return;
    }

    try {
      await audio.play();
      setMusicPlaying(true);
    } catch {
      // Autoplay/gesture policies blocked it; stay in the "off" state rather
      // than claim it's playing when it isn't.
    }
  }

  // Playback: loops continuously (like the hero video), starts when the stage
  // scrolls into view, pauses when it leaves. There is no "ended" state to wait
  // on any more — the corner overlay is always there, footer-style.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    // Decorative footage: its audio track must never play.
    video.muted = true;
    video.volume = 0;

    const fail = () => setVideoFailed(true);

    video.addEventListener("error", fail);
    // The source may fail before this effect runs, and some browsers never fire
    // a bubbling error, so check the element's own state too.
    const checkSource = () => {
      if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) fail();
    };
    checkSource();
    const sourceTimer = setTimeout(checkSource, 1500);

    const trigger = ScrollTrigger.create({
      trigger: video,
      start: "top 80%",
      end: "bottom top",
      onEnter: () => video.play().catch(() => {}),
      onEnterBack: () => video.play().catch(() => {}),
      onLeave: () => video.pause(),
      onLeaveBack: () => video.pause(),
    });

    return () => {
      clearTimeout(sourceTimer);
      trigger.kill();
      video.removeEventListener("error", fail);
    };
  }, []);

  // The frame unfurls as the section scrolls in.
  useEffect(() => {
    if (!frameRef.current) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(frameRef.current, { opacity: 1, scale: 1 });
      return undefined;
    }

    const tween = gsap.fromTo(
      frameRef.current,
      { opacity: 0, scale: 0.94 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: frameRef.current, start: "top 88%", once: true },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // Belt and braces: if the reader scrolls to the cards before the video has
  // got there, reveal them anyway.
  useEffect(() => {
    if (!cardsRef.current) return undefined;
    const trigger = ScrollTrigger.create({
      trigger: cardsRef.current,
      start: "top 85%",
      onEnter: () => setRevealed(true),
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (!revealed || !cardsRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(cardsRef.current, {
      opacity: 1,
      y: 0,
      duration: reduce ? 0 : 0.9,
      ease: "power3.out",
      overwrite: true,
    });
  }, [revealed]);

  return (
    <>
      <div className="px-[clamp(20px,5vw,56px)] pt-[clamp(40px,6vh,76px)]">
        {/* Header only — the navbar link stays "Contact" so #connect still
            matches what the visitor clicked. */}
        <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] font-semibold tracking-tight text-white">
          Stay in touch
        </h2>
        <p className="mt-3 max-w-2xl text-white/55">
          I lead with problem-solving to architect solutions powered by cutting-edge
          technology. Reach out anytime with questions.
        </p>
      </div>

      {/* Stacked card deck */}
      <div
        ref={cardsRef}
        style={{ opacity: 0, transform: "translateY(28px)" }}
        className="px-[clamp(20px,5vw,56px)] pt-[clamp(20px,3vh,36px)]"
      >
        <StackedCards panels={PANELS} />
      </div>

      {/* Reveal footage, stitched straight onto the cards above. A square 1:1
          crop on desktop that fills the available width, full-bleed like the
          hero video; on 9:16 mobile it goes fullscreen (see .reveal-frame).
          The footer (copyright + ambient toggle) is baked into this section's
          bottom-right corner instead of living as a separate element. */}
      <div className="reveal-stage" ref={stageRef}>
        <div className="reveal-frame" ref={frameRef} style={{ opacity: 0 }}>
          {videoFailed ? (
            <div className="reveal-fallback" aria-hidden="true" />
          ) : (
            <video
              ref={videoRef}
              className="reveal-video"
              src={VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          )}

          {/* Blends the crop into the page background and darkens the corner
              behind the overlay text so it stays legible over bright footage. */}
          <div className="reveal-vignette" aria-hidden="true" />

          <div className="reveal-overlay">
            <button
              type="button"
              className="reveal-cta"
              data-cursor-target
              onClick={backToTop}
              aria-label="Home"
            >
              <span className="reveal-cta-text" aria-hidden="true">
                {CTA_LABEL_PREFIX}
              </span>
              <span className="reveal-cta-caret" aria-hidden="true" />
              <span className="reveal-cta-text" aria-hidden="true">
                {CTA_LABEL_SUFFIX}
              </span>
            </button>

            {/* Matches .hero-title's font-size/weight/line-height/letter-spacing
                so it reads as a second hero statement, right under the link. */}
            <p className="reveal-tagline">
              Intelligent tech.
              <br />
              Serious impact.
            </p>

            <audio ref={audioRef} src={AMBIENT_AUDIO_SRC} loop preload="none" />
            <button
              type="button"
              className={`music-toggle${musicPlaying ? " is-playing" : ""}`}
              onClick={toggleMusic}
              aria-pressed={musicPlaying}
              aria-label={musicPlaying ? "Mute ambient background music" : "Play ambient background music"}
            >
              <span className="music-bars" aria-hidden="true"><i></i><i></i><i></i></span>
              <span>{musicPlaying ? "Ambient on" : "Ambient off"}</span>
            </button>

            {/* Required by the CC BY 4.0 license on the ambient track. */}
            <p className="reveal-audio-credit">
              Music: &ldquo;
              <a href={AMBIENT_AUDIO_CREDIT_URL} target="_blank" rel="noopener noreferrer">
                Inspired
              </a>
              &rdquo; by Kevin MacLeod (incompetech.com), licensed under{" "}
              <a href={CC_BY_4_URL} target="_blank" rel="noopener noreferrer">
                CC BY 4.0
              </a>
            </p>

            {/* Last in the stack — the very bottom of the footer. */}
            <p className="reveal-copyright">&copy; Bo Moldenhauer. All rights reserved.</p>
          </div>
        </div>
      </div>

      <CustomCursor />

    </>
  );
}
