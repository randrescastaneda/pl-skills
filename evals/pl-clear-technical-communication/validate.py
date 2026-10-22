"""Validate the skill's format and evaluation fixtures without changing them."""

import json
import re
from pathlib import Path

import yaml


def main():
    evals_dir = Path(__file__).resolve().parent
    root = evals_dir.parents[1] / "skills" / evals_dir.name
    raw = (root / "SKILL.md").read_bytes()
    assert not raw.startswith(b"\xef\xbb\xbf"), "SKILL.md must not have a BOM"
    assert b"\r" not in raw, "SKILL.md must use LF line endings"
    text = raw.decode("utf-8")
    match = re.match(r"\A---\n(.*?)\n---\n(.*)\Z", text, re.DOTALL)
    assert match, "YAML frontmatter is missing"
    frontmatter, body = match.groups()
    assert frontmatter.isascii(), "Frontmatter must be ASCII"
    data = yaml.safe_load(frontmatter)
    assert isinstance(data, dict), "Frontmatter must be a mapping"
    allowed = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
    assert set(data) <= allowed, "Unsupported portable frontmatter field"
    name = data.get("name", "")
    assert isinstance(name, str) and re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name)
    assert 1 <= len(name) <= 64 and name == root.name, "Invalid skill name"
    description = data.get("description", "")
    assert isinstance(description, str) and 1 <= len(description) <= 1024
    assert re.search(r'^description: ".*"$', frontmatter, re.MULTILINE)
    assert all(isinstance(key, str) and isinstance(value, str)
               for key, value in data.get("metadata", {}).items())
    assert len(text.splitlines()) < 500, "Move extended material into references"
    assert body.strip(), "Skill instructions are empty"
    assert not re.search(r"!`[^`]+`", body), "Communication skill must not execute embedded commands"

    references = re.findall(r"\]\((references/[^)]+)\)", body)
    assert len(set(references)) >= 5, "Expected the core modular references"
    assert len(references) == len(set(references)), "Reference routes must be unique"
    for reference in references:
        assert (root / reference).is_file(), f"Missing reference: {reference}"

    cases = json.loads((evals_dir / "cases.json").read_text(encoding="utf-8"))
    assert len(cases) >= 12
    assert len({case["id"] for case in cases}) == len(cases), "Case IDs must be unique"
    for case in cases:
        assert isinstance(case["technical"], bool)
        assert case["turns"] and all(isinstance(turn, str) and turn for turn in case["turns"])
        assert case["criteria"], f"Missing criteria: {case['id']}"
    assert any(not case["technical"] for case in cases), "No nontechnical negative test"
    assert any(case.get("implementation") for case in cases), "No implementation test"
    assert any(len(case["turns"]) > 1 for case in cases), "No actual follow-up test"
    assert all("clear-technical-communication" not in turn
               for case in cases for turn in case["turns"]), "Test prompts must not cue invocation"

    handoff_file = evals_dir / "handoff-cases.json"
    assert handoff_file.is_file(), "The handoff suite is required"
    handoff_cases = json.loads(handoff_file.read_text(encoding="utf-8"))
    expected_ids = {
        "h01-pilot-needs-message", "h02-verified-continuation", "h03-review-gate",
        "h04-explicit-approval", "h05-new-session-prompt", "h06-access-action",
        "h07-optional-review", "h08-complete-no-handoff", "h09-review-then-approve",
        "h10-spanish-handoff", "h11-nontechnical-review", "h12-unknown-continuation",
    }
    allowed_states = {"user-message", "automatic", "review", "approval", "new-session",
                      "access", "optional", "complete", "ordered-user-actions", "missing-context"}
    assert expected_ids <= {case["id"] for case in handoff_cases}, "Required handoff coverage is missing"
    assert len({case["id"] for case in handoff_cases}) == len(handoff_cases)
    for case in handoff_cases:
        assert isinstance(case["technical"], bool) and case["criteria"]
        assert isinstance(case["turns"], list) and case["turns"], "Turns must be a nonempty list"
        assert all(isinstance(turn, str) and turn.strip() for turn in case["turns"])
        assert all("clear-technical-communication" not in turn for turn in case["turns"])
        assert case.get("handoffState") in allowed_states, "Invalid handoff state"
        for fixture_name, content in case.get("fixtures", {}).items():
            assert fixture_name not in {"", ".", ".."} and Path(fixture_name).name == fixture_name and isinstance(content, str), "Invalid fixture"

    json_files = list(evals_dir.rglob("*.json"))
    for file in json_files:
        json.loads(file.read_text(encoding="utf-8"))

    print(json.dumps({
        "format": "PASS",
        "yaml_parser": f"PyYAML {yaml.__version__}",
        "name": name,
        "description_characters": len(description),
        "skill_lines": len(text.splitlines()),
        "references": len(set(references)),
        "evaluation_cases": len(cases),
        "handoff_cases": len(handoff_cases),
        "json_artifacts_checked": len(json_files),
        "gaps": "Schema validation does not prove model behavior; run the live suite separately.",
    }, indent=2))


if __name__ == "__main__":
    main()
