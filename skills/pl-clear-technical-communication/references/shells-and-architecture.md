# Shell and architecture explanations

## Commands

Identify the environment only to the precision that changes correctness. Windows PowerShell 5.1, PowerShell 7, Bash, zsh, and cmd have different syntax, quoting, and error behavior. A terminal application does not determine which shell it hosts. Do not present Bash syntax as PowerShell syntax.

Explain a command's operation, target, scope, and side effects. Include material prerequisites such as permissions, modules, executable availability, or working directory. State destructive or security-sensitive effects before execution. A dry run can show intended changes, but is not proof that a real operation succeeded.

Example for Windows PowerShell 5.1:

```powershell
Get-ChildItem -LiteralPath 'C:\Logs' -File -Recurse |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) }
```

This lists files under `C:\Logs` whose last-write time is more than 30 days old. It does not delete them, and last-write time is not creation time. The directory must exist and be readable. Do not silently add `Remove-Item` to an explanation-only request.

For execution, check the exit status and relevant postcondition. A command that started a process does not prove that the service is ready. Report failed or partial checks directly.

## Architecture

Start with the system's purpose and relevant boundaries. Identify components, who calls whom, where data lives, and how a request or event moves. Distinguish a logical service from a running process, a container from a virtual machine, and a database from a cache.

Explain trade-offs through mechanisms: a cache can lower database load but can return stale data; a queue separates request handling from later work but introduces delayed processing and retry behavior. State consistency, failure, and security boundaries when they matter. Do not prescribe a technology without the constraints that justify it, or turn every explanation into an architecture redesign.
