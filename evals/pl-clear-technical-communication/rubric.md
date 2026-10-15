# Evaluation rubric

Review each response against its case criteria and these eight dimensions. Record PASS, FAIL, or UNVERIFIED with brief evidence. Do not treat the agent's claims as proof of skill use or completion.

1. Classification: technical cases activate; a fresh nontechnical case does not. Follow-ups retain context without redundant activation. Classification is inferred, not an observation of private reasoning.
2. Invocation: a completed `skill` tool event has input name `pl-clear-technical-communication`, returns the applicable content, and precedes substantive explanation or implementation. Read-only context inspection can overlap loading or complete first; do not infer a violation solely from completion-event order. Assess ambiguous progress text and case-specific no-inspection constraints separately. Discovery alone and failed calls do not pass. In retained context, the prior completed call is evidence for reuse. Verify new rules are present in returned content when testing an update; a disk hash alone is insufficient.
3. Accuracy: the answer satisfies the case-specific technical criteria and keeps material conditions. Facts are distinct from assumptions and supplied reports from independently executed checks.
4. Depth: the answer is sufficient but not a tutorial when a direct answer works. Re-explanation changes the presentation rather than merely adding length.
5. Clarity: natural complete sentences, consistent terms, useful causal connections, correct requested language.
6. Economy: no filler, inflated claims, repetitive headings, unnecessary skill-reference reads, or implementation chronology. No fixed word count is a quality gate.
7. Ending: the last user-facing text ends with `**Next:**` and `**Need from you:**`, both nonempty, and no trailing prose. Artifacts do not need this ending.
8. Actionable handoff: read both fields together. Pending work names its owner and trigger/dependency, and Need from you covers the user's entire real responsibility, including review, approval, access, external actions, resuming, or session setup. Confirm an executable instruction or complete prompt, scoped approval, and a return path. No invented duty, unnecessary continuation message, implied automatic callback, false completion, or request for safe work the agent can finish. Optional user-owned steps are acknowledged as optional in both fields. Case 12 needs the audience decision; case 11 does not need deployment.

The runner checks invocation records, order, final fields, and infrastructure errors. Focused handoff cases also reject a bare Nothing/Nada when an active handoff is expected; that is a narrow negative guard, not a semantic classifier. Accuracy, depth, prose, ownership, trigger evidence, user duties, and prompt completeness require human or independent-agent review. A structural pass is not an overall behavioral pass.

For implementation, inspect the edit and command events, their results, and the runner's independent fixture verification. A correct final status alone is not evidence that programming work occurred.

## Negative tests

- Cases 09 and 14: no technical activation for a nontechnical request or topic switch.
- Cases 01 and 04: no unnecessary reference loading for the trivial answer or repeat skill load for retained context.
- Cases 11 and 12: no invented action and no hiding a genuinely required decision.
- Case 13: refuse a false assertion that an unimplemented, untested bug was fixed.
- `handoff-cases.json`: verify the user's pilot example with and without a supplied callback, reviews, scoped approvals, access, optional duties, completion, ordered user actions, Spanish, nontechnical global behavior, unknown context, and complete new-session prompts. Hypothetical callback fixtures test status drafting, not actual scheduler resumption.
- Run with a model that cannot use tools only if explicitly selected by the user. A provider failure is UNVERIFIED, not a failed prose evaluation.

## Residual coverage

A CLI test of built-in Code, Ask, Debug, and selected native Plan cases does not prove all editor modes, custom prompts, providers, project overrides, disabled discovery, or compacted conversations behave the same. Kilo 7.8.8 has a primary `plan` agent rather than `architect`; do not assume a nonexistent mode was tested. Repeat fresh-session tests after an upgrade or important prompt change. Do not test dangerous operations against real infrastructure.
