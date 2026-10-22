# Changelog

Versions are per skill (`metadata.version` in each `SKILL.md`). Entries are grouped by date, newest first. Format: see `skills/pl-skill-steward/references/maintenance.md`.

## 2026-10-22

### pl-clear-technical-communication 2.1.0

- Added: an explicit stopping rule for how much to explain: stop when the user can explain the main point, understand its implications, and identify the next action.
- Added: rules for when to define a term and when to add an example; earlier use of a term no longer counts as proof of understanding.
- Added: guidance for progress updates during substantial or delegated work, and for commands that may run on Windows and macOS.
- Changed: the completed-work ending is `Next: Nothing pending; task complete.`. A new session or another agent must be named with its stage, and its copy-ready handoff prompt must include context, decisions already made, remaining tasks, and verification. `references/next-steps-and-handoffs.md` adds a handoff prompt template.
- Changed: the internal minimal/standard/detailed depth choice is replaced by the stopping rule. Triggers, labels, and the two-field ending are unchanged.
- Removed: `references/adaptive-depth.md` and `references/re-explanation.md`; their guidance now lives in `SKILL.md`. Trimmed overlap in the remaining references and added a note against citing ASD-STE100 for conversational answers.

### Repository

- Changed: `evals/pl-clear-technical-communication/validate.py` expects at least five reference routes instead of six, after two references were merged into `SKILL.md`.

## 2026-10-15

### pl-skill-steward 1.0.0

- Added: Route mode (which `pl-` skill fits a task) and Maintain mode (add, modify, rename, retire).
- Added: charter, conventions, catalog with categories and interaction map, maintenance checklists, and a skill template.

### pl-overcomplication-check 1.0.0

- Added: baseline, inventory, classification, signals, verdict, simplification, session recommendation, refocus prompt, and an approval gate before any removal.

### pl-clear-technical-communication 2.0.0

- Changed: renamed from `clear-technical-communication` 1.1.1 and moved into this repository. Behavior is unchanged.
- Changed: the evaluation suite moved from the skill's `evaluations/` folder to `evals/pl-clear-technical-communication/`.

### Repository

- Added: README, agent instructions, MIT license, `scripts/validate.py`, and a GitHub Actions validation workflow.
