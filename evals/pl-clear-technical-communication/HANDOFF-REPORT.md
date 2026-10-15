# Paired handoff update

Installed skill version 1.1.1 on 2026-10-15. This update makes Next and Need from you one actionable handoff rather than unrelated summaries. It addresses the user's example of pending pilot integration paired with an unexplained "Nothing."

## Governing behavior

- Pending work identifies its owner, next action, and continuation trigger or dependency.
- User responsibilities include review, approval, decisions, access, external actions, resuming a conversation, and opening another session, not just supplying information.
- "Nothing" is appropriate when the task is complete. For autonomous pending work, the ending must name the verified mechanism that will resume the agent. A running process alone is insufficient.
- If a user message is needed, supply the exact message and say where and when to send it. Do not stop work the agent can safely finish merely to request "continue."
- If another session is genuinely needed, provide its workspace/mode and a complete ready-to-send prompt with goal, current state, inputs, next action, verification, and constraints. Do not assume access to the previous conversation.
- Review and approval requests identify the artifact, checks or scope, and feedback/authorization path. Missing review material does not automatically become the user's writing task.
- Distinguish existing inputs from outputs to create. Unknown continuation needs ownership and trigger context, not only integration paths or commands.
- Optional user-owned recommendations are explicitly optional in both fields. Do not invent approval, review, new sessions, callbacks, or follow-up work.

## Files

Updated global `C:/Users/wb384996/.config/kilo/AGENTS.md` and the installed skill's `SKILL.md`. Added `references/next-steps-and-handoffs.md`, and updated source/refinement notes, evaluation runner, rubric, validator, and README. Added `handoff-cases.json` and local `test-runner.cjs`. All paths except global AGENTS are under `C:/Users/wb384996/.agents/skills/clear-technical-communication/`.

No project/repository, provider configuration, unrelated skill, or custom agent prompt was edited. The always-on ending applies to nontechnical conversations even when the technical skill should not activate.

## Live evaluation

Environment: Kilo CLI 7.8.8, `openai/gpt-6.1-sol`, reasoning variant `xhigh`, matching the saved active session. Test processes explicitly selected that model without editing global provider configuration. Initial turns used isolated fresh sessions; the regression includes actual retained-context follow-ups and a real programming fixture.

| Run | Turns | Recorded structural passes | Independent semantic passes |
| --- | ---: | ---: | ---: |
| Initial v1.1.0 Code/Ask focused cases | 24 | 23 | 21 |
| Initial v1.1.0 Plan probes | 4 | 4 | 4 |
| Initial v1.1.0 regressions | 15 | 15 | 15 |
| Refined v1.1.1 Code/Ask targeted checks | 14 | 14 | 14 |
| Refined v1.1.1 Plan new-session check | 1 | 1 | 1 |
| Refined v1.1.1 actual programming check | 1 | 1 | 1 |

The initial records remain unchanged. There were three genuine semantic defects in v1.1.0: Code h05 assumed an existing output report; Code h12 requested integration inputs but omitted owning-session/trigger context; Ask h10 assigned the reviewer a missing-content supply duty. Version 1.1.1 made the corresponding distinctions explicit. The affected test prompts and fixtures did not change for the reruns. Every one of the 16 final live turns passed independent semantic review, including all initially defective cases selected for retesting.

The other initial structural flag was not a semantic defect. In Code h10, the skill call began 7 ms before a read-only report lookup; the read completed first, and skill completion preceded all response text. The initial guard wrongly treated that lookup's completion order as implementation. The corrected guard allows read-only context and compares skill completion against operation/text start timestamps when available. It falls back to event order when times are absent; ambiguous progress text still needs semantic review. Original measurements are not relabeled.

Fresh invocation evidence is in each run's `turn-*.events.json`, beside responses, checks, summaries, and manifests. Representative final calls:

| Turn | Successful call ID | Evidence |
| --- | --- | --- |
| Code h05 new-session prompt | `call_855a74aa11d04bb4835ce79ec19a1699` | `results/handoff-1.1.1-focused/code-h05-new-session-prompt/turn-1.events.json:29` |
| Ask h10 Spanish review | `call_06b403eccf7048f1ba76f8c2ae225430` | `results/handoff-1.1.1-focused/ask-h10-spanish-handoff/turn-1.events.json:29` |
| Plan h05 new-session prompt | `call_bcf55dc639c147ce93bcf2aec78d1226` | `results/handoff-1.1.1-plan/plan-h05-new-session-prompt/turn-1.events.json:29` |

