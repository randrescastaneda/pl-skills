# Conventions

`scripts/validate.py` enforces the rules marked **(validated)**.

## Naming

- `pl-` followed by lowercase words joined by hyphens: `^pl-[a-z0-9]+(-[a-z0-9]+)*$`, at most 64 characters, equal to the folder name. **(validated)**
- Name the job, not the category: `pl-overcomplication-check`, not `pl-workflow-check`.
- Use words the user would type after `/`.
- A rename is a major version change and breaks explicit references. Avoid renames.

## Folder layout

```text
skills/<name>/
  SKILL.md          # required: frontmatter + governing process
  references/       # optional: detail loaded on demand
  scripts/          # optional: executable helpers
  assets/           # optional: templates and static files
evals/<name>/       # in the repository root, not inside the skill
  cases.md          # cases, expected behavior, recorded results
  fixtures/         # optional: transcripts or files the cases use
```

- Never create a file named `SKILL.md` below a skill's top folder. Kilo scans skill folders recursively and would load it as a separate skill. **(validated)**
- Relative links in a skill's Markdown files resolve inside that skill's folder. **(validated)**
- Evals stay out of skill folders, so installed copies contain only what the agent needs.

## Frontmatter

```yaml
---
name: pl-<name>
description: "<What it does>. Use when <triggers, in the user's words>. Do not use for <boundaries>."
license: MIT
metadata:
  version: "1.0.0"
  category: "<category id from the catalog>"
  invocation: "both"
---
```

- Allowed keys: `name`, `description`, `license`, `compatibility`, `metadata`. **(validated)**
- `description`: one line, in double quotes, 1 to 1024 characters, no double quotes inside (use single quotes). **(validated)**
- Write the description in three parts: what the skill does; "Use when ..." with the user's own phrasing; "Do not use for ..." with the boundaries. The host decides from this text alone, so it must be specific.
- `metadata`: one level, double-quoted string values. Required: `version` (SemVer), `category` (from the catalog), `invocation` (`user`, `model`, or `both`). **(validated)**
- Frontmatter is ASCII only. Files have no BOM and use LF line endings. **(validated)**
- Do not add host-specific keys such as Claude Code's `disable-model-invocation`. Kilo has no equivalent; control invocation through the description.

## Body

Use these sections in this order, and omit the ones that are empty:

1. H1 title and a one-paragraph purpose.
2. Authority: what needs the user's approval, if the skill can change anything.
3. Process: numbered steps with clear exit conditions.
4. Output: the exact shape of what the user receives.
5. Verification: what proves that the work is done.
6. References: a table that maps a situation to a reference file.

- Keep `SKILL.md` under about 200 lines. The validator fails at 500 lines. **(validated)**
- Write imperative, specific steps. Prefer checklists and decision rules to general advice.
- Do not use embedded shell placeholders (`!` followed by a backtick command). **(validated in `SKILL.md`)**

## Cross-references

Refer to another skill by name, and state the fallback. Example: "If `pl-clear-technical-communication` is available, follow its handoff rules; otherwise use the template in `references/refocus-prompt.md`."

## Portability

- Give commands that work in both Windows PowerShell and a POSIX shell, or give both forms.
- No absolute paths, user names, organization-internal URLs, or host-only tool names without a generic alternative ("the host's question tool, if available").
