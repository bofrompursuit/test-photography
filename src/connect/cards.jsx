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

const fieldBase =
  "w-full rounded-lg border bg-black/60 px-3.5 py-2.5 text-sm text-white transition " +
  "placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/60";

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
    `${fieldBase} ${errors[key] ? "border-rose-400/70" : "border-white/25 hover:border-white/45"}`;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
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
        className="w-full rounded-lg border border-white/40 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/70 hover:bg-white/20 hover:shadow-[0_0_26px_-4px_rgba(255,255,255,0.55)] focus:outline-none focus:ring-2 focus:ring-white/70 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : status === "sent" ? "Sent ✓" : "Send inquiry"}
      </button>

      <p role="status" aria-live="polite" className="min-h-[1.25rem] text-xs">
        {status === "sent" && (
          <span className="text-white/70">Thanks, your message is in. I'll get back to you soon.</span>
        )}
        {status === "error" && (
          <span className="text-rose-300">
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
        className="mb-1.5 block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/70"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContributeCard() {
  const [qr, setQr] = useState(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    QRCode.toDataURL(VENMO_URL, {
      margin: 1,
      width: 400,
      color: { dark: "#ffffff", light: "#00000000" },
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
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="text-sm leading-relaxed text-white/70">
        Donate to my SMB &amp; my future apps through Venmo
      </p>

      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="rounded-xl border border-white/30 bg-black/70 p-3 shadow-[0_0_32px_-8px_rgba(255,255,255,0.5)]"
      >
        {qr ? (
          <img
            src={qr}
            alt={`Venmo QR code for @${VENMO_HANDLE}`}
            className="h-36 w-36"
          />
        ) : (
          <div className="flex h-36 w-36 items-center justify-center px-2 text-xs text-white/50">
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
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:border-white/70 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <span>@{VENMO_HANDLE}</span>
        <span aria-hidden="true" className="text-white/60">
          {copied ? "✓" : "⧉"}
        </span>
      </motion.button>

      <p role="status" aria-live="polite" className="min-h-[1.1rem] text-xs text-white/70">
        {copied ? "Handle copied to your clipboard." : ""}
      </p>

      <a
        href={VENMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-target
        className="inline-flex min-h-[44px] items-center px-3 text-xs uppercase tracking-[0.18em] text-white/60 underline-offset-4 transition hover:text-white hover:underline"
      >
        Open Venmo ↗
      </a>
    </div>
  );
}

export function ConnectCard() {
  return (
    <ul className="space-y-3">
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
            className="group flex items-center justify-between gap-3 rounded-lg border border-white/25 bg-black/50 px-4 py-4 transition-colors hover:border-white/70 hover:bg-white/10 hover:shadow-[0_0_26px_-8px_rgba(255,255,255,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-white">
                {link.label}
              </span>
              <span className="block truncate text-xs text-white/60">{link.handle}</span>
            </span>
            <span className="shrink-0 text-white/70 transition group-hover:translate-x-0.5">
              ↗
            </span>
          </motion.a>
        </li>
      ))}
    </ul>
  );
}
