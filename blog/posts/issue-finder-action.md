# Building `issue-finder`: A Multi-Repo Issue Dashboard Action

Published: `2026-01-19T10:00:00Z`

I built **issue-finder** to solve a simple workflow problem: checking multiple repositories for contribution-ready issues was too repetitive.
The action aggregates issues across repositories and renders a clean dashboard directly in the GitHub Actions summary.

## What it does

- Scans multiple repositories (public or private)
- Filters by one or more labels (for example `good first issue`, `help wanted`)
- Generates a Markdown table in the workflow summary UI
- Uses GitHub CLI under the hood for efficient retrieval

## Why I made it

Project planning and open-source contribution sessions often start with discovery.
Instead of opening tabs and searching one repo at a time, I wanted one scheduled workflow to produce a single, actionable view.

## Example workflow shape

```yaml
name: Contribution Dashboard
on:
  schedule:
    - cron: "0 15 * * *"
  workflow_dispatch:

jobs:
  aggregate:
    runs-on: ubuntu-latest
    steps:
      - name: Fetch issues
        uses: leftkats/issue-finder@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          repositories: |
            - feldroy/air
            - python/pymanager
          labels: |
            - good first issue
            - help wanted
```

## Current status

The project is published as a GitHub Action and is ready to drop into any workflow that needs cross-repository issue aggregation.

Repository: [leftkats/issue-finder](https://github.com/leftkats/issue-finder)
