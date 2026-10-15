# Signals of overcomplication

Use these signals to test Agent-added, Speculative, and Unknown items. One signal is a question, not a verdict. Several signals on the same item, or one signal that blocks the core path, are strong evidence.

## Signals

| Signal | Typical evidence | Question to ask |
| --- | --- | --- |
| Prerequisite chain | "Before we can do X, we first need Y and Z"; the first working version keeps moving later. | Can a simple working path ship first, with Y and Z added later if still needed? |
| Safeguards for hypothetical failures | Guards, retries, locks, journals, approvals, or fallbacks for failures that never happened and that nobody reported. | What real failure does this prevent, and how likely is it now? |
| Abstraction with one user | Interfaces, plugin systems, registries, factories, or config schemas with a single caller or a single option. | Would a direct implementation be shorter and just as correct? |
| Generalization beyond the request | "Supports any format", "works for every project", "configurable" when the request named one case. | Did the user ask for the general case? |
| New dependencies | Packages, services, tools, or accounts added for a small gain. | Is the gain worth installing, updating, and securing this dependency? |
| Fix-on-fix cycles | Each fix creates the next problem; two or more cycles on the same premise. | Is the premise wrong, and would a simpler design remove the problem class? |
| Compatibility layers nobody asked for | Migration shims, legacy modes, or version branches without a user who needs them. | Who uses the old path today? |
| Growing plan or document | The plan, README, or design note grows each iteration while the deliverable does not. | Which parts of the plan does the definition of done need? |
| Tests of internals or of hypotheticals | Many tests for unlikely cases or private details; few for the requested behavior. | Do the tests prove the requested behavior? |
| Drive-by additions | "While I was here", refactors, renames, or formatting outside the task. | Was this part of the task, or a separate change? |
| Process instead of product | New workflows, gates, tooling, or automation around a task that is still not done. | Would the task be done sooner without this process? |
| Vocabulary drift | New names or concepts that the user never used and that must now be explained. | Does the user need this concept to use the result? |

## Counter-signals (complexity that may be required)

- The user explicitly asked for it, or approved it after it was proposed. Classify it as Approved.
- A legal, security, privacy, or data-integrity constraint requires it, and the constraint is documented in the project or the conversation.
- It makes an irreversible or destructive action reversible (backups, dry runs, confirmations) for an action the task actually performs.
- Removing it would break a Required item.
- The project's documented conventions require it (for example, a required test or lint step).

If a counter-signal applies, keep the item and say why.

## Proportionality

The check must stay cheaper than the problem. Read only what is needed to classify the items. Do not run long test suites or explore the codebase to reach a verdict; use the evidence already available, and mark the rest Unknown.
