#!/usr/bin/env python3
"""Validate the structure and consistency of the pl- skill set.

Standard library only. Run from anywhere:

    python scripts/validate.py      (Windows: py -3 scripts/validate.py)

Exit code 0 when every check passes, 1 otherwise. The rules are documented in
skills/pl-skill-steward/references/conventions.md (marked "validated").
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"
CATALOG = SKILLS_DIR / "pl-skill-steward" / "references" / "catalog.md"
README = ROOT / "README.md"
CHANGELOG = ROOT / "CHANGELOG.md"

NAME_RE = re.compile(r"^pl-[a-z0-9]+(?:-[a-z0-9]+)*$")
SEMVER_RE = re.compile(r"^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$")
CATEGORY_LINE_RE = re.compile(r"^- `([a-z0-9-]+)`")
TABLE_ROW_RE = re.compile(r"^\|\s*`(pl-[a-z0-9-]+)`\s*\|\s*([a-z0-9-]+)\s*\|")
CHANGELOG_HEADING_RE = re.compile(r"^### (pl-[a-z0-9-]+) (\S+)\s*$")
LINK_RE = re.compile(r"\[[^\]]*\]\(([^)\s]+)\)")
SHELL_PLACEHOLDER_RE = re.compile(r"!`[^`\n]+`")

ALLOWED_KEYS = {"name", "description", "license", "compatibility", "metadata"}
REQUIRED_METADATA = {"version", "category", "invocation"}
INVOCATIONS = {"user", "model", "both"}
MAX_NAME = 64
MAX_DESCRIPTION = 1024
MAX_LINES = 500

errors: list[str] = []


def rel(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def fail(path: Path, message: str) -> None:
    errors.append(f"{rel(path)}: {message}")


def without_fences(text: str) -> str:
    """Return text with fenced code blocks removed (examples are not live content)."""
    kept: list[str] = []
    fenced = False
    for line in text.split("\n"):
        if line.lstrip().startswith(("```", "~~~")):
            fenced = not fenced
            continue
        if not fenced:
            kept.append(line)
    return "\n".join(kept)


def section(text: str, heading: str) -> list[str]:
    """Return the lines under '## <heading>' up to the next '## ' heading."""
    lines = text.split("\n")
    try:
        start = lines.index(f"## {heading}") + 1
    except ValueError:
        return []
    out: list[str] = []
    for line in lines[start:]:
        if line.startswith("## "):
            break
        out.append(line)
    return out


def unquote(path: Path, key: str, value: str) -> str:
    if not value.startswith('"'):
        return value
    if len(value) < 2 or not value.endswith('"'):
        fail(path, f"'{key}': unterminated double-quoted value")
        return value.strip('"')
    inner = value[1:-1]
    if '"' in inner:
        fail(path, f"'{key}': double quotes inside the value are not allowed; use single quotes")
    return inner


def parse_frontmatter(path: Path, text: str):
    """Parse the restricted frontmatter format described in conventions.md."""
    if not text.startswith("---\n"):
        fail(path, "must start with a '---' frontmatter line")
        return None
    end = text.find("\n---\n", 3)
    if end == -1:
        fail(path, "frontmatter is not closed with a '---' line")
        return None
    block = text[4:end]
    body = text[end + 5:]
    if not block.isascii():
        fail(path, "frontmatter must be ASCII")

    top: dict[str, str] = {}
    raw: dict[str, str] = {}
    metadata: dict[str, str] = {}
    in_metadata = False
    for number, line in enumerate(block.split("\n"), start=2):
        if not line.strip():
            continue
        if line.startswith(" "):
            if not in_metadata:
                fail(path, f"line {number}: indented line outside 'metadata'")
                continue
            key, sep, value = line.strip().partition(":")
            key, value = key.strip(), value.strip()
            if not sep or not key:
                fail(path, f"line {number}: expected '  key: \"value\"' in 'metadata'")
                continue
            if not (len(value) >= 2 and value.startswith('"') and value.endswith('"')):
                fail(path, f"line {number}: 'metadata.{key}' must be a double-quoted string")
            if key in metadata:
                fail(path, f"line {number}: duplicate 'metadata.{key}'")
            metadata[key] = unquote(path, f"metadata.{key}", value)
            continue
        key, sep, value = line.partition(":")
        key, value = key.strip(), value.strip()
        if not sep or not key:
            fail(path, f"line {number}: expected 'key: value'")
            continue
        if key in top:
            fail(path, f"line {number}: duplicate key '{key}'")
        in_metadata = key == "metadata"
        raw[key] = value
        if in_metadata:
            if value:
                fail(path, "'metadata' must be followed by indented 'key: \"value\"' lines")
            top[key] = ""
        else:
            top[key] = unquote(path, key, value)
    return top, raw, metadata, body


def check_links(md: Path, boundary: Path | None) -> None:
    text = without_fences(md.read_text(encoding="utf-8"))
    for target in LINK_RE.findall(text):
        if target.startswith(("http://", "https://", "mailto:", "#")) or "<" in target:
            continue
        resolved = (md.parent / target.split("#", 1)[0]).resolve()
        if not resolved.exists():
            fail(md, f"broken relative link: {target}")
        elif boundary is not None and boundary != resolved and boundary not in resolved.parents:
            fail(md, f"link leaves the skill folder: {target}")


def check_skill(skill_dir: Path, categories: set[str]):
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.is_file():
        fail(skill_dir, "missing SKILL.md")
        return None

    for nested in skill_dir.rglob("SKILL.md"):
        if nested != skill_md:
            fail(nested, "nested SKILL.md; Kilo would load it as a separate skill")

    for md in skill_dir.rglob("*.md"):
        data = md.read_bytes()
        if data.startswith(b"\xef\xbb\xbf"):
            fail(md, "remove the UTF-8 BOM")
        if b"\r" in data:
            fail(md, "use LF line endings, not CRLF")
        check_links(md, skill_dir.resolve())

    try:
        text = skill_md.read_bytes().decode("utf-8")
    except UnicodeDecodeError:
        fail(skill_md, "must be UTF-8")
        return None
    text = text.replace("\r\n", "\n")
    parsed = parse_frontmatter(skill_md, text)
    if parsed is None:
        return None
    top, raw, metadata, body = parsed

    unknown = sorted(set(top) - ALLOWED_KEYS)
    if unknown:
        fail(skill_md, f"unsupported frontmatter keys: {', '.join(unknown)}")

    name = top.get("name", "")
    if not name:
        fail(skill_md, "missing 'name'")
    else:
        if not NAME_RE.match(name):
            fail(skill_md, f"name '{name}' must match {NAME_RE.pattern}")
        if len(name) > MAX_NAME:
            fail(skill_md, f"name is longer than {MAX_NAME} characters")
        if name != skill_dir.name:
            fail(skill_md, f"name '{name}' must equal the folder name '{skill_dir.name}'")

    description = top.get("description", "")
    if not description:
        fail(skill_md, "missing 'description'")
    else:
        if not raw.get("description", "").startswith('"'):
            fail(skill_md, "description must be a single-line, double-quoted string")
        if len(description) > MAX_DESCRIPTION:
            fail(skill_md, f"description has {len(description)} characters; maximum is {MAX_DESCRIPTION}")

    missing = sorted(REQUIRED_METADATA - set(metadata))
    if "metadata" not in top or missing:
        fail(skill_md, f"metadata must define: {', '.join(sorted(REQUIRED_METADATA))}")
    version = metadata.get("version", "")
    if version and not SEMVER_RE.match(version):
        fail(skill_md, f"metadata.version '{version}' is not SemVer")
    category = metadata.get("category", "")
    if category and category not in categories:
        fail(skill_md, f"metadata.category '{category}' is not in the catalog category list")
    invocation = metadata.get("invocation", "")
    if invocation and invocation not in INVOCATIONS:
        fail(skill_md, f"metadata.invocation must be one of: {', '.join(sorted(INVOCATIONS))}")

    if not body.strip():
        fail(skill_md, "instructions are empty")
    line_count = len(text.split("\n"))
    if line_count >= MAX_LINES:
        fail(skill_md, f"{line_count} lines; move detail into references/ (limit {MAX_LINES})")
    if SHELL_PLACEHOLDER_RE.search(without_fences(body)):
        fail(skill_md, "embedded shell placeholders are not allowed")

    return {"name": skill_dir.name, "category": category, "version": version}


def table_rows(path: Path, lines: list[str], label: str) -> dict[str, str]:
    rows: dict[str, str] = {}
    for line in lines:
        match = TABLE_ROW_RE.match(line)
        if not match:
            continue
        name, category = match.groups()
        if name in rows:
            fail(path, f"{label} lists '{name}' more than once")
        rows[name] = category
    return rows


def compare_table(path: Path, label: str, rows: dict[str, str], skills: dict[str, dict]) -> None:
    for name in sorted(set(skills) - set(rows)):
        fail(path, f"{label} is missing '{name}'")
    for name in sorted(set(rows) - set(skills)):
        fail(path, f"{label} lists '{name}', but skills/{name}/ does not exist")
    for name in sorted(set(rows) & set(skills)):
        if skills[name]["category"] and rows[name] != skills[name]["category"]:
            fail(path, f"{label} gives '{name}' category '{rows[name]}', SKILL.md says '{skills[name]['category']}'")


def main() -> int:
    if not SKILLS_DIR.is_dir():
        print(f"FAIL: {rel(SKILLS_DIR)} does not exist")
        return 1
    if not CATALOG.is_file():
        print(f"FAIL: {rel(CATALOG)} does not exist")
        return 1

    catalog_text = CATALOG.read_text(encoding="utf-8")
    categories = {m.group(1) for line in section(catalog_text, "Categories")
                  if (m := CATEGORY_LINE_RE.match(line))}
    if not categories:
        fail(CATALOG, "no categories found under '## Categories' (lines like '- `id` - ...')")

    skills: dict[str, dict] = {}
    for entry in sorted(SKILLS_DIR.iterdir()):
        if not entry.is_dir():
            fail(entry, "only skill folders are allowed in skills/")
            continue
        info = check_skill(entry, categories)
        if info:
            skills[info["name"]] = info

    compare_table(CATALOG, "catalog skills table",
                  table_rows(CATALOG, section(catalog_text, "Skills"), "catalog skills table"), skills)

    if README.is_file():
        compare_table(README, "README skills table",
                      table_rows(README, README.read_text(encoding="utf-8").split("\n"), "README skills table"),
                      skills)
        check_links(README, None)
    else:
        fail(README, "missing")

    if CHANGELOG.is_file():
        newest: dict[str, str] = {}
        for line in CHANGELOG.read_text(encoding="utf-8").split("\n"):
            match = CHANGELOG_HEADING_RE.match(line)
            if match and match.group(1) not in newest:
                newest[match.group(1)] = match.group(2)
        for name, info in sorted(skills.items()):
            if name not in newest:
                fail(CHANGELOG, f"no '### {name} <version>' entry")
            elif info["version"] and newest[name] != info["version"]:
                fail(CHANGELOG, f"newest entry for '{name}' is {newest[name]}, SKILL.md says {info['version']}")
    else:
        fail(CHANGELOG, "missing")

    if errors:
        print(f"FAIL: {len(errors)} problem(s)")
        for message in errors:
            print(f"  - {message}")
        return 1
    print(f"OK: {len(skills)} skills, {len(categories)} categories; "
          "frontmatter, links, catalog, README, and CHANGELOG are consistent.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
