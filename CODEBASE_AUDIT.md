# Hooklane — Pragmatic Codebase Audit

> **Updated:** July 2026  
> **Purpose:** A filtered, portfolio-focused action plan. This document strips away the bloat (heavy 3D assets, backend accounts) and focuses purely on what makes the app robust, hirable, and visually stunning.

---

## 📋 Executive Summary

The app is functionally complete for V1.0 (Guest Mode). To elevate it from a functional prototype to a premium portfolio piece, we need to execute on three core pillars:
1. **Architecture:** Migrate inline styles to Tailwind (proves professional maintainability).
2. **Visual Polish & "Juice":** Add micro-interactions and depth to make the app feel expensive.
3. **Quality Assurance:** Add a Playwright E2E test to prove production-readiness.

---

## 🎯 The Pragmatic Action Plan

### Pillar 1: The Tailwind Migration (Architecture)
**Priority: CRITICAL** | **Impact: High (Code Quality)**
Almost every component in `src/components/` and `src/screens/` is currently built using inline `style={{...}}` objects. This is a strict violation of modern React best practices.
- **Action:** Refactor all components to use pure Tailwind utility classes (`className="..."`), utilizing the design tokens defined in `index.css`.
- **Target Files:** `AnswerCard.jsx`, `QuizScreen.jsx`, `ScoreScreen.jsx`, `SearchScreen.jsx`, `StatBox.jsx`, etc.

### Pillar 2: The "Juice" & Visual Polish
**Priority: HIGH** | **Impact: High (User Experience & Demo Quality)**
The app needs to *feel* like a premium game, not just a web form.

| Component | Required Upgrade |
|-----------|------------------|
| **ScoreScreen** | **Staggered Entrance Animation:** Score must count up from 0 to 10. UI elements (badges, buttons, stats) must slide in sequentially. |
| **AnswerCard** | **Visceral Feedback:** Add a screen-shake animation for wrong answers. Overlay a white checkmark or X on the album art upon selection. |
| **PlayButton** | **Audio Feedback:** Add expanding, concentric pulsing rings when a track is actively playing. |
| **QuizProgress** | **Segmented Pills:** Upgrade from a basic progress bar to a sleek, segmented pill design with a glowing active state. |
| **AlbumArt** | **Depth & Shadows:** Add a deep drop-shadow and a very thin semi-transparent white inner border (`1px solid rgba(255,255,255,0.06)`) to separate dark album covers from the black background. |
| **StatBox** | **Data Structuring:** Convert plain text stats into distinct, color-coded "chips" or cards with subtle backgrounds. |
| **Global UI** | **Glassmorphism Consistency:** Ensure all modals, error toasts, and overlays utilize consistent `backdrop-filter: blur(12px)` glass effects. |

### Pillar 3: Basic Quality Gates (Testing)
**Priority: MEDIUM** | **Impact: High (Hiring Signal)**
Junior portfolios only have UI. Senior portfolios have automated tests.
- **Action:** Implement a single, comprehensive Playwright E2E test covering the "Happy Path" (Search Artist → Play Quiz → View Score).
- **Action:** Set up a GitHub Action to run this test automatically on push.

---

## ❌ Explicitly Removed / Out of Scope

The following items were in the original design specs but have been removed for pragmatism:

- **Spline 3D Assets:** Removed. Heavy WebGL assets hurt performance and Lighthouse scores. The current 2D Neon/Glassmorphism aesthetic is sufficient and highly performant.
- **User Accounts & Database (Phase 3):** Removed. Recruiters and casual users will not sign up for an account. A frictionless, `localStorage`-based guest experience is superior for a portfolio showcase.
- **Variable Rounds:** We are locking the game to 10 rounds for consistency and simpler UI state management.

---

*End of audit. Ready for execution.*