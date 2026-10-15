# Next steps and handoffs

The two ending fields are a small operational agreement, not separate summaries. The reader must be able to tell who acts next, what to do, and what allows work to continue. "Need from you" includes the user's work and choices, not just facts the agent wants to receive.

## Decide from the actual state

| State | Next | Need from you |
| --- | --- | --- |
| Requested work complete | None; task complete. | Nothing. |
| Agent can safely finish authorized work now | Continue the work rather than finalize prematurely. | Do not ask for a needless "continue," review, or approval. |
| Pending agent work has verified automatic continuation | Agent action, the configured mechanism, and its trigger. | Nothing now; name the mechanism that will resume the work. |
| Turn must end and continuation needs a user message | Agent action after the user's resume message or known dependency. | Tell the user when and where to send the supplied continuation prompt. |
| User review or decision gates progress | What the agent will do after that review or decision. | Identify the artifact or options, acceptance checks, and how to return feedback or a decision. |
| Approval or access gates progress | Exact blocked action and prerequisite. | Identify the approval scope or access change and where to give it; do not ask for secrets in chat or blanket permission. |
| A new session is genuinely necessary | Who starts it, relevant workspace/mode, and the next task. | Tell the user to open it and send the complete handoff prompt provided above. |
| Optional follow-up only | Mark it optional and identify its owner. | Nothing required; explicitly acknowledge the user's optional choice if the step belongs to them. |

Do not assume pending work always requires the user. Conversely, do not use "Nothing" just because the agent already has all input data. The user may still need to approve, review, resume the conversation, or open another session.

## Continuation must be real

A process running in the background does not prove the agent will resume when it exits. Check the actual session/runtime behavior: a configured exit callback, scheduled wakeup, or other supported mechanism must carry the next agent turn. Cite that mechanism in ordinary terms; a raw ID is needed only when useful for verification. Do not claim a callback was configured merely because it would be convenient.

If you can configure a safe, authorized continuation and remain within scope, do it instead of asking the user to poll or transfer files. If not, be clear that this turn ends and give the smallest genuine user action that will resume work. Do not abandon authorized work early and manufacture a "send continue" requirement.

For the quoted pilot example, the original pair is insufficient by itself: it does not establish who will detect exit or resume integration. If a verified callback exists, say that it will resume the agent and that the user has no action now. If no automatic continuation exists and this turn must end, a usable handoff is:

Send this in the pilot-owning conversation when ready to check:

> Check whether the current pilot has exited. If it has, integrate its allocation-based computation evidence, then validate the positive and cache-hit controls. If it is still running, report its status without claiming integration or validation is complete. Preserve the current scope and approval boundaries.

**Next:** I will check the pilot and perform the pending integration and validation when you send the prompt above.

**Need from you:** Send that prompt in the pilot-owning conversation when ready to recheck; no automatic continuation is configured.

This example is conditional guidance, not a claim about an actual pilot or configured mechanism in the user's other conversation. If the process, workspace, inputs, or callback state is unknown, say so and obtain or inspect the missing context safely; do not fabricate it. First identify the owning session/process and whether there is a verified resume trigger. Integration files and control commands answer what to do, not who will resume or how; do not substitute those inputs for the missing continuation context.

## Reviews, approvals, and session prompts

A review request must be actionable: give a real artifact location, the checks or choice needed, and how the user returns the result. If multiple user actions are needed, preserve their order and conditions. "Review the report, then approve deployment only if satisfied" must not become an unconditional request to approve before reviewing.

If a draft omits the material needed for review, accept "Review blocked: the report does not list the exclusions" as review feedback. Do not require the reviewer to produce a replacement report or gather source material unless that is their established responsibility or only they have the needed knowledge/access. Correcting the report remains agent-owned when it can be done safely from available evidence; never fill gaps with invented facts or force approval of an incomplete artifact.

Separate review, approval, and execution. Reviewing does not automatically authorize deployment; approval for one target does not authorize another. Distinguish optional review from a real gate. If a user response is already required by a permission or question tool, keep the ending consistent with that request rather than substitute a different approval path.

When the user must start a new session, put a copyable prompt in the body and use the ending to say where to send it. Include only verified details: goal, current state and pending work, workspace/mode, input paths or a persisted handoff file, next action, verification, constraints, and approval boundaries. Do not depend on the previous chat being visible in the new session. Do not silently start extra sessions or request access beyond the user's authorization.

Separate existing inputs from output targets. If `evidence.json` exists but a report has not been verified, the prompt can say "read evidence.json, then create or update pilot-report.json as appropriate." It must not say "read the existing pilot-report.json" merely because that file is the planned output. When inspection is unavailable, preserve that uncertainty instead of inventing existence or results.

## Final consistency check

Read the fields together: if the user does exactly what "Need from you" says, can the next step actually happen? If it says no action is needed, is the work complete, optional and explicitly labeled, or genuinely able to resume without them? If not, repair the handoff rather than add generic reassurance. Keep explanations and prompts before the final two fields so that the ending remains compact.
