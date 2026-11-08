# Project archive refresh, November 8, 2026

## Scope and ordering

Add LegacyDiff and AWS Hack26, refresh Frontend Lab as Studio, and exclude Orbital Sandbox at the owner's request. Rank additions by demonstrated portfolio strength, not repository recency. This is an editorial placement against the existing archive, not a fresh audit of all existing repositories.

- LegacyDiff: third, after Aletheia and Atlas, before Vision Lock (`order: 25`). Its combination of actual execution, evidence, collaborative authorization, immutable review decisions, and portable acceptance checks earns a high placement. Keep `strong` priority and the local-demo boundary; do not claim a deployed production platform.
- AWS Hack26: eleventh, after Northstar and before Beyond Chat (`order: 95`). Reproducible ML selection and a persistent technician-review workflow give it more concrete implementation evidence than the existing Beyond Chat draft entry. Synthetic data, simulated operations, and team attribution limit the claims.
- Studio retains its existing placement, stable record ID, and `/projects/frontend-lab` route so existing links continue working. Update display name, stack, description, and repository/live links. Remove the old gallery screenshot from the record because it no longer represents the current gallery; preserve the file on disk.
- Both additions use the shared archive/detail model. They are featured and eligible for random discovery. No new layouts, dependencies, or database writes are included.

## Thumbnail follow-up

The owner requested strong representative thumbnails before the authorized commit, push, and deployment, specifically suggesting LegacyDiff's orchestration view.

- LegacyDiff: `public/media/projects/legacydiff/orchestration.webp`, 1440 by 775, 60,660 bytes. Cropped from tracked `legacydiff/docs/images/lab.png` to focus on the orchestrator, Behavior/Policy/Regression specialists, connections, and human-review destination. The local backend was disconnected during this task, so this is explicitly a recorded synthetic comparison, not a new live inference run.
- AWS Hack26: `public/media/projects/aws-hack26/technician-console.webp`, 1024 by 741, 65,816 bytes. Optimized from tracked `aws-hack26/docs/assets/presentation-machine.png`; original illustrative machining cell and evidence panel, not industrial telemetry.
- Studio: `public/media/projects/studio/gallery.webp`, 1265 by 712, 51,206 bytes. Fresh public-gallery screenshot captured in Codex's in-app browser, replacing the obsolete Frontend Lab image.
- Existing card rendering is unchanged. Alt text and source notes are in the typed project model. Only optimized WebP outputs are included.

## Evidence inspected

### LegacyDiff

Public main and the local tracked checkout both resolved to `7e46afcc0aad22b9d9a1d4bbcde65362d26ca3e0` during review. Untracked videos and notes were left untouched and were not used as public evidence.

- [README](https://github.com/YuvrajKashyap/legacydiff/blob/7e46afcc0aad22b9d9a1d4bbcde65362d26ca3e0/README.md): four synthetic scenarios, review flow, exports, and local-only scope.
- [Architecture](https://github.com/YuvrajKashyap/legacydiff/blob/7e46afcc0aad22b9d9a1d4bbcde65362d26ca3e0/docs/ARCHITECTURE.md): membership, versioned decisions, worker leases, and bounded tools.
- Implementation inspected: `backend/runner/core.py`, `backend/ai/suite-investigation.ts`, `backend/database/spacetimedb/src/access.ts`, and `reviews.ts`.
- Tests inspected: `tests/review.test.ts` and `tests/python/test_export_integrity.py`; recorded broader results in `docs/VERIFICATION.md`. Historical results are repository evidence, not tests rerun in this website task.
- Limits: reviewed fixtures only, reduced isolation, no arbitrary repository ingestion or public application deployment, AI findings remain advisory.

### AWS Hack26

Public main resolved to `10c169d4d59660c0669c3fb26c1f65da03351344`. The local checkout was older (`2f593af9bf31b3852fce74bf9d8019b9ffbad698`), so current policy/review code and integration boundaries were also read through GitHub at the pinned public commit. The checkout and its untracked file were not modified.

- [README](https://github.com/YuvrajKashyap/aws-hack26/blob/10c169d4d59660c0669c3fb26c1f65da03351344/README.md): technician console, model lab, and simulated actions.
- [Policy implementation](https://github.com/YuvrajKashyap/aws-hack26/blob/10c169d4d59660c0669c3fb26c1f65da03351344/src/policy.py): training/validation separation, fixed search grids, model-specific identity.
- [Review implementation](https://github.com/YuvrajKashyap/aws-hack26/blob/10c169d4d59660c0669c3fb26c1f65da03351344/src/review.py): SQLite persistence, simulated-order constraint, version checks, event history.
- [Integration review](https://github.com/YuvrajKashyap/aws-hack26/blob/10c169d4d59660c0669c3fb26c1f65da03351344/docs/pr-review-deadline.md): team contributions, deferred prototypes, and no autonomous agent crew in the active app.
- Local supporting inspection: `docs/model-comparison.md`, `tests/test_policy.py`, `tests/test_review.py`, and `docs/verification.md`. No AWS inference or benchmark rerun was performed.
- Limits: synthetic AI4I data, exploratory test comparisons, no industrial validation, calibrated failure probabilities, RUL, or real operational actions.

### Studio

- [Current README](https://github.com/YuvrajKashyap/studio/blob/main/README.md): Next.js gallery, independent Vite projects, source/static-site downloads, licensing boundaries.
- `https://studio.yuvrajkashyap.com` loaded in Codex's in-app browser with Studio branding, the public repository link, and the live gallery. The earlier web-fetch failure was not treated as proof that the site was unavailable.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check` passed. Build generated 42 static pages, including the new project routes. Next.js reported its edge-runtime/static-generation informational warning.
- Codex in-app browser loaded the local `/projects` archive: 20 records, LegacyDiff third, AWS Hack26 eleventh, Studio seventeenth; the new entries also appear in Featured Work.
- Both new detail routes rendered their descriptions and boundaries. AWS Hack26 displayed team attribution and simulated-action limitations.
- `/projects/frontend-lab` rendered Studio with the updated live and repository links.
- LegacyDiff was inspected in dark and light themes. Its 390px mobile viewport had no horizontal page overflow. No layout or styling code changed; a full responsive or accessibility audit was not repeated.
- Studio's actual public gallery loaded successfully. No source-project test results are claimed as freshly reproduced, and no production website deployment was performed.
