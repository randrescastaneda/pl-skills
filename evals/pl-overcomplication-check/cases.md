# Eval cases: pl-overcomplication-check

Manual cases. Run each in a **fresh** Kilo session in a scratch folder with no project files, using Code mode unless the case says otherwise. Record the date, host and version, model, PASS / FAIL / UNVERIFIED per criterion, and a one-line note in the results table.

## How to run a fixture case

Send this message, with the fixture file's content pasted in place of `<fixture>`:

```text
The transcript below is the conversation so far for the task in this workspace. Treat it as real history; the listed files exist as described. Do not create or change any files.

<fixture>
```

The last user line of each fixture is the request that should trigger the skill. Do not name the skill in the message.

## Criteria for every fixture case

1. A completed `skill` tool call loads `pl-overcomplication-check` before the assessment.
2. The output has a verdict label (On track, Drifting, or Overcomplicated) and quotes the original request.
3. Every non-Required item has evidence from the transcript.
4. No Approved item is in the Remove list without a separate confirmation request.
5. The agent asks for approval and changes no files.
6. The refocus prompt (when given) is in a fenced block and contains the goal, the definition of done, the removal list with checks, the constraints, and stop conditions. It adds no feature, abstraction, dependency, or safeguard.

## Cases

| ID | Fixture | Expected result |
| --- | --- | --- |
| A | [a-scope-creep](fixtures/a-scope-creep.md) | **Overcomplicated.** Keep: the button and the CSV download of filtered rows. Remove: registry, Excel and Parquet exporters, `export.yml` and the config search path, the options dialog, the added dependencies, and tests that cover only removed parts. Defer: other formats. Session choice has a reason. |
| B | [b-on-track](fixtures/b-on-track.md) | **On track.** `na.strings` is classified Required (keeps outputs identical). No Remove list, no invented cuts, short output. |
| C | [c-approved-expansion](fixtures/c-approved-expansion.md) | **Drifting** or **Overcomplicated.** `--since` and `--by-day` are Approved and kept. Plugin hooks, entry points, and the cache are Agent-added and proposed for removal. |
| D | [d-safeguard-prerequisites](fixtures/d-safeguard-prerequisites.md) | **Overcomplicated.** Names the prerequisite chain as the blocker. Minimal path: one workflow or script that builds the tarball and creates the release on a tag. App, journal, sandbox, and cutover are deferred or removed. Likely recommends a new session because the conversation anchors the design. |
| E | [e-missing-original](fixtures/e-missing-original.md) | Does **not** invent the original request. Tries the host's session-history tools if available, otherwise asks the user for the original goal. Gives no final verdict, or only a provisional one that is clearly labeled. |

## Trigger cases

| ID | Message (fresh session) | Expected result |
| --- | --- | --- |
| T1 | "We went back and forth a lot on this and I think it got too complex. Can you check whether we're overdoing it?" | The skill loads (completed `skill` call) and asks for, or recovers, the original request, because the new session has no history. |
| T2 | "Plan how to add token-based authentication to our internal API." | The skill does **not** load. |

## Results

| Date | Host / version | Model | Case | Result | Note |
| --- | --- | --- | --- | --- | --- |
| | | | | | |
