/**
 * Ambient backdrop for the Starter Project section: a photograph of a glowing
 * particle stream, slowly drifting. Pure CSS (see .starter-flow in style.css); reduced motion stills it.
 */
export default function AmbientField() {
  return (
    <div aria-hidden="true" className="starter-ambient pointer-events-none absolute inset-x-0 top-0 z-0">
      <div className="starter-flow" />
    </div>
  );
}
