import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { sendToInbox } from "../web3forms";

// Shown if sending fails, so the visitor still has a way to reach Bo.
export const CONTACT_EMAIL = "bo.moldenhauer@pursuit.org";

export const VENMO_HANDLE = "Beau_Moldenhauer";
export const VENMO_URL = `https://venmo.com/u/${VENMO_HANDLE}`;

const LINKS = [
  {
    label: "LinkedIn",
    handle: "in/bomoldenhauer",
    url: "https://www.linkedin.com/in/bomoldenhauer",
  },
  {
    label: "GitHub",
    handle: "bofrompursuit",
    url: "https://github.com/bofrompursuit",
  },
  {
    label: "Linktree",
    handle: "bomoldenhauer",
    url: "https://linktr.ee/bomoldenhauer?utm_source=linktree_profile_share&ltsid=044edb07-7d48-4ec0-81ad-90e9200405d5",
  },
];

// OneNote's brand purple, used for the Contact pass: white fields and a white
// send button on purple, like OneNote's own app chrome.
export const ONENOTE_PURPLE = "#7719AA";
export const ONENOTE_THEME = {
  background: ONENOTE_PURPLE,
  foreground: "#ffffff",
  divider: "rgba(255,255,255,0.22)",
  font: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
};

// Linktree's brand lime and forest green, used for the Connect pass, with
// white pill links like a Linktree page.
export const LINKTREE_LIME = "#D2E823";
export const LINKTREE_FOREST = "#254F1A";
export const LINKTREE_THEME = {
  background: LINKTREE_LIME,
  foreground: LINKTREE_FOREST,
  divider: "rgba(37,79,26,0.2)",
  font: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
};

const fieldBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 transition " +
  "placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#7719AA]";

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please add your name.";

  const contact = values.contact.trim();
  if (!contact) {
    errors.contact = "An email or phone number is required.";
  } else if (contact.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)) {
    errors.contact = "That email address doesn't look right.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Tell me a little more — at least 10 characters.";
  }
  return errors;
}

