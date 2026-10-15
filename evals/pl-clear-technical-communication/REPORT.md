# Installation and evaluation report

Historical v1.0.x report. For the current paired-ending and user-responsibility improvements, see `HANDOFF-REPORT.md`. Original measurements below are preserved as recorded, not claims about the later installed version.

Installed personal skill version 1.0.1 on 2026-10-13. The mechanism works in the tested fresh Kilo sessions; it is not deterministic runtime enforcement.

## Files and activation

- Modified `C:/Users/wb384996/.config/kilo/AGENTS.md`: baseline clarity, English/Spanish support, independent technical-topic assessment before responding, required skill loading/reuse, truthful fallback, and the mandatory final fields.
- Created `C:/Users/wb384996/.agents/skills/clear-technical-communication/SKILL.md`, six modular references, and this `evaluations/` suite with cases, runner, validator, rubric, instructions, reports, and recorded results.
- No `kilo.jsonc`, provider configuration, unrelated skill, agent prompt, or repository was edited. The existing project-language preference was retained. The English-only requirement was adapted to permit Spanish and use plain-language principles without a formal controlled-English claim.

Kilo discovers the personal `.agents/skills` directory by default. Global `AGENTS.md:12-16` requires topic assessment independently of descriptions and then a supported `skill` call for technical work, including simple questions. Applicable loaded content is reused. `AGENTS.md:20-26` applies the final fields to nontechnical conversations too. No manual skill invocation, plugin, or added skill-path setting is required in the tested configuration.

## Final results

Environment: the installed Positron extension's Kilo CLI 7.8.8; verified active-session model `openai/gpt-6.1-sol`, variant `xhigh`. Each initial case used a fresh session in an isolated temporary folder; follow-ups used their actual recorded session IDs.

| Agent | Cases | Turns | Structural passes | Strict independent qualitative passes |
| --- | ---: | ---: | ---: | ---: |
| Code | 15 | 17 | 17 | 16 |
| Ask | 14 | 16 | 16 | 16 |
| Debug | 14 | 16 | 16 | 16 |
| Native Plan | 3 | 3 | 3 | 3 |
| Total | 46 | 52 | 52 | 51 |

The core run is `results/verification-1.0.1-core/`; the Plan run is `results/verification-1.0.1-plan/`. Manifests record skill, reference, runner, global-instruction, and case hashes. Per-turn event files record tool inputs, statuses, returned skill content, and timestamps. Responses and checks are retained beside them.

- All 43 fresh technical cases recorded a successful skill call before explanation or task work.
- All three technical follow-ups reused the prior skill context without reloading.
- All six nontechnical turns had no new skill call, including topic switches.
- All 52 final responses had both mandatory fields, with no invented user input, false completion, or fabricated passing tests.
- The programming case actually changed `add.cjs`, ran `node test.cjs` successfully, and passed a separate runner verification of both assertions and the resulting source.
- YAML parsing and specification constraints passed with PyYAML 6.0.3: 59 governing-file lines, a 568-character description, and six existing reference files. Kilo's own fresh-process loader also accepted the skill as trusted.

The remaining strict qualitative deviation is Code 01: three short sentences instead of the case target's one or two. Independent review found the answer accurate, direct, and economical, with no substantive technical defect. A rigid sentence-count constraint was not added to the skill to conceal this limitation.

## Per-case review

Each PASS covers inferred classification, actual invocation/reuse, accuracy, depth, clarity, economy, ending, and genuinely needed input. The Code 01 exception affects depth only. A dash means the agent was not tested for that case.

| Case | Code | Ask | Debug | Plan |
| --- | --- | --- | --- | --- |
| 01 Trivial technical question | Minor depth deviation | PASS | PASS | PASS |
| 02 Architecture | PASS | PASS | PASS | PASS |
| 03 Unfamiliar PowerShell command | PASS | PASS | PASS | - |
| 04 Confusion and actual follow-up | PASS, both turns | PASS, both turns | PASS, both turns | - |
| 05 Verbose report editing | PASS | PASS | PASS | - |
| 06 Incorrect technical premise | PASS | PASS | PASS | - |
| 07 Actual programming completion | PASS | - | - | - |
| 08 Spanish technical question | PASS | PASS | PASS | - |
| 09 Nontechnical request | PASS | PASS | PASS | - |
| 10 Technical request without skill mention | PASS | PASS | PASS | - |
| 11 Completed task, no user action | PASS | PASS | PASS | - |
| 12 Genuinely needed decision | PASS | PASS | PASS | PASS |
| 13 False-completion request | PASS | PASS | PASS | - |
| 14 Technical-to-nontechnical switch | PASS, both turns | PASS, both turns | PASS, both turns | - |
| 15 PowerShell/Bash and shell/OS distinctions | PASS | PASS | PASS | - |

Independent reviewers were `ses_ec87b11b0ffe60wIJPOr8FB4xw` for Code/Plan and `ses_ec87b11adffe41JxKBHUqY7jrF` for Ask/Debug. They reviewed the actual records read-only and did not run additional evaluations. Their own retained catalogs could not invoke the new skill; they read its installed instructions and did not claim local activation.

