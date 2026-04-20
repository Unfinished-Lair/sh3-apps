# sh3-connector-r2

**Version:** 0.1.0
**Status:** end-to-end — requires `sh3-core@^0.9.1` (ships the `documents:read` and `documents:write` permissions this shard needs for foreign-shard content access).

A client shard + app that backs up SH3 documents to a user-owned Cloudflare R2 bucket.

## Install

```bash
npm install sh3-connector-r2
```

Requires `sh3-core@^0.9.1` and `sh3-file-explorer@^0.3.0`.

## Configure

1. Open the R2 Backup app → **Targets** tab → **Add target**.
2. Fill in Cloudflare account id, bucket name, key prefix (e.g. `sh3-laptop/`), and an R2 API token (access key id + secret).
3. Click **Save & validate**. The shard issues a signed `HeadBucket` — success persists the target.
4. If the validation fails with a CORS error, add this rule to your bucket:
   ```json
   {
     "AllowedOrigins": ["<your-SH3-origin>"],
     "AllowedMethods": ["PUT", "GET", "HEAD"],
     "AllowedHeaders": ["*"],
     "ExposeHeaders": ["ETag"]
   }
   ```

## Back up

**Per file / folder:** in the file-explorer, select a file or folder → **Back up to R2** → pick a target.

**Whole scope:** in the R2 Backup app → **Backup** tab → pick target + shard + optional prefix → **Back up now**.

Uploads are append-only: local deletes do not propagate to R2. Use the Cloudflare dashboard or `rclone` to remove objects.

## Import

Open the **Import** tab, pick a target, click **Scan**. The shard paginates the bucket, overlays local-presence badges (locally-existing paths are unchecked by default to protect your current state), and restores selected objects via `ctx.browse.writeTo`.

Binary documents are not yet supported in v0.1.0 — the upload path surfaces a "binary not supported" error and logs the entry as failed.

## Manual QA checklist

Against a real R2 bucket:

- [ ] Create target with valid creds — "Save & validate" succeeds.
- [ ] Create target with bad creds — error surfaced, not persisted.
- [ ] Upload single `.md` file from file-explorer — object appears in R2 dashboard at `<prefix><shardId>/<path>` with content-type `text/markdown`.
- [ ] Upload same file again — toast says "Already up to date"; no new PUT in R2 logs.
- [ ] Upload a folder from file-explorer — all descendants appear with correct key structure.
- [ ] Whole-scope backup from app — Progress shows counts; log table reflects outcomes.
- [ ] Delete a target — local config gone; R2 objects untouched.
- [ ] Install in a second SH3 instance with a different `keyPrefix` on the same bucket — no key collisions.
- [ ] Import tab → Scan → remote tree populated; locally-existing objects show "local" badge and unchecked by default.
- [ ] Import selected objects — objects written to correct `{shardId, path}` via `documents:write`; file-explorer picks them up via `watchDocuments`.

## Architecture

See `docs/superpowers/specs/2026-04-20-sh3-connector-r2-design.md` in the monorepo.
