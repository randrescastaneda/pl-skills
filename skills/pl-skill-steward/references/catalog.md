# Catalog of the pl- skill set

This file is the single source of truth for the set. `scripts/validate.py` reads the category list below, and checks that the skills table, the README skills table, and the `skills/` folders agree.

## Categories

Each skill has exactly one category. Do not add a category without the owner's explicit approval.

- `communication` — How agents explain, report, and hand off work.
- `agent-workflow` — Steering agent work: scope, planning, refocusing, session handoffs, reviews.
- `meta` — Rules for the skill set itself.
- `software-engineering` — Package and tool development, testing, debugging, CI, and release, in R, Python, Stata, PowerShell, and similar.
- `research-data` — Econometrics, survey and welfare data work, reproducibility.
- `writing` — Reports, papers, documentation, presentations.

## Skills

| Skill | Category | Invocation | Use when | Composes with |
| --- | --- | --- | --- | --- |
| `pl-clear-technical-communication` | communication | both | Any technical request or technical follow-up: explanations, implementation reports, reviews, and the final handoff (who acts next, what the user must do). | Shapes the user-facing output and ending of every other `pl-` skill. |
| `pl-overcomplication-check` | agent-workflow | both | The task seems to have grown beyond its purpose, or the user asks to simplify, refocus, or check for overengineering. | Uses the handoff rules of `pl-clear-technical-communication` for its prompt and ending when available. |
| `pl-skill-steward` | meta | both | Choosing which `pl-` skill fits a task; creating, changing, renaming, or retiring a `pl-` skill. | Governs all `pl-` skills; may apply the signals of `pl-overcomplication-check` to a proposed change. |

## Interaction map

- **Always-on layer: `pl-clear-technical-communication`.** The owner's global `AGENTS.md` requires it for technical requests, so it is normally active next to every other skill. Other skills define what content to produce. They do not redefine how responses end.
- **`pl-overcomplication-check`** produces a verdict, keep/remove/defer lists, and a refocus prompt. If `pl-clear-technical-communication` is loaded, its handoff rules govern the new-session prompt and the final fields. Without it, the check uses its own templates.
- **`pl-skill-steward`** reads only this catalog in Route mode. In Maintain mode, it governs every change to the set, and it may apply the signals of `pl-overcomplication-check` to a proposed change.

## Composition rules

1. Skills refer to each other by name only, never by a file path into another skill's folder. Installs can separate the folders.
2. Every cross-reference states the standalone fallback.
3. A skill may suggest loading another skill; it never requires it. There are no mandatory loading chains.
4. When you add a skill, add its row to the skills table and its edges to the interaction map in the same change.
