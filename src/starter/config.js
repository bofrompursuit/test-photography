// All copy for the Starter Project section lives here so it can be edited
// without touching the components.
//
// Field types: "text" | "email" | "textarea" | "single" (radio cards) | "multi" (checkbox cards).
// Every field starts empty; `placeholder` is the only pre-filled hint.

// TODO: paste the booking page link (Calendly, Cal.com, SavvyCal, ...) here.
// While it's empty, the confirmation screen says we'll reach out by email instead.
export const BOOKING_URL = "";

// Web3Forms emails each submission to the address this key was created for.
// The key is meant to live in public client code; it can only send to that inbox.
export const WEB3FORMS_ACCESS_KEY = "25f5b66b-1733-41ff-821d-db2f7c83d9de";
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export const SECTION = {
  eyebrow: "Starter project",
  title: { before: "Let's bring your project to ", accent: "life", after: "!" },
  intro:
    "A website, a brand, a shoot, a music video or a launch: answer a few questions that fit it, then book a call to scope it together.",
};

export const CARD = {
  title: "Tell us what you're making.",
  back: "Back",
  continue: "Continue",
  submit: "Reserve Your Call",
  sending: "Sending…",
  error: "Something went wrong sending your answers. Please try again, or email bo.moldenhauer@pursuit.org.",
  successTitle: (name) => `Thanks, ${name}. Your answers are in.`,
  successWithBooking: "Last step: pick a time that works for you.",
  successNoBooking: "We'll read through them and email you within a day to set up your call.",
  bookCta: "Pick your call time",
};

const REVENUE = [
  "Pre-revenue",
  "Under $200K",
  "$200K – $1M",
  "$1M – $5M",
  "$5M – $25M",
  "$25M+",
];

export const STEPS = [
  {
    id: "about",
    name: "About you",
    fields: [
      { id: "firstName", type: "text", label: "First name", required: true, autoComplete: "given-name" },
      { id: "lastName", type: "text", label: "Last name", required: true, autoComplete: "family-name" },
      { id: "email", type: "email", label: "Email", required: true, autoComplete: "email" },
    ],
  },
  {
    id: "business",
    name: "Your business",
    fields: [
      {
        id: "businessType",
        type: "single",
        label: "Business or brand type",
        required: true,
        options: [
          "E-commerce / DTC product brand",
          "Professional services (law, finance, consulting, agency)",
          "Nonprofit / community / cause-based",
          "Healthtech / regulated industry",
          "Coach / creator / personal brand",
          "Pre-launch, building from scratch",
          "Hospitality / restaurant / venue / events",
          "Musician / artist / entertainment",
          "Something else",
        ],
      },
      {
        id: "yearsInBusiness",
        type: "single",
        label: "How long have you been at it?",
        options: ["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"],
      },
      { id: "revenueLastYear", type: "single", label: "Revenue last year (rough is fine)", options: REVENUE },
      { id: "revenueProjected", type: "single", label: "Projected revenue this year", options: REVENUE },
      { id: "teamSize", type: "single", label: "Team size", options: ["Just me", "2–5", "6–20", "21–50", "50+"] },
    ],
  },
  {
    id: "project",
    name: "Your project",
    fields: [
      {
        id: "projectTypes",
        type: "multi",
        label: "What are you looking to do? (pick as many as you need)",
        required: true,
        // Each option's `value` keys into PROJECT_DETAILS for step 4.
        options: [
          { value: "website", label: "A website (new build or redesign)" },
          { value: "brand", label: "Brand identity (logo and visual system)" },
          { value: "photoShoot", label: "A photo shoot" },
          { value: "videoShoot", label: "A video shoot" },
          { value: "musicVideo", label: "A music video" },
          { value: "campaign", label: "A campaign or launch" },
          { value: "other", label: "Something else" },
        ],
      },
    ],
  },
  // Step 4's fields are built from PROJECT_DETAILS and the step 3 picks.
  { id: "details", name: "Project details", dynamic: true, fields: [] },
  {
    id: "timeline",
    name: "Timeline & budget",
    fields: [
      {
        id: "timeline",
        type: "single",
        label: "When does this need to happen?",
        required: true,
        options: [
          "As soon as possible",
          "In the next 4–6 weeks",
          "In the next quarter",
          "Later this year",
          "Flexible, quality over speed",
        ],
      },
      {
        id: "budget",
        type: "single",
        label: "Project budget",
        required: true,
        options: [
          "Under $2.5K",
          "$2.5K – $5K",
          "$5K – $10K",
          "$10K – $25K",
          "$25K – $50K",
          "$50K+",
          "Not sure, help me scope it",
        ],
      },
      {
        id: "decisionMaker",
        type: "single",
        label: "Are you the decision maker?",
        required: true,
        options: [
          "Yes, I'm the final decision maker",
          "I'm one of the decision makers",
          "No, I'm gathering info for someone else",
        ],
      },
    ],
  },
  {
    id: "reserve",
    name: "Reserve your call",
    fields: [],
    callout: {
      strong: "You're all set.",
      body: "Booking is free. Reserve your call, pick a time on the next screen, and we'll show up ready to scope it.",
    },
    note: "You'll pick your call time on the next screen. Easy.",
  },
];

export const DETAILS_INTRO = (label) =>
  `${label}: a few quick questions so we can skip the basics on the call.`;

