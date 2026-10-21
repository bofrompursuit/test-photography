// Form controls for the intake card. Radios and checkboxes stay real inputs
// (visually hidden) so arrow keys, space and screen readers all behave natively;
// the card around each one is just its <label>.

export const domId = (key) => `sp-${key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

const normalize = (option) =>
  typeof option === "string" ? { value: option, label: option } : option;

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm font-medium text-[#FF8A80]">
      {message}
    </p>
  );
}

const inputClass =
  "block w-full rounded-xl border border-white/15 bg-black/40 px-4 text-base text-white " +
  "placeholder:text-white/35 transition-[border-color,box-shadow] duration-150 hover:border-white/30 " +
  "focus:border-white/70 focus:outline-none focus:ring-4 focus:ring-white/15 " +
  "aria-[invalid=true]:border-[#FF8A80]";

export function TextField({ field, fieldKey, value, error, onChange }) {
  const id = domId(fieldKey);
  const errorId = `${id}-error`;
  const shared = {
    id,
    name: fieldKey,
    value: value ?? "",
    placeholder: field.placeholder,
    required: field.required,
    "aria-required": field.required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    onChange: (event) => onChange(fieldKey, event.target.value),
  };

  return (
    <div data-field={fieldKey}>
      <label htmlFor={id} className="mb-2 block text-[15px] font-semibold text-white">
        {field.label}
      </label>
      {field.type === "textarea" ? (
        <textarea {...shared} rows={4} className={`${inputClass} min-h-32 resize-y py-3.5`} />
      ) : (
        <input
          {...shared}
          type={field.type === "email" ? "email" : "text"}
          autoComplete={field.autoComplete}
          inputMode={field.type === "email" ? "email" : undefined}
          className={`${inputClass} h-14`}
        />
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function RadioMark() {
  return (
    <span
      aria-hidden="true"
      className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-white/35 transition-colors group-has-[:checked]:border-black"
    >
      <span className="size-2.5 rounded-full transition-colors group-has-[:checked]:bg-black" />
    </span>
  );
}

function CheckMark() {
  return (
    <span
      aria-hidden="true"
      className="flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 border-white/35 transition-colors group-has-[:checked]:border-black group-has-[:checked]:bg-black"
    >
      <svg
        viewBox="0 0 16 16"
        className="size-3.5 opacity-0 transition-opacity group-has-[:checked]:opacity-100"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
    </span>
  );
}

export function ChoiceGroup({ field, fieldKey, value, error, onChange }) {
  const id = domId(fieldKey);
  const errorId = `${id}-error`;
  const multi = field.type === "multi";
  const selected = multi ? value ?? [] : value;

  const toggle = (optionValue, checked) => {
    if (!multi) return onChange(fieldKey, optionValue);
    // Keep picks in the order they were made: step 4 renders blocks in that order.
    const next = checked
      ? [...selected.filter((v) => v !== optionValue), optionValue]
      : selected.filter((v) => v !== optionValue);
    onChange(fieldKey, next);
  };

  return (
    <fieldset
      data-field={fieldKey}
      className="mx-0 min-w-0 border-0 p-0"
      aria-describedby={error ? errorId : undefined}
      aria-required={field.required || undefined}
    >
      <legend className="mb-3 p-0 text-[15px] font-semibold text-white">{field.label}</legend>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {field.options.map(normalize).map((option, index) => {
          const checked = multi ? selected.includes(option.value) : selected === option.value;
          return (
            <label
              key={option.value}
              htmlFor={`${id}-${index}`}
              data-cursor-target
              className={
                "group flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border bg-white/[0.03] px-4 py-3 " +
                "text-[15px] leading-snug text-white/85 transition-colors duration-150 " +
                "hover:border-white/35 hover:bg-white/[0.06] has-[:checked]:border-white has-[:checked]:bg-white has-[:checked]:text-black " +
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white " +
                (error ? "border-[#FF8A80]/60" : "border-white/12")
              }
            >
              <input
                id={`${id}-${index}`}
                type={multi ? "checkbox" : "radio"}
                name={fieldKey}
                value={option.value}
                checked={checked}
                onChange={(event) => toggle(option.value, event.target.checked)}
                className="sr-only"
              />
              {multi ? <CheckMark /> : <RadioMark />}
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

export function Field(props) {
  const { type } = props.field;
  return type === "single" || type === "multi" ? <ChoiceGroup {...props} /> : <TextField {...props} />;
}
