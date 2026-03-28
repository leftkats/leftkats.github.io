# BigQuery UI + CLI Playbook: Faster Queries, Lower Cost

Published: `2026-03-01T09:30:00Z`

BigQuery is fast, but cost and performance still depend on query design.
This playbook focuses on practical habits for daily analytics work in both UI and CLI.

## Recommended workflow first

```bash
bq show --schema --format=prettyjson project:analytics.events
```

Start by inspecting schema, then build a minimal query, run a dry run, and execute only when bytes are acceptable.

## Core rules that save money

- Avoid `SELECT *` on large tables
- `LIMIT` usually does **not** reduce scanned bytes
- Always run a dry run before expensive queries
- Filter early (especially time and partition predicates)
- Join only required columns and keys

## Example 1: dry run before execution

```bash
bq query --use_legacy_sql=false --dry_run '
SELECT
  event_id,
  user_id,
  event_timestamp
FROM `project.analytics.events`
WHERE event_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
'
```

Dry runs are a low-friction way to validate cost before execution.

## Example 2: deduplication with partition + `QUALIFY`

```sql
SELECT
  event_id,
  user_id,
  event_name,
  event_timestamp,
  updated_at
FROM `project.analytics.events`
WHERE event_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
QUALIFY ROW_NUMBER() OVER (
  PARTITION BY event_id
  ORDER BY updated_at DESC
) = 1;
```

Why this pattern is useful:

- Keeps only the latest row per logical key (`event_id`)
- Uses the window function directly with `QUALIFY` (no extra subquery)
- Works great for CDC-style tables and late updates

## Example 3: partition-aware filtering

```sql
SELECT
  event_name,
  COUNT(*) AS occurrences
FROM `project.analytics.events_partitioned`
WHERE _PARTITIONDATE BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY) AND CURRENT_DATE()
GROUP BY event_name
ORDER BY occurrences DESC;
```

When a table is partitioned, explicit partition filters help avoid unnecessary scans.

## Handy CLI snippets

```bash
bq ls
```

```bash
bq show --schema --format=prettyjson project:dataset.table
```

```bash
bq --format=prettyjson show -j JOB_ID
```

```bash
bq extract \
  --destination_format=CSV \
  --field_delimiter=',' \
  --print_header=true \
  project:dataset.table gs://bucket/path/results-*.csv
```

## Time travel for recovery / audits

```sql
SELECT *
FROM `project.analytics.events`
FOR SYSTEM_TIME AS OF TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR);
```

## UI tips that are actually useful

- Use query validator + processed bytes estimate before run
- Keep saved queries for repeated investigations
- Check execution details and stages when a query is unexpectedly slow

## Visualization tools worth using

- **BigQuery Geo Viz** is handy for quick map-based analysis directly from SQL query output (great for geospatial checks and fast validation)
- **BqViz** is useful for visually understanding query structure and complexity when optimizing large SQL scripts

## Architecture constraints to remember

- Cross-region joins are not supported directly
- Copy data to the same region before joining
- Partitioning + clustering strategy often beats micro-optimizing SQL syntax

## Practical checklist

1. Preview schema/data quickly (UI preview or `bq show`)
2. Write minimal column query with strict filters
3. Add partition/date filters as early as possible
4. Dry-run to estimate processed bytes
5. Execute and inspect query stages / job stats
6. Materialize only when needed

This sequence keeps BigQuery usage predictable, faster, and cheaper for day-to-day analytics.
