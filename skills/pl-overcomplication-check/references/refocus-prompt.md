# Refocus prompt templates

Fill every placeholder with verified facts. Delete lines that do not apply. Never add a feature, abstraction, dependency, or safeguard to the prompt.

## Same session

Use when the drift is recent and small and the current context is still accurate.

```text
Refocus on the original goal. Stop all other work on this task.

Goal: <original purpose, one sentence>
Definition of done: <1-3 sentences>

Approved removals (do these first, and only these):
1. <item> - <files / sections / features> - check: <how to confirm nothing needed broke>
2. ...

Keep unchanged: <Required and Approved items>
Deferred (do not implement now; record in <file or the final report>): <items>

Constraints:
- Add no new features, abstractions, dependencies, options, or safeguards.
- Do not touch changes unrelated to this task.
- Do not use git stash, git reset --hard, or git clean.
- Recovery point: <patch file path or commit>.

Steps:
1. Remove the approved items.
2. Complete the minimal path: <steps>.
3. Verify: <commands or checks tied to the definition of done>.

Stop and report instead of continuing if: a removal breaks a Keep item, the same verification fails twice, or a new requirement appears.

Final report: what was removed, what was deferred, which checks ran and their results, and what is still unverified.
```

## New session

Use when the context was compacted or is near its limit, when fix cycles failed on the same premise, when the conversation anchors the overcomplicated design, or when most of the current work will be discarded. The prompt must stand alone.

```text
You are continuing a task that became overcomplicated. Your job is to finish the original goal by the simplest path.

Goal: <original purpose, one sentence>
Original request (verbatim): "<quote>"
Later user decisions: <approved additions, rejections, corrections, each in one line>
Definition of done: <1-3 sentences>

Workspace: <absolute path>
Branch: <branch>; task base commit: <sha>
Recovery point: <patch file path or commit>

Verified current state:
- Exists and is correct (keep): <files / features>
- Exists but must be removed (approved by the user): <files / sections / features, each with a check>
- Does not exist yet (create): <outputs still needed for the definition of done>

Deferred (do not implement; list them in the final report): <items>

Why the previous approach is being reset (context only; do not repeat it): <one or two sentences>

Constraints:
- Add no new features, abstractions, dependencies, options, or safeguards.
- Do not touch changes unrelated to this task.
- Do not use git stash, git reset --hard, or git clean.
- Ask the user before removing anything not listed above.

Steps:
1. Read <the files needed to understand the current state>.
2. Remove the approved items.
3. Complete the minimal path: <steps>.
4. Verify: <commands or checks tied to the definition of done>.

Stop and report instead of continuing if: a removal breaks a Keep item, the same verification fails twice, or a new requirement appears.

Final report: what was removed, what was deferred, which checks ran and their results, and what is still unverified.
```
