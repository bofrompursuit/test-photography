import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StarterProjectSection from "./StarterProjectSection";

export function mountStarterProject(element) {
  createRoot(element).render(
    <StrictMode>
      <StarterProjectSection />
    </StrictMode>
  );
}
