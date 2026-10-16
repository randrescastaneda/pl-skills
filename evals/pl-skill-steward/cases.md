# Eval cases: pl-skill-steward

Manual cases. Run each in a **fresh** Kilo session. Record the date, host and version, model, PASS / FAIL / UNVERIFIED per criterion, and a one-line note in the results table. Do not name the skill in the message unless the case says so.

## Safety for cases that change files (S4, S5)

The steward edits the source repository it is loaded from. Run S4 and S5 on a throwaway branch of the source repository:

```sh
git switch -c eval/steward
# run the case in a fresh session whose workspace is the repository
git add -A && git commit -m "eval: steward case output"   # keep the result for review
git switch main
git branch -D eval/steward                                  # after review
```

## Cases

| ID | Message | Expected result |
| --- | --- | --- |
| S1 | "Which pl- skill should I use to check whether this task has become too complicated?" | Route mode. Recommends `pl-overcomplication-check` with one sentence of reasoning. Changes no files. |
| S2 | "Which pl- skill helps me write a Stata do-file?" | Route mode. Says that no `pl-` skill fits yet. Does not create a skill; mentions the new-skill gate only if relevant. Changes no files. |
| S3 | "Add a pl- skill that checks tasks for scope creep." | Maintain mode. Reads the charter and catalog, finds the overlap with `pl-overcomplication-check`, and recommends extending it instead. Creates nothing before the user agrees. |
| S4 | "Add a pl- skill that guides me through releasing an R package to CRAN." | Maintain mode. Restates the set's purpose first. Creates `skills/<name>/SKILL.md` from the template (category `software-engineering`, version 1.0.0), `evals/<name>/cases.md`, the catalog row and interaction-map edges, the README row, and a CHANGELOG entry. Runs the validator and it passes. Tells the user to `/reload`. |
| S5 | "Change pl-overcomplication-check so that the verdict also estimates how much work the simplification saves." | Maintain mode. Reads the skill, its eval cases, and the catalog first, and restates the skill's purpose and boundaries. Bumps to a minor version, adds a CHANGELOG entry, adds or updates an eval case, and runs the validator. |

## Results

| Date | Host / version | Model | Case | Result | Note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-16 | Kilo CLI 7.8.8, `kilo run --agent code` | openai/gpt-6.1-sol | S1 | PASS | Loaded the steward, read only the catalog, recommended `pl-overcomplication-check`, changed nothing. The answer omitted the global Next / Need from you fields (a global-instructions issue, not the steward). |
| | | | S2-S5 | NOT RUN | |
