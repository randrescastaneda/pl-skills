---
name: pl-overcomplication-check
description: "Checks whether the current task has grown more complex than its purpose requires, then refocuses it. Use when the user asks if the work is overcomplicated, overengineered, or off track, says things like 'this got too complex', 'are we overdoing this', 'simplify this', or 'refocus', or invokes /pl-overcomplication-check. Compares the conversation, project scope, and task scope; gives a verdict with evidence; proposes keep/remove/defer lists; and writes a refocus prompt for this session or a new one. Removes nothing without approval. Do not use for initial planning, or for cleanup of working code whose scope did not drift."
license: MIT
metadata:
  version: "1.0.0"
  category: "agent-workflow"
  invocation: "both"
---

# Overcomplication Check

After several iterations, agent work often grows beyond what the task needs: extra layers, safeguards, options, features, and prerequisites that nobody asked for. This skill measures the current work against the original purpose, says plainly whether it has become overcomplicated, and gives a concrete way back: what to keep, what to remove, what to defer, and a prompt that executes the refocus.

## Authority

- The check is read-only.
- Nothing is removed, reverted, or rewritten until the user approves the Remove list.
- An item the user explicitly requested or approved is never removed without a separate, explicit confirmation for that item.
- The refocus never adds anything, including "simplifying" abstractions.

## Process

### 1. Establish the baseline

- Quote the original request for this task (normally the first user message about it), verbatim or its essential sentences.
- List later explicit user decisions: approved additions, rejections, corrections. Quote or cite each one.
- Read the project scope cheaply: only the parts of the top-level `AGENTS.md`, `README`, and active plan or roadmap that define purpose or constraints.
- Write the task's **definition of done** in one to three sentences, derived only from the sources above.
- If the original request is not visible (for example, after context compaction), recover it with the host's session-history or memory tools if available. Otherwise, ask the user. Never infer the original request from the current state of the work.

### 2. Take inventory of the current state

Use verified evidence only:

- In a git repository: `git status --short` and `git diff --stat` against the commit where the task started. If that commit is unknown, choose one from `git log --oneline` and say which base you used.
- Files, configuration, dependencies, tests, and documentation created or changed for the task.
- Plan items, todo items, open threads, and anything presented as a prerequisite.

Keep the inventory proportionate. Do not explore the whole codebase.

### 3. Classify each element

| Class | Meaning |
| --- | --- |
| Required | The definition of done fails without it. |
| Approved | Not in the original request, but the user explicitly asked for it or agreed to it. Cite where. |
| Agent-added | Introduced by an agent without a user request. |
| Speculative | Built for a hypothetical future need, failure, or user. |
| Unknown | The evidence does not show who wanted it or why. |

Give evidence for every non-Required item: a quote, a file, or a commit.

### 4. Check the signals

Read [signals](references/signals.md). For each Agent-added, Speculative, or Unknown item, ask why it was added and whether the definition of done fails without it. Respect counter-signals: some complexity is genuinely required.

### 5. Give the verdict

- **On track**: the complexity matches the definition of done. Say so, give the evidence, and stop. Do not invent cuts.
- **Drifting**: some Agent-added or Speculative items exist, but the core path is intact and short.
- **Overcomplicated**: the extras dominate the effort, block the core path (for example, prerequisites that delay a first working version), or the design no longer serves the original purpose.

Support the verdict with at most three evidence points.

### 6. Propose the simplification

For Drifting or Overcomplicated:

- **Minimal path**: the fewest steps from the current state to the definition of done.
- **Keep**: Required and Approved items.
- **Remove**: Agent-added and Speculative items that the minimal path does not need. Name exact files, sections, functions, options, or features. For each item, state the effect of removing it and the check that shows nothing needed broke.
- **Defer**: useful items that are out of scope now. Record them as a parking list. Do not implement them.
- **Ask**: Unknown items. Put a direct question to the user for each.

### 7. Recommend the session

Recommend a **new session** if any of these is true: the context was compacted or is near its limit; two or more fix cycles failed on the same premise; the conversation's plans or notes anchor the overcomplicated design; most of the current work will be discarded. Otherwise, recommend the **same session**. Give the reason in one sentence. The user decides.

### 8. Write the refocus prompt

Use the matching template in [refocus prompts](references/refocus-prompt.md), and put the prompt in a fenced `text` block. A new-session prompt must stand alone: a fresh agent with no access to this conversation must be able to execute it. If `pl-clear-technical-communication` is available, also follow its rules for new-session prompts.

### 9. Ask for approval

Ask the user to approve or edit the Remove list, the Defer list, the answers to the Ask items, and the session choice. Use the host's question tool if one is available. Stop until the user answers.

### 10. Act on the approved decision

- **Same session**, in a mode that may change files:
  1. Create a recovery point first. In git, write `git diff` to a patch file outside the repository and list untracked new files, or confirm that the work is committed. Report the location.
  2. Remove only the approved items. Do not use `git stash`, `git reset --hard`, or `git clean`. Do not touch changes unrelated to the task.
  3. Follow the minimal path. Add nothing.
  4. Verify against the definition of done. Report what was removed, what was deferred, what was verified, and what is still unverified.
- **New session**: give the prompt, and tell the user how to start the session with it. Do not execute it here.
- **Read-only mode** (for example, Plan or Ask): give the prompt for an implementation-capable mode or session.

## Output

```text
Verdict: On track | Drifting | Overcomplicated - <one sentence>
Original purpose: <quote> -> Definition of done: <1-3 sentences>
Evidence: <up to three bullets>
Classification: <table of non-Required items: item | class | evidence>; Required items: <count>
Simplification: minimal path; Keep / Remove / Defer / Ask lists
Session: Same | New - <reason>
Refocus prompt: <fenced block>
Decision needed: <what the user must approve or answer>
```

For an On track verdict, give only the verdict, the original purpose, and the evidence.

## Verification

- Every Remove item has evidence and a check.
- No Approved item is in the Remove list without a separate confirmation request.
- The refocus prompt contains no new feature, abstraction, dependency, or safeguard.
- After execution, the definition-of-done checks pass, or the report says which ones did not run.

## References

| Situation | Reference |
| --- | --- |
| Deciding whether an element is unnecessary complexity | [signals](references/signals.md) |
| Writing the same-session or new-session prompt | [refocus prompts](references/refocus-prompt.md) |
