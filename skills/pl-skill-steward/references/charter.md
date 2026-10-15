# Charter of the pl- skill set

## Purpose

The `pl-` skill set is the owner's personal, project-agnostic collection of Agent Skills. It is available in every session and every project. The owner is the primary user; others may install, fork, or adapt the skills.

Kilo Code is the primary host. Other hosts that implement the Agent Skills format (Codex, Claude Code, and others) are supported through the standard folder layout, without host-specific manifests.

## Principles

1. **Small and composable.** One skill does one job. Skills combine through the interaction map, not by growing into each other.
2. **Standalone first.** Every skill works when installed alone. A skill may name another `pl-` skill as an enhancement, and must state what to do when that skill is absent.
3. **The description is the trigger.** Hosts choose skills from their descriptions. A description says what the skill does, when to use it in the user's own words, and when not to use it.
4. **Progressive disclosure.** `SKILL.md` holds the governing process. Detail goes in `references/`, loaded only when a step needs it.
5. **Project-agnostic and portable.** No project names, machine paths, user names, credentials, or organization-internal details. Instructions work on Windows and macOS.
6. **Standard first, Kilo first.** Follow the Agent Skills specification. Use Kilo-specific behavior only when it is optional, and say that it is Kilo-specific.
7. **Evidence over claims.** A skill that changes files includes verification steps. Behavior is tested with eval cases in `evals/`, not assumed.
8. **User authority.** Skills do not grant permissions or widen the task. Destructive or irreversible actions need the user's explicit approval.
9. **Simplicity of the set.** The set must not become overcomplicated. Extend before adding; delete before extending; fewer files before more.

## What belongs where

| Content | Home |
| --- | --- |
| Reusable on-demand workflow or knowledge, useful in any project | a `pl-` skill |
| A rule that must apply to every response, in every project | the owner's global `AGENTS.md` (it may require loading a `pl-` skill) |
| Conventions of one project | that project's `AGENTS.md` or project skills |
| A one-off instruction | a prompt, not a skill |

## Scope boundaries

- The set is a collection of skill folders. It is not a Kilo plugin: no code hooks or runtime extensions.
- Skills contain no embedded shell placeholders (the `!` + backtick syntax). They are not portable, and they run commands at load time.
- The repository never contains secrets, session transcripts, or raw evaluation results.
- The categories in the catalog are fixed until the owner approves a change.

## Glossary

| Term | Meaning |
| --- | --- |
| skill set | All `pl-` skills in this repository. |
| skill | A folder `skills/<name>/` with a `SKILL.md` file. |
| reference | A file in a skill's `references/` folder, read on demand. |
| asset | A template or static file in a skill's `assets/` folder. |
| eval | Test cases or a harness in `evals/<name>/`. Exists only in the source repository. |
| catalog | `references/catalog.md` of `pl-skill-steward`: the single list of skills, categories, and interactions. |
| interaction map | The catalog section that states how skills compose. |
| invocation | How a skill starts: `user` (explicit `/name` or request by name), `model` (the agent chooses it from the description), or `both`. |
| host | The agent product that loads skills, for example Kilo Code, Codex, or Claude Code. |
| source repository | The git clone of this repository, where all changes are made. Installed copies are never edited. |
