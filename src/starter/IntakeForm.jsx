import { useEffect, useRef, useState } from "react";
import { Field, domId } from "./fields";
import {
  BOOKING_URL,
  CARD,
  DETAILS_INTRO,
  PROJECT_DETAILS,
  STEPS,
} from "./config";
import { sendToInbox } from "../web3forms";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROJECT_OPTIONS = STEPS.find((s) => s.id === "project").fields[0].options;

const labelFor = (value) => PROJECT_OPTIONS.find((o) => o.value === value)?.label ?? value;
const detailKey = (block, fieldId) => `details.${block}.${fieldId}`;

// Step 4 has one block per project type picked in step 3, in pick order.
function detailBlocks(answers) {
  return (answers.projectTypes ?? [])
    .filter((value) => PROJECT_DETAILS[value])
    .map((value) => ({ value, label: labelFor(value), fields: PROJECT_DETAILS[value] }));
}

// Every [key, field] pair shown on a step, so validation and rendering agree.
function stepEntries(step, answers) {
  if (!step.dynamic) return step.fields.map((field) => [field.id, field]);
  return detailBlocks(answers).flatMap((block) =>
    block.fields.map((field) => [detailKey(block.value, field.id), field])
  );
}

function isEmpty(value) {
  return Array.isArray(value) ? value.length === 0 : !String(value ?? "").trim();
}

function validate(step, answers) {
  const errors = {};
  for (const [key, field] of stepEntries(step, answers)) {
    const value = answers[key];
    if (field.required && isEmpty(value)) {
      errors[key] =
        field.type === "multi"
          ? "Pick at least one."
          : field.type === "single"
            ? "Pick one."
            : "This one's required.";
    } else if (field.type === "email" && !isEmpty(value) && !EMAIL_RE.test(value.trim())) {
      errors[key] = "Enter a valid email, like name@example.com.";
    }
  }
  return errors;
}

const display = (value) =>
  Array.isArray(value) ? value.join(", ") || "—" : String(value ?? "").trim() || "—";

// Flattens the answers into labelled fields; Web3Forms prints each key/value
// pair as one line of the email, in this order. Detail blocks for project
// types that were picked and then unpicked are left out.
function emailFields(answers) {
  const fields = {};
  for (const step of STEPS) {
    if (step.dynamic) {
      for (const block of detailBlocks(answers)) {
        for (const f of block.fields) {
          fields[`${block.label} · ${f.label}`] = display(answers[detailKey(block.value, f.id)]);
        }
      }
      continue;
    }
    for (const f of step.fields) {
      const value = answers[f.id];
      fields[f.label] = f.id === "projectTypes" ? display((value ?? []).map(labelFor)) : display(value);
    }
  }
  return fields;
}

