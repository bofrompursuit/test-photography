/**
 * Card copy is inferred from project names — review and replace with the real
 * descriptions. Images are local files under public/assets/img/; each item
 * also carries a `gradient` used as a fallback layer if an image fails to load.
 */

export const categories = [
  {
    id: "b2b",
    title: "B2B Builds",
    subtitle: "Technical Solutions & AI Production Tools",
    direction: "ltr",
    detailLabel: "What it does",
    items: [
      {
        title: "AdCraft+",
        url: "https://adcraft-ai-studio-7225.bolt.host",
        category: "B2B Builds",
        image: "/assets/img/b2b-adcraft.jpg",
        gradient: "linear-gradient(135deg, #4c1d95, #0a0a0c 70%)",
        detail:
          "AI ad-creative studio for generating, iterating on and exporting campaign-ready ad variations.",
      },
      {
        title: "RAIVALRY",
        url: "https://rivalry-insight-engine.lovable.app/",
        category: "B2B Builds",
        image: "/assets/img/b2b-raivalry.jpg",
        gradient: "linear-gradient(135deg, #0f3460, #0a0a0c 70%)",
        detail:
          "Competitive-intelligence engine that benchmarks rival brands and surfaces positioning gaps.",
      },
      {
        title: "justif.AI",
        url: "https://viral-snare-18430086.figma.site",
        category: "B2B Builds",
        image: "/assets/img/b2b-justifai.jpg",
        gradient: "linear-gradient(135deg, #1e3a8a, #0a0a0c 70%)",
        detail:
          "Decision-support tool that assembles evidence-backed justifications for campaign spend.",
      },
      {
        title: "SOCIAL STUDIO",
        url: "https://canonical-store-production.weweb.io/",
        category: "B2B Builds",
        image: "/assets/img/b2b-social-studio.jpg",
        gradient: "linear-gradient(135deg, #831843, #0a0a0c 70%)",
        detail:
          "Centralized production and scheduling workspace for brand social content.",
      },
      {
        title: "Assetify",
        url: "https://serene-clad-90305952.figma.site",
        category: "B2B Builds",
        image: "/assets/img/b2b-assetify.jpg",
        gradient: "linear-gradient(135deg, #164e63, #0a0a0c 70%)",
        detail:
          "Brand asset library that keeps approved creative organized, searchable and on-spec.",
      },
    ],
  },
  {
    id: "passion",
    title: "Passion Projects + Partners",
    subtitle: "Personal Apps, Digital Experiences & Side Projects",
    direction: "rtl",
    detailLabel: "Tools & skills",
    items: [
      {
        title: "Hypeman",
        url: "https://hypeman-lemon.vercel.app/",
        category: "Passion Projects + Partners",
        image: "/assets/img/passion-hypeman.jpg",
        gradient: "linear-gradient(135deg, #365314, #0a0a0c 70%)",
        detail: "React · Vercel · Web Audio API · Motion design",
      },
      {
        title: "Jonnyverse",
        url: "https://jonnyverse.vercel.app/",
        category: "Passion Projects + Partners",
        image: "/assets/img/passion-jonnyverse.jpg",
        gradient: "linear-gradient(135deg, #312e81, #0a0a0c 70%)",
        detail: "Next.js · Three.js · Interactive storytelling · Vercel",
      },
      {
        title: "Fire Island Bingo",
        url: "https://write-unify-73848034.figma.site",
        category: "Passion Projects + Partners",
        image: "/assets/img/passion-fire-island-bingo.jpg",
        gradient: "linear-gradient(135deg, #7c2d12, #0a0a0c 70%)",
        detail: "Figma Sites · Game state logic · Responsive UI",
      },
      {
        title: "123 Savoree powered by Nimble",
        url: "https://123-savoree.vercel.app/",
        category: "Passion Projects + Partners",
        image: "/assets/img/passion-123-savoree.jpg",
        gradient: "linear-gradient(135deg, #14532d, #0a0a0c 70%)",
        detail: "React · API integration · E-commerce UX · Vercel",
      },
      {
        title: "Soarin' Mom&Daddy",
        url: "https://bofrompursuit.github.io/Soar/",
        category: "Passion Projects + Partners",
        image: "/assets/img/passion-soarin-mom-daddy.jpg",
        gradient: "linear-gradient(135deg, #0c4a6e, #0a0a0c 70%)",
        detail: "HTML · CSS · JavaScript · GitHub Pages · CSS animation",
      },
    ],
  },
  {
    id: "collabo",
    title: 'Bo in Colla"BO"ration',
    subtitle: "Featured Teamwork, Award-Winning builds & Joint Ventures",
    direction: "ltr",
    detailLabel: "Built with",
    items: [
      {
        title: "Fanzone: Unlocked",
        url: "https://unlocked-zeta.vercel.app/",
        category: 'Bo in Colla"BO"ration',
        image: "/assets/img/collab-fanzone-unlocked.jpg",
        gradient: "linear-gradient(135deg, #581c87, #0a0a0c 70%)",
        detail: "Vercel · React · Figma",
      },
      {
        title: "Meet me in time",
        url: "https://stony-import-17203635.figma.site",
        category: 'Bo in Colla"BO"ration',
        image: "/assets/img/collab-meet-me-in-time.jpg",
        gradient: "linear-gradient(135deg, #155e75, #0a0a0c 70%)",
        detail: "Figma Sites · Framer Motion",
      },
      {
        title: "Choose Your Adventure NYC",
        url: "https://wake-bush-18609568.figma.site",
        category: 'Bo in Colla"BO"ration',
        image: "/assets/img/collab-choose-your-adventure-nyc.jpg",
        gradient: "linear-gradient(135deg, #1e1b4b, #0a0a0c 70%)",
        detail: "Figma Sites · Mapbox · Branching narrative",
      },
      {
        title: "Last Onboarder",
        url: "https://lastonboarder.lovable.app",
        category: 'Bo in Colla"BO"ration',
        image: "/assets/img/collab-last-onboarder.jpg",
        gradient: "linear-gradient(135deg, #9d174d, #0a0a0c 70%)",
        detail: "Lovable · Supabase · React",
      },
      {
        title: "Amplif/AI Block Party App",
        url: "https://envoy-groove-15308077.figma.site",
        category: 'Bo in Colla"BO"ration',
        image: "/assets/img/collab-amplifai-block-party.jpg",
        gradient: "linear-gradient(135deg, #b45309, #0a0a0c 70%)",
        detail: "Figma Sites · AI APIs · Event tooling",
      },
      {
        title: "Curious Cats",
        url: "https://curiouscats.vercel.app/",
        category: 'Bo in Colla"BO"ration',
        image: "/assets/img/collab-curious-cats.jpg",
        gradient: "linear-gradient(135deg, #86198f, #0a0a0c 70%)",
        detail: "React · Three.js · ElevenLabs voice · RevenueCat · Vercel",
      },
      {
        title: "SMURF: AML",
        url: "https://smurf-aml.vercel.app/ui/",
        category: 'Bo in Colla"BO"ration',
        image: "/assets/img/collab-smurf-aml.jpg",
        gradient: "linear-gradient(135deg, #7e22ce, #0a0a0c 70%)",
        detail: "Money Talks 2 hackathon · AI model benchmark · Anti-money-laundering",
      },
      {
        title: "AURAAFIT",
        url: "https://www.auraafit.tech/",
        category: 'Bo in Colla"BO"ration',
        image: "/assets/img/collab-auraafit.jpg",
        gradient: "linear-gradient(135deg, #6d28d9, #0a0a0c 70%)",
        detail: "Retail & foot-traffic intelligence engine",
      },
      {
        title: "Flagstate",
        url: "https://flagstate.vercel.app/#research",
        category: 'Bo in Colla"BO"ration',
        image: "/assets/img/collab-flagstate.jpg",
        gradient: "linear-gradient(135deg, #5b21b6, #0a0a0c 70%)",
        detail: "Daytona HackSprint NYC · Sanctions lookup · Voice · Live investigator agent",
      },
    ],
  },
];
