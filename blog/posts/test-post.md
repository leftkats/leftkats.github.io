# JSON to NDJSON in One Command

Published: `2025-11-07T09:00:00Z`

When you need to process large JSON arrays one record at a time, **NDJSON** is usually the easiest format to work with.
Each line is a valid JSON value, which makes streaming and ingestion pipelines simpler.

## Why NDJSON

- Each line is an independent JSON object
- Easy to append, stream, and process incrementally
- Works well with data ingestion tools

## Quick conversion

```bash
cat test.json | jq -c '.[]' > testNDJSON.json
```

This command reads an array from `test.json` and writes one compact JSON object per line into `testNDJSON.json`.

## Notes

- `jq` is a lightweight and flexible CLI JSON processor
- This pattern is useful when downstream systems expect newline-delimited records
