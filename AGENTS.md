# Agent instructions for pl-skills

This repository is the source of the `pl-` skill set: personal, project-agnostic Agent Skills, Kilo Code first.

- Before you create, edit, rename, or delete anything under `skills/` or `evals/`, or change the README skills table or `CHANGELOG.md`, load the `pl-skill-steward` skill and follow its Maintain mode. If that skill is not available, read `skills/pl-skill-steward/SKILL.md` and its references directly.
- Run `python scripts/validate.py` (Windows: `py -3 scripts/validate.py`) before every commit. It must pass.
- Keep every skill project-agnostic: no project names, machine paths, user names, credentials, or transcripts.
- Never commit `evals/**/results/`.
- Use LF line endings (enforced by `.gitattributes`).
