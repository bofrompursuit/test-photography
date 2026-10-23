const PURSUIT_URL = "https://aiji.pursuit.org/";

// Cropped from Pursuit's partner wall and recoloured white-on-transparent
// (public/assets/partners) so they sit quietly on the dark page.
const PARTNERS = [
  ["achieve-partners", "Achieve Partners"],
  ["adobe", "Adobe"],
  ["america-achieves", "America Achieves"],
  ["andreessen-horowitz", "Andreessen Horowitz"],
  ["anthropic", "Anthropic"],
  ["ascendium", "Ascendium"],
  ["burning-glass-institute", "The Burning Glass Institute"],
  ["citizens", "Citizens Philanthropic Foundation"],
  ["cuny", "The City University of New York"],
  ["con-edison", "Con Edison"],
  ["cwe", "CWE"],
  ["gitlab-foundation", "GitLab Foundation"],
  ["google-org", "Google.org"],
  ["jobs-for-the-future", "Jobs for the Future"],
  ["jpmorgan-chase", "JPMorgan Chase"],
  ["metlife-foundation", "MetLife Foundation"],
  ["mizuho", "Mizuho"],
  ["native", "Native"],
  ["nyc-council", "New York City Council"],
  ["ny-jobs-ceo-council", "New York Jobs CEO Council"],
  ["new-york-state", "State of New York"],
  ["openai", "OpenAI"],
  ["opportunity-at-work", "Opportunity@Work"],
  ["opportunity-ai", "Opportunity AI"],
  ["robin-hood", "Robin Hood"],
  ["siegel-family-endowment", "Siegel Family Endowment"],
  ["spectrum", "Spectrum"],
  ["tech-nyc", "Tech:NYC"],
  ["tishman-speyer", "Tishman Speyer"],
  ["wells-fargo", "Wells Fargo"],
];

export default function Partners() {
  return (
    <div className="px-[clamp(20px,5vw,56px)] pt-[clamp(48px,8vh,96px)]">
      <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-tight text-white">
        Powered by{" "}
        <a
          href={PURSUIT_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-target
          className="underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
        >
          Pursuit
        </a>{" "}
        + Partners
      </h2>

      <ul className="mt-6 grid grid-cols-3 gap-x-6 gap-y-6 sm:grid-cols-5 lg:grid-cols-6 sm:gap-x-10 sm:gap-y-8">
        {PARTNERS.map(([slug, name]) => (
          <li key={slug} className="flex h-10 items-center justify-center sm:h-12">
            <img
              src={`/assets/partners/${slug}.png`}
              alt={name}
              title={name}
              loading="lazy"
              className="max-h-full max-w-full object-contain opacity-50 transition-opacity duration-300 hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
