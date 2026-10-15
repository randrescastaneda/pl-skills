# Repeatable communication evaluation

Evaluates `skills/pl-clear-technical-communication/`. The skill was renamed from `clear-technical-communication` in v2.0.0. `REPORT.md`, `HANDOFF-REPORT.md`, and `review-history.json` record the v1.x runs against the old name and its old location (`~/.agents/skills/clear-technical-communication/`); they are kept unchanged as history. Raw run output goes to `results/`, which git ignores because it contains full transcripts and local paths.

Requires Node.js 18 or later and an authenticated Kilo CLI. The suite runs actual Kilo sessions without mentioning the skill in the test prompts. It creates isolated temporary folders under the OS temp directory (set `TEMP`/`TMP` to move them), preserves existing configuration, records successful tool calls, and independently checks the programming fixture. It does not use Agent Manager or touch a repository. Runs use model tokens and may incur normal provider charges.

For a read-only format and fixture check, run `python validate.py` with Python 3 and PyYAML installed. This uses an actual YAML parser and checks specification constraints, reference paths, and test-case structure. Kilo's fresh-process `debug skill` discovery also checks that its own loader accepts the skill. Neither format check proves response quality.

Run `node --test test-runner.cjs` for eight local checks of invocation evidence, read-only context timing, implementation/output ordering, concurrent-operation start times, and final-field placement. These use synthetic unit-test events, not live invocation evidence.

The verified command uses the active editor session's model and reasoning variant. Replace `<kilo-cli>` with the Kilo executable bundled with your editor extension (for example, `<editor-extensions>\kilocode.kilo-code-<version>-win32-x64\bin\kilo.exe`). From this directory, run:

```powershell
node .\run.cjs --cli '<kilo-cli>' --model 'openai/gpt-6.1-sol' --variant xhigh
```

For a portable CLI on PATH, use `node run.cjs`. Default agents are `code,ask,debug`, which exist in Kilo 7.8.8. The runner checks available primary agents before testing. Case 07 only runs under Code because it requires implementation. Other cases test explanations and reports in each agent. For a focused native Plan-mode check, use `--agents plan --cases 01-trivial,02-architecture,12-decision-needed`.

Optional arguments are `--suite` (a JSON case file relative to this directory, default `cases.json`), `--agents`, `--cases`, `--concurrency`, `--timeout` in milliseconds, and `--output` for a new results directory. For example, `--agents code --cases 01-trivial,09-nontechnical --concurrency 1` is a short discovery and activation check.

`--model provider/model` and `--variant value` select only the test process, not global configuration. Omit them to use the CLI default. If the CLI default is not the active editor model, use its verified provider/model and variant for an equivalent-model test; document that selection. Do not silently substitute a different model when a provider fails.

At installation time, the CLI default was `openrouter/google/gemini-3-pro-image-preview`; its provider rejected the available tool set. The command above avoids that unrelated default only for evaluations. No default or provider configuration was changed.

Each run writes a manifest, per-turn tool events, responses, checks, and `summary.json` under `results/<timestamp>/`. A nonzero exit indicates infrastructure or structural-check failures, not necessarily a prose defect. Provider error headers are not copied into artifacts. Temporary fixture folders remain available for inspection.

Read `rubric.md`, then review responses independently against the eight dimensions and case criteria. Keep qualitative review results separate from structural checks. Do not mark the suite passed solely because the final fields are present.

Fresh CLI processes verify rediscovery and new-session activation. Multi-turn cases verify continuation using the actual recorded session. In the editor, new-session discovery uses the installed backend; `/reload` can refresh an existing session, but a CLI result alone does not verify that editor action.

## Paired handoff evaluations

Use `--suite handoff-cases.json --agents code,ask` with the verified CLI/model arguments above to run the 12 focused handoff cases. For Plan-mode probes, use `--suite handoff-cases.json --agents plan --cases h01-pilot-needs-message,h02-verified-continuation,h05-new-session-prompt,h08-complete-no-handoff`.

These cases cover the quoted pilot handoff with and without a supplied automatic continuation, user review, scoped approval, access, complete new-session prompts, optional duties, completion without duties, ordered review/approval, Spanish, nontechnical global behavior, and unknown continuation context. Text fixtures are created only inside each isolated temporary case folder. The runner rejects fixture targets outside that folder.

The `handoffState` field describes the expected semantic state, not a state inferred by a classifier. The automated bare-Nothing/Nada guard rejects an unexplained no-action field when a handoff is expected, but cannot prove ownership, consent, prompt completeness, or actual continuation. Independently review the fields together using `rubric.md`.

Read-only context inspection can complete before the skill finishes loading; this does not by itself violate loading before substantive explanation or implementation. The runner records such tools in `preActivationContextTools` and guards the later output/edit/execution boundary. When timestamps exist, compare skill completion against operation/text start, not merely completion-event order. Event order is the fallback when those times are absent. Treat ambiguous progress messages and case-specific no-inspection constraints separately in semantic review. The first v1.1.0 run used a stricter guard; its original flagged record is retained rather than silently rewritten.

The programming fixture is checked again using the original assertion source held by the runner, not a potentially modified test file. The runner also verifies `test.cjs` was unchanged. `implementationVerificationFailures` contributes to the final exit status even if every turn-format check passed. This is not a complete filesystem-integrity or hostile-code security audit.

Callback cases are explicitly hypothetical status-drafting scenarios with supplied facts. They test truthful communication of a verified-versus-absent mechanism; they do not create or prove an actual end-to-end scheduler callback. The new-session fixture uses synthetic evidence assertions and must not be reported as a successful live pilot/control validation. Preserve these distinctions in reports.

For regression coverage, run `cases.json` with cases `01-trivial,04-reexplain,07-programming-complete,09-nontechnical,11-no-user-action,12-decision-needed,13-false-completion`. The programming case verifies that the agent actually finishes safe authorized work instead of handing it back with a needless "continue" request.

## Controlled activation failure

This optional negative test denies only this skill in a child CLI process. It verifies truthful fallback and failure reporting when verification makes the failure relevant. It does not edit a configuration file or grant permissions.

```powershell
$previousConfig = $env:KILO_CONFIG_CONTENT
try {
    $env:KILO_CONFIG_CONTENT = '{"permission":{"skill":{"pl-clear-technical-communication":"deny"}}}'
    & '<kilo-cli>' run --agent ask --format json --model openai/gpt-6.1-sol --variant xhigh 'This is a communication-policy verification check. Explain what an API is briefly, and report any failure to load required communication guidance. Do not change files.'
}
finally {
    $env:KILO_CONFIG_CONTENT = $previousConfig
}
```

Expected evidence: an attempted `skill` call with status `error`, no successful skill invocation, an accurate brief answer, explicit denial reporting, and both final fields. For the ordinary-question variant, use `What is an API? Answer without changing files.`; do not require an irrelevant activation announcement. Recorded results are in `results/permission-denied/checks.json`.

See `HANDOFF-REPORT.md` for the v1.1.x handoff update. `REPORT.md` and `review-history.json` retain the original v1.0.x installation outcomes and failures.
