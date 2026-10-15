---
name: pl-skill-steward
description: "Routes a task to the right pl- skill and governs the pl- skill set. Use when the user asks which pl- skill fits a task or how pl- skills work together, or wants to create, edit, extend, rename, review, or retire a pl-* skill, or change how pl-* skills interact. Holds the set's charter, conventions, catalog, and interaction map, and keeps every change consistent with them. Do not use for skills outside the pl- set or for ordinary project work."
license: MIT
metadata:
  version: "1.0.0"
  category: "meta"
  invocation: "both"
---

# pl- Skill Steward

The `pl-` skill set is a personal, project-agnostic collection of Agent Skills. This skill keeps the set coherent. It routes tasks to the right skill, and it governs how skills are added, changed, and composed, so that every change keeps the whole set in view.

## Choose the mode

- **Route**: the user asks which `pl-` skill fits a task, or how `pl-` skills work together. Route mode changes nothing.
- **Maintain**: the request creates, edits, extends, renames, reviews, or retires a `pl-` skill, or changes the catalog or the interaction map.

If the request is unclear, start in Route mode. Switch to Maintain mode only when the user wants a change.

## Route mode

1. Read the [catalog](references/catalog.md).
2. Match the task against each skill's "Use when" column and its boundaries. Consider only `pl-` skills.
3. Recommend zero, one, or two skills, in the order to use them. For each, give one sentence on why it fits and what it will produce.
4. If the user wants to proceed, load the first recommended skill with the host's skill tool.
5. If no skill fits, say so plainly and suggest doing the task without a skill. Suggest a new skill only if the need passes the new-skill gate below.

## Maintain mode

1. **Find the source repository.** Take the folder that contains this `SKILL.md` (the host reports the location; the path can pass through a junction or symlink) and run `git -C <that folder> rev-parse --show-toplevel`. The result is `<repo>` if it contains `scripts/validate.py` and `skills/pl-skill-steward/`. If the command fails or those paths are missing, this is an installed copy (for example, from `npx skills`). Stop, and tell the user to make the change in the source repository instead (the README names it).
2. **Load the context of the whole set.** Read the [charter](references/charter.md), [catalog](references/catalog.md), [conventions](references/conventions.md), and [maintenance checklists](references/maintenance.md). Then read each affected skill in full, including its references and its eval cases in `<repo>/evals/<skill>/`.
3. **Restate before editing.** In two to four sentences, state the purpose of the set, the purpose and boundaries of each affected skill, and how the change fits. If the change conflicts with the charter, say so and ask the user before you continue.
4. **Apply the matching checklist** in the maintenance reference: add, modify, rename, or retire.
5. **Keep the set consistent.** Update the catalog (skills table and interaction map), the README skills table, `CHANGELOG.md`, and `metadata.version` of each changed skill.
6. **Verify.** From the repository root, run `python scripts/validate.py` (on Windows, `py -3 scripts/validate.py` if `python` is not on PATH). Add or update eval cases when behavior changes. Report which checks ran, and which behavior is still unverified.
7. **Tell the user to reload.** Open Kilo sessions see new or renamed skills only after `/reload` or in a new session.

## New-skill gate

Add a new skill only if all of these are true. Otherwise, extend an existing skill or decline.

- The need recurs across projects. A one-off instruction belongs in a prompt.
- Its trigger is distinct from the triggers of every skill in the catalog.
- It is project-agnostic: no project names, machine paths, credentials, or organization-internal details.
- It fits exactly one category in the catalog. A new category needs the user's explicit approval.
- It would not work better as a rule in a global `AGENTS.md` (always on) or a project `AGENTS.md` (project-specific). See "What belongs where" in the charter.

## Simplicity

Apply to the set the same scrutiny that `pl-overcomplication-check` applies to a task. Prefer extending a skill to adding one, deleting to extending, and fewer files to more. When a proposed change adds layers, files, or cross-skill dependencies, check it against the signals in `pl-overcomplication-check` if that skill is available; otherwise, ask whether the change is needed for a recurring, real use.

## References

| Need | Reference |
| --- | --- |
| Purpose, principles, what belongs where, glossary | [charter](references/charter.md) |
| Skills, categories, interaction map | [catalog](references/catalog.md) |
| Naming, layout, frontmatter, body structure, portability | [conventions](references/conventions.md) |
| Add, modify, rename, retire; versioning; changelog | [maintenance](references/maintenance.md) |
| Skeleton for a new `SKILL.md` | [skill template](assets/skill-template.md) |
