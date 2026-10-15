# Maintenance checklists

Work in the source repository. Read the charter, the catalog, and the conventions first (Maintain mode, step 2).

## Add a skill

1. Confirm that the need passes the new-skill gate in `SKILL.md`. If an existing skill covers most of it, extend that skill instead (see "Modify a skill").
2. Choose the name and the category. Compare the planned triggers with every "Use when" entry in the catalog; there must be no overlap.
3. Copy `assets/skill-template.md` to `skills/<name>/SKILL.md`. Fill in the frontmatter with version `1.0.0`.
4. Write the process. Move long detail into `references/`.
5. Create `evals/<name>/cases.md` with at least one positive case (the skill should trigger and do the job), one negative case (it should not trigger, or should report that nothing is needed), and one boundary case.
6. Add the catalog row and the interaction-map edges. Add the README table row. Add a `CHANGELOG.md` entry.
7. Run `python scripts/validate.py`.
8. Check discovery: in Kilo, run `/reload` and look for `/<name>`, or run `kilo debug skill` in a new terminal.
9. Run the eval cases in a fresh session, and record the results in `cases.md`.

## Modify a skill

1. Read the skill in full, its eval cases, and every catalog row and interaction-map entry that mentions it.
2. Restate its purpose and boundaries. Confirm that the change stays inside them. If it does not, treat it as a scope change: update the description and the catalog, and consider a major version.
3. Make the change. Keep `SKILL.md` as the governing process; put detail in references.
4. Search the repository for the skill's name. Update the interaction map and any other skill that depends on the changed behavior.
5. Bump `metadata.version` (rules below). Add a `CHANGELOG.md` entry.
6. Run the validator. Add or adjust eval cases for the changed behavior, and run the affected cases.

## Rename a skill

Avoid renames. If one is necessary:

1. Rename the folder and `name` together. Bump the major version.
2. Search the repository for the old name, and update every match except historical records (changelog, past eval reports).
3. Add a `CHANGELOG.md` entry with "old name -> new name".
4. Tell the user to update explicit references outside the repository (for example, a global `AGENTS.md`) and to reload sessions.

## Retire a skill

1. Check the interaction map. No other skill may depend on the skill without a fallback.
2. Delete `skills/<name>/` and `evals/<name>/`.
3. Remove the catalog row, the interaction-map edges, and the README row. Add a "Removed" entry to `CHANGELOG.md`.
4. Run the validator. Tell the user to update explicit references outside the repository.

## Versioning

Each skill has its own SemVer version in `metadata.version`.

| Change | Bump |
| --- | --- |
| Wording, typo, or clarification with no change in behavior | patch |
| New behavior or reference, with backward-compatible triggers and output | minor |
| Rename, removed behavior, narrowed or materially changed trigger scope, or a changed output that other skills depend on | major |

## Changelog format

Newest date first. One heading per changed skill, one line per change:

```md
## YYYY-MM-DD

### pl-<name> <new version>

- Added: ...
- Changed: ...
- Fixed: ...
- Removed: ...
```

Changes outside skills go under `### Repository`.
