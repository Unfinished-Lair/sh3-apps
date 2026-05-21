# SH3 Apps

## About

Monorepo for SH3 official applications.

## Apps

- [sh3-ai](packages/sh3-ai) — Abstract AI-chat shard; owns the `ai` shell mode, `ai:*` verbs, and the `sh3-ai.provider` contribution point
- [sh3-connector-r2](packages/sh3-connector-r2) — Cloudflare R2 backup connector
- [sh3-diagnostic](packages/sh3-diagnostic) — Diagnostic tool used to debug/develop SH3 apps
- [sh3-editor](docs/sh3-editor/editor.md) — Reusable text editor and object inspector shard
- [sh3-editor-fiddle](docs/sh3-editor-fiddle/inspector-fiddle.md) — Fiddle apps for testing sh3-editor surfaces in isolation
- [sh3-file-explorer](packages/sh3-file-explorer) — Official file explorer for browsing tenant documents
- [sh3-llm-providers](packages/sh3-llm-providers) — Unified LLM provider shard registering DeepSeek + Gemini as `sh3-ai.provider`s
- [sh3-mock](packages/sh3-mock) — SH3 mock application
- [sh3-pipeline](docs/sh3-pipeline/index.md) — Programmatic pipeline runtime and document format
- [sh3-registry](packages/sh3-registry) — Server shard for hosting and managing a package registry
- [sh3-style](packages/sh3-style) — Theme editor shard
- [sh3-sync](packages/sh3-sync) — Hub-and-spoke document sync server shard