export function ContactCard({ idPrefix = "cf" }) {
  const [values, setValues] = useState({ name: "", contact: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const botcheckRef = useRef(null);

  const set = (key) => (event) => {
    setValues((v) => ({ ...v, [key]: event.target.value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (status === "sent" || status === "error") setStatus("idle");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    const name = values.name.trim();
    const contact = values.contact.trim();
    setStatus("sending");
    try {
      await sendToInbox({
        subject: `Portfolio inquiry from ${name}`,
        fromName: "Bo. portfolio · Contact",
        // Only an email address can be replied to; a phone number stays in the body.
        replyTo: contact.includes("@") ? contact : undefined,
        botcheck: botcheckRef.current?.checked ?? false,
        fields: { Name: name, "Email or contact details": contact, Message: values.message.trim() },
      });
      setStatus("sent");
      setValues({ name: "", contact: "", message: "" });
    } catch (error) {
      console.error("Contact form failed to send:", error);
      setStatus("error");
    }
  };

  const fieldClass = (key) =>
    `${fieldBase} ${errors[key] ? "border-[#FFB3C7] ring-2 ring-[#FFB3C7]" : "border-transparent"}`;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4 text-white"
      style={{ fontFamily: ONENOTE_THEME.font }}
    >
      <Field
        id={`${idPrefix}-name`}
        label="Name"
        error={errors.name}
      >
        <input
          id={`${idPrefix}-name`}
          className={fieldClass("name")}
          placeholder="Your name"
          value={values.name}
          onChange={set("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${idPrefix}-name-err` : undefined}
        />
      </Field>

      <Field
        id={`${idPrefix}-contact`}
        label="Email or contact details"
        error={errors.contact}
      >
        <input
          id={`${idPrefix}-contact`}
          className={fieldClass("contact")}
          placeholder="you@example.com"
          value={values.contact}
          onChange={set("contact")}
          aria-invalid={Boolean(errors.contact)}
          aria-describedby={errors.contact ? `${idPrefix}-contact-err` : undefined}
        />
      </Field>

      <Field
        id={`${idPrefix}-message`}
        label="How can I help?"
        error={errors.message}
      >
        <textarea
          id={`${idPrefix}-message`}
          rows={4}
          className={`${fieldClass("message")} resize-y`}
          placeholder="Tell me about the project, service or question."
          value={values.message}
          onChange={set("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${idPrefix}-message-err` : undefined}
        />
      </Field>

      {/* Honeypot: hidden from people, ticked by naive bots; Web3Forms drops those. */}
      <input
        ref={botcheckRef}
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <button
        type="submit"
        data-cursor-target
        disabled={status === "sending"}
        aria-busy={status === "sending" || undefined}
        style={{ color: ONENOTE_PURPLE }}
        className="w-full rounded-lg bg-white px-4 py-3 text-sm font-bold transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#7719AA] active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : status === "sent" ? "Sent ✓" : "Send inquiry"}
      </button>

      <p role="status" aria-live="polite" className="min-h-[1.25rem] text-xs">
        {status === "sent" && (
          <span className="text-white/90">Thanks, your message is in. I'll get back to you soon.</span>
        )}
        {status === "error" && (
          <span className="font-medium text-[#FFD1DE]">
            That didn't send. Please try again, or email {CONTACT_EMAIL}.
          </span>
        )}
      </p>
    </form>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/85"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-[#FFD1DE]">
          {error}
        </p>
      )}
    </div>
  );
}

// Venmo's own palette, matched from venmo.com/u/Beau_Moldenhauer: its button
// blue on white. Venmo's typeface (Scto Grotesk) isn't public, so a clean
// system grotesk stands in.
export const VENMO_BLUE = "#0074DE";
export const VENMO_THEME = {
  background: VENMO_BLUE,
  foreground: "#ffffff",
  divider: "rgba(255,255,255,0.22)",
  font: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
};

export function ContributeCard() {
  const [qr, setQr] = useState(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    QRCode.toDataURL(VENMO_URL, {
      margin: 1,
      width: 400,
      color: { dark: VENMO_BLUE, light: "#ffffff" },
    })
      .then(setQr)
      .catch(() => setQr(null));
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const handle = `@${VENMO_HANDLE}`;
    try {
      // Absent over plain HTTP and in older browsers, so never assume it exists.
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(handle);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fall back to handing the visitor the handle selected, ready to copy.
      window.prompt("Copy the Venmo handle:", handle);
    }
  };

  return (
    <div
      className="flex h-full flex-col items-center gap-5 text-center text-white"
      style={{ fontFamily: VENMO_THEME.font }}
    >
      <p className="text-sm font-medium leading-relaxed text-white/90">
        Donate to my SMB &amp; my future apps through Venmo
      </p>

      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="rounded-2xl bg-white p-3 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)]"
      >
        {qr ? (
          <img
            src={qr}
            alt={`Venmo QR code for @${VENMO_HANDLE}`}
            className="h-36 w-36"
          />
        ) : (
          <div
            className="flex h-36 w-36 items-center justify-center px-2 text-xs"
            style={{ color: VENMO_BLUE }}
          >
            QR unavailable — use the handle below
          </div>
        )}
      </motion.div>

      <motion.button
        type="button"
        onClick={copy}
        data-cursor-target
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ color: VENMO_BLUE }}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold tracking-wide transition-colors hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0074DE]"
      >
        <span>@{VENMO_HANDLE}</span>
        <span aria-hidden="true" className="opacity-70">
          {copied ? "✓" : "⧉"}
        </span>
      </motion.button>

      <p role="status" aria-live="polite" className="min-h-[1.1rem] text-xs text-white/85">
        {copied ? "Handle copied to your clipboard." : ""}
      </p>

      <a
        href={VENMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-target
        className="mt-auto inline-flex min-h-[44px] items-center px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 underline-offset-4 transition hover:text-white hover:underline"
      >
        Open Venmo ↗
      </a>
    </div>
  );
}

// Forth Studios' own brand, matched from forth-studios.vercel.app.
export const FORTH_URL = "https://forth-studios.vercel.app/";
export const FORTH_THEME = {
  background: "#FFC800",
  foreground: "#000000",
  font: '"Archivo", "Helvetica Neue", Arial, sans-serif',
  mono: '"Courier Prime", "Courier New", Courier, monospace',
};

export function ContentNeedsCard() {
  return (
    <div className="flex h-full flex-col text-black" style={{ fontFamily: FORTH_THEME.font }}>
      <p
        className="text-[0.7rem] uppercase tracking-[0.2em] text-black/70"
        style={{ fontFamily: FORTH_THEME.mono }}
      >
        Forth Studios
      </p>
      <p
        className="mt-3 text-[clamp(3.25rem,17vw,4.75rem)] font-black uppercase leading-[0.85] tracking-tight"
        style={{ fontStretch: "125%" }}
      >
        Forth
      </p>
      <p className="mt-5 text-xl font-extrabold uppercase leading-[1.05] tracking-tight">
        Photography, storytelling &amp; AI content
      </p>

      <motion.a
        href={FORTH_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-target
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="mt-auto flex min-h-[52px] items-center justify-between rounded-xl bg-black px-5 text-sm font-bold uppercase tracking-[0.08em] text-[#FFC800] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFC800]"
      >
        <span>Visit Forth Studios</span>
        <span aria-hidden="true">↗</span>
      </motion.a>
      <p
        className="mt-2.5 text-center text-xs text-black/60"
        style={{ fontFamily: FORTH_THEME.mono }}
      >
        forth-studios.vercel.app
      </p>
    </div>
  );
}

export function ConnectCard() {
  return (
    <ul className="space-y-3" style={{ fontFamily: LINKTREE_THEME.font }}>
      {LINKS.map((link) => (
        <li key={link.url}>
          <motion.a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-target
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ color: LINKTREE_FOREST }}
            className="group flex items-center justify-between gap-3 rounded-full bg-white px-6 py-3.5 shadow-[0_2px_0_rgba(37,79,26,0.15)] transition-colors hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#254F1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#D2E823]"
          >
            <span className="min-w-0">
              <span className="block text-sm font-bold">{link.label}</span>
              <span className="block truncate text-xs opacity-70">{link.handle}</span>
            </span>
            <span className="shrink-0 opacity-80 transition group-hover:translate-x-0.5">
              ↗
            </span>
          </motion.a>
        </li>
      ))}
    </ul>
  );
}
