import { useEffect, useRef, useState } from "react";
import { Field, domId } from "./fields";
import { BOOKING_URL, CARD, DETAILS_INTRO, PROJECT_DETAILS, STEPS } from "./config";

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

// Collapses the flat answer map into one object, dropping detail blocks for
// project types that were picked and then unpicked.
function buildSubmission(answers) {
  const pick = (step) =>
    Object.fromEntries(
      STEPS.find((s) => s.id === step).fields.map((f) => [f.id, answers[f.id] ?? ""])
    );
  const details = Object.fromEntries(
    detailBlocks(answers).map((block) => [
      block.value,
      Object.fromEntries(
        block.fields.map((f) => [
          f.id,
          answers[detailKey(block.value, f.id)] ?? (f.type === "multi" ? [] : ""),
        ])
      ),
    ])
  );
  return {
    about: pick("about"),
    business: pick("business"),
    project: { types: answers.projectTypes ?? [], details },
    timeline: pick("timeline"),
    submittedAt: new Date().toISOString(),
  };
}

export default function IntakeForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [announcement, setAnnouncement] = useState("");
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

  const reserveCall = () => {
    const submission = buildSubmission(answers);
    console.log("Starter project submission:", submission);

    // TODO: send `submission` to a form backend or email service here
    // (e.g. fetch("/api/starter-project", { method: "POST", body: JSON.stringify(submission) })
    // or Formspree / Resend / a CRM webhook) before handing off to booking.

    if (BOOKING_URL) {
      window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
    } else {
      console.warn("BOOKING_URL is empty: set it in src/starter/config.js.");
    }
  };

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
    if (isLast) reserveCall();
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
      className="scroll-mt-[calc(var(--header-h)+20px)] rounded-3xl border border-white/[0.08] bg-[var(--surface)] p-[clamp(20px,4.5vw,48px)]"
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

      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 text-[clamp(1.5rem,3.2vw,2rem)] font-semibold leading-tight tracking-tight text-white outline-none"
      >
        {CARD.title}
      </h3>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/55">{CARD.subtitle}</p>

      <form noValidate onSubmit={handleSubmit} className="mt-8">
        <div className="space-y-8">
          {step.id === "about" ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {step.fields.map((field) => (
                <div key={field.id} className={field.type === "email" ? "sm:col-span-2" : ""}>
                  <Field {...fieldProps(field.id, field)} />
                </div>
              ))}
            </div>
          ) : step.dynamic ? (
            detailBlocks(answers).map((block) => (
              <section
                key={block.value}
                aria-labelledby={domId(`block-${block.value}`)}
                className="space-y-7 border-t border-white/10 pt-7 first:border-t-0 first:pt-0"
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
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
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
            className="rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-black transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {isLast ? CARD.submit : CARD.continue}
          </button>
        </div>
      </form>
    </div>
  );
}
