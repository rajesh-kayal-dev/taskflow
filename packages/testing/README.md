# Shared TaskFlow test utilities

Keep only truly shared helpers here. Service-specific tests stay inside their services.

- `src/factories`: test-data builders.
- `src/fixtures`: stable example values.
- `src/helpers`: reusable helpers.

Configure workspace exports/TypeScript paths in the existing monorepo before importing this package by package name. Relative imports are fine initially.