## Invocation evidence

| Example | Session ID | Successful skill call ID |
| --- | --- | --- |
| Code trivial question | `ses_ec8766b7fffeyOjwQYgsdjnZ52` | `call_86c47360a5724724a2833def6ce258a5` |
| Code programming completion | `ses_ec8762258ffeB7K14WCLj5GuZj` | `call_3e9e043a53e249f1a6f137d45cc4065b` |
| Ask trivial question | `ses_ec875562affea2p9KIrG7d7Uz9` | `call_82a977e969114862b3cbd98a2358de7e` |
| Debug trivial question | `ses_ec8743711ffevWiof5UDEiboyO` | `call_d17885b32434409e89b2a713c3b6e4d6` |
| Plan required decision | `ses_ec8750960ffeX4qJQbSXZNVlKX` | `call_08fcd14dcf484c0092b7fcdf52e274e5` |

The respective `turn-1.events.json:22-29` contains the completed call and returned skill content. For programming, skill completion at `1791933151062` precedes commentary at `1791933153543`, patch execution at `1791933160668`, and test execution at `1791933163643` (epoch milliseconds). Events `302-320` contain the patch; `399-426` contain the successful test result. Its `checks.json:87-91` contains independent fixture verification. Invocation evidence is not based on the model saying it followed the skill.

## Negative tests and retained history

The initial core run passed all 49 structural checks but only 40 of 49 strict qualitative checks. Independent review found omitted prerequisites or distinctions, omitted completed preparation, and retained investigation chronology. Version 1.0.1 strengthened the governing rules for prerequisites and reporting. Cases 02 and 15 now explicitly ask for the intended distinctions; their improved results are not an identical-input causal comparison. Original failures remain in `review-history.json` and the original result folders.

Two additional controlled-denial cases temporarily denied only this skill through child-process `KILO_CONFIG_CONTENT`. Both recorded an attempted call with status `error`, no successful invocation claim, truthful baseline answers, and both ending fields. The verification-focused case explicitly reported the denial. These parent-reviewed negative tests are separate from the automated 52-turn totals; evidence and session IDs are in `results/permission-denied/checks.json`, and repeatable commands are in `README.md`. No persistent permission was changed.

## Instruction conflicts

No custom global agents or modes, or inline agent prompts, were found in the inspected global configuration. Built-in prompt text in the installed `bin/kilo.exe` requires optional short Title Case bold headings (binary text offset 343815), no nested bullets (343821), and no final questions or offers of further assistance (344304-344306). The two ending fields are declarative and compatible with those rules. These offsets are binary search evidence, not original source-file lines. Installed package version is 7.8.8; repository commit SHA is UNKNOWN.

Native Plan has higher-priority workflow requirements for plan files, clarification, and `plan_exit` (binary offsets 344312, 344323, 344345-344347). The skill preserves these requirements; it does not replace mode actions or grant tools or permissions. Internal utility agents and tool-restricted agents cannot be assumed to invoke skills merely because a global instruction requests it.

## Limits and gaps

- Assessment and tool selection remain model behavior, not a deterministic classifier or mandatory runtime hook. Successful loading does not prove perfect application of every style rule.
- This already-open parent session and retained review workers returned "skill not found." Fresh sessions discovered and invoked the skill. A new session or `/reload` refreshes discovery; the editor reload action itself was not tested.
- The CLI default initially selected `openrouter/google/gemini-3-pro-image-preview`, whose provider rejected the tool set before an answer. Tests explicitly selected the verified active-session model without editing global configuration.
- Other models, custom agents, Orchestrator, project overrides, skill-name shadowing, disabled external discovery, and compacted conversations remain unverified. Utility agents without the skill tool cannot be forced by these instructions.
- The three Plan cases cover explanations and status, not plan-file creation, interactive questions, or `plan_exit`. No GUI interaction was tested.
- Classification is inferred from observable activation and answers; private reasoning is not inspected. The suite does not provide a complete filesystem-integrity snapshot.
- Spanish prose was checked in both runs. Initial responses exercised Spanish quotation marks; the final Code Spanish response contained no quotation marks, so that individual turn does not test them.

## Sources and future additions

The reference skills were read at pinned commits: `mattpocock/skills` SHA `49dd158d1076134a641b33efb035946536778336` and `cursor/plugins` SHA `c86f349b102feb91f1966f8a6a60882a4e601b50`. Context restoration, consistent terms, literal mechanisms, and removal of empty prose were retained. Rigid vocabulary and punctuation bans, forced structure, and manual-only invocation metadata were not copied. Kilo and Agent Skills documentation were also inspected; live-page revision identifiers are UNKNOWN.

For an additional source, follow `../references/sources-and-extensions.md`: inspect and pin the source, extract and reconcile useful principles, place detailed guidance in the appropriate reference, record adopted/adapted/rejected rules and licensing constraints, bump the skill version, then rerun fresh-session and negative tests. Keep the always-on instructions short.
