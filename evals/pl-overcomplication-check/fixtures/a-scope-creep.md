# Fixture A: scope creep (Shiny CSV export)

**User:** Add a "Download CSV" button to the results table in our Shiny app. It should export the rows that are currently filtered.

**Agent:** Done. I added the button and a download handler that writes the filtered rows. To make this extensible, I also created an `R/exporters/` module with a registry so new formats can be plugged in, added Excel and Parquet exporters, a YAML file `inst/export.yml` for column mappings, and an options dialog for delimiter and encoding. I added 14 tests in `tests/testthat/test-exporters.R`.

**User:** The Excel export fails on Windows.

**Agent:** Fixed. I added a fallback from `writexl` to `openxlsx` and a format-detection layer that picks the available writer at run time.

**User:** Now the app can't find the config file on the server.

**Agent:** Fixed. I added a config search path (working directory, package `inst/`, then `~/.config`) and an environment variable override, `APP_EXPORT_CONFIG`.

**User:** This feels like a lot. Are we overdoing this?

---

Changed files (from `git diff --stat` against the task's start commit):

```text
app/ui.R                          |   6 +
app/server.R                      |  41 +
R/exporters/registry.R            |  58 +
R/exporters/csv.R                 |  22 +
R/exporters/excel.R               |  47 +
R/exporters/parquet.R             |  25 +
R/config.R                        |  63 +
inst/export.yml                   |  18 +
tests/testthat/test-exporters.R   | 212 +
DESCRIPTION                       |   5 +-   (adds writexl, openxlsx, arrow, yaml)
```
