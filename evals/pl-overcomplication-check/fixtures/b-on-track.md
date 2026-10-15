# Fixture B: on track (fread migration)

**User:** Migrate our package's three data-reading functions from `read.csv` to `data.table::fread`. Keep the outputs identical, and add one test per function that compares old and new output on the files in `tests/testthat/fixtures`. Do not change function signatures.

**Agent:** Done. `read_survey()`, `read_weights()`, and `read_codes()` now use `fread` with `colClasses` that match the old column types. I added three tests that compare the new output with RDS snapshots of the old output, and added `data.table` to `Imports`. One test failed at first because `fread` treats the string "NA" differently; I set `na.strings = c("", "NA")` to match `read.csv`. All tests pass.

**User:** Can you check that we didn't overcomplicate this?

---

Changed files (from `git diff --stat` against the task's start commit):

```text
R/read_survey.R                        |  4 +-
R/read_weights.R                       |  4 +-
R/read_codes.R                         |  4 +-
tests/testthat/test-readers.R          | 36 +
tests/testthat/fixtures/old-*.rds      |  3 binary files
DESCRIPTION                            |  1 +
```