The reviewers matched the three new v1.1.1 clauses in the actual returned skill body for all 14 technical turns in the final runs, not merely the skill name/tag or a disk hash. The two final nontechnical invitation-review turns invoked no skill and still used the global actionable-handoff rules.

## Focused coverage

| Scenario | Initial semantic result | Final targeted result |
| --- | --- | --- |
| Pilot requires a user continuation message | Code/Ask/Plan PASS | Code/Ask PASS |
| Supplied verified callback, no user duty | Code/Ask/Plan PASS | Code/Ask PASS |
| User review gate | Code/Ask PASS | Not rerun |
| Explicit staging-only approval | Code/Ask PASS | Not rerun |
| Complete new-session prompt | Code FAIL; Ask/Plan PASS | Code/Ask/Plan PASS |
| Administrator grants read-only staging access | Code/Ask PASS | Not rerun |
| Optional user wording review | Code/Ask PASS | Not rerun |
| Complete task, no duties | Code/Ask/Plan PASS | Code/Ask PASS |
| Review followed by conditional scoped approval | Code/Ask PASS | Not rerun |
| Spanish review and missing material | Code PASS; Ask FAIL | Code/Ask PASS |
| Nontechnical review without technical activation | Code/Ask PASS | Code/Ask PASS |
| Unknown continuation context | Code FAIL; Ask PASS | Code/Ask PASS |

Regression responses also preserved minimal answers, genuine decisions, reuse without redundant activation, nontechnical non-activation, truthful completion, no invented work, and real execution instead of an unnecessary "continue" handoff.

## Independent review and harness checks

Reviewers `ses_ebfee734affeZDfh2YyTAnWoV9` and `ses_ebfee7347ffeVkd7W3hNxwKsBa` reviewed raw tool records, response meaning, source rules, and programming evidence read-only. They did not launch further model evaluations.

The programming agent actually patched subtraction to addition and ran `node test.cjs`. The runner independently executed its original in-memory assertions via `node -e`, confirmed `test.cjs` was unchanged, and recorded zero implementation-verification failures. Failed or altered tests now affect case status, aggregate verification failures, and exit code. This does not constitute a complete filesystem-integrity audit.

The final local checks passed: 8/8 Node unit tests, YAML/specification validation, all 12 required handoff cases and their schema constraints, and parsing of 342 saved JSON artifacts. Units cover actual invocation evidence, allowed read-only context, output/edit ordering, concurrent operations whose completion order could hide an early start, nontechnical behavior, false invocation claims, and final-field placement. Units use synthetic events and are not live skill-use evidence. The last pure harness refinements were checked locally after live runs; manifests retain the runner hashes used at run time.

## Limits and gaps

- This is model-followed behavior, not deterministic enforcement. Successful loading still does not guarantee a usable handoff; independent semantic review remains necessary.
- Callback cases are explicitly hypothetical drafting scenarios with supplied verified states. They do not establish a real callback or end-to-end automatic resumption. The update did not inspect, resume, or alter the user's other pilot conversation.
- One model/version combination was tested through CLI Code/Ask and selected Plan cases. Other providers, full GUI workflows, compaction, project overrides, and custom agents remain unverified.
- Retained parent/reviewer sessions can return an older skill body despite a successful call. Fresh CLI records returned the new clauses. The cause and editor refresh behavior were not established; use fresh discovery or explicitly reread the current on-disk rules when repairing an old conversation.
- Final v1.1.1 live tests were targeted, not a second complete execution of every earlier scenario. The exact coverage above distinguishes reruns from earlier passes.
- Independent verification failure branches and aggregate nonzero exits were reviewed in source, not exercised with deliberately corrupted fixtures in an end-to-end negative run. Timestamp-absent cases use an order fallback and may need semantic judgment.

## Practical repair request

For an existing conversation with an ambiguous ending:

> Re-read the current global handoff rules and replace your last two fields as one coordinated handoff. State who acts next, what triggers continuation, and exactly what I must do, including review or approval. If I need to resume or start another session, provide the complete prompt. If I need do nothing, identify the verified continuation mechanism. Do not invent user duties or stop work you can safely finish.

This is optional repair guidance, not an instruction to start another session or an assertion that the quoted pilot has any particular continuation mechanism.
