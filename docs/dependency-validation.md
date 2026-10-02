# Dependency upgrade checks

Use Node 22.13+ or Node 24+ (the supported engine ranges in
`package.json`). The application and ESLint dependency tree must both support the
selected runtime. `npm ci` installs the reviewed lockfile.
The existing `camera-controls` dependency needs Node 22+, and the upgraded ESLint
toolchain requires at least Node 22.13 on that release line.

Before merging a dependency upgrade, run:

```sh
npm ci
npm run lint
npm test
npm run build
npm run smoke --workspace=vengeanceui
npm run smoke --workspace=vengeanceui-mcp
npm audit
```

## Existing lint debt

The Next.js and TypeScript error-level rules remain enabled. The checked-in
`eslint-suppressions.json` records only the 126 pre-existing errors from `main`
at `2dcdc128b781cebe5d8c502eba610cfc9352a979`, by exact file and rule count.
ESLint automatically reads this file when `npm run lint` runs.

New files and additional violations above a recorded file/rule count fail lint.
Unused suppressions also fail: after fixing old findings, run
`npm run lint -- --prune-suppressions` and commit the reduced baseline. Do not
regenerate or increase it to make new errors pass. The baseline is count-based,
not tied to source locations; reviews must still reject replacing a fixed old
violation with a new one of the same rule in the same file.

Warnings remain visible. This baseline tracks debt; it does not claim those
existing errors were fixed. The regression tests exercise the real ESLint CLI
to ensure new-file violations, increased counts, and stale suppressions fail.

## Published component sources

The source API and component installers use `public/r/*.json`, not the source
files under `src/components/ui`. When changing a published component, update
its embedded registry source too. The calendar regression tests require source
parity and typecheck the installable payload against the locked dependencies.
The calendar declares its Button registry dependency and the supported DayPicker
major using the [registry-item schema](https://ui.shadcn.com/docs/registry/registry-item-json).

Local checks do not replace a successful deployment of the final commit. Resolve
the intended Vercel project's authorization/account failures and exercise its
preview before production rollout. Real payments and production credentials
must be validated separately; local checks must not charge real customers.
