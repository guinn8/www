# Repository notes

This is the buildless, static GitHub Pages site for `guinn8.ca`. Root `index.html` is a minimal personal landing page. Published tools, presentations, and the archived professional portfolio live under `projects/<slug>/`.

Pushing commits to this repository publishes the site to `guinn8.ca`. Treat pushes as production deployments.

There is no package manager or build step. Preserve the existing `FILENAME:` header-comment convention in HTML, CSS, and JavaScript files.

Each project must be portable and self-contained: expose `index.html` at the project root, keep its assets inside that directory, use relative internal paths, and include `project.json`. Add one entry to `projects/projects.json` to publish it on the projects landing page. This contract also allows a project directory to become a Git submodule later.