// Shared by the photo and video shoot blocks.
const SHOOT_FIELDS = [
  {
    id: "locations",
    type: "single",
    label: "Where will we shoot?",
    options: ["In a studio", "On location, one spot", "Several locations", "Not sure yet, help me pick"],
  },
  {
    id: "talent",
    type: "single",
    label: "Who's in front of the camera?",
    options: ["Our own team or customers", "We need models or talent cast", "Product only, no people", "Not sure yet"],
  },
  {
    id: "usage",
    type: "multi",
    label: "Where will the work be used? (pick all that apply)",
    options: ["Website", "Social", "Print", "Paid ads"],
  },
  {
    id: "deliverables",
    type: "single",
    label: "How many final deliverables do you need?",
    options: ["1–10", "10–25", "25–50", "50+", "Not sure yet"],
  },
];

// One block per step 3 option, keyed by that option's `value`.
// Field ids only need to be unique within their block.
export const PROJECT_DETAILS = {
  website: [
    {
      id: "startingPoint",
      type: "single",
      label: "Where are we starting?",
      options: [
        "Brand-new site, nothing exists yet",
        "Full redesign of an existing site",
        "Extending or fixing the current site",
      ],
    },
    {
      id: "ecommerce",
      type: "single",
      label: "Will the site sell online (e-commerce)?",
      options: ["Yes, we sell products online", "No, it's for leads, bookings, or info", "Not sure yet"],
    },
    {
      id: "audience",
      type: "single",
      label: "Who is the site for?",
      options: ["Consumers (B2C)", "Businesses (B2B)", "Both"],
    },
    {
      id: "platform",
      type: "single",
      label: "Any platform preference?",
      options: ["Shopify", "Webflow or Framer", "WordPress", "Custom build", "No preference, recommend one"],
    },
    {
      id: "brandReady",
      type: "single",
      label: "Is your brand identity ready?",
      options: [
        "Yes, logo and visual system exist",
        "Partially, some pieces exist",
        "No, we need brand identity too",
      ],
    },
    {
      id: "content",
      type: "single",
      label: "Where does the content stand?",
      options: [
        "Copy and images are ready",
        "Some exists, needs help",
        "Starting from zero, need copy and imagery",
      ],
    },
    { id: "offerings", type: "textarea", label: "List your products or services", required: true },
    {
      id: "inspiration",
      type: "textarea",
      label: "Sites you love (optional)",
      placeholder: "Paste a link or two and what you like about them.",
    },
  ],
  brand: [
    {
      id: "existing",
      type: "single",
      label: "What exists today?",
      options: [
        "Nothing yet, starting fresh",
        "A logo, but no real system",
        "A full identity that needs a refresh",
      ],
    },
    {
      id: "coverage",
      type: "multi",
      label: "What does it need to cover? (pick all that apply)",
      options: ["Logo", "Colors and type", "Packaging", "Social templates", "Brand guidelines"],
    },
    {
      id: "references",
      type: "textarea",
      label: "Brands you admire (optional)",
      placeholder: "Name a few and what you like about them.",
    },
  ],
  photoShoot: SHOOT_FIELDS,
  videoShoot: SHOOT_FIELDS,
  musicVideo: [
    {
      id: "concept",
      type: "single",
      label: "Where's the concept?",
      options: ["Fully written treatment", "Rough idea or moodboard", "Starting from zero, help us dream it up"],
    },
    {
      id: "artist",
      type: "text",
      label: "Artist and track",
      placeholder: "Who's performing, and the song title.",
    },
    {
      id: "locations",
      type: "single",
      label: "Where will we shoot?",
      options: ["In a studio", "On location", "A mix of both", "Not sure yet"],
    },
    {
      id: "releaseDate",
      type: "text",
      label: "Release date",
      placeholder: "A date or a rough month.",
    },
  ],
  campaign: [
    {
      id: "channels",
      type: "multi",
      label: "Which channels? (pick all that apply)",
      options: ["Social", "Email", "Paid ads", "Website", "Print or out-of-home", "Press or PR"],
    },
    {
      id: "launchDate",
      type: "text",
      label: "Launch date",
      placeholder: "A date or a rough month.",
    },
    {
      id: "assets",
      type: "textarea",
      label: "What assets do you need?",
      placeholder: "Videos, photos, landing page, ad creative...",
    },
  ],
  other: [{ id: "description", type: "textarea", label: "Tell us about it" }],
};

// Shown as the first FAQ item, so it collapses with the rest.
export const NEXT = {
  question: "What happens next?",
  items: [
    {
      n: "01",
      title: "The questions fit the project",
      body: "Making a website? We'll ask about e-commerce and content. Planning a shoot? We'll ask about locations and talent. You never get questions that don't apply to you.",
    },
    {
      n: "02",
      title: "We scope it with you",
      body: "On the call, we turn your answers into a plan: what we'll make, who makes it, what it costs and when it's done. You see the price before you commit to anything.",
    },
    {
      n: "03",
      title: "Then we make it happen",
      body: "Approve the plan and the same people from the call do the work. You get one team from your first question to the final delivery.",
    },
  ],
};

export const FAQ = {
  eyebrow: "Fair questions",
  title: "Got questions before you book?",
  items: [
    {
      q: "Does it cost anything to book a chat?",
      a: "No, booking is free. Before we meet, a member of our team reads what you sent and looks at your business, so the chat starts with you.",
    },
    {
      q: "What happens after I book?",
      a: "You'll get a calendar confirmation. Before the call we review your answers, then on the call we scope the project together and send a plan with pricing afterward.",
    },
  ],
};
