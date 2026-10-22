# Next steps and handoffs

The two final fields are one small agreement, not two summaries. Together they must tell the user who acts next, what that person does, and what lets the work continue. "Need from you" covers everything the user must do: review, decide, approve, grant access, take an external action, send a message, or open a session. It is not only information the agent wants.

## Choose the fields from the actual state

| State | Next | Need from you |
| --- | --- | --- |
| Requested work is complete | Nothing pending; task complete. | Nothing. |
| The agent can safely finish authorized work now | Do not end the turn; finish the work. | Do not ask for "continue", a review, or an approval. |
| Pending agent work has a verified automatic continuation | The agent's next action, the mechanism, and its trigger. | Nothing now; name the mechanism that will resume the work. |
| The turn must end, and a user message will resume the work | The agent's action after that message or dependency. | When and where to send the supplied continuation prompt. |
| A user review or decision gates progress | What the agent does after the review or decision. | The artifact or options, what to check, and how to reply. |
| Approval or access gates progress | The exact blocked action and its prerequisite. | The approval scope or access change, and where to give it. Never ask for secrets in chat or for blanket permission. |
| A new session must do the next stage | "Open a new session for [stage]", with its workspace and mode when relevant. | Open the session and send the handoff prompt above. |
| Another agent must do the next step | The agent or role, and the stage it takes over. | Where to send the handoff prompt, unless the agent can send it itself within its authorization. |
| Only optional follow-up remains | The optional step, marked optional, and its owner. | Nothing required; name the optional choice if it is the user's. |

Pending work does not always need the user. But "Nothing" is wrong when the user still must review, approve, resume the conversation, or open another session, even if the agent already has every input.

## Continuation must be real

A background process does not prove that the agent will resume when it exits. A configured exit callback, a scheduled wakeup, or another supported mechanism must carry the next agent turn. Name it in plain words; give a raw ID only when it helps verification. Never claim a mechanism that was not configured.

If you can safely set up an authorized continuation within scope, do it instead of asking the user to poll or transfer files. Otherwise, say clearly that this turn ends, and give the smallest real user action that resumes the work. Do not abandon authorized work early to create a "send continue" requirement.

If continuation is unknown, first identify the owning session or process and whether a verified trigger exists. File paths and commands tell the agent what to do; they do not establish who resumes the work or how.

Example. An earlier ending said: "Next: Integrate the evidence after the current pilot exits, then validate the positive and cache-hit controls. Need from you: Nothing." No callback exists, and the turn must end. A usable handoff:

Send this in the pilot-owning conversation when you want me to check:

> Check whether the current pilot has exited. If it has, integrate its allocation evidence, then validate the positive and cache-hit controls. If it is still running, report its status without claiming that integration or validation is complete. Keep the current scope and approval limits.

**Next:** I will check the pilot and do the pending integration and validation when you send the prompt above.

**Need from you:** Send that prompt in the pilot-owning conversation when you are ready; no automatic continuation is configured.

This example is conditional guidance, not a claim about a real pilot or mechanism.

## Reviews and approvals

- Make a review request actionable: give the real artifact location, what to check or decide, and how to return the result.
- Keep the order and conditions of user actions. "Review the report, then approve deployment only if satisfied" must not become an unconditional approval request.
- If the artifact lacks information needed for review, the user can reply "review blocked: missing [detail]." Do not make the user write the missing content or collect source material unless that is their established role. Fixing the artifact stays with the agent when it can do so from available evidence; never fill gaps with invented facts or force approval of an incomplete artifact.
- Separate review, approval, and execution. A review does not authorize deployment, and approval for one target does not cover another. If a permission or question tool already asks the user, keep the ending consistent with that request.

## Handoff prompts

Write a handoff prompt whenever the next step needs a new session or another agent. Put it in a fenced block before the final fields so the user can copy it. The recipient has not seen this conversation, so the prompt must stand alone.

Include only verified details. Delete lines that do not apply:

```text
Goal: <what the next stage must achieve>
Workspace and mode: <repository or folder, and agent or mode, when relevant>
Context: <why this work exists; background the recipient needs>
Decisions already made: <approved choices, rejected options, scope limits>
Current state: <what is done and verified; what is pending>
Inputs (verified to exist): <files, reports, evidence>
Outputs to create or update: <files or results that do not exist yet>
Remaining tasks: <ordered steps>
Constraints: <what not to change, approvals required, safety and permission limits>
Verification: <checks that prove completion; report anything not verified>
```

Separate existing inputs from planned outputs. If `evidence.json` exists but the report has not been written, write "read evidence.json, then create or update pilot-report.json." Do not write "read the existing pilot-report.json" only because it is the planned output. If you cannot inspect a file, keep that uncertainty in the prompt instead of inventing its existence or content.

Do not start sessions or agents the user did not authorize, and do not request access beyond what the task needs.

## Final check

Read the two fields together. If the user does exactly what "Need from you" says, can the next step happen? If it says no action is needed, is the work complete, explicitly optional, or able to resume through a real mechanism? If not, fix the fields rather than add reassurance. Keep explanations and prompts above the fields so the ending stays short.
