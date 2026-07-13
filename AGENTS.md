# Repository notes

This is the buildless, static GitHub Pages site for `guinn8.ca`. Root `index.html` is a minimal personal landing page. Published tools, presentations, and the archived professional portfolio live under `projects/<slug>/`.

Pushing commits to this repository publishes the site to `guinn8.ca`. Treat pushes as production deployments.

There is no package manager or build step. Preserve the existing `FILENAME:` header-comment convention in HTML, CSS, and JavaScript files.

Each project must be portable and self-contained: expose `index.html` at the project root, keep its assets inside that directory, use relative internal paths, and include `project.json`. Add one entry to `projects/projects.json` to publish it on the projects landing page. This contract also allows a project directory to become a Git submodule later.

Use explicit relative `index.html` links instead of directory-only links so navigation works both from `file://` and GitHub Pages. When adding a project, update both `projects/projects.json` and the static fallback card in `projects/index.html`; browsers commonly block registry `fetch()` when HTML is opened directly from disk. Current projects are `alberta-fish-id`, `ai-talk`, and `portfolio`.

Before publishing, validate JSON and JavaScript, check internal file targets, and exercise representative pages both directly with `file://` and through a local HTTP server. After pushing `master`, allow GitHub Pages a short rebuild interval and verify the production URLs. The public email address is intentionally assembled in JavaScript; do not place the complete address in static HTML.
