# AI Development Rules

This document outlines the tech stack and coding conventions for this project to ensure consistency and maintainability.

## Tech Stack

- **Framework:** Next.js 15 with the App Router.
- **Language:** TypeScript for type safety and improved developer experience.
- **UI Library:** React 19.
- **Styling:** Tailwind CSS for all styling, following a utility-first approach.
- **Animations:** Framer Motion for all UI animations and transitions.
- **Icons:** `lucide-react` is the designated icon library.
- **UI Primitives:** Radix UI for building accessible and unstyled component primitives.
- **Classnames:** `clsx` and `tailwind-merge` (via the `cn` utility) for robust and conflict-free class name management.

## Library Usage Rules

- **Styling:**
  - **ALWAYS** use Tailwind CSS for styling. Do not write custom CSS files unless absolutely necessary for a complex, non-reusable feature.
  - **ALWAYS** use the `cn()` utility from `src/lib/utils.ts` when combining or conditionally applying Tailwind classes.

- **Components:**
  - When creating new UI components, check if a suitable primitive exists in Radix UI first to ensure accessibility.
  - New reusable UI components should be placed in `src/components/ui/`.
  - Page-specific or feature-specific components should be placed in `src/components/landing/` or a similar feature-based directory.

- **Animations:**
  - **ALWAYS** use `framer-motion` for animations. This includes page transitions, component reveals, and micro-interactions.

- **Icons:**
  - **ALWAYS** use icons from the `lucide-react` package. Do not add SVG files directly to the codebase unless it's a custom logo.

- **State Management:**
  - For local component state, use React hooks (`useState`, `useReducer`).
  - Avoid introducing a global state management library (like Redux or Zustand) unless the application's complexity demonstrably requires it.

- **Code Formatting:**
  - Adhere to the existing code style and formatting. The project is set up with ESLint; ensure all new code is lint-free.