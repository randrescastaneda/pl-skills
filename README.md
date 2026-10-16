# pl-skills

Personal, project-agnostic agent skills. Every skill name starts with `pl-`, so they are easy to spot next to project and third-party skills.

Kilo Code is the primary host. The skills follow the open [Agent Skills](https://agentskills.io/specification) format, so Codex, Claude Code, and other compatible agents can use them too.

I write these for my own work across all my projects. You are welcome to install, fork, or adapt them.

## Skills

| Skill | Category | What it does |
| --- | --- | --- |
| `pl-clear-technical-communication` | communication | Clear, concise, accurate technical explanations and reports, ending with an explicit handoff: who acts next, and what the user must do. |
| `pl-overcomplication-check` | agent-workflow | Checks whether a task has grown beyond its purpose, proposes what to keep, remove, and defer, and writes a refocus prompt for this or a new session. Removes nothing without approval. |
| `pl-skill-steward` | meta | Routes a task to the right `pl-` skill, and governs how skills are added, changed, renamed, retired, and composed. |

The full catalog, the category list, and the interaction map are in [`skills/pl-skill-steward/references/catalog.md`](skills/pl-skill-steward/references/catalog.md).

In Kilo, every loaded skill is also a slash command, for example `/pl-overcomplication-check`.

## Install

### Kilo Code (recommended)

Clone the repository anywhere you keep code:

```sh
git clone https://github.com/randrescastaneda/pl-skills.git
```

Then connect the clone's `skills` folder to Kilo in one of two ways. Kilo reads the clone directly in both, so `git pull` followed by `/reload` updates every skill.

**Option A: global `skills.paths` (simplest).** Merge this into your global Kilo config, `~/.config/kilo/kilo.jsonc` (Windows: `%USERPROFILE%\.config\kilo\kilo.jsonc`):

```jsonc
{
  "skills": {
    "paths": ["/absolute/path/to/pl-skills/skills"]
  }
}
```

On Windows, use forward slashes, for example `"E:/code/pl-skills/skills"`. Limitation: a project whose own Kilo config sets `skills.paths` replaces the global list, so the `pl-` skills are missing in that project. Use option B if you work in such projects.

**Option B: a personal Kilo config folder (works in every project).** Kilo scans the `skills/` folder of the directory named by the `KILO_CONFIG_DIR` environment variable, in addition to its normal locations. Create a dedicated folder (not the clone itself: Kilo writes a `.gitignore` into config folders) that contains a link named `skills` to the clone's `skills` folder, and point the variable at it:

```powershell
# Windows PowerShell
New-Item -ItemType Directory -Path 'D:\kilo-config'
New-Item -ItemType Junction -Path 'D:\kilo-config\skills' -Target 'D:\code\pl-skills\skills'
[Environment]::SetEnvironmentVariable('KILO_CONFIG_DIR', 'D:\kilo-config', 'User')
```

```sh
# macOS / Linux (add the export line to your shell profile)
mkdir -p ~/kilo-config && ln -s ~/code/pl-skills/skills ~/kilo-config/skills
export KILO_CONFIG_DIR="$HOME/kilo-config"
```

Restart the editor (or terminal) so that Kilo starts with the variable. To uninstall, remove the variable and the folder; on Windows, delete the junction with `cmd /c rmdir <path>`, which removes only the link.

**Then:** run `/reload` in an open session, or start a new session. A long-running VS Code or Positron Kilo backend may need an extension restart before it sees new skills. To check, ask the agent "Which pl- skills do you have?", or run `kilo debug skill` and look for the `pl-` entries.

### Other agents (Codex, Claude Code, Cursor, and others)

Use the open [skills CLI](https://github.com/vercel-labs/skills). It copies the skill folders into your agent's skill directory:

```sh
npx skills@latest add randrescastaneda/pl-skills --list   # show available skills
npx skills@latest add randrescastaneda/pl-skills -g       # install globally; choose your agent when prompted
npx skills@latest update                                  # later: update installed skills
```

Each `pl-` skill works on its own. When one skill mentions another, it states what to do if the other is not installed.

Status: these `npx` commands follow the skills CLI documentation but have not yet been tested against this repository. The repository uses the standard `skills/<name>/SKILL.md` layout that the CLI expects. Please open an issue if they fail.

## Optional: always-on technical communication

Skills load on demand. To apply `pl-clear-technical-communication` to every technical request, add a rule like this to your agent's global instructions (Kilo: `~/.config/kilo/AGENTS.md`; Codex: `~/.codex/AGENTS.md`; Claude Code: `~/.claude/CLAUDE.md`):

```md
For every technical request or technical follow-up, load and apply the
`pl-clear-technical-communication` skill before any substantive answer.
```

## Repository layout

```text
skills/<name>/          # one folder per skill: SKILL.md, references/, scripts/, assets/
evals/<name>/           # test cases and harnesses (source repository only)
scripts/validate.py     # structure and consistency checks (Python 3, standard library)
```

## Adding or changing skills

Ask your agent to use `pl-skill-steward`, for example "add a pl- skill that ..." or "change pl-overcomplication-check so that ...". The steward reads the set's charter, catalog, and conventions before it edits anything, and updates the catalog, this README, and the changelog.

Before committing, run:

```sh
python scripts/validate.py
```

Raw evaluation results (`evals/**/results/`) contain transcripts and local paths and are never committed.

## License

[MIT](LICENSE)