export default function IntakeForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [announcement, setAnnouncement] = useState("");
  // idle | sending | sent | error
  const [status, setStatus] = useState("idle");
  const botcheckRef = useRef(null);
  const successRef = useRef(null);
  const cardRef = useRef(null);
  const headingRef = useRef(null);
  const firstRender = useRef(true);

  const step = STEPS[stepIndex];
  const total = STEPS.length;
  const isLast = stepIndex === total - 1;
  const stepLabel = `Step ${stepIndex + 1} of ${total}: ${step.name}`;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cardRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
    setAnnouncement(stepLabel);
  }, [stepIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const setAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _cleared, ...rest } = prev;
      return rest;
    });
  };

  const focusFirstError = (errs) => {
    const key = stepEntries(step, answers).find(([k]) => errs[k])?.[0];
    if (!key) return;
    const target = cardRef.current?.querySelector(
      `[data-field="${key}"] input, [data-field="${key}"] textarea`
    );
    target?.focus();
  };

  const reserveCall = async () => {
    setStatus("sending");
    setAnnouncement(CARD.sending);
    const name = `${answers.firstName?.trim()} ${answers.lastName?.trim()}`;
    const projects = (answers.projectTypes ?? []).map(labelFor).join(", ");
    try {
      await sendToInbox({
        subject: `New starter project: ${name} (${projects})`,
        fromName: "Bo. portfolio · Starter project",
        replyTo: answers.email.trim(),
        botcheck: botcheckRef.current?.checked ?? false,
        fields: emailFields(answers),
      });
      setStatus("sent");
    } catch (error) {
      console.error("Starter project submission failed:", error);
      setStatus("error");
      setAnnouncement(CARD.error);
    }
  };

  useEffect(() => {
    if (status !== "sent") return;
    successRef.current?.focus({ preventScroll: true });
    setAnnouncement(CARD.successTitle(answers.firstName.trim()));
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (event) => {
    event.preventDefault();
    const errs = validate(step, answers);
    setErrors(errs);
    const count = Object.keys(errs).length;
    if (count) {
      setAnnouncement(
        count === 1 ? "One answer needs attention." : `${count} answers need attention.`
      );
      focusFirstError(errs);
      return;
    }
    if (isLast) {
      if (status !== "sending") reserveCall();
    }
    else setStepIndex((i) => i + 1);
  };

  const goBack = () => {
    setErrors({});
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const fieldProps = (key, field) => ({
    field,
    fieldKey: key,
    value: answers[key],
    error: errors[key],
    onChange: setAnswer,
  });

  return (
    <div
      ref={cardRef}
      className="scroll-mt-[calc(var(--header-h)+20px)] rounded-3xl border border-white/[0.09] bg-[rgba(19,19,22,0.86)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] p-[clamp(18px,4.5vw,48px)]"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      <p className="eyebrow !mb-0">{stepLabel}</p>
      <div className="mt-3 grid grid-cols-6 gap-1.5" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span
            key={s.id}
            className={`h-1 rounded-full transition-colors duration-300 ${
              i <= stepIndex ? "bg-white" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {status === "sent" ? (
        <div className="mt-8">
          <h3
            ref={successRef}
            tabIndex={-1}
            className="text-[clamp(1.5rem,3.2vw,2rem)] font-semibold leading-tight tracking-tight text-white outline-none"
          >
            {CARD.successTitle(answers.firstName.trim())}
          </h3>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/55">
            {BOOKING_URL ? CARD.successWithBooking : CARD.successNoBooking}
          </p>
          {BOOKING_URL && (
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-target
              className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-black no-underline transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {CARD.bookCta}
            </a>
          )}
        </div>
      ) : (
        <>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="mt-6 text-[clamp(1.35rem,3.2vw,2rem)] font-semibold leading-tight tracking-tight text-white outline-none sm:mt-8"
          >
            {CARD.title}
          </h3>

          <form noValidate onSubmit={handleSubmit} className="mt-6 sm:mt-8">
            <div className="space-y-6 sm:space-y-8">
              {step.id === "about" ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-5">
                  {step.fields.map((field) => (
                    <div key={field.id} className={field.type === "email" ? "col-span-2" : ""}>
                      <Field {...fieldProps(field.id, field)} />
                    </div>
                  ))}
                </div>
              ) : step.dynamic ? (
                detailBlocks(answers).map((block) => (
                  <section
                    key={block.value}
                    aria-labelledby={domId(`block-${block.value}`)}
                    className="space-y-6 border-t border-white/10 pt-6 first:border-t-0 first:pt-0 sm:space-y-7 sm:pt-7"
                  >
                    <p id={domId(`block-${block.value}`)} className="text-sm text-white/50">
                      {DETAILS_INTRO(block.label)}
                    </p>
                    {block.fields.map((field) => {
                      const key = detailKey(block.value, field.id);
                      return <Field key={key} {...fieldProps(key, field)} />;
                    })}
                  </section>
                ))
              ) : (
                step.fields.map((field) => (
                  <Field key={field.id} {...fieldProps(field.id, field)} />
                ))
              )}

              {step.callout && (
                <div>
                  <div className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-4 text-[15px] leading-relaxed text-white/70">
                    <strong className="font-semibold text-white">{step.callout.strong}</strong>{" "}
                    {step.callout.body}
                  </div>
                  <p className="mt-4 text-sm text-white/50">{step.note}</p>
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
                </div>
              )}

              {isLast && status === "error" && (
                <p role="alert" className="text-sm font-medium text-[#FF8A80]">
                  {CARD.error}
                </p>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 sm:mt-10">
              {stepIndex > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  data-cursor-target
                  className="rounded-md px-1 py-2 text-[15px] font-medium text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {CARD.back}
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                data-cursor-target
                disabled={status === "sending"}
                aria-busy={status === "sending" || undefined}
                className="rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-black transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-60"
              >
                {!isLast ? CARD.continue : status === "sending" ? CARD.sending : CARD.submit}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
